import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import makeAnimated from 'react-select/animated';
import ActivityChart from "../adminScreens/component/ActivityChart";
import SelectBox from "../companyOwner/ownerComponent/selectBox";
import line from "../images/line.webp";
import saveReport from "../images/reportImg.webp";
// import { useQuery } from 'react-query';
import jwtDecode from "jwt-decode";
import { FaMinus, FaPlus } from 'react-icons/fa';
import Joyride from "react-joyride";
import crossButton from "../images/cross.webp";
import EmployeeFilter from "./component/EmployeeFilter";
import ProjectFilter from "./component/ProjectFilter";
// import Footer from '../screen/component/footer'
import { FerrisWheelSpinner } from 'react-spinner-overlay';


function OwnerReport() {

    let token = localStorage.getItem('token');
    const items = jwtDecode(JSON.stringify(token));
    const [run, setRun] = useState(true);
    const [stepIndex, setStepIndex] = useState(0);
    const year = new Date().getFullYear()
    const isFetchingRef = useRef(false);
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
    const [inputValue, setInputValue] = useState('');
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
    const handleSelectUsers = (selectedOptions) => {
        console.log("selectedOptions", selectedOptions);

        const selectedUserMap = new Map();

        selectedOptions.forEach(option => {
            if (option.isGroup) {
                // Group selected – expand into users
                const groupMembers = user.filter(u => option.allowedEmployees.includes(u.id));
                groupMembers.forEach(member => {
                    if (!selectedUserMap.has(member.id)) {
                        selectedUserMap.set(member.id, member);
                    }
                });
            } else {
                // Individual user selected
                if (!selectedUserMap.has(option.id)) {
                    selectedUserMap.set(option.id, option);
                }
            }
        });

        const selectedUsers = Array.from(selectedUserMap.values());

        setSelectedUsers(selectedUsers);
        const userIds = selectedUsers.map((user) => user.id);
        setEmployeeId(userIds);

        // Calculate total hours of selected users
        const totalHours = selectedUsers.reduce(
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

        const newHours = existingHours + totalHours.hours;
        const newMinutes = existingMinutes + totalHours.minutes;

        const totalActivity = selectedUsers.reduce((acc, user) => {
            const activity = user.activity || 0;
            const projectActivity = user.projects?.reduce((a, p) => a + (p.projectActivity || 0), 0) || 0;
            return acc + activity + projectActivity;
        }, 0);

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

        console.log("Final Report Data", reportData);
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
    const [Usergroups, setUsergroups] = useState([]);
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

            // 🚀 API Call using PATCH
            const response = await axios.patch(url, {}, { headers });

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

                // 🚀 If `PATCH` fails, try `POST`
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


    const getEmployees = async () => {
        try {
            let employees = [];
            let groups = [];

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
                const url = `${apiUrl}/owner/getEmployees`;

                const response = await axios.get(url, { headers });

                if (response.status === 200) {
                    employees = response.data.employees;
                    groups = response.data.groupsData;

                    if (user !== "admin" && user !== "owner") {
                        const userByEmail = employees.find(employee => items.email === employee.email);
                        employees = userByEmail ? [userByEmail] : [];
                    }
                }
            }

            setUsergroups(groups);
            setUsers(employees);
        } catch (error) {
            console.log("Error fetching employees:", error);
        }
    };



    useEffect(() => {
        getEmployees();
    }, []);


    useEffect(() => {
        if (!startDate || !endDate || isFetchingRef.current) return;

        isFetchingRef.current = true;

        const fetch = async () => {
            if (userType === "user" && employeeId) {
                await getUserReports();
            } else {
                await getReports();
            }
            isFetchingRef.current = false;
        };

        fetch();
    }, [startDate, endDate, employeeId, userType]);

    const getUserReports = async () => {
        setLoading(true); // Start the loader

        try {
            // Format start and end dates
            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);

            // Construct the API URL with the formatted dates
            const url = `${apiUrl}/timetrack/day?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

            console.log("🔗 User API Request URL:", url);

            // Send a PATCH request with the headers
            const response = await axios.patch(url, { headers });

            // Check for a successful response and handle it
            if (response.status === 200) {
                console.log("✅ User API Response:", response.data);
                setReportData(response.data.data); // Set the report data
            } else {
                throw new Error("Failed to fetch reports");
            }
        } catch (err) {
            console.error("🚨 User API Error:", err);
        } finally {
            setLoading(false); // Stop the loader regardless of success or failure
        }
    };


    const getReports = async () => {
        if (!startDate || !endDate) {
            console.log("🚨 Error: Start Date or End Date is missing!");
            return;
        }

        setLoading(true); // Start the loader

        try {
            // Format start and end dates to 'YYYY-MM-DD' format
            const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
            const formattedEndDate = new Date(endDate).toISOString().split("T")[0];

            console.log("📅 Start Date:", formattedStartDate);
            console.log("📅 End Date:", formattedEndDate);

            // Construct the URL based on user type and date range
            let url = "";
            if (userType === "admin" || userType === "owner") {
                url = `${apiUrl}/owner/day?startDate=${formattedStartDate}&endDate=${formattedEndDate}&userId=${employeeId}`;
            } else if (userType === "manager") {
                url = `${apiUrl}/manager/day?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
            } else {
                url = `${apiUrl}/timetrack/day?startDate=${formattedStartDate}&endDate=${formattedEndDate}&userId=${employeeId}`;
            }

            console.log("🔗 API Request URL:", url);

            // Send a PATCH request with the headers
            const response = await axios.patch(url, {}, { headers });

            if (response.status === 200) {
                console.log("✅ API Response:", response.data);
                setReportData(response.data.data); // Set the report data
            } else {
                throw new Error('Failed to fetch reports');
            }
        } catch (err) {
            console.error("🚨 API Error:", err);
        } finally {
            setLoading(false); // Stop the loader
        }
    };


    const fetchDailyReports = async (type) => {
        setLoading(true); // ✅ Start loader

        try {
            let response;
            const body = {}; // Optional body payload
            let url = "";

            if (userType === 'admin' || userType === 'owner') {
                url = employeeId
                    ? `${apiUrl}/owner/day?daySpecifier=${type}&userId=${employeeId}`
                    : `${apiUrl}/owner/day?daySpecifier=${type}`;
            } else if (userType === 'manager') {
                url = employeeId
                    ? `${apiUrl}/manager/day?daySpecifier=${type}&userId=${employeeId}`
                    : `${apiUrl}/manager/day?daySpecifier=${type}`;
            } else {
                url = `${apiUrl}/timetrack/day?daySpecifier=${type}&userId=${items._id}`;
            }

            console.log("🔗 Daily API URL:", url);

            // 🚀 Make PATCH request
            response = await axios.patch(url, body, { headers });

            if (response.status === 200) {
                console.log("✅ Daily Report Response:", response);
                setReportData(response.data.data); // Set report data
                return response.data.data;
            } else {
                throw new Error('Failed to fetch daily reports');
            }
        } catch (error) {
            console.error("🚨 Daily Report API Error:", error); // Handle errors
        } finally {
            setLoading(false); // ✅ Stop loader regardless of success/failure
        }
    };


    const fetchYearlyReports = async (type) => {
        setLoading(true); // ✅ Start loader

        try {
            let response;
            const config = { headers }; // Ensure headers are passed correctly

            if (userType === 'admin' || userType === 'owner') {
                if (employeeId) {
                    response = await axios.patch(
                        `${apiUrl}/owner/year?yearSpecifier=${type}&userId=${employeeId}`,
                        {}, // PATCH request body (empty object if not sending data)
                        config
                    );
                } else {
                    response = await axios.patch(
                        `${apiUrl}/owner/year?yearSpecifier=${type}`,
                        {}, // PATCH request body (empty object if not sending data)
                        config
                    );
                }
            } else if (userType === 'manager') {
                if (employeeId) {
                    response = await axios.patch(
                        `${apiUrl}/manager/year?yearSpecifier=${type}&userId=${employeeId}`,
                        {}, // PATCH request body (empty object if not sending data)
                        config
                    );
                } else {
                    response = await axios.patch(
                        `${apiUrl}/manager/year?yearSpecifier=${type}`,
                        {}, // PATCH request body (empty object if not sending data)
                        config
                    );
                }
            } else {
                response = await axios.patch(
                    `${apiUrl}/timetrack/year?yearSpecifier=${type}&userId=${items._id}`,
                    {}, // PATCH request body (empty object if not sending data)
                    config
                );
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
        setLoading(true); // ✅ Start loader

        try {
            let response;
            const body = {}; // Optional body payload
            let url = "";

            // Handle different user types and construct the appropriate URL
            if (userType === 'admin' || userType === 'owner') {
                url = employeeId
                    ? `${apiUrl}/owner/week?weekSpecifier=${type}&userId=${employeeId}`
                    : `${apiUrl}/owner/week?weekSpecifier=${type}`;
            } else if (userType === 'manager') {
                url = employeeId
                    ? `${apiUrl}/manager/week?weekSpecifier=${type}&userId=${employeeId}`
                    : `${apiUrl}/manager/week?weekSpecifier=${type}`;
            } else {
                url = `${apiUrl}/timetrack/week?weekSpecifier=${type}&userId=${items._id}`;
            }

            console.log("🔗 Weekly API URL:", url);

            // 🚀 PATCH request with body and headers
            response = await axios.patch(url, body, { headers });

            // Check response status
            if (response.status === 200) {
                console.log("✅ Weekly Report Response:", response);
                setReportData(response.data.data); // Set report data
                return response.data.data;
            } else {
                throw new Error('Failed to fetch weekly reports');
            }
        } catch (error) {
            console.error("🚨 Weekly Report API Error:", error); // Handle errors
        } finally {
            setLoading(false); // ✅ Stop loader regardless of success/failure
        }
    };

    const Notessearch = async (type, note) => {
        setLoading(true); // ✅ Start loader
        console.log('Request Headers:', headers); // Log headers to check if they're correct

        try {
            let response;
            const body = { notes: note }; // Send the note as { notes: "data from the input" }

            // Define the appropriate URL based on user type
            let url = '';
            if (userType === 'admin' || userType === 'owner') {
                url = `${apiUrl}/owner/year?yearSpecifier=${type}`;
            } else if (userType === 'manager') {
                url = `${apiUrl}/manager/year?yearSpecifier=${type}`;
            } else {
                url = `${apiUrl}/timetrack/year?yearSpecifier=${type}&userId=${items._id}`;
            }

            // Log the final URL for debugging
            console.log("API Request URL:", url);

            // 🚀 Make the PATCH request
            response = await axios.patch(url, body, { headers }); // Sending body and headers

            if (response.status === 200) {
                console.log(response); // Check response
                setReportData(response.data.data); // Set report data
                return response.data.data;
            } else {
                throw new Error('Failed to fetch reports');
            }
        } catch (error) {
            console.error("Yearly Report API Error:", error); // Handle errors
        } finally {
            setLoading(false); // ✅ Stop loader regardless of success/failure
        }
    };


    const getMonthlyReports = async (type) => {
        setLoading(true); // ✅ Start loader

        let response;
        const body = {}; // You can add additional data to the body if required.

        try {
            // URL Construction based on user type and employeeId
            let url = '';
            if (userType === 'admin' || userType === 'owner') {
                if (employeeId) {
                    url = `${apiUrl}/owner/month?monthSpecifier=${type}&userId=${employeeId}`;
                } else {
                    url = `${apiUrl}/owner/month?monthSpecifier=${type}`;
                }
            } else if (userType === 'manager') {
                if (employeeId) {
                    url = `${apiUrl}/manager/month?monthSpecifier=${type}&userId=${employeeId}`;
                } else {
                    url = `${apiUrl}/manager/month?monthSpecifier=${type}`;
                }
            } else {
                url = `${apiUrl}/owner/month?monthSpecifier=${type}&userId=${items._id}`;
            }

            console.log("API Request URL:", url); // Log the URL for debugging

            // Sending PATCH request with URL, body, and headers
            response = await axios.patch(url, body, { headers });

            // Handling the response
            if (response.status === 200) {
                console.log(response); // Check response
                setReportData(response.data.data); // Set report data
                return response.data.data;
            } else {
                throw new Error('Failed to fetch reports');
            }
        } catch (error) {
            console.error("Monthly Report API Error:", error); // Handle errors
        } finally {
            setLoading(false); // ✅ Stop loader regardless of success/failure
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

        const userDuration = user.duration ?? 0;
        const userActivity = user.activity ?? 0;

        // Match user to groups based on allowedEmployees
        const userGroups = Usergroups?.filter(group =>
            group.allowedEmployees.includes(user._id)
        ).map(group => ({
            groupId: group._id,
            groupName: group.name,
        })) || [];

        return {
            label: user.name,
            value: user.email,
            id: user._id,
            duration: userDuration + totalProjectHours,
            activity: userActivity + totalProjectActivity,
            groups: userGroups, // added group info
            projects: user.projects?.map(project => ({
                projectname: project.projectname,
                projectHours: `${Math.floor(project.projectHours || 0)}h ${(project.projectHours || 0) % 1 * 60}m`,
                projectActivity: Math.floor(project.projectActivity || 0),
            })),
        };
    });
    const groupOptions = Usergroups?.map(group => ({
        label: `👥 ${group.name}`, // Group emoji before name
        value: `group-${group._id}`,
        id: group._id,
        isGroup: true,
        allowedEmployees: group.allowedEmployees,
    })) || [];

    const defaultValue = user.length > 0 ? [{ value: user[0].value }] : [];

    const allUsers = [...user, ...groupOptions];

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
    const handleSearch = () => {
        const type = 'this'; // Set the type as per your requirement
        Notessearch(type, inputValue);
        console.log("handleSearch called with inputValue:", inputValue);
    };
    const handleFilteredUsers = useCallback((filteredUsers) => {
        const transformedUsers = transformEmployeeData(filteredUsers);

        // Avoid re-updating if identical users
        const userIds = transformedUsers.map(u => u.id).sort().join(",");
        const prevUserIds = selectedUser.map(u => u.id).sort().join(",");

        if (userIds !== prevUserIds) {
            handleSelectUsers(transformedUsers);
        }
    }, [selectedUser]);

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
                                        onFilter={handleFilteredUsers}
                                        showLabel={false}
                                    />

                                </div>
                            </div>

                            {userType !== 'user' && (
                                <div className="crossButtonDiv">
                                    <p className="settingScreenshotIndividual"> Select user</p>
                                    <SelectBox
                                        onChange={(e) => handleSelectUsers(e)}
                                        options={allUsers
                                            .filter(user => user.label)
                                            .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
                                        }
                                        closeMenuOnSelect={true}
                                        components={animatedComponents}
                                        defaultValue={defaultValue}
                                        isMulti={true}
                                    />
                                    {console.log("User Details", allUsers)}
                                </div>
                            )}

                            <ProjectFilter usersData={reportData} onProjectDataFetched={handleProjectDataFetched} />
                            <div style={{ padding: '2px', fontFamily: 'sans-serif', marginTop: '20px' }}>
                                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#003e6b', marginBottom: '16px' }}>
                                    Notes filter
                                </h2>

                                <div
                                    style={{
                                        position: 'relative',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Type notes here"
                                        style={{
                                            width: '100%',
                                            padding: '16px 50px 16px 16px', // extra right padding for button space
                                            fontSize: '16px',
                                            color: '#666',
                                            border: 'none',
                                            outline: 'none',
                                            backgroundColor: 'transparent',
                                        }}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSearch(); // Call your search function
                                            }
                                        }}
                                    />

                                    <button
                                        onClick={handleSearch} // Trigger search on button click
                                        style={{
                                            position: 'absolute',
                                            right: '8px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            backgroundColor: '#7ACB59',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '8px 12px',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>

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