package controllers

import (
	"bytes"
	"engine_app/database/model"
	"io"
	"log"
	"net/http"
)

type DataFileController struct {
	*BaseCrudController
}

func (c *DataFileController) AddDataFile(
	writer http.ResponseWriter,
	request *http.Request) {
	dataFile := model.Data{}

	file, header, _ := request.FormFile("File")
	dataFile.Description = request.MultipartForm.Value["Description"][0]

	dataFile.FileName = header.Filename
	var buf bytes.Buffer
	_, err := io.Copy(&buf, file)
	if err != nil {
		log.Fatal(err)
	}
	dataFile.File = buf.Bytes()

	c.Add(&dataFile, request, writer)
}

func (c *DataFileController) DeleteDataFile(
	writer http.ResponseWriter,
	request *http.Request) {
	var Projects model.Project
	Decode(request, &Projects, writer)
	c.Delete(&Projects, request, writer)
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
