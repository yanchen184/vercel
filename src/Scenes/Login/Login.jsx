import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { CardActions } from "@material-ui/core";
import { postLogin } from "./Service/ApiService";
import Notification from "../../Common/Components/Notification/Notification";
import Loading from "../../Common/Components/Loading/Loading";
import Frs from "../../Common/img/frs-icon.png";
import axios from "axios";
import styles from "./Login.module.scss";

const textFieldStyle = {
  margin: "10px auto",
  fontSize: "17px",

  minWidth: "85%",
  minHeight: "20px",
};

const style = {
  login: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
  },
  card: {
    width: "25vw",
    height: "47vh",
    borderRadius: "10px",
  },
  content: {
    minHeight: "100%",
    padding: "0 24px !important",
  },
  media: {
    height: "14vh",
    backgroundSize: "contain",
    padding: "11px",
  },
  inputField: {
    display: "flex",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px 15px 0 15px",
  },
  machineId: {
    color: "darkgray",
    textTransform: "uppercase",
  },
  username: textFieldStyle,
  password: textFieldStyle,
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.loginButtonRef = React.createRef();
    this.showNotify = this.showNotify.bind(this);
    this.handleNotifyClose = this.handleNotifyClose.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.state = {
      fetchingUser: false,
      callingApi: false,
      showPassword: false,
      username: "",
      password: "",
      notification: "", // Check if error message is passed to show
      // notification: this.props.location.notification // Check if error message is passed to show
    };
  }

  handleNotifyClose() {
    this.setState({
      notification: "",
    });
  }

  showNotify = (message) => {
    this.setState({
      notification: message,
    });
  };

  getLocationFrom = () => {
    // let {from} = this.props.location.state || {from: {pathname: "/pickpackQuota"}}
    let { from } = { from: { pathname: "/pickpackQuota" } };

    return from;
  };

  postLogin(username, password) {
    console.log("username : " + username);
    console.log("password : " + password);

    let formBody = [];
    if (username == null || password == null) {
      return false;
    }

    let details = {
      username: username,
      password: password,
    };
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    return axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/login`,
      params: details,
    });
  }

  postLogin = () => {
    postLogin(this.state.username, this.state.password)
      .then((response) => {
        console.log("response1: ", response);
        console.log("response1: ", response.data);
        if (response.status !== 200 && response.status !== 400) {
          throw new Error(response.status + " " + response.statusText);
        }
        sessionStorage.setItem("authenticatedUser", response.data);
        return response;
      })
      .then((response) => {
        console.log("response2: ", response);
        if (response.description) {
          throw new Error(response.description);
        }
        if (response.data != []) {
          // fix nav bar not refresh issue
          window.location.reload();
        } else {
          throw new Error("Unauthorized Login");
        }
      })
      .catch((err) => {
        this.showNotify(err.toString());
      })
      .finally(() => {
        this.setState({
          callingApi: false,
        });
      });
  };

  // handleKeyDown only when login page && Login button not disable
  handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !(
        this.state.username === "" ||
        this.state.password === "" ||
        this.state.callingApi
      )
    ) {
      try {
        this.loginButtonRef.current.click();
      } catch (e) {
        console.error(e);
      }
    }
  };

  handleLogin = (event) => {
    event.preventDefault();
    this.setState({ callingApi: true }, () => this.postLogin());
  };

  handleChange = (prop) => (event) => {
    this.setState({ [prop]: event.target.value });
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState((state) => ({ showPassword: !state.showPassword }));
  };

  render() {
    const { classes } = this.props;

    if (this.state.fetchingUser) {
      return <Loading />;
    }
    return (
      <div className={classes.login}>
        {this.state.notification ? (
          <Notification
            notification={this.state.notification}
            onClose={this.handleNotifyClose}
          />
        ) : null}
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <img class={styles["cardPicture"]} src={Frs} alt="Frs"></img>
            <div className={classes.inputField}>
              <TextField
                id="username"
                label="Username"
                placeholder="Username"
                className={classes.username}
                autoFocus={true}
                onChange={this.handleChange("username")}
              />
            </div>
            <div className={classes.inputField}>
              <FormControl className={classes.password}>
                <InputLabel htmlFor="adornment-password">Password</InputLabel>
                <Input
                  id="adornment-password"
                  type={this.state.showPassword ? "text" : "password"}
                  value={this.state.password}
                  onChange={this.handleChange("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                      >
                        {this.state.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
            <CardActions className={classes.buttonWrapper}>
              <Button
                variant="contained"
                color="primary"
                className={classes.loginButton}
                size="medium"
                onClick={this.handleLogin}
                disabled={
                  this.state.username === "" ||
                  this.state.password === "" ||
                  this.state.callingApi
                }
              >
                {/** Material Ui Button Click Hack **/}
                <span ref={this.loginButtonRef}>Login</span>
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default withStyles(style)(Login);
