import React, { useState, Fragment, useEffect } from "react";
import styles from "../../App.module.scss";
import Stack from "@mui/material/Stack";
import LoadingOverlay from "react-loading-overlay";
import axios from "../../Api.js";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState(null);
  const [location, setLocation] = useState(null);
  const [day, setDay] = useState(null);
  //下拉式選單內容
  const [locationList, setLocationList] = useState(null);

  useEffect(async () => {
    console.log("location", location);
    console.log("day", day);
    if (location == "null") {
      location = null;
    }
    setIsLoading(true);
    let details = {
      location: location,
      days: day,
    };
    let { data } = await axios({
      method: "get",
      url: `/api/pickpack/getQuotaExceeded`,
      params: details,
    });
    setContacts(data.data);
  }, [day, location]);

  useEffect(async () => {
    setIsLoading(false);
  }, [contacts]);

  useEffect(async () => {
    if (locationList == null) {
      let { data } = await axios({
        method: "get",
        url: `/api/pickpack/getPickLocationGroupList`,
      });
      setLocationList(data.data);
    }
  });

  // 1.下拉式選單
  const handleChangeLocation = async (event) => {
    event.preventDefault();
    console.log("--- handleChangeLocation --- ");
    if (event.target.value === "null") {
      setLocation(null);
    } else {
      setLocation(event.target.value);
    }
  };

  // 1.下拉式選單
  const handleChangeDay = async (event) => {
    event.preventDefault();
    console.log("--- handleChangeDay --- ");
    if (event.target.value === "null") {
      setDay(null);
    } else {
      setDay(event.target.value);
    }
  };

  return (
    <>
      <div class={styles["app-choose"]}>
        <LoadingOverlay
          active={isLoading}
          spinner
          text="Loading..."
          class="loadMask"
        >
          <Stack spacing={1} direction="row">
            <h5 class={styles["text"]}> loaction group : </h5>
            <select class={styles["select"]} onChange={handleChangeLocation}>
              <option value="null">All</option>
              {locationList != null ? (
                locationList.map((dropdown) => {
                  return <option value={dropdown}>{dropdown}</option>;
                })
              ) : (
                <option value="SCS">SCS</option>
              )}
            </select>
            <h5 class={styles["text"]}>day of week : </h5>
            <select
              class={styles["select"]}
              defaultValue="14"
              onChange={handleChangeDay}
            >
              <option value="7">7</option>
              <option value="14">14</option>
              <option value="21">21</option>
              <option value="28">28</option>
            </select>
          </Stack>
        </LoadingOverlay>
      </div>
      <div class={styles["app-container-exceeded"]}>
        <form class={styles["form"]}>
          <table class={styles["table"]}>
            <thead>
              <tr>
                <th class={styles["th"]}>LocationGroup</th>
                <th class={styles["th"]}>Slot</th>
                <th class={styles["th"]}>Quota</th>
                <th class={styles["th"]}>Consumed</th>
                <th class={styles["th"]}>Left</th>
              </tr>
            </thead>
            <tbody>
              {contacts != null ? (
                contacts.map((contact) => (
                  <Fragment>
                    <tr>
                      <td class={styles["td"]}>{contact.location}</td>
                      <td class={styles["td"]}>{contact.slot}</td>
                      <td class={styles["td"]}>{contact.quota}</td>
                      <td class={styles["td"]}>{contact.consumed}</td>
                      <td class={styles["td"]}>{contact.left}</td>
                      <td class={styles["td_blank"]}></td>
                      {/** 為了排版 不知道為啥 最後一個會變形*/}
                    </tr>
                  </Fragment>
                ))
              ) : (
                <Fragment></Fragment>
              )}
            </tbody>
          </table>
        </form>
      </div>
    </>
  );
};

export default App;
