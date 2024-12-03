import React, { useRef } from "react";
import { useEffect, useState } from "react";
import circle from "../images/online.webp";
import setting from "../images/setting.webp";
import left from "../images/Leftarrow.webp";
import right from "../images/Rightarrow.webp";
import circleDot from "../images/CircleDot.webp";
import edit from '../images/EditTimeZone.webp';
import historyIcon from "../images/HistoryIcon.webp";
import line from "../images/line.webp";
import { useLocation, useNavigate } from "react-router-dom";
import cross from "../images/cross.webp";
import moment from "moment-timezone";
import CircularProgressBar from "../screen/component/circularProgressBar";
import leftArrow from "../images/left-arrow.png"
import rightArrow from "../images/right-arrow.png"
import activityImage from "../images/activity-level.svg"
import needle from '../images/Needle.svg'
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import useLoading from "../hooks/useLoading";
import axios from "axios";
import logo from '../images/app-logo-white.svg'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Pusher from 'pusher-js';
import deleteIcon from '../images/delete.svg'
import DeleteSSModal from "../screen/component/deleteSSModal";
import { ImCross } from "react-icons/im";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import BackToTop from "../screen/component/backToTop";
import Modal from 'react-bootstrap/Modal';
import activityTracker from "../images/activityTracker.svg"
import perc_20 from "../images/Red.svg"
import perc_40 from "../images/Orange.svg"
import perc_60 from "../images/Yellow.svg"
import perc_80 from "../images/LightGreen.svg"
import perc_100 from "../images/FullGreen.svg"
import { CaptureScreenshot } from "../screen/component/captureScreenshot";
import { useDispatch, useSelector } from "react-redux";
import { GetTimelineUserOwner } from "../middlewares/timeline";
import { selectUserTimeline } from "../store/timelineSlice";

