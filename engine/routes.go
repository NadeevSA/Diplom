package main

import (
	"engine_app/injection/controllers"
	"github.com/gorilla/mux"
)

func AddRoutes(app *controllers.App) *mux.Router {
	router := mux.NewRouter()
	auth := app.AuthService

	router.HandleFunc("/user", auth.Auth(app.UserController.GetAllUser, app.AppInjection.UseAuth)).Methods("GET")
	router.HandleFunc("/user", app.UserController.AddUser).Methods("POST")
	router.HandleFunc("/user", auth.Auth(app.UserController.PutUser, app.AppInjection.UseAuth)).Methods("PUT")
	router.HandleFunc("/user", auth.Auth(app.UserController.DeleteUser, app.AppInjection.UseAuth)).Methods("DELETE")
	router.HandleFunc("/user/filter", auth.Auth(app.UserController.GetFilteredUser, app.AppInjection.UseAuth)).Methods("GET")
	router.HandleFunc("/user/info", app.UserController.UserInfo).Methods("GET")

	router.HandleFunc("/project_config", app.ProjectConfigController.GetAllProjectConfig).Methods("GET")
	router.HandleFunc("/project_config", auth.AuthServiceUserProjectConfig(app.ProjectConfigController.AddProjectConfig, app.AppInjection.UseAuth)).Methods("POST")
	router.HandleFunc("/project_config", auth.AuthServiceUserProjectConfig(app.ProjectConfigController.PutProjectConfig, app.AppInjection.UseAuth)).Methods("PUT")
	router.HandleFunc("/project_config", auth.AuthServiceUserProjectConfig(app.ProjectConfigController.DeleteProjectConfig, app.AppInjection.UseAuth)).Methods("DELETE")
	router.HandleFunc("/project_config/filter", app.ProjectConfigController.GetFilteredProjectConfig).Methods("GET")
	router.HandleFunc("/project_config/file", app.ProjectConfigController.AddProjectConfigFiles).Methods("POST")

	router.HandleFunc("/builder/build", app.AuthService.AuthCheckUseCanBuildProjectConfig(app.BuilderController.BuildProjectDoc, app.AppInjection.UseAuth)).Methods("POST")
	router.HandleFunc("/builder/run", app.BuilderController.RunProjectDoc).Methods("POST")
	router.HandleFunc("/builder/attach", app.BuilderController.AttachProjectDoc).Methods("POST")
	router.HandleFunc("/builder/attach/data", app.BuilderController.AttachProjectDocData).Methods("POST")
	router.HandleFunc("/builder/status", app.BuilderController.GetStatusProjectConfig).Methods("GET")
	router.HandleFunc("/builder/is_running", app.BuilderController.GetProjectConfigRunned).Methods("GET")

	router.HandleFunc("/project", app.ProjectController.GetAllProject).Methods("GET")
	router.HandleFunc("/project", auth.AuthCheckUserProjectBody(app.ProjectController.AddProject, app.AppInjection.UseAuth)).Methods("POST")
	router.HandleFunc("/project", auth.AuthCheckUserProjectBody(app.ProjectController.PutProject, app.AppInjection.UseAuth)).Methods("PUT")
	router.HandleFunc("/project", auth.AuthCheckUserProjectBody(app.ProjectController.DeleteProject, app.AppInjection.UseAuth)).Methods("DELETE")
	router.HandleFunc("/project/filter", app.ProjectController.GetFilteredProject).Methods("GET")

	router.HandleFunc("/docker_config/all", app.DockerConfigController.GetAllDockerConfigs).Methods("GET")
	router.HandleFunc("/docker_config", app.DockerConfigController.AddDockerConfig).Methods("POST")

	router.HandleFunc("/data", app.DataFileController.GetAllDataFile).Methods("GET")
	router.HandleFunc("/data", app.DataFileController.AddDataFile).Methods("POST")
	router.HandleFunc("/data", app.DataFileController.DeleteDataFile).Methods("DELETE")
	router.HandleFunc("/data/filter", app.DataFileController.GetFilteredDataFile).Methods("GET")
	router.HandleFunc("/data/filter/project_config", app.DataFileController.GetFilteredDataFileByProjectId).Methods("GET")
	router.HandleFunc("/data/content", app.DataFileController.GetDataFileContent).Methods("GET")

	router.HandleFunc("/project_data", app.DataProjectController.AddDataProject).Methods("POST")
	router.HandleFunc("/project_data", app.DataProjectController.DeleteDataProject).Methods("DELETE")
	router.HandleFunc("/project_data", app.DataProjectController.GetDataProject).Methods("GET")

	return router
}
