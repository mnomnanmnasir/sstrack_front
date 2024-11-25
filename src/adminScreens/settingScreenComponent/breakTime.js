import React, { useEffect, useState } from "react";
import Switch from "../../screen/component/switch";
import user from '../../images/groupImg.svg'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CompanyEmployess from "../../screen/component/breakTimeEmployess";
import SaveChanges from "../../screen/component/button";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { getEmployess, setAllUserSetting, setAllUserSetting2, setAllUserSetting3, setEmployess, setEmployessSetting, setEmployessSetting2, setEmployessSetting4 } from "../../store/breakSlice";
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
    const employees = useSelector((state) => state?.adminSlice?.employess)

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

        // Load break time from localStorage on component mount
        // useEffect(() => {
        //     const savedBreakTime = localStorage.getItem("breakTime");
        //     if (savedBreakTime) {
        //         setBreakTime(JSON.parse(savedBreakTime)); // Parse and set saved data
        //     }
        // }, []);
    
        // // Save break time to localStorage whenever it updates
        // useEffect(() => {
        //     localStorage.setItem("breakTime", JSON.stringify(breakTime));
        // }, [breakTime]);
        
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
                    <label htmlFor={`${employee._id}_take`}>Take21212</label>
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


    async function getData() {
        try {
            const response = await fetch(`https://ss-track-xi.vercel.app/api/v1/superAdmin/employees`, { headers })
            const json = await response.json();
            dispatch(getEmployess(json?.convertedEmployees))
            // json?.convertedEmployees.map(async (employee) => {
            //     const data = await axios.get(`https://ss-track-xi.vercel.app/api/v1/superAdmin/Settings/${employee._id}`)
            //     if (data?.data?.employeeSettings?.userId) {
            //         dispatch(setIds(data?.data?.employeeSettings?.userId))
            //     }
            // })
        }
        catch (error) {
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
        getData()
    }, [])

    console.log("screenshot employess =====>", employees);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

    // const handleCheckboxChange = () => {
    //     setIsCheckboxChecked(!isCheckboxChecked);
    // };
    // const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [calculatedDuration, setCalculatedDuration] = useState("");




    const handleDurationChange = (e) => {
        const input = e.target.value; // Capture user input
        setCalculatedDuration(input); // Update the field value immediately

        // Only validate if input matches the complete format
        const regex = /^(\d+)\s*hr\s*(\d+)?\s*min?$/i; // Match "X hr Y min"
        const match = input.match(regex);

        if (match) {
            const hours = parseInt(match[1], 10) || 0; // Extract hours
            const minutes = parseInt(match[2], 10) || 0; // Extract minutes

            if ((hours === 0 && minutes >= 1 && minutes <= 59) || (hours === 1 && minutes === 0)) {
                // Valid duration range
                calculateStartAndEndTime(hours, minutes);
            } else {
                enqueueSnackbar("Please enter a valid duration between 0 hr 1 min and 1 hr 0 min.", {
                    variant: "warning",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
            }
        }
    };

    const validateAndFormatDuration = (input) => {
        const regex = /^(\d+)\s*hr\s*(\d+)?\s*min?$/i; // Match inputs like "0 hr 1 min"
        const match = input.match(regex);

        if (match) {
            const hours = parseInt(match[1], 10) || 0; // Extract hours
            const minutes = parseInt(match[2], 10) || 0; // Extract minutes

            if (hours === 0 && minutes >= 1 && minutes <= 59) {
                // Allow valid range for 0 hours
                setCalculatedDuration(`0 hr ${minutes} min`);
                calculateStartAndEndTime(0, minutes);
            } else if (hours === 1 && minutes === 0) {
                // Allow exactly 1 hr 0 min
                setCalculatedDuration("1 hr 0 min");
                calculateStartAndEndTime(1, 0);
            } else {
                // Invalid input
                setCalculatedDuration("Invalid Time Range");
                alert("Please enter a valid duration between 0 hr 1 min and 1 hr 0 min.");
            }
        } else if (input === "") {
            // Clear input
            setCalculatedDuration("");
        } else {
            // Invalid input
            setCalculatedDuration("Invalid Time Range");
            alert("Please enter a valid duration between 0 hr 1 min and 1 hr 0 min.");
        }
    };


    const formatDurationInput = (input) => {
        const regex = /^(\d+)\s*:?(\d+)?$/; // Matches numbers with optional separator (e.g., "2 30" or "2:30")
        const match = input.match(regex);

        if (match) {
            const hours = Math.min(parseInt(match[1], 10) || 0, 1); // Restrict hours to max 1
            const minutes = parseInt(match[2], 10) || 0;

            if (hours === 1 && minutes > 0) {
                // If hours is 1, minutes must be 0
                setCalculatedDuration("1 hr 0 min");
                calculateStartAndEndTime(1, 0);
            } else if (hours === 0 && minutes >= 1 && minutes <= 59) {
                // Allow valid minutes range for 0 hours
                setCalculatedDuration(`0 hr ${minutes} min`);
                calculateStartAndEndTime(0, minutes);
            } else if (hours === 1 && minutes === 0) {
                // Allow exactly 1 hr 0 min
                setCalculatedDuration("1 hr 0 min");
                calculateStartAndEndTime(1, 0);
            } else {
                // Invalid input outside the range
                setCalculatedDuration("Invalid Time Range");
                alert("Please enter a valid duration between 0 hr 1 min and 1 hr 0 min.");
            }
        } else {
            setCalculatedDuration("");
        }
    };




    const calculateStartAndEndTime = (hours, minutes) => {
        const startDate = new Date();
        startDate.setHours(9, 0, 0); // Default start time: 09:00 AM
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + hours, startDate.getMinutes() + minutes);

        const startTimeString = startDate.toTimeString().slice(0, 5); // Format as HH:MM
        const endTimeString = endDate.toTimeString().slice(0, 5); // Format as HH:MM

        setStartTime(startTimeString);
        setEndTime(endTimeString);
    };

    const formatEndTime = (startDate, hours, minutes) => {
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + hours, startDate.getMinutes() + minutes);
        return endDate.toTimeString().slice(0, 5);
    };


    // const handleCheckboxChange = () => {
    //     setIsCheckboxChecked(!isCheckboxChecked);
    //     setStartTime(""); // Reset fields when toggling
    //     setEndTime("");
    //     setCalculatedDuration("");
    // };

    // const handleStartTimeChange = (e) => {
    //     setStartTime(e.target.value);
    //     // Re-validate the end time when the start time changes
    //     if (endTime) {
    //         validateTimeDifference(e.target.value, endTime);
    //     }
    // };

    // const handleEndTimeChange = (e) => {
    //     const newEndTime = e.target.value;
    //     validateTimeDifference(startTime, newEndTime);
    // };

    const handleStartTimeChange = (e) => {
        const newStartTime = e.target.value;
        setStartTime(newStartTime);
        calculateDuration(newStartTime, endTime);
    };

    // const handleEndTimeChange = (e) => {
    //     const newEndTime = e.target.value;
    //     setEndTime(newEndTime);
    //     calculateDuration(startTime, newEndTime);
    // };
    const handleEndTimeChange = (index, value) => {
        const startTime = new Date(breakTime[index].breakStartTime);
        const endTime = new Date(value);
    
        if (endTime <= startTime) {
            enqueueSnackbar("End time must be later than start time.", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
            return;
        }
    
        handleInputChange(index, "breakEndTime", value); // Update state if valid
    };
    
    const calculateDuration = (start, end) => {
        if (start && end) {
            const startDate = new Date(`1970-01-01T${start}:00`);
            const endDate = new Date(`1970-01-01T${end}:00`);

            if (endDate > startDate) {
                const durationMs = endDate - startDate;
                const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

                // Check if duration exceeds 1 hour
                if (durationHours > 1 || (durationHours === 1 && durationMinutes > 0)) {
                    setCalculatedDuration("Invalid Time Range");
                    enqueueSnackbar("Duration cannot exceed 1 hour.", {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right",
                        },
                    });
                    setEndTime(""); // Reset invalid end time
                } else {
                    setCalculatedDuration(`${durationHours} hr ${durationMinutes} min`);
                }
            } else {
                setCalculatedDuration("Invalid Time Range");
                enqueueSnackbar("End time must be after start time.", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
            }
        } else {
            setCalculatedDuration("");
        }
    };


    const validateTimeDifference = (start, end) => {
        if (start && end) {
            const startDate = new Date(`1970-01-01T${start}:00`);
            const endDate = new Date(`1970-01-01T${end}:00`);

            const differenceMs = endDate - startDate;
            const differenceMinutes = differenceMs / (1000 * 60); // Convert ms to minutes

            if (differenceMinutes > 60) {
                enqueueSnackbar("The time difference cannot exceed 1 hour.", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
                setEndTime(""); // Clear the invalid end time
            } else if (differenceMinutes < 0) {
                enqueueSnackbar("End time must be after start time.", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
                setEndTime(""); // Clear the invalid end time
            } else {
                setEndTime(end); // Valid end time
            }
        }
    };

    const handleCheckboxChange = () => {
        setIsCheckboxChecked(!isCheckboxChecked);
        // Reset all fields when checkbox is unchecked
        if (isCheckboxChecked) {
            setStartTime("");
            setEndTime("");
            setCalculatedDuration("");
        }
    };


    // const calculateDuration = (start, end) => {
    //     if (start && end) {
    //         const startDate = new Date(`1970-01-01T${start}:00`);
    //         const endDate = new Date(`1970-01-01T${end}:00`);

    //         if (endDate > startDate) {
    //             const durationMs = endDate - startDate;
    //             const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    //             const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    //             setCalculatedDuration(`${durationHours} hr ${durationMinutes} min`);
    //         } else {
    //             setCalculatedDuration("Invalid Time Range");
    //         }
    //     } else {
    //         setCalculatedDuration("");
    //     }
    // };
    // const sendPunctualityRule = async () => {
    //     // Dummy data: Replace this with your actual users' data
    //     const users = [
    //         {
    //             userId: "65570c6f35e0cf001ca86c3c",
    //             breakTime: [
    //                 {
    //                     breakStartTime: "2024-11-21T12:00:00",
    //                     breakEndTime: "2024-11-21T13:00:00",
    //                 },
    //                 {
    //                     breakStartTime: "2024-11-21T15:00:00",
    //                     breakEndTime: "2024-11-21T15:30:00",
    //                 },
    //             ],
    //             puncStartTime: "2024-11-21T09:00:00",
    //             puncEndTime: "2024-11-21T17:00:00",
    //         },
    //     ];

    //     // Map data to required format
    //     const requestData = users.map((user) => ({
    //         userId: user.userId,
    //         settings: {
    //             breakTime: user.breakTime.map((breakSlot) => {
    //                 const startTime = new Date(breakSlot.breakStartTime);
    //                 const endTime = new Date(breakSlot.breakEndTime);

    //                 const totalMinutes = Math.floor((endTime - startTime) / (1000 * 60));
    //                 const hours = Math.floor(totalMinutes / 60);
    //                 const minutes = totalMinutes % 60;

    //                 return {
    //                     TotalHours: `${hours}h:${minutes}m`,
    //                     breakStartTime: startTime.toISOString(),
    //                     breakEndTime: endTime.toISOString(),
    //                 };
    //             }),
    //             puncStartTime: new Date(user.puncStartTime).toISOString(),
    //             puncEndTime: new Date(user.puncEndTime).toISOString(),
    //         },
    //     }));

    //     console.log("Request Payload:", requestData); // Debug the payload

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
    //             enqueueSnackbar("Punctuality rules successfully submitted!", {
    //                 variant: "success",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             });
    //             console.log("API Response:", response.data);
    //         } else {
    //             enqueueSnackbar("Failed to submit punctuality rules.", {
    //                 variant: "error",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             });
    //         }
    //     } catch (error) {
    //         enqueueSnackbar(
    //             error?.response?.data?.message || "An error occurred while submitting the punctuality rules.",
    //             {
    //                 variant: "error",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             }
    //         );
    //         console.error("Error submitting punctuality rules:", error);
    //     }
    // };




    const [breakTime, setBreakTime] = useState([
        { TotalHours: "", breakStartTime: "", breakEndTime: "" },
    ]);

    const [puncStartTime, setPuncStartTime] = useState("");
    const [puncEndTime, setPuncEndTime] = useState("");

        // Load break time from localStorage on component mount
        useEffect(() => {
            const savedBreakTime = localStorage.getItem("breakTime");
            if (savedBreakTime) {
                setBreakTime(JSON.parse(savedBreakTime)); // Parse and set saved data
            }
        }, []);
    
        // Save break time to localStorage whenever it updates
        useEffect(() => {
            localStorage.setItem("breakTime", JSON.stringify(breakTime));
        }, [breakTime]);

    const handleInputChange = (index, field, value) => {
        const updatedBreakTime = [...breakTime];
        updatedBreakTime[index][field] = value;
        setBreakTime(updatedBreakTime);
    };

    // const addBreakTimeField = () => {
    //     setBreakTime([
    //         ...breakTime,
    //         { TotalHours: "", breakStartTime: "", breakEndTime: "" },
    //     ]);
    // };
    const [clickCount, setClickCount] = useState(0); // Counter to track clicks

    const addBreakTimeField = () => {
        if (clickCount < 2) {
            setBreakTime([
                ...breakTime,
                { TotalHours: "", breakStartTime: "", breakEndTime: "" },
            ]);
            setClickCount(clickCount + 1); // Increment the click count
        }
    };
    
    const handleSubmit = async () => {
        // Validate inputs
        // if (!puncStartTime || !puncEndTime) {
        //     enqueueSnackbar("Punctuality start and end times are required.", {
        //         variant: "error",
        //     });
        //     return;
        // }

        for (const breakField of breakTime) {
            if (!breakField.breakStartTime || !breakField.breakEndTime) {
                enqueueSnackbar("All break times must have start and end times.", {
                    variant: "error",
                    // variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
                
                return;
            }
        }

        // Format the data for API
        const requestData = [
            {
                userId: "65570c6f35e0cf001ca86c3c", // Replace with actual userId
                settings: {
                    breakTime: breakTime.map((slot) => {
                        const startTime = new Date(slot.breakStartTime);
                        const endTime = new Date(slot.breakEndTime);
        
                        // Calculate total hours and minutes
                        const totalMinutes = Math.floor((endTime - startTime) / (1000 * 60));
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
        
                        return {
                            TotalHours: `${hours}h:${minutes}m`,
                            breakStartTime: startTime.toISOString(),
                            breakEndTime: endTime.toISOString(),
                        };
                    }),
                    // puncStartTime: new Date(puncStartTime).toISOString(),
                    // puncEndTime: new Date(puncEndTime).toISOString(),
                },
            },
            {
                userId: "6558499b4ac2ae001cca7673", // Example for another user
                settings: {
                    breakTime: breakTime.map((slot) => {
                        const startTime = new Date(slot.breakStartTime);
                        const endTime = new Date(slot.breakEndTime);
        
                        // Calculate total hours and minutes
                        const totalMinutes = Math.floor((endTime - startTime) / (1000 * 60));
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
        
                        return {
                            TotalHours: `${hours}h:${minutes}m`,
                            breakStartTime: startTime.toISOString(),
                            breakEndTime: endTime.toISOString(),
                        };
                    }),
                    // puncStartTime: new Date(puncStartTime).toISOString(),
                    // puncEndTime: new Date(puncEndTime).toISOString(),
                },
            },
        ];
        

        try {
            const response = await axios.post(
                "https://ss-track-xi.vercel.app/api/v1/superAdmin/addPunctualityzRule",
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                enqueueSnackbar("Data successfully submitted!", 
                    {  variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        } });
            } else {
                enqueueSnackbar("Failed to submit data.", { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar("Data successfully submitted!", 
                {  variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    } });
            console.error("Error submitting data:", error);
        }
    };

    const handleIndividualPunctualitySubmit = async () => {
        try {
            // Create the request payload for all users
            const requestData = employees.map((employee) => ({
                userId: employee.userId, // Extract userId dynamically
                settings: {
                    breakTime: breakTime.map((slot) => {
                        const startTime = new Date(slot.breakStartTime);
                        const endTime = new Date(slot.breakEndTime);
    
                        // Calculate total hours and minutes
                        const totalMinutes = Math.floor((endTime - startTime) / (1000 * 60));
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
    
                        return {
                            TotalHours: `${hours}h:${minutes}m`,
                            breakStartTime: startTime.toISOString(),
                            breakEndTime: endTime.toISOString(),
                        };
                    }),
                    puncStartTime: new Date(puncStartTime).toISOString(),
                    puncEndTime: new Date(puncEndTime).toISOString(),
                },
            }));
    
            console.log("Request Data:", requestData); // Debugging
    
            // Send the POST request to the API
            const response = await axios.post(
                "https://ss-track-xi.vercel.app/api/v1/superAdmin/addIndividualPunctuality",
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            if (response.status === 200) {
                enqueueSnackbar("Punctuality rules successfully submitted!", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
                console.log("API Response:", response.data);
            } else {
                enqueueSnackbar("Failed to submit punctuality rules.", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
            }
        } catch (error) {
            console.error("Error submitting punctuality rules:", error);
            enqueueSnackbar(
                error?.response?.data?.message || "An error occurred while submitting the rules.",
                {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                }
            );
        }
    };

    
    return (
        <div>
            <SnackbarProvider />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">Break Time</p>
                </div>
            </div>
            <div className="settingScreenshotDiv">
                <p>How frequently screenshots will be taken.</p>
                <p>This number is an average since screenshots are taken at random intervals.</p>
            </div>
            <div className="takeScreenShotDiv">
                <div className="d-flex gap-3">
                    {/* <div style={{ marginBottom: "10px" }}>
                        <label htmlFor="calculatedDuration">Duration:</label>
                        <input
                            id="calculatedDuration"
                            type="text"
                            value={calculatedDuration}
                            readOnly
                            disabled
                            placeholder="Total Hours"
                            style={{
                                marginLeft: "10px",
                                padding: "5px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </div> */}
                    {/* <div style={{ marginBottom: "10px" }}>
                        <label htmlFor="startTime">Start Time:</label>
                        <input
                            id="startTime"
                            type="time"
                            value={startTime}
                            onChange={handleStartTimeChange}
                            // disabled={!isCheckboxChecked} // Enabled only when checkbox is checked
                            style={{
                                marginLeft: "10px",
                                padding: "5px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label htmlFor="endTime">End Time:</label>
                        <input
                            id="endTime"
                            type="time"
                            value={endTime}
                            onChange={handleEndTimeChange}
                            // disabled={!isCheckboxChecked} // Enabled only when checkbox is checked
                            style={{
                                marginLeft: "10px",
                                padding: "5px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>
                    <button
                        onClick={sendPunctualityRule}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Submit Punctuality Rules
                    </button> */}


<div
    style={{
        display: "flex",
        flexDirection: "column", // Ensures new rows are added below each other
        gap: "10px", // Adds spacing between rows
    }}
>
{breakTime.map((breakField, index) => {
    // Calculate duration for the current break
    const calculateDuration = () => {
        if (breakField.breakStartTime && breakField.breakEndTime) {
            const start = new Date(breakField.breakStartTime);
            const end = new Date(breakField.breakEndTime);

            if (end > start) {
                const totalMinutes = Math.floor((end - start) / (1000 * 60));
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;

                return `${hours}h:${minutes}m`; // Format as "Xh:Ym"
            }
        }
        return "0h:0m"; // Default value
    };

    return (
        <div
        key={index}
        style={{
            display: "flex", // Ensures the fields are laid out horizontally
            alignItems: "center",
            marginBottom: "10px",
            gap: "10px", // Adds spacing between fields
            
        }}
    >
            <div style={{ marginBottom: "10px" }}>
                {/* <label htmlFor={`calculatedDuration-${index}`}>Duration:</label> */}
                <input
                    id={`calculatedDuration-${index}`}
                    type="text"
                    value={calculateDuration()} // Dynamically calculate duration
                    readOnly
                    disabled
                    placeholder="Total Hours"
                    style={{
                        marginLeft: "10px",
                        padding: "5px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        // flex: 1, // Adjust width of the fields proportionally

                    }}
                />
            </div>

            <div className="d-flex gap-3">
            <input
                type="datetime-local"
                placeholder="Break Start Time"
                value={breakField.breakStartTime}
                onChange={(e) => handleInputChange(index, "breakStartTime", e.target.value)}
                style={{
                    marginLeft: "10px",
                    padding: "5px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    // flex: 1, // Adjust width of the fields proportionally

                }}
                />
                 {/* <input
                            id="endTime"
                            type="datetime-local"
                            value={endTime}
                            onChange={handleEndTimeChange}
                            // disabled={!isCheckboxChecked} // Enabled only when checkbox is checked
                            style={{
                                marginLeft: "10px",
                                padding: "5px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        /> */}
            <input
                type="datetime-local"
                placeholder="Break End Time"
                value={breakField.breakEndTime}
                onChange={(e) => handleInputChange(index, "breakEndTime", e.target.value)}
                />
                </div>
        </div>
    );
})}
</div>
                </div>
            </div>
            <div className="d-flex gap-3" style={{marginLeft: '10px'}}>

            <button
                onClick={addBreakTimeField}
                disabled={clickCount >= 2} // Disable button after 2 clicks
                style={{
                    padding: "10px 20px",
                    backgroundColor: clickCount >= 2 ? "#ccc" : "#7fc45a",
                    color: "#fff",
                    gap: '10px',
                    border: "none",
                    borderRadius: "5px",
                    cursor: clickCount >= 2 ? "not-allowed" : "pointer",
                }}
            >
                Add Break Time
            </button>
                    <button onClick={handleSubmit}  style={{
                    padding: "10px 20px",
                    backgroundColor: "#7fc45a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    // cursor: clickCount >= 2 ? "not-allowed" : "pointer",
                }}>
                Submit Data
            </button>
                    </div>
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
    );
}

export default Screenshot;



// import React, { useState } from "react";
// import axios from "axios";
// import { SnackbarProvider, enqueueSnackbar } from "notistack";

// function Screenshot() {
//     const [breakTime, setBreakTime] = useState([
//         { TotalHours: "", breakStartTime: "", breakEndTime: "" },
//     ]);
//     const [puncStartTime, setPuncStartTime] = useState("");
//     const [puncEndTime, setPuncEndTime] = useState("");

//     // Update individual breakTime inputs
//     const handleInputChange = (index, field, value) => {
//         const updatedBreakTime = [...breakTime];
//         updatedBreakTime[index][field] = value;
//         setBreakTime(updatedBreakTime);
//     };

//     // Add a new break time slot
//     const handleAddBreakTime = () => {
//         setBreakTime([...breakTime, { TotalHours: "", breakStartTime: "", breakEndTime: "" }]);
//     };

//     // Remove a break time slot
//     const handleRemoveBreakTime = (index) => {
//         const updatedBreakTime = breakTime.filter((_, i) => i !== index);
//         setBreakTime(updatedBreakTime);
//     };

    // const handleSubmit = async () => {
    //     // Validate inputs
    //     if (!puncStartTime || !puncEndTime) {
    //         enqueueSnackbar("Punctuality start and end times are required.", {
    //             variant: "error",
    //         });
    //         return;
    //     }

    //     for (const breakField of breakTime) {
    //         if (!breakField.breakStartTime || !breakField.breakEndTime) {
    //             enqueueSnackbar("All break times must have start and end times.", {
    //                 variant: "error",
    //             });
    //             return;
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
        
    //                     // Calculate total hours and minutes
    //                     const totalMinutes = Math.floor((endTime - startTime) / (1000 * 60));
    //                     const hours = Math.floor(totalMinutes / 60);
    //                     const minutes = totalMinutes % 60;
        
    //                     return {
    //                         TotalHours: `${hours}h:${minutes}m`,
    //                         breakStartTime: startTime.toISOString(),
    //                         breakEndTime: endTime.toISOString(),
    //                     };
    //                 }),
    //                 puncStartTime: new Date(puncStartTime).toISOString(),
    //                 puncEndTime: new Date(puncEndTime).toISOString(),
    //             },
    //         },
    //         {
    //             userId: "6558499b4ac2ae001cca7673", // Example for another user
    //             settings: {
    //                 breakTime: breakTime.map((slot) => {
    //                     const startTime = new Date(slot.breakStartTime);
    //                     const endTime = new Date(slot.breakEndTime);
        
    //                     // Calculate total hours and minutes
    //                     const totalMinutes = Math.floor((endTime - startTime) / (1000 * 60));
    //                     const hours = Math.floor(totalMinutes / 60);
    //                     const minutes = totalMinutes % 60;
        
    //                     return {
    //                         TotalHours: `${hours}h:${minutes}m`,
    //                         breakStartTime: startTime.toISOString(),
    //                         breakEndTime: endTime.toISOString(),
    //                     };
    //                 }),
    //                 puncStartTime: new Date(puncStartTime).toISOString(),
    //                 puncEndTime: new Date(puncEndTime).toISOString(),
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
    //             enqueueSnackbar("Data successfully submitted!", { variant: "success" });
    //         } else {
    //             enqueueSnackbar("Failed to submit data.", { variant: "error" });
    //         }
    //     } catch (error) {
    //         enqueueSnackbar(error?.response?.data?.message || "An error occurred.", {
    //             variant: "error",
    //         });
    //         console.error("Error submitting data:", error);
    //     }
    // };

//     return (
//         <div>
//             <SnackbarProvider />

//             <div>
//                 <h3>Set Break Times</h3>
//                 {breakTime.map((breakField, index) => (
//                     <div key={index} style={{ marginBottom: "20px" }}>
//                         <input
//                             type="text"
//                             placeholder="Enter Total Hours (e.g., 1 hour)"
//                             value={breakField.TotalHours}
//                             onChange={(e) =>
//                                 handleInputChange(index, "TotalHours", e.target.value)
//                             }
//                             style={{ marginRight: "10px" }}
//                         />
//                         <input
//                             type="datetime-local"
//                             placeholder="Break Start Time"
//                             value={breakField.breakStartTime}
//                             onChange={(e) =>
//                                 handleInputChange(index, "breakStartTime", e.target.value)
//                             }
//                             style={{ marginRight: "10px" }}
//                         />
                        // <input
                        //     type="datetime-local"
                        //     placeholder="Break End Time"
                        //     value={breakField.breakEndTime}
                        //     onChange={(e) =>
                        //         handleInputChange(index, "breakEndTime", e.target.value)
                        //     }
                        //     style={{ marginRight: "10px" }}
                        // />
                        // <button onClick={() => handleRemoveBreakTime(index)}>Remove</button>
//                     </div>
//                 ))}
//                 <button onClick={handleAddBreakTime}>Add Break Time</button>
//             </div>

//             <div>
//                 <h3>Punctuality Times</h3>
//                 <input
//                     type="datetime-local"
//                     placeholder="Punctuality Start Time"
//                     value={puncStartTime}
//                     onChange={(e) => setPuncStartTime(e.target.value)}
//                 />
//                 <input
//                     type="datetime-local"
//                     placeholder="Punctuality End Time"
//                     value={puncEndTime}
//                     onChange={(e) => setPuncEndTime(e.target.value)}
//                 />
//             </div>

//             <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
//                 Submit Punctuality Rules
//             </button>
//         </div>
//     );
// }

// export default Screenshot;
