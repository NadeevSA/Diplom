package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDataBase(connectionString string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{})

	return db, err
}
