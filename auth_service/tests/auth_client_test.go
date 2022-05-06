package tests

import (
	"auth/auth"
	"bytes"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"github.com/spf13/viper"
	"io/ioutil"
	"log"
	"net/http"
	"testing"
)

func init() {
	viper.AddConfigPath("../")
	viper.SetConfigName("config")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatal("No config")
	}
}
func Test_Auth(t *testing.T) {

	usernamePtr := flag.String("username", "West", "username")
	passwordPtr := flag.String("pass", "1234", "password")

	flag.Parse()

	if err := createUser(*usernamePtr, *passwordPtr); err != nil {
		t.Fatal(err)
	}

	token, err := authorize(*usernamePtr, *passwordPtr)
	if err != nil {
		t.Fatal(err)
	}
	log.Println(token)

	user, err := auth.ParseToken(token, []byte(viper.GetString("auth.signing_key")))
	if err != nil {
		t.Fatal(err)
	}

	t.Logf("Successfully created and authorized user: %+v", user)
}

func createUser(username, password string) error {
	reqBody := &auth.UserRequest{
		Username: username,
		Password: password,
	}

	resp := new(auth.Response)
	return request(reqBody, resp, "http://localhost:8080/auth/sign-up")
}

func authorize(username, password string) (string, error) {
	reqBody := &auth.UserRequest{
		Username: username,
		Password: password,
	}

	resp := new(auth.Response)
	if err := request(reqBody, resp, "http://localhost:8080/auth/sign-in"); err != nil {
		log.Fatal(err)
	}

	return resp.Token, nil
}

func request(req *auth.UserRequest, res *auth.Response, endpoint string) error {
	reqBodyBytes, err := json.Marshal(req)
	if err != nil {
		return err
	}

	resp, err := http.Post(
		endpoint,
		"application/json",
		bytes.NewBuffer(reqBodyBytes))
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	if err := json.Unmarshal(body, res); err != nil {
		return err
	}

	if res.Status == "error" {
		return errors.New(fmt.Sprintf("error occured on user creation: %s", res.Message))
	}

	return nil
}
