import React from "react";
import CompanyEmployess from "../../screen/component/companyEmployess";
import SaveChanges from "../../screen/component/button";

function WeeklyLimit() {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">Weekly Time Limit</p>
                </div>
                <div>
                    <SaveChanges />
                </div>
            </div>
            <div className="settingScreenshotDiv">
                <p>Number of hours your employees are allowed to work. The tracking will stop when the limit is reached. The time zone for the time limit is always UTC.</p>

            </div>
            <div className="takeScreenShotDiv">
                <div>
                    <input type="radio" id="limit" name="radio-group" checked />
                    <label for="limit">Limit</label>
                </div>
                <div >
                    <input className="number" type="number" placeholder="100" />
                    <label style={{
                        paddingLeft: "18px",
                        fontSize: "18px",
                        fontWeight: "500",
                        color: "#0E4772",
                    }}>hours per week</label>
                </div>
                <div>
                    <input type="radio" id="notlimit" name="radio-group" />
                    <label for="notlimit">Do not Limit</label>
                </div>
            </div>
            <div>
                <p className="settingScreenshotIndividual">Individual Settings</p>
                <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
                <CompanyEmployess>
                    <div>
                        <input type="radio" id="limit" name="radio-group" checked />
                        <label for="limit">Limit</label>
                    </div>
                    <div>
                        <input className="number" type="number" placeholder="100" />
                        <label style={{
                            paddingLeft: "18px",
                            fontSize: "18px",
                            fontWeight: "500",
                            color: "#0E4772",
                        }}>hours per week</label>
                    </div>
                    <div>
                        <input type="radio" id="notlimit" name="radio-group" />
                        <label for="notlimit">Do not Limit</label>
                    </div>
                </CompanyEmployess>
            </div>


        </div >
    )
}


export default WeeklyLimit;