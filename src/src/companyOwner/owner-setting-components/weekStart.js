import React from "react";

function WeekStart() {
    return (
        <div>
            <p className="settingScreenshotHeading">Week Starts on</p>
            <div className="settingScreenshotDiv">
                <p>When does your week start?</p>
                <p>This will be used when showing totals for week or setting weekly time limits.</p>
            </div>
            <p>
                <select className="mydayselect">
                    <option>Sunday</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Satursday</option>
                     
                </select>
            </p>
            <p className="settingScreenshotIndividual">Individual Settings</p>
            <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p> 
        </div>
    )
}
export default WeekStart;