import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch, useSelector } from "react-redux";
import EmployeeFilter from "../../screen/component/EmployeeFilter";
import CompanyEmployess from "../../screen/component/punctualitybreaktime";

function Screenshot() {

    let token = localStorage.getItem('token');
    let headers = {
        Authorization: 'Bearer ' + token,
    }

    const dispatch = useDispatch()
    const [number, setNumber] = useState(null)
    const ids = useSelector((state) => state.adminSlice.ids)
    const employees = useSelector((state) => state.adminSlice.employess)
    const [filter, setfilter] = useState([])

    const [puncStartTime, setPuncStartTime] = useState("");
    const [puncEndTime, setPuncEndTime] = useState("");


    useEffect(() => {
        if (employees?.length > 0) {
            const firstEmployee = employees[0];
            const punctualityData = firstEmployee?.punctualityData || {};
            setPuncStartTime(punctualityData.puncStartTime || "");
            setPuncEndTime(punctualityData.puncEndTime || "");
        }
    }, [employees]);


    const handleApplySettings = async (employee, type, setting) => {
        const settings = {
            ...employee.effectiveSettings,
            screenshots: {
                ...employee.effectiveSettings.screenshots,
                enabled: setting
            }
        }
        const settings2 = {
            ...employee.effectiveSettings,
            screenshots: {
                ...employee.effectiveSettings.screenshots,
                frequency: `${setting}/hr`
            }
        }
        const settings3 = {
            ...employee.effectiveSettings,
            screenshots: {
                ...employee.effectiveSettings.screenshots,
                allowBlur: setting
            }
        }
        try {
            const res = await axios.patch(`https://myuniversallanguages.com:9093/api/v1/owner/settingsE/${employee._id}`,
                {
                    userId: employee._id,
                    effectiveSettings: type === "setting1" ? settings : type === "setting2" ? settings2 : settings3
                }, { headers })


            if (res.status === 200) {
                enqueueSnackbar("Employee settings updated", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
            else {
                if (res.status === 403) {
                    alert("Access denied. Please check your permissions.")
                } else if (res.data.success === false) {
                    alert(res.data.message)
                }
            }

        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.status === 403 && error.response.data.success === false) {
                    // alert(error.response.data.message)
                    enqueueSnackbar(error.response.data.message, {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                }
            }
        }
    }

    function Setting({ employee }) {
        const salaryString = employee?.effectiveSettings?.screenshots?.frequency;
        const numberPattern = /\d+/;
        const matches = salaryString?.match(numberPattern);
        const number = matches?.length > 0 && parseInt(matches[0]);
        return (
            <>



            </>
        )
    }

    useEffect(() => {
        const salaryString = employees?.find(f => f?.effectiveSettings?.individualss === false)?.effectiveSettings?.screenshots?.frequency;
        const numberPattern = /\d+/;
        const matches = salaryString?.match(numberPattern);
        setNumber(matches?.length > 0 && parseInt(matches[0]))
    }, [employees])

    async function getData() {
        try {
            const response = await fetch(
                `https://myuniversallanguages.com:9093/api/v1/superAdmin/employees`,
                { headers }
            );
            const json = await response.json();
            const employeesData = json?.convertedEmployees || [];
            // console.log("checkk", employeesData);
            if (employeesData.length > 0) {
                const punctualityData = employeesData[0]?.punctualityData || {};
                setPuncStartTime(punctualityData.puncStartTime);
                setPuncEndTime(punctualityData.puncEndTime);
            } else {
                console.warn("No employee data found.");
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
            enqueueSnackbar("Failed to fetch employees.", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const handleSubmit = async () => {
        try {
            // Check if both start and end times are provided
            if (!puncStartTime || !puncEndTime) {
                throw new Error("Both Punctuality Start Time and End Time are required.");
            }

            // Log punctuality times to console
            console.log("Punctuality Start Time (HH:MM):", puncStartTime);
            console.log("Punctuality End Time (HH:MM):", puncEndTime);

            const userIds = employees.map((employee) => employee._id);

            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const timezoneOffset = new Date().getTimezoneOffset(); // in minutes

            // Prepare the API payload for each user
            // const requestData = userIds.map((userId) => ({
            //     userId,
            //     settings: {
            //         puncStartTime: new Date(`${new Date().toISOString().split('T')[0]}T${puncStartTime}:00`),
            //         puncEndTime: new Date(`${new Date().toISOString().split('T')[0]}T${puncEndTime}:00`),
            //         timezone: timezone,
            //         timezoneOffset: timezoneOffset,
            //         // individualPuncStart: true, // Ensure toggle is ON
            //     },
            // }));
            const requestData = employees.map((employee) => {
                const userTimezone = employee?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
                const userTimezoneOffset = employee?.timezoneOffset ?? new Date().getTimezoneOffset();

                return {
                    userId: employee._id,
                    settings: {
                        puncStartTime: `${new Date().toISOString().split('T')[0]}T${puncStartTime}:00`,
                        puncEndTime: `${new Date().toISOString().split('T')[0]}T${puncEndTime}:00`,
                        timezone: userTimezone,
                        timezoneOffset: userTimezoneOffset,
                    },
                };
            });

            console.log('request====>', requestData)
            // Make the API call
            const response = await axios.post(
                "https://myuniversallanguages.com:9093/api/v1/superAdmin/addPunctualityRule",
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Handle success
            if (response.status === 200) {
                enqueueSnackbar("Punctuality Time successfully submitted!", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });



            } else {
                enqueueSnackbar("Failed to submit punctuality rule.", {
                    variant: "error",
                });
            }
        } catch (error) {
            enqueueSnackbar(
                error.message || "Error submitting punctuality rule. Please try again later.",
                {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                }
            );
            console.error("Error submitting punctuality rule:", error);
        }
    };
    const handleFilteredEmployees = (filteredEmployees) => {
        console.log("Filtered Employees:", filteredEmployees);
        setfilter(filteredEmployees)
    };
    return (
        <div>
            <SnackbarProvider />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">Punctuality</p>
                </div>
            </div>
            <div className="settingScreenshotDiv">
                {/* <p>How frequently screenshots will be taken.</p> */}
                <p>You can set the timeout duration to control how frequently screenshots are taken, with captures occurring at random intervals.</p>
            </div>
            <EmployeeFilter employees={employees} onFilter={handleFilteredEmployees} />

            {(
                <>
                    <div className="takeScreenShotDiv">
                        <div>
                            <label>Punctuality Start Time:</label>
                            <input
                                type="time"
                                value={puncStartTime}
                                onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                                onChange={(e) => setPuncStartTime(e.target.value)}
                            // onChange={(e) => console.log(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Punctuality End Time:</label>
                            <input
                                type="time"
                                value={puncEndTime}
                                onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                                onChange={(e) => setPuncEndTime(e.target.value)}
                            // onChange={(e) => console.log(e.target.value)}
                            />
                        </div>
                    </div>

                    <button onClick={handleSubmit} style={{
                        padding: "10px 20px",
                        backgroundColor: "#7fc45a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                    }}>
                        Save
                    </button>
                </>
            )}


            <div className="activityLevelIndividual">
                <p className="settingScreenshotIndividual">Individual Settings</p>
                <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>

                <CompanyEmployess Setting={Setting} employees={filter.length > 0 ? filter : employees} />

            </div>
        </div>
    )
}

export default Screenshot;