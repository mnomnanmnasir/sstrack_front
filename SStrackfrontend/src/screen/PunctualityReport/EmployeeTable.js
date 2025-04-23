// components/EmployeeTable.js
import React from 'react';
import { Mail, Info, ChevronDown, ChevronRight, Users } from 'lucide-react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function EmployeeTable({ loading, filteredEmployees, expandedUserId, toggleDropdown }) {
    return (
        <div className="overflow-x-auto mt-6 border rounded-lg bg-white shadow-sm">
            <table className="table table-bordered table-striped table-hover">
                <thead className="table-dark text-center">
                    <tr>
                        <th>Employee</th>
                        <th>Duration</th>
                        <th>Lates</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="text-center text-muted py-4">
                                <div className="spinner-border text-dark me-2" role="status" />
                            </td>
                        </tr>
                    ) : (
                        filteredEmployees.map((emp, idx) => (
                            <React.Fragment key={idx}>
                                <tr className="align-middle">
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center align-items-center gap-2" onClick={() => toggleDropdown(emp.userId)}>
                                            {expandedUserId === emp.userId ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                            <strong>{emp.userName}</strong>
                                        </div>
                                    </td>
                                    <td className="text-center">⏱ {emp.record?.totalHours || '0h 0m'}</td>
                                    <td className="text-center">
                                        <span className={`badge ${emp.userLates > 0 ? 'bg-warning text-dark' : 'bg-light text-muted'}`}>
                                            {emp.userLates || 0}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <a href="mailto:someone@example.com">
                                                <button className="btn btn-outline-secondary btn-sm"><Mail size={16} /></button>
                                            </a>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id={`tooltip-info-${emp.userId}`}>
                                                        <div style={{ textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
                                                            {emp.filteredRecords.length > 0 ? (
                                                                emp.filteredRecords.map((rec, i) => (
                                                                    <div key={i} style={{ marginBottom: '6px' }}>
                                                                        <strong>Date:</strong> {rec.date || '-'}<br />
                                                                        <small>
                                                                            <strong>Status:</strong> {rec.status || 'No Status'}<br />
                                                                            <strong>Expected:</strong> {rec.expectedStartTime || '-'}<br />
                                                                            <strong>Actual:</strong> {rec.actualStartTime || '-'}<br />
                                                                            <strong>Total Hours:</strong> {rec.totalHours || '0h 0m'}<br />
                                                                            <strong>Over Time:</strong> {rec.overTime || '0h 0m'}
                                                                        </small>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div>No details available</div>
                                                            )}
                                                        </div>
                                                    </Tooltip>
                                                }
                                            >
                                                <button className="btn btn-outline-secondary btn-sm"><Info size={16} /></button>
                                            </OverlayTrigger>
                                        </div>
                                    </td>
                                </tr>

                                {expandedUserId === emp.userId && (
                                    <tr>
                                        <td colSpan="5">
                                            <div className="bg-light p-3">
                                                <table className="table table-sm table-bordered table-striped mt-3 text-center">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Expected Start</th>
                                                            <th>Actual Start</th>
                                                            <th>Status</th>
                                                            <th>Total Hours</th>
                                                            <th>Over Time</th>
                                                            <th>Punctuality Start Time</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {emp.filteredRecords.map((rec, i) => (
                                                            <tr key={i}>
                                                                <td>{rec.date}</td>
                                                                <td>{rec.expectedStartTime || '-'}</td>
                                                                <td>{rec.actualStartTime || '-'}</td>
                                                                <td>
                                                                    {rec.status === 'absent' ? (
                                                                        <span className="badge bg-danger">Absent</span>
                                                                    ) : rec.status?.toLowerCase().includes('late') ? (
                                                                        <span className="badge bg-warning text-white">{rec.status}</span>
                                                                    ) : (
                                                                        <span className="badge bg-light text-dark">{rec.status || 'No Status'}</span>
                                                                    )}
                                                                </td>
                                                                <td>{rec.totalHours || '0h 0m'}</td>
                                                                <td>{rec.overTime || '0h 0m'}</td>
                                                                <td>{rec.puncStartTime?.substring(0, 10) || 'N/A'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
