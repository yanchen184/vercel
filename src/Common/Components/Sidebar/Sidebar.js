import React, { useState } from "react";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import "./Sidebar.scss";

const Sidebar = () => {
  return (
    <>
      <div class="sidebar">
        <div class="sidebar__logo">Fulfillment</div>
        <div class="sidebar__content">
          {SidebarData.map((item, index) => {
            return <SubMenu item={item} key={index} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
