// 📁 src/components/BreakTimeModal.jsx
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import TimezoneSelect from 'react-timezone-select';

function BreakTimeModal({ show, onClose, timezone, setTimezone, timezoneOffset, setTimezoneOffset, breakStartTime, setBreakStartTime, breakEndTime, setBreakEndTime, onSave, loading }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Set Break Time</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form>
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

          <div className="mb-3">
            <label htmlFor="breakStartTime" className="form-label">Break Start Time</label>
            <input
              type="time"
              className="form-control"
              id="breakStartTime"
              value={breakStartTime}
              onChange={(e) => setBreakStartTime(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="breakEndTime" className="form-label">Break End Time</label>
            <input
              type="time"
              className="form-control"
              id="breakEndTime"
              value={breakEndTime}
              onChange={(e) => setBreakEndTime(e.target.value)}
            />
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          className="btn btn-success"
          onClick={onSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default BreakTimeModal;
