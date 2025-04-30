// 📁 src/components/PunctualityModal.jsx
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import TimezoneSelect from 'react-timezone-select';

function PunctualityModal({ show, onClose, timezone, setTimezone, puncStartTime,setTimezoneOffset, setPuncStartTime, puncEndTime, setPuncEndTime, onSave, loading }) {
    return (
        <Modal show={show} onHide={onClose} centered size="lg">
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
                    <label htmlFor="puncStartTime" className="form-label">Punctuality Start Time</label>
                    <input
                        type="time"
                        className="form-control"
                        id="puncStartTime"
                        value={puncStartTime}
                        onChange={(e) => setPuncStartTime(e.target.value)}
                    />
                </div>

                {/* PuncEndTime Field */}
                <div className="mb-3">
                    <label htmlFor="puncEndTime" className="form-label">Punctuality End Time</label>
                    <input
                        type="time"
                        className="form-control"
                        id="puncEndTime"
                        value={puncEndTime}
                        onChange={(e) => setPuncEndTime(e.target.value)}
                    />
                </div>
            </Modal.Body>

            <Modal.Footer>
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={onSave}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save & Close"}
                </button>

                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancel
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default PunctualityModal;
