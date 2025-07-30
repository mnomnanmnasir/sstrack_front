import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BsChevronDown } from 'react-icons/bs';
import { BiCheck } from 'react-icons/bi';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const EditEmployeeModal = ({ show, handleClose, employee, onSuccess }) => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Field Technician');
    const [status, setStatus] = useState('Active');

    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const roles = ['Field Technician', 'Safety Officer', 'Delivery Driver', 'Site Manager'];
    const statuses = ['Active', 'Inactive', 'Offline'];

    const toggleRoleDropdown = () => {
        setIsRoleOpen(!isRoleOpen);
        setIsStatusOpen(false);
    };

    const toggleStatusDropdown = () => {
        setIsStatusOpen(!isStatusOpen);
        setIsRoleOpen(false);
    };

    useEffect(() => {
        if (employee) {
            setName(employee.name || '');
            setEmail(employee.email || '');
            setRole(employee.role || 'Field Technician'); // employee.role, not employee.roles
            setStatus(employee.status || 'Active');
        }
    }, [employee]);

    const handleSubmit = async () => {
    handleClose();
    setIsSubmitting(true);

    try {
        const token = localStorage.getItem('token');

        const response = await axios.patch(
            `${apiUrl}/tracker/updateEmployeeStatus/${employee._id}`,
            {
                role: role,
                // status: status
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("response edit",response)
        enqueueSnackbar('✅ Record Updated successfully!', { variant: 'success' });
        // if (employee) {
        //         employee(); // 🔥 Trigger parent API
        //     }
        handleClose();
            if (onSuccess) onSuccess();

    } catch (error) {
        console.error('❌ Error adding employee:', error.response?.data || error);
        enqueueSnackbar('❌ Failed to update.', { variant: 'error' });
    } finally {
        setIsSubmitting(false);
    }
};


    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Employee Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                  
                    
                    {/* Role Dropdown */}
                    <div className="mb-3 position-relative" style={{ zIndex: 1100 }}>
                        <Form.Label className="fw-semibold small">Role</Form.Label>
                        <div
                            className="border rounded-2 px-3 py-2 d-flex justify-content-between align-items-center"
                            style={{ cursor: 'pointer' }}
                            onClick={toggleRoleDropdown}
                        >
                            <span>{role}</span>
                            <BsChevronDown className="text-muted" size={14} />
                        </div>

                        {isRoleOpen && (
                            <div
                                className="border rounded-2 bg-white shadow-sm position-absolute w-100 mt-1"
                                style={{
                                    top: '100%',
                                    left: 0,
                                    zIndex: 1100,
                                    overflowY: 'auto',
                                    maxHeight: '200px',
                                }}
                            >
                                {roles.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="d-flex align-items-center px-3 py-2"
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
                    {/* <div className="mb-3 position-relative" style={{ zIndex: 1000 }}>
                        <Form.Label className="fw-semibold small">Status</Form.Label>
                        <div
                            className="border rounded-2 px-3 py-2 d-flex justify-content-between align-items-center"
                            style={{ cursor: 'pointer' }}
                            onClick={toggleStatusDropdown}
                        >
                            <span>{status}</span>
                            <BsChevronDown className="text-muted" size={14} />
                        </div>

                        {isStatusOpen && (
                            <div
                                className="border rounded-2 bg-white shadow-sm position-absolute w-100 mt-1"
                                style={{ top: '100%', left: 0 }}
                            >
                                {statuses.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="d-flex align-items-center px-3 py-2"
                                        style={{ cursor: 'pointer' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e7f1ff'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onClick={() => {
                                            setStatus(item);
                                            setIsStatusOpen(false);
                                        }}
                                    >
                                        <div className="me-2" style={{ width: '16px' }}>
                                            {status === item && <BiCheck className="text-dark" size={16} />}
                                        </div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> */}
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditEmployeeModal;
