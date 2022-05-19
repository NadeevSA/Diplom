package controllers

import (
	"engine_app/core"
	"engine_app/database/model"
	"engine_app/filters"
	"engine_app/providers"
	"fmt"
	"net/http"
	"time"

	"github.com/docker/docker/api/types"
)

type BuilderController struct {
	Provider *providers.Provider
	Builder  *core.Builder
}

func (b *BuilderController) BuildProjectDoc(
	writer http.ResponseWriter,
	request *http.Request) {
	projectConfigId := request.Header.Get("projectConfigId")

	var projectConfigs []model.ProjectConfig
	filter := filters.FilterBy{
		Field: "id",
		Args:  []string{projectConfigId},
	}

	err := b.Provider.QueryListStatement(&projectConfigs, filter)
	if err != nil {
		writer.Write([]byte("can not find project config"))
		return
	}

	if len(projectConfigs) == 0 {
		writer.Write([]byte("No such config"))
		return
	}

	projectConfig := projectConfigs[0]
	if projectConfig.File == nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	b.Builder.HandleBuild(projectConfig, writer, "temp")

	projectConfig.Status = model.Status(1)
	err = b.Provider.UpdateStatement(projectConfig)

	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
}

func (b *BuilderController) RunProjectDoc(
	writer http.ResponseWriter,
	request *http.Request) {
	var runProjectIntent RunProjectIntent
	Decode(request, &runProjectIntent, writer)
	containerName := runProjectIntent.ContainerName
	var projectConfigs []model.ProjectConfig
	filter := filters.FilterBy{
		Field: "id",
		Args:  []string{runProjectIntent.Id},
	}
	err := b.Provider.QueryListStatement(&projectConfigs, filter)
	if err != nil {
		writer.Write([]byte("can not find project"))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	projectConfig := projectConfigs[0]

	_, err = b.Builder.ContainerCreate(projectConfig.Name, projectConfig.RunFile, containerName)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	err = b.Builder.ContainerRun(containerName)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	writer.Write([]byte("container created"))
	writer.WriteHeader(http.StatusOK)
}

func (b *BuilderController) AttachProjectDoc(
	writer http.ResponseWriter,
	request *http.Request) {
	var attachIntent AttachIntent
	Decode(request, &attachIntent, writer)
	waiter, err := b.Builder.ContainerAttach(attachIntent.Name)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	inputBytes := []byte(attachIntent.Input)
	_, err = waiter.Conn.Write(inputBytes)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	defer waiter.Close()
	defer waiter.CloseWrite()
	defer b.HandleContainerWorking(attachIntent.Name, writer)

	var c1 = make(chan bool)
	go func() {
		res := WriteToWriter(&writer, &waiter)
		c1 <- res
	}()

	select {
	case <-c1:
		return
	case <-time.After(100 * time.Millisecond):
		return
	}
}

func (b *BuilderController) AttachProjectDocData(
	writer http.ResponseWriter,
	request *http.Request) {
	var attachIntent AttachIntentData
	Decode(request, &attachIntent, writer)
	waiter, err := b.Builder.ContainerAttach(attachIntent.Name)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	data := model.Data{}
	err = b.Provider.QueryListStatement(&data, filters.FilterBy{
		Field: "id",
		Args:  []string{attachIntent.DataId},
	})
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	inputBytes := data.File
	_, err = waiter.Conn.Write(inputBytes)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	defer waiter.Close()
	defer waiter.CloseWrite()
	defer b.HandleContainerWorking(attachIntent.Name, writer)

	var c1 = make(chan bool)
	go func() {
		res := WriteToWriter(&writer, &waiter)
		c1 <- res
	}()

	select {
	case <-c1:
		return
	case <-time.After(100 * time.Millisecond):
		return
	}
}

func WriteToWriter(writer *http.ResponseWriter, waiter *types.HijackedResponse) bool {
	waiter.Reader.WriteTo(*writer)
	return true
}

func (b *BuilderController) HandleContainerWorking(name string, writer http.ResponseWriter) {
	time.Sleep(1 * time.Second)
	isWorking, err := b.Builder.CheckIfContainerWorking(name)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	if !isWorking {
		err = b.Builder.ContainerDelete(name)
		if err != nil {
			writer.Write([]byte(err.Error()))
			writer.WriteHeader(http.StatusBadRequest)
		}
	}
}

func (c *BuilderController) GetStatusProjectConfig(
	writer http.ResponseWriter,
	request *http.Request) {
	field, _ := request.URL.Query()["field"]
	args, _ := request.URL.Query()["val"]
	filter := filters.FilterBy{
		Field: field[0],
		Args:  args,
	}
	var projectConfigs []model.ProjectConfig

	err := c.Provider.QueryListStatement(&projectConfigs, filter)
	if err != nil {
		writer.Write([]byte("Can not get project ids"))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	str := fmt.Sprintf("%d", projectConfigs[0].Status)
	writer.Write([]byte(str))
}

func (c *BuilderController) GetProjectConfigRunned(
	writer http.ResponseWriter,
	request *http.Request) {
	field, _ := request.URL.Query()["container_name"]
	name := field[0]
	isWorking, err := c.Builder.CheckIfContainerWorking(name)
	if !isWorking || err != nil {
		writer.Write([]byte("false"))
	} else {
		writer.Write([]byte("true"))
	}
	writer.WriteHeader(http.StatusOK)
}
