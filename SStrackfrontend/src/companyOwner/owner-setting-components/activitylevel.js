import React from "react";

function ActivityLevel(){
    return(
       <div>
        <p className="settingScreenshotHeading">Activity Level tracking</p>
            <div className="settingActivityDiv">
                <p>Track mouse and keyboard Activity Level</p>
            </div> 
            <div className="activityLevelDiv">
                <p>
                    <input type="radio" id="track" name="radio-group" checked />
                    <label for="track">Track</label>
                </p>
                <p>
                    <input type="radio" id="donottrack" name="radio-group" />
                    <label for="donottrack">Do not Track</label>
                </p>
            </div>
           <div className="activityLevelIndividual">
           <p className="settingScreenshotIndividual">Individual Settings</p>
            <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
            <div className="newDiv">

                <div className="form-group">
                    <input type="checkbox" id="tabish" />
                    <label for="tabish" className="tabish">Account Tabish</label>
                </div>
                <div className="trackLevelDiv">
                <p>
                    <input type="radio" id="tracks" name="radio-group" checked />
                    <label for="tracks">Track</label>
                </p>
                <p>
                    <input type="radio" id="donottracks" name="radio-group" />
                    <label for="donottracks">Do not Track</label>
                </p>
            </div>


            </div>
            
            <div className="newDiv">
                <div className="form-group">
                    <input type="checkbox" id="accountactivity" />
                    <label for="accountacitvity" className="tabish">Account Adam</label>
                </div>
            </div>
            
           </div>
       </div>
    )
}

export default ActivityLevel;