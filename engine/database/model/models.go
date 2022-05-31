package model

type Status uint

const (
	Loaded Status = 0
	Build  Status = 1
)

type ConfigurationType uint

const (
	Go  ConfigurationType = 1
	Cpp ConfigurationType = 2
)

type DockerConfig struct {
	ID          uint `gorm:"primaryKey"`
	Config      ConfigurationType
	Description string
	File        []byte
}

type User struct {
	ID    uint `gorm:"primaryKey"`
	Name  string
	Email string `gorm:"uniqueIndex"`
}

type ProjectConfig struct {
	ID           uint `gorm:"primaryKey"`
	BuildCommand string
	Name         string `gorm:"uniqueIndex"`
	RunFile      string
	PathToEntry  string
	ProjectFile  string
	File         []byte

	ProjectId int
	Project   Project

	DockerConfigId int
	DockerConfig   DockerConfig
	Status         Status

	Data []Data `gorm:"many2many:project_config_data;"`
}

type Project struct {
	ID     uint   `gorm:"primaryKey"`
	Name   string `gorm:"uniqueIndex"`
	Author string

	UserId int
	User   User

	Description string
}

type TimeProjectData struct {
	ProjectId int `gorm:"primaryKey"`
	Project   Project

	Author string `gorm:"primaryKey"`
	DataId int    `gorm:"primaryKey"`
	Data   Data

	Duration float64
}

type Data struct {
	ID       uint `gorm:"primaryKey"`
	Label    string
	FileName string
	File     []byte

	Author        string
	ProjectConfig []ProjectConfig `gorm:"many2many:project_config_data;"`
}
