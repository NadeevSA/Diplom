package main

import (
	"auth/auth"
	"context"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/spf13/viper"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

func main() {
	viper.AddConfigPath(".")
	viper.SetConfigName("config")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatal("No config")
	}
	port := viper.GetString("port")
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	redisRepo := auth.RedisRepo{Rdb: rdb}
	sec := viper.GetDuration("auth.token_ttl") * time.Second
	authUseCase := auth.NewAuthorizer(
		&redisRepo,
		viper.GetString("auth.hash_salt"),
		[]byte(viper.GetString("auth.signing_key")),
		sec,
	)

	app := &App{
		authUseCase: authUseCase,
	}

	router := gin.Default()

	router.Use(
		gin.Recovery(),
		gin.Logger(),
	)

	api := router.Group("/auth")
	RegisterHTTPEndpoints(api, app.authUseCase)

	app.httpServer = &http.Server{
		Addr:           ":" + port,
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	go func() {
		if err := app.httpServer.ListenAndServe(); err != nil {
			log.Fatalf("Failed to listen and serve: %+v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, os.Interrupt)

	<-quit

	_, shutdown := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdown()
}

type App struct {
	httpServer *http.Server

	authUseCase auth.IAuthorizer
}

func RegisterHTTPEndpoints(router *gin.RouterGroup, authorizer auth.IAuthorizer) {
	h := newHandler(authorizer)

	router.POST("/sign-up", h.signUp)
	router.POST("/sign-in", h.signIn)
}
