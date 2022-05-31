package core_tests

import (
	"context"
	"engine_app/core"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
	"io"
	"log"
	"os"
	"testing"
)

var cli *client.Client
var ctx context.Context
var builder core.Builder

func init() {
	ctx = context.Background()
	cli, _ = client.NewClientWithOpts()
	builder = core.Builder{
		Cli: cli,
		Ctx: ctx,
	}
}

func Test_BuildImage(t *testing.T) {
	buildCommand := "go build -o main ."
	runFile := "main"
	pathToEntry := "app1"

	buildArgs := map[string]*string{
		"BUILD_COMMAND": &buildCommand,
		"RUN_FILE":      &runFile,
	}

	_, err := core.RemoveImage(cli, ctx, "summer")
	err = core.BuildImage(cli, ctx, "\\projects"+"\\"+pathToEntry, "summer", buildArgs)
	if err != nil {
		t.Fatal(err)
	}
}

func Test_CanCreateContainer(t *testing.T) {
	resp, err := builder.ContainerCreate("summer", "summer")
	if err != nil {
		t.Fatal(err)
	} else {
		t.Log(resp.ID)
	}
}

func Test_CanRunAndAttachContainer(t *testing.T) {
	res, err := cli.ImageList(ctx, types.ImageListOptions{
		All:     false,
		Filters: filters.Args{},
	})
	log.Println(res)
	err = builder.ContainerRun("summer")
	if err != nil {
		t.Fatal(err)
	}
	waiter, err := builder.ContainerAttach("summer")

	go io.Copy(os.Stdout, waiter.Reader)
	go io.Copy(os.Stderr, waiter.Reader)

	if err != nil {
		panic(err)
	}

	waiter.Conn.Write(append([]byte("6\n")))
	waiter.Conn.Write(append([]byte("8\n")))
}

func Test_CanDeleteContainer(t *testing.T) {
	err := builder.ContainerDelete("summer")
	if err != nil {
		t.Fatal(err)
	}
}

func Test_DeleteImage(t *testing.T) {
	res, err := core.RemoveImage(cli, ctx, "summer")
	if err != nil {
		t.Log(err)
	} else {
		t.Log(res)
	}
}

func Test_CanDeletePackage(t *testing.T) {
	err := core.RemoveAllInDir("temp")
	if err != nil {
		t.Fatal(err)
	}
}

func Test_CanFindContainer(t *testing.T) {
	isWorking, err := builder.CheckIfContainerWorking("my_app16")
	if err != nil {
		t.Fatal(err)
		return
	}
	log.Println(isWorking)
}
