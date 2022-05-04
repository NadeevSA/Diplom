package model

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

	ConfigurationType ConfigurationType
	Status            Status
}

type Project struct {
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"uniqueIndex"`

	UserId int
	User   User

	Description string
}

type Data struct {
	ID          uint `gorm:"primaryKey"`
	Description string
	File        []byte

	ProjectConfig []ProjectConfig `gorm:"many2many:project_config_data;"`
}
