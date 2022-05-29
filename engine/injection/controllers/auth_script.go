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
			w.WriteHeader(http.StatusForbidden)
			return
		}
		reqToken = splitToken[1]
		_, err := ParseToken(reqToken, signingKey)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte(err.Error()))
			return
		}
		next.ServeHTTP(w, r)
	}
}

func toStringArr(arr []int) []string {
	strArr := make([]string, len(arr))
	for i := range arr {
		strArr[i] = strconv.Itoa(arr[i])
	}
	return strArr
}

func (a *AuthService) AuthDeleteIntent(next http.HandlerFunc, useAuth bool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !useAuth {
			next.ServeHTTP(w, r)
			return
		}

		var deleteIntent filters.IdsIntent

		var projects []model.Project
		decodeError := Decode(r, &deleteIntent)
		if decodeError != nil {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte(decodeError.Error()))
			return
		}
		stringArr := toStringArr(deleteIntent.Ids)
		filter := filters.FilterBy{
			Field: "ID",
			Args:  stringArr,
		}

		err := a.AppInjection.Provider.QueryListStatement(&projects, filter)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte(err.Error()))
			return
		}

		var users []model.User
		str := strconv.Itoa(projects[0].UserId)
		filter = filters.FilterBy{
			Field: "id",
			Args:  []string{str},
		}
		err = a.AppInjection.Provider.QueryListStatement(&users, filter)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		if len(users) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("No such user"))
			return
		}
		user := users[0]
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := r.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		if len(splitToken) == 1 {
			w.WriteHeader(http.StatusForbidden)
			return
		}
		reqToken = splitToken[1]
		userNameFromToken, err := ParseToken(reqToken, signingKey)

		if err != nil || user.Email != userNameFromToken {
			w.WriteHeader(http.StatusForbidden)
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
		decodeError := Decode(r, &project)
		if decodeError != nil {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte(decodeError.Error()))
			return
		}
		var users []model.User
		str := strconv.Itoa(project.UserId)
		filter := filters.FilterBy{
			Field: "id",
			Args:  []string{str},
		}
		err := a.AppInjection.Provider.QueryListStatement(&users, filter)

		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte(err.Error()))
			return
		}

		if len(users) == 0 {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte("No such user"))
			return
		}
		user := users[0]
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := r.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		if len(splitToken) == 1 {
			w.WriteHeader(http.StatusForbidden)
			return
		}
		reqToken = splitToken[1]
		userNameFromToken, err := ParseToken(reqToken, signingKey)

		if err != nil || user.Email != userNameFromToken {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte(err.Error()))
			return
		}
		next.ServeHTTP(w, r)
	}
}

func (a *AuthService) AuthServiceUserProjectConfig(next http.HandlerFunc, useAuth bool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		r.ParseMultipartForm(32 << 20)
		if !useAuth {
			next.ServeHTTP(w, r)
			return
		}

		var project model.Project
		var users []model.User

		id := r.MultipartForm.Value["ProjectId"][0]

		filter := filters.FilterBy{
			Field: "id",
			Args:  []string{id},
		}
		err := a.AppInjection.Provider.QueryListStatement(&project, filter)

		id = strconv.Itoa(project.UserId)
		filter = filters.FilterBy{
			Field: "id",
			Args:  []string{id},
		}
		err = a.AppInjection.Provider.QueryListStatement(&users, filter)

		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte(err.Error()))
			return
		}
		if len(users) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("No such user"))
			return
		}
		user := users[0]
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := r.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		if len(splitToken) == 1 {
			w.WriteHeader(http.StatusForbidden)
			return
		}
		reqToken = splitToken[1]
		userNameFromToken, err := ParseToken(reqToken, signingKey)

		if err != nil || user.Email != userNameFromToken {
			w.WriteHeader(http.StatusForbidden)
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
			w.WriteHeader(http.StatusForbidden)
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
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		if len(users) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("No such user"))
			return
		}
		user := users[0]
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := r.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		if len(splitToken) == 1 {
			w.WriteHeader(http.StatusForbidden)
			return
		}
		reqToken = splitToken[1]
		userNameFromToken, err := ParseToken(reqToken, signingKey)

		if err != nil || user.Email != userNameFromToken {
			w.WriteHeader(http.StatusForbidden)
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
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte(err.Error()))
			return
		}

		filter = filters.FilterBy{
			Field: "id",
			Args:  []string{strconv.Itoa(projectConfig.ProjectId)},
		}

		err = a.AppInjection.Provider.QueryListStatement(&project, filter)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
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
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		if len(users) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("No such user"))
			return
		}
		user := users[0]
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := r.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		if len(splitToken) == 1 {
			w.WriteHeader(http.StatusForbidden)
			return
		}
		reqToken = splitToken[1]
		userNameFromToken, err := ParseToken(reqToken, signingKey)

		if err != nil || user.Email != userNameFromToken {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte(err.Error()))
			return
		}
		next.ServeHTTP(w, r)
	}
}

func (a *AuthService) AuthCheckUseCanBuildProjectConfig(next http.HandlerFunc, useAuth bool) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		if !useAuth {
			next.ServeHTTP(w, r)
			return
		}
		projectConfigId := r.Header.Get("projectConfigId")
		var projectConfig model.ProjectConfig
		var project model.Project
		var users []model.User

		filter := filters.FilterBy{
			Field: "id",
			Args:  []string{projectConfigId},
		}

		err := a.AppInjection.Provider.QueryListStatement(&projectConfig, filter)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte(err.Error()))
			return
		}

		filter = filters.FilterBy{
			Field: "id",
			Args:  []string{strconv.Itoa(projectConfig.ProjectId)},
		}

		err = a.AppInjection.Provider.QueryListStatement(&project, filter)
		if err != nil {
			w.WriteHeader(http.StatusForbidden)
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
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		if len(users) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("No such user"))
			return
		}
		user := users[0]
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := r.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		if len(splitToken) == 1 {
			w.WriteHeader(http.StatusForbidden)
			return
		}
		reqToken = splitToken[1]
		userNameFromToken, err := ParseToken(reqToken, signingKey)

		if err != nil || user.Email != userNameFromToken {
			w.WriteHeader(http.StatusForbidden)
			w.Write([]byte("author error"))
			return
		}
		next.ServeHTTP(w, r)
	}
}
