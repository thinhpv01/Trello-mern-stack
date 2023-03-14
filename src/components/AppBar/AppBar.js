import React from "react";
import "./AppBar.scss";
import { FaBars, FaChevronDown } from "react-icons/fa";
const AppBar = () => {
  return (
    <div className="nav-app">
      <div className="nav-left">
        <FaBars />
        <p className="nav-link">Trello</p>
        <p className="nav-link">Workspaces</p>
        <p className="nav-link">Recent</p>
        <p className="nav-link">Starred</p>
        <p className="nav-link">Templates</p>
        <button>Create</button>
      </div>
      <div></div>
    </div>
  );
};

export default AppBar;
