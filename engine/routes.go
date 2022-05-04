package main

import (
	"engine_app/auth"
	"engine_app/controllers"
	"github.com/gorilla/mux"
)

func AddRoutes(app *controllers.App) *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/user", auth.Auth(app.UserController.GetAllUser, app.UseAuth)).Methods("GET")
	router.HandleFunc("/user", app.UserController.AddUser).Methods("POST")
	router.HandleFunc("/user", app.UserController.PutUser).Methods("PUT")
	router.HandleFunc("/user", app.UserController.DeleteUser).Methods("DELETE")
	router.HandleFunc("/user/filter", auth.Auth(app.UserController.GetFilteredUser, app.UseAuth)).Methods("GET")

	router.HandleFunc("/project_config", app.ProjectConfigController.GetAllProjectConfig).Methods("GET")
	router.HandleFunc("/project_config", app.ProjectConfigController.AddProjectConfig).Methods("POST")
	router.HandleFunc("/project_config", app.ProjectConfigController.PutProjectConfig).Methods("PUT")
	router.HandleFunc("/project_config", app.ProjectConfigController.DeleteProjectConfig).Methods("DELETE")
	router.HandleFunc("/project_config/filter", app.ProjectConfigController.GetFilteredProjectConfig).Methods("GET")
	router.HandleFunc("/project_config/status", app.ProjectConfigController.GetStatusProjectConfig).Methods("GET")

	router.HandleFunc("/project_config/file", app.ProjectConfigController.AddProjectConfigFiles).Methods("POST")
	router.HandleFunc("/project_config/build", app.BuilderController.BuildProjectDoc).Methods("POST")
	router.HandleFunc("/project_config/run", app.BuilderController.RunProjectDoc).Methods("POST")
	router.HandleFunc("/project_config/attach", app.BuilderController.AttachProjectDoc).Methods("POST")
	router.HandleFunc("/project_config/attach/data", app.BuilderController.AttachProjectDocData).Methods("POST")

	router.HandleFunc("/project", app.ProjectController.GetAllProject).Methods("GET")
	router.HandleFunc("/project", app.ProjectController.AddProject).Methods("POST")
	router.HandleFunc("/project", app.ProjectController.PutProject).Methods("PUT")
	router.HandleFunc("/project", app.ProjectController.DeleteProject).Methods("DELETE")
	router.HandleFunc("/project/filter", auth.Auth(app.ProjectController.GetFilteredProject, app.UseAuth)).Methods("GET")

	router.HandleFunc("/data", app.DataFileController.GetAllDataFile).Methods("GET")
	router.HandleFunc("/data", app.DataFileController.AddDataFile).Methods("POST")
	router.HandleFunc("/data", app.DataFileController.DeleteDataFile).Methods("DELETE")
	router.HandleFunc("/data/filter", auth.Auth(app.DataFileController.GetFilteredDataFile, app.UseAuth)).Methods("GET")

	router.HandleFunc("/project_data", app.DataProjectController.AddDataProject).Methods("POST")
	router.HandleFunc("/project_data", app.DataProjectController.DeleteDataProject).Methods("DELETE")
	router.HandleFunc("/project_data", app.DataProjectController.GetDataProject).Methods("GET")

	return router
}
