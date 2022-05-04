package model

import (
	"gorm.io/gorm"
)

type Status uint

const (
	Loaded Status = 0
	Build  Status = 1
	Runned Status = 2
)

type ConfigurationType uint

const (
	Go  ConfigurationType = 1
	Cpp ConfigurationType = 2
)

type User struct {
	gorm.Model
	Name     string
	Email    string    `gorm:"uniqueIndex"`
	Projects []Project `gorm:"many2many:user_projects;"`
}

type ProjectConfig struct {
	gorm.Model
	BuildCommand      string
	Name              string `gorm:"uniqueIndex"`
	RunFile           string
	PathToEntry       string
	ProjectFile       string
	File              []byte
	ConfigurationType ConfigurationType
	Status            Status
}

type Project struct {
	gorm.Model
	ProjectDocId int
	ProjectDoc   ProjectConfig
	Name         string `gorm:"uniqueIndex"`
	Description  string
}
