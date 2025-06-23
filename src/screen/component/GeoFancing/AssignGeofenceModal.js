import React, { useEffect, useState } from 'react';
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
    const [geofenceList, setGeofenceList] = useState([]);
    // Fetch geofences on open
    useEffect(() => {
        if (!show) return;

        const fetchGeofences = async () => {
            try {
                const res = await fetch('https://myuniversallanguages.com:9093/api/v1/tracker/getGeofencesByAssignmentStatus', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();

                if (data.success) {
                    const combined = [
                        ...(data.data.assigned || []),
                        ...(data.data.unassigned || []),
                    ];

                    const formatted = combined.map((geo) => ({
                        id: geo._id,
                        name: geo.geoFenceName,
                        address: geo.address,
                        status: geo.userId && geo.userId.length > 0 ? 'assigned' : 'unassigned',
                    }));

                    setGeofenceList(formatted);
                }
            } catch (error) {
                console.error('Failed to fetch geofences', error);
            }
        };

        fetchGeofences();
    }, [show]);
    const toggleGeofence = (id) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((n) => n !== id)
                : [...prev, id]
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
                                    backgroundColor: geo.status === 'assigned' ? '#007bff' : '#6c757d',
                                    color: '#fff',
                                }}
                            >
                                {geo.status}
                            </span>
                            <input
                                type="checkbox"
                                checked={selected.includes(geo.id)}
                                onChange={() => toggleGeofence(geo.id)}
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
