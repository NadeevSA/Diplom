package core

import (
	"archive/zip"
	"context"
	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/archive"
	"io"
	"io/ioutil"
	"log"
	"os"
	"path"
	"path/filepath"
	"strings"
)

func UnzipSource(source, destination string) error {
	CreateDirIfNotExist(source)
	reader, err := zip.OpenReader(source)
	if err != nil {
		return err
	}
	defer reader.Close()

	destination, err = filepath.Abs(destination)
	if err != nil {
		return err
	}

	for _, f := range reader.File {
		err := unzipFile(f, destination)
		if err != nil {
			return err
		}
	}

	return nil
}

func unzipFile(f *zip.File, destination string) error {
	// 4. Check if file paths are not vulnerable to Zip Slip
	filePath := filepath.Join(destination, f.Name)
	if !strings.HasPrefix(filePath, filepath.Clean(destination)+string(os.PathSeparator)) {
		return fmt.Errorf("invalid file path: %s", filePath)
	}

	// 5. Create directory tree
	if f.FileInfo().IsDir() {
		if err := os.MkdirAll(filePath, os.ModePerm); err != nil {
			return err
		}
		return nil
	}

	if err := os.MkdirAll(filepath.Dir(filePath), os.ModePerm); err != nil {
		return err
	}

	// 6. Create a destination file for unzipped content
	destinationFile, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
	if err != nil {
		return err
	}
	defer destinationFile.Close()

	// 7. Unzip the content of a file and copy it to the destination file
	zippedFile, err := f.Open()
	if err != nil {
		return err
	}
	defer zippedFile.Close()

	if _, err := io.Copy(destinationFile, zippedFile); err != nil {
		return err
	}
	return nil
}

func CopyFile(src, dst, useFile string, BUFFERSIZE int64) (string, error) {
	cureDir, _ := os.Getwd()
	sourceFileStat, err := os.Stat(cureDir + "\\" + src)
	if err != nil {
		return "", err
	}

	if !sourceFileStat.Mode().IsRegular() {
		return "", fmt.Errorf("%s is not a regular file.", src)
	}

	source, err := os.Open(cureDir + "\\" + src)
	if err != nil {
		return "", err
	}
	defer source.Close()

	destination, err := os.Create(cureDir + "\\" + dst + "\\" + useFile)
	if err != nil {
		return "", err
	}
	defer destination.Close()

	if err != nil {
		return "", err
	}

	buf := make([]byte, BUFFERSIZE)
	for {
		n, err := source.Read(buf)
		if err != nil && err != io.EOF {
			return "", err
		}
		if n == 0 {
			break
		}

		if _, err := destination.Write(buf[:n]); err != nil {
			return "", err
		}
	}
	return cureDir + "\\" + dst + "\\" + useFile, err
}

func BuildImage(
	cli *client.Client,
	context context.Context,
	src,
	name string,
	buildArgs map[string]*string) error {

	path, err := os.Getwd()
	dockerBuildContext, err := archive.TarWithOptions(path+src, &archive.TarOptions{})
	if err != nil {
		log.Fatal(err)
		return err
	}

	defer dockerBuildContext.Close()

	buildOptions := types.ImageBuildOptions{
		PullParent:  true,
		Tags:        []string{name},
		Dockerfile:  "Dockerfile",
		BuildArgs:   buildArgs,
		Remove:      true,
		ForceRemove: true,
	}

	buildResp, err := cli.ImageBuild(context, dockerBuildContext, buildOptions)
	if err != nil {
		fmt.Println(err)
		return err
	}
	defer buildResp.Body.Close()
	if err != nil {
		log.Fatal(err, " :unable to build docker image")
		return err
	}
	_, err = io.Copy(os.Stdout, buildResp.Body)
	if err != nil {
		log.Fatal(err, " :unable to read image build response")
		return err
	}
	return nil
}

func RemoveImage(cli *client.Client, ctx context.Context, tags string) ([]types.ImageDeleteResponseItem, error) {
	items, err := cli.ImageRemove(ctx, tags, types.ImageRemoveOptions{
		Force:         true,
		PruneChildren: true,
	})
	return items, err
}

func RemoveAllInDir(dirPath string) error {
	p, err := os.Getwd()
	dir, err := ioutil.ReadDir(p + "\\" + dirPath)
	if err != nil {
		return err
	}
	for _, d := range dir {
		err = os.RemoveAll(path.Join([]string{dirPath, d.Name()}...))
		if err != nil {
			return err
		}
	}
	return nil
}

func ReadFile(path string) ([]byte, error) {
	curPath, _ := os.Getwd()
	bytes, err := os.ReadFile(curPath + "\\" + path)
	if err != nil {
		return nil, err
	}

	return bytes, nil
}

func WriteFile(filepath string, resBytes []byte) error {
	curPath, _ := os.Getwd()
	err := ioutil.WriteFile(curPath+"\\"+filepath, resBytes, os.ModePerm)
	return err
}

func CreateDirIfNotExist(dir string) {
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		err = os.Mkdir(dir, os.ModePerm)
	}
}

func CopyBytesToFile(bytes []byte, name string, dirName string) error {
	cureDir, _ := os.Getwd()
	if _, err := os.Stat(cureDir + "\\" + dirName); os.IsNotExist(err) {
		os.Mkdir(dirName, os.ModePerm)
	}

	destination, _ := os.Create(cureDir + "\\" + dirName + "\\" + name)
	defer func(destination *os.File) {
		err := destination.Close()
		if err != nil {
			log.Fatal(err)
		}
	}(destination)

	_, err := destination.Write(bytes)
	return err
}

func RemoveFile(filepath string) error {
	p, _ := os.Getwd()
	e := os.Remove(p + "\\" + filepath)
	return e
}

func RemoveDir(path, dirName string) error {
	currentPath, _ := os.Getwd()
	err := os.RemoveAll(currentPath + "\\" + path + "\\" + dirName)
	return err
}
