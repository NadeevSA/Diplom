package auth

import (
	"context"
	"crypto/sha1"
	"fmt"
	"github.com/dgrijalva/jwt-go/v4"
	"time"
)

type IAuthorizer interface {
	SignUp(ctx context.Context, user *UserAuth) error
	SignIn(ctx context.Context, user *UserAuth) (string, error)
}

type Authorizer struct {
	repo           Repository
	hashSalt       string
	signingKey     []byte
	expireDuration time.Duration
}

func NewAuthorizer(repo Repository, hashSalt string, signingKey []byte, expireDuration time.Duration) *Authorizer {
	return &Authorizer{
		repo:           repo,
		hashSalt:       hashSalt,
		signingKey:     signingKey,
		expireDuration: expireDuration,
	}
}

func (a *Authorizer) SignUp(ctx context.Context, user *UserAuth) error {
	pwd := sha1.New()
	pwd.Write([]byte(user.Password))
	pwd.Write([]byte(a.hashSalt))
	user.Password = fmt.Sprintf("%x", pwd.Sum(nil))

	return a.repo.Insert(ctx, user)
}

func (a *Authorizer) SignIn(ctx context.Context, user *UserAuth) (string, error) {
	pwd := sha1.New()
	pwd.Write([]byte(user.Password))
	pwd.Write([]byte(a.hashSalt))
	user.Password = fmt.Sprintf("%x", pwd.Sum(nil))

	user, err := a.repo.Get(ctx, user.Email, user.Password)
	if err != nil {
		return "", err
	}
	expiresAt := jwt.At(time.Now().Add(a.expireDuration))

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &Claims{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiresAt,
			IssuedAt:  jwt.At(time.Now()),
		},
		Username: user.Email,
	})

	return token.SignedString(a.signingKey)
}
