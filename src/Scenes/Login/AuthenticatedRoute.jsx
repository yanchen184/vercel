import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import AuthenticationService from "./AuthenticationService.js";

class AuthenticatedRoute extends Component {
  render() {
    // return <Route {...this.props} />
    return AuthenticationService.isUserLoggedIn() ? (
      this.props
    ) : (
      <Navigate to="/" />
    );
  }
}

export default AuthenticatedRoute;
