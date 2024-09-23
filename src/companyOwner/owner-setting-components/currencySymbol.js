import React from "react";

function CurrencySymbol() {
    return (
        <div>
            <p className="settingScreenshotHeading">Currency symbol</p>
            <div className="settingScreenshotDiv">
                <p>The symbol (e.g. $, €, £) will be shown when you set hourly pay rates for your employees and everywhere where money is shown (like total amount spent today or on a specific project).</p>

            </div>
            <p>
                <input className="dollar"  placeholder="$" />
                
            </p>

            <p className="settingScreenshotIndividual">Individual Settings</p>
            <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
        </div>
    )
}


export default CurrencySymbol;