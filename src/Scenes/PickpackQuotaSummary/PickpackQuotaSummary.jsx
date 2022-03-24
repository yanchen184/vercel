import React, { useState, Fragment, useEffect } from "react";
import styles from "../../App.module.scss";
import Stack from "@mui/material/Stack";
import LoadingOverlay from "react-loading-overlay";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import axios from "../../Api.js";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState(null);
  const [days, setDays] = useState(7);

  //下拉式選單的location group
  const [location, setLocation] = useState(null);
  //下拉式選單內容
  const [locationList, setLocationList] = useState(null);

  const marks = [
    {
      value: 1,
      label: "1",
    },
    {
      value: 7,
      label: "7",
    },
    {
      value: 14,
      label: "14",
    },
    {
      value: 21,
      label: "21",
    },
  ];

  //渲染後call api 獲得LocationGroupList 製作下拉式選單
  useEffect(async () => {
    if (locationList == null) {
      let { data } = await axios({
        method: "get",
        url: `/api/pickpack/getPickLocationGroupList`,
      });
      setLocationList(data.data);
    }
  });
  useEffect(async () => {
    console.log("day", days);
    setIsLoading(true);
    let fullContacts = [];
    for (var i = 0; i < days; i++) {
      let day = new Date();
      day.setTime(day.getTime() + i * 24 * 60 * 60 * 1000);
      let contact = {
        date:
          day.getFullYear() +
          "-" +
          (day.getMonth() + 1 < 10
            ? "0" + (day.getMonth() + 1)
            : day.getMonth() + 1) +
          "-" +
          (day.getDate() < 10 ? "0" + day.getDate() : day.getDate()),
        quota: "N/A",
        consumed: "N/A",
        left: "N/A",
      };
      fullContacts.push(contact);
    }
    if (location == "null") {
      location = null;
    }
    let details = {
      days: days,
      location: location,
    };
    let { data } = await axios({
      method: "get",
      url: `/api/pickpack/getQuotaSummary`,
      params: details,
    });

    data.data.map((data) => {
      fullContacts.map((fullContact) => {
        if (data.date == fullContact.date) {
          fullContact.quota = data.quota;
          fullContact.consumed = data.consumed;
          fullContact.left = data.left;
        }
      });
    });
    setContacts(fullContacts);
  }, [days, location]);

  useEffect(async () => {
    setIsLoading(false);
  }, [contacts]);

  // 1.下拉式選單
  const handleChange = async (event) => {
    event.preventDefault();
    console.log("--- handleChange --- ", event.target.value);
    // 存取哪個group 到時候save要用
    setLocation(event.target.value);
  };

  function valuetext(value) {
    setDays(value);
    return `${value}`;
  }

  return (
    <>
      <div class={styles["app-choose"]}>
        <LoadingOverlay
          active={isLoading}
          spinner
          text="Loading..."
          className="loadMask"
        >
          <div class={styles["app-s"]}>
            <Stack spacing={10} direction="row">
              <h5 class={styles["text"]}>day : </h5>
              <Box sx={{ width: 400 }}>
                <Slider
                  aria-label="Custom marks"
                  defaultValue={7}
                  getAriaValueText={valuetext}
                  step={null}
                  valueLabelDisplay="on"
                  marks={marks}
                  min={0}
                  max={21}
                />
              </Box>
              <select class={styles["select"]} onChange={handleChange}>
                <option value="null">All</option>
                {locationList != null ? (
                  locationList.map((dropdown) => {
                    return <option value={dropdown}>{dropdown}</option>;
                  })
                ) : (
                  <option value="SCS">SCS</option>
                )}
              </select>
            </Stack>
          </div>
        </LoadingOverlay>
      </div>
      <div class={styles["app-container-exceeded"]}>
        <form class={styles["form"]}>
          <table class={styles["table"]}>
            <thead>
              <tr>
                <th class={styles["th"]}>Date</th>
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
                      <td class={styles["td"]}>{contact.date}</td>
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
