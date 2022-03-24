class AuthenticationService {
  registerSuccessfulLogin(username, password) {
    sessionStorage.setItem("authenticatedUser", username);
  }
  //TODO
  logout() {
    sessionStorage.removeItem("authenticatedUser");
    sessionStorage.removeItem("admin");
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem("authenticatedUser");

    console.log("user : " + user);
    return user === null ? false : true;
  }

  adminLogin(username) {
    sessionStorage.setItem("admin", username);
    sessionStorage.setItem("authenticatedUser", username);
  }

  isAdmin() {
    let admin = sessionStorage.getItem("admin");
    return admin === null ? false : true;
  }
}

export default new AuthenticationService();
