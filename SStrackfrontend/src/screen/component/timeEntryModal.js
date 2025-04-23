import React from 'react';
import cross from "../../images/cross.webp";

const TimeEntryModal = (props) => {

    const { edit, setEdit, splitsActivity, changeOffline } = props

    return (
        <div className="editBox">
            <div className="editBoxUpperDiv">
                <h1>Edit</h1>
                <button onClick={() => setEdit(false)}><img src={cross} /></button>
            </div>
            <div className="editBoxLowerDiv">
                <p>You can trim activity time, or edit activity note. <br />
                    If you need add time, then <a onClick={changeOffline}>Add Offline Time </a> instead
                </p>

                <div className="editboxinputdiv">
                    <input placeholder="9:10am" />-<input placeholder="9:50am" /> <p>-0h 40m</p>
                </div>
                <p className="sevenAm">eg 7am to 9:10am or 17:30 to 22:00</p>
                <div>
                    <select className="projectOption">
                        <option>Infiniti solution</option>
                        <option>Infiniti solution</option>
                        <option>Infiniti solution</option>
                        <option>Infiniti solution</option>
                        <option>Infiniti solution</option>
                    </select>
                </div>
                <textarea placeholder="Note (optional)" rows="5" ></textarea>
                <div className="deleteActivityPart">
                    <div>
                        <input className="deleteactivityCheckbox" id="editcheck" type="checkbox" />
                        <label id="editcheck">Delete Activity</label>
                    </div>
                    <p className="text-decoratiob-underline" onClick={splitsActivity}>Split Activity</p>
                </div>
                <div className="editSaveChanges">
                    <button className="btn saveChangesButton">Save Changes</button>
                    <button className="btn cancelChangesButton" onClick={() => setEdit(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default TimeEntryModal;
