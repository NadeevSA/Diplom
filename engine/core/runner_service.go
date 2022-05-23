package core

import (
	"context"
	"engine_app/database/model"
	"errors"
	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
	"net/http"
	"strings"
)

type Builder struct {
	Cli *client.Client
	Ctx context.Context
}

func (b *Builder) BuildImage(projectName, buildCommand, runFile, pathToEntry, tempDir string) error {
	err := b.ContainerDelete(projectName)
	_, err = RemoveImage(b.Cli, b.Ctx, projectName)
	var buildArgs = map[string]*string{
		"BUILD_COMMAND": &buildCommand,
		"RUN_FILE":      &runFile,
	}
	err = BuildImage(b.Cli, b.Ctx, "\\"+tempDir+"\\"+pathToEntry, projectName, buildArgs)
	if err != nil {
		return err
	}
	return nil
}

func (b *Builder) ContainerCreate(imageName, executableFile, containerName string) (container.ContainerCreateCreatedBody, error) {
	cmd := fmt.Sprintf("/app/%s", executableFile)
	resp, err := b.Cli.ContainerCreate(b.Ctx, &container.Config{
		Image:        imageName,
		Cmd:          []string{cmd},
		AttachStderr: true,
		AttachStdin:  true,
		Tty:          true,
		AttachStdout: true,
		OpenStdin:    true,
	}, nil, nil, nil, containerName)
	return resp, err
}

func (b *Builder) ContainerRun(tag string) error {
	if err := b.Cli.ContainerStart(b.Ctx, tag, types.ContainerStartOptions{}); err != nil {
		return err
	} else {
		return nil
	}
}

func (b *Builder) ContainerAttach(tag string) (types.HijackedResponse, error) {
	waiter, err := b.Cli.ContainerAttach(b.Ctx, tag, types.ContainerAttachOptions{
		Stream: true,
		Stdin:  true,
		Stdout: true,
		Stderr: true,
		Logs:   true,
	})

	return waiter, err
}

func (b *Builder) ContainerDelete(tag string) error {
	return b.Cli.ContainerRemove(b.Ctx, tag, types.ContainerRemoveOptions{
		RemoveVolumes: true,
		Force:         true,
	})
}

func (b *Builder) HandleBuild(
	projectConfig model.ProjectConfig,
	writer http.ResponseWriter,
	dockerConfig model.DockerConfig,
	tempDir string) {

	/*step 1: create file*/
	err := CopyBytesToFile(projectConfig.File, projectConfig.ProjectFile, tempDir)
	if err != nil {
		writer.Write([]byte("can not preload project"))
		writer.WriteHeader(500)
		return
	}

	/*step 2: unzip*/
	err = UnzipSource("temp\\"+projectConfig.ProjectFile, tempDir)
	if err != nil {
		writer.Write([]byte("can not unzip"))
		writer.WriteHeader(500)
		return
	}

	/*step 3: remove zip*/
	err = RemoveFile("temp\\" + projectConfig.ProjectFile)
	if err != nil {
		writer.Write([]byte("clean space error"))
		writer.WriteHeader(500)
		return
	}

	defer func() {
		projectDirName := strings.Split(projectConfig.ProjectFile, ".")[0]
		err := RemoveDir(tempDir, projectDirName)
		if err != nil {
			writer.Write([]byte("clean space error"))
			writer.WriteHeader(500)
			return
		}
	}()

	err = WriteFile(tempDir+"\\"+projectConfig.PathToEntry+"\\"+"Dockerfile", dockerConfig.File)
	if err != nil {
		writer.Write([]byte("project path error"))
		writer.WriteHeader(500)
		return
	}

	/*step 5: build image*/
	err = b.BuildImage(projectConfig.Name, projectConfig.BuildCommand, projectConfig.RunFile, projectConfig.PathToEntry, tempDir)
	if err != nil {
		writer.Write([]byte("error building project"))
		writer.WriteHeader(500)
		return
	}

	writer.Write([]byte("build completed"))
}

var errNoContainer = errors.New("no such container")

func (b *Builder) FindContainer(tag string) (*types.Container, error) {
	opts := types.ContainerListOptions{All: true}
	opts.Filters = filters.NewArgs(filters.KeyValuePair{
		Key:   "name",
		Value: tag,
	})
	cont, err := b.Cli.ContainerList(b.Ctx, opts)
	if err != nil {
		return nil, err
	}
	if len(cont) == 0 {
		return nil, errNoContainer
	}

	return &cont[0], nil
}

func (b *Builder) CheckIfContainerWorking(tag string) (bool, error) {
	cont, err := b.FindContainer(tag)
	if err != nil {
		return false, err
	}

	status := strings.Split(cont.Status, " ")[0]
	if status != "Up" {
		return false, nil
	}
	return true, nil
}
