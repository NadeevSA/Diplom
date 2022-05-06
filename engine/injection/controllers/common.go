package controllers

import (
	"errors"
	"fmt"
	"github.com/dgrijalva/jwt-go/v4"
)

type UserAuth struct {
	Email    string `json:"username"`
	Password string `json:"password"`
}

type Claims struct {
	jwt.StandardClaims
	Username string `json:"username"`
}

func ParseToken(accessToken string, signingKey []byte) (string, error) {
	token, err := jwt.ParseWithClaims(accessToken, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return signingKey, nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims.Username, nil
	}

	return "", ErrInvalidAccessToken
}

var ErrInvalidAccessToken = errors.New("invalid auth token")
var ErrUserDoesNotExist = errors.New("user does not exist")
var ErrUserAlreadyExists = errors.New("user with such credentials already exist")

type Response struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Token   string `json:"token"`
}

type UserRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
