package controllers

import (
	"bytes"
	"engine_app/core"
	"engine_app/database/model"
	"engine_app/filters"
	"io"
	"log"
	"net/http"
	"strconv"
)

type ProjectConfigController struct {
	*BaseCrudController
	B *core.Builder
}

func (c *ProjectConfigController) AddProjectConfig(
	writer http.ResponseWriter,
	request *http.Request) {
	var projectConfig model.ProjectConfig

	err := request.ParseMultipartForm(32 << 20)
	if err != nil {
		log.Fatal(err)
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
		return
	}

	file, header, err := request.FormFile("File")
	defer file.Close()
	if err != nil {
		panic(err)
	}
	var buf bytes.Buffer
	_, err = io.Copy(&buf, file)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
		return
	}

	dockerConfigId, err := strconv.Atoi(request.MultipartForm.Value["DockerConfigId"][0])
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
		return
	}

	projectId, err := strconv.Atoi(request.MultipartForm.Value["ProjectId"][0])
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
		return
	}

	projectConfig.ProjectFile = header.Filename
	projectConfig.Status = model.Status(0)
	projectConfig.DockerConfigId = dockerConfigId
	projectConfig.Name = request.MultipartForm.Value["ProjectName"][0]
	projectConfig.BuildCommand = request.MultipartForm.Value["BuildCommand"][0]
	projectConfig.RunFile = request.MultipartForm.Value["RunFile"][0]
	projectConfig.ProjectId = projectId
	projectConfig.PathToEntry = request.MultipartForm.Value["PathToEntry"][0]
	projectConfig.File = buf.Bytes()

	c.Add(&projectConfig, request, writer)
}

func (c *ProjectConfigController) DeleteProjectConfig(
	writer http.ResponseWriter,
	request *http.Request) {
	var projectConfigs model.ProjectConfig
	Decode(request, &projectConfigs, writer)
	c.Delete(&projectConfigs, request, writer)
}

func (c *ProjectConfigController) PutProjectConfig(
	writer http.ResponseWriter,
	request *http.Request) {
	var projectConfig model.ProjectConfig

	err := request.ParseMultipartForm(32 << 20)
	if err != nil {
		log.Fatal(err)
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
		return
	}

	file, header, err := request.FormFile("File")

	id := request.MultipartForm.Value["ID"][0]

	dockerConfigId, err := strconv.Atoi(request.MultipartForm.Value["DockerConfigId"][0])
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
		return
	}

	projectId, err := strconv.Atoi(request.MultipartForm.Value["ProjectId"][0])
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
		return
	}

	var cnfs []model.ProjectConfig
	c.AppInjection.Provider.QueryListStatement(&cnfs, filters.FilterBy{Field: "ID", Args: []string{id}})

	selectedConfig := cnfs[0]

	if file != nil {
		defer file.Close()
		var buf bytes.Buffer
		_, err = io.Copy(&buf, file)
		projectConfig.File = buf.Bytes()
		projectConfig.ProjectFile = header.Filename
	} else {
		projectConfig.File = selectedConfig.File
		projectConfig.ProjectFile = selectedConfig.ProjectFile
	}

	idInt, _ := strconv.Atoi(id)
	projectConfig.ID = uint(idInt)
	projectConfig.Status = model.Status(0)
	projectConfig.DockerConfigId = dockerConfigId
	projectConfig.Name = request.MultipartForm.Value["ProjectName"][0]
	projectConfig.BuildCommand = request.MultipartForm.Value["BuildCommand"][0]
	projectConfig.RunFile = request.MultipartForm.Value["RunFile"][0]
	projectConfig.ProjectId = projectId
	projectConfig.PathToEntry = request.MultipartForm.Value["PathToEntry"][0]

	c.Put(&projectConfig, request, writer)
}

func (c *ProjectConfigController) GetAllProjectConfig(
	writer http.ResponseWriter,
	request *http.Request) {
	var projectConfigs []model.ProjectConfig
	c.GetAll(&projectConfigs, request, writer)
}

func (c *ProjectConfigController) GetFilteredProjectConfig(
	writer http.ResponseWriter,
	request *http.Request) {
	var projectConfigs []model.ProjectConfig
	c.GetFilteredBy(&projectConfigs, request, writer)
}

func (c *ProjectConfigController) AddProjectConfigFiles(
	writer http.ResponseWriter,
	request *http.Request) {
	err := request.ParseMultipartForm(32 << 20)
	if err != nil {
		log.Fatal(err)
		return
	}

	file, header, err := request.FormFile("file")
	defer file.Close()
	if err != nil {
		panic(err)
	}
	var buf bytes.Buffer
	_, err = io.Copy(&buf, file)
	if err != nil {
		log.Fatal(err)
	}

	field := "id"
	id := request.Form.Get("id")
	filter := filters.FilterBy{
		Field: field,
		Args:  []string{id},
	}
	var projectConfigs []model.ProjectConfig

	err = c.AppInjection.Provider.QueryListStatement(&projectConfigs, filter)
	if err != nil {
		writer.Write([]byte("Can not get project ids"))
		return
	}
	pr := projectConfigs[0]
	pr.File = buf.Bytes()
	pr.ProjectFile = header.Filename
	err = c.AppInjection.Provider.UpdateStatement(&pr)
	if err != nil {
		writer.Write([]byte("Can not update"))
		writer.WriteHeader(500)
		return
	}
	writer.WriteHeader(200)
	writer.Write([]byte("file attached"))

}
