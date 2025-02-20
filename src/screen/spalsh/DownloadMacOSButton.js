import React from "react";
import { Dropdown } from "react-bootstrap";
import appleLogo from "../../images/apple-Screenshot.png"; // Ensure the correct path

const MacDownloadDropdown = ({ handleDownloadMac }) => {
  return (
    <Dropdown>
      {/* Dropdown Toggle Button */}
      <Dropdown.Toggle
        variant="dark"
        id="mac-dropdown"
        style={{
          background: "black",
          borderRadius: "6%",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          border: "none"
        }}
      >
        <img
          src={appleLogo}
          alt="Mac OS"
          style={{
            width: "24px", // Small Apple logo
            height: "24px",
          }}
        />
        Download for Mac
      </Dropdown.Toggle>

      {/* Dropdown Menu */}
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleDownloadMac("Silicon")}>
          🍏 Mac Apple Silicon (M1, M2, M3)
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleDownloadMac("Intel")}>
          💻 Mac Intel
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MacDownloadDropdown;
