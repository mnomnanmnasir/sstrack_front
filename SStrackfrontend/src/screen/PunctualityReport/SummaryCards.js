// components/SummaryCards.js
import React from 'react';
import { Clock, LineChart, AlarmClock, Users } from 'lucide-react';

export default function SummaryCards({ totalHoursAllUsers, attendanceRate, consistentUsersCount, totalEmployees }) {
    return (
        <div className="py-4">
            <div className="row g-4">
                {/* Total Hours */}
                <div className="col-md-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center text-muted mb-1">
                                <Clock className="text-primary me-2" size={16} /> Total Hours
                            </div>
                            <h4 className="text-warning fw-bold d-flex align-items-center">
                                {totalHoursAllUsers}
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Attendance Rate */}
                <div className="col-md-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center text-muted mb-1">
                                <LineChart className="text-success me-2" size={16} /> Attendance Rate
                            </div>
                            <h4 className="text-warning fw-bold d-flex align-items-center">
                                {attendanceRate}
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Punctuality */}
                <div className="col-md-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center text-muted mb-1">
                                <AlarmClock className="text-purple me-2" size={16} /> Punctuality
                            </div>
                            <h4 className="text-purple fw-bold d-flex align-items-center">
                                25.0%
                            </h4>
                            <small className="text-muted">Avg. late by 11 min</small>
                        </div>
                    </div>
                </div>

                {/* Consistent Employees */}
                <div className="col-md-3">
                    <div className="card shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center text-muted mb-1">
                                <Users className="text-warning me-2" size={16} /> Consistent Employees
                            </div>
                            <h4 className="text-warning fw-bold">
                                {consistentUsersCount} of {totalEmployees}
                            </h4>
                            <small className="text-muted">Always on time, no absences</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
