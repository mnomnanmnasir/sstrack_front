import React, { useEffect, useState } from "react";
import UserHeader from "../screen/component/userHeader";
import Footer from "../screen/component/footer";
import menu from "../images/menu.webp";
import loader from "../images/Rectangle.webp";
import setting from "../images/settingIcon.webp";
import circle from "../images/circle.webp";
import middleLine from "../images/Line 3.webp";
import Screenshot from "./settingScreenComponent/screenshot";
import line from "../images/line.webp";
import ActivityLevel from "./settingScreenComponent/activitylevel";
import URL from "./settingScreenComponent/url";
import UrlTracking from "./settingScreenComponent/url";
import WeeklyLimit from "./settingScreenComponent/weeklyLimit";
import { useActionData, useLocation } from "react-router-dom";
import AutoPause from "./settingScreenComponent/autopause";
import OfflineTime from "./settingScreenComponent/offlinetime";
import Notify from "./settingScreenComponent/notify";
import WeekStart from "./settingScreenComponent/weekStart";
import CurrencySymbol from "./settingScreenComponent/currencySymbol";
import AdminHeader from "./component/adminHeader";
import AdminHead from "../screen/component/adminHeadSection";
import { getEmployess, setActiveTab, setIds } from "../store/adminSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import BreakTime from './settingScreenComponent/breakTime'
import Punctuality from './settingScreenComponent/punctuality'
function Setting() {

    const [loading, setLoading] = useState(false);
    const [settingsTabs, setSettingTabs] = useState([
        { id: 1, name: "Screenshots", isActive: true, icon: "12/hr" },
        { id: 2, name: "Activity level tracking", isActive: false, icon: "Yes" },
        { id: 3, name: "App & URL tracking", isActive: false, icon: "Yes" },
        { id: 5, name: "Auto pause tracking after", isActive: false, icon: "5 min" },
        { id: 6, name: "Allow adding offline time", isActive: false, icon: "Yes" },
        { id: 7, name: "Break Time", isActive: false, icon: "1hr" },
        { id: 8, name: "Punctuality", isActive: false, icon: "Yes" },
        // { id: 4, showSetting: <WeeklyLimit />, name: "Weekly time limit", isActive: false, icon: "100 hr" },
        // { id: 7, showSetting: <Notify />, name: "Notify when screeshot is taken", isActive: false, icon: "Yes" },
        // { id: 8, showSetting: <WeekStart />, name: "Week starts on", isActive: false, icon: "Sun" },
        // { id: 9, showSetting: <CurrencySymbol />, name: "Currency symbol", isActive: false, icon: "$" },
    ]);

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    let token = localStorage.getItem('token');
    let user = JSON.parse(localStorage.getItem('items'));
    let headers = {
        Authorization: 'Bearer ' + token,
    }
    const dispatch = useDispatch();

    async function getData() {
        try {
            const response = await fetch(`${apiUrl}/superAdmin/employees`, { headers })
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
        dispatch(setActiveTab({ id: 1, name: "Screenshots", isActive: true, icon: "12/hr" }))
    }, [])

    return (
        <div>
            <div className="container">
                <div className="userHeader">
                    <div className="headerTop">
                        <img src={setting} />
                        <h5>Settings</h5>
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="settingContainer">
                        <div className="settingMainDiv">
                            <div>
                                {settingsTabs.map((tab) => {
                                    return (
                                        <button
                                            className={tab.isActive ? "activeButtonClass" : "screenshotButton"}
                                            onClick={() => {
                                                dispatch(setActiveTab({ ...tab, isActive: true }))
                                                setSettingTabs((prevTabs) => {
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
                                    )
                                })}
                            </div>
                            <div>
                                <img src={middleLine} />
                            </div>
                            <div className="componentScreenshot">
                                {settingsTabs[0].isActive && <Screenshot activeTab={settingsTabs[0]} />}
                                {settingsTabs[1].isActive && <ActivityLevel activeTab={settingsTabs[1]} />}
                                {settingsTabs[2].isActive && <UrlTracking activeTab={settingsTabs[2]} />}
                                {settingsTabs[3].isActive && <AutoPause activeTab={settingsTabs[3]} />}
                                {settingsTabs[4].isActive && <OfflineTime activeTab={settingsTabs[4]} />}
                                {settingsTabs[5].isActive && <BreakTime activeTab={settingsTabs[5]} />}
                                {settingsTabs[6].isActive && <Punctuality activeTab={settingsTabs[6]} />}
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

export default Setting;