import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';


const LocaitonTracking = () => {
    // Hardcoded data
    const overviewData = {
        totalDistance: "60.13 KM",
        totalTime: "225h : 25m",
    };

    const latestSession = {
        timeRange: "1:23 PM Till 3:35 PM",
        totalTime: "5.15 KM",
        totalDistance: "5.15 KM",
    };

    const activeSummary = [
        "Rowntree Mills 1pm - 2pm",
        "Rowntree Mills 1:30pm - 2pm",
        "Jane And Finch 3pm - 5pm",
        "Rowntree Mills 5pm - 6pm",
        "Plaza Latina 7pm - 8pm",
        "Holiday Inn Express Toronto North York 8pm - 10pm",
    ];


    return (
        <>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <h5>Data overview</h5>
                </div>
                <div
                    className="mainwrapper ownerTeamContainer"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingBottom: "90px",
                    }}
                >
                    <div style={{ width: "90%", fontFamily: "Arial, sans-serif", }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", }}>
                            {/* Overview Data */}
                            <div
                                style={{
                                    flex: "1",
                                    marginRight: "10px",
                                    padding: "20px",
                                    textAlign: "left",
                                }}
                            >
                                <h3 style={{
                                    color: "#2C5282", fontSize: "23px", marginBottom: "10px", fontWeight: "600",
                                }}>Overview Data</h3>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                                    {/* Total Distance Card */}
                                    <div
                                        style={{
                                            flex: "1",
                                            marginRight: "10px",
                                            padding: "20px",
                                            border: "1px solid #E5E5E5",
                                            borderRadius: "12px",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            textAlign: "center",
                                            backgroundColor: "#FFFFFF",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "#E6F4EA",
                                                    borderRadius: "50%",
                                                }}
                                            >
                                                <span style={{ fontSize: "20px", color: "#32CD32" }}>📍</span>
                                            </div>
                                            <h4 style={{ marginLeft: "10px", color: "#32CD32", fontSize: "16px", fontWeight: "600" }}>
                                                Total Distance
                                            </h4>
                                        </div>
                                        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#2C5282", margin: "0" }}>
                                            {overviewData.totalDistance}
                                        </p>
                                    </div>

                                    {/* Total Time Card */}
                                    <div
                                        style={{
                                            flex: "1",
                                            marginLeft: "10px",
                                            padding: "20px",
                                            border: "1px solid #E5E5E5",
                                            borderRadius: "12px",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            textAlign: "center",
                                            backgroundColor: "#FFFFFF",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "#E6F4EA",
                                                    borderRadius: "50%",
                                                }}
                                            >
                                                <span style={{ fontSize: "20px", color: "#32CD32" }}>⏱</span>
                                            </div>
                                            <h4 style={{ marginLeft: "10px", color: "#32CD32", fontSize: "16px", fontWeight: "600" }}>
                                                Total Time
                                            </h4>
                                        </div>
                                        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#2C5282", margin: "0" }}>
                                            {overviewData.totalTime}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Latest Tracking Session */}
                            <div
                                style={{
                                    flex: "1",
                                    marginLeft: "10px",
                                    padding: "20px",
                                    borderLeft: "1px solid #E5E5E5",
                                    borderRadius: "12px",
                                    // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    textAlign: "left",
                                    backgroundColor: "#FFFFFF",
                                }}
                            >
                                <h3 style={{ color: "#2C5282", fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
                                    Latest Tracking Sessions
                                </h3>
                                <div style={{ border: "1px solid #E5E5E5", padding: "20px", }}>
                                    <p style={{ fontSize: "16px", color: "#4A5568", fontWeight: "500", marginBottom: "10px" }}>
                                        {latestSession.timeRange}
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "10px",

                                        }}
                                    >
                                        <div style={{ flex: "1", display: 'flex', flexDirection: 'Row', }}>
                                            <div
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    // margin: "0 auto",
                                                    marginRight: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "#E6F4EA",
                                                    borderRadius: "50%",
                                                    marginBottom: "10px",

                                                }}
                                            >
                                                <span style={{ fontSize: "24px", color: "#4A90E2" }}>⏲</span>
                                            </div>
                                            <div style={{ flexDirection: 'Column', }}>

                                                <h4 style={{ color: "#32CD32", fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
                                                    Total Time
                                                </h4>
                                                <p style={{ fontSize: "18px", fontWeight: "bold", color: "#2C5282" }}>
                                                    {latestSession.totalTime}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ flex: "1", display: 'flex', flexDirection: 'Row', }}>
                                            <div
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    // margin: "0 auto",
                                                    marginRight: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "#E6F4EA",
                                                    borderRadius: "50%",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                <span style={{ fontSize: "24px", color: "#4A90E2" }}>📍</span>
                                            </div>
                                            <div style={{ flexDirection: 'Column', }}>
                                                <h4 style={{ color: "#32CD32", fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
                                                    Total Distance
                                                </h4>
                                                <p style={{ fontSize: "18px", fontWeight: "bold", color: "#2C5282" }}>
                                                    {latestSession.totalDistance}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                                        <span
                                            style={{
                                                color: "#32CD32",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                display: "inline-flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            Show More ▼
                                        </span>
                                    </div>
                                </div>
                            </div>


                        </div>


                        {/* Map View */}
                        <div style={{ marginBottom: "20px" }}>
                            <h3 style={{ fontSize: "23px", color: "#28659C", fontWeight: "600", }}> Map View</h3>
                            <div style={{ border: "1px solid #ccc", height: "300px" }}>
                                {/* Replace with an actual map integration or placeholder */}
                                <p style={{ textAlign: "center", paddingTop: "140px" }}>Map Placeholder</p>
                            </div>
                        </div>

                        {/* Active Summary */}
                        <div>
                            <h3 style={{ fontSize: "23px", color: "#28659C", fontWeight: "600", }}> Active Summary</h3>
                            <div style={{ marginBottom: "20px" }}>
                                <ul
                                    style={{
                                        listStyleType: "none",
                                        display: "flex",
                                        flexWrap: "wrap",
                                        padding: "0",
                                        margin: "0",
                                    }}
                                >
                                    {activeSummary.map((summary, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "10px",
                                                marginRight: "20px", // Space between items
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                color: "#000",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#E6F4EA",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: "8px", // Space between dot and text
                                                    border: "2px solid #32CD32",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "6px",
                                                        height: "6px",
                                                        borderRadius: "50%",
                                                        backgroundColor: "#32CD32",
                                                    }}
                                                ></div>
                                            </div>
                                            {summary}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div >

        </>
    );
};

export default LocaitonTracking;