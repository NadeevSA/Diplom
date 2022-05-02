package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis/v8"
)

type Repository interface {
	Insert(ctx context.Context, user *UserAuth) error
	Get(ctx context.Context, username, password string) (*UserAuth, error)
}

type RedisRepo struct {
	Rdb *redis.Client
}

func (rd *RedisRepo) Insert(ctx context.Context, user *UserAuth) error {
	key := fmt.Sprintf("%s:%s", user.Email, user.Password)
	p, err := json.Marshal(user)
	err = rd.Rdb.Set(ctx, key, p, 0).Err()
	return err
}

func (rd *RedisRepo) Get(ctx context.Context, username, password string) (*UserAuth, error) {
	var res UserAuth
	key := fmt.Sprintf("%s:%s", username, password)
	r, err := rd.Rdb.Get(ctx, key).Bytes()
	err = json.Unmarshal(r, &res)
	return &res, err
}
