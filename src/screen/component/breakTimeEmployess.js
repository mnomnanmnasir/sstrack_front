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
    const employees = useSelector((state) => state?.adminSlice?.employess)|| []
    console.log('Employees', employees)

    const [timeFields, setTimeFields] = useState({})


    useEffect(() => {
        const initialFields = employees.reduce((acc, employee) => {
            acc[employee._id] = {
                showFields: employee?.punctualityData?.individualbreakTime || false,
                startTime: timeFields[employee._id]?.startTime || "",
                endTime: timeFields[employee._id]?.endTime || "",
            };
            return acc;
        }, {});
        setTimeFields(initialFields);
    }, [employees]);

    const handleToggleChange = async (employee, isSelected) => {
        const userId = employee._id;

        // Optimistic Update
        setTimeFields((prev) => ({
            ...prev,
            [userId]: { ...prev[userId], showFields: isSelected },
        }));

        try {
            // Update toggle state via API
            const payload = { userId, settings: { individualbreakTime: isSelected } };
            const response = await axios.post(
                "https://myuniversallanguages.com:9093/api/v1/superAdmin/addIndividualPunctuality",
                payload,
                { headers }
            );

            if (response.status === 200) {
                enqueueSnackbar("Toggle updated successfully!", { variant: "success" });

                // Fetch updated Break Time data if toggle is ON
                if (isSelected) {
                    const updatedResponse = await axios.get(
                        `https://myuniversallanguages.com:9093/api/v1/superAdmin/getPunctualityDataEachUser/${userId}`,
                        { headers }
                    );

                    if (updatedResponse.status === 200) {
                        const breakData =
                            updatedResponse.data.data.breakConvertedData?.[0] || {};

                        setTimeFields((prev) => ({
                            ...prev,
                            [userId]: {
                                showFields: true,
                                startTime: breakData.breakStartTime?.substring(11, 16) || "",
                                endTime: breakData.breakEndTime?.substring(11, 16) || "",
                            },
                        }));
                    }
                }
            } else {
                throw new Error("Failed to update toggle");
            }
        } catch (error) {
            console.error("Error updating toggle:", error);
            enqueueSnackbar("Error updating toggle. Please try again.", {
                variant: "error",
            });

            // Revert state on failure
            setTimeFields((prev) => ({
                ...prev,
                [userId]: { ...prev[userId], showFields: !isSelected },
            }));
        }
    };

    const handleTimeChange = (employeeId, field, value) => {
        setTimeFields((prev) => ({
            ...prev,
            [employeeId]: {
                ...prev[employeeId],
                [field]: value,
            },
        }));
    };

    const handleSave = async (employeeId) => {
        try {
            const { startTime, endTime } = timeFields[employeeId];

            if (!startTime || !endTime) {
                enqueueSnackbar("Both Break Start Time and Break End Time are required.", {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
                return;
            }

            const totalHours = calculateTotalHours(startTime, endTime);
            const currentDate = new Date().toISOString().split("T")[0];
            const breakStartUTC = new Date(`${currentDate}T${startTime}`).toISOString();
            const breakEndUTC = new Date(`${currentDate}T${endTime}`).toISOString();
            const requestData = {
                userId: employeeId,
                settings: {
                    breakTime: [
                        {
                            TotalHours: totalHours,
                            breakStartTime: `${currentDate}T${startTime}:00`,
                            breakEndTime: `${currentDate}T${endTime}:00`,
                        },
                    ],
                    individualbreakTime: true,
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
                enqueueSnackbar("Break Time successfully submitted!", { variant: "success" });

                // Fetch updated data from backend to reflect changes
                const updatedResponse = await axios.get(
                    `https://myuniversallanguages.com:9093/api/v1/superAdmin/getPunctualityDataEachUser/${employeeId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (updatedResponse.status === 200) {
                    const updatedData = updatedResponse.data?.employeeSettings?.breakTime?.[0] || {};
                    setTimeFields((prev) => ({
                        ...prev,
                        [employeeId]: {
                            showFields: true,
                            startTime: updatedData.breakStartTime?.substring(11, 16) || "",
                            endTime: updatedData.breakEndTime?.substring(11, 16) || "",
                        },
                    }));
                    setTimeFields((prev) => ({
                        ...prev,
                        [employeeId]: {
                            ...prev[employeeId],
                            startTime,
                            endTime,
                            showFields: true, // Ensure the toggle stays ON
                        },
                    }));
                }
            } else {
                enqueueSnackbar("Failed to submit Break Time.", { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar("Error submitting Break Time.", { variant: "error" });
            console.error("Error submitting Break Time:", error);
        }
    };


    const calculateTotalHours = (startTime, endTime) => {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const totalMinutes = (end - start) / (1000 * 60); // Calculate total minutes
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h:${minutes}m`; // Return in "Xh:Ym" format
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
            (employee) => employee.effectiveSettings?.individualbreakTime
        );
        if (employeeWithToggleOn) {
            setAllowBlur(true); // Example: Update a local state based on Redux
        }
    }, [employees]);


    const updateAllowBlur = (allowBlur) => {
        setAllowBlur(allowBlur);
    };


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

    const userCount = employees !== null && employees !== undefined ? employees.filter(employee => employee !== null && Object.keys(employee).length > 0).length : 0;

    console.log(activeTab);

    console.log('=============>', employees);
    // const filteredEmployees = employees.filter(employee => employee.name);
    const filteredEmployees = employees.filter(employee => employee.name && employee.userType !== "owner");

    console.log('=##########=>', filteredEmployees);


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
                        const { breakConvertedData } = response.data.data;

                        // Convert to UTC format using toISOString()
                        const utcBreakStartTime = breakConvertedData?.[0]?.breakStartTime
                            ? new Date(breakConvertedData[0].breakStartTime).toISOString().substring(11, 16)
                            : "";

                        const utcBreakEndTime = breakConvertedData?.[0]?.breakEndTime
                            ? new Date(breakConvertedData[0].breakEndTime).toISOString().substring(11, 16)
                            : "";

                        updatedFields[employee._id] = {
                            showFields: employee.punctualityData?.individualbreakTime || false, // Toggle state
                            startTime: utcBreakStartTime, // Converted to UTC
                            endTime: utcBreakEndTime,     // Converted to UTC
                        };
                    }
                }
                setTimeFields(updatedFields); // Set the fetched values
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        // if (employees.length > 0) {
        fetchAllEmployeeData(); // Fetch the data on mount
        // }
    }, [employees]); // This ensures it runs when employees change


    return (
        <>
            <div>
                <SnackbarProvider />
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
                                    </div>
                                    <div style={{ marginRight: 10 }}>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={timeFields[employee._id]?.showFields || false} // Reflect updated toggle state
                                                onChange={(e) => handleToggleChange(employee, e.target.checked)}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                                {timeFields[employee._id]?.showFields && (
                                    <div style={{ marginTop: 10, padding: 10, border: "1px solid #ccc", borderRadius: 5, display: 'flex', gap: '10px' }}>
                                        <div>
                                            <label>
                                                Break Start Time:

                                                <input
                                                    type="time"

                                                    value={timeFields[employee._id]?.startTime || ""} // Default to 00:00 if null
                                                    onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                                                    onChange={(e) =>
                                                        handleTimeChange(employee._id, "startTime", e.target.value)
                                                    }
                                                    style={{ marginLeft: 10 }}
                                                />
                                            </label>
                                            <label>
                                                Break End Time:
                                                <input
                                                    type="time"
                                                    value={timeFields[employee._id]?.endTime || ""} // Default to 00:00 if null
                                                    onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                                                    onChange={(e) =>
                                                        handleTimeChange(employee._id, "endTime", e.target.value)
                                                    }
                                                    style={{ marginLeft: 10 }}
                                                />
                                            </label>
                                            {/* <button onClick={handleSave}>Save Break Time</button> */}
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