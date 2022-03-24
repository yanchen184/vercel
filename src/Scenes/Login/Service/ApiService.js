import axios from "axios";

export function postLogin(username, password) {
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



