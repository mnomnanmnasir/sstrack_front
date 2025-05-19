import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch, useSelector } from "react-redux";
import EmployeeFilter from "../../screen/component/EmployeeFilter";
import CompanyEmployess from "../../screen/component/punctualitybreaktime";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";

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

    const [puncStartTime, setPuncStartTime] = useState('');
    const [puncEndTime, setPuncEndTime] = useState("");

    const [implementStartDate, setImplementStartDate] = useState(""); // 👈 Add this line
    const [implementStartTime, setImplementStartTime] = useState(""); // 👈 Add this line



    useEffect(() => {
        if (employees?.length > 0) {
            const firstEmployee = employees[0];
            const punctualityData = firstEmployee?.punctualityData || {};
            setPuncStartTime(punctualityData.convertedpuncStartTime || "00:00");
            setPuncEndTime(punctualityData.convertedpuncEndTime || "00:00");
        }
    }, [employees]);



    function convertTimeStringToDate(timeStr) {
        if (!timeStr) return new Date(); // fallback to now
        const [hours, minutes] = timeStr.split(':').map(Number);
        const now = new Date();
        now.setHours(hours);
        now.setMinutes(minutes);
        now.setSeconds(0);
        now.setMilliseconds(0);
        return now;
    }

    function formatDateToTimeString(date) {
        if (!(date instanceof Date)) return '';
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }); // returns "HH:mm"
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
                setPuncStartTime(punctualityData.convertedpuncStartTime);
                setPuncEndTime(punctualityData.convertedpuncEndTime);
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

            const userTimezone = moment.tz.guess(); // or derive from employee later if needed
            const formattedImplementStart = implementStartDate
                ? moment.tz(`${implementStartDate}T${moment().format("HH:mm")}`, userTimezone).format()
                : null;

            const requestData = employees.map((employee) => {
                const userTimezone = employee?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
                const userTimezoneOffset = employee?.timezoneOffset ?? new Date().getTimezoneOffset();

                return {
                    userId: employee._id,
                    settings: {
                        puncStartTime: puncStartTime
                            ? moment.tz(`${implementStartDate}T${puncStartTime}`, userTimezone).format()
                            : null,
                        puncEndTime: puncEndTime
                            ? moment.tz(`${implementStartDate}T${puncEndTime}`, userTimezone).format()
                            : null,
                        timezone: userTimezone,
                        timezoneOffset: userTimezoneOffset,
                        implementStartDate: formattedImplementStart, // ← this may need similar fix if time is involved
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
            <p className="settingScreenshotIndividual">Group Punctuality Setting</p>
            <div className="settingScreenshotDiv">
                {/* <p>How frequently screenshots will be taken.</p> */}
                <p>These setting will applied throught out the organization.</p>
            </div>
            {(
                <>
                    <div className="takeScreenShotDiv">
                        <div>
                            <label>Punctuality Start Time:</label>
                            <input
                                type="time"
                                value={puncStartTime}
                                onFocus={(e) => e.target.showPicker()}
                                onChange={(e) => setPuncStartTime(e.target.value)}
                                className="styled-input"
                            />
                        </div>

                        <div>
                            <label>Punctuality End Time:</label>
                            <input
                                type="time"
                                value={puncEndTime}
                                onFocus={(e) => e.target.showPicker()}
                                onChange={(e) => setPuncEndTime(e.target.value)}
                                className="styled-input"
                            />
                        </div>

                        <div>
                            <label>Policy Date:</label>
                            <input
                                type="date"
                                value={implementStartDate}
                                onFocus={(e) => e.target.showPicker()}
                                onChange={(e) => setImplementStartDate(e.target.value)}
                                className="styled-input"
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
            <style>
                {`
  .takeScreenShotDiv {
    display: flex;
    gap: 40px;
    align-items: flex-start;
    margin: 20px 0;
    flex-wrap: wrap;
  }

  .takeScreenShotDiv > div {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-family: "Segoe UI", sans-serif;
    min-width: 160px;
  }

  .takeScreenShotDiv label {
    font-size: 14px;
    color: #444;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .styled-input {
    padding: 10px 14px;
    border: 2px solid #cdd5cd;
    border-radius: 6px;
    background-color: #f8f9fa;
    color: #333;
    font-size: 14px;
    transition: border 0.2s ease, background 0.2s ease;
    font-family: "Segoe UI", sans-serif;
  }

  .styled-input:focus {
    border-color: #7fc45a;
    outline: none;
    background-color: #fff;
  }

  button {
    transition: background 0.3s ease;
  }

  button:hover {
    background-color: #69a94b;
  }
`}
            </style>



        </div>
    )
}

export default Screenshot;
