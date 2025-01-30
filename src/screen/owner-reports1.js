
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

function OwnerReport() {

    const year = new Date().getFullYear()
    let token = localStorage.getItem('token');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [employeeId, setEmployeeId] = useState(null);
    const [managerId, setManagerId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);


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
    // const items = JSON.parse(localStorage.getItem('items'));
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

    const getData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/timetrack/totalDate?startDate=${new Date(startDate).toLocaleDateString()}&endDate=${new Date(endDate).toLocaleDateString()}`, { headers })
            if (response.status === 200) {
                console.log(response);
                setLoading(false)
                setReportData(response.data?.data)
            }
        }
        catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    useEffect(() => {
        if (startDate && endDate) {
            getData();
        }
    }, [startDate, endDate]);

    const animatedComponents = makeAnimated();
    const [userType, setUserType] = useState(""); // Added to store the user type




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



    const getReports = async () => {
        setLoading(true);
        try {
            let response;
            if (userType === 'admin' || userType === 'owner') {
                // Fetch reports for all users
                response = await axios.get(`${apiUrl}/timetrack/totalDate?startDate=${new Date().toLocaleDateString()}&endDate=${new Date().toLocaleDateString()}`, { headers });
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
                response = await axios.get(`${apiUrl}/timetrack/totalDate?startDate=${new Date().toLocaleDateString()}&endDate=${new Date().toLocaleDateString()}&userId=${items._id}`, { headers });
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

    const getDailyReports = async (type) => {
        setLoading(true);
        try {
            let response;
            if (userType === 'admin' || userType === 'owner') {
                response = await axios.get(`${apiUrl}/owner/timetrack/day?daySpecifier=${type}`, { headers });
            } else {
                response = await axios.get(`${apiUrl}/owner/timetrack/day?daySpecifier=${type}&userId=${items._id}`, { headers });
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



    const getWeeklyReports = async (type) => {
        setLoading(true);
        try {
            let response;
            if (userType === 'admin' || userType === 'owner') {
                response = await axios.get(`${apiUrl}/owner/week?weekSpecifier=${type}`, { headers });
            } else if (userType === 'manager') {
                response = await axios.get(`${apiUrl}/manager/week?weekSpecifier=${type}`, { headers });
            }
            else {
                response = await axios.get(`${apiUrl}/owner/week?weekSpecifier=${type}&userId=${items._id}`, { headers });
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

    const getMonthlyReports = async (type) => {
        setLoading(true);
        try {
            let response;
            if (userType === 'admin' || userType === 'owner') {
                response = await axios.get(`${apiUrl}/owner/month?monthSpecifier=${type}`, { headers });
            } else if (userType === 'manager') {
                response = await axios.get(`${apiUrl}/manager/month?monthSpecifier=${type}`, { headers });
            }
            else {
                response = await axios.get(`${apiUrl}/owner/month?monthSpecifier=${type}&userId=${items._id}`, { headers });
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

    const getYearlyReports = async (type) => {
        setLoading(true);
        try {
            let response;
            if (userType === 'admin' || userType === 'owner') {
                response = await axios.get(`${apiUrl}/owner/year?yearSpecifier=${type}`, { headers });
            }
            else if (userType === 'manager') {
                response = await axios.get(`${apiUrl}/manager/year?yearSpecifier=${type}&managerId=${items._id}`, { headers });
            }
            else {
                response = await axios.get(`${apiUrl}/owner/year?yearSpecifier=${type}&userId=${items._id}`, { headers });
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


    useEffect(() => {
        dateFilter?.today === true ? getDailyReports("this") :
            dateFilter?.yesterday === true ? getDailyReports("previous") :
                dateFilter?.thisWeek === true ? getWeeklyReports("this") :
                    dateFilter?.lastWeek === true ? getWeeklyReports("previous") :
                        dateFilter?.thisMonth === true ? getMonthlyReports("this") :
                            dateFilter?.lastMonth === true ? getMonthlyReports("previous") :
                                dateFilter?.thisYear === true ? getYearlyReports("this") :
                                    dateFilter?.lastYear === true ? getYearlyReports("previous") :
                                        getReports()
    }, [employeeId, dateFilter, managerId, userType])

    // const user = users?.map(user => ({ label: user.email, value: user.email, id: user._id }))
    // const defaultValue = user.length > 0 ? [{ value: user[0].value }] : [];

    console.log(dateFilter);


    const handleEmailSelect = (email) => {
        console.log("Selected email:", email);

        const user = users.find(user => user.email === email);

        if (user) {
            console.log("Selected user:", user);

            const duration = user.Duration ? user.Duration : 0;
            const activity = user.Activity ? user.Activity : 0;

            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            const formattedDuration = `${hours}h ${minutes}m`;

            console.log("Formatted Duration:", formattedDuration);
            console.log("Activity:", activity);

            setSelectedUser({
                ...user,
                totalHours: formattedDuration,
                Activity: Math.ceil(activity),
            });
        } else {
            console.log("User not found");
            setSelectedUser(null);
        }
    };



    const user = users.map(user => ({ label: user.email, value: user.email, id: user._id }))
    const defaultValue = users.length > 0 ? [{ value: user[0].value }] : [];

    console.log(dateFilter);

    const renderUserDetails = () => {
        if (!selectedUser) return null;

        const { name, totalHours, Activity } = selectedUser;
        console.log("Rendering user details:", selectedUser);

        return (
            <div className="asadMehmoodDiv">
                <div>
                    <p><img src={addButton} alt="Add" /><span>{name}</span></p>
                </div>
                <div className="durationDiv">
                    <p>{totalHours}</p>
                    <p>{`${Activity} %`}</p>
                </div>
            </div>
        );
    };


    return (
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
                                    <div> <button> <DatePicker placeholderText={new Date().toLocaleDateString()} className="bg-transparent border-0 text-center " selected={startDate} onChange={date => setStartDate(date)} /></button>
                                    </div>
                                    <div>  ►  </div>
                                    <div>
                                        <button>  <DatePicker placeholderText={new Date().toLocaleDateString()} className="bg-transparent border-0 text-center " selected={endDate} onChange={date => setEndDate(date)} /></button>
                                    </div>
                                </div>
                                <div className="dayDiv">
                                    <div className="summaryTodayDiv">
                                        <p
                                            onClick={() => {
                                                getDailyReports("this")
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
                                                getDailyReports("previous")
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
                                                getYearlyReports("this")
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
                                                getYearlyReports("previous")
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
                                onChange={(selectedOption) => handleEmailSelect(selectedOption.value)}
                                options={users.map(user => ({ value: user.email, label: user.email }))} // Mapping options as objects with 'value' and 'label'
                                closeMenuOnSelect={true}
                                components={animatedComponents}
                                defaultValue={users.length > 0 ? { value: users[0].email, label: users[0].email } : null}
                                isMulti={false}
                            />
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
                        <div className="summaryButton">
                            <button className="activeButton">Show Reports</button>
                        </div>
                        <div className="adminReport4" style={{ height: '300px', backgroundColor: '#F5F5F5' }}>
                            {loading ? (
                                <div className="loader"></div>
                            ) : selectedUser ? (

                                <>

                                    <div>
                                        <p className="sixtyhour">{selectedUser.totalHours ? selectedUser.totalHours : "0h 0m"}</p>
                                        <p className="report-percentage">{`${selectedUser.Activity ? Math.ceil(selectedUser.Activity) : 0} %`}</p>
                                        {/* {renderUserDetails()} */}
                                    </div>
                                    <div className="summaryDiv">
                                        <ActivityChart reportData={reportData} />
                                    </div>
                                </>

                            ) : reportData ? (
                                <>
                                    <div>
                                        <p className="sixtyhour">{reportData?.totalHours ? reportData?.totalHours : "0h 0m"}</p>
                                        <p className="report-percentage">{`${reportData?.totalActivity ? Math.ceil(reportData?.totalActivity) : 0} %`}</p>
                                    </div>
                                    <div className="summaryDiv">
                                        <ActivityChart reportData={reportData} />
                                    </div>
                                </>
                            )
                                : (
                                    <div>No Data Available</div>
                                )}
                        </div>
                        <div className="employeeDiv">
                            <p>{"± Employees / ± Projects"}</p>
                            <div className="durationDiv">
                                <p>Duration</p>
                                <p>Activity</p>
                            </div>
                        </div>

                        {/* Debugging: Output user type and report data to console */}
                        {console.log("userType:", userType)}
                        {console.log("reportData:", reportData)}
                        {console.log("reportData.allUsers:", reportData && reportData.allUsers)}
                        {/* {console.log("Duration: ", reportData.Duration)} */}


                            {selectedUser ? (
                                renderUserDetails()
                            ) : (
                                <>  {reportData?.allUsers?.map((data, index) => {
                                    return (
                                        <div className="asadMehmoodDiv" key={index} onClick={() => handleEmailSelect(user.email)}>
                                            <div>
                                                <p><img src={addButton} /><span>{data?.employee}</span></p>
                                            </div>
                                            <div className="durationDiv">
                                                <p>{data?.Duration}</p>
                                                <p>{Math.floor(data?.Activity)} %</p>
                                            </div>
                                        </div>
                                    )
                                })}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <img className="admin1Line" src={line} />
            </div >
            )
}

            export default OwnerReport;