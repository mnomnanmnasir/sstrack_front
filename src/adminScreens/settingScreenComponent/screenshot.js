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
            const res = await axios.patch(`https://myuniversallanguages.com:9093/api/v1/owner/settingsE/${employee._id}`,
                {
                    userId: employee._id,
                    effectiveSettings: type === "setting1" ? settings : type === "setting2" ? settings2 : settings3
                }, { headers })
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
            console.log(error);
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
            const res = await axios.patch(`https://myuniversallanguages.com:9093/api/v1/superAdmin/settingsE`,
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
            console.log(error);
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
            const response = await fetch(`https://myuniversallanguages.com:9093/api/v1/superAdmin/employees`, { headers })
            const json = await response.json();
            dispatch(getEmployess(json?.convertedEmployees))
            // json?.convertedEmployees.map(async (employee) => {
            //     const data = await axios.get(`https://myuniversallanguages.com:9093/api/v1/superAdmin/Settings/${employee._id}`)
            //     if (data?.data?.employeeSettings?.userId) {
            //         dispatch(setIds(data?.data?.employeeSettings?.userId))
            //     }
            // })
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData()
    }, [])
    
    console.log("screenshot employess =====>", employees);

    return (
        <div>
            <SnackbarProvider />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">Screenshots</p>
                </div>
            </div>
            <div className="settingScreenshotDiv">
                <p>How frequently screenshots will be taken.</p>
                <p>This number is an average since screenshots are taken at random intervals.</p>
            </div>
            <div className="takeScreenShotDiv">
                <div>
                    <input
                        checked={employees?.find(f => f?.effectiveSettings?.individualss === false && f?.effectiveSettings?.screenshots?.enabled === true)}
                        onChange={() => {
                            dispatch(setAllUserSetting({ checked: true }))
                            handleApply("take")
                        }} type="radio" id="test1" name="radio-group" />
                    <label for="test1">Take</label>
                </div>
                <div>
                    <select
                        value={number}
                        className="myselect"
                        onChange={async (e) => {
                            dispatch(setAllUserSetting2({ value: e.target.value }))
                            const value = e.target.value;
                            try {
                                const res = await axios.patch(`https://myuniversallanguages.com:9093/api/v1/superAdmin/settingsE`,
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
                                console.log(res);
                            } catch (error) {
                                console.log(error);
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
                </div>
                <div>
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
                                const res = await axios.patch(`https://myuniversallanguages.com:9093/api/v1/superAdmin/settingsE`,
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
                                console.log(error);
                            }
                        }}>
                        <option value="Allow Blur">Allow Blur</option>
                        <option value="Disallow Blur">Disallow Blur</option>
                        <option value="Blur all">Blur all</option>
                    </select>
                </div>
                <div>
                    <input
                        checked={employees?.find(f => f?.effectiveSettings?.individualss === false && f?.effectiveSettings?.screenshots?.enabled === false)}
                        onChange={() => {
                            dispatch(setAllUserSetting({ checked: false }))
                            handleApply("do not take")
                        }} type="radio" id="test2" name="radio-group" />
                    <label for="test2">Do not Take</label>
                </div>
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