import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const QuickStartModal = ({ show, onClose }) => {
    const [activeTab, setActiveTab] = useState('Setup');
    const modalRef = useRef();

    const tabs = ['Setup', 'Daily Operations', 'Maintenance'];

    const content = {
        'Setup': [
            { icon: 'bi-person-plus', title: 'Add Employees', desc: 'Add new employees to the system.' },
            { icon: 'bi-geo', title: 'Create Geofences', desc: 'Define geofence areas for tracking.' }
        ],
        'Daily Operations': [
            { icon: 'bi-map', title: 'Monitor Real-time Location', desc: 'View the current location of employees on the map from the dashboard or geofence view.' },
            { icon: 'bi-check-circle', title: 'Monitor Geofence Events', desc: 'Receive alerts when employees enter/exit defined geofenced areas.' }
        ],
        'Maintenance': [
            { icon: 'bi-person-lines-fill', title: 'Edit Employee Information', desc: 'Update employee details, assignments, or settings as needed.' },
            { icon: 'bi-pencil-square', title: 'Adjust Geofences', desc: 'Modify existing geofence boundaries, shapes, or details.' }
        ]
    };

    useEffect(() => {
        if (show) {
            const modal = new window.bootstrap.Modal(modalRef.current);
            modal.show();
            modalRef.current.addEventListener('hidden.bs.modal', () => {
                onClose();
            });
        }
    }, [show, onClose]);

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content p-4 rounded-4" style={{ minWidth: '400px' }}>
                    {/* Header */}
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold" style={{ fontSize: '20px' }}>Quick Start Guide</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    {/* Subtext */}
                    <div className="modal-body pt-2">
                        <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
                            Follow these steps to get started with our geofencing system.
                        </p>

                        {/* Tabs */}
                        <div className="d-flex mb-4 rounded-3" style={{ backgroundColor: '#80838A', padding: '8px 0px 8px 14px' }}>
                            {tabs.map((tab, index) => (
                                <button
                                    key={tab}
                                    className={`fw-medium border-0 ${index !== tabs.length - 1 ? 'me-2' : ''}`}
                                    style={{
                                        borderRadius: '8px',
                                        padding: '6px 25px',
                                        fontSize: '14px',
                                        backgroundColor: activeTab === tab ? '#ffffff' : 'transparent',
                                        color: '#000000',
                                        boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                                        border: 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {content[activeTab].map((item, idx) => (
                            <div key={idx} className="d-flex align-items-center border rounded-3 p-3 mb-3" style={{ cursor: 'pointer' }}>
                                <div className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{ width: 40, height: 40, backgroundColor: '#F1F3F5' }}>
                                    <i className={`bi ${item.icon} fs-5 text-primary`}></i>
                                </div>
                                <div>
                                    <div className="fw-semibold mb-1" style={{ fontSize: '14px' }}>{item.title}</div>
                                    <div className="text-muted" style={{ fontSize: '13px' }}>{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Buttons */}
                    <div className="modal-footer border-0 justify-content-end pt-0">
                        <button className="btn btn-light px-3 me-2" data-bs-dismiss="modal" style={{ fontSize: '14px' }}>Skip for now</button>
                        <button className="btn btn-primary px-4" data-bs-dismiss="modal" style={{ fontSize: '14px' }}>Got it</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickStartModal;
