package main

import (
	"context"
	"engine_app/core"
	"engine_app/database"
	"engine_app/database/model"
	controllers2 "engine_app/injection/controllers"
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
	useAuth := true
	usePreload := true

	var connectionString = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host,
		port,
		user,
		password,
		dbName,
		sslMode)

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
		return
	}
	provider := &providers.Provider{
		Db: dbOrm,
	}
	injection := controllers2.AppInjection{
		Provider: provider,
		Db:       db,
		UseAuth:  useAuth,
	}

	ctx := context.Background()
	cli, _ := client.NewClientWithOpts()
	builder := &core.Builder{
		Cli: cli,
		Ctx: ctx,
	}

	if usePreload {
		LoadDefaultDataToDataBase(provider)
	}

	baseCrudController := controllers2.BaseCrudController{AppInjection: &injection}

	authService := controllers2.AuthService{AppInjection: &injection}
	userController := controllers2.UserController{BaseCrudController: &baseCrudController}
	projectConfigController := controllers2.ProjectConfigController{BaseCrudController: &baseCrudController}
	builderController := controllers2.BuilderController{Provider: provider, Builder: builder}
	projectController := controllers2.ProjectController{BaseCrudController: &baseCrudController}
	datafileController := controllers2.DataFileController{BaseCrudController: &baseCrudController}
	dockerConfigsController := controllers2.DockerConfigController{AppInjection: &injection}
	dataProjectController := controllers2.DataProjectController{Db: db}

	app := controllers2.App{
		ProjectConfigController: projectConfigController,
		UserController:          userController,
		BuilderController:       builderController,
		ProjectController:       projectController,
		DataFileController:      datafileController,
		DataProjectController:   dataProjectController,
		DockerConfigController:  dockerConfigsController,
		AuthService:             authService,
		AppInjection:            &injection,
	}
	router := AddRoutes(&app)

	log.Fatal(http.ListenAndServe(
		":8084",
		handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization", "projectConfigId"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}),
			handlers.AllowedOrigins([]string{"*"}))(router)))
}

func LoadDefaultDataToDataBase(provider *providers.Provider) {
	LoadDefaultGolangDockerConfig(provider)
}

func LoadDefaultGolangDockerConfig(provider *providers.Provider) {
	bytes, err := core.ReadFile("dockerfiles\\go.DockerFile")

	var goDockerConfig model.DockerConfig

	provider.Db.First(&goDockerConfig, "description = ?", "Конфигурация по умолчанию для сборки на языке go")
	if goDockerConfig.Description == "Конфигурация по умолчанию для сборки на языке go" {
		return
	}

	goDockerConfig = model.DockerConfig{
		Config:      model.ConfigurationType(1),
		Description: "Конфигурация по умолчанию для сборки на языке go",
		File:        bytes,
	}

	err = provider.AddStatement(&goDockerConfig)
	if err != nil {
		log.Fatal(err)
		return
	}
}
