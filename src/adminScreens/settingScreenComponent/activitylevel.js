import React, { useEffect, useState } from "react";
import CompanyEmployess from "../../screen/component/companyEmployess";
import SaveChanges from "../../screen/component/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { getEmployess, setAllUserSetting4, setEmployessSetting3 } from "../../store/adminSlice";

function ActivityLevel(props) {

    const employees = useSelector((state) => state.adminSlice.employess)
    let token = localStorage.getItem('token');
    let headers = {
        Authorization: 'Bearer ' + token,
    }
    const dispatch = useDispatch()

    const handleApplySettings = async (employee, check) => {
        const settings = {
            ...employee.effectiveSettings,
            individualAct: true,
            activityLevelTracking: check
        }
        try {
            const res = await axios.patch(`https://myuniversallanguages.com:9093/api/v1/owner/settingsE/${employee._id}`, {
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
            else{
                enqueueSnackbar(res.data.message, {
                    variant: "false",
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
                        checked={employee?.effectiveSettings?.activityLevelTracking === true}
                        onChange={() => {
                            handleApplySettings(employee, true);
                            dispatch(setEmployessSetting3({ type: "activityLevelTracking", id: employee._id, checked: true }));
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
                        checked={employee?.effectiveSettings?.activityLevelTracking === false}
                        onChange={() => {
                            handleApplySettings(employee, false);
                            dispatch(setEmployessSetting3({ type: "activityLevelTracking", id: employee._id, checked: false }));
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

    async function handleApply(activityLevelTracking) {
        try {
            const res = await axios.patch(`https://myuniversallanguages.com:9093/api/v1/superAdmin/settingsE`,
                employees?.filter(f => f.effectiveSettings?.individualAct === false).map((prevEmployess) => {
                    return {
                        userId: prevEmployess._id,
                        settings: {
                            ...prevEmployess.effectiveSettings,
                            activityLevelTracking: activityLevelTracking,
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

    console.log("activity level employess =====>", employees);

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

    return (
        <div>
            <SnackbarProvider />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">Activity Level tracking</p>
                </div>
                {/* <div>
                    <SaveChanges />
                </div> */}
            </div>
            <div className="settingActivityDiv">
                <p>Track mouse and keyboard Activity Level</p>
            </div>
            <div className="activityLevelDiv">
                <p>
                    <input
                        onChange={(e) => {
                            dispatch(setAllUserSetting4({ type: "activityLevel", value: true }))
                            handleApply(true)
                        }}
                        type="radio"
                        id="track"
                        name="radio-group"
                        checked={employees?.find(f => f?.effectiveSettings?.individualAct === false)?.effectiveSettings?.activityLevelTracking === true ? true : false}
                    />
                    <label for="track">Track</label>
                </p>
                <p>
                    <input
                        checked={employees?.find(f => f?.effectiveSettings?.individualAct === false)?.effectiveSettings?.activityLevelTracking === false ? true : false}
                        onChange={(e) => {
                            dispatch(setAllUserSetting4({ type: "activityLevel", value: false }))
                            handleApply(false)
                        }}
                        type="radio"
                        id="donottrack"
                        name="radio-group"
                    />
                    <label for="donottrack">Do not Track</label>
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

export default ActivityLevel;