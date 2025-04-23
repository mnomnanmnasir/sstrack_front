import React, { useState } from "react";
import { Tooltip } from "antd";
import { FaHome, FaUser, FaCog } from "react-icons/fa";
import "antd/dist/reset.css"; // Ensure Ant Design CSS is imported
import './Sidebar.css'

const Sidebar = () => {
    const [hoveredItem, setHoveredItem] = useState(null);

    return (
        <div className="sidebar">
            <ul>
                {/* Home */}
                <li
                    onMouseEnter={() => setHoveredItem("home")}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <Tooltip title="Home" visible={hoveredItem === "home"} placement="right">
                        <FaHome className="icon" />
                    </Tooltip>
                    {hoveredItem === "home"}
                </li>

                {/* Profile */}
                <li
                    onMouseEnter={() => setHoveredItem("profile")}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <Tooltip title="Profile" visible={hoveredItem === "profile"} placement="right">
                        <FaUser className="icon" />
                    </Tooltip>
                    {hoveredItem === "profile"}
                </li>

                {/* Settings - Show on Right */}
                <li
                    onMouseEnter={() => setHoveredItem("settings")}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    <Tooltip title="Settings" visible={hoveredItem === "settings"} placement="right">
                        <FaCog className="icon" />
                    </Tooltip>
                    {hoveredItem === "settings"
                    }
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
