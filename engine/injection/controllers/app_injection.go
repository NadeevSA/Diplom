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

func Decode(request *http.Request, obj interface{}) error {
	body, err := ioutil.ReadAll(request.Body)
	if err != nil {
		return err
	}
	log.Println(string(body))
	if err = json.Unmarshal(body, obj); err != nil {
		panic(string(body))
		return err
	}
	request.Body = ioutil.NopCloser(bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	return nil
}
