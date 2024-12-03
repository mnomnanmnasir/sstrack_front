import React from "react";
import CompanyEmployess from "../../screen/component/companyEmployess";
import SaveChanges from "../../screen/component/button";

function CurrencySymbol() {
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                    <p className="settingScreenshotHeading">Currency symbol</p>
                </div>
                <div>
                    <SaveChanges />
                </div>
            </div>
            <div className="settingScreenshotDiv">
                <p>The symbol (e.g. $, €, £) will be shown when you set hourly pay rates for your employees and everywhere where money is shown (like total amount spent today or on a specific project).</p>
            </div>
            <div>
                <input className="dollar" placeholder="$" />
            </div>
            <p className="settingScreenshotIndividual">Individual Settings</p>
            <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
            <CompanyEmployess>
                <input className="dollar" style={{ marginTop: 0 }} placeholder="$" />
            </CompanyEmployess>
        </div>
    )
}

export default CurrencySymbol;