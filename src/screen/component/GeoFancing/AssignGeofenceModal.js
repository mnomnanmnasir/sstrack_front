import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { SnackbarProvider, enqueueSnackbar } from "notistack";
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
    const [geofences, setGeofences] = useState([]);
    const toggleGeofence = (id) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((gid) => gid !== id)
                : [...prev, id]
        );
    };

    const fetchGeofences = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://myuniversallanguages.com:9093/api/v1/tracker/getGeofencesByAssignmentStatus", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const transformed = result.data
                    .filter(item => item.geoFenceName && item.geoFenceName.trim() !== "")
                    .map(item => ({
                        _id: item._id,
                        name: item.geoFenceName,
                        address: item?.lastEvents?.[0]?.location?.location || 'No recent location',
                        status: item.overallStatus?.toLowerCase() || 'inactive'
                    }))

                setGeofences(transformed);
            } else {
                throw new Error(result?.message || "Failed to fetch geofences");
            }
        } catch (error) {
            enqueueSnackbar(error.message, {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        }
    };

    useEffect(() => {
        if (show) {
            fetchGeofences();
        }
    }, [show]);
    const handleSave = () => {
        const selectedGeofences = geofences.filter(g => selected.includes(g._id));
        console.log("Selected Geofences:", selectedGeofences);
        console.log("Assigned to Employee:", employee);
        handleClose();
    };

    return (
        <>
            <SnackbarProvider />
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
                            {geofences.length} total
                        </div>
                    </div>

                    {/* List */}
                    {geofences.map((geo, idx) => (
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
                                    checked={selected.includes(geo._id)}
                                    onChange={() => toggleGeofence(geo._id)}
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
        </>
    );
};

export default AssignGeofenceModal;
