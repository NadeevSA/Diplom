package controllers

import (
	"bytes"
	"encoding/json"
	"engine_app/core"
	"engine_app/providers"
	"io/ioutil"
	"log"
	"net/http"
)

type App struct {
	ProjectConfigController ProjectConfigController
	UserController          UserController
	BuilderController       BuilderController
	ProjectController       ProjectController
	DataFileController      DataFileController
	DataProjectController   DataProjectController
	AuthService             AuthService
	UseAuth                 bool
	AppInjection            *AppInjection
	Builder                 *core.Builder
}

type AppInjection struct {
	Provider *providers.Provider
}

func Decode(request *http.Request, obj interface{}, writer http.ResponseWriter) {
	body, err := ioutil.ReadAll(request.Body)
	if err != nil {
		log.Printf("Error reading body: %v", err)
		http.Error(writer, "can't read body", http.StatusBadRequest)
		return
	}
	if err = json.Unmarshal(body, obj); err != nil {
		panic(err)
		writer.Write([]byte("Decode error"))
		writer.WriteHeader(500)
	}
	request.Body = ioutil.NopCloser(bytes.NewBuffer(body))
	if err != nil {
		writer.Write([]byte("Decode error"))
		writer.WriteHeader(500)
	}
}
