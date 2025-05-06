// 📁 src/components/PunctualityModal.jsx
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import TimezoneSelect from 'react-timezone-select';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';


function PunctualityModal({ show, onClose, timezone, setTimezone, puncStartTime, setTimezoneOffset, setPuncStartTime, puncEndTime, setPuncEndTime, onSave, loading }) {
    return (
        // <Modal show={show} onHide={onClose} centered size="lg">

        <Modal show={show} onHide={onClose} style={{ zIndex: 2000 }} backdropStyle={{ zIndex: 1999 }}>

            <Modal.Header closeButton>
                <Modal.Title>⏰ Punctuality Settings</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ fontSize: "16px", lineHeight: "1.6" }}>
                <p><strong>Punctuality Enforcement:</strong></p>

                <ul>
                    <li>Track if users are starting their workday on time.</li>
                    <li>Allow flexibility or enforce strict start/end times.</li>
                    <li>Send punctuality alerts if users are consistently late.</li>
                </ul>

                <hr />

                <div className="mb-3">
                    <label className="form-label">Select Timezone</label>
                    <div className="dropdown">
                        <TimezoneSelect
                            value={timezone}
                            onChange={(tz) => {
                                setTimezone(tz.value);
                                setTimezoneOffset(tz.offset);
                            }}
                        />
                    </div>
                </div>

                {/* PuncStartTime Field */}
                <div className="mb-3">
                    {/* <label htmlFor="puncStartTime" className="form-label">Punctuality Start Time</label>
                    <input
                        type="time"
                        className="form-control"
                        id="puncStartTime"
                        placeholder="00:00 AM/PM"
                        value={puncStartTime}
                        onChange={(e) => setPuncStartTime(e.target.value)}
                    /> */}
                    {/* <label htmlFor="puncStartTime" className="form-label">
                        Punctuality Start Time
                    </label>
                    <TimePicker
                        onChange={setPuncStartTime}
                        value={puncStartTime}
                        id="puncStartTime"
                        format="hh:mm a"
                        disableClock={true}
                        clearIcon={null}
                        placeholder="00:00 AM"
                        className="custom-timepicker"
                    /> */}

                    <label htmlFor="puncStartTime" className="form-label">
                        Punctuality Start Time
                    </label>

                    <TimePicker
                        onChange={setPuncStartTime}
                        value={puncStartTime}
                        id="puncStartTime"
                        format="hh:mm a"
                        disableClock={true}
                        clearIcon={null}
                        placeholder="00:00 AM"
                        className="form-control"
                    />

                    {/* <input
                        type="text"
                        className="form-control"
                        id="puncStartTime"
                        placeholder="00:00 AM/PM"
                        value={puncStartTime}
                        onChange={(e) => setPuncStartTime(e.target.value)}
                    /> */}
                </div>

                {/* PuncEndTime Field */}
                <div className="mb-3">
                    <label htmlFor="puncEndTime" className="form-label">Punctuality End Time</label>
                    {/* <input
                        type="time"
                        className="form-control"
                        id="puncEndTime"
                        value={puncEndTime}
                        onChange={(e) => setPuncEndTime(e.target.value)}
                    /> */}
                    <TimePicker
                        onChange={setPuncEndTime}
                        value={puncEndTime}
                        id="puncEndTime"
                        format="hh:mm a"
                        disableClock={true}
                        clearIcon={null}
                        placeholder="00:00 AM"
                        className="form-control"
                    />
                </div>
            </Modal.Body>

            <Modal.Footer>

                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn text-white"
                    style={{ backgroundColor: '#7CCB58' }}
                    onClick={onSave}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default PunctualityModal;
