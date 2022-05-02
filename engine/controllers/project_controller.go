package controllers

import (
	"engine_app/database/model"
	"net/http"
)

type ProjectController struct {
	*BaseCrudController
}

func (c *ProjectController) AddProject(
	writer http.ResponseWriter,
	request *http.Request) {
	var Project model.Project
	Decode(request, &Project, writer)
	c.Add(&Project, request, writer)
}

func (c *ProjectController) DeleteProject(
	writer http.ResponseWriter,
	request *http.Request) {
	var Projects model.Project
	Decode(request, &Projects, writer)
	c.Delete(&Projects, request, writer)
}

func (c *ProjectController) PutProject(
	writer http.ResponseWriter,
	request *http.Request) {
	var Project model.Project
	Decode(request, &Project, writer)
	c.Put(&Project, request, writer)
}

func (c *ProjectController) GetAllProject(
	writer http.ResponseWriter,
	request *http.Request) {
	var Projects []model.Project
	c.GetAll(&Projects, request, writer)
}

func (c *ProjectController) GetFilteredProject(
	writer http.ResponseWriter,
	request *http.Request) {
	var Projects []model.Project
	c.GetFilteredBy(&Projects, request, writer)
}
