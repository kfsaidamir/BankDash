import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { MdHome } from "react-icons/md";
import { BiTransfer } from "react-icons/bi";
import { MdOutlineManageAccounts } from "react-icons/md";
import { LuLayers } from "react-icons/lu";
import { CiCreditCard2 } from "react-icons/ci";
import { FaHandHoldingUsd } from "react-icons/fa";
import { MdDesignServices } from "react-icons/md";
import { TbReportMoney } from "react-icons/tb";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Box } from "@chakra-ui/react";


const Sidebar = () => {

  return (
    <div className="sidebar">
      <Box display={{ md: "block", base: "none" }}>
        <Link to="/dashboard" className="sidebar-link">
          <MdHome />
          <i className="icon-home"></i> Dashboard
        </Link>
        <Link to="/transactions" className="sidebar-link">
          <BiTransfer />
          <i className="icon-transactions"></i> Transactions
        </Link>
        <Link to="/accounts" className="sidebar-link">
          <MdOutlineManageAccounts />
          <i className="icon-accounts"></i> Accounts
        </Link>
        <Link to="/investments" className="sidebar-link">
          <LuLayers />
          <i className="icon-investments"></i> Investments
        </Link>
        <Link to="/credit-cards" className="sidebar-link">
          <CiCreditCard2 />
          <i className="icon-credit-cards"></i> Credit Cards
        </Link>
        <Link to="/loans" className="sidebar-link">
          <FaHandHoldingUsd />
          <i className="icon-loans"></i> Loans
        </Link>
        <Link to="/services" className="sidebar-link">
          <MdDesignServices />
          <i className="icon-services"></i> Services
        </Link>
        <Link to="/privileges" className="sidebar-link">
          <TbReportMoney />
          <i className="icon-privileges"></i> My Privileges
        </Link>
        <Link to="/settings" className="sidebar-link">
          <IoMdInformationCircleOutline />
          <i className="icon-settings"></i> Account
        </Link>
        <Link to="/addCard" className="sidebar-link">
          <IoIosAddCircleOutline />
          <i className="icon-settings"></i> Add Card
        </Link>
      </Box>
    </div>
  );
};

export default Sidebar;
