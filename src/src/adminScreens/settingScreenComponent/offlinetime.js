import React, { useEffect, useState } from "react";
import CompanyEmployess from "../../screen/component/companyEmployess";
import SaveChanges from "../../screen/component/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { getEmployess, setAllUserSetting4, setEmployessSetting3 } from "../../store/adminSlice";

function OfflineTime(props) {

    const employees = useSelector((state) => state.adminSlice.employess)
    let token = localStorage.getItem('token');
    let headers = {
        Authorization: 'Bearer ' + token,
    }
    const dispatch = useDispatch()

    const handleApplySettings = async (employee, check) => {
        const settings = {
            ...employee.effectiveSettings,
            individualOffline: true,
            allowAddingOfflineTime: check
        }
        try {
            const res = await axios.patch(`https://ss-track-xi.vercel.app/api/v1/owner/settingsE/${employee._id}`, {
                userId: employee._id,
                effectiveSettings: settings
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
        return (
            <>
                <div>
                    <input
                        checked={employee?.effectiveSettings?.allowAddingOfflineTime === true}
                        onChange={() => {
                            handleApplySettings(employee, true);
                            dispatch(setEmployessSetting3({ type: "allowAddingOfflineTime", id: employee._id, checked: true }));
                        }}
                        type="radio"
                        id={`${employee._id}_take`} // Unique ID for "Take" option
                        name={`${employee._id}_takeOption`} // Unique name for this user's radio button group
                        value="take"
                    />
                    <label htmlFor={`${employee._id}_take`}>Track</label>
                </div>
                <div>
                    <input
                        checked={employee?.effectiveSettings?.allowAddingOfflineTime === false}
                        onChange={() => {
                            handleApplySettings(employee, false);
                            dispatch(setEmployessSetting3({ type: "allowAddingOfflineTime", id: employee._id, checked: false }));
                        }}
                        type="radio"
                        id={`${employee._id}_do_not_take`} // Unique ID for "Do Not Take" option
                        name={`${employee._id}_takeOption`} // Unique name for this user's radio button group
                        value="do_not_take"
                    />
                    <label htmlFor={`${employee._id}_do_not_take`}>Do Not Track</label>
                </div>
            </>
        )
    }

    async function handleApply(allowAddingOfflineTime) {
        try {
            const res = await axios.patch(`https://ss-track-xi.vercel.app/api/v1/superAdmin/settingsE`,
                employees?.filter(f => f.effectiveSettings?.individualOffline === false).map((prevEmployess) => {
                    return {
                        userId: prevEmployess._id,
                        settings: {
                            ...prevEmployess.effectiveSettings,
                            allowAddingOfflineTime: allowAddingOfflineTime,
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
            console.log(error);
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            <SnackbarProvider />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">Allow adding Offline Time</p>
                </div>
                {/* <div>
                    <SaveChanges />
                </div> */}
            </div>
            <div className="settingActivityDiv">
                <p>Allow user to add time not tracked by the program to their timeline manually. It is often used to account for work away from a computer.</p>
            </div>
            <div className="activityLevelDiv">
                <p>
                    <input
                        onChange={(e) => {
                            dispatch(setAllUserSetting4({ type: "allowAddingOfflineTime", value: true }))
                            handleApply(true)
                        }}
                        type="radio"
                        id="track"
                        name="radio-group"
                        checked={employees?.find(f => f?.effectiveSettings?.individualOffline === false)?.effectiveSettings?.allowAddingOfflineTime === true ? true : false}
                    />
                    <label for="track">Allow</label>
                </p>
                <p>
                    <input
                        checked={employees?.find(f => f?.effectiveSettings?.individualOffline === false)?.effectiveSettings?.allowAddingOfflineTime === false ? true : false}
                        onChange={(e) => {
                            dispatch(setAllUserSetting4({ type: "allowAddingOfflineTime", value: false }))
                            handleApply(false)
                        }}
                        type="radio"
                        id="donottrack"
                        name="radio-group"
                    />
                    <label for="donottrack">Do not Allow</label>
                </p>
            </div>
            <div className="activityLevelIndividual">
                <p className="settingScreenshotIndividual">Individual Settings</p>
                <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
                <CompanyEmployess Setting={Setting} />
            </div>
        </div>
    )
}

export default OfflineTime;