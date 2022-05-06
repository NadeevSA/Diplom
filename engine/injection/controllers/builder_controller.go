package controllers

import (
	"engine_app/core"
	"engine_app/database/model"
	"engine_app/filters"
	"engine_app/providers"
	"net/http"
	"time"

	"github.com/docker/docker/api/types"
)

type AttachIntent struct {
	Name  string `json:"name"`
	Input string `json:"input"`
}

type AttachIntentData struct {
	Name   string `json:"name"`
	DataId string `json:"data_id"`
}

type BuilderController struct {
	Provider *providers.Provider
	Builder  *core.Builder
}

func (b *BuilderController) BuildProjectDoc(
	writer http.ResponseWriter,
	request *http.Request) {
	id := request.Header.Get("id")

	var projectConfigs []model.ProjectConfig
	filter := filters.FilterBy{
		Field: "id",
		Args:  []string{id},
	}
	err := b.Provider.QueryListStatement(&projectConfigs, filter)
	if err != nil {
		writer.Write([]byte("can not find file"))
		return
	}

	projectConfig := projectConfigs[0]
	b.Builder.HandleBuild(projectConfig, writer, "temp")
	projectConfig.Status = model.Status(1)
	err = b.Provider.UpdateStatement(projectConfig)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(500)
		return
	}
}

func (b *BuilderController) RunProjectDoc(
	writer http.ResponseWriter,
	request *http.Request) {
	id := request.Header.Get("id")

	var projectConfigs []model.ProjectConfig
	filter := filters.FilterBy{
		Field: "id",
		Args:  []string{id},
	}
	err := b.Provider.QueryListStatement(&projectConfigs, filter)
	if err != nil {
		writer.Write([]byte("can not find file"))
		writer.WriteHeader(500)
		return
	}

	projectConfig := projectConfigs[0]
	err = b.Builder.ContainerDelete(projectConfig.Name)
	_, err = b.Builder.ContainerCreate(projectConfig.Name, projectConfig.RunFile)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(500)
		return
	}
	err = b.Builder.ContainerRun(projectConfig.Name)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(500)
		return
	}
	projectConfig.Status = model.Status(2)
	err = b.Provider.UpdateStatement(projectConfig)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(500)
		return
	}
	writer.Write([]byte("Container started"))
	writer.WriteHeader(200)
}

func (b *BuilderController) AttachProjectDoc(
	writer http.ResponseWriter,
	request *http.Request) {
	var attachIntent AttachIntent
	Decode(request, &attachIntent, writer)
	waiter, err := b.Builder.ContainerAttach(attachIntent.Name)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(500)
		return
	}
	inputBytes := []byte(attachIntent.Input)
	_, err = waiter.Conn.Write(inputBytes)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(500)
		return
	}

	defer waiter.Close()
	defer waiter.CloseWrite()
	defer b.CheckIfWorking(attachIntent.Name, writer)

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
		writer.WriteHeader(500)
		return
	}

	data := model.Data{}
	err = b.Provider.QueryListStatement(&data, filters.FilterBy{
		Field: "id",
		Args:  []string{attachIntent.DataId},
	})
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(500)
		return
	}
	inputBytes := data.File
	_, err = waiter.Conn.Write(inputBytes)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(500)
		return
	}

	defer waiter.Close()
	defer waiter.CloseWrite()
	defer b.CheckIfWorking(attachIntent.Name, writer)

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

func (b *BuilderController) CheckIfWorking(name string, writer http.ResponseWriter) {
	time.Sleep(1 * time.Second)
	isWorking, err := b.Builder.CheckIfContainerWorking(name)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(500)
		return
	}
	if !isWorking {
		var projectConfigs []model.ProjectConfig
		filter := filters.FilterBy{
			Field: "name",
			Args:  []string{name},
		}
		err = b.Provider.QueryListStatement(&projectConfigs, filter)
		if err != nil {
			writer.Write([]byte(err.Error()))
			writer.WriteHeader(500)
			return
		}
		projectConfigs[0].Status = model.Status(1)
		err = b.Provider.UpdateStatement(projectConfigs[0])
		if err != nil {
			writer.Write([]byte(err.Error()))
			writer.WriteHeader(500)
			return
		}
	}
}
