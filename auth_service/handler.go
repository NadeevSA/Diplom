package main

import (
	auth2 "auth/auth"
	"github.com/gin-gonic/gin"
	"net/http"
)

const (
	STATUS_OK    = "ok"
	STATUS_ERROR = "error"
)

type response struct {
	Status string `json:"status"`
	Msg    string `json:"message,omitempty"`
}

func newResponse(status, msg string) *response {
	return &response{
		Status: status,
		Msg:    msg,
	}
}

type handler struct {
	useCase auth2.IAuthorizer
}

func newHandler(useCase auth2.IAuthorizer) *handler {
	return &handler{
		useCase: useCase,
	}
}

func (h *handler) signUp(c *gin.Context) {
	inp := new(auth2.UserAuth)
	if err := c.BindJSON(inp); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, newResponse(STATUS_ERROR, err.Error()))
		return
	}

	if err := h.useCase.SignUp(c.Request.Context(), inp); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, newResponse(STATUS_ERROR, err.Error()))
		return
	}

	c.JSON(http.StatusOK, newResponse(STATUS_OK, "user created successfully"))
}

type signInResponse struct {
	*response
	Token string `json:"token,omitempty"`
}

func newSignInResponse(status, msg, token string) *signInResponse {
	return &signInResponse{
		&response{
			Status: status,
			Msg:    msg,
		},
		token,
	}
}

func (h *handler) signIn(c *gin.Context) {
	inp := new(auth2.UserAuth)
	if err := c.BindJSON(inp); err != nil {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}

	token, err := h.useCase.SignIn(c.Request.Context(), inp)
	if err != nil {
		if err == auth2.ErrInvalidAccessToken {
			c.AbortWithStatusJSON(http.StatusBadRequest, newSignInResponse(STATUS_ERROR, err.Error(), ""))
			return
		}

		if err == auth2.ErrUserDoesNotExist {
			c.AbortWithStatusJSON(http.StatusBadRequest, newSignInResponse(STATUS_ERROR, err.Error(), ""))
			return
		}

		c.AbortWithStatusJSON(http.StatusInternalServerError, newSignInResponse(STATUS_ERROR, err.Error(), ""))
		return
	}

	c.JSON(http.StatusOK, newSignInResponse(STATUS_OK, "", token))
}
