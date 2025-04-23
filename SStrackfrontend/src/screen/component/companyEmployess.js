import React, { useEffect, useState } from "react";
import Switch from "../../screen/component/switch";
import userIcon from '../../images/groupImg.svg'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useDispatch, useSelector } from "react-redux";
import { setEmployess, setEmployessSetting, setPunctualitySettings } from "../../store/adminSlice";
import axios from "axios";
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import brushIcon from '../../images/brush.svg'
import UserDetails from "../userDetails";



const CompanyEmployess = (props) => {

    const state = useSelector((state) => state)
    const [setting, setSetting] = useState([])
    const { Setting, loading } = props
    const [allowBlur, setAllowBlur] = useState(false);
    // const employees = useSelector((state) => state?.adminSlice?.employess)
    const employees = useSelector((state) => state?.adminSlice?.employess) || [];

    console.log('Employees', employees)
    // const employees = useSelector((state) => state.adminSlice.employess)
    // .filter((employee) => employee.invitationStatus === 'accepted');

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
    async function handleBreakTimeToggle(data) {
        const employeeId = data.employee._id;

        // Define breakTime settings for toggle
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
                : [], // Clear break times if toggled off
        };

        // Prepare the request payload
        const requestData = {
            userId: employeeId,
            settings: settingsToUpdate,
        };

        try {
            // Send API request
            const res = await axios.post(
                "https://myuniversallanguages.com:9093/api/v1/superAdmin/addIndividualPunctuality",
                requestData,
                { headers }
            );

            if (res.status === 200) {
                enqueueSnackbar("BreakTime settings updated successfully!", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });

                // Dispatch Redux action to update the state
                dispatch(setEmployess({
                    id: employeeId,
                    isSelected: data.isSelected,
                    key: "breakTime",
                }));
            } else {
                enqueueSnackbar("Failed to update BreakTime settings.", {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });
            }
        } catch (error) {
            console.error("Error updating BreakTime settings:", error);
            enqueueSnackbar("An error occurred while updating BreakTime settings.", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
        }
    }


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


    async function handleApplySetting(data) {

        console.log(data);
        const findUser = employees.find((f) => f.effectiveSettings[data.key] === false)

        const ssId = data.employee._id; // Assuming ssId should be the employee ID

        console.log('SSID', ssId)
        try {
            const res = await axios.patch(
                `https://myuniversallanguages.com:9093/api/v1/owner/settingsE/${data.employee._id}`,
                {
                    userId: data.employee._id,
                    effectiveSettings: {
                        ...findUser?.effectiveSettings,
                        [data.key]: data.isSelected,
                        userId: data.employee._id
                    }
                },
                {
                    headers
                }
            );

            if (res.status === 200) {
                enqueueSnackbar("Employee settings updated", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            } else {
                enqueueSnackbar("Failed to update employee settings", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            }
            console.log(res);
            const updatedAllowBlur = true; // Set to true since the screenshot is blurred
            if (data.key === "allowBlur") {
                dispatch(setEmployessSetting({
                    id: ssId,
                    allowBlur: updatedAllowBlur
                }));
                setAllowBlur(updatedAllowBlur); // Update local state
                props.updateAllowBlur(updatedAllowBlur); // Update parent component state
            }

        } catch (error) {
            console.error("Error updating employee settings:", error);
            enqueueSnackbar("An error occurred while updating employee settings", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
        }
    }

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

                                    <div style={{ marginRight: 10 }}>
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
                                    </div>
                                    {/* <div style={{ marginRight: 10 }}>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={employee?.effectiveSettings?.breakTime?.length > 0 || false} // Safely access the breakTime toggle
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

                                    {/* <div style={{ marginRight: 10 }}>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={employee?.effectiveSettings?.individualbreakTime || false} // Safely access the value
                                                onChange={(e) => {
                                                    handlePunctualitySetting({
                                                        employee,
                                                        isSelected: e.target.checked,
                                                    });
                                                }}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div> */}

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

