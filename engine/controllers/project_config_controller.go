package controllers

import (
	"bytes"
	"engine_app/controllers/filters"
	"engine_app/database/model"
	"fmt"
	"io"
	"log"
	"net/http"
)

type ProjectConfigController struct {
	*BaseCrudController
}

func (c *ProjectConfigController) AddProjectConfig(
	writer http.ResponseWriter,
	request *http.Request) {
	var projectConfig model.ProjectConfig
	Decode(request, &projectConfig, writer)
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
	var projectConfigs model.ProjectConfig
	Decode(request, &projectConfigs, writer)
	c.Put(&projectConfigs, request, writer)
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
	buf.Bytes()

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

func (c *ProjectConfigController) GetStatusProjectConfig(
	writer http.ResponseWriter,
	request *http.Request) {
	field, _ := request.URL.Query()["field"]
	args, _ := request.URL.Query()["val"]
	filter := filters.FilterBy{
		Field: field[0],
		Args:  args,
	}
	var projectConfigs []model.ProjectConfig

	err := c.AppInjection.Provider.QueryListStatement(&projectConfigs, filter)
	if err != nil {
		writer.Write([]byte("Can not get project ids"))
		writer.WriteHeader(500)
		return
	}
	str := fmt.Sprintf("%d", projectConfigs[0].Status)
	writer.Write([]byte(str))
}
