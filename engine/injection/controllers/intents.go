package controllers

import (
	"engine_app/core"
	"engine_app/providers"
)

type AttachIntent struct {
	Name  string `json:"name"`
	Input string `json:"input"`
}

type AttachIntentData struct {
	Name   string `json:"name"`
	DataId string `json:"data_id"`
}

type BuilderController struct {
	Provider *providers.Provider
	Builder  *core.Builder
}

type RunProjectIntent struct {
	Id            string `json:"id"`
	ContainerName string `json:"container_name"`
}
