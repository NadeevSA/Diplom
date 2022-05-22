package controllers

import (
	"engine_app/database/model"
	"engine_app/filters"
	"fmt"
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
	Decode(request, &Project, writer)

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

	var Projects model.Project
	var deleteIntent filters.IdsFilter
	Decode(request, &deleteIntent, writer)
	str := strings.Trim(strings.Replace(fmt.Sprint(deleteIntent.Ids), " ", ",", -1), "[]")
	query := "delete from project_configs where project_id in ($1)"
	query = strings.Replace(query, "$1", str, -1)
	_, err := c.AppInjection.Db.Exec(query)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
		return
	}

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
