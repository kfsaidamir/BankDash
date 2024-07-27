import React, { useState } from "react";
import "./Sidebar.css";
import { NavLink } from 'react-router-dom';
import { MdHome, MdOutlineManageAccounts, MdDesignServices } from "react-icons/md";
import { BiTransfer } from "react-icons/bi";
import { LuLayers } from "react-icons/lu";
import { CiCreditCard2 } from "react-icons/ci";
import { FaHandHoldingUsd } from "react-icons/fa";
import { TbReportMoney } from "react-icons/tb";
import { IoMdInformationCircleOutline, IoIosAddCircleOutline } from "react-icons/io";
import { FiMenu } from "react-icons/fi";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <NavLink to="/dashboard" className="sidebar-link" activeClassName="active">
          <MdHome />
          <span className="link-text">Dashboard</span>
        </NavLink>
        <NavLink to="/transactions" className="sidebar-link" activeClassName="active">
          <BiTransfer />
          <span className="link-text">Transactions</span>
        </NavLink>
        <NavLink to="/accounts" className="sidebar-link" activeClassName="active">
          <MdOutlineManageAccounts />
          <span className="link-text">Accounts</span>
        </NavLink>
        <NavLink to="/cards" className="sidebar-link" activeClassName="active">
          <CiCreditCard2 />
          <span className="link-text">Credit Cards</span>
        </NavLink>
        <NavLink to="/investments" className="sidebar-link" activeClassName="active">
          <LuLayers />
          <span className="link-text">Investments</span>
        </NavLink>
        <NavLink to="" className="sidebar-link" activeClassName="active">
          <FaHandHoldingUsd />
          <span className="link-text">Loans</span>
        </NavLink>
        <NavLink to="" className="sidebar-link" activeClassName="active">
          <MdDesignServices />
          <span className="link-text">Services</span>
        </NavLink>
        <NavLink to="" className="sidebar-link" activeClassName="active">
          <TbReportMoney />
          <span className="link-text">My Privileges</span>
        </NavLink>
        <NavLink to="/admin" className="sidebar-link" activeClassName="active">
          <MdOutlineManageAccounts />
          <span className="link-text">Admin</span>
        </NavLink>
        <NavLink to="/register" className="sidebar-link" activeClassName="active">
          <MdHome />
          <span className="link-text">Register</span>
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;
