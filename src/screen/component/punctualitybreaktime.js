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
import EmployeeFilter from "./EmployeeFilter";
import moment from "moment-timezone";



const CompanyEmployess = (props) => {


    const state = useSelector((state) => state)
    const [setting, setSetting] = useState([])
    const { Setting, loading, employees } = props
    const [filteredEmployeesbyutc, setFilteredEmployeesbyutc] = useState([]);
    // const employees = useSelector((state) => state?.adminSlice?.employess) || []
    console.log('Employees', employees)
    // const employees = useSelector((state) => state.adminSlice.employess)
    // .filter((employee) => employee.invitationStatus === 'accepted');
    // const [timeFields, setTimeFields] = useState({}); // Track time fields for each employee
    const [timeFields, setTimeFields] = useState([])
    const [puncStartTime, setPuncStartTime] = useState("");
    const [puncEndTime, setPuncEndTime] = useState("");

    // ✅ Function to Format Time (Subtract 2 Hours for Display)
    const formatTime = (time) => {
        return time ? moment.utc(time).subtract(2, "hours").local().format("HH:mm") : "";
    };

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

                        updatedFields[employee._id] = {
                            showFields: employee.punctualityData?.individualPuncStart || false,
                            puncStartTime: (puncStartTime && !puncStartTime.includes("00:00")) ? puncStartTime.split("T")[1].substring(0, 5) : "",
                            puncEndTime: (puncEndTime && !puncEndTime.includes("00:00")) ? puncEndTime.split("T")[1].substring(0, 5) : "",
                        };
                    }
                }
                setTimeFields(updatedFields);
                // localStorage.setItem("timeFields", JSON.stringify(updatedFields)); // ✅ Local Storage update karein
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        fetchAllEmployeeData();
    }, [employees]);



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


    const handleToggleChange = async (employee, isSelected) => {

        // setTimeFields((prev) => ({
        //     ...prev,
        //     [employee._id]: {
        //         ...prev[employee._id],
        //         showFields: isSelected,
        //     },
        // }));
        setTimeFields((prev) => ({
            ...prev,
            [employee._id]: {
                ...prev[employee._id],
                showFields: isSelected,
                puncStartTime: isSelected ? "" : "00:00",
                puncEndTime: isSelected ? "" : "00:00",
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
                // enqueueSnackbar("Punctuality setting updated successfully!", {
                //     variant: "success",
                //     anchorOrigin: {
                //         vertical: "top",
                //         horizontal: "right",
                //     },
                // });

                // Sync the local state and update `localStorage` for cross-tab visibility
                const updatedState = {
                    ...timeFields,
                    [employee._id]: {
                        ...timeFields[employee._id],
                        showFields: isSelected,
                        puncStartTime: isSelected ? "" : "00:00",
                        puncEndTime: isSelected ? "" : "00:00",
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
            // setTimeFields((prev) => ({
            //     ...prev,
            //     [employee._id]: {
            //         ...prev[employee._id],
            //         showFields: !isSelected, // Revert to the previous state
            //     },
            // }));
            setTimeFields((prev) => ({
                ...prev,
                [employee._id]: {
                    ...prev[employee._id],
                    showFields: isSelected,
                    puncStartTime: isSelected ? "" : "00:00",
                    puncEndTime: isSelected ? "" : "00:00",
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


    useEffect(() => {
        localStorage.setItem("isUsehasVisitedPuncutlity", "true");
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



    // ✅ user visited this component
    // ✅ user visited this component
    const handleSave = async (employeeId) => {
        try {
            const { puncStartTime, puncEndTime } = timeFields[employeeId];

            if (!puncStartTime || !puncEndTime) {
                enqueueSnackbar("Both Punctuality Start Time and End Time are required.", {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
                return;
            }

            const currentDate = new Date().toISOString().split("T")[0];

            // const requestData = {
            //     userId: employeeId,
            //     settings: {
            //         puncStartTime: `${currentDate}T${puncStartTime}:00`,
            //         puncEndTime: `${currentDate}T${puncEndTime}:00`,
            //         individualPuncStart: true,
            //     },
            // };
            const requestData = {
                userId: employeeId,
                settings: {
                  ...currentSettings,
                  individualPuncStart: isSelected,
                  puncStartTime: isSelected ? "" : null,
                  puncEndTime: isSelected ? "" : null,
                },
              };
              
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

                // ✅ Backend se jo time aaya hai usko bilkul waisa ka waisa state mein save karein
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
                    setTimeFields((prev) => ({
                        ...prev,
                        [employeeId]: {
                          ...prev[employeeId],
                          showFields: true,
                          puncStartTime: updatedData.puncStartTime.split("T")[1].substring(0, 5),
                          puncEndTime: updatedData.puncEndTime.split("T")[1].substring(0, 5),
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
    }, [employees]);


    const userCount = employees !== null && employees !== undefined ? employees.filter(employee => employee !== null && Object.keys(employee).length > 0).length : 0;



    console.log('=============>', employees);
    // const filteredEmployees = employees.filter(employee => employee.name);
    const filteredEmployees = employees.filter(employee => employee.name && employee.userType !== "owner");

    console.log('=#####filteredEmployeesbyutc#####=>', filteredEmployeesbyutc);
    console.log('=##########=>', filteredEmployees);

    return (
        <>
            <div>
                <SnackbarProvider />
                {/* <EmployeeFilter employees={filteredEmployees} onFilter={setFilteredEmployeesbyutc}/> */}
                {filteredEmployees && filteredEmployees.length > 0 ? filteredEmployees?.map((employee, index) => {

                    return (
                        loading ? (
                            <Skeleton count={1} height="56px" style={{ margin: "10px 0 0 0" }} />
                        ) : (
                            <div className="newDiv">
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <img width={35} src={userIcon} alt="" />
                                        <p style={{ marginLeft: 10 }}>{employee?.name}</p>
                                        <p style={{ marginLeft: 10, fontSize: 12, color: 'black' }}>
                                            {employee?.timezone} (UTC {employee?.timezoneOffset >= 0 ? `+${employee?.timezoneOffset}` : employee?.timezoneOffset})
                                        </p>
                                    </div>


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




                                </div>
                                {timeFields[employee._id]?.showFields && (
                                    <>


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
                }) : <p>please select any UTC</p>
                }

            </div >
        </>

    );
}

export default CompanyEmployess;