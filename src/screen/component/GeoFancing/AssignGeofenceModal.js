import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const geofenceList = [
    {
        name: 'Warehouse A',
        address: '123 Warehouse St, New York, NY 10001',
        status: 'active',
    },
    {
        name: 'Distribution Center',
        address: '456 Logistics Ave, Queens, NY 11101',
        status: 'active',
    },
    {
        name: 'Restricted Zone',
        address: '789 Secure St, Manhattan, NY 10016',
        status: 'active',
    },
    {
        name: 'Loading Dock',
        address: '200 Dock Rd, Brooklyn, NY 11211',
        status: 'active',
    },
    {
        name: 'Downtown Office',
        address: '100 Wall St, New York, NY 10005',
        status: 'inactive',
    },
];

const AssignGeofenceModal = ({ show, handleClose, employee }) => {
    const [selected, setSelected] = useState([]);

    const toggleGeofence = (name) => {
        setSelected((prev) =>
            prev.includes(name)
                ? prev.filter((n) => n !== name)
                : [...prev, name]
        );
    };

    const handleSave = () => {
        console.log(`Assigning to: ${selected.join(', ')}`);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Body className="p-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h5 className="fw-bold mb-1" style={{ fontSize: '20px' }}>Current Geofences</h5>
                        <div className="text-muted" style={{ fontSize: '14px' }}>Select to assign:</div>
                    </div>
                    <div
                        className="badge bg-light text-dark"
                        style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '12px' }}
                    >
                        {geofenceList.length} total
                    </div>
                </div>

                {/* List */}
                {geofenceList.map((geo, idx) => (
                    <div
                        key={idx}
                        className="d-flex justify-content-between align-items-center py-3 border-bottom"
                        style={{ fontSize: '14px' }}
                    >
                        <div>
                            <div className="fw-semibold">{geo.name}</div>
                            <div className="text-muted" style={{ fontSize: '13px' }}>{geo.address}</div>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <span
                                className={`badge px-3 py-1 fw-medium rounded-pill text-capitalize`}
                                style={{
                                    fontSize: '12px',
                                    backgroundColor: geo.status === 'active' ? '#007bff' : '#6c757d',
                                    color: '#fff',
                                }}
                            >
                                {geo.status}
                            </span>
                            <input
                                type="checkbox"
                                checked={selected.includes(geo.name)}
                                onChange={() => toggleGeofence(geo.name)}
                                style={{ width: '18px', height: '18px' }}
                            />
                        </div>
                    </div>
                ))}

                {/* Footer buttons */}
                <div className="d-flex justify-content-end mt-4">
                    <Button
                        variant="light"
                        onClick={handleClose}
                        style={{
                            border: '1px solid #dee2e6',
                            marginRight: '10px',
                            padding: '6px 18px',
                            borderRadius: '8px',
                            fontWeight: '500',
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        style={{
                            backgroundColor: '#0d6efd',
                            borderColor: '#0d6efd',
                            padding: '6px 20px',
                            borderRadius: '8px',
                            fontWeight: '500',
                        }}
                    >
                        Save
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AssignGeofenceModal;
