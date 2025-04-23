// import React, { useEffect, useState } from "react";
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { FiCalendar } from 'react-icons/fi';
// import CheckIn from '../../images/total-checkIn.png';
// import MissingCheckIn from '../../images/missing-checkout.png';
// import totalBreakTime from '../../images/total-break-time.png';
// import activeMachine from '../../images/active-machine.png';
// import { FiUser } from "react-icons/fi";
// import axios from 'axios';

// const apiUrl = "http://localhost:9090/api/v1/owner/getAttendanceRecord";

// const Attendence = () => {
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [attendanceData, setAttendanceData] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchAttendanceData(selectedDate);
//     }, []);

//     useEffect(() => {
//         fetchAttendanceData(selectedDate);
//     }, [selectedDate]);

//     const fetchAttendanceData = async (date) => {
//         setLoading(true);
//         try {
//             const formattedDate = date.toISOString().split('T')[0];
//             const response = await axios.get(`${apiUrl}?date=${formattedDate}`);
//             if (response.data.success) {
//                 setAttendanceData(response.data.onlineUsers);
//             }
//         } catch (error) {
//             console.error("Error fetching attendance data:", error);
//         }
//         setLoading(false);
//     };

//     const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
//         <div
//             className="flex items-center justify-between bg-white text-gray-700 rounded-full px-4 py-2 shadow-md cursor-pointer"
//             onClick={onClick}
//             style={{ marginTop: '-2%' }}
//             ref={ref}
//         >
//             <span className="leading-none">{value}</span>
//             <FiCalendar style={{ marginTop: '-3%' }} className="text-gray-500 ml-2" />
//         </div>
//     ));

//     return (
//         <div className="container">
//             <div className="userHeader flex justify-between items-center mb-6 bg-blue-600 p-4 rounded-md">
//                 <h5 className="text-lg font-semibold">Attendance Management</h5>
//                 <div>
//                     <DatePicker
//                         selected={selectedDate}
//                         onChange={(date) => setSelectedDate(date)}
//                         dateFormat="dd MMMM yyyy"
//                         customInput={<CustomInput />}
//                     />
//                 </div>
//             </div>
//             <div className="container bg-white p-4 rounded shadow-sm" style={{ overflowX: "auto" }}>
//                 {loading ? (
//                     <p>Loading attendance data...</p>
//                 ) : (
//                     <table className="table align-middle text-center">
//                         <thead>
//                             <tr>
//                                 <th>Name</th>
//                                 <th>Check-In Time</th>
//                                 <th>Check-Out Time</th>
//                                 <th>Total Hours</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {attendanceData.map((user, index) => (
//                                 <tr key={index}>
//                                     <td className="d-flex align-items-center">
//                                         <FiUser className="me-2 text-secondary" style={{ fontSize: "1.5rem", color: "#6B7280" }} />
//                                         {user.userName}
//                                     </td>
//                                     <td>{user.checkIn}</td>
//                                     <td>{user.checkOut}</td>
//                                     <td>{`${user.totalHours.hours} hrs ${user.totalHours.minutes} mins`}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Attendence;
// import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { FiCalendar } from 'react-icons/fi'; // Calendar icon from react-icons

// const Attendence = () => {
//     const [selectedDate, setSelectedDate] = useState(new Date());

//     // Custom input for DatePicker
//     const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
//         <button
//             className="bg-white text-black flex items-center justify-between w-full rounded-md px-3 py-2 shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             onClick={onClick}
//             ref={ref}
//         >
//             <span>{value}</span>
//             <FiCalendar className="ml-2 text-gray-500" />
//         </button>
//     ));

//     return (
//         <>
//             <div className="container">
//                 {/* Header Section */}
//                 <div className="userHeader flex justify-between items-center mb-6">
//                     <h5 className="text-lg font-semibold">Attendance Management</h5>
//                     {/* Date Picker */}
//                     <div className="w-64 d-flex">
//                         <DatePicker
//                             selected={selectedDate}
//                             onChange={(date) => setSelectedDate(date)}
//                             dateFormat="dd MMMM yyyy"
//                             customInput={<CustomInput />}
//                         />
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div
//                     className="mainwrapper ownerTeamContainer"
//                     style={{
//                         display: 'flex',
//                         justifyContent: 'center',
//                         paddingBottom: '90px',
//                     }}
//                 >
//                     {/* Add any additional content here */}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Attendence;

