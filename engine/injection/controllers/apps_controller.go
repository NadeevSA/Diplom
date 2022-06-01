package controllers

import (
	"engine_app/core"
	"engine_app/database/model"
	"engine_app/filters"
	"engine_app/providers"
	"fmt"
	"github.com/spf13/viper"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/docker/docker/api/types"
)

type AppsController struct {
	Provider *providers.Provider
	Builder  *core.Builder
}

func (b *AppsController) BuildApp(
	writer http.ResponseWriter,
	request *http.Request) {
	projectConfigId := request.Header.Get("projectConfigId")

	var projectConfigs []model.ProjectConfig
	var dockerConfigs []model.DockerConfig
	filter := filters.FilterBy{
		Field: "id",
		Args:  []string{projectConfigId},
	}

	err := b.Provider.QueryListStatement(&projectConfigs, filter)
	if err != nil || len(projectConfigs) == 0 {
		writer.Write([]byte("can not find project config"))
		return
	}
	projectConfig := projectConfigs[0]

	filter = filters.FilterBy{
		Field: "id",
		Args:  []string{strconv.Itoa(projectConfig.DockerConfigId)},
	}
	err = b.Provider.QueryListStatement(&dockerConfigs, filter)
	if err != nil {
		writer.Write([]byte(err.Error()))
		return
	}

	if len(dockerConfigs) == 0 {
		writer.Write([]byte("no such docker config"))
		return
	}

	if len(projectConfigs) == 0 {
		writer.Write([]byte("No such config"))
		return
	}

	if projectConfig.File == nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	b.Builder.HandleBuild(projectConfig, writer, dockerConfigs[0], "temp")

	projectConfig.Status = model.Status(1)
	err = b.Provider.UpdateStatement(projectConfig)

	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
}

func (b *AppsController) RunApp(
	writer http.ResponseWriter,
	request *http.Request) {
	var runProjectIntent RunProjectIntent
	decodeError := Decode(request, &runProjectIntent)
	if decodeError != nil {
		writer.WriteHeader(http.StatusForbidden)
		writer.Write([]byte(decodeError.Error()))
		return
	}
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

	if len(projectConfigs) == 0 {
		writer.Write([]byte("can not find project"))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	projectConfig := projectConfigs[0]

	_, err = b.Builder.ContainerCreate(projectConfig.Name, containerName)
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
	//writer.WriteHeader(http.StatusOK)
}

func (b *AppsController) AttachApp(
	writer http.ResponseWriter,
	request *http.Request) {
	var attachIntent AttachIntent
	decodeError := Decode(request, &attachIntent)
	if decodeError != nil {
		writer.WriteHeader(http.StatusForbidden)
		writer.Write([]byte(decodeError.Error()))
		return
	}
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
	defer b.handleContainerWorking(attachIntent.Name, writer)

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

func (b *AppsController) AttachAppData(
	writer http.ResponseWriter,
	request *http.Request) {
	var attachIntent AttachIntentData
	decodeError := Decode(request, &attachIntent)
	if decodeError != nil {
		writer.WriteHeader(http.StatusForbidden)
		writer.Write([]byte(decodeError.Error()))
		return
	}
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
	defer b.handleContainerWorking(attachIntent.Name, writer)

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

func (b *AppsController) handleContainerWorking(name string, writer http.ResponseWriter) {
	time.Sleep(3 * time.Second)
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

func (c *AppsController) GetStatusApp(
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

func (c *AppsController) GetAppRunned(
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

func (b *AppsController) AttachAppDataTime(
	writer http.ResponseWriter,
	request *http.Request) {

	signingKey := []byte(viper.GetString("auth.signing_key"))
	reqToken := request.Header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer ")
	if len(splitToken) == 1 {
		writer.WriteHeader(http.StatusForbidden)
		return
	}
	reqToken = splitToken[1]
	userNameFromToken, _ := ParseToken(reqToken, signingKey)

	var attachIntent AttachIntentDataTime
	decodeError := Decode(request, &attachIntent)
	if decodeError != nil {
		writer.WriteHeader(http.StatusForbidden)
		writer.Write([]byte(decodeError.Error()))
		return
	}
	waiter, err := b.Builder.ContainerAttach(attachIntent.Name)
	if err != nil {
		writer.Write([]byte(err.Error()))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	data := model.Data{}
	stringId := fmt.Sprint(attachIntent.DataId)
	err = b.Provider.QueryListStatement(&data, filters.FilterBy{
		Field: "id",
		Args:  []string{stringId},
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
	defer b.handleContainerWorking(attachIntent.Name, writer)

	var c1 = make(chan bool)
	var now time.Time
	var timeCnt time.Duration
	go func() {
		now = time.Now()
		res := WriteToWriter(&writer, &waiter)
		timeCnt = time.Now().Sub(now)
		log.Println(timeCnt.Seconds())
		c1 <- res
	}()

	projectId, _ := strconv.Atoi(attachIntent.ProjectId)
	dataId, _ := strconv.Atoi(attachIntent.DataId)

	select {
	case <-c1:

		timeProjectData := model.TimeProjectData{
			ProjectId: projectId,
			Author:    userNameFromToken,
			DataId:    dataId,
			Duration:  timeCnt.Seconds(),
		}

		var timesProjectsDocs []model.TimeProjectData
		var str = fmt.Sprintf("project_id = %d and data_id = %d and author = '%s'", projectId, dataId, userNameFromToken)
		b.Provider.Db.Where(str).Find(&timesProjectsDocs)
		if timesProjectsDocs == nil || len(timesProjectsDocs) == 0 {
			err = b.Provider.AddStatement(&timeProjectData)
			if err != nil {
				writer.Write([]byte(err.Error()))
				writer.WriteHeader(http.StatusBadRequest)
				return
			}
		} else {
			err = b.Provider.UpdateStatement(&timeProjectData)
			if err != nil {
				writer.Write([]byte(err.Error()))
				writer.WriteHeader(http.StatusBadRequest)
				return
			}
		}

		writer.WriteHeader(http.StatusOK)
		return
	case <-time.After(10 * time.Second):
		return
	}
}
