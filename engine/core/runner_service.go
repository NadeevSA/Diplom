package core

import (
	"context"
	"engine_app/database/model"
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

func (b *Builder) BuildImage(projectName, buildCommand, runFile, pathToEntry, dir string) error {
	err := b.ContainerDelete(projectName)
	_, err = RemoveImage(b.Cli, b.Ctx, projectName)
	var buildArgs = map[string]*string{
		"BUILD_COMMAND": &buildCommand,
		"RUN_FILE":      &runFile,
	}
	err = BuildImage(b.Cli, b.Ctx, "\\"+dir+"\\"+pathToEntry, projectName, buildArgs)
	if err != nil {
		return err
	}
	return nil
}

func (b *Builder) ContainerCreate(imageName, executableFile string) (container.ContainerCreateCreatedBody, error) {
	cmd := fmt.Sprintf("/app/%s", executableFile)
	resp, err := b.Cli.ContainerCreate(b.Ctx, &container.Config{
		Image:        imageName,
		Cmd:          []string{cmd},
		AttachStderr: true,
		AttachStdin:  true,
		Tty:          true,
		AttachStdout: true,
		OpenStdin:    true,
	}, nil, nil, nil, imageName)
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

func (b *Builder) HandleBuild(projectConfig model.ProjectConfig, writer http.ResponseWriter) {
	err := CopyBytesFromProject(projectConfig.File, projectConfig.ProjectFile, "temp")
	if err != nil {
		writer.Write([]byte("can not preload project"))
		writer.WriteHeader(500)
		return
	}

	err = UnzipSource("temp\\"+projectConfig.ProjectFile, "temp")
	if err != nil {
		writer.Write([]byte("can not unzip"))
		writer.WriteHeader(500)
		return
	}
	err = RemoveFile("temp\\" + projectConfig.ProjectFile)
	if err != nil {
		writer.Write([]byte("clean space error"))
		writer.WriteHeader(500)
		return
	}

	defer func() {
		projectDirName := strings.Split(projectConfig.ProjectFile, ".")[0]
		err := RemoveDir("temp", projectDirName)
		if err != nil {
			writer.Write([]byte("clean space error"))
			writer.WriteHeader(500)
			return
		}
	}()

	_, err = CopyFile("dockerfiles\\go.Dockerfile", "\\temp"+"\\"+projectConfig.PathToEntry, "Dockerfile", 20)
	if err != nil {
		writer.Write([]byte("can not copy"))
		writer.WriteHeader(500)
		return
	}

	err = b.BuildImage(projectConfig.Name, projectConfig.BuildCommand, projectConfig.RunFile, projectConfig.PathToEntry, "temp")
	if err != nil {
		writer.Write([]byte("error building project"))
		writer.WriteHeader(500)
		return
	}

	writer.Write([]byte("build completed"))
}

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
