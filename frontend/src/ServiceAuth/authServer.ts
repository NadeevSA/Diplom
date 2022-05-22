import axios from "axios";
import { Session } from "inspector";
const instance = axios.create({
  baseURL: "http://localhost:8080/auth",
});

const instance1 = axios.create({
  baseURL: "http://localhost:8084",
});

class AuthService {
  login(username: string | null, password: string | null) {
    if(username == null || password == null) return;
    return instance.post<UserAuth>(
      'sign-in',
      { username: username, password: password},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      },
    ).then(response => {
      if (response.data.status == "ok") {
        sessionStorage.setItem("user", JSON.stringify(response.data.token));
      }
  });
  }
  logout() {
    sessionStorage.removeItem("user");
  }
  register(username: string | null, password: string | null) {
    if(username == null || password == null) return;
    return instance.post<UserAuth>(
      'sign-up',
      { username: username, password: password},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      },
    );
  }
  registerUser(name: string | null, email: string | null) {
    if(name == null || email == null) return;
    return instance1.post<User>(
      'user',
      { Name: name, Email: email},
    )
  }
  getToken() {
    const userStr = sessionStorage.getItem("user");
    if (userStr) return (JSON.parse(userStr) as string);
    return "";
  }
  getUserName() {
    return instance1.get<User>(
      'user/info',
      {headers: {Authorization : `Bearer ${this.getToken()}`}},
    )
  }
}

interface UserAuth {
  username: string,
  password: string,
  status?: string,
  token?: string,
}

interface User {
  ID: string,
  Name: string,
  Email: string,
}

export default new AuthService();