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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import blueBackground from "../images/bluebackground.png";
import ActivityChart from "../adminScreens/component/ActivityChart";
import SelectBox from "../companyOwner/ownerComponent/selectBox";
import makeAnimated from 'react-select/animated';
import axios from "axios";

function AdminReports() {

    const year = new Date().getFullYear()
    let token = localStorage.getItem('token');
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [employeeId, setEmployeeId] = useState(null);
    const [dateFilter, setDateFilter] = useState({
        today: false,
        yesterday: false,
        thisWeek: false,
        lastWeek: false,
        thisMonth: false,
        lastMonth: false,
        thisYear: false,
        lastYear: false,
    })
    const [users, setUsers] = useState([]);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    let headers = {
        Authorization: 'Bearer ' + token,
    }
    const items = JSON.parse(localStorage.getItem('items'));
    const apiUrl = "https://ss-track-xi.vercel.app/api/v1";

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

    const getEmployess = async () => {
        try {
            const response = await axios.get(`${apiUrl}/superAdmin/employees`, { headers })
            if (response.status) {
                setUsers(() => {
                    const filterCompanies = response?.data?.convertedEmployees?.filter((employess, index) => {
                        return items.company === employess.company && employess.userType !== "owner"
                    })
                    return filterCompanies
                })
                console.log(response);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const getReports = async (id) => {
        setLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/timetrack/totalDate?startDate=${new Date().toLocaleDateString()}&endDate=${new Date().toLocaleDateString()}`, { headers })
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

    const getDailyReports = async (type) => {
        if (employeeId) {
            setLoading(true)
            try {
                const response = await axios.get(`${apiUrl}/superAdmin/timetrack/day?daySpecifier=${type}&userId=${employeeId}`, { headers })
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
                const response = await axios.get(`${apiUrl}/superAdmin/timetrack/day?daySpecifier=${type}`, { headers })
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

    const getWeeklyReports = async (type) => {
        if (employeeId) {
            setLoading(true)
            try {
                const response = await axios.get(`${apiUrl}/superAdmin/week?weekSpecifier=${type}&userId=${employeeId}`, { headers })
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
                const response = await axios.get(`${apiUrl}/superAdmin/week?weekSpecifier=${type}`, { headers })
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

    const getMonthlyReports = async (type) => {
        if (employeeId) {
            setLoading(true)
            try {
                const response = await axios.get(`${apiUrl}/superAdmin/month?monthSpecifier=${type}&userId=${employeeId}`, { headers })
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
                const response = await axios.get(`${apiUrl}/superAdmin/month?monthSpecifier=${type}`, { headers })
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
            return null
        }
    }

    const getYearlyReports = async (type) => {
        if (employeeId) {
            setLoading(true)
            try {
                const response = await axios.get(`${apiUrl}/superAdmin/year?yearSpecifier=${type}&userId=${employeeId}`, { headers })
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
            return null
        }
        else {
            setLoading(true)
            try {
                const response = await axios.get(`${apiUrl}/superAdmin/year?yearSpecifier=${type}`, { headers })
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
            return null
        }
    }

    useEffect(() => {
        getEmployess()
    }, [])

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
    }, [employeeId])

    const user = users?.map(user => ({ label: user.email, value: user.email, id: user._id }))
    const defaultValue = user.length > 0 ? [{ value: user[0].value }] : [];

    console.log(dateFilter);

    console.log(users);

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
                                onChange={(e) => {
                                    setEmployeeId(e.id)
                                }}
                                options={user}
                                closeMenuOnSelect={true}
                                components={animatedComponents}
                                defaultValue={defaultValue}
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
                            ) : (
                                <>
                                    <div>
                                        <p className="sixtyhour">{reportData?.totalHours ? reportData?.totalHours : "0h 0m"}</p>
                                        <p className="report-percentage">{`${reportData?.totalActivity ? Math.ceil(reportData?.totalActivity) : 0} %`}</p>
                                    </div>
                                    <div className="summaryDiv">
                                        <ActivityChart reportData={reportData} />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="employeeDiv">
                            <p>± Employees / ± Projects</p>
                            <div className="durationDiv">
                                <p>Duration</p>
                                <p>Activity</p>
                            </div>
                        </div>
                        {reportData?.allUsers?.map((data, index) => {
                            return (
                                <div className="asadMehmoodDiv">
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
                    </div>
                </div>
            </div>
            <img className="admin1Line" src={line} />
        </div >
    )
}

export default AdminReports;