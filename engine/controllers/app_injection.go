package controllers

import (
	"engine_app/core"
	"engine_app/providers"
)

type App struct {
	ProjectConfigController ProjectConfigController
	UserController          UserController
	BuilderController       BuilderController
	ProjectController       ProjectController
	DataFileController      DataFileController
	UseAuth                 bool
	AppInjection            *AppInjection
	Builder                 *core.Builder
}

type AppInjection struct {
	Provider *providers.Provider
}
