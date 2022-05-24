package core_tests

import (
	"engine_app/core"
	"io"
	"os"
	"testing"
)

func Test_BuildC_SharpApp(t *testing.T) {

	buildCommand := "dotnet restore"
	runFile := "app.dll"
	pathToEntry := "c#_app\\app"

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

func Test_CanCreateC_SharpContainer(t *testing.T) {
	resp, err := builder.ContainerCreate("summer", "summer")
	if err != nil {
		t.Fatal(err)
	} else {
		t.Log(resp.ID)
	}
}

func Test_CanRunAndAttachC_SharpContainer(t *testing.T) {
	err := builder.ContainerRun("summer")
	if err != nil {
		t.Fatal(err)
	}
	waiter, err := builder.ContainerAttach("summer")

	go io.Copy(os.Stdout, waiter.Reader)
	go io.Copy(os.Stderr, waiter.Reader)

	if err != nil {
		panic(err)
	}

	waiter.Conn.Write(append([]byte("Andrew\n")))
	waiter.Conn.Write(append([]byte("4\n")))
	waiter.Conn.Write(append([]byte("8\n")))
	waiter.Conn.Write(append([]byte("10\n")))
}

func Test_DeleteC_SharpContainer(t *testing.T) {
	err := builder.ContainerDelete("summer")
	if err != nil {
		t.Fatal(err)
	}
}
