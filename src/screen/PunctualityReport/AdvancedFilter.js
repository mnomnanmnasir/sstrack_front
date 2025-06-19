// components/AdvancedFilters.js
import React from 'react';

export default function AdvancedFilters({
    selectedUsers,
    handleUserChange,
    allEmployees,
    groupId,
    groups,
    handleGroupChange,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    sortBy,
    setSortBy,
    handlePeriodClick,
    selectedPeriod,
    loading,
    windowWidth
}) {
    const marginLeft = windowWidth >= 1280 ? '3%' : '0%';

    const getToday = () => new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white p-4 rounded shadow-sm mb-4">
            <div className="d-flex align-items-center mb-3">
                <span className="me-2">⚙️</span>
                <h6 className="mb-0 fw-semibold text-muted">Advanced Filters</h6>
            </div>

            <div className="row g-3 align-items-end justify-content-space-between">
                {/* Employee Select */}
                <div className="col-md-3">
                    <label className="form-label small">Select employee</label>
                    <select
                        value={selectedUsers.length === 0 ? "" : selectedUsers[0]}
                        onChange={handleUserChange}
                        className="form-select form-control-sm"
                        disabled={loading}
                    >
                        <option value="">All Employees</option>
                        {allEmployees.map((emp, idx) => (
                            <option key={idx} value={emp.userId}>
                                {emp.userName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Group Select */}
                <div className="col-md-2">
                    <label className="form-label small">Group</label>
                    <select
                        value={groupId}
                        onChange={handleGroupChange}
                        className="form-select form-control-sm"
                    >
                        <option value="">All Groups</option>
                        {groups.map((group, idx) => (
                            <option key={idx} value={group._id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Range */}
                <div className="col-md-4">
                    <label className="form-label small">Date range</label>
                    <div className="d-flex gap-1">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={getToday()}
                            className="form-control"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                            max={getToday()}
                            className="form-control form-control-sm"
                        />
                    </div>
                </div>

                {/* Sort By */}
                <div className="col-md-3">
                    <label className="form-label">Sort by</label>
                    <select
                        className="form-select form-control-sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="">Select...</option>
                        <option value="name">Name</option>
                        <option value="totalHours">Hours</option>
                    </select>
                </div>

                {/* Period Filters */}
                <div className="d-flex gap-3 col-md-12 flex-wrap mt-4 ps-1">
                    {["Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year"].map(label => (
                        <button
                            key={label}
                            onClick={() => handlePeriodClick(label)}
                            className={`btn btn-sm border ${selectedPeriod === label ? 'active-period-button' : 'btn-light'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
