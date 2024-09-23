import React from "react";
import CompanyEmployess from "../../screen/component/companyEmployess";
import SaveChanges from "../../screen/component/button";

function WeekStart() {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">Week Starts on</p>
                </div>
                <div>
                    <SaveChanges />
                </div>
            </div>
            <div className="settingScreenshotDiv">
                <p>When does your week start?</p>
                <p>This will be used when showing totals for week or setting weekly time limits.</p>
            </div>
            <div>
                <select className="mydayselect">
                    <option>Sunday</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Satursday</option>

                </select>
            </div>
            <p className="settingScreenshotIndividual">Individual Settings</p>
            <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
            <CompanyEmployess>
                <select className="mydayselect" style={{ marginTop: 0 }}>
                    <option>Sunday</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Satursday</option>
                </select>
            </CompanyEmployess>
        </div>
    )
}
export default WeekStart;