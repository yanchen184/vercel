import React, { useState, Fragment, useEffect } from "react";
import styles from "../../App.module.scss";
import Swal from "sweetalert2";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import LoadingOverlay from "react-loading-overlay";
import axios from "../../Api.js";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [dialogOpen, setDialogOpenOpen] = useState(false);
  const handleDialogClickOpen = (event) => {
    event.preventDefault();
    setDialogOpenOpen(true);
  };
  const handleDialogClose = (event) => {
    event.preventDefault();
    setDialogOpenOpen(false);
  };
  const [contacts, setContacts] = useState(null);
  const [oldContacts, setOldContacts] = useState(null);
  const [location, setLocation] = useState(null);
  const [day, setDay] = useState(null);
  const [date, setDate] = useState(null);
  //下拉式選單內容
  const [locationList, setLocationList] = useState(null);

  useEffect(async () => {
    console.log("location", location);
    console.log("day", day);
    setIsLoading(true);
    let details = {
      productLocationGroup: location,
      dayOfWeek: day,
      date: date,
    };
    let { data } = await axios({
      method: "get",
      url: `/api/pickpack/getPickLocationInitValueList`,
      params: details,
    });
    setContacts(data.data);
    setOldContacts(JSON.parse(JSON.stringify(data.data)));
  }, [day, location, date]);

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
      setLocation(data.data[0]);
    }
  });

  // 1.下拉式選單
  // 2.編輯quota
  // 3.save
  // 4.save -> ok
  // 5.cancel

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

  // 1.下拉式選單
  const handleChangeDate = async (event) => {
    event.preventDefault();
    console.log("--- handleChangeDate --- ", event.target.value);
    if (event.target.value === "null") {
      setDate(null);
    } else {
      setDate(event.target.value);
    }
  };

  // 2.編輯quota
  const handleEditFormChange = (e) => {
    e.preventDefault();
    console.log("--- handleEditFormChange --- ");
    const updateData = contacts.map((contact) =>
      contact.date == e.target.name.substring(0, 2) &&
      contact.dayOfWeek == e.target.name.substring(2, 3) &&
      contact.locationGroup == e.target.name.substring(3)
        ? {
            date: contact.date,
            dayOfWeek: contact.dayOfWeek,
            locationGroup: contact.locationGroup,
            quota: e.target.value,
          }
        : contact
    );
    setContacts(updateData);
  };

  // 3. save
  const ShowDialog = (e) => {
    // e.preventDefault();
    // 更動的內容
    let showLists = "";
    if (dialogOpen) {
      let changeList = [];
      if (contacts != null && oldContacts != null) {
        for (var i = 0; i < contacts.length; i++) {
          if (oldContacts[i].quota != contacts[i].quota) {
            changeList.push(
              "location: " +
                contacts[i].locationGroup +
                " dayOfWeek: " +
                contacts[i].dayOfWeek +
                " date: " +
                contacts[i].date +
                " 的quota: " +
                oldContacts[i].quota +
                "->" +
                contacts[i].quota
            );
          }
        }
      }
      showLists =
        changeList.length > 0
          ? changeList.map((list) => <li>{list}</li>)
          : "未有更動";
    }
    return (
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"確認更改?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <ul>{showLists}</ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>取消</Button>
          <Button onClick={submitApi} autoFocus>
            確認{" "}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // 4.save -> ok
  const submitApi = (e) => {
    setDialogOpenOpen(false);
    let boolean = true;
    let pickPackResourceMap = [];
    if (contacts != null && oldContacts != null) {
      for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].quota < 0) {
          boolean = false;
        }
        if (oldContacts[i].quota != contacts[i].quota) {
          let pickPackResource = {
            date: contacts[i].date,
            locationGroup: contacts[i].locationGroup,
            quota: contacts[i].quota,
            dayOfWeek: contacts[i].dayOfWeek,
          };
          pickPackResourceMap.push(pickPackResource);
        }
      }
    }
    console.log("pickPackResourceMap", pickPackResourceMap);
    if (boolean) {
      axios({
        method: "post",
        url: `/api/pickpack/updatePickLocationInitValueList`,
        data: pickPackResourceMap,
      }).then((response) => {
        if (response.status == 200) {
          Swal.fire({
            icon: "success",
            title: "您已修改quota",
            text: "配額已更改, 請檢查!",
            confirmButtonText: "確認",
          }).then((response) => {
            if (response.isConfirmed) {
              // 確認後刷新
              window.location.assign(window.location.href);
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "糟糕...",
            text: "Something went wrong!",
            confirmButtonText: "ok",
          });
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "糟糕...",
        text: "quota 必須 >= 0",
        confirmButtonText: "ok",
      });
    }
  };
  // 5. cancel
  const handleCancelClick = () => {
    console.log("--- handleCancelClick --- ");
    setContacts(oldContacts);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    console.log("--- handleEditFormSubmit --- ");
  };

  return (
    <>
      <div class={styles["app-choose"]}>
        <LoadingOverlay
          active={isLoading}
          spinner
          text="Loading..."
          className="loadMask"
        >
          <Stack spacing={1} direction="row">
            <h5 class={styles["text"]}> loaction group : </h5>
            <select class={styles["select"]} onChange={handleChangeLocation}>
              {locationList != null ? (
                locationList.map((dropdown) => {
                  return <option value={dropdown}>{dropdown}</option>;
                })
              ) : (
                <option value="SCS">SCS</option>
              )}
            </select>
            <h5 class={styles["text"]}>day of week : </h5>
            <select class={styles["select"]} onChange={handleChangeDay}>
              <option value="null">All</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
            </select>
            <h5 class={styles["text"]}>date : </h5>
            <select class={styles["select"]} onChange={handleChangeDate}>
              <option value="null">All</option>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
              <option value="EV">EV</option>
            </select>
          </Stack>
        </LoadingOverlay>
      </div>
      <div class={styles["app-container"]}>
        <form class={styles["form"]} onSubmit={handleEditFormSubmit}>
          <table class={styles["table"]}>
            <thead>
              <tr>
                <th class={styles["th"]}>locationGroup</th>
                <th class={styles["th"]}>dayOfWeek</th>
                <th class={styles["th"]}>Date</th>
                <th class={styles["th"]}>Quota</th>
              </tr>
            </thead>
            <tbody>
              {contacts != null ? (
                contacts.map((contact) => (
                  <Fragment
                    key={
                      contact.date + contact.dayOfWeek + contact.locationGroup
                    }
                  >
                    <tr>
                      <td class={styles["td"]}>{contact.locationGroup}</td>
                      <td class={styles["td"]}>{contact.dayOfWeek}</td>
                      <td class={styles["td"]}>{contact.date}</td>
                      <td class={styles["td"]}>
                        <input
                          style={{ width: "100px" }}
                          type="number"
                          required="required"
                          placeholder={contact.quota}
                          name={
                            contact.date +
                            contact.dayOfWeek +
                            contact.locationGroup
                          }
                          value={contact.quota}
                          onChange={handleEditFormChange}
                        ></input>
                      </td>
                    </tr>
                  </Fragment>
                ))
              ) : (
                <Fragment></Fragment>
              )}
            </tbody>
          </table>
        </form>
        <Stack spacing={1} direction="row">
          <Button variant="contained" onClick={handleDialogClickOpen}>
            Save
          </Button>
          <Button variant="contained" onClick={handleCancelClick}>
            Cancel
          </Button>
        </Stack>
        <ShowDialog />
        <div class={styles["float-button"]}>
          <Button variant="contained" onClick={handleDialogClickOpen}>
            Save
          </Button>
        </div>
        <div class={styles["float-button2"]}>
          <Button variant="contained" onClick={handleCancelClick}>
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
};

export default App;
