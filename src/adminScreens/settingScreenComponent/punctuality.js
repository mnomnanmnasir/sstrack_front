import React, { useEffect, useState } from "react";
import Switch from "../../screen/component/switch";
import user from '../../images/groupImg.svg'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CompanyEmployess from "../../screen/component/companyEmployess";
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

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [calculatedDuration, setCalculatedDuration] = useState("");
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

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

    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
        // Re-validate the end time when the start time changes
        if (endTime) {
            validateTimeDifference(e.target.value, endTime);
        }
    };

    const handleEndTimeChange = (e) => {
        const newEndTime = e.target.value;
        validateTimeDifference(startTime, newEndTime);
    };

    console.log("screenshot employess =====>", employees);
    debugger
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
            <div style={{ marginBottom: "10px" }}>
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