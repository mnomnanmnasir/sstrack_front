import React from "react";


function Notify(){
    return(
        <div>
        <p className="settingScreenshotHeading">Notify when screenshot is taken</p>
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
            <div className="newDiv">

                <div className="form-group">
                    <input type="checkbox" id="html" />
                    <label for="html" className="tabish">Account Tabish</label>
                </div>
                <div className="trackLevelDiv">
                <p>
                    <input type="radio" id="notify1" name="radio-group" checked />
                    <label for="notify1">Allow</label>
                </p>
                <p>
                    <input type="radio" id="donotnotify1" name="radio-group" />
                    <label for="donotnotify1">Do not Allow</label>
                </p>
            </div>


            </div>
            
            <div className="newDiv">
                <div className="form-group">
                    <input type="checkbox" id="account" />
                    <label for="account" className="tabish">Account Adam</label>
                </div>
            </div>
            
           </div>
       </div>
    )
}

export default Notify;