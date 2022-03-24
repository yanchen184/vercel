import React from "react";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import * as FcIcons from "react-icons/fc";
import * as RiIcons from "react-icons/ri";

export const SidebarData = [
  {
    title: "Pick Pack Quota",
    path: "/pickpackQuota",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "更改已生成配額",
        path: "/pickpackQuota",
        icon: <FcIcons.FcDataSheet />,
      },
      {
        title: "管理default-Quota",
        path: "/defaultPickpackQuota",
        icon: <FcIcons.FcCalendar />,
      },
      {
        title: "Quota-Exceeded",
        path: "/quotaExceeded",
        icon: <FiIcons.FiActivity />,
      },
      {
        title: "Quota-Summary",
        path: "/quotaSummary",
        icon: <FcIcons.FcGenericSortingAsc />,
      },
      {
        title: "Quota-Summary-Detail",
        path: "/quotaSummaryDetail",
        icon: <FcIcons.FcGenericSortingAsc />,
      },
    ],
  },
  {
    title: "ADRA",
    path: "/overview",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: "todo",
        path: "/todo",
        icon: <FcIcons.FcCalendar />,
      },
    ],
  },
];
