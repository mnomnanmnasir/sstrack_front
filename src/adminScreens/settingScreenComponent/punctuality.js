import axios from "axios";
import moment from "moment";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch, useSelector } from "react-redux";
import EmployeeFilter from "../../screen/component/EmployeeFilter";
import CompanyEmployess from "../../screen/component/punctualitybreaktime";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function Screenshot() {

    let token = localStorage.getItem('token');
    let headers = {
        Authorization: 'Bearer ' + token,
    }

    const dispatch = useDispatch()
    const [number, setNumber] = useState(null)
    const ids = useSelector((state) => state.adminSlice.ids)
    // const employees = useSelector((state) => state.adminSlice.employess)
    const [employees, setemployees] = useState([]); // ✅ Always an array
    const [editTZ, setEditTZ] = useState(null); // Which timezone is being edited
    const [editValues, setEditValues] = useState({}); // Edited values for start/end/date
    const [filter, setfilter] = useState([])
    const [loading, setLoading] = useState(true);
    const [puncStartTime, setPuncStartTime] = useState('');
    const [puncEndTime, setPuncEndTime] = useState("");
    const [globalPunctuality, setGlobalPunctuality] = useState({});
    const [implementStartDate, setImplementStartDate] = useState(""); // 👈 Add this line
    const [implementStartTime, setImplementStartTime] = useState(""); // 👈 Add this line



    useEffect(() => {
        if (employees?.length > 0) {
            const firstEmployee = employees[0];
            const punctualityData = firstEmployee?.punctualityData || {};
            setPuncStartTime(punctualityData.puncStartTime || "");
            setPuncEndTime(punctualityData.puncEndTime || "");
        }
    }, [employees]);

    // useEffect(() => {
    //   if (employees?.length > 0) {
    //     const firstEmployee = employees[0];
    //     const punctualityData = firstEmployee?.punctualityData || {};

    //     const start = punctualityData.puncStartTime
    //       ? moment(punctualityData.puncStartTime).format("HH:mm")
    //       : "";
    //     const end = punctualityData.puncEndTime
    //       ? moment(punctualityData.puncEndTime).format("HH:mm")
    //       : "";

    //     setPuncStartTime(start);
    //     setPuncEndTime(end);
    //   }
    // }, [employees]);


    function convertTimeStringToDate(timeStr) {
        if (!timeStr) return new Date(); // fallback to now
        const [hours, minutes] = timeStr.split(':').map(Number);
        const now = new Date();
        now.setHours(hours);
        now.setMinutes(minutes);
        now.setSeconds(0);
        now.setMilliseconds(0);
        return now;
    }

    function formatDateToTimeString(date) {
        if (!(date instanceof Date)) return '';
        return date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }); // returns "HH:mm"
    }


    function Setting({ employee }) {
        const salaryString = employee?.effectiveSettings?.screenshots?.frequency;
        const numberPattern = /\d+/;
        const matches = salaryString?.match(numberPattern);
        const number = matches?.length > 0 && parseInt(matches[0]);
        return (
            <>



            </>
        )
    }

    useEffect(() => {
        const salaryString = employees?.find(f => f?.effectiveSettings?.individualss === false)?.effectiveSettings?.screenshots?.frequency;
        const numberPattern = /\d+/;
        const matches = salaryString?.match(numberPattern);
        setNumber(matches?.length > 0 && parseInt(matches[0]))
    }, [employees])

    async function getData() {
        try {
            setLoading(true);
            const response = await fetch(
                `https://myuniversallanguages.com:9093/api/v1/superAdmin/employees`,
                { headers }
            );
            const json = await response.json();
            const global = json?.globalPunctuality || {};
            setGlobalPunctuality(global);
            setemployees(json?.convertedEmployees)
            const employeesData = json?.convertedEmployees || [];
            // console.log("checkk", json);
            if (employeesData.length > 0) {
                const punctualityData = employeesData[0]?.punctualityData || {};
                setPuncStartTime(punctualityData.puncStartTime);
                setPuncEndTime(punctualityData.puncEndTime);
                // setPuncStartTime(
                //     punctualityData.puncStartTime ? moment(punctualityData.puncStartTime).format("HH:mm") : ""
                // );
                // setPuncEndTime(
                //     punctualityData.puncEndTime ? moment(punctualityData.puncEndTime).format("HH:mm") : ""
                // );

            } else {
                console.warn("No employee data found.");
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
            enqueueSnackbar("Failed to fetch employees.", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                },
            });
        } finally {
            setLoading(false); // ✅ End loading state
        }
    }

    useEffect(() => {
        getData()
    }, [])



    const handleTimezoneSave = async (timezone) => {
        const selectedEmployees = (filter.length > 0 ? filter : employees).filter(emp =>
            emp.timezone?.toLowerCase() === timezone.toLowerCase()
        );

        if (selectedEmployees.length === 0) {
            enqueueSnackbar("No employees found for selected timezone", { variant: "warning" });
            return;
        }

        const requestData = selectedEmployees.map((employee) => ({
            userId: employee._id,
            settings: {
                puncStartTime: moment.tz(`${editValues.policyDate}T${editValues.startTime}`, timezone).format(),
                puncEndTime: moment.tz(`${editValues.policyDate}T${editValues.endTime}`, timezone).format(),
                timezone: timezone,
                timezoneOffset: employee?.timezoneOffset ?? new Date().getTimezoneOffset(),
                implementStartDate: moment.tz(`${editValues.policyDate}T${moment().format("HH:mm")}`, timezone).format(),
            }
        }));

        try {
            const response = await axios.post(
                "https://myuniversallanguages.com:9093/api/v1/superAdmin/addPunctualityRule",
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                enqueueSnackbar(`Successfully updated for ${timezone}`, { variant: "success" });

                // ✅ Fetch latest data
                await getData();

                // ✅ Stay in edit mode for same timezone after refresh
                setEditTZ(null);
                setEditValues({});
            } else {
                throw new Error("API response not OK");
            }
        } catch (error) {
            console.error("Error saving:", error);
            enqueueSnackbar("Failed to save punctuality rule.", { variant: "error" });
        }
    };

    const handleFilteredEmployees = (filteredEmployees) => {
        console.log("Filtered Employees:", filteredEmployees);
        setfilter(filteredEmployees)
    };
    // console.log(" Employees:", employees);
    const punctualityCards = Object.entries(globalPunctuality).map(([tz, times]) => ({
        timezone: tz,
        startFormatted: moment.parseZone(times.punctualityStartTime).format("HH:mm"),
        endFormatted: moment.parseZone(times.punctualityEndTime).format("HH:mm"),
        dateFormatted: moment.parseZone(times.punctualityStartTime).format("YYYY-MM-DD"),
        isEditing: editTZ === tz,
    }));


    return (
        <>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <div className="headerTop">
                        {/* <img src={setting} /> */}
                        <h5>Settings</h5>
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="settingContainer">
                        <div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                <div>
                                    <p className="settingScreenshotHeading">Punctuality</p>
                                </div>
                            </div>

                            <p className="settingScreenshotIndividual">Group Punctuality Setting</p>
                            <div className="settingScreenshotDiv">
                                {/* <p>How frequently screenshots will be taken.</p> */}
                                <p>These setting will applied throught out the organization with respect to there timezone.</p>
                            </div>
                            {/* {(
                <>
                    <div className="takeScreenShotDiv">
                        <div>
                            <label>Punctuality Start Time:</label>
                            <input
                                type="time"
                                value={puncStartTime}
                                onFocus={(e) => e.target.showPicker()}
                                onChange={(e) => setPuncStartTime(e.target.value)}
                                className="styled-input"
                            />
                        </div>

                        <div>
                            <label>Punctuality End Time:</label>
                            <input
                                type="time"
                                value={puncEndTime}
                                onFocus={(e) => e.target.showPicker()}
                                onChange={(e) => setPuncEndTime(e.target.value)}
                                className="styled-input"
                            />
                        </div>

                        <div>
                            <label>Policy Date:</label>
                            <input
                                type="date"
                                value={implementStartDate}
                                onFocus={(e) => e.target.showPicker()}
                                onChange={(e) => setImplementStartDate(e.target.value)}
                                className="styled-input"
                            />
                        </div>

                    </div>

                    <button onClick={handleSubmit} style={{
                        padding: "10px 20px",
                        backgroundColor: "#7fc45a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                    }}>
                        Save
                    </button>
                </>
            )} */}
                            {/* {console.log('hahahahaah', punctualityCards)} */}
                            {loading ? (
                                Array(2).fill(0).map((_, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            marginBottom: '20px',
                                            backgroundColor: '#fff',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        <Skeleton height={24} width={150} style={{ marginBottom: 12 }} />
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                                            <Skeleton height={30} />
                                            <Skeleton height={30} />
                                            <Skeleton height={30} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                punctualityCards.map(({ timezone, startFormatted, endFormatted, dateFormatted, isEditing }) => (
                                    <div
                                        key={timezone}
                                        style={{
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            marginBottom: '20px',
                                            backgroundColor: '#fff',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        <h4 style={{ marginBottom: '12px', fontSize: '16px', color: '#333' }}>{timezone}</h4>

                                        {isEditing ? (
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                                    gap: '16px',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#444', marginBottom: '4px' }}>
                                                        Start Time:
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={editValues.startTime}
                                                        onChange={(e) => setEditValues({ ...editValues, startTime: e.target.value })}
                                                        style={{
                                                            padding: '8px 10px',
                                                            fontSize: '14px',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            width: '100%',
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#444', marginBottom: '4px' }}>
                                                        End Time:
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={editValues.endTime}
                                                        onChange={(e) => setEditValues({ ...editValues, endTime: e.target.value })}
                                                        style={{
                                                            padding: '8px 10px',
                                                            fontSize: '14px',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            width: '100%',
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#444', marginBottom: '4px' }}>
                                                        Policy Date:
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={editValues.policyDate}
                                                        onChange={(e) => setEditValues({ ...editValues, policyDate: e.target.value })}
                                                        style={{
                                                            padding: '8px 10px',
                                                            fontSize: '14px',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            width: '100%',
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    style={{
                                                        padding: '8px 16px',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        color: '#fff',
                                                        backgroundColor: '#7fc45a',
                                                        cursor: 'pointer',
                                                        marginTop: 'auto',
                                                        alignSelf: 'end',
                                                    }}
                                                    onClick={() => handleTimezoneSave(timezone)}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                                    gap: '16px',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#444', marginBottom: '4px' }}>
                                                        Start Time:
                                                    </label>
                                                    <div
                                                        style={{
                                                            padding: '8px 10px',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#f8f8f8',
                                                            fontSize: '14px',
                                                            color: '#333',
                                                        }}
                                                    >
                                                        {startFormatted}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#444', marginBottom: '4px' }}>
                                                        End Time:
                                                    </label>
                                                    <div
                                                        style={{
                                                            padding: '8px 10px',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#f8f8f8',
                                                            fontSize: '14px',
                                                            color: '#333',
                                                        }}
                                                    >
                                                        {endFormatted}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <label style={{ fontSize: '14px', fontWeight: '500', color: '#444', marginBottom: '4px' }}>
                                                        Policy Date:
                                                    </label>
                                                    <div
                                                        style={{
                                                            padding: '8px 10px',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#f8f8f8',
                                                            fontSize: '14px',
                                                            color: '#333',
                                                        }}
                                                    >
                                                        {dateFormatted}
                                                    </div>
                                                </div>
                                                <button
                                                    style={{
                                                        padding: '8px 16px',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        color: '#fff',
                                                        backgroundColor: '#7fc45a',
                                                        cursor: 'pointer',
                                                        marginTop: 'auto',
                                                        alignSelf: 'end',
                                                    }}
                                                    onClick={() => {
                                                        setEditTZ(timezone);
                                                        setEditValues({
                                                            startTime: startFormatted,
                                                            endTime: endFormatted,
                                                            policyDate: dateFormatted,
                                                        });
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}

                         
                            {loading ? (
                                <div style={{ marginBottom: '20px' }}>
                                    <Skeleton height={40} width={300} />
                                </div>
                            ) : (
                                <EmployeeFilter employees={employees} onFilter={handleFilteredEmployees} />
                            )}

                            <div className="activityLevelIndividual">
                                <p className="settingScreenshotIndividual">Individual Settings</p>
                                <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>

                                {loading ? (
                                    <div style={{ textAlign: "center", marginTop: "40px" }}>
                                        <div style={{
                                            border: "6px solid #f3f3f3",
                                            borderTop: "6px solid #7fc45a",
                                            borderRadius: "50%",
                                            width: "40px",
                                            height: "40px",
                                            animation: "spin 1s linear infinite",
                                            margin: "0 auto"
                                        }} />

                                        <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
                                            Loading employees...
                                        </p>

                                        <style>
                                            {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
                                        </style>
                                    </div>
                                ) : (
                                    <CompanyEmployess Setting={Setting} employees={filter.length > 0 ? filter : employees} />
                                )}
                            </div>
                            <style>
                                {`
  .takeScreenShotDiv {
    display: flex;
    gap: 40px;
    align-items: flex-start;
    margin: 20px 0;
    flex-wrap: wrap;
  }

  .takeScreenShotDiv > div {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-family: "Segoe UI", sans-serif;
    min-width: 160px;
  }

  .takeScreenShotDiv label {
    font-size: 14px;
    color: #444;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .styled-input {
    padding: 10px 14px;
    border: 2px solid #cdd5cd;
    border-radius: 6px;
    background-color: #f8f9fa;
    color: #333;
    font-size: 14px;
    transition: border 0.2s ease, background 0.2s ease;
    font-family: "Segoe UI", sans-serif;
  }

  .styled-input:focus {
    border-color: #7fc45a;
    outline: none;
    background-color: #fff;
  }

  button {
    transition: background 0.3s ease;
  }

  button:hover {
    background-color: #69a94b;
  }
`}
                            </style>



                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Screenshot;
