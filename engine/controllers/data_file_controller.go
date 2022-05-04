package controllers

import (
	"engine_app/database/model"
	"net/http"
)

type DataFileController struct {
	*BaseCrudController
}

func (c *DataFileController) AddDataFile(
	writer http.ResponseWriter,
	request *http.Request) {
	var dataFile model.Data
	Decode(request, &dataFile, writer)
	c.Add(&dataFile, request, writer)
}

func (c *DataFileController) DeleteDataFile(
	writer http.ResponseWriter,
	request *http.Request) {
	var Projects model.Project
	Decode(request, &Projects, writer)
	c.Delete(&Projects, request, writer)
}

func (c *DataFileController) PutDataFile(
	writer http.ResponseWriter,
	request *http.Request) {
	var dataFile model.Data
	Decode(request, &dataFile, writer)
	c.Put(&dataFile, request, writer)
}

func (c *DataFileController) GetAllDataFile(
	writer http.ResponseWriter,
	request *http.Request) {
	var dataFile model.Data
	c.GetAll(&dataFile, request, writer)
}

func (c *DataFileController) GetFilteredDataFile(
	writer http.ResponseWriter,
	request *http.Request) {
	var datafiles []model.Data
	c.GetFilteredBy(datafiles, request, writer)
}
