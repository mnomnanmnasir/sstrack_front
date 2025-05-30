import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BsChevronDown } from 'react-icons/bs';
import { BiCheck } from 'react-icons/bi'; // much thinner check icon (exact system look)

const AddEmployeeModal = ({ show, handleClose }) => {

    const [role, setRole] = useState('Field Technician');
    const [status, setStatus] = useState('Active');

    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    const roles = ['Field Technician', 'Safety Officer', 'Deliver Driver', 'Site Manager'];
    const statuses = ['Active', 'Inactive', 'Offline'];

    const toggleRoleDropdown = () => {
        setIsRoleOpen(!isRoleOpen);
        setIsStatusOpen(false);  // Automatically close status when role opens
    };

    const toggleStatusDropdown = () => {
        setIsStatusOpen(!isStatusOpen);
        setIsRoleOpen(false);  // Automatically close role when status opens
    };

    const handleSubmit = () => {
        // Yahan API ya logic lagao to invite employee
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="border-0">
                <div>
                    <h5 className="fw-semibold mb-0">Add New Employee</h5>
                    <p className="text-muted" style={{ fontSize: '13px', marginBottom: '0px' }}>
                        Fill in the details to create a new employee profile.
                    </p>
                </div>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <div className="mb-3">
                        <Form.Label className="fw-semibold small">Full Name</Form.Label>
                        <Form.Control type="text" placeholder="John Doe" />
                    </div>

                    <div className="mb-3">
                        <Form.Label className="fw-semibold small">Email Address</Form.Label>
                        <Form.Control type="email" placeholder="john.doe@example.com" />
                    </div>

                    <div className="mb-3">
                        <Form.Label className="fw-semibold small">Full Name</Form.Label>
                        <Form.Control type="text" placeholder="John Doe" />
                    </div>

                    {/* Role Dropdown */}
                    <div className="mb-3">
                        <Form.Label className="fw-semibold small">Role</Form.Label>
                        <div className="border rounded-2 px-3 py-2 d-flex justify-content-between align-items-center"
                            style={{ cursor: 'pointer' }}
                            onClick={toggleRoleDropdown}
                        >
                            <span>{role}</span>
                            <BsChevronDown className="text-muted" size={14} />
                        </div>

                        {isRoleOpen && (
                            <div className="border rounded-bottom-2 border-top-0">
                                {roles.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`d-flex align-items-center px-3 py-2`}
                                        style={{ cursor: 'pointer' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e7f1ff'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onClick={() => {
                                            setRole(item);
                                            setIsRoleOpen(false);
                                        }}
                                    >
                                        <div className="me-2" style={{ width: '16px' }}>
                                            {role === item && <BiCheck className="text-dark" size={16} />}
                                        </div>

                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Status Dropdown */}
                    <div className="mb-3">
                        <Form.Label className="fw-semibold small">Status</Form.Label>
                        <div className="border rounded-2 px-3 py-2 d-flex justify-content-between align-items-center"
                            style={{ cursor: 'pointer' }}
                            onClick={toggleStatusDropdown}
                        >
                            <span>{status}</span>
                            <BsChevronDown className="text-muted" size={14} />
                        </div>

                        {isStatusOpen && (
                            <div className="border rounded-bottom-2 border-top-0">
                                {statuses.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`d-flex align-items-center px-3 py-2`}
                                        style={{ cursor: 'pointer' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e7f1ff'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onClick={() => {
                                            setStatus(item);
                                            setIsStatusOpen(false);
                                        }}
                                    >
                                        {/* Reserved space for check icon always */}
                                        <div className="me-2" style={{ width: '16px' }}>
                                            {status === item && <BiCheck className="text-dark" size={22} />}
                                        </div>

                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Form>
            </Modal.Body>

            <Modal.Footer className="border-0">
                <Button variant="light" onClick={handleClose}>
                    Cancel
                </Button>
                <Button  onClick={handleSubmit} variant="primary">
                    Add Employee
                </Button>
            </Modal.Footer>

        </Modal>
    );
};

export default AddEmployeeModal;
