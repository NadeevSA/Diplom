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

	db, err := database.InitDataBase(connectionString)
	if err != nil {
		log.Fatal(err)
	}
	migrator := database.MakeMigrator(db)

	err = migrator.MigrateAll()

	if err != nil {
		log.Fatal(err)
	}
	provider := &providers.Provider{
		Db: db,
	}
	injection := controllers.AppInjection{
		provider,
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

	app := controllers.App{
		ProjectConfigController: projectConfigController,
		UserController:          userController,
		BuilderController:       builderController,
		ProjectController:       projectController,
		AppInjection:            &injection,
		UseAuth:                 useAuth,
	}
	router := AddRoutes(&app)

	log.Fatal(http.ListenAndServe(
		":8084",
		handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}),
			handlers.AllowedOrigins([]string{"*"}))(router)))
}
