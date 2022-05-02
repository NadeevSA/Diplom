package model

import (
	"gorm.io/gorm"
)

type ConfigurationType uint

const (
	Go ConfigurationType = 1
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
}

type Project struct {
	gorm.Model
	ProjectDocId int
	ProjectDoc   ProjectConfig
	Name         string `gorm:"uniqueIndex"`
	Description  string
}
