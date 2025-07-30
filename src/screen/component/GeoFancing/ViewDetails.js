import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ViewDetails = ({ show, handleClose, geofence }) => {
    const modalRef = useRef(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [assignedTo, setAssignedTo] = useState([]);
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');

    useEffect(() => {
        if (show && modalRef.current) {
            const modal = new window.bootstrap.Modal(modalRef.current);
            modal.show();

            const handleHidden = () => {
                handleClose();
            };

            modalRef.current.addEventListener('hidden.bs.modal', handleHidden);

            return () => {
                modalRef.current.removeEventListener('hidden.bs.modal', handleHidden);
                modal.hide();
            };
        }
    }, [show, handleClose]);

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("You are not logged in.");
            return;
        }

        const payload = {
            title: taskTitle,
            description,
            // location,
            priority: priority.toLowerCase(),
            dueDate,
            assignedTo,
            geofenceId: geofence || null
        };

        console.log("Payload being sent:", payload); // ✅ Debug line to verify

        try {
            const response = await fetch('https://myuniversallanguages.com:9093/api/v1/tracker/createGeoFenceTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            console.log("response",response)
            if (!response.ok) {
                const error = await response.json();
                console.error('API Error:', error);
                alert('Failed to create task.');
                return;
            }

            const result = await response.json();
            console.log('Task Created:', result);

            const modalInstance = window.bootstrap.Modal.getInstance(modalRef.current);
            modalInstance.hide();
        } catch (err) {
            console.error('Network error:', err);
            alert('Something went wrong while creating the task.');
        }
    };

    return (
        <div
            className="modal fade"
            tabIndex="-1"
            ref={modalRef}
            aria-labelledby="createTaskLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4 border-0 shadow-sm p-4" style={{ fontFamily: 'system-ui' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold" id="createTaskLabel">Create New Task</h5>
                        <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Task Title</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter task title"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Describe what needs to be done"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Assign To (Optional)</label>
                        <select
                            multiple
                            className="form-select"
                            value={assignedTo}
                            onChange={(e) =>
                                setAssignedTo(Array.from(e.target.selectedOptions, option => option.value))
                            }
                        >
                            <option value="user_123">John Smith</option>
                            <option value="user_456">Sarah Johnson</option>
                            <option value="user_789">Michael Brown</option>
                        </select>
                    </div>
                    
                    {/* <div className="mb-3">
                        <label className="form-label">Assign To (Optional)</label>
                        <select className="form-select" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                            <option value="">Select employee</option>
                            <option value="John Smith">John Smith</option>
                            <option value="Sarah Johnson">Sarah Johnson</option>
                        </select>
                    </div> */}

                    <div className="mb-3">
                        <label className="form-label">Due Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Priority</label>
                        <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-outline-secondary" data-bs-dismiss="modal">
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            // style={{ backgroundColor: '#b39ddb', color: 'white' }}
                            onClick={handleSubmit}
                            disabled={!taskTitle || !dueDate}
                        >
                            Create Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDetails;
