package provider_tests

import (
	"engine_app/controllers/filters"
	"engine_app/core"
	"engine_app/database"
	"engine_app/database/model"
	"engine_app/providers"
	"fmt"
	"gorm.io/gorm"
	"log"
	"testing"
)

var migrator database.IMigrator
var db *gorm.DB
var provider providers.Provider

func init() {
	host := "localhost"
	user := "postgres"
	password := "postgres"
	dbName := "postgres"
	port := "5432"
	sslMode := "disable"

	var connectionString = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host,
		port,
		user,
		password,
		dbName,
		sslMode)

	db, _ = database.InitDataBase(connectionString)

	migrator = database.MakeMigrator(db)
	provider = providers.Provider{Db: db}
}

func Test_Add(t *testing.T) {
	db.AutoMigrate(&model.User{})

	var user = model.User{
		Name:  "Andrew",
		Email: "Email",
	}

	err := provider.AddStatement(&user)
	if err != nil {
		t.Fatal(err)
	}

}

func TestCanMigrate(t *testing.T) {
	migrator.MigrateAll()
}

func TestBuildString(t *testing.T) {
	id := "id"
	in := "12"
	str := fmt.Sprintf("%s IN ?", id)
	args := []string{fmt.Sprintf("%s", in)}
	log.Println(str)
	log.Println(args)
}

func Test_Query(t *testing.T) {
	field := "id"

	filter := filters.FilterBy{
		Field: field,
		Args:  []string{"4", "5"},
	}
	var users []model.User
	err := provider.QueryListStatement(&users, filter)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(users)
}

func Test_Del(t *testing.T) {
	var users []model.User
	err := provider.DeleteStatement(users, []int{1, 2, 3, 4})
	if err != nil {
		log.Fatal(err)
	}
	log.Println(users)
}

func Test_GetAll(t *testing.T) {
	var users []model.User
	err := provider.QueryListStatementAll(&users)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(users)
}

func Test_CanUnzipFromModel(t *testing.T) {
	var projectConfigs []model.ProjectConfig
	err := provider.QueryListStatementAll(&projectConfigs)
	if err != nil {
		t.Fatal(err)
	}
	bytes := projectConfigs[0].File
	name := projectConfigs[0].Name
	err = core.CopyBytesToFile(bytes, name, "temp")
	if err != nil {
		t.Fatal(err)
	}
}
