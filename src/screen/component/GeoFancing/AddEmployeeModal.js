import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { SnackbarProvider, enqueueSnackbar } from "notistack";

import { BsChevronDown } from 'react-icons/bs';
import { BiCheck } from 'react-icons/bi'; // much thinner check icon (exact system look)

const AddEmployeeModal = ({ show, handleClose, users = [], onEmployeeAdded }) => {

    // const [role, setRole] = useState('Field Technician');
    // const [status, setStatus] = useState('Active');
    // const [selectedUser, setSelectedUser] = useState(null);
    // const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    // const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('Active');
    const [roles, setRoles] = useState([]);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statuses = ['Active', 'Inactive', 'Offline'];
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [roleError, setRoleError] = useState('');
    const [geofenceResponse, setGeofenceResponse] = useState(null); // optional
    const [userId, setUserId] = useState(''); // input from user
    const [fullName, setFullName] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        if (show) fetchRolesFromAPI();
    }, [show]);

    const fetchRolesFromAPI = async () => {
        try {
            setLoadingRoles(true);
            const token = localStorage.getItem('token');

            const res = await axios.get('https://myuniversallanguages.com:9093/api/v1/tracker/getRoles', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Store full role objects (with _id and name)
            const roleData = Array.isArray(res.data.roles)
                ? res.data.roles.filter(role => role?.name && role?._id)
                : [];

            setRoles(roleData);                     // Save full role list
            setSelectedRole(roleData[0] || null);   // Set the first one as selected by default
            setRole(roleData[0]?.name || '');       // Set the name string for display
            setRoleError('');
        } catch (err) {
            console.error('Failed to fetch roles:', err);
            setRoleError('Failed to load roles');
        } finally {
            setLoadingRoles(false);
        }
    };


    const toggleRoleDropdown = () => {
        setIsRoleOpen(!isRoleOpen);
        setIsStatusOpen(false);  // Automatically close status when role opens
    };

    const toggleStatusDropdown = () => {
        setIsStatusOpen(!isStatusOpen);
        setIsRoleOpen(false);  // Automatically close role when status opens
    };

    // const handleSubmit = () => {
    //     // Yahan API ya logic lagao to invite employee
    //     handleClose();
    // };

    const handleSubmit = async () => {
        if (!selectedUser?._id || !selectedRole?._id) {
            enqueueSnackbar('Please select both user and role.', { variant: 'warning' });
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');

            const response = await axios.patch(`${apiUrl}/tracker/addEmployee`, {
                userId: selectedUser?._id,
                roleId: selectedRole?._id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            enqueueSnackbar('✅ Employee added successfully!', { variant: 'success' });
            if (onEmployeeAdded) {
                onEmployeeAdded(); // 🔥 Trigger parent API
            }
            handleClose();
        } catch (error) {
            console.error('❌ Error adding employee:', error.response?.data || error);
            enqueueSnackbar('❌ Failed to add employee.', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <SnackbarProvider />
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
                        {/* User Dropdown */}
                        <div className="mb-3 position-relative" style={{ zIndex: 1200 }}>
                            <Form.Label className="fw-semibold small">Select Existing User</Form.Label>
                            <div
                                className="border rounded-2 px-3 py-2 d-flex justify-content-between align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setIsUserDropdownOpen(!isUserDropdownOpen);
                                    setIsRoleOpen(false);
                                    setIsStatusOpen(false);
                                }}
                            >
                                <span>{selectedUser?.email || 'Choose a user...'}</span>
                                <BsChevronDown className="text-muted" size={14} />
                            </div>

                            {isUserDropdownOpen && (
                                <div
                                    className="border rounded-2 bg-white shadow-sm position-absolute w-100 mt-1"
                                    style={{
                                        top: '100%',
                                        left: 0,
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                    }}
                                >
                                    {users.map((user, idx) => (
                                        <div
                                            key={user?._id || idx}
                                            className="px-3 py-2 d-flex align-items-center"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                // console.log('Clicked User:', user);
                                                setSelectedUser({
                                                    _id: user?._id,
                                                    name: user?.name || '',
                                                    email: user?.email || ''
                                                });
                                                setIsUserDropdownOpen(false);
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e7f1ff')}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                        >
                                            <div className="me-2" style={{ width: 16 }}>
                                                {selectedUser?._id === user?._id && <BiCheck className="text-dark" size={16} />}
                                            </div>
                                            <span>
                                                ({user?.email || 'No Email'})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>


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
                                        zIndex: 1100, // makes sure it floats above "status"
                                        overflowY: 'auto',
                                        maxHeight: '200px',
                                    }}
                                >
                                    {roles.map((item, idx) => (
                                        <div
                                            key={item?._id || idx}
                                            className="d-flex align-items-center px-3 py-2"
                                            style={{ cursor: 'pointer' }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e7f1ff'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            onClick={() => {
                                                setRole(item.name);         // set role name for UI
                                                setSelectedRole(item);      // set full role object for submission
                                                setIsRoleOpen(false);       // close dropdown
                                            }}
                                        >
                                            <div className="me-2" style={{ width: '16px' }}>
                                                {role === item.name && <BiCheck className="text-dark" size={16} />}
                                            </div>
                                            <span>{item.name}</span>
                                        </div>
                                    ))}

                                </div>
                            )}
                        </div>
                        {/* Full Name (Disabled) */}
                        <div className="mb-3">
                            <Form.Label className="fw-semibold small">Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedUser?.name || ''}
                                disabled
                                placeholder="Select a user to autofill"
                            />
                        </div>

                        {/* Email Address (Read-only) */}
                        {/* <div className="mb-3">
                        <Form.Label className="fw-semibold small">Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            value={selectedUser?.email || ''}
                            readOnly
                            placeholder="Email will appear here after selection"
                        />
                    </div> */}

                        {/* Status Dropdown */}
                        {/* <div className="mb-3"> */}
                        <div className="mb-3 position-relative" style={{ zIndex: 1000 }}>
                            {/* <Form.Label className="fw-semibold small">Status</Form.Label>
                            <div className="border rounded-2 px-3 py-2 d-flex justify-content-between align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={toggleStatusDropdown}
                            >
                                <span>{status}</span>
                                <BsChevronDown className="text-muted" size={14} />
                            </div> */}

                            {isStatusOpen && (
                                <div
                                    className="border rounded-2 bg-white shadow-sm position-absolute w-100 mt-1"
                                    style={{ top: '100%', left: 0 }}
                                >
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
                    <Button onClick={handleSubmit} variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Adding...
                            </>
                        ) : 'Add Employee'}
                    </Button>
                </Modal.Footer>

            </Modal>
        </>
    );
};

export default AddEmployeeModal;