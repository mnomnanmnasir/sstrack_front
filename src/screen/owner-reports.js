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
import Joyride from "react-joyride";
import TimezoneSelect from "react-timezone-select";
import { Center } from "devextreme-react/cjs/map";
import UserTimezoneDropdown from "./component/UserTimezoneDropdown";
import EmployeeFilter from "./component/EmployeeFilter";
import { CodeStarNotifications } from "aws-sdk";
import ProjectFilter from "./component/ProjectFilter";
// import Footer from '../screen/component/footer'
import { FerrisWheelSpinner } from 'react-spinner-overlay';


function OwnerReport() {

    let token = localStorage.getItem('token');
    const items = jwtDecode(JSON.stringify(token));
    const [run, setRun] = useState(true);
    const [stepIndex, setStepIndex] = useState(0);
    const year = new Date().getFullYear()
    // let token = localStorage.getItem('token');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [employeeId, setEmployeeId] = useState(null);
    // const [employeeId, setEmployeeId] = useState(items?._id || null);
    const [managerId, setManagerId] = useState(null);
    const [reportType, setReportType] = useState("daily"); // Added to store the report type
    const [userType, setUserType] = useState(items?.userType || 'user');
    const [selectedTimezone, setSelectedTimezone] = useState(
        null
    );
    const handleTimezoneChange = (selectedOption, usersByTimezone) => {
        setSelectedTimezone(selectedOption);

        // Log the users for the selected timezone
        console.log(`Users in ${selectedOption?.value}:`, usersByTimezone[selectedOption?.value]);
    };
    const [expandedEmployee, setExpandedEmployee] = useState(null);
    const steps = [
        {
            target: '#activityChart',
            content: 'here you can see your activity chart',
            // disableBeacon: true,
            continuous: true,
        },
        {
            target: '#times',
            content: 'here you can choose filter and select the range of dates',
        },
        {
            target: '#indivisualUser',
            content: 'here you can see reports of each indivisual users',
        },


    ];
    const handleJoyrideCallback = (data) => {
        const { action, index, status } = data;

        if (action === "next") {
            setStepIndex(index + 1);
        }
        if (status === "finished" || status === "skipped") {
            setRun(false); // End the tour when finished
        }
    };
    const handleExpand = (employee) => {
        if (expandedEmployee === employee) {
            setExpandedEmployee((prevExpanded) => (prevExpanded === employee ? null : employee));

        } else {
            setExpandedEmployee(employee); // Expand if not expanded
        }
    };

    const [selectedUser, setSelectedUsers] = useState([]);

    // const handleSelectUsers = (e) => { setSelectedUsers(e); const userIds = e.map(user => user.id); setEmployeeId(userIds);
    // }
    const handleSelectUsers = (selectedUsers) => {
        console.log("selectedUsers", selectedUsers);

        setSelectedUsers(selectedUsers);
        const userIds = selectedUsers?.map((user) => user.id);
        setEmployeeId(userIds);

        // Calculate total hours of selected users
        const totalHours = selectedUsers?.reduce(
            (acc, user) => {
                const hours = acc.hours + Math.floor(user.totalHours || 0);
                const minutes = acc.minutes + ((user.totalHours || 0) % 1) * 60;
                return { hours, minutes: minutes % 60 };
            },
            { hours: 0, minutes: 0 }
        );

        // Check if reportData is null or undefined
        if (!reportData || !reportData.totalHours) {
            console.warn("reportData is null or totalHours is missing. Initializing default values.");
            setReportData({
                totalHours: "0h 0m",
                totalActivity: "0",
                allUsers: [],
            });
            return;
        }

        // Parse existing totalHours value safely
        const [existingHours, existingMinutes] = reportData.totalHours
            ? reportData.totalHours.split("h ").map((val) => parseInt(val.replace("m", ""), 10))
            : [0, 0];

        // Calculate new total hours
        const newHours = existingHours + totalHours.hours;
        const newMinutes = existingMinutes + totalHours.minutes;

        const totalActivity = 0;

        // Update reportData state with total hours of selected users
        setReportData({
            ...reportData,
            totalHours:
                selectedUsers.reduce((acc, user) => {
                    let totalUserHours = 0;
                    if (user.projects && Array.isArray(user.projects)) {
                        totalUserHours = user.projects.reduce((acc, project) => acc + (project.projectHours || 0), 0);
                    }
                    totalUserHours += user.duration || 0;
                    return acc + totalUserHours;
                }, 0) > 0
                    ? `${Math.floor(totalHours.hours)}h ${totalHours.minutes}m`
                    : "0h 0m",
            totalActivity:
                selectedUsers.length > 0
                    ? `${Math.floor(totalActivity / selectedUsers.length)}`
                    : "0",
            allUsers: selectedUsers.map((user) => {
                let totalProjectHours = 0;
                let totalProjectActivity = 0;
                let projects = [];

                if (user.projects && Array.isArray(user.projects)) {
                    user.projects.forEach((project) => {
                        totalProjectHours += project.projectHours || 0;
                        totalProjectActivity += project.projectActivity || 0;
                        projects.push({
                            projectname: project.projectname,
                            projectHours: `${Math.floor(project.projectHours || 0)}h ${((project.projectHours || 0) % 1) * 60}m`,
                            projectActivity: Math.floor(project.projectActivity || 0),
                        });
                    });
                }

                totalProjectHours += user.duration || 0;
                totalProjectActivity += user.activity || 0;

                return {
                    employee: user.label,
                    Duration: `${Math.floor(totalProjectHours)}h ${(totalProjectHours % 1) * 60}m`,
                    Activity:
                        user.projects && Array.isArray(user.projects)
                            ? Math.floor(totalProjectActivity / (user.projects.length || 1))
                            : 0,
                    projects: projects,
                };
            }),
        });

        console.log("Set Report Data", reportData);
    };






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
        if (!startDate || !endDate) {
            console.error("🚨 Error: Start Date or End Date is missing!");
            return;
        }

        setLoading(true);

        try {
            // 🛠 Ensure dates are properly formatted
            const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
            const formattedEndDate = new Date(endDate).toISOString().split("T")[0];

            // 🔗 Initialize URL Variable (IMPORTANT)
            let url = ""; // ✅ Ensure URL is always defined

            // 🔗 Construct API URL based on User Type
            if (userType === "admin" || userType === "owner") {
                url = `${apiUrl}/owner/day?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
                if (employeeId) {
                    url += `&userId=${Array.isArray(employeeId) ? employeeId.join(",") : employeeId}`;
                }
            } else if (userType === "manager") {
                url = `${apiUrl}/manager/day?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
            } else {
                url = `${apiUrl}/timetrack/day?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
                if (employeeId) {
                    url += `&userId=${Array.isArray(employeeId) ? employeeId.join(",") : employeeId}`;
                }
            }

            // ✅ Debugging Logs
            console.log("🔗 API Request URL:", url);
            console.log("👤 User Type:", userType);
            console.log("📅 Formatted Dates:", { formattedStartDate, formattedEndDate });

            // 🛠 Ensure headers are correctly set
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("🚨 No Token Found!");
                return;
            }
            let headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            };
            console.log("🛠 Headers:", headers);

            // 🚀 Ensure URL is not empty before calling API
            if (!url) {
                console.error("🚨 Error: API URL is empty! Cannot make a request.");
                return;
            }

            // 🚀 API Call using GET
            const response = await axios.get(url, { headers });

            // 🛠 Check API Response
            if (response && response.status === 200) {
                console.log("✅ API Response:", response.data);
                if (!response.data || Object.keys(response.data).length === 0) {
                    console.warn("⚠️ Warning: API Response is empty!");
                }
                setReportData(response.data?.data);
            } else {
                console.error("⚠️ API returned a non-200 status:", response.status);
            }
        } catch (error) {
            console.error("🚨 API Error:", error);

            if (error.response) {
                console.error("📌 Response Data:", error.response.data);
                console.error("📌 Status Code:", error.response.status);
                console.error("📌 Headers:", error.response.headers);

                // 🚀 If `GET` fails, try `POST`
                if (error.response.status === 405 || error.response.status === 400) {
                    try {
                        let url = ""; // ✅ Ensure URL is always defined
                        console.log("🔄 Trying API with POST...");
                        const response = await axios.post(url, {}, { headers });
                        if (response.status === 200) {
                            console.log("✅ API Response (POST):", response.data);
                            setReportData(response.data?.data);
                        }
                    } catch (postError) {
                        console.error("🚨 POST API Error:", postError);
                    }
                }

            } else if (error.request) {
                console.error("📌 No Response from API:", error.request);
            } else {
                console.error("📌 General Error:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };


    const handleProjectDataFetched = (data) => {
        if (data === undefined) {
            console.log("No project selected.");
            fetchYearlyReports("this") // Or an empty array [] based on your needs
        } else {
            console.log("Received Data from ProjectFilter:", data);
            setReportData(data.data);
        }
    };
    useEffect(() => {
        if (startDate && endDate) {
            getData();
        }
    }, [startDate, endDate, employeeId,]);

    const animatedComponents = makeAnimated();

    const formatDate = (date) => {
        if (!date) return ""; // Agar date undefined ya null ho to empty string return karein
        return date.toISOString().split("T")[0]; // YYYY-MM-DD format
    };

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
            let employees = [];

            const user = items?.userType || "user"; // Assuming userType is stored in localStorage
            setUserType(user);

            if (user === "manager") {
                try {
                    employees = await getManagerEmployees();
                } catch (error) {
                    console.log("Error fetching manager employees:", error);
                    return;
                }
            } else {
                const response = await axios.get(`${apiUrl}/owner/companies`, { headers });
                if (response.status === 200) {
                    employees = response.data.employees;

                    if (user !== "admin" && user !== "owner") {
                        const userByEmail = employees.find(employee => items.email === employee.email);
                        employees = userByEmail ? [userByEmail] : [];
                    }
                }
            }

            setUsers(employees);
        } catch (error) {
            console.log("Error fetching employees:", error);
        }
    };



    useEffect(() => {
        getEmployess();
    }, []);


    useEffect(() => {
        if (!startDate || !endDate) {
            return; // Agar date select nahi hui to API call na ho
        }

        console.log("🟢 Checking API conditions:");
        console.log("👤 User Type:", userType);
        console.log("📅 Start Date:", startDate);
        console.log("📅 End Date:", endDate);
        console.log("🔍 Employee ID:", employeeId);

        if (userType === "user" && employeeId) {
            // Sirf normal user login kare to ye API call ho
            getUserReports();
        } else {
            // Baqi admin, owner aur manager kay liye purani API chalayein
            getReports();
        }
    }, [startDate, endDate, employeeId, userType]);

    const getUserReports = async () => {
        setLoading(true);

        try {
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);

            const url = `${apiUrl}/timetrack/day?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

            console.log("🔗 User API Request URL:", url);

            const response = await axios.get(url, { headers });

            if (response.status === 200) {
                console.log("✅ User API Response:", response.data);
                setReportData(response.data.data);
            }
        } catch (err) {
            console.error("🚨 User API Error:", err);
        }

        setLoading(false);
    };


    const getReports = async () => {
        if (!startDate || !endDate) {
            console.log("🚨 Error: Start Date or End Date is missing!");
            return;
        }

        setLoading(true);
        try {
            // const formattedStartDate = formatDate(startDate);
            // const formattedEndDate = formatDate(endDate);
            const formattedStartDate = new Date(startDate).toISOString().split("T")[0]; // YYYY-MM-DD
            const formattedEndDate = new Date(endDate).toISOString().split("T")[0]; // YYYY-MM-DD

            console.log("📅 Start Date:", formattedStartDate);
            console.log("📅 End Date:", formattedEndDate);

            let url = "";
            if (userType === "admin" || userType === "owner") {
                url = `${apiUrl}/owner/day?startDate=${formattedStartDate}&endDate=${formattedEndDate}&userId=${employeeId}`;
            } else if (userType === "manager") {
                url = `${apiUrl}/manager/day?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
            } else {
                url = `${apiUrl}/timetrack/day?startDate=${formattedStartDate}&endDate=${formattedEndDate}&userId=${employeeId}`;
            }

            console.log("🔗 API Request URL:", url);

            const response = await axios.get(url, { headers });

            if (response.status === 200) {
                console.log("✅ API Response:", response.data);
                setReportData(response.data.data);
            }
        } catch (err) {
            console.error("🚨 API Error:", err);
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
        setLoading(true); // ✅ Start loader

        try {
            let response;
            if (userType === 'admin' || userType === 'owner') {
                if (employeeId) {
                    response = await axios.get(`${apiUrl}/owner/year?yearSpecifier=${type}&userId=${employeeId}`, { headers });
                } else {
                    response = await axios.get(`${apiUrl}/owner/year?yearSpecifier=${type}`, { headers });
                }
            } else if (userType === 'manager') {
                if (employeeId) {
                    response = await axios.get(`${apiUrl}/manager/year?yearSpecifier=${type}&userId=${employeeId}`, { headers });
                } else {
                    response = await axios.get(`${apiUrl}/manager/year?yearSpecifier=${type}`, { headers });
                }
            } else {
                response = await axios.get(`${apiUrl}/timetrack/year?yearSpecifier=${type}&userId=${items._id}`, { headers });
            }

            if (response.status === 200) {
                console.log(response);
                setReportData(response.data.data);
                return response.data.data;
            } else {
                throw new Error('Failed to fetch reports');
            }
        } catch (error) {
            console.error("Yearly Report API Error:", error);
        } finally {
            setLoading(false); // ✅ Stop loader regardless of success/failure
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


    const defaultValue = user.length > 0 ? [{ value: user[0].value }] : [];

    // console.log(dateFilter);


    const allUsers = user; // assuming 'user' is the original array of users
    const filteredUsers = user.filter(user => user.value !== null);

    const transformEmployeeData = (employees) => {
        return employees.map(employee => ({
            label: `${employee.name} (admin)`, // Adjust role if needed
            value: employee.email,
            id: employee._id,
            duration: 0, // Default value, adjust as needed
            activity: 0  // Default value, adjust as needed
        }));
    };
    const [projectData, setProjectData] = useState(null);


    return (
        <>
            {/* <UserHeader /> */}
            {items?._id === "679b223b61427668c045c659" && (
                <Joyride
                    steps={steps}
                    run={run}
                    callback={handleJoyrideCallback}
                    showProgress
                    showSkipButton
                    continuous
                    scrollToFirstStep
                />
            )}
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

                                <div id='times' className="calenderInnerDiv">
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
                                    <EmployeeFilter
                                        employees={users}
                                        onFilter={(filteredUsers) => {
                                            const transformedUsers = transformEmployeeData(filteredUsers);
                                            handleSelectUsers(transformedUsers);
                                            console.log('datafromdrop', transformedUsers);
                                        }}
                                        showLabel={false}
                                    />

                                </div>
                            </div>

                            <div className="crossButtonDiv">
                                <p className="settingScreenshotIndividual"> Select user</p>
                                <SelectBox
                                    onChange={(e) =>
                                        // console.log('chekkking123', e)
                                        handleSelectUsers(e)
                                    }
                                    options={allUsers
                                        .filter(user => user.label)
                                        .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
                                    }
                                    closeMenuOnSelect={true}
                                    components={animatedComponents}
                                    defaultValue={defaultValue}
                                    isMulti={true}

                                />
                                {console.log("User Detials", allUsers)}
                            </div>
                            <ProjectFilter usersData={reportData} onProjectDataFetched={handleProjectDataFetched} />
                            <div>

                            </div>

                            <div id="activityChart" className="adminReport4" style={{ backgroundColor: '#F5F5F5' }}>
                                {loading ? (
                                    <div className="loader" style={{ textAlign: "center" }}>
                                        {/* <img src={loader} alt="Loading..." width={40} /> */}
                                        <FerrisWheelSpinner size={20} color="#fff" />
                                    </div>
                                ) : reportData ? (
                                    <>
                                        <div>
                                            <p className="sixtyhour">{reportData?.totalHours || "0h 0m"}</p>
                                            <p className="report-percentage">{`${Math.floor(reportData?.totalActivity || 0)} %`}</p>

                                            <p className="report-percentage">
                                                {`$${reportData?.allUsers
                                                    ? Math.floor(reportData.allUsers.reduce((acc, user) => acc + (user.payRate?.usdAmount || 0), 0))
                                                    : 0
                                                    } `}
                                            </p>

                                            {console.log("reportData", reportData)}
                                        </div>
                                        <div className="summaryDiv">
                                            <ActivityChart reportData={reportData} />
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>No report data available.</p>
                                )}
                            </div>

                            <div id="indivisualUser">
                                <div className="employeeDiv">
                                    <p>{"± Employees / ± Projects"}</p>
                                    <div className="durationDiv">
                                        <p>Duration</p>
                                        <p>Activity</p>
                                        <p>PayRate</p>

                                    </div>
                                </div>
                                {reportData && reportData.allUsers ? (
                                    reportData.allUsers.map((data, index) => (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div className="asadMehmoodDiv" key={index}>
                                                <div onClick={() => handleExpand(data?.employee)}>
                                                    <p>
                                                        {/* <FaPlus /> Add */}
                                                        <p>{expandedEmployee === data?.employee ? <FaMinus /> : <FaPlus />}

                                                            <span>{data?.employee}</span>
                                                        </p>
                                                    </p>
                                                </div>

                                                <div className="durationDiv">
                                                    <p>{data?.Duration}</p>
                                                    <p>{Math.floor(data?.Activity)} %</p>
                                                    <p>${Math.floor(data?.payRate?.usdAmount)} </p>

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
                                                                    <p>${Math.floor(project.payRate?.usdAmount)}</p>
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
                                                            <p>${Math.floor(project.payRate)} %</p>

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
                                                                            <p>${Math.floor(project.payRate)} </p>

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

                                            </>
                                        )
                                    )
                                )}
                            </div>


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