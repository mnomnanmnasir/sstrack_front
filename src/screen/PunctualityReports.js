import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Clock, LineChart, AlarmClock, Users } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios'
import { Mail, MessageSquare, Info } from 'lucide-react';
// import { Mail, MessageSquare, Info } from 'lucide-react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function Dashboard() {
    const [dateRange, setDateRange] = useState({ from: new Date('2025-04-07'), to: new Date('2025-04-14') });
    const [comparisonDate, setComparisonDate] = useState(new Date('2025-04-06'));
    // const [startDate, setStartDate] = useState("2025-04-08");
    // const [endDate, setEndDate] = useState("2025-04-10");
    const getToday = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // format: 'YYYY-MM-DD'
    };

    const [startDate, setStartDate] = useState(getToday());
    const [endDate, setEndDate] = useState(getToday());
    const [sortBy, setSortBy] = useState("name"); // 'name' or 'totalHours'
    const [loading, setLoading] = useState(false);
    const [allEmployees, setAllEmployees] = useState([]); // Full list

    const [daySpecifier] = useState("this");
    const [employees, setEmployees] = useState([]); // replace static array
    const [groupId, setGroupId] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [attendanceRate, setAttendanceRate] = useState("0.00%");
    const [totalHoursAllUsers, setTotalHoursAllUsers] = useState("0h 0m");
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [consistentUsersCount, setConsistentUsersCount] = useState(0);
    const [groups, setGroups] = useState([]);
    const [totalAbsentDays, setTotalAbsentDays] = useState(0);
    const [totalLates, setTotalLate] = useState(0);


    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("https://myuniversallanguages.com:9093/api/v1/userGroup", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const allGroups = response.data.groups || []; // ✅ Correct path to groups
            const activeGroups = allGroups.filter(group => !group.isArchived); // optional: filter archived

            setGroups(activeGroups); // ✅ set to dropdown
            console.log("✅ Active Groups:", activeGroups);
        } catch (err) {
            console.error("❌ Error fetching groups:", err);
        }
    };

    const toggleDropdown = (userId) => {
        setExpandedUserId(prev => (prev === userId ? null : userId));
    };

    const handleGroupChange = (e) => {
        setGroupId(e.target.value);
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchPunctualityReport();
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchPunctualityReport();
        fetchGroups()
    }, [selectedUsers]);

    // const handleUserChange = (e) => {
    //     const selected = Array.from(e.target.selectedOptions, (option) => option.value);

    //     if (selected.includes("")) {
    //         const allIds = employees.map((emp) => emp.userId);
    //         setSelectedUsers(allIds);
    //     } else {
    //         setSelectedUsers(selected);
    //     }
    // };

    const handleUserChange = (e) => {
        const selected = e.target.value;

        if (selected === "") {
            // All Employees selected

            setSelectedUsers([]); // Clear selection = show all
        } else {
            setSelectedUsers([selected]); // Specific user selected
        }
    };

    const fetchPunctualityReport = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                groupId,
                startDate,
                endDate,
            });

            if (selectedUsers.length > 0) {
                params.append("userId", selectedUsers.join(','));
            }

            const url = `https://myuniversallanguages.com:9093/api/v1/owner/getPunctualityReport?${params.toString()}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const fetchedEmployees = response.data.data.usersWithStats || [];

            setEmployees(fetchedEmployees);

            // ✅ Only update allEmployees if it's empty (first load)
            if (allEmployees.length === 0) {
                setAllEmployees(fetchedEmployees);
            }


            // ✅ Always keep full dropdown list updated
            if (allEmployees.length > 0) {
                setAllEmployees(allEmployees);
            } else if (allEmployees.length === 0) {
                setAllEmployees(fetchedEmployees);
            }
            setAttendanceRate(response.data.data.attendanceRate || "0.00%");
            setTotalHoursAllUsers(response.data.data.totalHoursOfAllUsers || "0h:0m");
            setConsistentUsersCount(response.data.data.consistentUsers?.length || 0);
            setTotalAbsentDays(response.data.data.totalAbsentDays || 0);
            setTotalLate(response.data.data.totalLates || 0);
        } catch (err) {
            console.error("❌ Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPunctualityReport();
        fetchGroups(); // fetching report functions
    }, []);

    const getAllowedUserIds = () => {
        if (!groupId) return null; // No filter
        const selectedGroup = groups.find(group => group._id === groupId);
        return selectedGroup?.allowedEmployees || [];
    };
    // ✅ Filter records using date range
    const allowedUserIds = getAllowedUserIds();

    const filteredEmployees = employees
        .filter(emp => {
            const inGroup = !allowedUserIds || allowedUserIds.includes(emp.userId);
            const isSelected = selectedUsers.length === 0 || selectedUsers.includes(emp.userId);
            return inGroup && isSelected;
        })
        .map(emp => {
            const filteredRecords = emp.records.filter(rec => {
                const recDate = new Date(rec.date);
                return recDate >= new Date(startDate) && recDate <= new Date(endDate);
            });
            const record = filteredRecords[0];
            return { ...emp, filteredRecords, record };
        })
        .filter(Boolean) // ✅ Remove null values
        .sort((a, b) => {
            if (sortBy === "name") {
                return a.userName.localeCompare(b.userName);
            } else if (sortBy === "totalHours") {
                const getMinutes = (str) => {
                    if (!str) return 0;
                    const [h, m] = str.replace(/[^\d]/g, ' ').split(' ').filter(Boolean);
                    return parseInt(h || 0) * 60 + parseInt(m || 0);
                };
                return getMinutes(b.record?.totalHours) - getMinutes(a.record?.totalHours);
            }
            return 0;
        });

    const handlePeriodClick = (period) => {
        let newStartDate, newEndDate;

        const today = new Date();

        switch (period) {
            case 'Today':
                newStartDate = newEndDate = today;
                break;
            case 'Yesterday':
                newStartDate = newEndDate = new Date(today.setDate(today.getDate() - 1));
                break;
            case 'This Week':
                const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                newStartDate = startOfWeek;
                newEndDate = new Date(); // Reinitialize to today
                break;
            case 'Last Week':
                const lastWeekStart = new Date(today.setDate(today.getDate() - today.getDay() - 7));
                const lastWeekEnd = new Date(today.setDate(today.getDate() - today.getDay() - 1));
                newStartDate = lastWeekStart;
                newEndDate = lastWeekEnd;
                break;
            case 'This Month':
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                newStartDate = startOfMonth;
                newEndDate = new Date(); // Reinitialize to today
                break;
            case 'Last Month':
                const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
                const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
                newStartDate = startOfLastMonth;
                newEndDate = endOfLastMonth;
                break;
            case 'This Year':
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                newStartDate = startOfYear;
                newEndDate = new Date(); // Reinitialize to today
                break;
            case 'Last Year':
                const lastYear = new Date(today.getFullYear() - 1, 0, 1);
                const startOfLastYear = new Date(lastYear.getFullYear(), 0, 1);
                const endOfLastYear = new Date(lastYear.getFullYear(), 11, 31);
                newStartDate = startOfLastYear;
                newEndDate = endOfLastYear;
                break;
            default:
                return;
        }

        // ✅ Only clear selectedUsers if none was selected already
        if (selectedUsers.length === 0) {
            setSelectedUsers([]);
        }

        setStartDate(newStartDate.toISOString().split('T')[0]);
        setEndDate(newEndDate.toISOString().split('T')[0]);
    };


    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Function to update the window width on resize
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    // UseEffect hook to listen for window resize events
    useEffect(() => {
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Define margin-left conditionally based on window width
    const marginLeft = windowWidth >= 1280 ? '3%' : '0%'; // 2% margin for screen widths >=1280px, else 5%

    return (
        <div className="container">
            {/* Header Section */}
            <div className="userHeader flex justify-between items-center mb-6 bg-blue-600 p-4 rounded-md">
                <h5 className="text-lg font-semibold text-white">Punctuality Reports</h5>
            </div>
            <div className="mainwrapper ownerTeamContainer" style={{ marginTop: "-2px" }}>

                {/* <div className="p-4 sm:p-6 lg:p-10 space-y-8 max-w-7xl mx-auto"> */}
                {/* Summary Cards */}
                <div className=" py-4">
                    <div className="row g-4">
                        {/* Total Hours */}
                        <div className="col-md-3">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center text-muted mb-1">
                                        <Clock className="text-primary me-2" size={16} /> Total Hours
                                    </div>
                                    {/* <h4 className="text-primary fw-bold">62.6h</h4> */}
                                    <h4 className="text-warning fw-bold d-flex align-items-center">
                                        {totalHoursAllUsers}
                                        {/* You can conditionally show a badge if needed */}
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
                                        {/* You can conditionally show a badge if needed */}
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
                                        {/* <span className="badge bg-light text-muted border ms-2">2 late arrivals</span> */}
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
                                    <h4 className="text-warning fw-bold">{consistentUsersCount} of {employees.length}</h4>
                                    <small className="text-muted">Always on time, no absences</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Week-over-Week Comparison */}
                <div className="card shadow-sm p-3 mb-4 position-relative" style={{ backgroundColor: "#ffffff" }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-semibold text-muted">Week-over-Week Comparison</h6>
                        <span className="badge bg-danger text-white">Needs Attention</span>
                    </div>

                    <div className="row g-3">
                    {/* Late Arrivals */}
                    <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center bg-light rounded p-3">
                            <div className="d-flex align-items-center gap-2">
                                <span role="img" aria-label="late" className="text-warning">⚠️</span>
                                <span className="fw-semibold text-dark">Late Arrivals</span>
                            </div>
                            <div className="text-danger fw-medium small">
                                {totalLates}
                                 <span className="ms-1">📈</span></div>
                        </div>
                    </div>

                    {/* Absences */}
                    <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center bg-light rounded p-3">
                            <div className="d-flex align-items-center gap-2">
                                <Users className="text-warning me-2" size={16} />
                                <span className="fw-semibold text-dark">Absences</span>
                            </div>
                            <div className="text-danger fw-medium small">
                                {totalAbsentDays} <span className="ms-1">📉</span>
                            </div>

                            {/* <div className="text-danger fw-medium small">+0% <span className="ms-1">📈</span></div> */}
                        </div>
                    </div>
                </div>
                </div>

                {/* Advanced Filters */}
                <div className="bg-white p-4 rounded shadow-sm mb-4">
                    <div className="d-flex align-items-center mb-3">
                        <span className="me-2">⚙️</span>
                        <h6 className="mb-0 fw-semibold text-muted">Advanced Filters</h6>
                    </div>

                    <div className="row g-3 align-items-end justify-content-space-between">
                        {/* Select Employee */}
                        <div className="col-md-3">
                            <label className="form-label small">Select employee</label>
                            <select
                                value={selectedUsers.length === 0 ? "" : selectedUsers[0]}
                                onChange={handleUserChange}
                                className="form-select form-control-sm"
                                disabled={loading}
                            >
                                <option value="">All Employees</option>
                                {/* {employees.map((emp, idx) => ( */}
                                {allEmployees.map((emp, idx) => (
                                    <option key={idx} value={emp.userId}>
                                        {emp.userName}
                                    </option>
                                ))}
                            </select>
                            {/* {loading && (
                                <div className="text-muted small mt-1">Loading employee list...</div>
                            )} */}
                        </div>

                        {/* Group */}
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
                        <div className="col-md-3">
                            <label className="form-label small">Date range</label>
                            <div className="d-flex gap-1">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    max={getToday()}   // 👈 disallow future dates
                                    className="form-control"
                                />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    // min={startDate} // ✅ Prevent selecting earlier endDate
                                    min={startDate}     // 👈 can't go before startDate
                                    max={getToday()}    // 👈 can't go beyond today
                                    className="form-control form-control-sm"
                                />
                            </div>
                        </div>

                        {/* Sort By */}
                        <div className="col-md-3" style={{ marginLeft }}>
                            <label className="form-label">Sort by</label> {/* Ensuring label takes up full width */}
                            {/* <div className="d-flex gap-2 justify-content-between"> */}
                            <select
                                className="form-select form-control-sm"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}

                            // style={{ width: '200px' }} // Custom width for the select element
                            >
                                <option value="">Select...</option>
                                <option value="name">Name</option>
                                <option value="totalHours">Hours</option>
                            </select>
                            {/* </div> */}
                        </div>



                        {/* Notes Filter */}
                        {/* <div className="col-md-6 mt-3">
                            <label className="form-label small">Notes filter</label>
                            <input
                                type="text"
                                placeholder="Search in notes"
                                className="form-control form-control-sm"
                            />
                        </div> */}

                        {/* Period Quick Filters */}
                        <div className="d-flex gap-3 col-md-12 flex-wrap mt-4 ps-1">
                            {["Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year"].map(label => (
                                <button key={label} className="btn btn-light btn-sm border" onClick={() => handlePeriodClick(label)}>
                                    {label}
                                </button>
                            ))}
                        </div>

                    </div>

                </div>


                {/* Table */}
                <div className="overflow-x-auto mt-6 border rounded-lg bg-white shadow-sm">
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="table-dark text-center">
                            <tr>
                                <th>Employee</th>
                                <th>Duration</th>
                                <th>Lates</th>
                                {/* <th>Total Hours</th> */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-4">
                                        <div className="spinner-border text-dark me-2" role="status" />
                                        {/* Loading employee data... */}
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {filteredEmployees.map((emp, idx) => (
                                        <React.Fragment key={idx}>
                                            <tr className="align-middle">
                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center align-items-center gap-2" onClick={() => toggleDropdown(emp.userId)}>
                                                        {expandedUserId === emp.userId ? <ChevronDown size={16} /> : <ChevronRight size={16}
                                                        />}
                                                        <strong>{emp.userName}</strong>
                                                    </div>
                                                </td>
                                                <td className="text-center">⏱ {emp.record?.totalHours || '0h 0m'}</td>
                                                {/* <td className="text-center">
                                                    {emp.record?.status === 'absent' ? (
                                                        <span className="badge bg-danger">Absent</span>
                                                    ) : emp.record?.status?.toLowerCase().includes('late') ? (
                                                        <span className="badge bg-warning text-white">{emp.record.status}</span>
                                                    ) : (
                                                        <span className="badge bg-light text-dark">{emp.record?.status || 'No Status'}</span>
                                                    )}
                                                </td> */}
                                                {/* ✅ New column for userLates */}
                                                <td className="text-center">
                                                    <span
                                                        className={`badge ${emp.userLates > 0 ? 'bg-warning text-dark' : 'bg-light text-muted'}`}
                                                    >
                                                        {emp.userLates || 0}
                                                    </span>
                                                </td>

                                                {/* <td className="text-center">
                                                    <span className="badge text-dark">{emp.record?.totalHours || '0h 0m'}</span>
                                                </td> */}

                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <a href="mailto:someone@example.com">
                                                            <button className="btn btn-outline-secondary btn-sm">
                                                                {/* <Mail size={16} /> */}
                                                                <Mail size={16} />
                                                            </button>
                                                        </a>
                                                        {/* <button className="btn btn-outline-secondary btn-sm"><MessageSquare size={16} /></button> */}
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
                                                            <button className="btn btn-outline-secondary btn-sm">
                                                                <Info size={16} />
                                                            </button>
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
                                    ))}

                                </>
                            )}

                        </tbody>
                    </table>
                </div>

                {/* <button onClick={fetchPunctualityReport} className="btn btn-primary mt-3">
                    Fetch Punctuality Report
                </button> */}


                {/* </div> */}
            </div>
        </div >
    );
}
