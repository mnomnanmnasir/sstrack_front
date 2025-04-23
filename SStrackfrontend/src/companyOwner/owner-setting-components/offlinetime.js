import React from "react";


function OfflineTime(){
    return(
        <div>
        <p className="settingScreenshotHeading">Allow adding Offline Time</p>
            <div className="settingActivityDiv">
                <p>Allow user to add time not tracked by the program to their timeline manually. It is often used to account for work away from a computer.</p>
            </div> 
            <div className="activityLevelDiv">
                <p>
                    <input type="radio" id="allow" name="radio-group" checked />
                    <label for="allow">Allow</label>
                </p>
                <p>
                    <input type="radio" id="donotallow" name="radio-group" />
                    <label for="donotallow">Do not Allow</label>
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
                    <input type="radio" id="allow1" name="radio-group" checked />
                    <label for="allow1">Allow</label>
                </p>
                <p>
                    <input type="radio" id="donotallow1" name="radio-group" />
                    <label for="donotallow1">Do not Allow</label>
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
export default OfflineTime;