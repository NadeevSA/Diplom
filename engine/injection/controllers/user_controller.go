package controllers

import (
	"engine_app/database/model"
	"net/http"
)

type UserController struct {
	*BaseCrudController
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
