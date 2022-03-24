import React, { useState, Fragment, useEffect } from "react";
import Swal from "sweetalert2";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import styles from "../../App.module.scss";
import LoadingOverlay from "react-loading-overlay";
import axios from "../../Api.js";

const App = () => {
  console.log("--- start ---");
  //table內容
  const [contacts, setContacts] = useState(null);
  //原版table內容 按save button時比對 有步一樣的quota就更新
  const [oldContacts, setOldContacts] = useState(null);
  //下拉式選單的location group
  const [location, setLocation] = useState(null);
  //是否顯示dialog
  const [dialogOpen, setDialogOpenOpen] = useState(false);
  //是否顯示loading
  const [isLoading, setIsLoading] = useState(false);
  //下拉式選單內容
  const [locationList, setLocationList] = useState(null);
  //日期
  const [days, setDays] = useState(14);

  const date = ["AM", "PM", "EV"];

  const handleDialogClickOpen = (event) => {
    event.preventDefault();
    setDialogOpenOpen(true);
  };
  const handleDialogClose = (event) => {
    event.preventDefault();
    setDialogOpenOpen(false);
  };

  //一旦location or days改變 就call api change contacts and oldContacts.
  useEffect(async () => {
    console.log("--- useEffect ---", { location, days });
    let fullContacts = [];
    for (var i = 0; i < days; i++) {
      for (var j = 0; j < date.length; j++) {
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
            (day.getDate() < 10 ? "0" + day.getDate() : day.getDate()) +
            date[j],
          quota: "N/A",
          consumed: "N/A",
          left: "N/A",
        };
        fullContacts.push(contact);
      }
    }
    setIsLoading(true);
    let details = {
      productLocationGroup: location,
      days: days,
    };
    let { data } = await axios({
      method: "get",
      url: `/api/pickpack/get_pick_pack_resource_usage`,
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
    setOldContacts(JSON.parse(JSON.stringify(fullContacts)));
  }, [days, location]);

  //一旦contacts改變就關掉Loading
  useEffect(async () => {
    setIsLoading(false);
  }, [contacts]);

  //渲染後call api 獲得LocationGroupList 製作下拉式選單
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
  const handleChange = async (event) => {
    event.preventDefault();
    // 存取哪個group 到時候save要用
    setLocation(event.target.value);
  };

  // 1.下拉式選單
  const handleChangeDays = async (event) => {
    event.preventDefault();
    // 存取哪個days 到時候save要用
    setDays(event.target.value);
  };

  // 2.編輯quota
  const handleEditFormChange = (e) => {
    e.preventDefault();
    const updateData = contacts.map((contact) =>
      contact.date === e.target.name
        ? {
            date: contact.date,
            quota: e.target.value,
            consumed: contact.consumed,
            left: contact.left,
          }
        : contact
    );
    setContacts(updateData);
  };

  // 3. save
  const ShowDialog = () => {
    // 更動的內容
    let changeList = [];
    if (
      contacts != null &&
      oldContacts != null &&
      contacts.length === oldContacts.length
    ) {
      for (var i = 0; i < contacts.length; i++) {
        if (oldContacts[i].quota != contacts[i].quota) {
          changeList.push(
            contacts[i].date +
              " 的quota: " +
              oldContacts[i].quota +
              "->" +
              contacts[i].quota
          );
        }
      }
    }
    let showLists =
      changeList.length > 0
        ? changeList.map((list) => <li>{list}</li>)
        : "未有更動";

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
    if (
      contacts != null &&
      oldContacts != null &&
      contacts.length === oldContacts.length
    ) {
      for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].quota < 0) {
          boolean = false;
        }
        if (oldContacts[i].quota != contacts[i].quota) {
          let pickPackResource = {
            resourceDate: contacts[i].date,
            locationGroup: location,
            resource: contacts[i].quota,
          };
          pickPackResourceMap.push(pickPackResource);
        }
      }
    }
    //quota 是否<0
    if (boolean) {
      axios({
        method: "post",
        url: `/api/pickpack/updateResource`,
        data: pickPackResourceMap,
      }).then((response) => {
        if (response.status == 200) {
          Swal.fire({
            icon: "success",
            title: "您已修改quota",
            text: "配額已更改, 請檢查!",
            confirmButtonText: "確認",
          }).then((response) => {
            console.log(response);
            // 確認後刷新
            if (response.isConfirmed) {
              window.location.assign(window.location.href);
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "糟糕...",
            text: "Something wrong!",
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

  return (
    <>
      <div class={styles["app-choose"]}>
        <div class="select">
          <LoadingOverlay
            active={isLoading}
            spinner
            text="Loading..."
            className="loadMask"
          >
            <Stack spacing={1} direction="row">
              <h5 class={styles["text"]}>location group: </h5>
              <select class={styles["select"]} onChange={handleChange}>
                {locationList != null ? (
                  locationList.map((dropdown) => {
                    return <option value={dropdown}>{dropdown}</option>;
                  })
                ) : (
                  <option value="SCS">SCS</option>
                )}
              </select>
              <h5 class={styles["text"]}>days: </h5>
              <select class={styles["select"]} onChange={handleChangeDays}>
                <option value="14">14</option>
                <option value="21">21</option>
                <option value="28">28</option>
              </select>
            </Stack>
          </LoadingOverlay>
        </div>
      </div>
      <div class={styles["app-container"]}>
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
                  <Fragment key={contact.date}>
                    <tr>
                      <td class={styles["td"]}>{contact.date}</td>
                      {contact.quota != "N/A" ? (
                        <td class={styles["td"]}>
                          <input
                            style={{ width: "100px" }}
                            type="number"
                            required="required"
                            placeholder={contact.quota}
                            name={contact.date}
                            value={contact.quota}
                            onChange={handleEditFormChange}
                            width="20px"
                          ></input>
                        </td>
                      ) : (
                        <td class={styles["td"]}>{contact.quota}</td>
                      )}
                      <td class={styles["td"]}>{contact.consumed}</td>
                      <td class={styles["td"]}>{contact.left}</td>
                      <td class={styles["td_blank"]}></td>
                    </tr>
                  </Fragment>
                ))
              ) : (
                <Fragment />
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
      </div>
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
    </>
  );
};

export default App;
