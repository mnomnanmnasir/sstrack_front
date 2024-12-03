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


function UserSummary() {
// nim 
    const year = new Date().getFullYear()
    let token = localStorage.getItem('token');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState();
    const today = startDate?.getFullYear();
    const startCurrentMonth = (startDate?.getMonth() + 1).toString().padStart(2, '0');
    const startCurrentDate = startDate?.getDate().toString().padStart(2, '0');
    const startTodayDate = `${today}-${startCurrentMonth}-${startCurrentDate}`;
    const endtoday = endDate?.getFullYear();
    const endCurrentMonth = (endDate?.getMonth() + 1).toString().padStart(2, '0');
    const endCurrentDate = endDate?.getDate().toString().padStart(2, '0');
    const endTodayDate = `${endtoday}-${endCurrentMonth}-${endCurrentDate}`;
    const [todayDate, setTodayDate] = useState("");
    const [data, setData] = useState(todayDate);
    const [yesterdayDate, setYesterdayDate] = useState('');
    const [latestDate, setLatestDate] = useState('');
    const [weekDate, setWeekDate] = useState("");
    const [monthDate, setMonthDate] = useState('');
    let headers = {
        Authorization: 'Bearer ' + token,
    }
    const items = JSON.parse(localStorage.getItem('items'));
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    async function getSummaryData() {
        try {
            const response = await fetch(`${apiUrl}/timetrack/hours`, { headers })
            const json = await response.json();
            console.log(json);
            setData(json?.data?.totalHours?.daily)
            setLatestDate(json?.data?.totalHours?.daily)
            setYesterdayDate(json?.data?.totalHours?.yesterday)
            setWeekDate(json?.data?.totalHours?.weekly)
            setMonthDate(json?.data?.totalHours?.monthly)
            // setData(json.data)
        } catch (err) {
            // setErr(err)
            // console.log(error);
        }

    }
    useEffect(() => {
        getSummaryData();
    }, [])
    const getData = async () => {
        try {
            const response = await fetch(`${apiUrl}/timetrack/totalDate?startDate=${startTodayDate}&endDate=${endTodayDate}`, {
                method: "GET",
                headers
            })
            const json = await response.json()
            console.log(json);
            setData(json.data?.totalHours)
            if (json.message) {
                setData(json.message)
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (startTodayDate != "" && endTodayDate != "") {
            getData();
        }
    }, [startTodayDate, endTodayDate]);
    const yearlyGetData = async (yearly) => {
        console.log(yearly);
        try {
            const response = await fetch(`${apiUrl}/timetrack/year?year=current`, {
                method: "GET",
                headers
            }).then((sucess) =>
                sucess.json()
            ).catch((error) => {
                error.json()
            })
            console.log(response);
        }
        catch (error) { }
    }
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
                        <div className="d-flex gap-5">
                            <p>Start Date</p>
                            <p>End Date</p>
                        </div>
                        <div className="calenderDiv">

                            <div className="calenderInnerDiv">
                                <div className="dateDiv">

                                    <div> <button> <DatePicker className="bg-transparent border-0 text-center " selected={startDate} onChange={date => setStartDate(date)} /></button>
                                    </div>


                                    <div><img src={blueArrow} /></div>
                                    <div>

                                        <button>  <DatePicker className="bg-transparent border-0 text-center " selected={endDate} onChange={date => setEndDate(date)} /></button>

                                    </div>
                                </div>
                                <div className="dayDiv">
                                    <div className="summaryTodayDiv">
                                        <p onClick={() => setData(latestDate)}>Today</p>
                                        <p onClick={() => setData(yesterdayDate)}>Yesterday</p>
                                    </div>
                                    <div className="summaryTodayDiv">
                                        <p onClick={() => setData(weekDate)}>This Week</p>
                                        <p>Last Week</p>
                                    </div>
                                    <div className="summaryTodayDiv">
                                        <p onClick={() => setData(monthDate)}>This Month</p>
                                        <p onClick={() => yearlyGetData(year)}>This Year</p>
                                    </div>

                                </div>
                            </div>
                            <div>
                                <div className="dropdown ">
                                    <button className="btn m-0 utc5" type="button" aria-expanded="false">
                                        {items?.timezone}
                                    </button>

                                </div>
                            </div>
                        </div>
                        <div className="crossButtonDiv">
                            <div>

                                <button className="crossButton">{items?.name}</button>
                            </div>



                        </div>




                        <div>
                            <img className="reportButton" src={reportButton} />
                        </div>
                        <div className="summaryButton">
                            <button className="activeButton">Timeline</button>

                        </div>
                        <div className="adminReport4">
                            <div>
                                <p className="sixtyhour">{data}</p>


                            </div>
                            <div className="summaryDiv">
                                <p className="text-center">{data}</p>
                                {/* <img src={blueBackground}/> */}
                            </div>


                        </div>
                        <div className="employeeDiv">
                            <p>± Employees / ± Projects</p>
                            <div className="durationDiv">
                                <p>Duration</p>
                                <p>Money</p>
                                <p>Activity</p>
                            </div>
                        </div>
                        {/* <div className="asadMehmoodDiv">
                                {console.log(data)}
                                <div>
                                    <p><img src={addButton} /><span>Fatima Zohra</span></p>
                                </div>
                                <div className="durationDiv">
                                    <p>36h 52m</p>
                                    <p>$27.64</p>
                                    <p>48 %</p>
                                </div>
                            </div> */}
                    </div>
                </div>
            </div>
            <img className="admin1Line" src={line} />
        </div>
    )
}

export default UserSummary;