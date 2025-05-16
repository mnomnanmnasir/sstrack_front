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
import moment from "moment-timezone";



const CompanyEmployess = (props) => {


    const [localToggleState, setLocalToggleState] = useState({}); // Manage local toggle states
    const state = useSelector((state) => state)
    const [setting, setSetting] = useState([])
    const { Setting, loading, employees } = props
    const [allowBlur, setAllowBlur] = useState(false);
    // const employees = useSelector((state) => state?.adminSlice?.employess)|| []


    const [timeFields, setTimeFields] = useState({})

    useEffect(() => {
        if (Array.isArray(employees)) {
            const initialFields = employees.reduce((acc, employee) => {
                acc[employee?._id] = {
                    showFields: employee?.punctualityData?.individualbreakTime || false,
                    startTime: timeFields[employee?._id]?.startTime || "",
                    duration: timeFields[employee?._id]?.duration || "",
                };
                return acc;
            }, {});
            setTimeFields(initialFields);
        } else {
            setTimeFields({});
        }
    }, [employees]);

    const handleToggleChange = (employee, isSelected) => {
        const userId = employee._id;

        setTimeFields((prev) => ({
            ...prev,
            [userId]: { ...prev[userId], showFields: isSelected },
        }));
    };


    const handleFieldChange = (employeeId, field, value) => {
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
            const { startTime, duration } = timeFields[employeeId];

            if (!duration) {
                enqueueSnackbar("Both Break Start Time and Total Duration are required.", {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
                return;
            }

            const currentDate = new Date().toISOString().split("T")[0];
            const employee = employees.find(emp => emp._id === employeeId);
            const timezone = employee?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
            const timezoneOffset = employee?.timezoneOffset ?? new Date().getTimezoneOffset();

            const breakStartTime = startTime
                ? moment.tz(`${currentDate}T${startTime}`, moment.tz.guess()).format()
                : null;


            const requestData = {
                userId: employeeId,
                settings: {
                    breakTime: [
                        {
                            TotalHours: duration,
                            breakStartTime,
                            breakEndTime: null, // always null
                        },
                    ],
                    timezone,
                    timezoneOffset,
                },
            };


            setTimeFields((prev) => ({
                ...prev,
                [employeeId]: {
                    ...prev[employeeId],
                    showFields: true,
                },
            }));

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
                enqueueSnackbar("Break Time successfully submitted!", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });

                // Fetch updated break data
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
                    const breakStart = updatedData.breakStartTime
                        ? new Date(updatedData.breakStartTime).toISOString().split("T")[1].substring(0, 5)
                        : startTime;

                    setTimeFields((prev) => ({
                        ...prev,
                        [employeeId]: {
                            showFields: true,
                            startTime: breakStart,
                            duration: updatedData.TotalHours || duration,
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
        if (Array.isArray(employees)) {
            const employeeWithBlur = employees.find(employee => employee?.effectiveSettings?.screenshots?.allowBlur);
            setAllowBlur(!!employeeWithBlur);
        }
    }, [employees]);

    const activeTab = useSelector((state) => state?.adminSlice?.activeTab)
    const dispatch = useDispatch()
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };
    useEffect(() => {
        if (Array.isArray(employees)) {
            const employeeWithToggleOn = employees.find(
                (employee) => employee?.effectiveSettings?.individualbreakTime
            );
            if (employeeWithToggleOn) {
                setAllowBlur(true);
            }
        } else {
            console.warn("employees is not an array:", employees);
        }
    }, [employees]);
    // useEffect(() => {
    //     // Set local toggle state based on Redux state
    //     const employeeWithToggleOn = employees.find(
    //         (employee) => employee.effectiveSettings?.individualbreakTime
    //     );
    //     if (employeeWithToggleOn) {
    //         setAllowBlur(true); // Example: Update a local state based on Redux
    //     }
    // }, [employees]);


    const updateAllowBlur = (allowBlur) => {
        setAllowBlur(allowBlur);
    };


    const userCount = employees !== null && employees !== undefined ? employees.filter(employee => employee !== null && Object.keys(employee).length > 0).length : 0;

    // const filteredEmployees = employees.filter(employee => employee.name);

    // const filteredEmployees = employees.filter(employee => employee.name && employee.userType !== "owner");
    const filteredEmployees = Array.isArray(employees)
        ? employees.filter(
            (employee) =>
                employee &&
                typeof employee === "object" &&
                Object.keys(employee).length > 0 &&
                employee.name &&
                employee.userType !== "owner"
        )
        : [];

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
                        const breakData = response.data.data?.convertedBreakTimes?.[0]; // ✅ Correct name & safe access

                        updatedFields[employee._id] = {
                            showFields: employee.punctualityData?.individualbreakTime || false,
                            startTime: breakData?.breakStartTime
                                ? moment(breakData.breakStartTime).format("HH:mm") // ✅ NO .utc() here
                                : "",
                            endTime: breakData?.breakEndTime
                                ? moment(breakData.breakEndTime).format("HH:mm")
                                : "",
                        };
                    }
                }

                setTimeFields(updatedFields);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        fetchAllEmployeeData();
    }, [employees]);



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
                                        {/* <p style={{ marginLeft: 10, fontSize: 12, color: 'black' }}>
                                            {employee?.timezone} (UTC {employee?.timezoneOffset >= 0 ? `+${employee?.timezoneOffset}` : employee?.timezoneOffset})
                                        </p> */}
                                        <p style={{ marginLeft: 10, fontSize: 12, color: 'black' }}>
                                            {employee?.timezone} (UTC {employee?.timezoneOffset >= 0 ? `+${employee?.timezoneOffset}` : employee?.timezoneOffset})
                                            {timeFields[employee._id]?.startTime && timeFields[employee._id]?.endTime && (
                                                <> | Break: {timeFields[employee._id].startTime} to {timeFields[employee._id].endTime}</>
                                            )}
                                        </p>
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
                                    <div style={{ marginTop: 10, padding: 10, border: "1px solid #ccc", borderRadius: 5, display: "flex", gap: '10px' }}>
                                        <div>
                                            <label>
                                                (optional) Break Start Time:
                                                <input
                                                    type="time"
                                                    value={timeFields[employee._id]?.startTime || ""}
                                                    onFocus={(e) => e.target.showPicker()}
                                                    onChange={(e) =>
                                                        handleFieldChange(employee._id, "startTime", e.target.value)
                                                    }
                                                    style={{ marginLeft: 10 }}
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                Total Duration:
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 0h:15m"
                                                    value={timeFields[employee._id]?.duration || ""}
                                                    onChange={(e) =>
                                                        handleFieldChange(employee._id, "duration", e.target.value)
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