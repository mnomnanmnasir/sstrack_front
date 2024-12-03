import React from "react";


function UrlTracking(){
    return(
        <div>
        <p className="settingScreenshotHeading">App & URL tracking</p>
            <div className="settingActivityDiv">
                <p>Track what applications your team members use and what websites they visit.</p>
            </div> 
            <div className="activityLevelDiv">
                <p>
                    <input type="radio" id="urltrack" name="radio-group" checked />
                    <label for="urltrack">Track</label>
                </p>
                <p>
                    <input type="radio" id="urldonottrack" name="radio-group" />
                    <label for="urldonottrack">Do not Track</label>
                </p>
            </div>
           <div className="activityLevelIndividual">
           <p className="settingScreenshotIndividual">Individual Settings</p>
            <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
            <div className="newDiv">

                <div className="form-group">
                    <input type="checkbox" id="urlcheck" />
                    <label for="urlcheck" className="tabish">Account Tabish</label>
                </div>
                <div className="trackLevelDiv">
                <p>
                    <input type="radio" id="urltracks" name="radio-group" checked />
                    <label for="urltracks">Track</label>
                </p>
                <p>
                    <input type="radio" id="urldonottracks" name="radio-group" />
                    <label for="urldonottracks">Do not Track</label>
                </p>
            </div>


            </div>
            
            <div className="newDiv">
                <div className="form-group">
                    <input type="checkbox" id="urlchecks" />
                    <label for="urlchecks" className="tabish">Account Adam</label>
                </div>
            </div>
           
           </div>
       </div>
    )
}

export default UrlTracking;