package controllers

import (
	"engine_app/database/model"
	"engine_app/filters"
	"engine_app/injection/multistage_delete"
	"github.com/spf13/viper"
	"net/http"
	"strings"
)

type ProjectController struct {
	*BaseCrudController
}

func (c *ProjectController) AddProject(
	writer http.ResponseWriter,
	request *http.Request) {
	var Project model.Project
	decodeError := Decode(request, &Project)
	if decodeError != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(decodeError.Error()))
		return
	}
	if c.AppInjection.UseAuth {
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := request.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		if len(splitToken) == 1 {
			writer.WriteHeader(http.StatusForbidden)
			return
		}
		reqToken = splitToken[1]
		userNameFromToken, _ := ParseToken(reqToken, signingKey)
		if Project.Author == "" {
			Project.Author = userNameFromToken
		}
	}

	c.Add(&Project, request, writer)
}

func (c *ProjectController) DeleteProject(
	writer http.ResponseWriter,
	request *http.Request) {

	var deleteIntent filters.IdsIntent
	decodeError := Decode(request, &deleteIntent)
	if decodeError != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(decodeError.Error()))
		return
	}

	err := multistage_delete.DeleteProjectConnected(deleteIntent, c.AppInjection.Db, c.AppInjection.Provider)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
	} else {
		writer.WriteHeader(http.StatusOK)
	}
}

func (c *ProjectController) PutProject(
	writer http.ResponseWriter,
	request *http.Request) {
	var Project model.Project
	decodeError := Decode(request, &Project)
	if decodeError != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(decodeError.Error()))
		return
	}
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
