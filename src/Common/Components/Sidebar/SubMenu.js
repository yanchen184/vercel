
import React , {useState} from "react";
import {Link} from "react-router-dom"
import styled from "styled-components";

const SidebarLink = styled.div`
    display:flex;
    color:#004bfa;
    justify-content:space-between;
    padding: 20px;
    list-style: none;
    height: 60px;
    text-decoration: none;
    font-size: 18px;
    &:hover{
        background: #9e9fa1;
        border-left: 4px solid #632ce4;
        cursor: pointer;
    }
`;

const DropdownLink = styled(Link)`
    background: #d0dff5;
    height: 60px;
    padding-left: 3rem;
    display: flex;
    padding: 20px;
    text-decoration: none;
    color: #020008;
    font-size: 15px;

    &:hover{
        background: #ffffff;
        cursor: pointer;
    }
`;
const SidebarLabel = styled.span`
    margin-left: 16px;
`;

const SubMenu = ( {item} ) => {
    console.log(item);
    const [subnav , setSubNav] = useState(false);
    const showSubnav = () => setSubNav(!subnav);

    return(
        <>
        <SidebarLink onClick={item.subNav && showSubnav}>
        <div>
            {item.icon}
            <SidebarLabel>{item.title}</SidebarLabel>
        </div>
        <div>
        {item.SubMenu && subnav 
        ? item.iconOpened 
        : item.subNav 
        ? item.iconClosed 
        :null}

        </div>
        </SidebarLink>
        {subnav && item.subNav.map((item,index) => {
            console.log("item",item,index);
            return (
                <DropdownLink to={item.path} key={index}>
                    {item.icon}
                    <SidebarLabel>{item.title}</SidebarLabel>
                </DropdownLink>
            )
        })}
        </>
        )
}
export default SubMenu;
