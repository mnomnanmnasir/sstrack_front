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
    // useEffect(() => {
    //     localStorage.setItem("timeFields", JSON.stringify(timeFields));
    // }, [timeFields]);
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
                showFields: employee?.punctualityData?.individualbreakTime || false, // Reflect the backend state
                startTime: fields[employee._id]?.startTime || "", // Retain existing values
                endTime: fields[employee._id]?.endTime || "",
            };
            return fields;
        }, {});

        setTimeFields(updatedTimeFields);
    }, [employees]);

    const handleToggleChange = async (employee, isSelected) => {
        try {
            // API payload to update individualbreakTime
            const requestData = {
                userId: employee._id,
                settings: {
                    individualbreakTime: isSelected, // Update based on toggle value
                    individualPuncStart: false,
                    individualPuncEnd: false
                },
            };

            // Call API to update the value
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
                enqueueSnackbar("Break Time setting updated successfully!", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });

                // Update local state for real-time toggle update
                setTimeFields((prev) => ({
                    ...prev,
                    [employee._id]: {
                        ...prev[employee._id],
                        showFields: isSelected,
                    },
                }));
            } else {
                enqueueSnackbar("Failed to update Break Time setting.", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                });
            }
        } catch (error) {
            console.error("Error updating Break Time setting:", error);
            enqueueSnackbar("An error occurred while updating Break Time setting.", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
        }
    };
    // const handleToggleChange = async (employee, isSelected) => {
    //     try {
    //         // API payload to update individualbreakTime
    //         const requestData = {
    //             userId: employee._id,
    //             settings: {
    //                 individualbreakTime: isSelected, // Update based on toggle value
    //             },
    //         };
    // console.log("Requested Data Toggel", requestData)
    //         // Call API to update the value
    //         const response = await axios.post(
    //             "https://ss-track-xi.vercel.app/api/v1/superAdmin/addIndividualPunctuality",
    //             requestData,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );

    //         if (response.status === 200) {
    //             enqueueSnackbar("Break Time setting updated successfully!", {
    //                 variant: "success",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             });

    //             // Fetch the updated employee data
    //             const getResponse = await axios.get(
    //                 "https://ss-track-xi.vercel.app/api/v1/superAdmin/employees",
    //                 {
    //                     headers: {
    //                         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                     },
    //                 }
    //             );

    //             if (getResponse.status === 200) {
    //                 const updatedEmployees = getResponse.data.convertedEmployees;

    //                 // Update local state based on updated API data
    //                 const updatedEmployee = updatedEmployees.find(
    //                     (emp) => emp._id === employee._id
    //                 );

    //                 if (updatedEmployee) {
    //                     setTimeFields((prev) => ({
    //                         ...prev,
    //                         [employee._id]: {
    //                             ...prev[employee._id],
    //                             showFields: updatedEmployee.punctualityData?.individualbreakTime || false,
    //                         },
    //                     }));
    //                 }
    //             } else {
    //                 enqueueSnackbar("Failed to fetch updated employee data.", {
    //                     variant: "error",
    //                     anchorOrigin: {
    //                         vertical: "top",
    //                         horizontal: "right",
    //                     },
    //                 });
    //             }
    //         } else {
    //             enqueueSnackbar("Failed to update Break Time setting.", {
    //                 variant: "error",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right",
    //                 },
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Error updating Break Time setting:", error);
    //         enqueueSnackbar("An error occurred while updating Break Time setting.", {
    //             variant: "error",
    //             anchorOrigin: {
    //                 vertical: "top",
    //                 horizontal: "right",
    //             },
    //         });
    //     }
    // };

    // const handleToggleChange = async (employee, isSelected) => {
    //     // Update local toggle state immediately for real-time effect
    //     setTimeFields((prev) => ({
    //         ...prev,
    //         [employee._id]: {
    //             ...prev[employee._id],
    //             showFields: isSelected,
    //             startTime: prev[employee._id]?.startTime || "",
    //             endTime: prev[employee._id]?.endTime || "",
    //         },
    //     }));

    //     // props.onToggleChange(employee._id, updatedData);

    //     // Optionally update Redux state to reflect toggle change globally
    //     dispatch(setEmployessSetting({
    //         id: employee._id,
    //         key: "individualbreakTime",
    //         isSelected,
    //     }));

    //     // First API call to persist the toggle state
    //     try {
    //         await handlePunctualitySetting({ employee, isSelected });
    //         // enqueueSnackbar("Toggle state updated successfully.", {
    //         //     variant: "success",
    //         //     anchorOrigin: { vertical: "top", horizontal: "right" },
    //         // });

    //         // Second API call after a 1-second delay to fetch updated data
    //         setTimeout(async () => {
    //             try {
    //                 const response = await fetch("https://ss-track-xi.vercel.app/api/v1/superAdmin/employees", {
    //                     method: "GET",
    //                     headers: {
    //                         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                         "Content-Type": "application/json",
    //                     },
    //                 });

    //                 if (response.ok) {
    //                     const data = await response.json();
    //                     console.log("Employees data fetched successfully:", data);

    //                     // Update Redux or local state with the refreshed employee data
    //                     dispatch(setEmployess(data));
    //                 } else {
    //                     throw new Error(`Failed to fetch employees: ${response.statusText}`);
    //                 }
    //             } catch (error) {
    //                 // console.error("Error fetching employees data:", error);
    //                 // enqueueSnackbar("Failed to refresh employees data.", {
    //                 //     variant: "error",
    //                 //     anchorOrigin: { vertical: "top", horizontal: "right" },
    //                 // });
    //             }
    //         }, 1000); // 1-second delay
    //     } catch (error) {
    //         console.error("Error updating toggle state:", error);
    //         enqueueSnackbar("Failed to update toggle state.", {
    //             variant: "error",
    //             anchorOrigin: { vertical: "top", horizontal: "right" },
    //         });

    //         // Revert the toggle state in case of an error
    //         setTimeFields((prev) => ({
    //             ...prev,
    //             [employee._id]: {
    //                 ...prev[employee._id],
    //                 showFields: !isSelected, // Revert to the previous state
    //             },
    //         }));
    //     }
    // };

    // Load data from localStorage on component mount
    //   useEffect(() => {
    //     const storedTimeFields = localStorage.getItem("timeFields");
    //     if (storedTimeFields) {
    //         setTimeFields(JSON.parse(storedTimeFields));
    //     }
    // }, []);

    // Save data to localStorage whenever `timeFields` changes
    // useEffect(() => {
    //     localStorage.setItem("timeFields", JSON.stringify(timeFields));
    // }, [timeFields]);

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

    const handleTimeChange = (employeeId, field, value) => {
        setTimeFields((prev) => ({
            ...prev,
            [employeeId]: {
                ...prev[employeeId],
                [field]: value,
            },
        }));
    };

    // const handleSave = (employeeId) => {
    //     const { startTime, endTime } = timeFields[employeeId];
    //     if (!startTime || !endTime) {
    //         enqueueSnackbar("Please fill in both Start Time and End Time.", {
    //             variant: "error",
    //             anchorOrigin: { vertical: "top", horizontal: "right" },
    //         });
    //         return;
    //     }

    //     // Call API to save data
    //     console.log(`Saving for ${employeeId}:`, { startTime, endTime });
    //     enqueueSnackbar("Start and End Times saved successfully!", {
    //         variant: "success",
    //         anchorOrigin: { vertical: "top", horizontal: "right" },
    //     });
    // };
    const handleSave = async (employeeId) => {
        const { startTime, endTime } = timeFields[employeeId];
        
        // Validate the input times
        if (!startTime || !endTime) {
            enqueueSnackbar("Please fill in both Start Time and End Time.", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
            return;
        }
    
        try {
            // Format the start and end time
            // const formattedBreakTime = {
            //     TotalHours: (() => {
            //         const start = new Date(`1970-01-01T${startTime}:00`);
            //         const end = new Date(`1970-01-01T${endTime}:00`);
            //         const totalMinutes = Math.floor((end - start) / (1000 * 60));
            //         const hours = Math.floor(totalMinutes / 60);
            //         const minutes = totalMinutes % 60;
            //         return `${hours}h:${minutes}m`;
            //     })(),
            //     breakStartTime: new Date(`1970-01-01T${startTime}:00`).toISOString(),
            //     breakEndTime: new Date(`1970-01-01T${endTime}:00`).toISOString(),
            // };
    
            // Prepare the API payload
            const requestData = {
                userId: employeeId,
                settings: {
                    // breakTime: [for, // Send as an array
                },
            };
    
            // API Call
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
    
            // Handle success
            if (response.status === 200) {
                enqueueSnackbar("Break Time rule successfully submitted!", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
    
                // Update only the relevant user's time fields
                const updatedTimeFields = {
                    ...timeFields,
                    [employeeId]: {
                        ...timeFields[employeeId],
                        startTime,
                        endTime,
                        showFields: true, // Keep the toggle ON
                    },
                };
                setTimeFields(updatedTimeFields);
    
            } else {
                enqueueSnackbar("Failed to submit punctuality rule.", { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar(
                error.message || "Error submitting punctuality rule. Please try again later.",
                {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                }
            );
            console.error("Error submitting punctuality rule:", error);
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
            (employee) => employee.effectiveSettings?.individualBreakTime
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
    //             "https://ss-track-xi.vercel.app/api/v1/superAdmin/addIndividualPunctuality",
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
    //             "https://ss-track-xi.vercel.app/api/v1/superAdmin/addIndividualPunctuality",
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

            individualbreakTime: data.isSelected, // Pass toggle value
            // individualbreakTime: data.isSelected, // Pass toggle value
            individualPuncStart: false,
            individualPuncEnd: false
        };

        try {
            const res = await axios.post(
                `https://ss-track-xi.vercel.app/api/v1/superAdmin/addIndividualPunctuality`,
                {
                    userId: ssId,
                    settings: settingsToUpdate,
                },
                {
                    headers,
                }
            );

            if (res.status === 200) {
                enqueueSnackbar("Break Time settings updated successfully!", {
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
                        key: "individualbreakTime",
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
    //             "https://ss-track-xi.vercel.app/api/v1/superAdmin/addIndividualPunctuality",
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
    //             `https://ss-track-xi.vercel.app/api/v1/superAdmin/addIndividualPunctuality`
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
    const filteredEmployees = employees.filter(employee => employee.name);
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
                                                checked={timeFields[employee._id]?.showFields || false} // Reflect updated state
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
                                    <div style={{ marginTop: 10, padding: 10, border: "1px solid #ccc", borderRadius: 5, display: 'flex', gap: '10px' }}>
                                        <div style={{ marginBottom: 10 }}>
                                            <label>
                                                Start Time:
                                                <input
                                                    type="time"
                                                    value={timeFields[employee._id]?.startTime || ""}
                                                    onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                                                    onChange={(e) =>
                                                        handleTimeChange(employee._id, "startTime", e.target.value)
                                                    }
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
                                                    onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                                                    onChange={(e) =>
                                                        handleTimeChange(employee._id, "endTime", e.target.value)
                                                    }
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
                                )}
                                {/* {timeFields[employee._id]?.showFields && (
                                    <div style={{ marginTop: 10, padding: 10, border: "1px solid #ccc", borderRadius: 5, display: 'flex', gap: '10px', flexDirection: 'column' }}>
                            
                                        {employee.userType && (
                                            <div style={{ marginBottom: 10 }}>
                                                <label>
                                                    User Type:
                                                    <span style={{ marginLeft: 10, fontWeight: 'bold' }}>{employee.userType}</span>
                                                </label>
                                            </div>
                                        )}
                                        <div style={{ marginBottom: 10 }}>
                                            <label>
                                                Start Time:
                                                <input
                                                    type="time"
                                                    value={timeFields[employee._id]?.startTime || ""}
                                                    onFocus={(e) => e.target.showPicker()} 
                                                    onChange={(e) =>
                                                        handleTimeChange(employee._id, "startTime", e.target.value)
                                                    }
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
                                                    onFocus={(e) => e.target.showPicker()} 
                                                    onChange={(e) =>
                                                        handleTimeChange(employee._id, "endTime", e.target.value)
                                                    }
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
                                )}  */}
                                {(
                                    employee?.effectiveSettings?.individualss && activeTab?.id === 1
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                                {(
                                    employee?.effectiveSettings?.individualAct && activeTab?.id === 2
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                                {(
                                    employee?.effectiveSettings?.individualUrl && activeTab?.id === 3
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                                {(
                                    employee?.effectiveSettings?.individualAutoPause && activeTab?.id === 5
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                                {(
                                    employee?.effectiveSettings?.individualOffline && activeTab?.id === 6
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}

                            </div>
                        )
                    )
                }) : <p>No employees found</p>
                }

            </div>
        </>

    );
}

export default CompanyEmployess;