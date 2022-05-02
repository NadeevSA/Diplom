package auth

import (
	"github.com/spf13/viper"
	"net/http"
	"strings"
)

func Auth(next http.HandlerFunc, useAuth bool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !useAuth {
			next.ServeHTTP(w, r)
			return
		}
		signingKey := []byte(viper.GetString("auth.signing_key"))
		reqToken := r.Header.Get("Authorization")
		splitToken := strings.Split(reqToken, "Bearer ")
		reqToken = splitToken[1]
		_, err := ParseToken(reqToken, signingKey)
		if err != nil {
			w.WriteHeader(403)
			w.Write([]byte(err.Error()))
			return
		}
		next.ServeHTTP(w, r)
	}
}