function CompanyIndividualUser() {

    const currentDates = new Date();
    const utcDate = moment.utc(currentDates).toDate();
    const today = new Date().getFullYear();
    const currentMonths = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const currentDate = new Date().getDate().toString().padStart(2, '0');
    const todayDate = `${today}-${currentMonths}-${currentDate}`;

    const [trimActivity, setTrimActivity] = useState(null)
    const [offlineTime, setOfflineTime] = useState(null)
    const [rotation, setRotation] = useState(0)
    const { loading, setLoading } = useLoading()
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [ssData, setSSData] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeButton, setActiveButton] = useState(null);
    const [clickDay, setClickDay] = useState()
    const [month, setMonth] = useState()
    const location = useLocation();
    const [timeBill, setTimeBill] = useState({});
    const [data, setData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [formattedDate, setFormattedDate] = useState(todayDate);
    const [lastScreenshot, setLastScreenshot] = useState(null)
    const [showTooltip, setShowTooltip] = useState(false);
    const [timeEntries, setTimeEntries] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [showSplitActivity, setShowSplitActivity] = useState(false)
    const [showTrimActivity, setShowTrimActivity] = useState(false)
    const [showOfflineTime, setShowOfflineTime] = useState(false)
    const [showDeleteButton, setShowDeleteButton] = useState(false)
    const [showEditButton, setShowEditButton] = useState(false)

    const [splitTime, setSplitTime] = useState(null)
    const [timeTrackingId, setTimeTrackingId] = useState(null)
    const [screenshotId, setScreenshotId] = useState(null)
    const [showScrollButton, setShowScrollButton] = useState(false)

    const userId = location?.state;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
    const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    const navigate = useNavigate("")
    const [current_day, set_current_day] = useState(null)
    const [current_month, set_current_month] = useState(null)
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [totalPercentageByDay, setTotalPercentageByDay] = useState(null)
    const [activeMonth, setActiveMonth] = useState(new Date().toLocaleDateString())

    const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
    let token = localStorage.getItem('token');
    let items = JSON.parse(localStorage.getItem('items'));
    let headers = {
        Authorization: "Bearer " + token,
    }

    const dispatch = useDispatch()
    const userTimeline = useSelector((state) => state.userTimeline)
    const showUserTimeline = useSelector((state) => state.showTimelineData)
    const [deleteActivity, setDeleteActivity] = useState(false)

    const isValidTimeFormat = (timeString) => {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/i;
        return timeRegex.test(timeString);
    }

    // var pusher = new Pusher('334425b3c859ed2f1d2b', {
    //     cluster: 'ap2'
    // });

    // var channel = pusher.subscribe('ss-track');

    // channel.bind('my-user', function (data) {
    //     console.log(data.data);
    // });

    // useEffect(() => {
    //     var channel = pusher.subscribe('ss-track');
    //     channel.bind("new-ss", (data) => {
    //         setLastScreenshot(data?.data)
    //         setData((prevData) => {
    //             return {
    //                 ...prevData,
    //                 groupedScreenshots: prevData?.groupedScreenshots?.map((groupeScreenshot) => {
    //                     if (data?.data?.timeEntryId === groupeScreenshot?.timeentryId && !groupeScreenshot?.screenshots?.find(screenshot => screenshot.trackingId === data?.data?.timeEntryId)) {
    //                         return {
    //                             ...groupeScreenshot,
    //                             screenshots: [...groupeScreenshot?.screenshots, data?.data]
    //                         }
    //                     }
    //                     else {
    //                         return groupeScreenshot
    //                     }
    //                 })
    //             }
    //         })
    //         console.log("new ss ===>", data);
    //     });
    //     return () => {
    //         channel.unbind("new-ss");
    //     };
    // }, []);

    // channel.bind('my-event', function (data) {
    //     console.log(JSON.stringify(data));
    // });

    const prevMonth = () => {
        setDate((prevDate) => {
            const prevMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1);
            setActiveMonth(prevMonthDate.toLocaleDateString())
            setTotalPercentageByDay(null)
            return prevMonthDate;
        });
    };

    const nextMonth = () => {
        setDate((prevDate) => {
            const nextMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1);
            setActiveMonth(nextMonthDate.toLocaleDateString())
            setTotalPercentageByDay(null)
            return nextMonthDate;
        });
    };

    const renderCalendar = () => {
        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const weeks = [];
        let days = [];
        let currentDay = new Date(firstDayOfMonth);

        const handleClick = (key) => {
            setSelectedDate(key);
            const clickDay = new Date(key).getFullYear();
            const clickMonth = (new Date(key).getMonth() + 1).toString().padStart(2, '0');
            const clickDate = new Date(key).getDate().toString().padStart(2, '0');
            const clickDa = new Date(key).getDay();
            const clickMon = new Date(key).getMonth();
            // console.log(clickDa);
            setClickDay(clickDa)
            setMonth(clickMon)
            const formattedsDate = `${clickDay}-${clickMonth}-${clickDate}`;
            setFormattedDate(formattedsDate);
            setActiveButton(key)
        };

        // Generate cells for each day in the current month
        // ...

        // Generate cells for each day in the current month
        for (let i = 0; i < daysInMonth; i++) {
            const isWeekend = currentDay.getDay() === 0 || currentDay.getDay() === 6;
            const isFirstDayOfWeek = currentDay.getDay() === 1;
            const isLastDayOfWeek = currentDay.getDay() === 0 || i === daysInMonth - 1;
            const dayKey = currentDay.toString();
            const isCurrentDate = currentDay.getDate() === new Date().getDate() && currentDay.getMonth() === new Date().getMonth();

            const dayFormatted = `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1).toString().padStart(2, '0')}-${currentDay.getDate().toString().padStart(2, '0')}`;

            // Generate a unique key using the string representation of the date
            days.push(
                <div
                    style={{ cursor: "pointer", border: "1px solid #ebeaea" }}
                    className={`col cell ${isWeekend ? "week day week first" : "day"} ${dayKey === activeButton ? "active" : isCurrentDate ? "active2" : ""}`}
                    key={dayKey}
                    onClick={() => handleClick(dayKey)}
                >
                    <p className="weekName">{currentDay.toLocaleString("en-US", { weekday: "short" })}</p>
                    <p className="Weekdate">{currentDay.getDate()}</p>
                    {/* <p className="nonetaken">{currentDay.toLocaleString("en-US", { weekday: "short" })}</p> */}
                    <div style={{ padding: "2px" }}>
                        <div style={{ width: `${totalPercentageByDay === null ? 0 : totalPercentageByDay[i]?.percentage}%`, background: 'linear-gradient(180deg,#cdeb8e 0,#a5c956)', height: '10px' }}></div>
                    </div>
                </div>
            );

            currentDay.setDate(currentDay.getDate() + 1);
        }

        weeks.push(<div className="days" key={currentDay}>{days}</div>);
        return weeks;
    };

    const fetchData = async () => {
        // const findTimeline = userTimeline?.find((f) => f.formattedDate === formattedDate)
        // dispatch(selectUserTimeline({ findTimeline, formattedDate }))
        try {
            const response = await axios.get(`${apiUrl}/owner/${userId}?date=${encodeURIComponent(formattedDate)}`, { headers });
            if (response.data) {
                setData(response.data.data);
                setTimeBill(response.data.data.timeBill);
                setTimeEntries(response?.data?.data?.groupedScreenshots || []);
                setTimeTrackingId(response.data.data.TimeTrackingId)
                setTrimActivity({ ...trimActivity, totalHours: response?.data?.data?.totalHours.daily })
                console.log(response);
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    async function getAllDays() {
        try {
            const response = await axios.get(`${apiUrl}/superAdmin/hoursbyday/${userId}?date=${activeMonth}`, { headers });
            const totalHours = response.data.data.totalHoursByDay;
            console.log("totalHours of active month", response.data);
            const currentDate = new Date();
            const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const currentYear = currentDate.getFullYear();
            const maxHours = 6;
            let percentagesByDay = [];
            const processMonth = (totalHours, month, year) => {
                const filteredHours = totalHours.filter(th => {
                    const dateParts = th.date.split('-').map(part => part);
                    return "0" + dateParts[1] === month && dateParts[2] === year;
                });
                filteredHours.forEach(th => {
                    const timeMatches = th.totalHours.match(/(\d+)h\s*(\d*)m/);
                    let totalMinutes = 0;
                    if (timeMatches) {
                        const hours = parseInt(timeMatches[1], 10) || 0;
                        const minutes = parseInt(timeMatches[2], 10) || 0;
                        totalMinutes = hours * 60 + minutes;
                    }
                    const totalHoursDecimal = totalMinutes / 60;
                    const widthPercentage = (totalMinutes / (maxHours * 60)) * 100;
                    const widthPercentageExact = (totalHoursDecimal / maxHours) * 100;
                    percentagesByDay.push({
                        date: th.date,
                        totalMinutes: totalMinutes,
                        percentage: Math.min(widthPercentage, 100),
                        percentageExact: Math.min(widthPercentageExact, 100),
                    });
                });
            };
            // Assuming you have the totalHours data available
            // Process data for all months up to the current month
            for (let year = currentDate.getFullYear(); year >= 2022; year--) {
                for (let month = 12; month >= 1; month--) {
                    processMonth(totalHours, month.toString().padStart(2, '0'), year.toString());
                }
            }
            setTotalPercentageByDay(percentagesByDay);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [formattedDate]);

    // useEffect(() => {
    //     dispatch(GetTimelineUserOwner({ userId, formattedDate, headers }))
    // }, []);

    useEffect(() => {
        getAllDays()
    }, [activeMonth]);

    const openModal = (element, imageSrc, index) => {
        setSelectedImage(imageSrc);
        setSelectedImageIndex(index)
        setSSData(element)
        console.log(index);
    };

    const renderTimeIntervals = () => {
        const intervals = [];
        for (let hour = 0; hour <= 23; hour++) {
            const isPM = hour >= 12;
            const formattedHour = hour <= 12 ? hour : hour - 12;
            intervals.push(
                <div key={hour} className="time-slot">
                    <div className="hour-color">
                        {formattedHour === 0 ? 12 : formattedHour} {isPM ? 'pm' : 'am'}
                        <div className="minute-container">
                            {Array.from({ length: 60 }, (_, minute) => {
                                const timeWithMinutes = `${hour}:${minute < 10 ? '0' + minute : minute}`;
                                const color = getColorForTime(timeWithMinutes);
                                return (
                                    <div
                                        key={minute}
                                        className={`time-interval ${color !== 'transparent' ? 'red' : ''}`}
                                        style={{ background: color }}
                                    >
                                        {minute}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }
        return intervals;
    };

    const getColorForTime = (time) => {
        const matchingEntry = data?.groupedScreenshots?.find(entry => {
            const [startTime, endTime] = entry?.time?.split(' - ');
            const startTimeFormatted = new Date(`${encodeURIComponent(formattedDate)} ${startTime}`).getTime();
            const endTimeFormatted = new Date(`${encodeURIComponent(formattedDate)} ${endTime}`).getTime();
            const currentTimeFormatted = new Date(`${encodeURIComponent(formattedDate)} ${time}`).getTime();
            return currentTimeFormatted >= startTimeFormatted && currentTimeFormatted <= endTimeFormatted;
        });
        return matchingEntry ? "#A8C96A" : '#EFF9EC';
    };

    const goBackToPreviousImage = () => {
        if (selectedImageIndex >= 0) {
            setSelectedImageIndex(selectedImageIndex - 1)
        } else {
            setSelectedImage(null);
            setSelectedImageIndex(null)
            setSSData(null)
        }
    };

    const goToNextImage = () => {
        if (selectedImageIndex <= ssData?.screenshots?.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1)
        } else {
            setSelectedImage(null);
            setSelectedImageIndex(null)
            setSSData(null)
        }
    };

    const handleMouseEnter = () => {
        setShowTooltip(true);
    }

    const handleMouseLeave = () => {
        setShowTooltip(false);
    }

    useEffect(() => {
        if (selectedImageIndex) {
            setSelectedImage(ssData?.screenshots[selectedImageIndex]?.key)
        }
        if (selectedImageIndex === 0) {
            setSelectedImage(ssData?.screenshots[0]?.key)
        }
    }, [selectedImageIndex])

    useEffect(() => {
        const keyPressHandler = (event) => {
            if (event.key === 'ArrowLeft') {
                console.log(event);
                goBackToPreviousImage();
            }
            else if (event.key === 'ArrowRight') {
                console.log(event);
                goToNextImage();
            }
            else if (event.key === 'Escape') {
                setSelectedImage(null);
                setSSData(null)
                setSelectedImageIndex(null)
            }
        }
        window.addEventListener('keydown', keyPressHandler);
        return () => window.removeEventListener('keydown', keyPressHandler);
    }, [selectedImageIndex]);

    function closeModal(params) {
        setSelectedImage(null);
        setSSData(null)
        setSelectedImageIndex(null)
    }

    const handleOpenDeleteModal = (element, elements) => {
        setShowDeleteModal(true)
        setScreenshotId(elements._id)
    }

    const handleDeleteSS = async () => {
        setShowDeleteModal(false)
        try {
            const response = await axios.delete(`${apiUrl}/superAdmin/deleteScreenshot/${screenshotId}/TimeTracking/${timeTrackingId}`, {
                headers: headers
            })
            if (response.status === 200) {
                console.log(response);
                enqueueSnackbar("Screenshot deleted", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                fetchData()
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar("network error", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        }
    }

    useEffect(() => {
        document.addEventListener("scroll", () => {
            if (window.scrollY > 10) {
                setShowScrollButton(true)
            }
            else {
                setShowScrollButton(false)
            }
        })
    }, [])

    const handleTrimActivity = async () => {
        setShowOfflineTime(false)
        setShowTrimActivity(false)
        setShowSplitActivity(false)
        const timeEntryId = trimActivity?.timeentryId
        if (deleteActivity === false) {
            const formattedStartTime = formattedDate + " " + trimActivity?.startTime;
            const formattedEndTime = formattedDate + " " + trimActivity?.endTime;
            if (!isValidTimeFormat(trimActivity.startTime) || !isValidTimeFormat(trimActivity.endTime)) {
                setShowTrimActivity(true)
                enqueueSnackbar("Invalid time format", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                return;
            }
            try {
                const response = await axios.patch(`${apiUrl}/superAdmin/trim-activity/${userId}/${timeEntryId}`, {
                    startTime: formattedStartTime,
                    endTime: formattedEndTime,
                }, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                if (response.status === 200) {
                    enqueueSnackbar(response.data.data.message, {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                    fetchData()
                    console.log(response);
                }
            } catch (error) {
                console.log(error);
            }
        }
        else {
            try {
                const response = await axios.delete(`${apiUrl}/superAdmin/time-tracking/${timeTrackingId}/activity/${timeEntryId}`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                if (response.status === 200) {
                    enqueueSnackbar(response.data.message, {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                    fetchData()
                    console.log(response);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleSplitActivity = async () => {
        setShowSplitActivity(false)
        setShowTrimActivity(false)
        setShowOfflineTime(false)
        if (!isValidTimeFormat(splitTime?.splitTime)) {
            setShowSplitActivity(true)
            enqueueSnackbar("Invalid time format", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/superAdmin/split-activity`, {
                timeEntryId: trimActivity?.timeentryId,
                userId: userId,
                splitTime: formattedDate + " " + splitTime?.splitTime
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            if (response.status === 200) {
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddOfflineTime = async () => {
        setShowOfflineTime(false)
        setShowSplitActivity(false)
        setShowTrimActivity(false)
        console.log(`${apiUrl}/superAdmin/offline-time/${userId}`);
        console.log({
            startTime: formattedDate + " " + offlineTime?.startTime,
            endTime: formattedDate + " " + offlineTime?.endTime,
            notes: "Offline activity description",
        });
        if (!isValidTimeFormat(offlineTime.startTime) || !isValidTimeFormat(offlineTime.endTime)) {
            setShowOfflineTime(true)
            enqueueSnackbar("Invalid time format", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/superAdmin/offline-time/${userId}`, {
                startTime: formattedDate + " " + offlineTime?.startTime,
                endTime: formattedDate + " " + offlineTime?.endTime,
                projectId: "643fb528272a1877e4fcf30e",
                notes: "Offline activity description"
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            if (response.status === 200) {
                enqueueSnackbar("offline time added", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        set_current_day(days[currentDay])
        set_current_month(months[currentMonth])
    }, [])

    const offsetInMinutes = moment.tz(items?.timezone).utcOffset();
    const offsetInHours = offsetInMinutes / 60;
    const offsetSign = offsetInHours >= 0 ? '+' : '-';
    const formattedOffset = `${offsetSign}${Math.abs(offsetInHours)}`;

    const handleDivClick = () => {
        setDeleteActivity(!deleteActivity);
    };

    return (
        <div>
            {showScrollButton === true ? <BackToTop /> : null}

            {showDeleteModal ? <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} animation={true} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Delete screenshot</p>
                    <p>Are you sure want to delete this screenshot? This will also cut time from your timeline.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={handleDeleteSS}>
                        DELETE
                    </button>
                    <button className="teamActionButton" onClick={() => setShowDeleteModal(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}

            {showTrimActivity ? <Modal show={showTrimActivity} onHide={() => {
                setShowOfflineTime(true)
                setShowTrimActivity(false)
                setShowSplitActivity(false)
            }} animation={true} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Edit time</p>
                    <div className="editBoxLowerDiv">
                        <p>You can trim activity time, or edit activity note. <br />
                            If you need add time, then <span style={{ cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }} onClick={() => {
                                setShowOfflineTime(true)
                                setShowTrimActivity(false)
                                setShowSplitActivity(false)
                            }}>Add Offline Time </span> instead
                        </p>

                        {trimActivity?.startTime < startTime || trimActivity?.endTime > endTime ? (
                            <p style={{ color: "red" }}>`From` and `To` must be within current bounds. <br /> To add extra time, Add Offline Time instead.</p>
                        ) : null}

                        <div className="editboxinputdiv">
                            <input onChange={(e) => setTrimActivity({ ...trimActivity, startTime: e.target.value })} value={trimActivity?.startTime} />
                            -
                            <input onChange={(e) => setTrimActivity({ ...trimActivity, endTime: e.target.value })} value={trimActivity?.endTime} />
                            <p>-{trimActivity?.totalHours ? trimActivity?.totalHours : "0h 0m"}</p>
                        </div>
                        <p className="sevenAm">eg 7am to 9:10am or 17:30 to 22:00</p>
                        {/* <div>
                            <select className="projectOption" defaultValue="">
                                <option>Infiniti Solutions</option>
                                <option>Y8HR</option>
                                <option>Peel HR</option>
                                <option>Geox HR</option>
                                <option>Click HR</option>
                            </select>
                        </div> */}
                        <textarea placeholder="Note (optional)" rows="5" ></textarea>
                        <div className="deleteActivityPart">
                            <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }} onClick={handleDivClick}>
                                <input id="editcheck" type="checkbox" checked={deleteActivity} onChange={(e) => setDeleteActivity(e.target.checked)} />
                                <p style={{ margin: "0 0 0 10px", padding: 0 }}>Delete this activity</p>
                            </div>
                            <p style={{ margin: 0, cursor: "pointer" }} onClick={() => {
                                setShowSplitActivity(true)
                                setShowTrimActivity(false)
                            }}>Split Activity</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={handleTrimActivity}>
                        SAVE CHANGES
                    </button>
                    <button className="teamActionButton" onClick={() => {
                        setShowOfflineTime(false)
                        setShowTrimActivity(false)
                        setShowSplitActivity(false)
                    }}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}

            {showSplitActivity ? <Modal show={showSplitActivity} onHide={() => {
                setShowSplitActivity(false)
                setShowTrimActivity(false)
                setShowOfflineTime(false)
            }} animation={true} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Edit time</p>
                    <div className="editBoxLowerDiv">
                        <div className="editboxinputdiv">
                            <input disabled={true} value={splitTime?.startTime} />
                            -<input value={splitTime?.splitTime} onChange={(e) => setSplitTime({ ...splitTime, splitTime: e.target.value })} placeholder="split" />-
                            <input disabled={true} value={splitTime?.endTime} /> <p>-0h 40m</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={handleSplitActivity}>
                        SAVE CHANGES
                    </button>
                    <button className="teamActionButton" onClick={() => {
                        setShowSplitActivity(false)
                        setShowTrimActivity(false)
                        setShowOfflineTime(false)
                    }}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}

            {showOfflineTime ? <Modal show={showOfflineTime} onHide={() => {
                setShowOfflineTime(false)
                setShowSplitActivity(false)
                setShowTrimActivity(false)
            }} animation={true} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Add Offline Time</p>
                    <div className="editBoxLowerDiv">
                        <p>Offline time range will appear on your timeline <br />
                            You will able to edit or delete from there
                        </p>
                        <div className="editboxinputdiv">
                            <input onChange={(e) => setOfflineTime({ ...offlineTime, startTime: e.target.value })} value={offlineTime?.startTime} />
                            -
                            <input onChange={(e) => setOfflineTime({ ...offlineTime, endTime: e.target.value })} value={offlineTime?.endTime} />
                            <p>-{offlineTime?.totalHours ? offlineTime?.totalHours : "0h 0m"}</p>
                        </div>
                        <p className="sevenAm">eg 7am to 9:10am or 17:30 to 22:00</p>
                        <div>
                            <select className="projectOption">
                                <option>Infiniti Solutions</option>
                                <option>Y8HR</option>
                                <option>Peel HR</option>
                                <option>Geox HR</option>
                                <option>Click HR</option>
                            </select>
                        </div>
                        <textarea placeholder="Note (optional)" rows="5" ></textarea>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={handleAddOfflineTime}>
                        SAVE CHANGES
                    </button>
                    <button className="teamActionButton" onClick={() => {
                        setShowOfflineTime(false)
                        setShowSplitActivity(false)
                        setShowTrimActivity(false)
                    }}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}

            <SnackbarProvider />
            <div className="container">
                <div className="mainwrapper">
                    <div className="userHeader">
                        <div className="headerTop">
                            <h5><img src={circle} alt="" /> {data?.name}</h5>
                        </div>
                        <div className="headerTop">
                            <p>All times are UTC {formattedOffset}</p>
                            <img
                                src={setting}
                                alt="setting.png"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    navigate("/owner-account")
                                }}
                            />
                        </div>
                    </div>
                    <div className="userMainContent">
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div className="header">
                                    <img src={left} onClick={prevMonth} alt="Previous Month" />
                                    <h2 className="monthName">{date.toLocaleString("en-US", { month: "long", year: "numeric" })}</h2>
                                    <img src={right} onClick={nextMonth} alt="Next Month" />
                                </div>
                                <div>
                                    <button onClick={() => navigate(`/owner-user-timeline/${userId}`)}>View activity</button>
                                </div>
                            </div>
                            <div className="days-weeks">{renderCalendar()}</div>
                        </div>
                        <div className="timerAndTracking">
                            <div style={{ margin: "0 10px 0 0" }} className="timerLeft">
                                <div>
                                    <img width={120} src={logo} alt="" />
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                                    <p className="weekDayTimer">{formattedDate === todayDate ? current_day : days[clickDay]} </p>
                                    <p className="weekDayTimer">{formattedDate && formattedDate.split('-')[2]}</p>
                                    <p className="weekDateTimer">{formattedDate === todayDate ? current_month : months[month]}</p>
                                    <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(data?.totalactivity)} %</Tooltip>}>
                                        <div className="circular-progress" style={{
                                            cursor: "pointer"
                                        }}>
                                            <CircularProgressBar activityPercentage={data?.totalactivity} size={30} />
                                        </div>
                                    </OverlayTrigger>
                                    <p className="timerClock">{data?.totalHours?.daily}</p>
                                    <p className="weekTimer">Week</p>
                                    <p className="weekTimerDigit">{data?.totalHours?.weekly}</p>
                                    <img src={circleDot} alt="CircleDot.png" />
                                    <p className="weekTimer">Month</p>
                                    <p className="monthTimerDigit">{data?.totalHours?.monthly}</p>
                                </div>
                            </div>
                            <div className="activity-image-container">
                                <div className="activityMainHeading">
                                    <h4 className="activityMainHeadingContent">Activity Tracker</h4>
                                    <p className="activityMainContent">Activity Level</p>
                                </div>
                                <div className="activityMeternContent">
                                    <div className="activityMeterContentMain">
                                        <div className="activityMeterContent">
                                            <img src={perc_20} alt="" />
                                            <p className="activityMeterContentPercent">0 - 20 %</p>
                                        </div>
                                        <div className="activityMeterContent">
                                            <img src={perc_40} alt="" />
                                            <p className="activityMeterContentPercent">21 - 40 %</p>
                                        </div>
                                        <div className="activityMeterContent">
                                            <img src={perc_60} alt="" />
                                            <p className="activityMeterContentPercent">41 - 60 %</p>
                                        </div>
                                        <div className="activityMeterContent">
                                            <img src={perc_80} alt="" />
                                            <p className="activityMeterContentPercent">61 - 80 %</p>
                                        </div>
                                        <div className="activityMeterContent">
                                            <img src={perc_100} alt="" />
                                            <p className="activityMeterContentPercent">81 - 100 %</p>
                                        </div>
                                    </div>
                                    <div className="activityMeterMain">
                                        <div className="activityMeterMainContainer">
                                            <img className="activityMeterMainImage" src={activityImage} alt="" />
                                            <div className="needleContainerMain">
                                                <div
                                                    className="needleContainerMainAlingment"
                                                    style={{
                                                        transform: `translateY(-50%) rotate(${Math.floor(data?.totalactivity) <= 20 ? -75 :
                                                            Math.floor(data?.totalactivity) > 20 && Math.floor(data?.totalactivity) <= 40 ? -38 :
                                                                Math.floor(data?.totalactivity) > 40 && Math.floor(data?.totalactivity) <= 60 ? 0 :
                                                                    Math.floor(data?.totalactivity) > 60 && Math.floor(data?.totalactivity) <= 80 ? 35 :
                                                                        Math.floor(data?.totalactivity) > 80 ? 75 : -108
                                                            }deg)`
                                                    }}>
                                                    <div className="needleContainerAlingment">
                                                        <div className="diamond"></div>
                                                        <div className="needlePointerMain"></div>
                                                        <OverlayTrigger placement="bottom" overlay={<Tooltip>{Math.floor(data?.totalactivity)} %</Tooltip>}>
                                                            <div className="needleScrewMain"></div>
                                                        </OverlayTrigger>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="timerAndTracking">
                            <div style={{ margin: "0 10px 0 0" }} className="timerLeft">
                                <div>
                                    <img width={120} src={logo} alt="" />
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                                    <p className="weekDayTimer">{formattedDate == todayDate ? days[currentDay] : days[clickDay]} </p>
                                    <p className="weekDayTimer">{formattedDate && formattedDate.split('-')[2]}</p>
                                    <p className="weekDateTimer">{formattedDate == todayDate ? months[currentMonth] : months[month]}</p>
                                    <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(data?.totalactivity)} %</Tooltip>}>
                                        <div className="circular-progress" style={{
                                            cursor: "pointer"
                                        }}>
                                            <CircularProgressBar activityPercentage={data?.totalactivity} size={30} />
                                        </div>
                                    </OverlayTrigger>
                                    <p className="timerClock">{data?.totalHours?.daily}</p>
                                    <p className="weekTimer">Week</p>
                                    <p className="weekTimerDigit">{data?.totalHours?.weekly}</p>
                                    <img src={circleDot} alt="CircleDot.png" />
                                    <p className="weekTimer">Month</p>
                                    <p className="monthTimerDigit">{data?.totalHours?.monthly}</p>
                                </div>
                            </div>
                            <div className="activity-image-container" style={{ margin: "0 0 0 10px" }}>
                                <div className="needle-container">
                                    <div className="needle"></div>
                                    <div className="dot"></div>
                                </div>
                                <img className="activity-image" src={activityImage} alt="" />
                            </div>
                        </div> */}
                        <div className="time-scale" style={{ display: "flex" }}>
                            {renderTimeIntervals()}
                        </div>
                        <div>
                            {data && (data?.groupedScreenshots?.map((element) => {
                                return (
                                    <div>
                                        {loading ? <Skeleton count={1} width="300px" height="34.5px" style={{ margin: "40px 0 0 0" }} /> : <div

                                            onClick={() => {
                                                console.log(element);
                                                setShowTrimActivity(true)
                                                setTrimActivity({
                                                    ...trimActivity,
                                                    timeentryId: element.timeentryId,
                                                    startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                    endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                })
                                                setSplitTime({
                                                    ...splitTime,
                                                    timeentryId: element.timeentryId,
                                                    startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                    endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                })
                                                setOfflineTime({
                                                    ...offlineTime,
                                                    timeentryId: element.timeentryId,
                                                    startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                    endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                })
                                                setStartTime(element.time.split(" ")[0] + " " + element.time.split(" ")[1])
                                                setEndTime(element.time.split(" ")[3] + " " + element.time.split(" ")[4])
                                            }}
                                            style={{ cursor: "pointer" }}
                                            className="timeZone" onMouseOver={() => setShowEditButton(true)} onMouseOut={() => setShowEditButton(false)}>
                                            <p className="timeDuration">{element.time}</p>
                                            <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(element?.totalactivity)} %</Tooltip>}>
                                                <div className="circular-progress" style={{ margin: "0 20px", cursor: "pointer" }}>
                                                    <CircularProgressBar activityPercentage={element?.totalactivity} size={30} />
                                                </div>
                                            </OverlayTrigger>
                                            {showEditButton && <img onClick={() => {
                                                console.log(element);
                                                setShowTrimActivity(true)
                                                setTrimActivity({
                                                    ...trimActivity,
                                                    timeentryId: element.timeentryId,
                                                    startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                    endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                })
                                                setSplitTime({
                                                    ...splitTime,
                                                    timeentryId: element.timeentryId,
                                                    startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                    endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                })
                                                setOfflineTime({
                                                    ...offlineTime,
                                                    timeentryId: element.timeentryId,
                                                    startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                    endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                })
                                                setStartTime(element.time.split(" ")[0] + " " + element.time.split(" ")[1])
                                                setEndTime(element.time.split(" ")[3] + " " + element.time.split(" ")[4])
                                            }} src={edit} alt="EditTimeZone.png" style={{ cursor: "pointer" }} />}
                                        </div>}
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                            gap: "20px",
                                        }}>
                                            {element?.screenshots && (element?.screenshots?.map((elements, index) => {
                                                return loading ? (
                                                    <Skeleton count={1} width="364px" height="248.44px" style={{ margin: "20px 0 12px 0" }} />
                                                ) : (
                                                    <div className="projectAdd" onMouseOver={() => setShowDeleteButton(true)} onMouseOut={() => setShowDeleteButton(false)}>
                                                        <div className="timelineDiv">
                                                            <div>
                                                                <OverlayTrigger placement="top" overlay={<Tooltip>{elements?.description}</Tooltip>}>
                                                                    <p className="notes">
                                                                        <a className="websiteLink" href="#">{elements?.time} {elements?.description}</a>
                                                                    </p>
                                                                </OverlayTrigger>
                                                            </div>
                                                            <div style={{ display: "flex" }}>
                                                                <img src={deleteIcon} alt="" style={{ marginRight: 5 }} onClick={() => handleOpenDeleteModal(element, elements)} />
                                                                {elements?.visitedUrls?.length === 0 ?
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>0 %</Tooltip>}>
                                                                        <div className="circular-progress">
                                                                            <CircularProgressBar activityPercentage={0} size={30} emptyUrl={0} />
                                                                        </div>
                                                                    </OverlayTrigger>
                                                                    :
                                                                    elements?.visitedUrls?.map((e) => {
                                                                        return e?.activityPercentage === 0 ? (
                                                                            <OverlayTrigger placement="top" overlay={<Tooltip>0 %</Tooltip>}>
                                                                                <div className="circular-progress">
                                                                                    <CircularProgressBar activityPercentage={0} size={30} emptyUrl={0} />
                                                                                </div>
                                                                            </OverlayTrigger>
                                                                        ) : (
                                                                            <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(e?.activityPercentage)} %</Tooltip>}>
                                                                                <div className="circular-progress">
                                                                                    <CircularProgressBar activityPercentage={e?.activityPercentage} size={30} />
                                                                                </div>
                                                                            </OverlayTrigger>
                                                                        )
                                                                    })}
                                                            </div>
                                                        </div>
                                                        <div className="screenShotImg">
                                                            <img className="screenshotiimage" onClick={() => openModal(element, elements?.key, index)} src={elements?.key} alt="ScreenShotImg.png" />
                                                        </div>
                                                    </div>
                                                )
                                            }))}
                                            {selectedImage && (
                                                <div className="fullscreen-screenshot-model">
                                                    <div style={{ margin: "20px 20px 0 20px", textAlign: "right" }}>
                                                        <ImCross size={20} color="white" onClick={closeModal} />
                                                    </div>
                                                    <div className="ss-image">
                                                        <div className="d-flex align-items-center gap-5">
                                                            <div
                                                                onClick={() => {
                                                                    goBackToPreviousImage(element.screenshots)
                                                                }}>
                                                                <img width={40} src={leftArrow} />
                                                            </div>
                                                            <div>
                                                                <img className="modalImage" src={selectedImage} alt="Pop-up Image" />
                                                            </div>
                                                            <div
                                                                onClick={() => {
                                                                    goToNextImage(element.screenshots)
                                                                }}>
                                                                <img width={40} src={rightArrow} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            }))}
                        </div>

                        {/* <div className="historyButton">
                            <img className="historyImg" src={historyIcon} alt="HistoryIcon.png" />
                            <p className="historyOfChanges">History of Changes</p>
                        </div> */}
                    </div>
                </div>
                <img className="userDetailLine" src={line} />
            </div>
        </div>
    )
}

export default CompanyIndividualUser;