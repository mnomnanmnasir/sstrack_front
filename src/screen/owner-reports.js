import React, { useEffect, useState } from "react";
import UserHeader from "../screen/component/userHeader";
import menu from "../images/menu.webp";
import loader from "../images/Rectangle.webp";
import check from "../images/check.webp";
import circle from "../images/circle.webp";
import saveReport from "../images/reportImg.webp";
import blueArrow from "../images/bluearrow.webp";
import cross from "../images/cross.webp";
import downArrow from "../images/downArrow.webp";
import save from "../images/save.webp";
import excel from "../images/excel.webp";
import share from "../images/share.webp";
import reportButton from "../images/reportButton.webp";
import adminReport from "../images/adminreport4.webp";
import addButton from "../images/addButton.webp";
import line from "../images/line.webp";
import Footer from "../screen/component/footer";
import UserDashboardSection from "./component/userDashboardsection";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import blueBackground from "../images/bluebackground.png";
import ActivityChart from "../adminScreens/component/ActivityChart";
import SelectBox from "../companyOwner/ownerComponent/selectBox";
import makeAnimated from 'react-select/animated';
import axios from "axios";
// import { useQuery } from 'react-query';
import crossButton from "../images/cross.webp";
import { FaPlus, FaMinus } from 'react-icons/fa';
import jwtDecode from "jwt-decode";
// import Footer from '../screen/component/footer'


