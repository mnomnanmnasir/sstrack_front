import React, { useEffect, useRef, useState } from "react";
import circle from "../images/online.webp";
import setting from "../images/setting.webp";
import left from "../images/Leftarrow.webp";
import right from "../images/Rightarrow.webp";
import circleDot from "../images/CircleDot.webp";
import line from "../images/line.webp";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import leftArrow from "../images/left-arrow.png"
import rightArrow from "../images/right-arrow.png"
import CircularProgressBar from "./component/circularProgressBar";
import activityImage from "../images/activity-level.svg"
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import useLoading from "../hooks/useLoading";
import axios from "axios";
import logo from '../images/app-logo-white.svg'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import deleteIcon from '../images/delete.svg'
import brushIcon from '../images/brush.svg'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import BackToTop from "./component/backToTop";
import Modal from 'react-bootstrap/Modal';
import perc_20 from "../images/Red.svg"
import perc_40 from "../images/Orange.svg"
import perc_60 from "../images/Yellow.svg"
import perc_80 from "../images/LightGreen.svg"
import perc_100 from "../images/FullGreen.svg"
import { ImCross } from "react-icons/im";
import edit from '../images/EditTimeZone.webp';
import moment from "moment-timezone";
import { useSocket } from '../io'; // Correct import
import { useSelector, useDispatch } from 'react-redux';
import { setEmployessSetting } from "../store/adminSlice"; // Adjust the import based on your file structure
import Payment from "./paymentPlan";
import jwtDecode from "jwt-decode";
import Joyride from "react-joyride";
import { useMediaQuery, useTheme } from '@mui/material';

