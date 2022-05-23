package controllers

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"engine_app/core"
	"engine_app/providers"
	"io/ioutil"
	"log"
	"net/http"
)

type App struct {
	ProjectConfigController   ProjectConfigController
	UserController            UserController
	BuilderController         BuilderController
	ProjectController         ProjectController
	DataFileController        DataFileController
	DataProjectController     DataProjectController
	DockerConfigController    DockerConfigController
	TimeProjectDataController TimeProjectDataController
	AuthService               AuthService
	AppInjection              *AppInjection
	Builder                   *core.Builder
}

type AppInjection struct {
	Provider *providers.Provider
	Db       *sql.DB
	UseAuth  bool
}

func Decode(request *http.Request, obj interface{}, writer http.ResponseWriter) {
	body, err := ioutil.ReadAll(request.Body)
	if err != nil {
		log.Printf("Error reading body: %v", err)
		http.Error(writer, "can't read body", http.StatusBadRequest)
		return
	}
	if err = json.Unmarshal(body, obj); err != nil {
		panic(string(body))
		writer.Write([]byte("Decode error"))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
	request.Body = ioutil.NopCloser(bytes.NewBuffer(body))
	if err != nil {
		writer.Write([]byte("Decode error"))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}
}
