package database

import (
	"database/sql"
	_ "github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitOrmDataBaseConnection(connectionString string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{})

	return db, err
}

func InitDataBaseConnection(connectionString string) (*sql.DB, error) {
	db, err := sql.Open("postgres", connectionString)
	return db, err
}
