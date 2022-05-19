import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:8080/auth",
});

class AuthService {
  login(username: string, password: string) {
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
        console.log("s");
        if (response.data.status == "ok") {
          console.log("1");
          localStorage.setItem("user", JSON.stringify(response.data.token));
        }
    });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username: string, password: string) {
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
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    console.log("userStr", userStr);
    if (userStr) return JSON.parse(userStr);
    return null;
  }
}

interface UserAuth {
  username: string,
  password: string,
  status?: string,
  token?: string,
}

export default new AuthService();