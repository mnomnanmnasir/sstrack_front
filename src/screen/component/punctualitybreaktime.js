import React, { useEffect, useState } from "react";
import Switch from "../../screen/component/switch";
import userIcon from '../../images/groupImg.svg'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useDispatch, useSelector } from "react-redux";
import { setEmployess, setEmployessSetting, setPunctualitySettings } from "../../store/breakSlice";
import axios from "axios";
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import brushIcon from '../../images/brush.svg'
import UserDetails from "../userDetails";



const CompanyEmployess = (props) => {

    const [localToggleState, setLocalToggleState] = useState({}); // Manage local toggle states
    const state = useSelector((state) => state)
    const [setting, setSetting] = useState([])
    const { Setting, loading } = props
    const [allowBlur, setAllowBlur] = useState(false);
    const employees = useSelector((state) => state?.adminSlice?.employess)
    console.log('Employees', employees)
    // const employees = useSelector((state) => state.adminSlice.employess)
    // .filter((employee) => employee.invitationStatus === 'accepted');
    // const [timeFields, setTimeFields] = useState({}); // Track time fields for each employee
    const [timeFields, setTimeFields] = useState([])
    const [puncStartTime, setPuncStartTime] = useState("");
    const [puncEndTime, setPuncEndTime] = useState("");

    // Fetch employees and initialize timeFields
    useEffect(() => {
        const fetchAllEmployeeData = async () => {
            try {
                const updatedFields = {};
                for (const employee of employees) {
                    const response = await axios.get(
                        `https://myuniversallanguages.com:9093/api/v1/superAdmin/getPunctualityDataEachUser/${employee._id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    if (response.status === 200) {
                        const { puncStartTime, puncEndTime } = response.data.data;

                        // Convert to UTC format or extract HH:MM for puncStartTime and puncEndTime
                        const formattedPuncStartTime = puncStartTime
                            ? new Date(puncStartTime).toISOString().substring(11, 16) // UTC time in HH:MM format
                            : "";

                        const formattedPuncEndTime = puncEndTime
                            ? new Date(puncEndTime).toISOString().substring(11, 16) // UTC time in HH:MM format
                            : "";

                        // Extract break times
                        // const utcBreakStartTime = breakConvertedData?.[0]?.breakStartTime
                        //     ? new Date(breakConvertedData[0].breakStartTime).toISOString().substring(11, 16) // UTC format
                        //     : "";

                        // const utcBreakEndTime = breakConvertedData?.[0]?.breakEndTime
                        //     ? new Date(breakConvertedData[0].breakEndTime).toISOString().substring(11, 16) // UTC format
                        //     : "";

                        updatedFields[employee._id] = {
                            showFields: employee.punctualityData?.individualPuncStart || false, // Toggle state
                            // startTime: utcBreakStartTime, // Break start time in UTC
                            // endTime: utcBreakEndTime,     // Break end time in UTC
                            puncStartTime: formattedPuncStartTime, // Punctuality start time in UTC
                            puncEndTime: formattedPuncEndTime,     // Punctuality end time in UTC
                        };
                    }
                }
                setTimeFields(updatedFields); // Set the fetched values
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };


        fetchAllEmployeeData(); // Fetch the data on mount
    }, [employees]); // This ensures it runs when employees change



    useEffect(() => {
        const persistedTimeFields = JSON.parse(localStorage.getItem("timeFields")) || {};
        const updatedTimeFields = employees.reduce((fields, employee) => {
            fields[employee._id] = {
                ...persistedTimeFields[employee._id], // Load from localStorage if available
                // showFields: persistedTimeFields[employee._id]?.showFields ?? employee?.punctualityData?.individualPuncStart || false,
                puncStartTime: persistedTimeFields[employee._id]?.puncStartTime || "00:00",
                puncEndTime: persistedTimeFields[employee._id]?.puncEndTime || "00:00",
            };
            return fields;
        }, {});

        setTimeFields(updatedTimeFields);
    }, [employees]);

    // useEffect(() => {
    //     localStorage.setItem("timeField", JSON.stringify(timeField));
    // }, [timeField]);
    // const handleToggleChange = (employee, isSelected) => {
    //     setTimeFields((prev) => ({
    //         ...prev,
    //         [employee._id]: {
    //             ...prev[employee._id],
    //             showFields: isSelected, // Show fields only when toggle is on
    //             startTime: prev[employee._id]?.startTime || "",
    //             endTime: prev[employee._id]?.endTime || "",
    //         },
    //     }));

    //     // Example API call to update employee settings
    //     handlePunctualitySetting({
    //         employee,
    //         isSelected,
    //     });
    // };

    useEffect(() => {
        // Synchronize `timeFields` state with `employees` data on mount or update
        const updatedTimeFields = employees.reduce((fields, employee) => {
            fields[employee._id] = {
                showFields: employee?.punctualityData?.individualPuncStart || false, // Reflect the backend state
                // startTime: fields[employee._id]?.startTime || "", // Retain existing values
                // endTime: fields[employee._id]?.endTime || "",
                startTime: timeFields[employee._id]?.startTime || "00:00",
                endTime: timeFields[employee._id]?.endTime || "00:00",
                puncStartTime: timeFields[employee._id]?.puncStartTime || "00:00",
                puncEndTime: timeFields[employee._id]?.puncEndTime || "00:00",
            };
            return fields;
        }, {});

        setTimeFields(updatedTimeFields);
    }, [employees]);

    // const handleToggleChange = async (employee, isSelected) => {
    //     try {
    //         const requestData = {
    //             userId: employee._id,
    //             settings: {
    //                 individualbreakTime: false, // Set to false for all users
    //                 individualPuncStart: isSelected,
    //                 individualPuncEnd: false
    //             },
    //         };

    //         // Call API to update the value
    //         const response = await axios.post(
    //             "https://myuniversallanguages.com:9093/api/v1/superAdmin/addIndividualPunctuality",
    //             requestData,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );

    //         if (response.status === 200) {
    //             enqueueSnackbar("Punctuality setting updated successfully!", {
    //                 variant: "success",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             });

    //             // Update local state for real-time toggle update
    //             setTimeFields((prev) => {
    //                 // Create a new state object
    //                 const updatedFields = { ...prev };

    //                 // Set the toggled employee's settings
    //                 updatedFields[employee._id] = {
    //                     ...updatedFields[employee._id],
    //                     showFields: isSelected, // Reflect updated state in UI
    //                 };

    //                 // Set all other employees' individualbreakTime to false
    //                 for (const emp of employees) {
    //                     if (emp._id !== employee._id) {
    //                         updatedFields[emp._id] = {
    //                             ...updatedFields[emp._id],
    //                             showFields: false, // Set to false if not the toggled employee
    //                         };
    //                     }
    //                 }

    //                 return updatedFields;
    //             });
    //         } else {
    //             enqueueSnackbar("Failed to update punctuality setting.", {
    //                 variant: "error",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Error updating punctuality setting:", error);
    //         enqueueSnackbar("An error occurred while updating punctuality setting.", {
    //             variant: "error",
    //             anchorOrigin: {
    //                 vertical: "top",
    //                 horizontal: "right",
    //             },
    //         });
    //     }
    // };


    // useEffect(() => {
    //     const initialTimeFields = {};
    //     employees.forEach((employee) => {
    //         initialTimeFields[employee._id] = {
    //             showFields: employee?.punctualityData?.individualbreakTime || false, // Default to false or existing state
    //             startTime: "",
    //             endTime: "",
    //         };
    //     });
    //     setTimeFields(initialTimeFields);
    // }, [employees]);


    // const handleTimeChange = (employeeId, field, value) => {
    //     setTimeFields((prev) => ({
    //         ...prev,
    //         [employeeId]: {
    //             ...prev[employeeId],
    //             [field]: value,
    //         },
    //     }));
    // };
    const handleToggleChange = async (employee, isSelected) => {
        // Optimistically update local state for real-time feedback
        setTimeFields((prev) => ({
            ...prev,
            [employee._id]: {
                ...prev[employee._id],
                showFields: isSelected,
            },
        }));

        try {
            // Fetch current settings for the employee
            const response = await axios.get(
                `https://myuniversallanguages.com:9093/api/v1/superAdmin/getPunctualityDataEachUser/${employee._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error("Failed to fetch current settings.");
            }

            const currentSettings = response.data.employeeSettings;

            // Prepare the payload with updated settings
            const requestData = {
                userId: employee._id,
                settings: {
                    ...currentSettings, // Preserve other settings
                    individualPuncStart: isSelected, // Update the toggle value
                },
            };

            // Update backend with new settings
            const updateResponse = await axios.post(
                "https://myuniversallanguages.com:9093/api/v1/superAdmin/addIndividualPunctuality",
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (updateResponse.status === 200) {
                enqueueSnackbar("Punctuality setting updated successfully!", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });

                // Sync the local state and update `localStorage` for cross-tab visibility
                const updatedState = {
                    ...timeFields,
                    [employee._id]: {
                        ...timeFields[employee._id],
                        showFields: isSelected,
                    },
                };
                setTimeFields(updatedState);
                localStorage.setItem("timeFields", JSON.stringify(updatedState));
            } else {
                throw new Error("Failed to update punctuality setting.");
            }
        } catch (error) {
            console.error("Error updating punctuality setting:", error);

            // Revert the UI state if the API call fails
            setTimeFields((prev) => ({
                ...prev,
                [employee._id]: {
                    ...prev[employee._id],
                    showFields: !isSelected, // Revert to the previous state
                },
            }));
            enqueueSnackbar("An error occurred while updating punctuality setting.", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
        }
    };
    // Convert 24-hour format to 12-hour format with AM/PM
    const convertTo12HourFormat = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const suffix = hours >= 12 ? "PM" : "AM";
        const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock
        return `${adjustedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${suffix}`;
    };

    // Convert 12-hour format with AM/PM to 24-hour format
    const convertTo24HourFormat = (time) => {
        const [timePart, suffix] = time.split(" ");
        const [hours, minutes] = timePart.split(":").map(Number);
        const adjustedHours = suffix === "PM" && hours !== 12 ? hours + 12 : suffix === "AM" && hours === 12 ? 0 : hours;
        return `${adjustedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    // const handleTimeChange = (employeeId, field, value) => {
    //     setTimeFields((prev) => {
    //         const updatedFields = {
    //             ...prev,
    //             [employeeId]: {
    //                 ...prev[employeeId],
    //                 [field]: value,
    //             },
    //         };
    //         // Save to localStorage whenever the timeFields change
    //         localStorage.setItem("timeFields", JSON.stringify(updatedFields));
    //         return updatedFields;
    //     });
    // };
    // const handleTimeChange = (employeeId, field, value) => {
    //     const formattedValue = convertTo24HourFormat(value); // Convert from AM/PM to 24-hour for storage
    //     setTimeFields((prev) => {
    //         const updatedFields = {
    //             ...prev,
    //             [employeeId]: {
    //                 ...prev[employeeId],
    //                 [field]: formattedValue,
    //             },
    //         };
    //         // Save to localStorage whenever the timeFields change
    //         localStorage.setItem("timeFields", JSON.stringify(updatedFields));
    //         return updatedFields;
    //     });
    // };
    useEffect(() => {
        const persistedTimeFields = JSON.parse(localStorage.getItem("timeFields")) || {};
        const updatedTimeFields = employees.reduce((fields, employee) => {
            fields[employee._id] = {
                ...persistedTimeFields[employee._id], // Load from localStorage if available
                puncStartTime: persistedTimeFields[employee._id]?.puncStartTime || "00:00",
                puncEndTime: persistedTimeFields[employee._id]?.puncEndTime || "00:00",
            };
            return fields;
        }, {});
        setTimeFields(updatedTimeFields);
    }, [employees]);

    const handleTimeChange = (employeeId, field, value) => {
        setTimeFields((prev) => {
            const updatedFields = {
                ...prev,
                [employeeId]: {
                    ...prev[employeeId],
                    [field]: value, // Store the selected time directly in HH:mm format
                },
            };
            localStorage.setItem("timeFields", JSON.stringify(updatedFields)); // Save to localStorage
            return updatedFields;
        });
    };
    

    // const handleSave = async (employeeId) => {
    //     console.log("Time Fields for Employee:", timeFields[employeeId]); // Debugging
    //     try {
    //         const { startTime, endTime, puncStartTime, puncEndTime } = timeFields[employeeId];

    //         // Validate if all times are provided
    //         if (!puncStartTime || !puncEndTime) {
    //             throw new Error("All times are required.");
    //         }

    //         // Calculate Total Hours
    //         const calculateTotalHours = (startTime, endTime) => {
    //             const start = new Date(`1970-01-01T${startTime}:00`);
    //             const end = new Date(`1970-01-01T${endTime}:00`);
    //             const totalMinutes = (end - start) / (1000 * 60);
    //             const hours = Math.floor(totalMinutes / 60);
    //             const minutes = totalMinutes % 60;
    //             return `${hours}h:${minutes}m`;
    //         };

    //         const totalHours = calculateTotalHours(startTime, endTime);
    //         const currentDate = new Date().toISOString().split("T")[0];

    //         // API Request Data
    //         const requestData = {
    //             userId: employeeId,
    //             settings: {
    //                 breakTime: [
    //                     {
    //                         TotalHours: totalHours,
    //                         breakStartTime: `${currentDate}T${startTime}:00`,
    //                         breakEndTime: `${currentDate}T${endTime}:00`,
    //                     },
    //                 ],
    // puncStartTime: `${currentDate}T${puncStartTime}:00`,
    // puncEndTime: `${currentDate}T${puncEndTime}:00`,
    //                 individualPuncStart: true, // Ensure the toggle is saved as ON
    //             },
    //         };

    //         // Call API to save data
    //         const response = await axios.post(
    //             "https://myuniversallanguages.com:9093/api/v1/superAdmin/addIndividualPunctuality",
    //             requestData,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );

    //         if (response.status === 200) {
    //             enqueueSnackbar("Punctuality successfully submitted!", {
    //                 variant: "success",
    //                 anchorOrigin: { vertical: "top", horizontal: "right" },
    //             });
    //         } else {
    //             enqueueSnackbar("Failed to submit punctuality", { variant: "error" });
    //         }
    //     } catch (error) {
    //         enqueueSnackbar(error.message || "Error submitting times.", {
    //             variant: "error",
    //             anchorOrigin: { vertical: "top", horizontal: "right" },
    //         });
    //         console.error("Error submitting times:", error);
    //     }
    // };
    const handleSave = async (employeeId) => {
        try {
            const { puncStartTime, puncEndTime } = timeFields[employeeId];

            // Validation for start and end times
            if (!puncStartTime || !puncEndTime) {
                enqueueSnackbar("Both Punctuality Start Time and End Time are required.", {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
                return;
            }

            // Calculate the total duration in 24-hour format
            const calculateTimeDifference = (start, end) => {
                const [startHours, startMinutes] = start.split(":").map(Number);
                const [endHours, endMinutes] = end.split(":").map(Number);

                // Convert times to minutes
                const startInMinutes = startHours * 60 + startMinutes;
                const endInMinutes = endHours * 60 + endMinutes;

                // Handle case where end time is on the next day
                const totalMinutes =
                    endInMinutes >= startInMinutes
                        ? endInMinutes - startInMinutes
                        : 1440 - (startInMinutes - endInMinutes); // 1440 minutes in 24 hours

                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                return `${hours}h:${minutes}m`;
            };

            const totalDuration = calculateTimeDifference(puncStartTime, puncEndTime);

            console.log("Total Duration:", totalDuration);

            const currentDate = new Date().toISOString().split("T")[0];

            // Prepare API payload
            const requestData = {
                userId: employeeId,
                settings: {
                    puncStartTime: `${currentDate}T${puncStartTime}:00`,
                    puncEndTime: `${currentDate}T${puncEndTime}:00`,
                    individualPuncStart: true, // Keep toggle ON
                    totalDuration, // Send total duration to the backend if needed
                },
            };

            // Call API to save data
            const response = await axios.post(
                "https://myuniversallanguages.com:9093/api/v1/superAdmin/addIndividualPunctuality",
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                enqueueSnackbar("Punctuality successfully saved!", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });

                // Fetch updated data from backend
                const updatedResponse = await axios.get(
                    `https://myuniversallanguages.com:9093/api/v1/superAdmin/getPunctualityDataEachUser/${employeeId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (updatedResponse.status === 200) {
                    const updatedData = updatedResponse.data?.data;

                    // Extract updated values
                    const updatedPuncStartTime = updatedData?.puncStartTime
                        ? updatedData.puncStartTime.substring(11, 16)
                        : "";
                    const updatedPuncEndTime = updatedData?.puncEndTime
                        ? updatedData.puncEndTime.substring(11, 16)
                        : "";

                    // Update local state with fetched data
                    setTimeFields((prev) => ({
                        ...prev,
                        [employeeId]: {
                            ...prev[employeeId],
                            showFields: true, // Ensure the toggle remains ON
                            puncStartTime: updatedPuncStartTime,
                            puncEndTime: updatedPuncEndTime,
                        },
                    }));
                }
            } else {
                enqueueSnackbar("Failed to save Punctuality data.", { variant: "error" });
            }
        } catch (error) {
            console.error("Error saving Punctuality data:", error);
            enqueueSnackbar("Error saving Punctuality data.", { variant: "error" });
        }
    };



    useEffect(() => {
        // Set allowBlur based on the Redux store
        const employeeWithBlur = employees.find(employee => employee.effectiveSettings?.screenshots?.allowBlur);
        setAllowBlur(!!employeeWithBlur); // Use double negation to convert to boolean
    }, [employees]);

    const activeTab = useSelector((state) => state?.adminSlice?.activeTab)
    const dispatch = useDispatch()
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };

    useEffect(() => {
        // Set local toggle state based on Redux state
        const employeeWithToggleOn = employees.find(
            (employee) => employee.effectiveSettings?.individualPuncStart
        );
        if (employeeWithToggleOn) {
            setAllowBlur(true); // Example: Update a local state based on Redux
        }
    }, [employees]);


    const updateAllowBlur = (allowBlur) => {
        setAllowBlur(allowBlur);
    };


    // async function handleApplySetting(data) {
    //     const employeeId = data.employee._id;

    //     // Define dynamic punctuality settings for the employee
    //     const settingsToUpdate = {
    //         breakTime: [
    //             {
    //                 TotalHours: "1h:0m",
    //                 breakStartTime: new Date().toISOString(),
    //                 breakEndTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
    //             },
    //             {
    //                 TotalHours: "1h:30m",
    //                 breakStartTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    //                 breakEndTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(), // 2.5 hours later
    //             },
    //         ],
    //         puncStartTime: new Date().toISOString(),
    //         puncEndTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
    //         individualBreakTime: data.isSelected, // Pass the toggle value
    //     };

    //     // Prepare the request payload
    //     const requestData = {
    //         userId: employeeId,
    //         settings: settingsToUpdate,
    //     };

    //     try {
    //         // Send API request
    //         const res = await axios.post(
    //             "https://myuniversallanguages.com:9093/api/v1/superAdmin/addIndividualPunctuality",
    //             requestData,
    //             { headers }
    //         );
    //         // console.log("")
    //         if (res.status === 200) {
    //             enqueueSnackbar("Employee punctuality settings updated successfully!", {
    //                 variant: "success",
    //                 anchorOrigin: { vertical: "top", horizontal: "right" },
    //             });

    //             // Dispatch Redux action to update the state
    //             dispatch(setEmployess({
    //                 id: employeeId,
    //                 isSelected: data.isSelected,
    //                 key: "individualBreakTime",
    //             }));
    //         } else {
    //             enqueueSnackbar("Failed to update employee punctuality settings.", {
    //                 variant: "error",
    //                 anchorOrigin: { vertical: "top", horizontal: "right" },
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Error updating employee punctuality settings:", error);
    //         enqueueSnackbar("An error occurred while updating employee punctuality settings.", {
    //             variant: "error",
    //             anchorOrigin: { vertical: "top", horizontal: "right" },
    //         });
    //     }
    // }
    // async function handlePunctualitySetting(data) {
    //     console.log("Punctuality Data:", data);

    //     const employeeId = data.employee._id; // Assuming the employee ID is in the employee object

    //     // Define the settings to be updated
    //     const settingsToUpdate = {
    //         breakTime: [
    //             {
    //                 TotalHours: "1h:0m",
    //                 breakStartTime: new Date().toISOString(),
    //                 breakEndTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
    //             },
    //             {
    //                 TotalHours: "1h:30m",
    //                 breakStartTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    //                 breakEndTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(), // 2.5 hours later
    //             },
    //         ],
    //         puncStartTime: new Date().toISOString(),
    //         puncEndTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
    //         individualBreakTime: data.isSelected, // Toggle value from input
    //     };

    //     // Prepare the request payload
    //     const requestData = {
    //         userId: employeeId,
    //         settings: settingsToUpdate,
    //     };

    //     console.log("Payload to be sent:", requestData);

    //     try {
    //         // Send the API request
    //         const res = await axios.post(
    //             "https://myuniversallanguages.com:9093/api/v1/superAdmin/addIndividualPunctuality",
    //             requestData,
    //             { headers }
    //         );

    //         if (res.status === 200) {
    //             enqueueSnackbar("Punctuality settings updated successfully!", {
    //                 variant: "success",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             });

    //             // Optionally dispatch a Redux action to update state
    //             dispatch(setPunctualitySettings({
    //                 id: employeeId,
    //                 isSelected: data.isSelected,
    //                 key: "individualBreakTime",
    //             }));
    //         } else {
    //             enqueueSnackbar("Failed to update punctuality settings.", {
    //                 variant: "error",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Error updating punctuality settings:", error);
    //         enqueueSnackbar("An error occurred while updating punctuality settings.", {
    //             variant: "error",
    //             anchorOrigin: {
    //                 vertical: "top",
    //                 horizontal: "right",
    //             },
    //         });
    //     }
    // }

    async function handlePunctualitySetting(data) {
        console.log("Punctuality Data:", data);

        const findUser = employees.find((employee) => employee._id === data.employee._id);

        if (!findUser) {
            console.error("User not found!");
            enqueueSnackbar("User not found!", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
            return;
        }

        const ssId = data.employee._id; // Assuming ssId should be the employee ID

        console.log("SSID", ssId);

        const settingsToUpdate = {
            breakTime: data.isSelected
                ? [
                    {
                        TotalHours: "1h:0m",
                        breakStartTime: new Date().toISOString(),
                        breakEndTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
                    },
                    {
                        TotalHours: "1h:30m",
                        breakStartTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
                        breakEndTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(), // 2.5 hours later
                    },
                ]
                : [],

            // individualbreakTime: false, // Pass toggle value
            // individualbreakTime: data.isSelected, // Pass toggle value
            individualPuncStart: data.isSelected,
            // individualPuncEnd: false
        };

        try {
            const res = await axios.post(
                `https://myuniversallanguages.com:9093/api/v1/superAdmin/addIndividualPunctuality`,
                {
                    userId: ssId,
                    settings: settingsToUpdate,
                },
                {
                    headers,
                }
            );

            if (res.status === 200) {
                enqueueSnackbar("Punctuality settings updated successfully!", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });

                // Update Redux state after successful API call
                dispatch(
                    setPunctualitySettings({
                        id: ssId,
                        isSelected: data.isSelected,
                        key: "individualPuncStart",
                    })
                );
            } else {
                enqueueSnackbar("Failed to update punctuality settings.", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
            }
        } catch (error) {
            console.error("Error updating punctuality settings:", error);
            enqueueSnackbar("An error occurred while updating punctuality settings.", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
        }
    }

    // async function handlePunctualitySetting(data) {
    //     console.log("Punctuality Data:", data);

    //     // Find the specific user based on a condition (e.g., current toggle state)
    //     const findUser = employees.find(
    //         (employee) => employee._id === data.employee._id
    //     );

    //     if (!findUser) {
    //         console.error("User not found!");
    //         enqueueSnackbar("User not found!", {
    //             variant: "error",
    //             anchorOrigin: {
    //                 vertical: "top",
    //                 horizontal: "right",
    //             },
    //         });
    //         return;
    //     }

    //     const employeeId = findUser._id;

    //     // Define the settings to be updated
    //     const settingsToUpdate = {
    //         breakTime: data.isSelected
    //             ? [
    //                   {
    //                       TotalHours: "1h:0m",
    //                       breakStartTime: new Date().toISOString(),
    //                       breakEndTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
    //                   },
    //                   {
    //                       TotalHours: "1h:30m",
    //                       breakStartTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    //                       breakEndTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(), // 2.5 hours later
    //                   },
    //               ]
    //             : [], // Clear break times if toggled off
    //         puncStartTime: new Date().toISOString(),
    //         puncEndTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
    //         individualBreakTime: data.isSelected, // Pass toggle value
    //     };

    //     // Prepare the request payload
    //     const requestData = {
    //         userId: employeeId,
    //         settings: settingsToUpdate,
    //     };

    //     console.log("Payload to be sent:", requestData);

    //     try {
    //         // Send the API request
    //         const res = await axios.post(
    //             "https://myuniversallanguages.com:9093/api/v1/superAdmin/addIndividualPunctuality",
    //             requestData,
    //             { headers }
    //         );

    //         if (res.status === 200) {
    //             enqueueSnackbar("Punctuality settings updated successfully!", {
    //                 variant: "success",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             });

    //             // Dispatch Redux action to update state
    //             dispatch(setPunctualitySettings({
    //                 id: employeeId,
    //                 isSelected: data.isSelected,
    //                 key: "individualBreakTime",
    //             }));
    //         } else {
    //             enqueueSnackbar("Failed to update punctuality settings.", {
    //                 variant: "error",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Error updating punctuality settings:", error);
    //         enqueueSnackbar("An error occurred while updating punctuality settings.", {
    //             variant: "error",
    //             anchorOrigin: {
    //                 vertical: "top",
    //                 horizontal: "right",
    //             },
    //         });
    //     }
    // }


    // async function handleApplySetting(data) {

    //     console.log(data);
    //     const findUser = employees.find((f) => f.effectiveSettings[data.key] === false)

    //     const ssId = data.employee._id; // Assuming ssId should be the employee ID

    //     console.log('SSID', ssId)
    //     try {
    //         const res = await axios.patch(
    //             `https://myuniversallanguages.com:9093/api/v1/superAdmin/addIndividualPunctuality`
    //             {
    //                 userId: data.employee._id,
    //                 effectiveSettings: {
    //                     ...findUser?.effectiveSettings,
    //                     [data.key]: data.isSelected,
    //                     userId: data.employee._id
    //                 }
    //             },
    //             {
    //                 headers
    //             }
    //         );

    //         if (res.status === 200) {
    //             enqueueSnackbar("Employee settings updated", {
    //                 variant: "success",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right"
    //                 }
    //             });
    //         } else {
    //             enqueueSnackbar("Failed to update employee settings", {
    //                 variant: "error",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right"
    //                 }
    //             });
    //         }
    //         console.log(res);
    //         const updatedAllowBlur = true; // Set to true since the screenshot is blurred
    //         if (data.key === "allowBlur") {
    //             dispatch(setEmployessSetting({
    //                 id: ssId,
    //                 allowBlur: updatedAllowBlur
    //             }));
    //             setAllowBlur(updatedAllowBlur); // Update local state
    //             props.updateAllowBlur(updatedAllowBlur); // Update parent component state
    //         }

    //     } catch (error) {
    //         console.error("Error updating employee settings:", error);
    //         enqueueSnackbar("An error occurred while updating employee settings", {
    //             variant: "error",
    //             anchorOrigin: {
    //                 vertical: "top",
    //                 horizontal: "right"
    //             }
    //         });
    //     }
    // }

    // const userCount = employees !== null && employees !== undefined ? employees.length : 0;
    // const userCount = employees !== null && employees !== undefined ? employees.filter(employee => employee !== null).length : 0;
    // const userCount = employees !== null && employees !== undefined ? employees.filter(employee => employee !== null && employee !== {}).length : 0;
    const userCount = employees !== null && employees !== undefined ? employees.filter(employee => employee !== null && Object.keys(employee).length > 0).length : 0;

    console.log(activeTab);

    console.log('=============>', employees);
    // const filteredEmployees = employees.filter(employee => employee.name);
    const filteredEmployees = employees.filter(employee => employee.name && employee.userType !== "owner");

    console.log('=##########=>', filteredEmployees);

    return (
        <>
            <div>
                <SnackbarProvider />
                {filteredEmployees && filteredEmployees.length > 0 ? filteredEmployees?.map((employee, index) => {
                    // console.log("Break Time", employee?.settings?.individualbreakTime)
                    // console.log("Employee Object:", employee?.punctualityData?.individualbreakTime); // Debug the full employee object
                    // console.log("Break Time", employee?.settings?.individualbreakTime); // Access the correct property
                    {/* {employees && employees.length > 0 ? employees?.filter(employee => employee.invitationStatus === 'accepted' || (employee.invitationStatus === 'pending' && employee.invitedBy === userId)).map((employee, index) => { */ }
                    return (
                        loading ? (
                            <Skeleton count={1} height="56px" style={{ margin: "10px 0 0 0" }} />
                        ) : (
                            <div className="newDiv">
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <img width={35} src={userIcon} alt="" />
                                        <p style={{ marginLeft: 10 }}>{employee?.name}</p>
                                    </div>

                                    {/* <div style={{ marginRight: 10 }}>
                                        <label class="switch">
                                            <input
                                                checked={(
                                                    employee?.effectiveSettings?.individualss === true && activeTab?.id === 1 ||
                                                    employee?.effectiveSettings?.individualAct === true && activeTab?.id === 2 ||
                                                    employee?.effectiveSettings?.individualUrl === true && activeTab?.id === 3 ||
                                                    employee?.effectiveSettings?.individualAutoPause === true && activeTab?.id === 5 ||
                                                    employee?.effectiveSettings?.individualOffline === true && activeTab?.id === 6
                                                )}
                                                type="checkbox"
                                                onChange={(e) => {
                                                    dispatch(setEmployess({
                                                        id: employee._id,
                                                        isSelected: e.target.checked,
                                                        key:
                                                            activeTab.id === 1 ? "individualss" :
                                                                activeTab.id === 2 ? "individualAct" :
                                                                    activeTab.id === 3 ? "individualUrl" :
                                                                        activeTab.id === 5 ? "individualAutoPause" :
                                                                            activeTab.id === 6 ? "individualOffline" : ""
                                                    }))
                                                    handleApplySetting({
                                                        employee,
                                                        isSelected: e.target.checked,
                                                        key:
                                                            activeTab.id === 1 ? "individualss" :
                                                                activeTab.id === 2 ? "individualAct" :
                                                                    activeTab.id === 3 ? "individualUrl" :
                                                                        activeTab.id === 5 ? "individualAutoPause" :
                                                                            activeTab.id === 6 ? "individualOffline" : ""
                                                    })
                                                }}
                                            />
                                            <span class="slider round"></span>
                                        </label>
                                    </div> */}
                                    {/* <div style={{ marginRight: 10 }}>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={employee?.effectiveSetting?.individualbreakTime || false} // Safely access the value
                                                onChange={(e) => {
                                                    const heading = "Break Time"; // Replace this with your actual heading value
                                                    if (heading === "Break Time") {
                                                        handlePunctualitySetting({
                                                            employee,
                                                            isSelected: e.target.checked,
                                                        });
                                                    }
                                                }}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div> */}

                                    <div style={{ marginRight: 10 }}>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={timeFields[employee._id]?.showFields || false} // Real-time local state
                                                onChange={(e) => handleToggleChange(employee, e.target.checked)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>


                                    {/* Show additional fields when the toggle is ON */}
                                    {/* {employee?.effectiveSettings?.individualBreakTime && (
                                        <div style={{ marginTop: "10px", paddingLeft: "15px", border: "1px solid #ccc", borderRadius: "8px", padding: "10px", background: "#f9f9f9" }}>
                                            <p><strong>Details for {employee?.name}:</strong></p>
                                            <p><strong>Break Times:</strong></p>
                                            {employee?.effectiveSettings?.breakTime?.length > 0 ? (
                                                employee.effectiveSettings.breakTime.map((breakDetail, index) => (
                                                    <div key={index} style={{ marginBottom: "5px" }}>
                                                        <p>- Total Hours: {breakDetail.TotalHours}</p>
                                                        <p>- Start Time: {new Date(breakDetail.breakStartTime).toLocaleString()}</p>
                                                        <p>- End Time: {new Date(breakDetail.breakEndTime).toLocaleString()}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No break times available.</p>
                                            )}

                                        <p><strong>Punctuality Start Time:</strong> {new Date(employee?.effectiveSettings?.puncStartTime).toLocaleString() || 'Not set'}</p>
                                            <p><strong>Punctuality End Time:</strong> {new Date(employee?.effectiveSettings?.puncEndTime).toLocaleString() || 'Not set'}</p>
                                        </div>
                                    )} */}
                                    {/* {employee?.effectiveSettings?.allowBlur && (
                                        <img
                                            width={25}
                                            src={brushIcon}
                                            alt="Brush Icon"
                                            style={{ filter: "invert(45%) sepia(34%) saturate(503%) hue-rotate(120deg) brightness(96%) contrast(85%)" }}
                                            onClick={() => {
                                                console.log(employee);
                                                // handleBlurSS(timeentryId, screenshotId); // Pass the required IDs here
                                            }}
                                        />
                                    )} */}
                                </div>
                                {timeFields[employee._id]?.showFields && (
                                    <>
                                        {/* <div style={{ marginBottom: 10 }}>
                                            <label>
                                                Start Time:
                                                <input
                                                    type="time"
                                                    value={timeFields[employee._id]?.startTime || ""}
                                                    onChange={(e) => handleTimeChange(employee._id, "startTime", e.target.value)}
                                                    style={{ marginLeft: 10 }}
                                                />
                                            </label>
                                        </div>
                                        <div style={{ marginBottom: 10 }}>
                                            <label>
                                                End Time:
                                                <input
                                                    type="time"
                                                    value={timeFields[employee._id]?.endTime || ""}
                                                    onChange={(e) => handleTimeChange(employee._id, "endTime", e.target.value)}
                                                    style={{ marginLeft: 10 }}
                                                />
                                            </label>
                                        </div> */}
                                        {/* Display puncStartTime */}
                                        <div style={{ marginTop: 10, padding: 10, border: "1px solid #ccc", borderRadius: 5, display: 'flex', gap: '10px' }}>
                                            <div>
                                                <label>
                                                    Punctuality Start Time:
                                                    <input
                                                        type="time"
                                                        value={timeFields[employee._id]?.puncStartTime === "00:00" ? "" : timeFields[employee._id]?.puncStartTime}

                                                        onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                                                        onChange={(e) => handleTimeChange(employee._id, "puncStartTime", e.target.value)}
                                                        style={{ marginLeft: 10 }}
                                                    />
                                                </label>

                                                {/* Display puncEndTime */}

                                                <label>
                                                    Punctuality End Time:
                                                    <input
                                                        type="time"
                                                        value={timeFields[employee._id]?.puncEndTime === "00:00" ? "" : timeFields[employee._id]?.puncEndTime}
                                                        onFocus={(e) => e.target.showPicker()} // Automatically open the time picker

                                                        onChange={(e) => handleTimeChange(employee._id, "puncEndTime", e.target.value)}
                                                        style={{ marginLeft: 10 }}
                                                    />
                                                </label>
                                            </div>
                                            <button
                                                onClick={() => handleSave(employee._id)}
                                                style={{
                                                    padding: "5px 10px",
                                                    backgroundColor: "#7fc45a",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: 5,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Save
                                            </button>
                                        </div>

                                    </>
                                )}

                                {
                                    (
                                        employee?.effectiveSettings?.individualss && activeTab?.id === 1
                                    ) ? (
                                        <div className="employee-individual-setting">
                                            <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                        </div>
                                    ) : ""
                                }
                                {
                                    (
                                        employee?.effectiveSettings?.individualAct && activeTab?.id === 2
                                    ) ? (
                                        <div className="employee-individual-setting">
                                            <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                        </div>
                                    ) : ""
                                }
                                {
                                    (
                                        employee?.effectiveSettings?.individualUrl && activeTab?.id === 3
                                    ) ? (
                                        <div className="employee-individual-setting">
                                            <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                        </div>
                                    ) : ""
                                }
                                {
                                    (
                                        employee?.effectiveSettings?.individualAutoPause && activeTab?.id === 5
                                    ) ? (
                                        <div className="employee-individual-setting">
                                            <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                        </div>
                                    ) : ""
                                }
                                {
                                    (
                                        employee?.effectiveSettings?.individualOffline && activeTab?.id === 6
                                    ) ? (
                                        <div className="employee-individual-setting">
                                            <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                        </div>
                                    ) : ""
                                }

                            </div>
                        )
                    )
                }) : <p>No employees found</p>
                }

            </div >
        </>

    );
}

export default CompanyEmployess;