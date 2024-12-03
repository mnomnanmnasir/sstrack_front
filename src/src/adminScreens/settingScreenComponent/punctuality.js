import React, { useEffect, useState } from "react";
import Switch from "../../screen/component/switch";
import user from '../../images/groupImg.svg'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CompanyEmployess from "../../screen/component/punctualitybreaktime";
import SaveChanges from "../../screen/component/button";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { getEmployess, setAllUserSetting, setAllUserSetting2, setAllUserSetting3, setEmployess, setEmployessSetting, setEmployessSetting2, setEmployessSetting4 } from "../../store/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function Screenshot() {

    let token = localStorage.getItem('token');
    let headers = {
        Authorization: 'Bearer ' + token,
    }
    const dispatch = useDispatch()
    const [number, setNumber] = useState(null)
    const ids = useSelector((state) => state.adminSlice.ids)
    const employees = useSelector((state) => state.adminSlice.employess)

    const [breakTime, setBreakTime] = useState([
        { TotalHours: "", breakStartTime: "", breakEndTime: "" },
    ]);

    const [breakTimes, setBreakTimes] = useState([]); // Track the added break times
    // const [breakTimes, setBreakTimes] = useState(() => {
    //     // Load break times from localStorage when the component mounts
    //     const savedBreakTimes = localStorage.getItem("breakTimes");
    //     return savedBreakTimes ? JSON.parse(savedBreakTimes) : []; // Default to an empty array if nothing is saved
    // });

    const [puncStartTime, setPuncStartTime] = useState("");
    const [puncEndTime, setPuncEndTime] = useState("");

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
            const res = await axios.patch(`https://ss-track-xi.vercel.app/api/v1/owner/settingsE/${employee._id}`,
                {
                    userId: employee._id,
                    effectiveSettings: type === "setting1" ? settings : type === "setting2" ? settings2 : settings3
                }, { headers })
            console.log('Response owner', res);

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
            // console.log('Employee setting ka message', response?.data?.message);
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

    function Setting({ setting, setSetting, employee }) {
        const salaryString = employee?.effectiveSettings?.screenshots?.frequency;
        const numberPattern = /\d+/;
        const matches = salaryString?.match(numberPattern);
        const number = matches?.length > 0 && parseInt(matches[0]);
        return (
            <>
                <div>
                    <input
                        checked={employee?.effectiveSettings?.screenshots?.enabled === true}
                        onChange={() => {
                            handleApplySettings(employee, "setting1", true);
                            dispatch(setEmployessSetting({ id: employee._id, checked: true }));
                        }}
                        type="radio"
                        id={`${employee._id}_take`} // Unique ID for "Take" option
                        name={`${employee._id}_takeOption`} // Unique name for this user's radio button group
                        value="take"
                    />
                    <label htmlFor={`${employee._id}_take`}>Take</label>
                </div>
                <div>
                    <select
                        value={number}
                        className="myselect"
                        onChange={(e) => {
                            handleApplySettings(employee, "setting2", e.target.value)
                            dispatch(setEmployessSetting2({ id: employee._id, frequency: e.target.value }))
                        }}
                    >
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={10}>10</option>
                        <option value={12}>12</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                    </select>
                </div>
                <div>
                    <p>per hour</p>
                </div>
                <div>
                    <select
                        value={employee?.effectiveSettings?.screenshots?.allowBlur === true ? "Blur" : "Do Not Blur"}
                        className="myselect"
                        onChange={(e) => {
                            const isBlurAllowed = e.target.value === "Blur"; // Check for "Blur" option
                            handleApplySettings(employee, "setting3", isBlurAllowed);
                            dispatch(setEmployessSetting4({ id: employee._id, checked: isBlurAllowed }));
                        }}
                    >
                        <option value="Blur">Allow Blur</option>
                        <option value="Do Not Blur">Disallow Blur</option>
                        <option value="Blur All">Blur all</option>
                    </select>

                </div>
                {/* <div>
                    <input
                    type="checkbox"
                        name="fav_language"
                    />
                    <label for="test2">Do not take</label>
                </div> */}
                <div>
                    <input
                        checked={employee?.effectiveSettings?.screenshots?.enabled === false}
                        onChange={() => {
                            handleApplySettings(employee, "setting1", false);
                            dispatch(setEmployessSetting({ id: employee._id, checked: false }));
                        }}
                        type="radio"
                        id={`${employee._id}_do_not_take`} // Unique ID for "Do Not Take" option
                        name={`${employee._id}_takeOption`} // Unique name for this user's radio button group
                        value="do_not_take"
                    />
                    <label htmlFor={`${employee._id}_do_not_take`}>Do Not Take</label>

                </div>
            </>
        )
    }

    async function handleApply(type) {
        try {
            const res = await axios.patch(`https://ss-track-xi.vercel.app/api/v1/superAdmin/settingsE`,
                employees?.filter(f => f.effectiveSettings?.individualss === false).map((prevEmployess) => {
                    return {
                        userId: prevEmployess._id,
                        settings: {
                            ...prevEmployess?.effectiveSettings,
                            screenshots: {
                                ...prevEmployess?.effectiveSettings?.screenshots,
                                enabled: type === "take" ? true : false,
                            },
                            userId: prevEmployess._id,
                        }
                    }
                }), { headers })
            if (res.status === 200) {
                enqueueSnackbar("Employee settings updated", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
            console.log(res);
        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.status === 404 && error.response.data.success === false) {
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

    useEffect(() => {
        const salaryString = employees?.find(f => f?.effectiveSettings?.individualss === false)?.effectiveSettings?.screenshots?.frequency;
        const numberPattern = /\d+/;
        const matches = salaryString?.match(numberPattern);
        setNumber(matches?.length > 0 && parseInt(matches[0]))
    }, [employees])


    // async function getData() {
    //     try {
    //         const response = await fetch(
    //             `https://ss-track-xi.vercel.app/api/v1/superAdmin/employees`,
    //             { headers }
    //         );
    //         const json = await response.json();
    //         const employeesData = json?.convertedEmployees || [];

    //         // Check if there are any employees and if punctualityData exists
    //         if (employeesData.length > 0) {
    //             const punctualityData = employeesData[0]?.punctualityData || {};
    //             const breakTimes = punctualityData.breakTime || [];

    //             // Transform break times
    //             const transformedBreakTimes = breakTimes.map((breakEntry) => {
    //                 const start = new Date(breakEntry.breakStartTime).toLocaleTimeString(
    //                     "en-US",
    //                     { hour: "2-digit", minute: "2-digit", hour12: false }
    //                 );
    //                 const end = new Date(breakEntry.breakEndTime).toLocaleTimeString(
    //                     "en-US",
    //                     { hour: "2-digit", minute: "2-digit", hour12: false }
    //                 );
    //                 const duration = breakEntry.TotalHours || "0h:0m";
    //                 return { start, end, duration };
    //             });

    //             // Set break times
    //             setBreakTimes(transformedBreakTimes);

    //             // const punctualityData = employeesData[0]?.punctualityData || {};

    //             // Extract punctuality times
    //             const puncStartTimeISO = punctualityData.puncStartTime || null; // Get punctuality start time
    //             const puncEndTimeISO = punctualityData.puncEndTime || null; // Get punctuality end time

    //             // Calculate and format puncStartTime and puncEndTime
    //             const puncStartTime = puncStartTimeISO ? new Date(puncStartTimeISO).toLocaleTimeString(
    //                 "en-US",
    //                 { hour: "2-digit", minute: "2-digit", hour12: false }
    //             ) : null;

    //             const puncEndTime = puncEndTimeISO ? new Date(puncEndTimeISO).toLocaleTimeString(
    //                 "en-US",
    //                 { hour: "2-digit", minute: "2-digit", hour12: false }
    //             ) : null;
    //             // Calculate total duration from all objects
    //             const totalMinutes = transformedBreakTimes.reduce((acc, curr) => {
    //                 const [hours, minutes] = curr.duration
    //                     .split("h:")
    //                     .map((val) => parseInt(val) || 0);
    //                 return acc + hours * 60 + minutes;
    //             }, 0);

    //             // Convert total minutes back to "Xh:Ym" format
    //             const hours = Math.floor(totalMinutes / 60);
    //             const minutes = totalMinutes % 60;
    //             // setTotalDuration(`${hours}h:${minutes}m`);

    //             // Extract punctuality times
    //             // const puncStartTime = punctualityData.puncStartTime || null; // Get punctuality start time
    //             // const puncEndTime = punctualityData.puncEndTime || null; // Get punctuality end time

    //             // Log punctuality times to the console
    //             console.log("Punctuality Start Time:", puncStartTime);
    //             console.log("Punctuality End Time:", puncEndTime);

    //             // Set punctuality times in state or wherever needed
    //             // setPunctualityTimes({ puncStartTime, puncEndTime }); // Assuming you have a setter for this
    //         } else {
    //             console.warn("No employee data found.");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching employees:", error);
    //         enqueueSnackbar("Failed to fetch employees.", {
    //             variant: "error",
    //             anchorOrigin: {
    //                 vertical: "top",
    //                 horizontal: "right",
    //             },
    //         });
    //     }
    // }
    async function getData() {
        try {
            const response = await fetch(
                `https://ss-track-xi.vercel.app/api/v1/superAdmin/employees`,
                { headers }
            );
            const json = await response.json();
            const employeesData = json?.convertedEmployees || [];

            if (employeesData.length > 0) {
                const punctualityData = employeesData[0]?.punctualityData || {};
                setPuncStartTime(punctualityData.puncStartTime);
                setPuncEndTime(punctualityData.puncEndTime);

                console.log("Punctuality Start Time:", punctualityData.puncStartTime);
                console.log("Punctuality End Time:", punctualityData.puncEndTime);
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

    // Initialize state with values from localStorage
    const [startTime, setStartTime] = useState(() => {
        return localStorage.getItem("startTime") || ""; // Get saved startTime or default to ""
    });

    const [endTime, setEndTime] = useState(() => {
        return localStorage.getItem("endTime") || ""; // Get saved endTime or default to ""
    });
    const [calculatedDuration, setCalculatedDuration] = useState("");
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

    const validateTimeDifference = (start, end) => {
        if (start && end) {
            const startDate = new Date(`1970-01-01T${start}:00`);
            const endDate = new Date(`1970-01-01T${end}:00`);

            const differenceMs = endDate - startDate;
            const differenceMinutes = differenceMs / (1000 * 60); // Convert ms to minutes

            if (differenceMinutes > 480) { // 480 minutes = 8 hours
                enqueueSnackbar("The time difference cannot exceed 8 hours.", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
                setEndTime(""); // Clear the invalid end time
            } else if (differenceMinutes <= 0) {
                enqueueSnackbar("End time must be after start time.", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
                // setEndTime(""); // Clear the invalid end time
            } else {
                setEndTime(end); // Valid end time
                enqueueSnackbar("Time difference is valid.", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
            }
        } else {
            enqueueSnackbar("Both start and end times are required.", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
        }
    };


    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
        const newStartTime = e.target.value;
        localStorage.setItem("startTime", newStartTime); // Save to localStorage
        // Re-validate the end time when the start time changes
        // if (endTime) {
        //     validateTimeDifference(e.target.value, endTime);
        // }
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
        const newEndTime = e.target.value;
        localStorage.setItem("endTime", newEndTime); // Save to localStorage

        // validateTimeDifference(startTime, newEndTime);
    };

    console.log("screenshot employess =====>", employees);

    // const handleSubmit = async () => {
    //     // Validate inputs
    //     for (const breakField of breakTime) {
    //         if (!breakField.start || !breakField.breakEndTime) {
    //             enqueueSnackbar("Punctuality Time Added Successfully", {
    //                 variant: "success",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right"
    //                 }
    //             });
    //             return; // Stop the function if validation fails
    //         }
    //     }

    //     // Format the data for API
    //     const requestData = [
    //         {
    //             userId: "65570c6f35e0cf001ca86c3c", // Replace with actual userId
    //             settings: {
    //                 breakTime: breakTime.map((slot) => {
    //                     const startTime = new Date(slot.breakStartTime);
    //                     const endTime = new Date(slot.breakEndTime);

    //                     // Calculate total hours
    //                     const totalMinutes = Math.floor((endTime - startTime) / (1000 * 60)); // Ensure correct calculation
    //                     const hours = Math.floor(totalMinutes / 60); // Extract hours

    //                     return {
    //                         TotalHours: `${hours}h`, // Only include hours
    //                         breakStartTime: startTime.toISOString(),
    //                         breakEndTime: endTime.toISOString(),
    //                     };
    //                 }),
    //             },
    //         },
    //     ];

    //     try {
    //         const response = await axios.post(
    //             "https://ss-track-xi.vercel.app/api/v1/superAdmin/addPunctualityzRule",
    //             requestData,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );

    //         if (response.status === 200) {
    //             enqueueSnackbar("Data successfully submitted!", {
    //                 variant: "success",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right"
    //                 }
    //             });
    //         } else {
    //             enqueueSnackbar("Failed to submit data.", { variant: "error" });
    //         }
    //     } catch (error) {
    //         enqueueSnackbar("Error submitting data. Please try again later.", {
    //             variant: "error",
    //             anchorOrigin: {
    //                 vertical: "top",
    //                 horizontal: "right"
    //             }
    //         });
    //         console.error("Error submitting data:", error);
    //     }
    // };
    // const handleSubmit = async () => {
    //     try {
    //         if (!startTime || !endTime) {
    //             throw new Error("Both Punctuality Start Time and End Time are required.");
    //         }

    //         // Convert start and end times to ISO strings
    //         const puncStartTime = new Date(`1970-01-01T${startTime}:00`).toISOString();
    //         const puncEndTime = new Date(`1970-01-01T${endTime}:00`).toISOString();

    //         // Validate the time difference
    //         const start = new Date(puncStartTime);
    //         const end = new Date(puncEndTime);
    //         const differenceMs = end - start;
    //         const differenceMinutes = differenceMs / (1000 * 60); // Convert ms to minutes

    //         // if (differenceMinutes <= 0 || differenceMinutes > 480) {
    //         //     throw new Error("The time difference must be between 0 and 8 hours.");
    //         // }
    //         const userIds = employees.map((employee) => employee._id);

    //         // Prepare the API payload
    //         const requestData = userIds.map((userId) => ({

    //                 userId,
    //                 // userId: "65570c6f35e0cf001ca86c3c", // Replace with actual user ID
    //                 settings: {
    //                     puncStartTime,
    //                     puncEndTime,
    //                 },

    //         }));

    //         // Make the API call
    //         const response = await axios.post(
    //             "https://ss-track-xi.vercel.app/api/v1/superAdmin/addPunctualityRule",
    //             requestData,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token from localStorage
    //                     "Content-Type": "application/json", // Set JSON content type
    //                 },
    //             }
    //         );

    //         // Handle success
    //         if (response.status === 200) {
    //             enqueueSnackbar("Punctuality Time successfully submitted!", {
    //                 variant: "success",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             });
    //         } else {
    //             throw new Error("Failed to submit punctuality rule.");
    //         }
    //     } catch (error) {
    //         // Handle errors
    //         enqueueSnackbar(
    //             error.message || "Error submitting punctuality rule. Please try again later.",
    //             {
    //                 variant: "error",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             }
    //         );
    //         console.error("Error submitting punctuality rule:", error);
    //     }
    // };

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

            // Prepare the API payload for each user
            const requestData = userIds.map((userId) => ({
                userId,
                settings: {
                    puncStartTime: puncStartTime, // Send as HH:MM
                    puncEndTime: puncEndTime, // Send as HH:MM
                },
            }));

            // Make the API call
            const response = await axios.post(
                "https://ss-track-xi.vercel.app/api/v1/superAdmin/addPunctualityRule",
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
    // const handleSubmit = async () => {
    //     try {
    //         if (!startTime || !endTime) {
    //             throw new Error("Both Punctuality Start Time and End Time are required.");
    //         }

    //         // Convert start and end times to ISO strings
    //         const puncStartTime = new Date(`1970-01-01T${startTime}:00`).toISOString();
    //         const puncEndTime = new Date(`1970-01-01T${endTime}:00`).toISOString();

    //         // Validate the time difference
    //         const start = new Date(puncStartTime);
    //         const end = new Date(puncEndTime);
    //         const differenceMs = end - start;
    //         const differenceMinutes = differenceMs / (1000 * 60); // Convert ms to minutes

    //         if (differenceMinutes <= 0 || differenceMinutes > 480) {
    //             throw new Error("The time difference must be between 0 and 8 hours.");
    //         }

    //         // Prepare the API payload
    //         const requestData = [
    //             {
    //                 userId: "65570c6f35e0cf001ca86c3c", // Replace with actual user ID
    //                 settings: {
    //                     puncStartTime: startTime, // Exact Start Time entered
    //                     puncEndTime: endTime, // Exact End Time entered
    //                 },
    //             },
    //         ];

    //         // Make the API call
    //         const response = await axios.post(
    //             "https://ss-track-xi.vercel.app/api/v1/superAdmin/addPunctualityRule",
    //             requestData,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token from localStorage
    //                     "Content-Type": "application/json", // Set JSON content type
    //                 },
    //             }
    //         );

    //         // Handle success
    //         if (response.status === 200) {
    //             enqueueSnackbar("Punctuality Time successfully submitted!", {
    //                 variant: "success",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             });
    //         } else {
    //             throw new Error("Failed to submit punctuality rule.");
    //         }
    //     } catch (error) {
    //         // Handle errors
    //         enqueueSnackbar(
    //             error.message || "Error submitting punctuality rule. Please try again later.",
    //             {
    //                 variant: "error",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             }
    //         );
    //         console.error("Error submitting punctuality rule:", error);
    //     }
    // };

    return (
        <div>
            <SnackbarProvider />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">Punctuality</p>
                </div>
            </div>
            <div className="settingScreenshotDiv">
                <p>How frequently screenshots will be taken.</p>
                <p>This number is an average since screenshots are taken at random intervals.</p>
            </div>
            <div className="takeScreenShotDiv">
                {/* <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="startTime">Start Time:</label>
                    <input
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={handleStartTimeChange}
                        onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                        // disabled={!isCheckboxChecked} // Enabled only when checkbox is checked
                        style={{
                            marginLeft: "10px",
                            padding: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    />
                </div> */}
                <div>
                    <label>Punctuality Start Time:</label>
                    <input
                        type="time"
                        value={puncStartTime}
                        onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                        onChange={(e) => setPuncStartTime(e.target.value)}
                    />
                </div>

                {/* <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="endTime">End Time:</label>
                    <input
                        id="endTime"
                        type="time"
                        value={endTime}
                        onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                        onChange={handleEndTimeChange}
                        // disabled={!isCheckboxChecked} // Enabled only when checkbox is checked
                        style={{
                            marginLeft: "10px",
                            padding: "5px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    />
                </div> */}
                <div>
                    <label>Punctuality End Time:</label>
                    <input
                        type="time"
                        value={puncEndTime}
                        onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                        onChange={(e) => setPuncEndTime(e.target.value)}
                    />
                </div>
                {/* <button onClick={handleSubmit} style={{
                    padding: "10px 20px",
                    backgroundColor: "#7fc45a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    // cursor: clickCount >= 2 ? "not-allowed" : "pointer",
                }}>
                    Save
                </button> */}
                {/* <div>
                    <select
                        value={number}
                        className="myselect"
                        onChange={async (e) => {
                            dispatch(setAllUserSetting2({ value: e.target.value }))
                            const value = e.target.value;
                            try {
                                const res = await axios.patch(`https://ss-track-xi.vercel.app/api/v1/superAdmin/settingsE`,
                                    employees?.filter(f => f.effectiveSettings?.individualss === false)?.map((prevEmployess) => {
                                        return {
                                            userId: prevEmployess._id,
                                            settings: {
                                                ...prevEmployess?.effectiveSettings,
                                                screenshots: {
                                                    ...prevEmployess?.effectiveSettings?.screenshots,
                                                    frequency: `${value}/hr`,
                                                },
                                                userId: prevEmployess._id,
                                            }
                                        }
                                    }), { headers })
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
                                    enqueueSnackbar(res.data.message, {
                                        variant: "error",
                                        anchorOrigin: {
                                            vertical: "top",
                                            horizontal: "right"
                                        }
                                    })
                                }
                                console.log(res);
                            } catch (error) {
                                if (error.response && error.response.data) {
                                    if (error.response.status === 404 && error.response.data.success === false) {
                                        // alert(error.response.data.message)
                                        console.log('setting response screenshots', error.response.data.message)
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
                        }}>
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={10}>10</option>
                        <option value={12}>12</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                    </select>
                </div> */}
                {/* <div>
                    <p>screenshots per hour</p>
                </div>
                <div>
                    <select
                        value={employees?.find(f => f?.effectiveSettings?.individualss === false)?.effectiveSettings?.screenshots?.allowBlur === true ? "Allow Blur" : "Disallow Blur"}
                        className="myselect"
                        onChange={async (e) => {
                            console.log(e.target.value);
                            dispatch(setAllUserSetting3({ value: e.target.value === "Allow Blur" ? true : false }))
                            try {
                                const res = await axios.patch(`https://ss-track-xi.vercel.app/api/v1/superAdmin/settingsE`,
                                    employees?.filter(f => f.effectiveSettings?.individualss === false)?.map((prevEmployess) => {
                                        return {
                                            userId: prevEmployess._id,
                                            settings: {
                                                ...prevEmployess?.effectiveSettings,
                                                screenshots: {
                                                    ...prevEmployess?.effectiveSettings?.screenshots,
                                                    allowBlur: e.target.value === "Allow Blur" ? true : false
                                                },
                                                userId: prevEmployess._id,
                                            }
                                        }
                                    }), { headers })
                                if (res.status === 200) {
                                    enqueueSnackbar('Employee settings updated', {
                                        variant: "error",
                                        anchorOrigin: {
                                            vertical: "top",
                                            horizontal: "right"
                                        }
                                    })
                                }
                                console.log('Reponse agyaa', res);
                            } catch (error) {
                                console.log(error);
                            }
                        }}>
                        <option value="Allow Blur">Allow Blur</option>
                        <option value="Disallow Blur">Disallow Blur</option>
                        <option value="Blur all">Blur all</option>
                    </select>
                </div> */}
                {/* <div>
                    <input
                        checked={employees?.find(f => f?.effectiveSettings?.individualss === false && f?.effectiveSettings?.screenshots?.enabled === false)}
                        onChange={() => {
                            dispatch(setAllUserSetting({ checked: false }))
                            handleApply("do not take")
                        }} type="radio" id="test2" name="radio-group" />
                    <label for="test2">Do not Take</label>
                </div> */}
            </div>
            <button onClick={handleSubmit} style={{
                padding: "10px 20px",
                backgroundColor: "#7fc45a",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                // cursor: clickCount >= 2 ? "not-allowed" : "pointer",
            }}>
                Save
            </button>
            <div className="activityLevelIndividual">
                <p className="settingScreenshotIndividual">Individual Settings</p>
                <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
                {/* {loading ? (
                    <>
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                    </>
                ) : ( */}
                <CompanyEmployess Setting={Setting} />
                {/* )} */}
            </div>
        </div>
    )
}

export default Screenshot;