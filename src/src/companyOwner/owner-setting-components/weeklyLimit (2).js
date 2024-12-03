import React from "react";

function WeeklyLimit(){
    return(
        <div>
          <p className="settingScreenshotHeading">Weekly Time Limit</p>
            <div className="settingScreenshotDiv">
                <p>Number of hours your employees are allowed to work. The tracking will stop when the limit is reached. The time zone for the time limit is always UTC.</p>
                
            </div>
            <div className="takeScreenShotDiv">
                <p>
                    <input type="radio" id="limit" name="radio-group" checked />
                    <label for="limit">Limit</label>
                </p>
                <p>
                    <input className="number" type="number" placeholder="100"/>
                    <span>hours per week</span>
                </p>
                
               
                <p>
                    <input type="radio" id="notlimit" name="radio-group" />
                    <label for="notlimit">Do not Limit</label>
                </p>
            </div>
            <div>
            <p className="settingScreenshotIndividual">Individual Settings</p>
            <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
            <div className="newDiv">

                <div className="form-group">
                    <input type="checkbox" id="weeklyLimit" />
                    <label for="weeklyLimit" className="tabish">Account Tabish</label>
                </div>
                <div>
                   <div className="takeScreenShotDivs">
                <p>
                    <input type="radio" id="limit1" name="radio-group" checked />
                    <label for="limit1">Limit</label>
                </p>
                <p>
                    <input className="number" type="number" placeholder="100"/>
                    <span>hours per week</span>
                </p>
                
               
                <p>
                    <input type="radio" id="notlimit1" name="radio-group" />
                    <label for="notlimit1">Do not Limit</label>
                </p>
            </div>
                </div>


            </div>
           
            <div className="newDiv">
                <div className="form-group">
                    <input type="checkbox" id="weeklyLimit1" />
                    <label for="weeklyLimyi" className="tabish">Account Adam</label>
                </div>
            </div>
            
            </div>


        </div>
    )
}


export default WeeklyLimit;