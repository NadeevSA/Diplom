package controllers

import (
	"bytes"
	"encoding/json"
	"engine_app/database/model"
	"io"
	"log"
	"net/http"
	"strconv"
)

type DockerConfigController struct {
	AppInjection *AppInjection
}

func (d *DockerConfigController) AddDockerConfig(
	writer http.ResponseWriter,
	request *http.Request) {
	var dockerConfig model.DockerConfig

	file, _, _ := request.FormFile("File")
	description := request.MultipartForm.Value["Description"][0]
	config := request.MultipartForm.Value["Config"][0]

	var buf bytes.Buffer
	_, err := io.Copy(&buf, file)
	if err != nil {
		log.Fatal(err)
	}

	conf, _ := strconv.Atoi(config)
	dockerConfig.File = buf.Bytes()
	dockerConfig.Description = description
	dockerConfig.Config = model.ConfigurationType(conf)

	if err = d.AppInjection.Provider.AddStatement(&dockerConfig); err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
	} else {
		writer.WriteHeader(http.StatusOK)
		json.NewEncoder(writer).Encode(dockerConfig)
	}
}

func (d *DockerConfigController) GetAllDockerConfigs(
	writer http.ResponseWriter,
	request *http.Request) {
	var dockerConfigs []model.DockerConfig
	if err := d.AppInjection.Provider.QueryListStatementAll(&dockerConfigs); err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
	} else {
		writer.WriteHeader(http.StatusOK)
		json.NewEncoder(writer).Encode(dockerConfigs)
	}
}
