import React from "react";


function AutoPause() {
    return (
        <div>
            <p className="settingScreenshotHeading">Auto-pause tracking after</p>
            <div className="settingScreenshotDiv">
                <p>Tracking will automatically pause after the specified period of inactivity and will automatically resume when user becomes active again.</p>

            </div>
            <div className="takeScreenShotDiv">
                <p>
                    <input type="radio" id="pause" name="radio-group" checked />
                    <label for="pause">Pause after</label>
                </p>
                <p>
                    <input className="number" type="number" placeholder="5" />
                    <span>minutes of user inactivity</span>
                </p>


                <p>
                    <input type="radio" id="notpause" name="radio-group" />
                    <label for="notpause">Do not pause</label>
                </p>
            </div>
            <div>
                <p className="settingScreenshotIndividual">Individual Settings</p>
                <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
                <div className="newDiv">

                    <div className="form-group">
                        <input type="checkbox" id="autopause" />
                        <label for="autopause" className="tabish">Account Tabish</label>
                    </div>
                    <div>
                        <div className="takeScreenShotDivs">
                            <p>
                                <input type="radio" id="pause1" name="radio-group" checked />
                                <label for="pause1">Pause after</label>
                            </p>
                            <p>
                                <input className="number" type="number" placeholder="5" />
                                <span>minutes of user inactivity</span>

                            </p>


                            <p>
                                <input type="radio" id="notpause1" name="radio-group" />
                                <label for="notpause1">Do not pause</label>
                            </p>
                        </div>
                    </div>


                </div>

                <div className="newDiv">
                    <div className="form-group">
                        <input type="checkbox" id="autopause1" />
                        <label for="autopause1" className="tabish">Account Adam</label>
                    </div>
                </div>

            </div>


        </div>
    )
}

export default AutoPause;