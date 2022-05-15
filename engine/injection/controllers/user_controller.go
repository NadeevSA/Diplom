package controllers

import (
	"encoding/json"
	"engine_app/database/model"
	"engine_app/filters"
	"github.com/spf13/viper"
	"net/http"
	"strings"
)

type UserController struct {
	*BaseCrudController
}

func (c *UserController) UserInfo(
	writer http.ResponseWriter,
	request *http.Request) {
	reqToken := request.Header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer ")
	if len(splitToken) == 1 {
		writer.WriteHeader(http.StatusForbidden)
		return
	}
	reqToken = splitToken[1]
	signingKey := []byte(viper.GetString("auth.signing_key"))
	userNameFromToken, err := ParseToken(reqToken, signingKey)
	if err != nil {
		writer.WriteHeader(http.StatusForbidden)
		writer.Write([]byte(err.Error()))
		return
	}
	var user model.User
	filter := filters.FilterBy{Field: "email", Args: []string{userNameFromToken}}
	err = c.AppInjection.Provider.QueryListStatement(&user, filter)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte(err.Error()))
		return
	}
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(user)
}

func (c *UserController) AddUser(
	writer http.ResponseWriter,
	request *http.Request) {
	var user model.User
	Decode(request, &user, writer)
	c.Add(&user, request, writer)
}

func (c *UserController) DeleteUser(
	writer http.ResponseWriter,
	request *http.Request) {
	var users model.User
	Decode(request, &users, writer)
	c.Delete(&users, request, writer)
}

func (c *UserController) PutUser(
	writer http.ResponseWriter,
	request *http.Request) {
	var user model.User
	Decode(request, &user, writer)
	c.Put(&user, request, writer)
}

func (c *UserController) GetAllUser(
	writer http.ResponseWriter,
	request *http.Request) {
	var users []model.User
	c.GetAll(&users, request, writer)
}

func (c *UserController) GetFilteredUser(
	writer http.ResponseWriter,
	request *http.Request) {
	var users []model.User
	c.GetFilteredBy(&users, request, writer)
}
