// import React, { useEffect, useState } from "react";
// import UserHeader from "../screen/component/userHeader";
// import Footer from "../screen/component/footer";
// import menu from "../images/menu.webp";
// import loader from "../images/Rectangle.webp";
// import setting from "../images/settingIcon.webp";
// import circle from "../images/circle.webp";
// import middleLine from "../images/Line 3.webp";
// import Screenshot from "../companyOwner/owner-setting-components/screenshot";
// import line from "../images/line.webp";
// import ActivityLevel from "../companyOwner/owner-setting-components/activitylevel";
// import URL from "../companyOwner/owner-setting-components/url";
// import UrlTracking from "../companyOwner/owner-setting-components/url";
// import WeeklyLimit from "../companyOwner/owner-setting-components/weeklyLimit";
// import { useActionData, useLocation } from "react-router-dom";
// import AutoPause from "../companyOwner/owner-setting-components/autopause";
// import OfflineTime from "../companyOwner/owner-setting-components/offlinetime";
// import Notify from "../companyOwner/owner-setting-components/notify";
// import WeekStart from "../companyOwner/owner-setting-components/weekStart";
// import CurrencySymbol from "../companyOwner/owner-setting-components/currencySymbol";

// function EffectiveSettings() {

//     const [settingsTabs, setSettingTabs] = useState([
//         { id: 1, showSetting: <Screenshot />, name: "Screenshots", isActive: true, icon: "12/hr" },
//         { id: 2, showSetting: <ActivityLevel />, name: "Activity level tracking", isActive: false, icon: "Yes" },
//         { id: 3, showSetting: <UrlTracking />, name: "App & URL tracking", isActive: false, icon: "Yes" },
//         { id: 4, showSetting: <WeeklyLimit />, name: "Weekly time limit", isActive: false, icon: "100 hr" },
//         { id: 5, showSetting: <AutoPause />, name: "Auto pause tracking after", isActive: false, icon: "5 min" },
//         { id: 6, showSetting: <OfflineTime />, name: "Allow adding offline time", isActive: false, icon: "Yes" },
//         { id: 7, showSetting: <Notify />, name: "Notify when screeshot is taken", isActive: false, icon: "Yes" },
//         { id: 8, showSetting: <WeekStart />, name: "Week starts on", isActive: false, icon: "Sun" },
//         { id: 9, showSetting: <CurrencySymbol />, name: "Currency symbol", isActive: false, icon: "$" },
//     ]);
//     const [loading, setLoading] = useState(false)
//     const [loading2, setLoading2] = useState(false)
//     const [employees, setEmployees] = useState(null);
//     const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
//     let token = localStorage.getItem('token');
//     let user = JSON.parse(localStorage.getItem('items'));
//     let headers = {
//         Authorization: 'Bearer ' + token,
//     }

//     return (
//         <div>
//             <div className="container">
//                 <div className="userHeader">
//                     <div className="headerTop">
//                         <img src={setting} />
//                         <h5>Settings</h5>
//                     </div>
//                 </div>
//                 <div className="mainwrapper">
//                     <div className="settingContainer">
//                         <div className="settingMainDiv">
//                             <div>
//                                 {settingsTabs.map((tab) => {
//                                     return (
//                                         <button
//                                             className={tab.isActive ? "activeButtonClass" : "screenshotButton"}
//                                             onClick={() => {
//                                                 setSettingTabs((prevTabs) => {
//                                                     return prevTabs.map((tabs, index) => {
//                                                         if (tab.id === tabs.id) {
//                                                             return {
//                                                                 ...tabs,
//                                                                 isActive: true
//                                                             }
//                                                         }
//                                                         else {
//                                                             return {
//                                                                 ...tabs,
//                                                                 isActive: false
//                                                             }
//                                                         }
//                                                     })
//                                                 })
//                                             }}>
//                                             <p>{tab.name}</p>
//                                             <p className="hour12">{tab.icon}</p>
//                                         </button>
//                                     )
//                                 })}
//                             </div>
//                             <div>
//                                 <img src={middleLine} />
//                             </div>
//                             <div className="componentScreenshot">
//                                 {settingsTabs.find(f => f.isActive)?.showSetting}
//                                 {/* {activeSetting === "component1" && <Screenshot />}
//                                 {activeSetting === "component2" && <ActivityLevel />}
//                                 {activeSetting === "component3" && <UrlTracking />}
//                                 {activeSetting === "component4" && <WeeklyLimit />}
//                                 {activeSetting === "component5" && <AutoPause />}
//                                 {activeSetting === "component6" && <OfflineTime />}
//                                 {activeSetting === "component7" && <Notify />}
//                                 {activeSetting === "component8" && <WeekStart />}
//                                 {activeSetting === "component9" && <CurrencySymbol />} */}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div>
//                 <img className="admin1Line" src={line} />
//             </div>
//         </div>
//     );
// }

// export default EffectiveSettings;