function OwnerReport() {
    let token = localStorage.getItem('token');
    const items = jwtDecode(JSON.stringify(token));

    const year = new Date().getFullYear()
    // let token = localStorage.getItem('token');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [employeeId, setEmployeeId] = useState(null);
    // const [employeeId, setEmployeeId] = useState(items?._id || null);
    const [managerId, setManagerId] = useState(null);
    const [reportType, setReportType] = useState("daily"); // Added to store the report type
    const [userType, setUserType] = useState(items?.userType || 'user');
    const [expandedEmployee, setExpandedEmployee] = useState(null);

    const handleExpand = (employee) => {
        if (expandedEmployee === employee) {
            setExpandedEmployee((prevExpanded) => (prevExpanded === employee ? null : employee));

        } else {
            setExpandedEmployee(employee); // Expand if not expanded
        }
    };

    const [selectedUsers, setSelectedUsers] = useState([]);

    // const handleSelectUsers = (e) => { setSelectedUsers(e); const userIds = e.map(user => user.id); setEmployeeId(userIds);
    // }
    const handleSelectUsers = (selectedUsers) => {
        setSelectedUsers(selectedUsers);
        const userIds = selectedUsers.map((user) => user.id);
        setEmployeeId(userIds);


        // Calculate total hours of selected users
        const totalHours = selectedUsers.reduce((acc, user) => {
            const hours = acc.hours + Math.floor(user.totalHours);
            const minutes = acc.minutes + (user.totalHours % 1) * 60;
            return { hours, minutes: minutes % 60 };
        }, { hours: 0, minutes: 0 });

        // Parse existing totalHours value
        const [existingHours, existingMinutes] = reportData.totalHours.split('h ').map((val) => parseInt(val.replace('m', '')));

        // Calculate new total hours
        const newHours = existingHours + totalHours.hours;
        const newMinutes = existingMinutes + totalHours.minutes;

        const totalActivity = 0;

        debugger
        // Update reportData state with total hours of selected users
        setReportData({
            ...reportData,
            totalHours: selectedUsers.reduce((acc, user) => {
                let totalUserHours = 0;
                if (user.projects && Array.isArray(user.projects)) {
                    totalUserHours = user.projects.reduce((acc, project) => acc + project.projectHours, 0);
                }
                totalUserHours += user.duration;
                return acc + totalUserHours;
            }, 0) > 0
                ? `${Math.floor(totalHours / 60)}h ${totalHours % 60}m`
                : '0h 0m',
            totalActivity: selectedUsers.reduce((acc, user) => {
                let totalUserActivity = 0;
                if (user.projects && Array.isArray(user.projects)) {
                    totalUserActivity = user.projects.reduce((acc, project) => acc + project.projectActivity, 0);
                }
                totalUserActivity += user.activity;
                return acc + totalUserActivity;
            }, 0) > 0
                ? `${Math.floor(totalActivity / selectedUsers.length)}`
                : '0',
            allUsers: selectedUsers.map((user) => {
                let totalProjectHours = 0; // Initialize to 0
                let totalProjectActivity = 0; // Initialize to 0
                let projects = [];

                if (user.projects && Array.isArray(user.projects)) {
                    user.projects.forEach((project) => {
                        totalProjectHours += project.projectHours;
                        totalProjectActivity += project.projectActivity;
                        projects.push({
                            projectname: project.projectname,
                            projectHours: `${Math.floor(project.projectHours)}h ${(project.projectHours % 1) * 60}m`,
                            projectActivity: Math.floor(project.projectActivity),
                        });
                    });
                }

                totalProjectHours += user.duration;
                totalProjectActivity += user.activity;

                return {
                    employee: user.label, // Display the employee name
                    Duration: `${Math.floor(totalProjectHours)}h ${(totalProjectHours % 1) * 60}m`, // Display duration
                    Activity: user.projects && Array.isArray(user.projects) ? Math.floor(totalProjectActivity / user.projects.length) : 0, // Display activity
                    projects: projects, // Return the projects array
                };
            }),
        });
        console.log('Set Report Data', setReportData)
    }



    const [dateFilter, setDateFilter] = useState({
        today: false,
        yesterday: false,
        thisWeek: false,
        lastWeek: false,
        thisMonth: false,
        lastMonth: false,
        thisYear: true,
        lastYear: false,
    })
    const [users, setUsers] = useState([]);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    let headers = {
        Authorization: 'Bearer ' + token,
    }
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const getQueryKey = (type) => [`reports`, type, userType, employeeId, managerId];

    const changeDateRange = (filterType) => {
        const now = new Date();
        let start, end;

        switch (filterType) {
            case "today":
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                end = start;
                break;
            case "yesterday":
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                end = start;
                break;
            case "thisWeek":
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // Start of the week (Sunday)
                start = startOfWeek;
                end = now; // Today
                break;
            case "lastWeek":
                const lastWeekEnd = new Date(now);
                lastWeekEnd.setDate(now.getDate() - now.getDay() - 1); // Last week's Saturday
                const lastWeekStart = new Date(lastWeekEnd);
                lastWeekStart.setDate(lastWeekEnd.getDate() - 6); // Last week's Sunday
                start = lastWeekStart;
                end = lastWeekEnd;
                break;
            case "thisMonth":
                start = new Date(now.getFullYear(), now.getMonth(), 1); // Start of this month
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of this month
                break;
            case "lastMonth":
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1); // Start of last month
                end = new Date(now.getFullYear(), now.getMonth(), 0); // End of last month
                break;
            case "thisYear":
                start = new Date(now.getFullYear(), 0, 1); // January 1st of this year
                end = new Date(now.getFullYear(), 11, 31); // December 31st of this year
                break;
            case "lastYear":
                start = new Date(now.getFullYear() - 1, 0, 1); // January 1st of last year
                end = new Date(now.getFullYear() - 1, 11, 31); // December 31st of last year
                break;
            default:
                start = null;
                end = null;
        }

        // Update the date range and filter
        setStartDate(start);
        setEndDate(end);
    };




    const getData = async () => {
        setLoading(true);
        try {
            const url = employeeId
                ? `${apiUrl}/owner/day?startDate=${startDate.toLocaleDateString()}&endDate=${endDate.toLocaleDateString()}&userId=${employeeId}`
                : `${apiUrl}/owner/day?startDate=${startDate.toLocaleDateString()}&endDate=${endDate.toLocaleDateString()}`;

            const response = await axios.get(url, { headers });

            console.log('API Request URL:', url);
            if (response.status === 200) {
                console.log('New Api response', response);
                setReportData(response.data?.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        if (startDate && endDate) {
            getData();
        }
    }, [startDate, endDate, employeeId]);

    const animatedComponents = makeAnimated();




    // const getManagers = async () => {
    //   try {
    //     const response = await axios.get(`${apiUrl}/manager/employees`, { headers });
    //     console.log("Response:", response); // Log the entire response object

    //     if (response.status === 200) {
    //       console.log("Response data:", response.data); // Log the response data
    //       // Check if response data and employees array exist
    //       if (response.data && response.data.employees) {
    //         // Filter out only manager emails
    //         const managerEmails = response.data.employees
    //           .filter(employee => employee.userType === "manager")
    //           .map(manager => manager.email);
    //         console.log("Manager emails:", managerEmails); // Log the extracted manager emails
    //         // Ensure managerEmails is an array
    //         if (Array.isArray(managerEmails)) {
    //           console.log("Length of managerEmails:", managerEmails.length); // Log the length of managerEmails
    //           setUsers(managerEmails); // Set only the email addresses of managers
    //         } else {
    //           console.log("managerEmails is not an array:", managerEmails);
    //           setUsers([]); // Set an empty array if managerEmails is not an array
    //         }
    //       } else {
    //         console.log("No employees found in response data");
    //         setUsers([]); // Set an empty array if there are no employees in the response
    //       }
    //     }
    //   } catch (err) {
    //     console.log("Error:", err); // Log any errors that occur
    //   }
    // }



    // useEffect(() => {
    //   getManagers();
    // }, []);

    const getManagerEmployees = async () => {
        try {
            const response = await axios.get(`${apiUrl}/manager/employees`, { headers });
            if (response.status === 200) {
                // Assuming the response contains the list of employees for the manager
                return response.data.convertedEmployees;
            } else {
                console.log("Error fetching manager's employees");
                return [];
            }
        } catch (error) {
            console.log("Error:", error);
            return [];
        }
    };

    const getEmployess = async () => {
        try {
            const response = await axios.get(`${apiUrl}/owner/companies`, { headers });
            if (response.status === 200) {
                // Identify user type and filter users accordingly
                const user = items?.userType || "user"; // Assuming userType is stored in localStorage items
                setUserType(user);

                if (user === "admin" || user === "owner") {
                    setUsers(response.data.employees);
                } else if (user === "manager") {
                    const managerEmployees = await getManagerEmployees();
                    const managerId = items._id; // Get the logged-in manager's ID
                    // const filteredEmployees = managerEmployees.filter(employee => employee.managerId === managerId);
                    setUsers(managerEmployees);
                } else {
                    const userByEmail = response.data.employees.find(employee => items.email === employee.email);
                    setUsers(userByEmail ? [userByEmail] : []);
                }
                console.log(response);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        getEmployess();
    }, []);


    // const getReports = async (type) => {

    //   let response;
    //   if (userType === 'admin' || userType === 'owner') {
    //     if (employeeId) {
    //       response = await axios.get(`${apiUrl}/owner/day?daySpecifier=${type}&userId=${employeeId}`, { headers });
    //     }
    //     else {
    //       response = await axios.get(`${apiUrl}/owner/day?daySpecifier=${type}`, { headers });
    //     }
    //   }
    //   else if (user === 'manager') {
    //     // If user is a manager, filter managers based on the logged-in manager's ID
    //     const loggedInManager = response.data.employees.find(employee => employee.email === items.email);
    //     if (loggedInManager) {
    //       return response.data.employees.filter(employee => employee.managerId === loggedInManager._id);
    //     } else {
    //       return [];
    //     }
    //   }
    //   else {
    //     response = await axios.get(`${apiUrl}/owner/day?startDate=${new Date().toLocaleDateString()}&endDate=${new Date().toLocaleDateString()}${type}&userId=${items._id}`, { headers });
    //   }
    //   if (response.status === 200) {
    //     console.log(response);
    //     setReportData(response.data.data);
    //   }
    //   if (response.status === 200) {
    //     return response.data.data;
    //   } else {
    //     throw new Error('Failed to fetch reports');
    //   }
    // };

    const getReports = async () => {
        setLoading(true);
        try {
            let response;
            if (userType === 'admin' || userType === 'owner') {
                // Fetch reports for all users
                response = await axios.get(`${apiUrl}/owner/day?startDate=${startDate.toLocaleDateString()}&endDate=${endDate.toLocaleDateString()}&userId=${employeeId}`, { headers });
            } else if (user === 'manager') {
                // If user is a manager, filter managers based on the logged-in manager's ID
                const loggedInManager = response.data.employees.find(employee => employee.email === items.email);
                if (loggedInManager) {
                    return response.data.employees.filter(employee => employee.managerId === loggedInManager._id);
                } else {
                    return [];
                }
            } else {
                // Fetch reports for a single user
                response = await axios.get(`${apiUrl}/timetrack/day?startDate=${startDate.toLocaleDateString()}&endDate=${endDate.toLocaleDateString()}&userId=${employeeId}`, { headers });
            }
            if (response.status === 200) {
                console.log(response);
                setReportData(response.data.data);
            }
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    const fetchDailyReports = async (type) => {

        let response;
        if (userType === 'admin' || userType === 'owner') {
            if (employeeId) {
                response = await axios.get(`${apiUrl}/owner/day?daySpecifier=${type}&userId=${employeeId}`, { headers });
            }
            else {
                response = await axios.get(`${apiUrl}/owner/day?daySpecifier=${type}`, { headers });
            }
        }
        else if (userType === 'manager') {
            if (employeeId) {
                response = await axios.get(`${apiUrl}/manager/day?daySpecifier=${type}&userId=${employeeId}`, { headers });
            }
            else {
                response = await axios.get(`${apiUrl}/manager/day?daySpecifier=${type}`, { headers });
            }
        }
        else {
            response = await axios.get(`${apiUrl}/timetrack/day?daySpecifier=${type}&userId=${items._id}`, { headers });
        }
        if (response.status === 200) {
            console.log(response);
            setReportData(response.data.data);
        }
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch reports');
        }
    };

    const fetchYearlyReports = async (type) => {

        let response;
        if (userType === 'admin' || userType === 'owner') {
            if (employeeId) {
                response = await axios.get(`${apiUrl}/owner/year?yearSpecifier=${type}&userId=${employeeId}`, { headers });
            }
            else {
                response = await axios.get(`${apiUrl}/owner/year?yearSpecifier=${type}`, { headers });
            }
        }
        else if (userType === 'manager') {
            if (employeeId) {
                response = await axios.get(`${apiUrl}/manager/year?yearSpecifier=${type}&userId=${employeeId}`, { headers });
            }
            else {
                response = await axios.get(`${apiUrl}/manager/year?yearSpecifier=${type}`, { headers });
            }
        }
        else {
            response = await axios.get(`${apiUrl}/timetrack/year?yearSpecifier=${type}&userId=${items._id}`, { headers });
        }
        if (response.status === 200) {
            console.log(response);
            setReportData(response.data.data);
        }
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch reports');
        }
    };

    const getWeeklyReports = async (type) => {

        let response;
        if (userType === 'admin' || userType === 'owner') {
            if (employeeId) {
                response = await axios.get(`${apiUrl}/owner/week?weekSpecifier=${type}&userId=${employeeId}`, { headers });
            }
            else {
                response = await axios.get(`${apiUrl}/owner/week?weekSpecifier=${type}`, { headers });
            }
        }
        else if (userType === 'manager') {
            if (employeeId) {
                response = await axios.get(`${apiUrl}/manager/week?weekSpecifier=${type}&userId=${employeeId}`, { headers });
            }
            else {
                response = await axios.get(`${apiUrl}/manager/week?weekSpecifier=${type}`, { headers });
            }
        }
        else {
            response = await axios.get(`${apiUrl}/timetrack/week?weekSpecifier=${type}&userId=${items._id}`, { headers });
        }
        if (response.status === 200) {
            console.log(response);
            setReportData(response.data.data);
        }
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch reports');
        }
    };





    const getDailyReports = async (type) => {
        if (employeeId) {
            setLoading(true)
            try {
                const response = await axios.get(`${apiUrl}/owner/day?daySpecifier=${type}&userId=${employeeId}`, { headers })
                if (response.status) {
                    console.log(response);
                    setReportData(response.data.data)
                    setLoading(false)
                }
            }
            catch (err) {
                setLoading(false)
                console.log(err);
            }
        }
        else {
            setLoading(true)
            try {
                const response = await axios.get(`${apiUrl}/owner/day?daySpecifier=${type}`, { headers })
                if (response.status) {
                    console.log(response);
                    setReportData(response.data.data)
                    setLoading(false)
                }
            }
            catch (err) {
                setLoading(false)
                console.log(err);
            }
        }
    }

    const getYearlyReports = async (type) => {

        let response;
        if (userType === 'admin' || userType === 'owner') {
            if (employeeId) {
                response = await axios.get(`${apiUrl}/owner/year?yearSpecifier=${type}&userId=${employeeId}`, { headers });
            }
            else {
                response = await axios.get(`${apiUrl}/owner/year?yearSpecifier=${type}`, { headers });
            }
        }
        else if (userType === 'manager') {
            if (employeeId) {
                response = await axios.get(`${apiUrl}/manager/year?yearSpecifier=${type}&userId=${employeeId}`, { headers });
            }
            else {
                response = await axios.get(`${apiUrl}/manager/year?yearSpecifier=${type}`, { headers });
            }
        }
        else {
            response = await axios.get(`${apiUrl}/owner/year?yearSpecifier=${type}&userId=${items._id}`, { headers });
        }
        if (response.status === 200) {
            console.log(response);
            setReportData(response.data.data);
        }
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch reports');
        }
    };

    const getMonthlyReports = async (type) => {

        let response;
        if (userType === 'admin' || userType === 'owner') {
            if (employeeId) {
                response = await axios.get(`${apiUrl}/owner/month?monthSpecifier=${type}&userId=${employeeId}`, { headers });
            }
            else {
                response = await axios.get(`${apiUrl}/owner/month?monthSpecifier=${type}`, { headers });
            }
        }
        else if (userType === 'manager') {
            if (employeeId) {
                response = await axios.get(`${apiUrl}/manager/month?monthSpecifier=${type}&userId=${employeeId}`, { headers });
            }
            else {
                response = await axios.get(`${apiUrl}/manager/month?monthSpecifier=${type}`, { headers });
            }
        }
        else {
            response = await axios.get(`${apiUrl}/owner/month?monthSpecifier=${type}&userId=${items._id}`, { headers });
        }
        if (response.status === 200) {
            console.log(response);
            setReportData(response.data.data);
        }
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch reports');
        }
    };

    useEffect(() => {
        getEmployess()
    }, [])

    useEffect(() => {
        dateFilter?.today === true ? fetchDailyReports("this") :
            dateFilter?.yesterday === true ? fetchDailyReports("previous") :
                dateFilter?.thisWeek === true ? getWeeklyReports("this") :
                    dateFilter?.lastWeek === true ? getWeeklyReports("previous") :
                        dateFilter?.thisMonth === true ? getMonthlyReports("this") :
                            dateFilter?.lastMonth === true ? getMonthlyReports("previous") :
                                dateFilter?.thisYear === true ? fetchYearlyReports("this") :
                                    dateFilter?.lastYear === true ? fetchYearlyReports("previous") :
                                        getReports()
    }, [employeeId, managerId, userType])

    const user = users?.map(user => {
        const totalProjectHours = user.projects?.reduce((acc, project) => acc + (project.projectHours || 0), 0) || 0;
        const totalProjectActivity = user.projects?.reduce((acc, project) => acc + (project.projectActivity || 0), 0) || 0;

        const userDuration = user.duration !== null && user.duration !== undefined ? user.duration : 0;
        const userActivity = user.activity !== null && user.activity !== undefined ? user.activity : 0;

        return {
            label: user.name,
            value: user.email,
            id: user._id,
            duration: userDuration + totalProjectHours,
            activity: userActivity + totalProjectActivity,
            projects: user.projects?.map(project => ({
                projectname: project.projectname,
                projectHours: `${Math.floor(project.projectHours || 0)}h ${(project.projectHours || 0) % 1 * 60}m`,
                projectActivity: Math.floor(project.projectActivity || 0),
            })),
        };
    });

    console.log("main agya users ho main", users);
    { console.log("User showing...", user) }
    const defaultValue = user.length > 0 ? [{ value: user[0].value }] : [];

    console.log(dateFilter);

    const allUsers = user; // assuming 'user' is the original array of users
    const filteredUsers = user.filter(user => user.value !== null);


    return (
        <>
            {/* <UserHeader /> */}

            <div>
                <div className="container">
                    <div className="userHeader">
                        <div className="headerTop">
                            <img src={saveReport} />
                            <h5>Summary Report </h5>
                        </div>
                    </div>
                    <div className="mainwrapper">
                        <div className="summaryContainer">
                            <div className="calenderDiv">

                                <div className="calenderInnerDiv">
                                    <div className="dateDiv">
                                        <div>           <button>
                                            <DatePicker
                                                placeholderText="Select Start Date"
                                                className="bg-transparent border-0 text-center"
                                                selected={startDate}
                                                onChange={(date) => setStartDate(date)}
                                            />
                                        </button>

                                        </div>
                                        <div>  ►  </div>
                                        <div>
                                            <button>
                                                <DatePicker
                                                    placeholderText="Select End Date"
                                                    className="bg-transparent border-0 text-center"
                                                    selected={endDate}
                                                    onChange={(date) => setEndDate(date)}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="dayDiv">
                                        <div className="summaryTodayDiv">
                                            <p
                                                onClick={() => {
                                                    changeDateRange("today");
                                                    fetchDailyReports("this")
                                                    setDateFilter({
                                                        today: true,
                                                        yesterday: false,
                                                        thisWeek: false,
                                                        lastWeek: false,
                                                        thisMonth: false,
                                                        lastMonth: false,
                                                        thisYear: false,
                                                        lastYear: false,
                                                    })
                                                }}
                                                style={{ color: dateFilter.today === true && "#28659C", fontWeight: dateFilter.today === true && "600" }}>Today</p>
                                            <p
                                                onClick={() => {
                                                    changeDateRange("yesterday");
                                                    fetchDailyReports("previous")
                                                    setDateFilter({
                                                        today: false,
                                                        yesterday: true,
                                                        thisWeek: false,
                                                        lastWeek: false,
                                                        thisMonth: false,
                                                        lastMonth: false,
                                                        thisYear: false,
                                                        lastYear: false,
                                                    })
                                                }}
                                                style={{ color: dateFilter.yesterday === true && "#28659C", fontWeight: dateFilter.yesterday === true && "600" }}>Yesterday</p>
                                        </div>
                                        <div className="summaryTodayDiv">
                                            <p
                                                onClick={() => {
                                                    changeDateRange("thisWeek");
                                                    getWeeklyReports("this")
                                                    setDateFilter({
                                                        today: false,
                                                        yesterday: false,
                                                        thisWeek: true,
                                                        lastWeek: false,
                                                        thisMonth: false,
                                                        lastMonth: false,
                                                        thisYear: false,
                                                        lastYear: false,
                                                    })
                                                }}
                                                style={{ color: dateFilter.thisWeek === true && "#28659C", fontWeight: dateFilter.thisWeek === true && "600" }}>This Week</p>
                                            <p
                                                onClick={() => {
                                                    changeDateRange("lastWeek");
                                                    getWeeklyReports("previous")
                                                    setDateFilter({
                                                        today: false,
                                                        yesterday: false,
                                                        thisWeek: false,
                                                        lastWeek: true,
                                                        thisMonth: false,
                                                        lastMonth: false,
                                                        thisYear: false,
                                                        lastYear: false,
                                                    })
                                                }}
                                                style={{ color: dateFilter.lastWeek === true && "#28659C", fontWeight: dateFilter.lastWeek === true && "600" }}>Last Week</p>
                                        </div>
                                        <div className="summaryTodayDiv">
                                            <p
                                                onClick={() => {
                                                    changeDateRange("thisMonth");
                                                    getMonthlyReports("this")
                                                    setDateFilter({
                                                        today: false,
                                                        yesterday: false,
                                                        thisWeek: false,
                                                        lastWeek: false,
                                                        thisMonth: true,
                                                        lastMonth: false,
                                                        thisYear: false,
                                                        lastYear: false,
                                                    })
                                                }}
                                                style={{ color: dateFilter.thisMonth === true && "#28659C", fontWeight: dateFilter.thisMonth === true && "600" }}>This Month</p>
                                            <p
                                                onClick={() => {
                                                    changeDateRange("lastMonth");
                                                    getMonthlyReports("previous")
                                                    setDateFilter({
                                                        today: false,
                                                        yesterday: false,
                                                        thisWeek: false,
                                                        lastWeek: false,
                                                        thisMonth: false,
                                                        lastMonth: true,
                                                        thisYear: false,
                                                        lastYear: false,
                                                    })
                                                }}
                                                style={{ color: dateFilter.lastMonth === true && "#28659C", fontWeight: dateFilter.lastMonth === true && "600" }}>Last Month</p>
                                        </div>
                                        <div className="summaryTodayDiv">
                                            <p
                                                onClick={() => {
                                                    changeDateRange("thisYear");
                                                    fetchYearlyReports("this")
                                                    setDateFilter({
                                                        today: false,
                                                        yesterday: false,
                                                        thisWeek: false,
                                                        lastWeek: false,
                                                        thisMonth: false,
                                                        lastMonth: false,
                                                        thisYear: true,
                                                        lastYear: false,
                                                    })
                                                }}
                                                style={{ color: dateFilter.thisYear === true && "#28659C", fontWeight: dateFilter.thisYear === true && "600" }}>This Year</p>
                                            <p
                                                onClick={() => {
                                                    changeDateRange("lastYear");
                                                    fetchYearlyReports("previous")
                                                    setDateFilter({
                                                        today: false,
                                                        yesterday: false,
                                                        thisWeek: false,
                                                        lastWeek: false,
                                                        thisMonth: false,
                                                        lastMonth: false,
                                                        thisYear: false,
                                                        lastYear: true,
                                                    })
                                                }}
                                                style={{ color: dateFilter.lastYear === true && "#28659C", fontWeight: dateFilter.lastYear === true && "600" }}>Last Year</p>
                                        </div>

                                    </div>
                                </div>
                                <div>
                                    <div className="dropdown">
                                        <button className="btn m-0 utc5" type="button" aria-expanded="false">
                                            {items?.timezone}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="crossButtonDiv">
                                <SelectBox
                                    onChange={(e) =>
                                        handleSelectUsers(e)
                                    }
                                    options={allUsers.filter(user => user.label)}
                                    closeMenuOnSelect={true}
                                    components={animatedComponents}
                                    defaultValue={defaultValue}
                                    isMulti={true}
                                // maxValues={1} // Limit the number of selections to 1
                                // isClearable={true} // Allow the user to clear the selection
                                // value={selectedUsers.length > 0 ? selectedUsers[0] : null} // Set the value to the first selected user
                                />
                                {console.log("User Detials", user)}
                            </div>
                            <div>
                                {/* <img className="reportButton" src={reportButton} /> */}
                                {/* <SelectBox
                  classNamePrefix="Select projects"
                  defaultValue="Select projects"
                  isDisabled={isDisabled}
                  isClearable={isClearable}
                  isRtl={isRtl}
                  isSearchable={isSearchable}
                  options={colourOptions}
                  optionHeight={40}
                  optionPadding={10}
                /> */}
                                {/* <SelectBox
                  defaultValue="Select projects"
                  isSearchable={true}
                  optionHeight={40}
                  optionPadding={10}
                /> */}
                            </div>
                            {/* <div className="summaryButton">
              <button className="activeButton">Show Reports</button>
            </div> */}
                            <div className="adminReport4" style={{ backgroundColor: '#F5F5F5' }}>
                                {loading ? (
                                    <div className="loader"></div>
                                ) : reportData ? (
                                    <>
                                        <div>
                                            <p className="sixtyhour">{reportData?.totalHours ? reportData?.totalHours : "0h 0m"}</p>
                                            <p className="report-percentage">{`${reportData?.totalActivity ? Math.floor(reportData?.totalActivity) : 0} %`}</p>
                                            {/* <p className="report-percentage">{`${reportData?.payRate ? Math.floor(reportData?.payRate) : 0} %`}</p> */}

                                            {/* Total PayRate Calculation */}
                                            <p className="report-percentage">
                                                {`${reportData?.allUsers
                                                    ? Math.floor(reportData.allUsers.reduce((acc, user) => acc + (user.payRate || 0), 0))
                                                    : 0
                                                    } `}
                                            </p>

                                            {console.log("Reports PayRate", reportData)}
                                        </div>
                                        <div className="summaryDiv">
                                            <ActivityChart reportData={reportData} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="loader"></div>
                                )}
                            </div>

                            <div className="employeeDiv">
                                <p>{"± Employees / ± Projects"}</p>
                                <div className="durationDiv">
                                    <p>Duration</p>
                                    <p>Activity</p>
                                    <p>PayRate</p>

                                </div>
                            </div>
                            {/* Debugging: Output user type and report data to console */}
                            {console.log("userType:", userType)}
                            {console.log("reportData:", reportData)}
                            {console.log("reportData.allUsers:", reportData && reportData.allUsers)}

                            {(userType === "admin" || userType === "owner" || userType === 'user' || userType === 'manager') && reportData && reportData.allUsers ? (
                                reportData.allUsers.map((data, index) => (
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div className="asadMehmoodDiv" key={index}>
                                            <div onClick={() => handleExpand(data?.employee)}>
                                                <p>
                                                    {/* <FaPlus /> Add */}
                                                    <p>{expandedEmployee === data?.employee ? <FaMinus /> : <FaPlus />}
                                                        {/* <img src={expandedEmployee === data?.employee ? <FaMinus /> : <FaPlus />} alt="Toggle" /> */}
                                                        {/* <img src={expandedEmployee === data?.employee ? crossButton : addButton} alt="Toggle" /> */}
                                                        <span>{data?.employee}</span>
                                                    </p>
                                                </p>
                                            </div>
                                            {console.log('Report Data selectUsers', reportData)}
                                            <div className="durationDiv">
                                                <p>{data?.Duration}</p>
                                                <p>{Math.floor(data?.Activity)} %</p>
                                                <p>{Math.floor(data?.payRate)} </p>

                                            </div>
                                        </div>
                                        {expandedEmployee === data?.employee && (
                                            <div className="expandedDetails">
                                                {data?.projects
                                                    ?.filter((project, index, projectsArray) => {

                                                        if (projectsArray.length > 1) {
                                                            return project.projectname !== null;
                                                        }
                                                        return true;
                                                    })
                                                    ?.map((project, projectIndex) => (
                                                        <div key={projectIndex} className="asadMehmoodkabhaiDiv">

                                                            <p >{project?.projectname || 'No project name'}</p>
                                                            <div className="durationDiv">
                                                                <p>{project.hours || 'No duration'}</p>
                                                                <p>{project.activity !== undefined ? Math.floor(project.activity) : 'No activity'} %</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                userType === "owner" && reportData ? (
                                    <div className="asadMehmoodDiv">
                                        <div onClick={() => handleExpand(reportData?.employee)}>
                                            <p>
                                                <img
                                                    src={expandedEmployee === reportData?.employee ? crossButton : ""}
                                                    alt="Toggle"
                                                />
                                                <span>{reportData?.employee}</span></p>
                                        </div>
                                        <div className="durationDiv">
                                            <p>{reportData?.Duration}</p>
                                            <p>{Math.floor(reportData?.Activity)} %</p>
                                        </div>
                                        {expandedEmployee === reportData?.employee && (
                                            <div className="expandedDetails">
                                                {reportData?.projects?.map((project, projectIndex) => (
                                                    <div key={projectIndex} className="projectDetails">
                                                        <p>Project Name: {project.projectname || 'No project name'}</p>
                                                        <p>Duration: {project.hours || 'No duration'}</p>
                                                        {/* <p>{Math.floor(data?.payRate)} %</p> */}
                                                        {console.log("Report Total Hours", project.hours)}
                                                        <p>Activity: {project.activity !== undefined ? Math.floor(project.activity) : 'No activity'} %</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    userType === 'manager' && reportData ? (
                                        <>
                                            {reportData ? (
                                                reportData.allUsers.map((data, index) => (
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <div className="asadMehmoodDiv" key={index}>
                                                            <div onClick={() => handleExpand(data?.employee)}>
                                                                <p><img src={expandedEmployee === reportData?.employee ? crossButton : ""} alt="Toggle" /><span>{data?.employee}</span></p>
                                                            </div>
                                                            <div className="durationDiv">
                                                                <p>{data?.Duration}</p>
                                                                <p>{Math.floor(data?.Activity)} %</p>
                                                                <p>{Math.floor(data?.payRate)} %</p>
                                                            </div>
                                                        </div>
                                                        {expandedEmployee === data?.employee && (
                                                            <div className="expandedDetails">
                                                                {data?.projects?.map((project, projectIndex) => (
                                                                    <div key={projectIndex} className="projectDetails">
                                                                        <p>Project Name: {project.projectname || 'No project name'}</p>
                                                                        <p>Duration: {project.hours || 'No duration'}</p>
                                                                        <p>{Math.floor(project.payRate)} %</p>

                                                                        <p>Activity: {project.activity !== undefined ? Math.floor(project.activity) : 'No activity'} %</p>

                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div>No data available for the manager</div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {/* <div className="container">
                        {reportData && reportData.allUsers ? (
                          reportData.allUsers.map(renderEmployeeData)
                        ) : (
                          <div>No data available</div>
                        )}
                      </div> */}
                                        </>
                                    )
                                )
                            )}
                            {/* {reportData?.allUsers?.map((data, index) => {
              return (
                <div className="asadMehmoodDiv">
                  <div>
                    <p>
                      <img src={addButton} />
                      <span>{data?.employee}</span>
                    </p>
                  </div>
                  <div className="durationDiv">
                    <p>{data?.Duration}</p>
                    <p>{Math.floor(data.Activity)} %</p>
                  </div>
                </div>
              );
            })} */}
                            {/* {filteredData.length > 0 ? (
              filteredData.map((data, index) => {
                return (
                  <div className="asadMehmoodDiv">
                    <div>
                      <p>
                        <img src={addButton} />
                        <span>{data.employee}</span>
                      </p>
                    </div>
                    <div className="durationDiv">
                      <p>{data.Duration}</p>
                      <p>{Math.floor(data.Activity)} %</p>
                    </div>
                  </div>
                );
              })
            ) : (
              reportData?.allUsers?.map((data, index) => {
                return (
                  <div className="asadMehmoodDiv">
                    <div>
                      <p>
                        <img src={addButton} />
                        <span>{data?.employee}</span>
                      </p>
                    </div>
                    <div className="durationDiv">
                      <p>{data?.Duration}</p>
                      <p>{Math.floor(data?.Activity)} %</p>
                    </div>
                  </div>
                );
              })
            )} */}
                            {/* {filteredData.map((data, index) => {
              return (
                <div className="asadMehmoodDiv">
                  <div>
                    <p>
                      <img src={addButton} />
                      <span>{data.employee}</span>
                    </p>
                  </div>
                  <div className="durationDiv">
                    <p>{data.Duration}</p>
                    <p>{Math.floor(data.Activity)} %</p>
                  </div>
                </div>
              );
            })} */}
                            {/* {reportData?.allUsers?.map((data, index) => {
              return (
                <div className="asadMehmoodDiv">
                  <div>
                    {selectedUsers.length === 0 && (
                      <p><img src={addButton} /><span>{data?.employee}</span></p>
                    )}
                  </div>
                  <div className="durationDiv">
                    <p>{data?.Duration}</p>
                    <p>{Math.floor(data?.Activity)} %</p>
                  </div>
                </div>
              )
            })} */}
                        </div>
                    </div>
                </div>
                <img className="admin1Line" src={line} />
            </div >
            {/* <Footer /> */}
        </>
    )
}

export default OwnerReport;