function UserDetails() {


    const dispatch = useDispatch();
    const employees = useSelector((state) => state.adminSlice.employess);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // md = 960px

    const [allowBlur, setAllowBlur] = useState(true);

    useEffect(() => {
        if (!Array.isArray(employees)) return; // Ensure employees is an array before calling find()

        const employeeWithBlur = employees.find(employee =>
            employee?.effectiveSettings?.screenshots?.allowBlur
        );

        setAllowBlur(!!employeeWithBlur);
    }, [employees]);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Mock authentication check (replace with your actual logic)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true); // User is logged in
        } else {
            setIsLoggedIn(false); // User is not logged in
        }
    }, []);



    async function handleApplySetting(data) {

        console.log(data);
        const findUser = employees.find((f) => f.effectiveSettings[data.key] === false)
        try {
            const res = await axios.patch(
                `https://myuniversallanguages.com:9093/api/v1/owner/settingsE/${data.employee._id}`,
                {
                    userId: data.employee._id,
                    effectiveSettings: {
                        ...findUser?.effectiveSettings,
                        [data.key]: data.isSelected,
                        userId: data.employee._id
                    }
                },
                {
                    headers
                }
            );

            if (res.status === 200) {
                enqueueSnackbar("Employee settings updated", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            } else {
                enqueueSnackbar("Failed to update employee settings", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            }
            console.log(res);
            // const employeeId = ssId; // Assuming ssId corresponds to employee ID
            const updatedAllowBlur = true; // Set to true since the screenshot is blurred
            // Dispatch the action to update the Redux state
            dispatch(setEmployessSetting({
                id: data.employee._id,
                checked: data.isSelected, // For enabling/disabling
                allowBlur: data.isSelected // Update allowBlur
            }));
            setAllowBlur(data.isSelected); // Update local state

        } catch (error) {
            console.error("Error updating employee settings:", error);
            // enqueueSnackbar("An error occurred while updating employee settings", {
            //     variant: "error",
            //     anchorOrigin: {
            //         vertical: "top",
            //         horizontal: "right"
            //     }
            // });
        }
    }

    const { loading, setLoading } = useLoading()
    const [run, setRun] = useState(true);
    const [data, setData] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [ssData, setSSData] = useState(null);
    const [totalActivityByDay, setTotalActivityByDay] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeButton, setActiveButton] = useState(null);
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const today = new Date().getFullYear();
    const [clickDay, setClickDay] = useState()
    const [month, setMonth] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [timeEntryId, setTimeEntryId] = useState(null)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const [splitTime, setSplitTime] = useState(null)
    const [offlineTime, setOfflineTime] = useState(null)
    const socket = useSocket()

    const [trimActivity, setTrimActivity] = useState(null)
    const [screenshotId, setScreenshotId] = useState(null)
    const [showSplitActivity, setShowSplitActivity] = useState(false)
    const [showTrimActivity, setShowTrimActivity] = useState(false)
    const [showOfflineTime, setShowOfflineTime] = useState(false)
    const [showDeleteButton, setShowDeleteButton] = useState(false)
    const [showEditButton, setShowEditButton] = useState(false)

    const [timeEntries, setTimeEntries] = useState([]);

    const [totalPercentageByDay, setTotalPercentageByDay] = useState(null)
    // const [activeMonth, setActiveMonth] = useState(new Date().toLocaleDateString())
    const [activeMonth, setActiveMonth] = useState(new Date().toLocaleDateString('en-CA'));

    const [timeTrackingId, setTimeTrackingId] = useState(null)

    const currentMonths = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const currentDate = new Date().getDate().toString().padStart(2, '0');
    const todayDate = `${today}-${currentMonths}-${currentDate}`;
    const [formattedDate, setFormattedDate] = useState(todayDate);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
    const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [deleteActivity, setDeleteActivity] = useState(false)
    const [note, setNote] = useState('');
    const noteRef = useRef(note);

    const handleInputChange = (event) => {
        setNote(event.target.value);
        noteRef.current = event.target.value;
    };

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    let token = localStorage.getItem('token');
    let items = jwtDecode(token);
    let headers = {
        Authorization: "Bearer " + token,
    }
    const params = useParams()
    const apiUrl2 = "https://ss-track.vercel.app/api/v1/owner";
    const userId = params.id;


    const steps = [
        {
            target: '#activity-tracker',
            content: 'here you can see each day activity ',
            disableBeacon: true,
            continuous: true,
        },
        {
            target: '#secondStep',
            content: 'Here you can see your hours you work, your ativity percentage and date',
            continuous: true,
        },
        {
            target: '#Thirdstep',
            content: 'Here you see your active hours,',
            continuous: true,
        },
        {
            target: '#screenshots',
            content: 'Here you your screen shot which you can delete,',
            continuous: true,
        },
    ];

    const handleJoyrideCallback = (data) => {
        const { index, status } = data;


        if (status === "finished" || status === "skipped") {
            setRun(false); // End the tour when finished
        }
    };
    const handleStartTimeChange = (e) => {
        let value = e.target.value;
        const isValidFormat = !!parseTime(value); // Check if the time is valid

        setOfflineTime((prev) => ({
            ...prev,
            startTime: value,
            startTimeError: value && !isValidFormat, // Show error if invalid
            rangeError: value && prev.endTime && !isValidRange(value, prev.endTime),
        }));
    };

    const handleEndTimeChange = (e) => {
        let value = e.target.value;
        const isValidFormat = !!parseTime(value); // Check if the time is valid

        setOfflineTime((prev) => ({
            ...prev,
            endTime: value,
            endTimeError: value && !isValidFormat, // Show error if invalid
            rangeError: value && prev.startTime && !isValidRange(prev.startTime, value),
        }));
    };


    const parseTime = (time) => {
        if (!time) return null; // Return null if time is empty or undefined

        const matches = time.match(/(\d+):(\d+)\s?(AM|PM)/i); // Match time format
        if (!matches) return null; // Return null if the format is invalid

        const [hours, minutes, meridian] = matches.slice(1); // Extract matched groups
        let hours24 = parseInt(hours, 10);
        if (meridian.toUpperCase() === "PM" && hours24 !== 12) hours24 += 12;
        if (meridian.toUpperCase() === "AM" && hours24 === 12) hours24 = 0;

        return { hours: hours24, minutes: parseInt(minutes, 10) };
    };

    // Helper function to validate time range
    const isValidRange = (start, end) => {
        const startParsed = parseTime(start);
        const endParsed = parseTime(end);

        // If either time is invalid, range cannot be valid
        if (!startParsed || !endParsed) return false;

        const startMinutes = startParsed.hours * 60 + startParsed.minutes;
        const endMinutes = endParsed.hours * 60 + endParsed.minutes;

        return endMinutes > startMinutes; // Valid if end is greater than start
    };

    // const fetchData = async () => {
    //     setLoading(true);
    //     try {
    //         if (items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager") {
    //             const [screenshotsResponse, activitiesResponse, hoursResponse] = await Promise.all([
    //                 axios.get(`${apiUrl}/owner/sorted-screenshots/${userId}?date=${formattedDate}`, { headers }),
    //                 axios.get(`${apiUrl}/owner/sorted-activities/${userId}?date=${formattedDate}`, { headers }),
    //                 axios.get(`${apiUrl}/owner/sorted-hours/${userId}?date=${formattedDate}`, { headers })
    //             ]);
    //             const screenshotsData = screenshotsResponse.data;
    //             const activitiesData = activitiesResponse.data;
    //             const hoursData = hoursResponse.data;
    //             setData(hoursData.data);
    //             setTotalActivityByDay(activitiesData.data);
    //             setTimeEntryId(hoursData.data.TimeTrackingId);
    //             setTimeTrackingId(hoursData.data.TimeTrackingId);
    //             setTimeEntries(screenshotsData.data.groupedScreenshots || []);
    //             setTrimActivity({ ...trimActivity, totalHours: hoursData.data.totalHours.daily });
    //             // Clear data if no screenshots are available
    //             if (!screenshotsData.data?.groupedScreenshots?.length) {
    //                 setTimeEntries([]);
    //             }
    //         } else {
    //             const response = await axios.get(`${apiUrl}/timetrack/sorted-screenshot?date=${encodeURIComponent(formattedDate)}`, { headers });
    //             if (response.data) {

    //                 console.log(response);
    //                 setData(response.data.data);
    //                 setTimeEntryId(response.data.data.TimeTrackingId);
    //                 setTimeTrackingId(response.data.data.TimeTrackingId);
    //                 setTimeEntries(response?.data?.data?.groupedScreenshots || []);
    //                 setTrimActivity({ ...trimActivity, totalHours: response?.data?.data?.totalHours.daily });
    //             }
    //             // Clear data if no screenshots are available
    //             if (!response.data?.data?.groupedScreenshots?.length) {
    //                 setTimeEntries([]);
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const fetchData = async () => {
        setLoading(true);
        try {
            // const userId = items?._id; // ✅ Fix: Extract userId from decoded token

            const userId = items?.userType === "user" ? items?._id : params?.id; // ✅ fixed logic
            if (items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager") {
                const [screenshotsResponse, activitiesResponse, hoursResponse] = await Promise.all([
                    axios.get(`${apiUrl}/owner/sorted-screenshots/${userId}?date=${formattedDate}`, { headers }),
                    axios.get(`${apiUrl}/owner/sorted-activities/${userId}?date=${formattedDate}`, { headers }),
                    axios.get(`${apiUrl}/owner/sorted-hours/${userId}?date=${formattedDate}`, { headers })
                ]);
                const screenshotsData = screenshotsResponse.data;
                const activitiesData = activitiesResponse.data;
                const hoursData = hoursResponse.data;

                setData(hoursData.data || []);
                setTotalActivityByDay(activitiesData.data || []);
                setTimeEntryId(hoursData.data?.TimeTrackingId || null);
                setTimeTrackingId(hoursData.data?.TimeTrackingId || null);
                setTimeEntries(screenshotsData.data?.groupedScreenshots || []);

                // Clear data if no screenshots are available
                if (!screenshotsData.data?.groupedScreenshots?.length) {
                    setTimeEntries([]);
                }
            } else {
                const response = await axios.get(`${apiUrl}/timetrack/sorted-screenshot?date=${encodeURIComponent(formattedDate)}`, { headers });
                setData(response.data?.data || []);
                setTimeEntryId(response.data?.data?.TimeTrackingId || null);
                setTimeTrackingId(response.data?.data?.TimeTrackingId || null);
                setTimeEntries(response.data?.data?.groupedScreenshots || []);

                // Clear data if no screenshots are available
                if (!response.data?.data?.groupedScreenshots?.length) {
                    setTimeEntries([]);
                }
            }
        } catch (error) {
            console.error(error);
            setTimeEntries([]); // Clear screenshots in case of error
        } finally {
            setLoading(false);
        }
    };

    // const fetchData = async () => {
    //     if (items?.userType === "admin" || items?.userType === "owner" || items?.userType === "manager") {
    //         try {
    //             const response = await axios.get(`${apiUrl}/owner/sorted-datebased/${params.id}?date=${encodeURIComponent(formattedDate)}`, { headers });
    //             setLoading(true)
    //             if (response.data) {
    //                 setTimeout(() => {
    //                     setLoading(false)
    //                 }, 2000);
    //                 const screenshotsData = screenshotsResponse.data;
    //                 const activitiesData = activitiesResponse.data;
    //                 setData(response.data.data);
    //                 setTimeEntryId(response.data.data.TimeTrackingId)
    //                 setTimeTrackingId(response.data.data.TimeTrackingId)
    //                 setTimeEntries(screenshotsData.data.groupedScreenshots || []);
    //                 setTrimActivity({ ...trimActivity, totalHours: response?.data?.data?.totalHours.daily })
    //                 console.log(response);
    //             }
    //         }
    //         catch (error) {
    //             setTimeout(() => {
    //                 setLoading(false)
    //             }, 2000);
    //             console.log(error);
    //         }
    //         return;
    //     }
    //     try {
    //         const response = await axios.get(`${apiUrl}/timetrack/sorted-screenshot?date=${encodeURIComponent(formattedDate)}`, { headers });
    //         setLoading(true)
    //         if (response.data) {
    //             setTimeout(() => {
    //                 setLoading(false)
    //             }, 3000);
    //             setData(response.data.data);
    //             setTimeEntryId(response.data.data.TimeTrackingId)
    //             setTimeTrackingId(response.data.data.TimeTrackingId)
    //             setTimeEntries(response?.data?.data?.groupedScreenshots || []);
    //             setTrimActivity({ ...trimActivity, totalHours: response?.data?.data?.totalHours.daily })
    //             console.log(response);
    //         }
    //     }
    //     catch (error) {
    //         setTimeout(() => {
    //             setLoading(false)
    //         }, 3000);
    //         console.log(error);
    //     }
    // };

    useEffect(() => {
        if (!socket) {
            console.error('Socket instance is null or undefined');
            return;
        }

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });


        const handleUpdateData = () => {
            // console.log('Received updateData event');
            // fetchData();
        };

        socket.on('new-ss', handleUpdateData);

        return () => {
            socket.off('new-ss', handleUpdateData);
        };
    }, [socket]);

    useEffect(() => {
        fetchData();
    }, [formattedDate]);

    useEffect(() => {
        fetchData();
    }, [userId]);

    const navigate = useNavigate("")

    const isValidTimeFormat = (timeString) => {
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/i;
        return timeRegex.test(timeString);
    }

    // const prevMonth = () => {
    //     setDate((prevDate) => {
    //         const prevMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
    //         setActiveMonth(prevMonthDate.toLocaleDateString())
    //         setTotalPercentageByDay(null)
    //         // setTotalHoursByDay(null);
    //         return prevMonthDate;
    //     });
    // };

    // const nextMonth = () => {
    //     setDate((prevDate) => {
    //         const nextMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
    //         setActiveMonth(nextMonthDate.toLocaleDateString())
    //         setTotalPercentageByDay(null)
    //         // setTotalHoursByDay(null);
    //         return nextMonthDate;
    //     });
    // };
    const prevMonth = () => {
        setDate((prevDate) => {
            const prevMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
            const clickDay = prevMonthDate.getDate().toString().padStart(2, "0");
            const clickMonth = (prevMonthDate.getMonth() + 1).toString().padStart(2, "0");
            const formattedDate = `${prevMonthDate.getFullYear()}-${clickMonth}-${clickDay}`;
            // setFormattedDate(formattedDate);
            setFormattedDate(`${prevMonthDate.getFullYear()}-${(prevMonthDate.getMonth() + 1).toString().padStart(2, "0")}-01`);
            setMonth(prevMonthDate.getMonth());
            // setActiveMonth(prevMonthDate.toLocaleDateString());
            setActiveMonth(prevMonthDate.toLocaleDateString('en-CA')); // yyyy-MM-dd format

            setTotalPercentageByDay(null);

            return prevMonthDate;
        });
    };

    const nextMonth = () => {
        setDate((prevDate) => {
            const nextMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
            const clickDay = nextMonthDate.getDate().toString().padStart(2, "0");
            const clickMonth = (nextMonthDate.getMonth() + 1).toString().padStart(2, "0");
            const formattedDate = `${nextMonthDate.getFullYear()}-${clickMonth}-${clickDay}`;
            // setFormattedDate(formattedDate);
            setFormattedDate(`${nextMonthDate.getFullYear()}-${(nextMonthDate.getMonth() + 1).toString().padStart(2, "0")}-01`);
            setMonth(nextMonthDate.getMonth());
            // setActiveMonth(nextMonthDate.toLocaleDateString());
            setActiveMonth(nextMonthDate.toLocaleDateString('en-CA')); // yyyy-MM-dd format

            setTotalPercentageByDay(null);
            return nextMonthDate;
        });
    };

    // Get formatted values for display
    // const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    // const formattedDate = `${currentYear}-${currentMonth + 1 < 10 ? "0" : ""}${currentMonth + 1}-01`;

    const goBackToPreviousImage = () => {
        if (selectedImageIndex >= 0) {
            setSelectedImageIndex(selectedImageIndex - 1)
        }
        else {
            setSelectedImage(null);
            setSelectedImageIndex(null)
            setSSData(null)
        }
    };

    const goToNextImage = () => {
        if (selectedImageIndex < ssData?.screenshots?.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1)
        }
        else {
            setSelectedImage(null);
            setSelectedImageIndex(null)
            setSSData(null)
        }
    };

    const openModal = (element, imageSrc, index) => {
        setSelectedImage(imageSrc);
        setSelectedImageIndex(index)
        setSSData(element)
    };




    const renderCalendar = () => {
        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const currentDate = new Date(); // Get the current date
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
            setClickDay(clickDa);
            setMonth(clickMon);
            const formattedDate = `${clickDay}-${clickMonth}-${clickDate}`;
            setFormattedDate(formattedDate);
            setActiveButton(key);
        };

        for (let i = 0; i < daysInMonth; i++) {
            const isWeekend = currentDay.getDay() === 0 || currentDay.getDay() === 6;
            const dayKey = currentDay.toString();
            const isCurrentDate =
                currentDay.getDate() === currentDate.getDate() &&
                currentDay.getMonth() === currentDate.getMonth() &&
                currentDay.getFullYear() === currentDate.getFullYear();

            // Determine if the current day is in the current month or earlier
            const isCurrentOrPastMonth =
                currentDay.getFullYear() < currentDate.getFullYear() ||
                (currentDay.getFullYear() === currentDate.getFullYear() &&
                    currentDay.getMonth() <= currentDate.getMonth());
            // Determine if the current day is in the current month or earlier
            // const isCurrentOrPastMonth =true
            console.log('truth or dare', isCurrentOrPastMonth);


            const dayFormatted = `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1).toString().padStart(2, '0')}-${currentDay.getDate().toString().padStart(2, '0')}`;

            // Check if data.totalHours.daily is an array and find the total hours for the specific date
            const totalHoursForDate = Array.isArray(data?.totalHours?.daily)
                ? data?.totalHours?.daily.find(item => item.date === dayFormatted)?.data?.totalHours?.daily
                : 0; // Default to 0 if not an array or if no match is found

            days.push(
                <div
                    style={{
                        cursor: "pointer",
                        border: "1px solid #ebeaea",
                    }}
                    className={`col cell ${isWeekend ? "week day week first" : "day"} ${dayKey === activeButton ? "active" : isCurrentDate ? "active2" : ""}`}
                    onClick={() => handleClick(dayKey)}
                >
                    <p className="weekName">{currentDay.toLocaleString("en-US", { weekday: "short" })}</p>
                    <p className="Weekdate">{currentDay.getDate()}</p>
                    <div style={{ padding: "2px" }}>

                        <div
                            style={{
                                width: `${totalPercentageByDay ? totalPercentageByDay[i]?.percentage : 0}%`,
                                background: isCurrentOrPastMonth
                                    ? "linear-gradient(180deg,#cdeb8e 0,#a5c956)"
                                    : "transparent",
                                height: "10px",
                            }}
                        ></div>
                    </div>
                </div>
            );

            currentDay.setDate(currentDay.getDate() + 1);
        }

        weeks.push(<div className="days" key={currentDay}>{days}</div>);
        return weeks;
    };

    const closeModal = () => {
        setSelectedImage(null);
        setSSData(null)
        setSelectedImageIndex(null)
    };

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

    const renderTimeIntervals = () => {
        const intervals = [];

        for (let hour = 0; hour <= 23; hour++) {
            const isPM = hour >= 12;
            const formattedHour = hour <= 12 ? hour : hour - 12;

            intervals.push(
                <div key={hour} className="time-slot" >
                    <div className="hour-color"
                    // style={{width:'12px'}}
                    >
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
        const matchingEntry = timeEntries.find(entry => {
            const [startTime, endTime] = entry?.time?.split(' - ');
            const startTimeFormatted = new Date(`${encodeURIComponent(formattedDate)} ${startTime}`).getTime();
            const endTimeFormatted = new Date(`${encodeURIComponent(formattedDate)} ${endTime}`).getTime();
            const currentTimeFormatted = new Date(`${encodeURIComponent(formattedDate)} ${time}`).getTime();
            return currentTimeFormatted >= startTimeFormatted && currentTimeFormatted <= endTimeFormatted;
        });
        return matchingEntry ? "#A8C96A" : '#EFF9EC';
    };


    // async function getAllDays() {
    //     try {
    //         const userId = items?._id;
    //         const isUser = items?.userType === "user";
    //         const idToUse = isUser ? userId : params?.id || userId; // ✅ FIXED
    
    //         const url = isUser
    //             ? `${apiUrl}/timetrack/hoursbyday?date=${activeMonth}`
    //             : `${apiUrl}/owner/hoursbyday/${idToUse}?date=${activeMonth}`;
    
    //         const response = await axios.get(url, { headers });
    
    //         const totalHours = response.data.data.totalHoursByDay;
    //         console.log("totalHours of active month", response.data);
    
    //         const currentDate = new Date();
    //         const maxHours = 8;
    //         let percentagesByDay = [];
    
    //         const processMonth = (totalHours, month, year) => {
    //             const filteredHours = totalHours.filter(th => {
    //                 const [day, mon, yr] = th.date.split('-');
    //                 return mon.padStart(2, '0') === month && yr === year;
    //             });
    
    //             filteredHours.forEach(th => {
    //                 const match = th.totalHours.match(/(\d+)h\s*(\d*)m/);
    //                 let totalMinutes = 0;
    
    //                 if (match) {
    //                     const hours = parseInt(match[1], 10) || 0;
    //                     const minutes = parseInt(match[2], 10) || 0;
    //                     totalMinutes = hours * 60 + minutes;
    //                 }
    
    //                 const percentage = Math.min((totalMinutes / (maxHours * 60)) * 100, 100);
    
    //                 percentagesByDay.push({
    //                     date: th.date,
    //                     totalMinutes,
    //                     totalHours: th.totalHours,
    //                     percentage,
    //                     percentageExact: percentage,
    //                 });
    //             });
    //         };
    
    //         const currentYear = currentDate.getFullYear();
    //         let isFirstMonthProcessed = false;
    
    //         for (let year = currentYear; year >= 2023; year--) {
    //             for (let month = 12; month >= 1; month--) {
    //                 processMonth(totalHours, month.toString().padStart(2, '0'), year.toString());
    //                 if (month === 1 && !isFirstMonthProcessed) {
    //                     isFirstMonthProcessed = true;
    //                     break;
    //                 }
    //             }
    //         }
    
    //         console.log('PERCENTAGES', percentagesByDay);
    //         setTotalPercentageByDay(percentagesByDay);
    //     } catch (error) {
    //         console.log("Error in getAllDays:", error);
    //     }
    // }

    async function getAllDays() {
        try {
            const userId = items?._id;
            const isUser = items?.userType === "user";
            const idToUse = isUser ? userId : params?.id || userId; // ✅ FIXED
    
            const url = isUser
                ? `${apiUrl}/timetrack/hoursbyday?date=${activeMonth}`
                : `${apiUrl}/owner/hoursbyday/${idToUse}?date=${activeMonth}`;
    
            const response = await axios.get(url, { headers });
    
            const totalHours = response.data.data.totalHoursByDay;
            console.log("totalHours of active month", response.data);
    
            const currentDate = new Date();
            const maxHours = 8;
            let percentagesByDay = [];
    
            const processMonth = (totalHours, month, year) => {
                const filteredHours = totalHours.filter(th => {
                    const [day, mon, yr] = th.date.split('-');
                    return mon.padStart(2, '0') === month && yr === year;
                });
    
                filteredHours.forEach(th => {
                    const match = th.totalHours.match(/(\d+)h\s*(\d*)m/);
                    let totalMinutes = 0;
    
                    if (match) {
                        const hours = parseInt(match[1], 10) || 0;
                        const minutes = parseInt(match[2], 10) || 0;
                        totalMinutes = hours * 60 + minutes;
                    }
    
                    const percentage = Math.min((totalMinutes / (maxHours * 60)) * 100, 100);
    
                    percentagesByDay.push({
                        date: th.date,
                        totalMinutes,
                        totalHours: th.totalHours,
                        percentage,
                        percentageExact: percentage,
                    });
                });
            };
    
            const currentYear = currentDate.getFullYear();
            let isFirstMonthProcessed = false;
    
            for (let year = currentYear; year >= 2023; year--) {
                for (let month = 12; month >= 1; month--) {
                    processMonth(totalHours, month.toString().padStart(2, '0'), year.toString());
                    if (month === 1 && !isFirstMonthProcessed) {
                        isFirstMonthProcessed = true;
                        break;
                    }
                }
            }
    
            console.log('PERCENTAGES', percentagesByDay);
            setTotalPercentageByDay(percentagesByDay);
        } catch (error) {
            console.log("Error in getAllDays:", error);
        }
    }    


    useEffect(() => {
        getAllDays()
    }, [activeMonth]);

    const handleOpenDeleteModal = (element, elements) => {
        setShowDeleteModal(true)
        setScreenshotId(elements._id)
    }

    useEffect(() => {
        if (offlineTime?.startTime && offlineTime?.endTime) {
            const parseTime = (time) => {
                if (!time) return null; // Handle null or undefined input
                const match = time.match(/(\d+):(\d+)\s?(AM|PM)/i); // Match the time format
                if (!match) return null; // Handle invalid formats

                const [hours, minutes, meridian] = match.slice(1); // Safely extract matched groups
                let hours24 = parseInt(hours, 10);
                if (meridian.toUpperCase() === "PM" && hours24 !== 12) hours24 += 12;
                if (meridian.toUpperCase() === "AM" && hours24 === 12) hours24 = 0;
                return { hours: hours24, minutes: parseInt(minutes, 10) };
            };

            const start = parseTime(offlineTime.startTime);
            const end = parseTime(offlineTime.endTime);

            if (start && end) {
                const startMinutes = start.hours * 60 + start.minutes;
                const endMinutes = end.hours * 60 + end.minutes;

                if (endMinutes > startMinutes) {
                    const totalMinutes = endMinutes - startMinutes;
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    setOfflineTime((prev) => ({
                        ...prev,
                        totalHours: `${hours}h ${minutes}m`,
                    }));
                } else {
                    setOfflineTime((prev) => ({
                        ...prev,
                        totalHours: "Invalid range",
                    }));
                }
            } else {
                setOfflineTime((prev) => ({
                    ...prev,
                    totalHours: "Invalid time format",
                }));
            }
        } else {
            setOfflineTime((prev) => ({
                ...prev,
                totalHours: "0h 0m",
            }));
        }
    }, [offlineTime?.startTime, offlineTime?.endTime]);

    const handleDeleteSS = async () => {
        setShowDeleteModal(false)
        try {
            const response = await axios.delete(`${apiUrl}/timetrack/deleteScreenshot/${screenshotId}/TimeTracking/${timeEntryId}`, {
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
            }
            fetchData()
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
                userId: params.id,
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
                fetchData()
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const offsetInMinutes = moment.tz(items?.timezone).utcOffset();
    const offsetInHours = offsetInMinutes / 60;
    const offsetSign = offsetInHours >= 0 ? '+' : '-';
    const formattedOffset = `${offsetSign}${Math.abs(offsetInHours)}`;

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
                const response = await axios.patch(`${apiUrl}/superAdmin/trim-activity/${params.id}/${timeEntryId}`, {
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

    const handleAddOfflineTime = async () => {
        setShowOfflineTime(false);
        setShowSplitActivity(false);
        setShowTrimActivity(false);

        const userId = items?.userType === "user" ? items._id : params?.id;

        if (!userId) {
            enqueueSnackbar("User ID missing!", { variant: "error" });
            return;
        }

        const startTime = formattedDate + " " + offlineTime?.startTime;
        const endTime = formattedDate + " " + offlineTime?.endTime;

        console.log('Submitting Offline Time:', {
            startTime,
            endTime,
            projectId: "643fb528272a1877e4fcf30e",
            notes: note,
            userId
        });

        if (!isValidTimeFormat(offlineTime?.startTime) || !isValidTimeFormat(offlineTime?.endTime)) {
            setShowOfflineTime(true);
            enqueueSnackbar("Invalid time format", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/superAdmin/offline-time/${userId}`, {
                startTime: formattedDate + " " + offlineTime?.startTime,
                endTime: formattedDate + " " + offlineTime?.endTime,
                projectId: "643fb528272a1877e4fcf30e",
                notes: note
            }, {
                headers: { Authorization: 'Bearer ' + token }
            });

            if (response.status === 200) {
                enqueueSnackbar("Offline time added", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });
                console.log("Success:", response.data);
            }
        } catch (error) {
            console.error("API Error:", error?.response?.data || error);
            enqueueSnackbar("Failed to add offline time", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        }
    };


    const handleDivClick = () => {
        setDeleteActivity(!deleteActivity);
    };

    async function handleBlurSS(timeEntId, ssId) {
        if (items.userType === "user") {
            setData((prevData) => {
                return {
                    ...prevData,
                    groupedScreenshots: prevData.groupedScreenshots.map((groupSS, ind) => {
                        if (groupSS.timeentryId === timeEntId) {
                            return {
                                ...groupSS,
                                screenshots: groupSS.screenshots.map((ss) => {
                                    if (ss._id === ssId) {
                                        return {
                                            ...ss,
                                            screenshot: {
                                                ...ss.screenshot,
                                                blur: true
                                            }
                                        };
                                    }
                                    return ss;
                                })
                            };
                        }
                        return groupSS;
                    })
                };
            });
            try {
                const response = await axios.post(`${apiUrl}/timetrack/blur/${ssId}/TimeTracking/${data?.TimeTrackingId}`, {}, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                if (response.status === 200) {
                    enqueueSnackbar("Screenshot blurred successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    });

                    // Update allowBlur state for this employee
                    const employeeId = ssId; // Assuming ssId corresponds to employee ID
                    const updatedAllowBlur = true; // Set to true since the screenshot is blurred
                    dispatch(setEmployessSetting({
                        id: employeeId,
                        allowBlur: updatedAllowBlur
                    }));
                    setAllowBlur(updatedAllowBlur); // Update local state
                    // props.updateAllowBlur(updatedAllowBlur); // Update parent component state

                    // Call handleApplySettings function to update employee settings
                    handleApplySetting(employeeId, "setting3", true);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            setTimeEntries((prevData) => {
                return prevData.map((f) => {
                    return {
                        ...f,
                        screenshots: f.screenshots.map((ss) => {
                            if (ss._id === ssId) {
                                return {
                                    ...ss,
                                    screenshot: {
                                        ...ss.screenshot,
                                        blur: true
                                    }
                                };
                            }
                            return ss;
                        })
                    };
                });
            });
            try {
                const response = await axios.post(`${apiUrl}/timetrack/blur/${ssId}/TimeTracking/${timeTrackingId}`, {}, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                });
                if (response.status === 200) {
                    enqueueSnackbar("Screenshot blurred successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    });
                    // Update allowBlur state for this employee if needed
                    const updatedAllowBlur = true; // Set to true since the screenshot is blurred
                    dispatch(setEmployessSetting({
                        id: ssId, // Assuming ssId corresponds to employee ID
                        allowBlur: updatedAllowBlur
                    }));
                    setAllowBlur(updatedAllowBlur); // Update local state
                    // props.updateAllowBlur(updatedAllowBlur); // Update parent component state
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    console.log('', timeEntries);

    // Get the current month and year
    // const currentMonth = date.getMonth();
    // const currentYear = date.getFullYear();

    // // Get the first day of the new month for display
    // const formattedDate = `${currentYear}-${currentMonth + 1 < 10 ? "0" : ""}${currentMonth + 1}-01`;
    const currentWeekDay = date.getDay();
    const selectedDayIndex = new Date(formattedDate).getDay(); // 0-6 (Sun-Sat)

    return (
        <>
            <div className="mobhayat">

                {items._id === "679b223b61427668c045c659" && (
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
                                <textarea
                                    placeholder="Note (optional)"
                                    rows="5"
                                    value={noteRef.current}
                                    onChange={handleInputChange}
                                />
                                {/* <textarea placeholder="Note (optional)" name='note' rows="5" ></textarea> */}
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
                                    You will be able to edit or delete it from there.
                                </p>
                                {offlineTime?.startTimeError && (
                                    <p style={{ color: "red", fontWeight: "bold" }}>Invalid start time format. Please use 'HH:mm AM/PM'.</p>
                                )}
                                {offlineTime?.endTimeError && (
                                    <p style={{ color: "red", fontWeight: "bold" }}>Invalid end time format. Please use 'HH:mm AM/PM'.</p>
                                )}
                                {offlineTime?.rangeError && (
                                    <p style={{ color: "red", fontWeight: "bold" }}>End time must be greater than start time.</p>
                                )}
                                <div className="editboxinputdiv">
                                    <input
                                        onChange={handleStartTimeChange}
                                        value={offlineTime?.startTime}
                                        placeholder="Start Time (e.g., 7:00 AM)"
                                        style={{
                                            borderColor: offlineTime?.startTimeError ? "red" : "",
                                        }}
                                    />
                                    -
                                    <input
                                        onChange={handleEndTimeChange}
                                        value={offlineTime?.endTime}
                                        placeholder="End Time (e.g., 9:00 PM)"
                                        style={{
                                            borderColor: offlineTime?.endTimeError ? "red" : "",
                                        }}
                                    />
                                    <p>-{offlineTime?.totalHours ? offlineTime?.totalHours : "0h 0m"}</p>
                                </div>

                                <p className="sevenAm">e.g., 7am to 9:10am or 17:30 to 22:00</p>
                                <div>
                                    <select className="projectOption">
                                        <option>I8IS</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Note (optional)"
                                    rows="5"
                                    value={note}
                                    onChange={handleInputChange}
                                />
                                {/* <textarea placeholder="Note (optional)" rows="5"></textarea> */}
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
                                            navigate("/account")
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="userMainContent">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <img src={left} onClick={prevMonth} alt="Previous Month" />
                                        <h2 className="monthName">{date.toLocaleString("en-US", { month: "long", year: "numeric" })}</h2>
                                        <img src={right} onClick={nextMonth} alt="Next Month" />
                                    </div>

                                    {/* <div>
                                    <button onClick={() => navigate(`/activity/${params.id}`)}>View activity</button>
                                </div> */}
                                </div>
                                <div id="activity-tracker" className="days-weeks">{renderCalendar()}</div>
                                {items.userType === "user" ? (
                                    <div className="timerAndTracking" >
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
                                                    <div className="activityMeterContent" style={{ width: 200 }}>
                                                        <img src={perc_100} alt="" />
                                                        <p className="activityMeterContentPercent" >81 - 100 %</p>
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
                                                                }}
                                                            >
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
                                ) : <div className="timerAndTracking" id='secondStep'>
                                    {isMobile ? (
                                        <>
                                            <div className="container p-3"

                                            >

                                                {/* TOP: Date, Time, Week/Month */}
                                                <div
                                                    className="text-white text-center p-3 rounded"
                                                    style={{
                                                        background: "linear-gradient(to right, #2c7abe, #222f3c)",
                                                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                                                        borderRadius: "12px",
                                                        maxWidth: 600,
                                                        margin: "0 auto"
                                                    }}
                                                >
                                                    {/* Top Row: Play Icon + Date */}
                                                    <div className="d-flex align-items-center justify-content-center gap-3 mb-2">
                                                        {/* Play Circle */}
                                                        <div
                                                            className="rounded-circle d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: 40,
                                                                height: 40,
                                                                backgroundColor: "#a5d64c", // green
                                                            }}
                                                        >
                                                            <i className="bi bi-play-fill" style={{ fontSize: "1.5rem", color: "#2c3e50" }}></i>
                                                        </div>

                                                        {/* Date */}
                                                        <p className="fw-semibold mb-0" style={{ fontSize: '1.1rem' }}>
                                                            {days[selectedDayIndex]} {formattedDate?.split('-')[2]} {months[month || currentMonth]} {currentYear}
                                                        </p>
                                                    </div>

                                                    {/* Timer */}
                                                    <p className="" style={{ fontSize: '3.5rem', color: '#50AA00' }}>
                                                        {data?.totalHours?.daily || "0h 0m"}
                                                    </p>

                                                    {/* Week & Month */}
                                                    <div className="d-flex justify-content-center gap-5 mt-2">
                                                        <div>
                                                            <span className="fw-semibold" style={{ fontSize: '1rem' }}>Week</span>
                                                            <p className="weekTimerDigit">{data?.totalHours?.weekly}</p>

                                                        </div>
                                                        <div>
                                                            <span className="fw-semibold" style={{ fontSize: '1rem' }}>Month</span>
                                                            <p className="weekTimerDigit">{data?.totalHours?.monthly}</p>
                                                        </div>
                                                    </div>
                                                </div>



                                                {/* LEGEND SECTION */}
                                                <div className="row align-items-center justify-content-between text-start">
                                                    {/* LEFT: Text + Legend */}
                                                    <div className="col-6 col-md-6 mb-2 mb-md-0">
                                                        <h5 className="fw-bold fs-3">Activity Tracker</h5>
                                                        <p className="mb-0 fw-semibold">Activity Level</p>

                                                        <div className="d-flex justify-content-start gap-2 flex-wrap">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div style={{ width: 12, height: 12, backgroundColor: 'orange', borderRadius: '50%' }}></div>
                                                                <small>0–20%</small>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div style={{ width: 12, height: 12, backgroundColor: '#ffcc00', borderRadius: '50%' }}></div>
                                                                <small>21–40%</small>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div style={{ width: 12, height: 12, backgroundColor: '#99cc33', borderRadius: '50%' }}></div>
                                                                <small>41–60%</small>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    {/* RIGHT: Gauge Meter with Needle */}
                                                    <div className="col-6 col-md-6 d-flex justify-content-center align-items-center position-relative">
                                                        <img
                                                            src={activityImage}
                                                            alt="Activity Meter"
                                                            className="img-fluid"
                                                            style={{ maxWidth: 250 }}
                                                        />
                                                        <div
                                                            className="needleContainerMainAlingment"
                                                            style={{
                                                                transform: `translateY(-50%) rotate(${Math.floor(totalActivityByDay?.totalactivity) <= 20 ? -75 :
                                                                    Math.floor(totalActivityByDay?.totalactivity) > 20 && Math.floor(totalActivityByDay?.totalactivity) <= 40 ? -38 :
                                                                        Math.floor(totalActivityByDay?.totalactivity) > 40 && Math.floor(totalActivityByDay?.totalactivity) <= 60 ? 0 :
                                                                            Math.floor(totalActivityByDay?.totalactivity) > 60 && Math.floor(totalActivityByDay?.totalactivity) <= 80 ? 35 :
                                                                                Math.floor(totalActivityByDay?.totalactivity) > 80 ? 75 : -108
                                                                    }deg)`
                                                            }}>
                                                            <div className="needleContainerAlingment">
                                                                <div className="diamond"></div>
                                                                <div className="needlePointerMain"></div>
                                                                <OverlayTrigger placement="bottom" overlay={<Tooltip>{Math.floor(totalActivityByDay?.totalactivity)} %</Tooltip>}>
                                                                    <div className="needleScrewMain"></div>
                                                                </OverlayTrigger>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ margin: "0 10px 0 0" }} className="timerLeft">
                                                <div>
                                                    <img width={120} src={logo} alt="" />
                                                </div>
                                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                                                    {/* Weekday */}
                                                    <p className="weekDayTimer">
                                                        {days[selectedDayIndex]}
                                                    </p>

                                                    {/* <p className="weekDayTimer">{formattedDate == todayDate ? days[currentDay] : days[clickDay]}  </p> */}

                                                    {/* Current Day of the month */}
                                                    <p className="weekDayTimer">{formattedDate && formattedDate.split('-')[2]}</p>

                                                    <p className="weekDateTimer">
                                                        {months[month || currentMonth]}
                                                    </p>

                                                    {/* Current Year */}
                                                    <p className="weekDateTimer">
                                                        {currentYear} {/* Display the current year */}
                                                    </p>
                                                    <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(totalActivityByDay?.totalactivity)} %</Tooltip>}>
                                                        <div className="circular-progress" style={{
                                                            cursor: "pointer"
                                                        }}>
                                                            <CircularProgressBar activityPercentage={totalActivityByDay?.totalactivity} size={30} />
                                                        </div>
                                                    </OverlayTrigger>
                                                    {/* <p className="timerClock">
                                            {data?.totalHours?.daily === "0h 0m" ? days[currentWeekDay] : data?.totalHours?.daily}
                                        </p> */}
                                                    <p className="timerClock">        {data?.totalHours?.daily ? data.totalHours.daily : "0h 0m"}
                                                    </p>
                                                    {/* <p className="timerClock">{totalHours.daily}</p> */}
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
                                                        <div className="activityMeterContent" style={{ width: 200 }}>
                                                            <img src={perc_100} alt="" />
                                                            <p className="activityMeterContentPercent" >81 - 100 %</p>
                                                        </div>
                                                    </div>
                                                    <div className="activityMeterMain">
                                                        <div className="activityMeterMainContainer">
                                                            <img className="activityMeterMainImage" src={activityImage} alt="" />
                                                            <div className="needleContainerMain">
                                                                <div
                                                                    className="needleContainerMainAlingment"
                                                                    style={{
                                                                        transform: `translateY(-50%) rotate(${Math.floor(totalActivityByDay?.totalactivity) <= 20 ? -75 :
                                                                            Math.floor(totalActivityByDay?.totalactivity) > 20 && Math.floor(totalActivityByDay?.totalactivity) <= 40 ? -38 :
                                                                                Math.floor(totalActivityByDay?.totalactivity) > 40 && Math.floor(totalActivityByDay?.totalactivity) <= 60 ? 0 :
                                                                                    Math.floor(totalActivityByDay?.totalactivity) > 60 && Math.floor(totalActivityByDay?.totalactivity) <= 80 ? 35 :
                                                                                        Math.floor(totalActivityByDay?.totalactivity) > 80 ? 75 : -108
                                                                            }deg)`
                                                                    }}>
                                                                    <div className="needleContainerAlingment">
                                                                        <div className="diamond"></div>
                                                                        <div className="needlePointerMain"></div>
                                                                        <OverlayTrigger placement="bottom" overlay={<Tooltip>{Math.floor(totalActivityByDay?.totalactivity)} %</Tooltip>}>
                                                                            <div className="needleScrewMain"></div>
                                                                        </OverlayTrigger>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                </div>}
                                <div className="time-scale" style={{ display: "flex", justifyContent: "space-between" }} id="Thirdstep">
                                    {renderTimeIntervals()}
                                </div>
                                <div id='screenshots'>
                                    {items.userType === "user" ? (

                                        <div>
                                            {data && (data?.groupedScreenshots?.map((element, elements) => {

                                                //   {offlineTime.filter((element) => element.timeentryId !== trimActivity.timeentryId).map((element, index) => {
                                                return (
                                                    <div>
                                                        {loading ? <Skeleton count={1} width="300px" height="34.5px" style={{ margin: "40px 0 0 0" }} /> : <div
                                                            onClick={() => {
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
                                                            <p className="projectName">{element?.project}</p>
                                                            <p className="timeDuration">{element?.description}</p>
                                                            {console.log("Des Name", element?.description)}
                                                            {/* <div>
                                                            <OverlayTrigger placement="top" overlay={<Tooltip>{elements?.description}</Tooltip>}>
                                                                <p className="notes">
                                                                    <a className="websiteLink" href="#">{elements?.time} {element?.description}</a>
                                                                </p>
                                                            </OverlayTrigger>
                                                        </div> */}
                                                            {/* <a className="websiteLink" href="#">{element?.time} {element?.description}</a> */}
                                                            {/* <a className="websiteLink" href="#">{element?.time} {element?.description ? element?.description : <Skeleton width="100px" />} Hello</a> */}

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
                                                                console.log(elements);
                                                                // Check if the current employee's allowBlur setting is true
                                                                const allowBlur = employees.some(employee =>
                                                                    employee._id === userId &&
                                                                    employee.effectiveSettings.screenshots?.allowBlur
                                                                );
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
                                                                                {elements?.screenshot?.blur === false && (
                                                                                    <img
                                                                                        width={25}
                                                                                        src={brushIcon}
                                                                                        alt=""
                                                                                        onClick={() => {
                                                                                            if (elements?.screenshot?.blur === false) {
                                                                                                console.log(elements);
                                                                                                // handleBlurSS(timeentryId, screenshotId); // Pass the required IDs here
                                                                                                handleBlurSS(element.timeentryId, elements._id);
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                                <img src={deleteIcon} alt="" style={{ margin: "0 10px" }} onClick={() => handleOpenDeleteModal(element, elements)} />
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
                                                                            <img style={{ filter: elements?.blur === true ? "blur(5px)" : elements?.screenshot?.blur === true ? "blur(5px)" : "" }} className="screenshotiimage" onClick={() => openModal(element, elements?.key, index)} src={elements?.key} alt="ScreenShotImg.png" />
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
                                                                                <img style={{ filter: ssData?.screenshots.find((f, indd) => indd === selectedImageIndex)?.blur === true ? "blur(5px)" : ssData?.screenshots.find((f, indd) => indd === selectedImageIndex)?.screenshot?.blur === true ? "blur(5px)" : "" }} className="modalImage" src={selectedImage} alt="Pop-up Image" />
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
                                    ) : timeEntries?.map((element) => {
                                        const findTimeEntryActivity = totalActivityByDay?.groupedScreenshots?.find(f => f.timeentryId === element.timeentryId)
                                        return (
                                            <div>
                                                <div
                                                    onClick={() => {
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
                                                    <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(findTimeEntryActivity?.totalactivity)} %</Tooltip>}>
                                                        <div className="circular-progress" style={{ margin: "0 20px", cursor: "pointer" }}>
                                                            <CircularProgressBar activityPercentage={findTimeEntryActivity?.totalactivity} size={30} />
                                                        </div>
                                                    </OverlayTrigger>
                                                    {element.items?.some(item => item.userType === "user") && (
                                                        <div>
                                                            <p className="projectName">{element?.project}</p>
                                                            {console.log("Project Nanme", element?.project)}
                                                            <p className="timeDuration">{element?.description}</p>
                                                        </div>
                                                    )}
                                                    <p className="projectName">{element?.project}</p>
                                                    <p className="timeDuration">{element?.description}</p>
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
                                                </div>
                                                <div style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                                    gap: "20px",
                                                }}>
                                                    {element?.screenshots && (element?.screenshots?.map((elements, index) => {
                                                        // Check if the current employee's allowBlur setting is true
                                                        const allowBlur = employees.some(employee =>
                                                            employee._id === userId &&
                                                            employee.effectiveSettings.screenshots?.allowBlur
                                                        );
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
                                                                        {elements?.screenshot?.blur === false && allowBlur && (
                                                                            <img
                                                                                width={25}
                                                                                src={brushIcon}
                                                                                alt=""
                                                                                onClick={() => {
                                                                                    if (elements?.screenshot?.blur === false) {
                                                                                        console.log(elements);
                                                                                        // handleBlurSS(timeentryId, screenshotId); // Pass the required IDs here
                                                                                        handleBlurSS(element.timeentryId, elements._id);
                                                                                    }
                                                                                    // handleBlurSS(element.timeentryId, elements._id);
                                                                                }}
                                                                            />
                                                                        )}
                                                                        {/* {elements?.screenshot?.blur === false && allowBlur && (
                                                                        <img
                                                                            width={25}
                                                                            src={brushIcon}
                                                                            alt=""
                                                                            style={{ opacity: 0.5, cursor: "not-allowed" }}
                                                                        />
                                                                    )} */}
                                                                        <img src={deleteIcon} alt="" style={{ margin: "0 10px" }} onClick={() => handleOpenDeleteModal(element, elements)} />
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
                                                                    <img style={{ filter: elements?.blur === true ? "blur(5px)" : elements?.screenshot?.blur === true ? "blur(5px)" : "" }} className="screenshotiimage" onClick={() => openModal(element, elements?.key, index)} src={elements?.key} alt="ScreenShotImg.png" />
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
                                                                        <img style={{ filter: ssData?.screenshots.find((f, indd) => indd === selectedImageIndex)?.blur === true ? "blur(5px)" : ssData?.screenshots.find((f, indd) => indd === selectedImageIndex)?.screenshot?.blur === true ? "blur(5px)" : "" }} className="modalImage" src={selectedImage} alt="Pop-up Image" />
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
                                    })}
                                </div>
                            </div>
                        </div>
                        <img className="userDetailLine" src={line} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserDetails;