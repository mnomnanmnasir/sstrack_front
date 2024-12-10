import React, { useEffect, useState } from "react";
import setting from "../../images/settingIcon.webp";
import middleLine from "../../images/Line 3.webp";
import Screenshot from "../owner-setting-components/screenshot";
import line from "../../images/line.webp";
import ActivityLevel from "../owner-setting-components/activitylevel";
import UrlTracking from "../owner-setting-components/url";
import WeeklyLimit from "../owner-setting-components/weeklyLimit";
import { useActionData, useLocation } from "react-router-dom";
import AutoPause from "../owner-setting-components/autopause";
import OfflineTime from "../owner-setting-components/offlinetime";
import Notify from "../owner-setting-components/notify";
import WeekStart from "../owner-setting-components/weekStart";
import CurrencySymbol from "../owner-setting-components/currencySymbol";

function UserSettings() {

    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [employess, setEmployess] = useState(null);
    const [id, setId] = useState(null);
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    let token = localStorage.getItem('token');
    let user = JSON.parse(localStorage.getItem('items'));
    let headers = {
        Authorization: 'Bearer ' + token,
    }

    // async function getData() {
    //     setLoading(true)
    //     setLoading2(true)
    //     try {
    //         const response = await fetch(`${apiUrl}${user.userType === "admin" ? "/superAdmin/employees" : user.userType === "owner" ? "/owner/companies" : ""}`, { headers })
    //         const json = await response.json();
    //         setEmployess(() => {
    //             if (user.userType === "admin") {
    //                 const filterCompanies = json?.convertedEmployees?.filter((emp, index) => {
    //                     return user.company === emp.company && emp.isArchived === false && emp?.inviteStatus === false
    //                 })
    //                 return filterCompanies
    //             }
    //             else if (user.userType === "owner") {
    //                 const filterCompanies = json?.employees?.filter((emp, index) => {
    //                     return user.company === emp.company && emp.isArchived === false && emp?.inviteStatus === false
    //                 })
    //                 return filterCompanies
    //             }
    //         })
    //         setLoading2(false)
    //         setTimeout(() => {
    //             setLoading(false)
    //         }, 2000);
    //     }
    //     catch (error) {
    //         setLoading2(true)
    //         setLoading(false)
    //         console.log(error);
    //     }
    // }

    // useEffect(() => {
    //     getData()
    // }, [])

    console.log(employess);

    const [settingsTabs, setSettingTabs] = useState([
        { id: 1, showSetting: <Screenshot loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Screenshots", isActive: true, icon: "12/hr" },
        { id: 2, showSetting: <ActivityLevel loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Activity level tracking", isActive: false, icon: "Yes" },
        { id: 3, showSetting: <UrlTracking loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "App & URL tracking", isActive: false, icon: "Yes" },
        { id: 4, showSetting: <WeeklyLimit loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Weekly time limit", isActive: false, icon: "100 hr" },
        { id: 5, showSetting: <AutoPause loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Auto pause tracking after", isActive: false, icon: "5 min" },
        { id: 6, showSetting: <OfflineTime loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Allow adding offline time", isActive: false, icon: "Yes" },
        { id: 7, showSetting: <Notify loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Notify when screeshot is taken", isActive: false, icon: "Yes" },
        { id: 8, showSetting: <WeekStart loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Week starts on", isActive: false, icon: "Sun" },
        { id: 9, showSetting: <CurrencySymbol loading={loading} loading2={loading2} employees={employess} setEmployess={setEmployess} />, name: "Currency symbol", isActive: false, icon: "$" },
       

    ]);

    return (
        <div>
            <div className="container">
                <div className="mainwrapper">
                    <div className="settingContainer">
                        <div className="settingMainDiv">
                            <div>
                                {settingsTabs.map((tab) => {
                                    return (
                                        <>
                                            <button
                                                className={tab.isActive ? "activeButtonClass" : "screenshotButton"}
                                                onClick={() => {
                                                    setSettingTabs((prevTabs) => {
                                                        setId(tab.id)
                                                        return prevTabs.map((tabs, index) => {
                                                            if (tab.id === tabs.id) {
                                                                return {
                                                                    ...tabs,
                                                                    isActive: true
                                                                }
                                                            }
                                                            else {
                                                                return {
                                                                    ...tabs,
                                                                    isActive: false
                                                                }
                                                            }
                                                        })
                                                    })
                                                }}>
                                                <p>{tab.name}</p>
                                                <p className="hour12">{tab.icon}</p>
                                            </button>
                                            {id === tab.id && tab.showSetting}
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <img className="admin1Line" src={line} />
            </div>
        </div>
    );
}

export default UserSettings;