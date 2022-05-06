package controllers

import (
	"engine_app/database/model"
	"engine_app/filters"
	"net/http"
	"strconv"
	"strings"

	"github.com/spf13/viper"
)

type AuthService struct {
	AppInjection *AppInjection
}

func (a *AuthService) Auth(next http.HandlerFunc, useAuth bool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !useAuth {
			next.ServeHTTP(w, r)
			return
		}
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := r.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		if len(splitToken) == 1 {
			w.WriteHeader(403)
			return
		}
		reqToken = splitToken[1]
		_, err := ParseToken(reqToken, signingKey)
		if err != nil {
			w.WriteHeader(403)
			w.Write([]byte(err.Error()))
			return
		}
		next.ServeHTTP(w, r)
	}
}

func (a *AuthService) AuthCheckUserProjectBody(next http.HandlerFunc, useAuth bool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !useAuth {
			next.ServeHTTP(w, r)
			return
		}

		var project model.Project
		Decode(r, &project, w)

		var users []model.User
		str := strconv.Itoa(project.UserId)
		filter := filters.FilterBy{
			Field: "id",
			Args:  []string{str},
		}
		err := a.AppInjection.Provider.QueryListStatement(&users, filter)

		if err != nil {
			w.WriteHeader(403)
			w.Write([]byte(err.Error()))
			return
		}

		if len(users) == 0 {
			w.WriteHeader(500)
			w.Write([]byte("No such user"))
			return
		}
		user := users[0]
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := r.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		if len(splitToken) == 1 {
			w.WriteHeader(403)
			return
		}
		reqToken = splitToken[1]
		userNameFromToken, err := ParseToken(reqToken, signingKey)

		if err != nil || user.Email != userNameFromToken {
			w.WriteHeader(403)
			w.Write([]byte(err.Error()))
			return
		}
		next.ServeHTTP(w, r)
	}
}

func (a *AuthService) AuthServiceUserProjectConfig(next http.HandlerFunc, useAuth bool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !useAuth {
			next.ServeHTTP(w, r)
			return
		}

		var projectConfig model.ProjectConfig
		var project model.Project
		var users []model.User

		Decode(r, &projectConfig, w)

		str := strconv.Itoa(projectConfig.ProjectId)

		filter := filters.FilterBy{
			Field: "id",
			Args:  []string{str},
		}
		err := a.AppInjection.Provider.QueryListStatement(&project, filter)

		str = strconv.Itoa(project.UserId)
		filter = filters.FilterBy{
			Field: "id",
			Args:  []string{str},
		}
		err = a.AppInjection.Provider.QueryListStatement(&users, filter)

		if err != nil {
			w.WriteHeader(403)
			w.Write([]byte(err.Error()))
			return
		}
		if len(users) == 0 {
			w.WriteHeader(500)
			w.Write([]byte("No such user"))
			return
		}
		user := users[0]
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := r.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		if len(splitToken) == 1 {
			w.WriteHeader(403)
			return
		}
		reqToken = splitToken[1]
		userNameFromToken, err := ParseToken(reqToken, signingKey)

		if err != nil || user.Email != userNameFromToken {
			w.WriteHeader(403)
			w.Write([]byte(err.Error()))
			return
		}
		next.ServeHTTP(w, r)
	}
}

func (a *AuthService) AuthCheckUserProjectGet(next http.HandlerFunc, useAuth bool) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		if !useAuth {
			next.ServeHTTP(w, r)
			return
		}

		var project model.Project

		field, _ := r.URL.Query()["field"]
		args, _ := r.URL.Query()["val"]
		filter := filters.FilterBy{
			Field: field[0],
			Args:  args,
		}

		err := a.AppInjection.Provider.QueryListStatement(&project, filter)
		if err != nil {
			w.WriteHeader(403)
			w.Write([]byte(err.Error()))
			return
		}

		var users []model.User
		str := strconv.Itoa(project.UserId)
		filter = filters.FilterBy{
			Field: "id",
			Args:  []string{str},
		}
		err = a.AppInjection.Provider.QueryListStatement(&users, filter)

		if err != nil {
			w.WriteHeader(500)
			w.Write([]byte(err.Error()))
			return
		}

		if len(users) == 0 {
			w.WriteHeader(500)
			w.Write([]byte("No such user"))
			return
		}
		user := users[0]
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := r.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		if len(splitToken) == 1 {
			w.WriteHeader(403)
			return
		}
		reqToken = splitToken[1]
		userNameFromToken, err := ParseToken(reqToken, signingKey)

		if err != nil || user.Email != userNameFromToken {
			w.WriteHeader(403)
			w.Write([]byte(err.Error()))
			return
		}
		next.ServeHTTP(w, r)
	}
}

func (a *AuthService) AuthCheckUserProjectConfigGet(next http.HandlerFunc, useAuth bool) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		if !useAuth {
			next.ServeHTTP(w, r)
			return
		}

		var projectConfig model.ProjectConfig
		var project model.Project
		var users []model.User

		field, _ := r.URL.Query()["field"]
		args, _ := r.URL.Query()["val"]
		filter := filters.FilterBy{
			Field: field[0],
			Args:  args,
		}

		err := a.AppInjection.Provider.QueryListStatement(&projectConfig, filter)
		if err != nil {
			w.WriteHeader(403)
			w.Write([]byte(err.Error()))
			return
		}

		filter = filters.FilterBy{
			Field: "id",
			Args:  []string{strconv.Itoa(projectConfig.ProjectId)},
		}

		err = a.AppInjection.Provider.QueryListStatement(&project, filter)
		if err != nil {
			w.WriteHeader(403)
			w.Write([]byte(err.Error()))
			return
		}

		str := strconv.Itoa(project.UserId)
		filter = filters.FilterBy{
			Field: "id",
			Args:  []string{str},
		}
		err = a.AppInjection.Provider.QueryListStatement(&users, filter)

		if err != nil {
			w.WriteHeader(500)
			w.Write([]byte(err.Error()))
			return
		}

		if len(users) == 0 {
			w.WriteHeader(500)
			w.Write([]byte("No such user"))
			return
		}
		user := users[0]
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := r.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		if len(splitToken) == 1 {
			w.WriteHeader(403)
			return
		}
		reqToken = splitToken[1]
		userNameFromToken, err := ParseToken(reqToken, signingKey)

		if err != nil || user.Email != userNameFromToken {
			w.WriteHeader(403)
			w.Write([]byte(err.Error()))
			return
		}
		next.ServeHTTP(w, r)
	}
}
