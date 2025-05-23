import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import CompanyEmployess from "../../screen/component/breakTimeEmployess";
import EmployeeFilter from "../../screen/component/EmployeeFilter";
import moment from "moment-timezone";

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function Screenshot() {
  let token = localStorage.getItem("token");
  let headers = {
    Authorization: "Bearer " + token,
  };

  const [number, setNumber] = useState(null);
  const ids = useSelector((state) => state.adminSlice.ids);
  // const employees = useSelector((state) => state.adminSlice.employess)
  const [employees, setemployees] = useState([]); // ✅ Always an array
  const [totalDuration, setTotalDuration] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(1); // 0h:1m minimum valid
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setfilter] = useState([])



  function Setting({ setting, setSetting, employee }) {
    const salaryString = employee?.effectiveSettings?.screenshots?.frequency;
    const numberPattern = /\d+/;
    const matches = salaryString?.match(numberPattern);
    const number = matches?.length > 0 && parseInt(matches[0]);
    return (
      <>

      </>
    );
  }



  useEffect(() => {
    const salaryString = employees?.find(
      (f) => f?.effectiveSettings?.individualss === false
    )?.effectiveSettings?.screenshots?.frequency;
    const numberPattern = /\d+/;
    const matches = salaryString?.match(numberPattern);
    setNumber(matches?.length > 0 && parseInt(matches[0]));
  }, [employees]);





  async function getData() {
    setIsLoading(true); // Show loader before fetching
    try {
      const response = await fetch(
        `https://myuniversallanguages.com:9093/api/v1/superAdmin/employees`,
        { headers }
      );
      const json = await response.json();
      setemployees(json?.convertedEmployees)
      const employeesData = json?.convertedEmployees || [];
      const transformedBreakTimes = employeesData[0]?.punctualityData?.breakTime.map((breakEntry) => {
        const start = breakEntry.breakStartTime
          ? new Date(breakEntry.breakStartTime).toISOString().substring(11, 16)
          : "";
        const end = breakEntry.breakEndTime
          ? new Date(breakEntry.breakEndTime).toISOString().substring(11, 16)
          : "";
        const duration = breakEntry.TotalHours || "0h:0m";

        return { start, end, duration };
      }) || [];

      setBreakTimes(transformedBreakTimes);

      const totalMinutes = transformedBreakTimes.reduce((acc, curr) => {
        const [hours, minutes] = curr.duration.split("h:").map((val) => parseInt(val) || 0);
        return acc + hours * 60 + minutes;
      }, 0);

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      setTotalDuration(`${hours}h:${minutes}m`);
      setSelectedHours(hours);
      setSelectedMinutes(minutes);

    } catch (error) {
      console.error("Error fetching employees:", error);
      enqueueSnackbar("Failed to fetch employees.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setIsLoading(false); // Hide loader after fetch
    }
  }



  useEffect(() => {
    getData();
  }, []);






  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [calculatedDuration, setCalculatedDuration] = useState("");

  const calculateStartAndEndTime = (hours, minutes) => {
    const startDate = new Date();
    startDate.setHours(9, 0, 0); // Default start time: 09:00 AM
    const endDate = new Date(startDate);
    endDate.setHours(
      startDate.getHours() + hours,
      startDate.getMinutes() + minutes
    );

    const startTimeString = startDate.toTimeString().slice(0, 5); // Format as HH:MM
    const endTimeString = endDate.toTimeString().slice(0, 5); // Format as HH:MM

    setStartTime(startTimeString);
    setEndTime(endTimeString);
  };




  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false); // Track if the Add Break Time button is disabled




  const handleSubmit = async () => {
    try {
      if (!totalDuration || !/^(\d+)h:(\d+)m$/.test(totalDuration)) {
        throw new Error("Please provide a valid total duration.");
      }

      const currentDate = new Date().toISOString().split("T")[0];
      const defaultTimezone = moment.tz.guess(); // Fallback timezone

      const requestData = employees.map((employee) => {
        const employeeTimezone = employee?.timezone || defaultTimezone;
        const timezoneOffset = employee?.timezoneOffset ?? new Date().getTimezoneOffset();

        const hasStart = breakTimes.some(slot => slot.start && slot.start.trim() !== "");

        const formattedBreakTimes = hasStart
          ? breakTimes.map((slot) => {
            const breakStartTime = slot.start
              ? moment.tz(`${currentDate}T${slot.start}`, "YYYY-MM-DDTHH:mm", employeeTimezone).format()
              : null;

            return {
              TotalHours: totalDuration,
              breakStartTime: null,
              breakEndTime: null,
            };
          })
          : [
            {
              TotalHours: totalDuration,
              breakStartTime: null,
              breakEndTime: null,
            },
          ];

        return {
          userId: employee._id,
          settings: {
            breakTime: formattedBreakTimes,
            timezone: employeeTimezone,
            timezoneOffset: timezoneOffset,
          },
        };
      });

      console.log("its obaid", requestData)

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
        enqueueSnackbar("Break Time rule successfully submitted!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
      } else {
        enqueueSnackbar("Failed to submit punctuality rule.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
      }
    } catch (error) {
      enqueueSnackbar(
        error.message || "Error submitting punctuality rule. Please try again later.",
        { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } }
      );
      console.error("Error submitting punctuality rule:", error);
    }
  };








  const [breakTimes, setBreakTimes] = useState([]);

  useEffect(() => {
    localStorage.setItem("isUsehasVisitedbreak", "true");
    // localStorage.setItem("breakTimes", JSON.stringify(breakTimes));
  }, [breakTimes]);

  const calculateBreakDuration = (start, end) => {
    if (start && end) {
      const startDate = new Date(`1970-01-01T${start}:00`);
      const endDate = new Date(`1970-01-01T${end}:00`);

      if (endDate > startDate) {
        const durationMs = endDate - startDate;
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor(
          (durationMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        return `${durationHours}h:${durationMinutes}m`;
      } else {
        return "Invalid Time Range";
      }
    }
    return ""; // Return empty if either time is not set
  };

  const [errors, setErrors] = useState([]);

  const handleBreakTimeChange = (index, field, value) => {
    const updatedBreakTimes = [...breakTimes];

    // Combine current date with input time
    const currentDate = new Date().toISOString().split("T")[0]; // Current date
    const utcTime = new Date(`${currentDate}T${value}:00Z`).toISOString(); // Convert to UTC

    // Update raw input and UTC equivalent
    updatedBreakTimes[index][field] = value; // Raw input (HH:MM)
    updatedBreakTimes[index][`${field}UTC`] = utcTime; // Store UTC time

    const startUTC = updatedBreakTimes[index].startUTC;
    const endUTC = updatedBreakTimes[index].endUTC;

    // Validate start and end times
    if (startUTC && endUTC) {
      const startTimeUTC = new Date(startUTC);
      const endTimeUTC = new Date(endUTC);

      if (endTimeUTC <= startTimeUTC) {
        enqueueSnackbar("End Time must be after Start Time.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        return;
      }

      // Calculate duration
      const durationMinutes = Math.floor((endTimeUTC - startTimeUTC) / (1000 * 60));
      if (durationMinutes > 60) {
        enqueueSnackbar("Duration cannot exceed 1 hour.", {
          variant: "warning",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        return;
      }

      updatedBreakTimes[index].duration = `${Math.floor(durationMinutes / 60)}h:${durationMinutes % 60}m`;
    }

    setBreakTimes(updatedBreakTimes);
    calculateTotalDuration();
  };




  // Initialize state with value from localStorage or default value


  // Update localStorage whenever totalDuration changes
  // useEffect(() => {
  //   localStorage.setItem("totalDuration", totalDuration);
  // }, [totalDuration]);

  const isDurationFilled = () => {
    const regex = /^(\d+)h:(\d+)m$/;
    const match = totalDuration.match(regex);

    if (!match) return false;

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);

    return hours > 0 || minutes > 0;
  };

  // const handleBreakStartChange = (value) => {
  //   const currentDate = new Date().toISOString().split("T")[0];
  //   const utcTime = new Date(`${currentDate}T${value}:00Z`).toISOString();

  //   const updatedBreakTimes = [...breakTimes];
  //   const index = 0;

  //   // Ensure the first break object exists
  //   if (!updatedBreakTimes[index]) {
  //     updatedBreakTimes[index] = { start: "", end: "", duration: "" };
  //   }

  //   // Update start time and UTC
  //   updatedBreakTimes[index].start = value;
  //   updatedBreakTimes[index].startUTC = utcTime;

  //   const { startUTC, endUTC } = updatedBreakTimes[index];

  //   if (startUTC && endUTC) {
  //     const startTime = new Date(startUTC);
  //     const endTime = new Date(endUTC);

  //     if (endTime <= startTime) {
  //       enqueueSnackbar("End Time must be after Start Time.", {
  //         variant: "error",
  //         anchorOrigin: { vertical: "top", horizontal: "right" },
  //       });
  //       return;
  //     }

  //     const durationMinutes = Math.floor((endTime - startTime) / (1000 * 60));

  //     if (durationMinutes > 60) {
  //       enqueueSnackbar("Duration cannot exceed 1 hour.", {
  //         variant: "warning",
  //         anchorOrigin: { vertical: "top", horizontal: "right" },
  //       });
  //       return;
  //     }

  //     updatedBreakTimes[index].duration = `${Math.floor(durationMinutes / 60)}h:${durationMinutes % 60}m`;
  //   }

  //   setBreakTimes(updatedBreakTimes);
  //   calculateTotalDuration();
  // };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const h24 = hour.toString().padStart(2, "0");
        const m = min.toString().padStart(2, "0");

        const suffix = hour < 12 ? "AM" : "PM";
        const h12 = ((hour + 11) % 12 + 1).toString().padStart(2, "0");

        const display = `${h12}:${m} ${suffix}`; // e.g., 01:15 PM
        const value = `${h24}:${m}`;              // e.g., 13:15 for backend

        options.push(
          <option key={value} value={value}>
            {display}
          </option>
        );
      }
    }
    return options;
  };
  const handleIncrement = () => {
    let hours = getHours();
    let minutes = getMinutes();

    if (minutes < 59) {
      minutes++;
    } else {
      minutes = 0;
      hours++;
    }

    if (hours > 12) {
      hours = 12;
      minutes = 59;
    }

    setTotalDuration(`${hours}h:${minutes}m`);
  };

  const handleDecrement = () => {
    let hours = getHours();
    let minutes = getMinutes();

    if (minutes > 0) {
      minutes--;
    } else if (hours > 0) {
      hours--;
      minutes = 59;
    }

    // Don't allow below 0h:1m
    if (hours === 0 && minutes === 0) {
      minutes = 1;
    }

    setTotalDuration(`${hours}h:${minutes}m`);
  };
  const getHours = () => {
    if (!totalDuration) return 0;
    const match = totalDuration.match(/^(\d+)h:(\d+)m$/);
    return match ? parseInt(match[1]) : 0;
  };

  const getMinutes = () => {
    if (!totalDuration) return 0;
    const match = totalDuration.match(/^(\d+)h:(\d+)m$/);
    return match ? parseInt(match[2]) : 0;
  };
  const generateDurationOptions = () => {
    const options = [];
    for (let h = 0; h <= 12; h++) {
      for (let m = 0; m <= 59; m++) {
        if (h === 0 && m === 0) continue; // skip 0h:0m
        const value = `${h}h:${m}m`;
        options.push(
          <option key={value} value={value}>
            {value}
          </option>
        );
      }
    }
    return options;
  };

  const updateDuration = (type, value) => {
    let hours = selectedHours;
    let minutes = selectedMinutes;

    if (type === "hours") {
      hours = value;
      setSelectedHours(value);
    } else {
      minutes = value;
      setSelectedMinutes(value);
    }

    // prevent 0h:0m
    if (hours === 0 && minutes === 0) {
      minutes = 1;
      setSelectedMinutes(1);
    }

    setTotalDuration(`${hours}h:${minutes}m`);
  };

  const calculateTotalDuration = () => {
    let totalMinutes = 0;

    breakTimes.forEach(({ start, end }) => {
      if (start && end) {
        const startTime = new Date(`1970-01-01T${start}:00`);
        const endTime = new Date(`1970-01-01T${end}:00`);

        if (endTime < startTime) {
          endTime.setDate(endTime.getDate() + 1);
        }

        totalMinutes += Math.floor((endTime - startTime) / (1000 * 60));
      }
    });

    // Cap total minutes at 60 (1 hour)
    totalMinutes = Math.min(totalMinutes, 60);



    // Disable the button if total duration equals 1 hour
    setIsAddButtonDisabled(totalMinutes >= 60);
  };
  const handleFilteredEmployees = (filteredEmployees) => {

    setfilter(filteredEmployees)
  };
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
              <div id='breakTime'
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <div>
                  <p className="settingScreenshotHeading">Break Time</p>
                </div>
              </div>
              <div className="settingScreenshotDiv">
                <p>Break time allows employees to take short pauses during their work hours.</p>
                <p>
                  You can set a total break duration that determines how long an employee can be on break.
                </p>
              </div>
              {/* <EmployeeFilter employees={employees} onFilter={handleFilteredEmployees} /> */}
              <p className="settingScreenshotIndividual">Group Break Time Setting</p>
              <div className="settingScreenshotDiv">
                {/* <p>How frequently screenshots will be taken.</p> */}
                <p>These breaktime will applied throught out the organization.</p>
              </div>
              {/* Total Duration */}
              {console.log("setTotalDuration", totalDuration)}
              {isLoading ? (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginTop: "20px",
                  flexWrap: "wrap"
                }}>
                  <Skeleton width={120} height={40} style={{ borderRadius: "8px" }} />
                  <Skeleton width={100} height={40} style={{ borderRadius: "8px" }} />
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                    marginTop: "20px",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  }}
                >
                  <label
                    htmlFor="totalDuration"
                    style={{
                      fontWeight: 600,
                      color: "#333",
                      marginRight: "8px",
                      fontSize: "14px",
                    }}
                  >
                    Total Duration:
                  </label>

                  {isEditingDuration ? (
                    <>
                      <select
                        value={selectedHours}
                        onChange={(e) => updateDuration("hours", parseInt(e.target.value))}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          backgroundColor: "#f9f9f9",
                          color: "#333",
                          fontSize: "14px",
                          width: "100px",
                          cursor: "pointer",
                        }}
                      >
                        {Array.from({ length: 13 }, (_, i) => (
                          <option key={i} value={i}>
                            {i} hour{i !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedMinutes}
                        onChange={(e) => updateDuration("minutes", parseInt(e.target.value))}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          backgroundColor: "#f9f9f9",
                          color: "#333",
                          fontSize: "14px",
                          width: "100px",
                          cursor: "pointer",
                        }}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <option key={i} value={i}>
                            {i} min{i !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={async () => {
                          setIsSubmitting(true);
                          await handleSubmit();
                          setIsSubmitting(false);
                          setIsEditingDuration(false);
                        }}
                        disabled={isSubmitting}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#7fc45a",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: "14px",
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                          transition: "background-color 0.3s ease",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                        }}
                        onMouseOver={(e) => {
                          if (!isSubmitting) e.target.style.backgroundColor = "#6db84d";
                        }}
                        onMouseOut={(e) => {
                          if (!isSubmitting) e.target.style.backgroundColor = "#7fc45a";
                        }}
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          padding: "10px 14px",
                          backgroundColor: "#f4f4f4",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          fontSize: "14px",
                          color: "#333",
                          width: "120px",
                          textAlign: "center",
                        }}
                      >
                        {totalDuration}
                      </div>

                      <button
                        onClick={() => setIsEditingDuration(true)}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#7fc45a",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: "14px",
                          cursor: "pointer",
                          transition: "background-color 0.3s ease",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#6db84d";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#7fc45a";
                        }}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              )}




              <div className="activityLevelIndividual">
                <p className="settingScreenshotIndividual">Optional Individual Settings</p>
                <p className="individualSettingFont">
                  If enabled, the individual setting will be used instead of the team
                  setting
                </p>

                {isLoading ? (
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Screenshot;
