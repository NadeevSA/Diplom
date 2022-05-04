package main

import (
	"context"
	"engine_app/controllers"
	"engine_app/core"
	"engine_app/database"
	"engine_app/providers"
	"fmt"
	"github.com/docker/docker/client"
	"github.com/gorilla/handlers"
	"github.com/spf13/viper"
	"log"
	"net/http"
)

func main() {
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

	var useAuth = false

	viper.AddConfigPath(".")
	viper.SetConfigName("config")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatal("No config")
	}

	dbOrm, err := database.InitOrmDataBaseConnection(connectionString)

	if err != nil {
		log.Fatal(err)
	}

	db, err := database.InitDataBaseConnection(connectionString)
	if err != nil {
		log.Fatal(err)
	}
	migrator := database.MakeMigrator(dbOrm)

	err = migrator.MigrateAll()

	if err != nil {
		log.Fatal("Migration error: ", err)
	}
	provider := &providers.Provider{
		Db: dbOrm,
	}
	injection := controllers.AppInjection{
		Provider: provider,
	}

	ctx := context.Background()
	cli, _ := client.NewClientWithOpts()
	builder := &core.Builder{
		Cli: cli,
		Ctx: ctx,
	}

	baseCrudController := controllers.BaseCrudController{AppInjection: &injection}

	userController := controllers.UserController{BaseCrudController: &baseCrudController}
	projectConfigController := controllers.ProjectConfigController{BaseCrudController: &baseCrudController}
	builderController := controllers.BuilderController{Provider: provider, Builder: builder}
	projectController := controllers.ProjectController{BaseCrudController: &baseCrudController}
	datafileController := controllers.DataFileController{BaseCrudController: &baseCrudController}
	dataProjectController := controllers.DataProjectController{Db: db}

	app := controllers.App{
		ProjectConfigController: projectConfigController,
		UserController:          userController,
		BuilderController:       builderController,
		ProjectController:       projectController,
		DataFileController:      datafileController,
		DataProjectController:   dataProjectController,
		AppInjection:            &injection,
		UseAuth:                 useAuth,
	}
	router := AddRoutes(&app)

	log.Fatal(http.ListenAndServe(
		":8084",
		handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization", "id"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}),
			handlers.AllowedOrigins([]string{"*"}))(router)))
}
