import React from 'react';
import { Modal } from 'react-bootstrap';

const EmployeeProfileModal = ({ show, handleClose, employee }) => {
    if (!employee) return null;
    const [firstName = '', lastName = ''] = employee.name?.split(' ') || [];

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Body className="px-5 pt-4 pb-3">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h4 className="fw-bold mb-1" style={{ fontSize: '22px' }}>Employee Profile</h4>
                        <div className="text-muted" style={{ fontSize: '14px' }}>
                            View and manage employee details
                        </div>
                    </div>
                    <button
                        className="btn-close"
                        style={{ fontSize: '12px' }}
                        onClick={handleClose}
                    />
                </div>

                {/* Profile Card */}
                <div className="d-flex align-items-center mb-4">
                    <div
                        className="rounded-circle bg-light d-flex justify-content-center align-items-center me-3"
                        style={{ width: 56, height: 56 }}
                    >
                        <i className="bi bi-person fs-3 text-dark"></i>
                    </div>
                    <div>
                        <div className="fw-semibold" style={{ fontSize: '16px' }}>{employee.name}</div>
                        <div className="text-muted" style={{ fontSize: '14px' }}>{employee.role}</div>
                        <div className="text-muted" style={{ fontSize: '13px' }}>Joined 2 years ago</div>
                    </div>
                </div>

                {/* Today's Job Status */}
                <div className="mb-4">
                    <div className="fw-semibold mb-3" style={{ fontSize: '15px' }}>Today's Job Status</div>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="border rounded p-3">
                                <div className="text-muted" style={{ fontSize: '14px' }}>Tasks Completed</div>
                                <div className="fw-bold" style={{ fontSize: '20px' }}>{employee.completedCount}</div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="border rounded p-3">
                                <div className="text-muted" style={{ fontSize: '14px' }}>Tasks Remaining</div>
                                <div className="fw-bold" style={{ fontSize: '20px' }}>{employee.inCompletedCount}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div>
                    <div className="fw-semibold mb-3" style={{ fontSize: '15px' }}>Contact Information</div>
                    <div className="row border-top border-bottom py-3" style={{ fontSize: '14px' }}>
                        <div className="col-md-6 mb-3">
                            <div className="text-muted small mb-1">First Name</div>
                            <div>{firstName}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="text-muted small mb-1">Last Name</div>
                            <div>{lastName}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="text-muted small mb-1">Email</div>
                            <div>{employee.email}</div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="text-muted small mb-1">Phone</div>
                            <div>+1 (555) 123-4567</div> {/* Can be made dynamic */}
                        </div>
                    </div>
                </div>
                
            </Modal.Body>
        </Modal>
    );
};

export default EmployeeProfileModal;
