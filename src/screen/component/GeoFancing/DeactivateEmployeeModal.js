import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const DeactivateEmployeeModal = ({ show, handleClose, employee, onSuccess }) => {
    const apiUrl = process.env.REACT_APP_API_URL;

    if (!employee) return null; // ✅ Avoid rendering if employee is null

    const isCurrentlyDeactivated = employee.status === 'Deactivated';

    const handleStatusChange = async () => {
        try {
            const token = localStorage.getItem('token');
            const updatedStatus = isCurrentlyDeactivated ? 'online' : 'deactivated';

            await axios.patch(`${apiUrl}/tracker/updateEmployeeStatus/${employee._id}`, {
                status: updatedStatus
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            enqueueSnackbar(`✅ Employee ${isCurrentlyDeactivated ? 'activated' : 'deactivated'} successfully.`, {
                variant: 'success'
            });
            handleClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error updating status:', error.response?.data || error);
            enqueueSnackbar('❌ Failed to update employee status.', { variant: 'error' });
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-semibold">
                    {isCurrentlyDeactivated ? 'Activate' : 'Deactivate'} Employee
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ fontSize: '14px', color: '#555' }}>
                    Are you sure you want to {isCurrentlyDeactivated ? 'activate' : 'deactivate'}{' '}
                    <strong>{employee.name}</strong>?
                </p>
                <p className="text-muted" style={{ fontSize: '13px' }}>
                    {isCurrentlyDeactivated
                        ? 'This will restore their access to the platform.'
                        : 'This will revoke their access until reactivated.'}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="light"
                    onClick={handleClose}
                    style={{
                        border: '1px solid #dee2e6',
                        padding: '6px 18px',
                        borderRadius: '8px',
                        fontWeight: '500',
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant={isCurrentlyDeactivated ? 'success' : 'danger'}
                    onClick={handleStatusChange}
                    style={{
                        padding: '6px 20px',
                        borderRadius: '8px',
                        fontWeight: '500',
                    }}
                >
                    {isCurrentlyDeactivated ? 'Activate' : 'Deactivate'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeactivateEmployeeModal;
