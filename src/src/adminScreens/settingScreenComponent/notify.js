import React from "react";
import CompanyEmployess from "../../screen/component/companyEmployess";
import SaveChanges from "../../screen/component/button";

function Notify() {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">Notify when screenshot is taken</p>
                </div>
                <div>
                    <SaveChanges />
                </div>
            </div>
            <div className="settingActivityDiv">
                <p>Every time a screenshot is taken – a small notification will pop up for a couple of seconds next to the system tray saying that a Screenshot was taken.</p>
            </div>
            <div className="activityLevelDiv">
                <p>
                    <input type="radio" id="notify" name="radio-group" checked />
                    <label for="notify">Allow</label>
                </p>
                <p>
                    <input type="radio" id="donotnotify" name="radio-group" />
                    <label for="donotnotify">Do not Allow</label>
                </p>
            </div>
            <div className="activityLevelIndividual">
                <p className="settingScreenshotIndividual">Individual Settings</p>
                <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
                <CompanyEmployess>
                    <div>
                        <p>
                            <input type="radio" id="notify" name="radio-group" checked />
                            <label for="notify">Allow</label>
                        </p>
                    </div>
                    <div>
                        <p>
                            <input type="radio" id="donotnotify" name="radio-group" />
                            <label for="donotnotify">Do not Allow</label>
                        </p>
                    </div>
                </CompanyEmployess>
            </div>
        </div>
    )
}

export default Notify;