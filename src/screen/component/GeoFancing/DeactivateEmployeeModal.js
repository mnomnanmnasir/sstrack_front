import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeactivateEmployeeModal = ({ show, handleClose, employee, onConfirm }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-semibold">Deactivate Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ fontSize: '14px', color: '#555' }}>
                    Are you sure you want to deactivate{' '}
                    <strong>{employee?.name}</strong>?
                </p>
                <p className="text-muted" style={{ fontSize: '13px' }}>
                    This action will revoke their access until reactivated.
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
                    variant="primary"
                    onClick={() => {
                        onConfirm(employee);
                        handleClose();
                    }}
                    style={{
                        padding: '6px 20px',
                        borderRadius: '8px',
                        fontWeight: '500',
                    }}
                >
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeactivateEmployeeModal;