import React, { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar } from 'react-icons/fi'; // Calendar icon from react-icons
import CheckIn from '../../images/total-checkIn.png'
import MissingChechIn from '../../images/missing-checkout.png'
import totalBreakTime from '../../images/total-break-time.png'
import activeMachine from '../../images/active-machine.png'
import jwtDecode from "jwt-decode";
import { FiUser } from "react-icons/fi"; // Import the user icon from react-icons
import axios from 'axios';

const Attendence = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    let token = localStorage.getItem('token');
    let items = jwtDecode(token);
    let headers = {
        Authorization: "Bearer " + token,
    }
    
    useEffect(() => {
        fetchAttendanceData(selectedDate);
    }, []);

    useEffect(() => {
        fetchAttendanceData(selectedDate);
    }, [selectedDate]);

    const fetchAttendanceData = async (date) => {
        setLoading(true);
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const response = await axios.get(`${apiUrl}?date=${formattedDate}`, { headers });
            if (response.data.success) {
                setAttendanceData(response.data.onlineUsers);
            }
        } catch (error) {
            console.error("Error fetching attendance data:", error);
        }
        setLoading(false);
    };

    const staticData = [
        {
            name: "John Doe",
            startDate: "2023-01-01",
            endDate: "2023-01-10",
            requestDate: "2022-12-15",
            leaveType: "Annual",
            approvalDate: "2022-12-20",
            approvedBy: "Manager",
            status: "Approved",
        },
        {
            name: "Jane Smith",
            startDate: "2023-02-05",
            endDate: "2023-02-07",
            requestDate: "2023-01-25",
            leaveType: "Sick",
            approvalDate: "2023-01-30",
            approvedBy: "Manager",
            status: "Approved",
        },
        {
            name: "Bob Johnson",
            startDate: "2023-03-10",
            endDate: "2023-03-15",
            requestDate: "2023-03-01",
            leaveType: "Casual",
            approvalDate: "2023-03-05",
            approvedBy: "Supervisor",
            status: "Approved",
        },
        {
            name: "Alice Brown",
            startDate: "2023-04-01",
            endDate: "2023-04-02",
            requestDate: "2023-03-28",
            leaveType: "Bereavement",
            approvalDate: "2023-03-30",
            approvedBy: "Manager",
            status: "Approved",
        },
        {
            name: "Charlie White",
            startDate: "2023-05-01",
            endDate: "2023-05-05",
            requestDate: "2023-04-20",
            leaveType: "Annual",
            approvalDate: "2023-04-25",
            approvedBy: "Manager",
            status: "Approved",
        },
    ];
    const [openApplyModal, setOpenApplyModal] = useState(false); // State for Apply Leave modal
    const [currentUser, setCurrentUser] = useState(null); // Store current user info
    const [selectedLeave, setSelectedLeave] = useState(null); // To store the clicked leave
    const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
    const data = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [modalOpen, setModalOpen] = useState(false)
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(staticData.length / itemsPerPage);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = staticData.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Custom Input for the DatePicker
    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <div
            className="flex items-center justify-between bg-white text-gray-700 rounded-full px-4 py-2 shadow-md cursor-pointer"
            onClick={onClick}
            style={{ marginTop: '-2%' }}
            ref={ref}
        >
            <span className="leading-none">{value}</span>
            <FiCalendar style={{ marginTop: '-3%' }} className="text-gray-500 ml-2" />
        </div>
    ));

    return (
        <>
            <div className="container">
                {/* Header Section */}
                <div className="userHeader flex justify-between items-center mb-6 bg-blue-600 p-4 rounded-md">
                    <h5 className="text-lg font-semibold">Attendance Management</h5>
                    {/* Date Picker */}
                    <div>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd MMMM yyyy"
                            customInput={<CustomInput />}
                        />
                    </div>
                </div>

                <div
                    className="container"
                    style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div className="row">
                        {/* Card 1 */}
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="card shadow h-100" style={{ borderRadius: '8px' }}>
                                <div className="card-body">
                                    <img
                                        src={MissingChechIn}
                                        alt="Check-Ins"
                                        className="mb-3"
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                    <p className="text-muted">Total Check-Ins Today</p>
                                    <h3 className="text-success fs-1 font-weight-bold">13</h3>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="card shadow h-100" style={{ borderRadius: '8px' }}>
                                <div className="card-body">
                                    <img
                                        src={totalBreakTime}
                                        alt="Break Time"
                                        className="mb-3"
                                        style={{ width: '70px', height: '50px' }}
                                    />
                                    <p className="text-muted">Total Break Time Today</p>
                                    <h3 className="text-success fs-1 font-weight-bold">1 Hr</h3>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="card shadow h-100" style={{ borderRadius: '8px' }}>
                                <div className="card-body">
                                    <img
                                        src={activeMachine}
                                        alt="Active Machines"
                                        className="mb-3"
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                    <p className="text-muted">Active Machines</p>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h3 className="text-success fs-1 font-weight-bold mb-0">2</h3>
                                        <p
                                            className="text-danger small mb-0"
                                            style={{ marginTop: '12%' }}
                                        >
                                            1 offline
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="card shadow h-100" style={{ borderRadius: '8px' }}>
                                <div className="card-body">
                                    <img
                                        src={CheckIn}
                                        alt="Missing Check-Outs"
                                        className="mb-3"
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                    <p className="text-muted">Missing Check-Outs</p>
                                    <h3 className="text-success fs-1 font-weight-bold">2</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ width: "100%" }}>
                    <div
                        className="container bg-white p-4 rounded shadow-sm"
                        style={{ overflowX: "auto" }}
                    >
                        <table className="table align-middle text-center" style={{ borderSpacing: "0", borderCollapse: "separate" }}>
                            <thead style={{ backgroundColor: "#F9FAFB", borderBottom: "2px solid #E5E7EB" }}>
                                <tr className="text-center">
                                    <th
                                      style={{ color: "#6B7280", fontWeight: "600", fontSize: "14px" }}
                                    >
                                        Name
                                    </th>
                                    <th style={{ color: "#6B7280", fontWeight: "600", fontSize: "14px" }}>
                                        Check-In Time
                                    </th>
                                    <th style={{ color: "#6B7280", fontWeight: "600", fontSize: "14px" }}>
                                        Check-Out Time
                                    </th>
                                    {/* <th style={{ color: "#6B7280", fontWeight: "600", fontSize: "14px" }}>
                                        Break-In Time
                                    </th>
                                    <th style={{ color: "#6B7280", fontWeight: "600", fontSize: "14px" }}>
                                        Break-Out Time
                                    </th> */}
                                    <th style={{ color: "#6B7280", fontWeight: "600", fontSize: "14px" }}>
                                    Total Hours
                                    </th>
                                    <th style={{ color: "#6B7280", fontWeight: "600", fontSize: "14px" }}>
                                        Device Location
                                    </th>
                                    <th style={{ color: "#6B7280", fontWeight: "600", fontSize: "14px" }}>
                                        Machine ID
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            {attendanceData.map((row, index) => (

                                    <tr key={index} style={{ borderBottom: "1px solid #E5E7EB" }}>
                                        <td
                                            className="d-flex align-items-center"
                                            style={{
                                                padding: "12px 16px",
                                                color: "#374151",
                                                fontSize: "14px",
                                                textAlign: "left",
                                            }}
                                        >
                                            <FiUser
                                                className="me-2 text-secondary"
                                                style={{ fontSize: "1.5rem", color: "#6B7280" }}
                                            />
                                            {row.userName}
                                        </td>
                                        <td style={{ color: "#374151", fontSize: "14px" }}>{row.checkIn}</td>
                                        <td style={{ color: "#374151", fontSize: "14px" }}>{row.checkOut}</td>
                                        {/* <td style={{ color: "#374151", fontSize: "14px" }}>{row.breakIn}</td>
                                        <td style={{ color: "#374151", fontSize: "14px" }}>{row.breakOut}</td> */}
                                        <td style={{ color: "#374151", fontSize: "14px" }}>{row.totalHours.hours}</td>
                                        <td style={{ color: "#374151", fontSize: "14px" }}>{row.location}</td>
                                        <td style={{ color: "#374151", fontSize: "14px" }}>{row.machineId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>

    );
};
// hey
export default Attendence;
