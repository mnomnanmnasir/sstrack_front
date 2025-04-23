import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Clock, LineChart, AlarmClock, Users } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios'
import { Mail, MessageSquare, Info } from 'lucide-react';
// import { Mail, MessageSquare, Info } from 'lucide-react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import AdvancedFilters from './AdvancedFilter';
import EmployeeTable from './EmployeeTable';
import SummaryCards from './SummaryCards';


export default function Dashboard() {
    const [dateRange, setDateRange] = useState({ from: new Date('2025-04-07'), to: new Date('2025-04-14') });
    const [comparisonDate, setComparisonDate] = useState(new Date('2025-04-06'));
    // const [startDate, setStartDate] = useState("2025-04-08");
    // const [endDate, setEndDate] = useState("2025-04-10");
    const getToday = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // format: 'YYYY-MM-DD'
    };

    const [selectedPeriod, setSelectedPeriod] = useState(""); // NEW
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
        setSelectedPeriod(period); // ✅ Mark active
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
                <SummaryCards
                    totalHoursAllUsers={totalHoursAllUsers}
                    attendanceRate={attendanceRate}
                    consistentUsersCount={consistentUsersCount}
                    totalEmployees={employees.length}
                />

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

                <AdvancedFilters
                    selectedUsers={selectedUsers}
                    handleUserChange={handleUserChange}
                    allEmployees={allEmployees}
                    groupId={groupId}
                    groups={groups}
                    handleGroupChange={handleGroupChange}
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    handlePeriodClick={handlePeriodClick}
                    selectedPeriod={selectedPeriod}  // 👈 Add this
                    loading={loading}
                    windowWidth={windowWidth}
                />

                {/* Table */}
                <EmployeeTable
                    loading={loading}
                    filteredEmployees={filteredEmployees}
                    expandedUserId={expandedUserId}
                    toggleDropdown={toggleDropdown}
                />

            </div>
        </div >
    );
}
