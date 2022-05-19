package controllers

import (
	"bytes"
	"engine_app/database/model"
	"io"
	"log"
	"net/http"
	"strconv"
)

type DockerConfigController struct {
	AppInjection *AppInjection
}

func (d *DockerConfigController) DockerConfig(
	writer http.ResponseWriter,
	request *http.Request) {
	var dockerConfig model.DockerConfig

	file, _, _ := request.FormFile("File")
	description := request.MultipartForm.Value["Description"][0]
	version := request.MultipartForm.Value["Version"][0]
	config := request.MultipartForm.Value["Config"][0]

	var buf bytes.Buffer
	_, err := io.Copy(&buf, file)
	if err != nil {
		log.Fatal(err)
	}

	conf, _ := strconv.Atoi(config)
	dockerConfig.File = buf.Bytes()
	dockerConfig.Description = description
	dockerConfig.Version = version
	dockerConfig.Config = model.ConfigurationType(conf)
}
