import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import CompanyEmployess from "../../screen/component/breakTimeEmployess";
import EmployeeFilter from "../../screen/component/EmployeeFilter";
import moment from "moment-timezone";


function Screenshot() {
  let token = localStorage.getItem("token");
  let headers = {
    Authorization: "Bearer " + token,
  };

  const [number, setNumber] = useState(null);
  const ids = useSelector((state) => state.adminSlice.ids);
  const employees = useSelector((state) => state?.adminSlice?.employess);
  const [filter, setfilter] = useState([])
  const handleApplySettings = async (employee, type, setting) => {
    const settings = {
      ...employee.effectiveSettings,
      screenshots: {
        ...employee.effectiveSettings.screenshots,
        enabled: setting,
      },
    };
    const settings2 = {
      ...employee.effectiveSettings,
      screenshots: {
        ...employee.effectiveSettings.screenshots,
        frequency: `${setting}/hr`,
      },
    };
    const settings3 = {
      ...employee.effectiveSettings,
      screenshots: {
        ...employee.effectiveSettings.screenshots,
        allowBlur: setting,
      },
    };
    try {
      const res = await axios.patch(
        `https://myuniversallanguages.com:9093/api/v1/owner/settingsE/${employee._id}`,
        {
          userId: employee._id,
          effectiveSettings:
            type === "setting1"
              ? settings
              : type === "setting2"
                ? settings2
                : settings3,
        },
        { headers }
      );

      console.log("Response owner", res);

      if (res.status === 200) {
        enqueueSnackbar("Employee settings updated", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      } else {
        if (res.status === 403) {
          alert("Access denied. Please check your permissions.");
        } else if (res.data.success === false) {
          alert(res.data.message);
        }
      }
      // console.log('Employee setting ka message', response?.data?.message);
    } catch (error) {
      if (error.response && error.response.data) {
        if (
          error.response.status === 403 &&
          error.response.data.success === false
        ) {
          // alert(error.response.data.message)
          enqueueSnackbar(error.response.data.message, {
            variant: "error",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          });
        }
      }
    }
  };

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
    try {
      const response = await fetch(
        `https://myuniversallanguages.com:9093/api/v1/manager/employees`,
        { headers }
      );
      const json = await response.json();
      const employeesData = json?.convertedEmployees || [];

      // Transform and set breakTimes to show in UTC format
      const transformedBreakTimes =
        employeesData[0]?.punctualityData?.breakTime.map((breakEntry) => {
          const breakStartUTC = new Date(breakEntry.breakStartTime)?.substring(11, 16); // Store in UTC
          const breakEndUTC = new Date(breakEntry.breakEndTime)?.substring(11, 16); // Store in UTC
          const duration = breakEntry.TotalHours || "0h:0m";

          return {
            start: breakStartUTC.substring(11, 16), // Display as HH:MM in UTC
            end: breakEndUTC.substring(11, 16), // Display as HH:MM in UTC
            duration,
          };
        }) || [];

      setBreakTimes(transformedBreakTimes);

      // Calculate total duration
      const totalMinutes = transformedBreakTimes.reduce((acc, curr) => {
        const [hours, minutes] = curr.duration
          .split("h:")
          .map((val) => parseInt(val) || 0);
        return acc + hours * 60 + minutes;
      }, 0);

      // Convert total minutes back to "Xh:Ym" format
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      setTotalDuration(`${hours}h:${minutes}m`);
    } catch (error) {
      console.error("Error fetching employees:", error);
      enqueueSnackbar("Failed to fetch employees.", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    }
  }




  useEffect(() => {
    getData();
  }, []);


  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);



  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [calculatedDuration, setCalculatedDuration] = useState("");

  const handleDurationChange = (e) => {
    const input = e.target.value; // Capture user input
    setCalculatedDuration(input); // Update the field value immediately

    // Only validate if input matches the complete format
    const regex = /^(\d+)\s*hr\s*(\d+)?\s*min?$/i; // Match "X hr Y min"
    const match = input.match(regex);

    if (match) {
      const hours = parseInt(match[1], 10) || 0; // Extract hours
      const minutes = parseInt(match[2], 10) || 0; // Extract minutes

      if (
        (hours === 0 && minutes >= 1 && minutes <= 59) ||
        (hours === 1 && minutes === 0)
      ) {
        // Valid duration range
        calculateStartAndEndTime(hours, minutes);
      } else {
        enqueueSnackbar(
          "Please enter a valid duration between 0 hr 1 min and 1 hr 0 min.",
          {
            variant: "warning",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          }
        );
      }
    }
  };



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



  const [breakTime, setBreakTime] = useState(() => {
    // Load break times from localStorage when the component mounts
    const savedBreakTimes = localStorage.getItem("breakTimes");
    return savedBreakTimes ? JSON.parse(savedBreakTimes) : []; // Default to an empty array if nothing is saved
  });

  const [puncStartTime, setPuncStartTime] = useState("");
  const [puncEndTime, setPuncEndTime] = useState("");

  const handleInputChange = (index, field, value) => {
    const updatedBreakTime = [...breakTime];
    updatedBreakTime[index][field] = value;
    setBreakTime(updatedBreakTime);
  };

  const [clickCount, setClickCount] = useState(0); // Counter to track clicks

  const handleSubmit = async () => {
    try {
      // Validate that all break times have start and end
      breakTimes.forEach((slot, index) => {
        if (!slot.start || !slot.end) {
          throw new Error(`Please fill both start and end time for Break ${index + 1}.`);
        }
      });
  
      const currentDate = new Date().toISOString().split("T")[0];
<<<<<<< HEAD
      const forcedTimezone = 'Asia/Karachi'; // This ensures +05:00
  
      const requestData = employees.map((employee) => {
=======
  
      // Build request for each employee
      const requestData = employees.map((employee) => {
        const timezone = employee?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
>>>>>>> 3f40da3f2dbbc57745f8d3ce207863f90f08edcd
        const timezoneOffset = employee?.timezoneOffset ?? new Date().getTimezoneOffset();
  
        const formattedBreakTimes = breakTimes.map((slot) => {
          const breakStartRaw = `${currentDate}T${slot.start}`;
          const breakEndRaw = `${currentDate}T${slot.end}`;
  
<<<<<<< HEAD
          const breakStartTime = moment.tz(breakStartRaw, forcedTimezone).format(); // 👈 +05:00 always
          const breakEndTime = moment.tz(breakEndRaw, forcedTimezone).format();
=======
          const breakStartTime = moment.tz(breakStartRaw, timezone).format();
          const breakEndTime = moment.tz(breakEndRaw, timezone).format();
>>>>>>> 3f40da3f2dbbc57745f8d3ce207863f90f08edcd
  
          const durationMinutes = (moment(breakEndTime).toDate() - moment(breakStartTime).toDate()) / (1000 * 60);
          const hours = Math.floor(durationMinutes / 60);
          const minutes = durationMinutes % 60;
  
          return {
            TotalHours: `${hours}h:${minutes}m`,
            breakStartTime,
            breakEndTime,
          };
        });
  
        return {
          userId: employee._id,
          settings: {
            breakTime: formattedBreakTimes,
<<<<<<< HEAD
            timezone: forcedTimezone,
=======
            timezone: timezone,
>>>>>>> 3f40da3f2dbbc57745f8d3ce207863f90f08edcd
            timezoneOffset: timezoneOffset,
          },
        };
      });
  
      console.log("breaktimeDta ===>", requestData);
  
<<<<<<< HEAD
=======
      // API call
>>>>>>> 3f40da3f2dbbc57745f8d3ce207863f90f08edcd
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
        enqueueSnackbar("Failed to submit punctuality rule.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(
        error.message || "Error submitting punctuality rule. Please try again later.",
        { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } }
      );
      console.error("Error submitting punctuality rule:", error);
    }
  };
  
<<<<<<< HEAD
  
  
=======
>>>>>>> 3f40da3f2dbbc57745f8d3ce207863f90f08edcd

  const handleRemoveBreakTime = (index) => {
    if (breakTimes.length > 0) {
      const updatedBreakTimes = breakTimes.filter((_, i) => i !== index); // Remove the specified index
      setBreakTimes(updatedBreakTimes);

      if (updatedBreakTimes.length === 0) {
        // If all break times are removed, reset total duration to 0h 0m
        setTotalDuration("0h:0m");
      } else {
        // Recalculate total duration
        let totalMinutes = 0;
        updatedBreakTimes.forEach(({ start, end }) => {
          if (start && end) {
            const startTime = new Date(`1970-01-01T${start}:00`);
            const endTime = new Date(`1970-01-01T${end}:00`);
            totalMinutes += Math.floor((endTime - startTime) / (1000 * 60));
          }
        });

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        setTotalDuration(`${hours}h:${minutes}m`);
      }

      enqueueSnackbar("Break time removed!", {
        variant: "success",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    } else {
      enqueueSnackbar("No break times to remove.", {
        variant: "warning",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    }
  };



  const handleAddBreakTime = () => {
    if (breakTimes.length < 3) {
      setBreakTimes([...breakTimes, { start: "", end: "", duration: "" }]);
      // setBreakTimes((prevBreakTimes) => [
      //   ...prevBreakTimes,
      //   { start: "", end: "", duration: "" }, // Add new break time
      // ]);
      enqueueSnackbar("Break time added!", {
        variant: "success",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });

      // calculateTotalDuration(newBreakTimes);
    } else {
      enqueueSnackbar("You can only add 3 break times.", {
        variant: "warning",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    }
  };


  const [breakTimes, setBreakTimes] = useState([]);

  useEffect(() => {
    localStorage.setItem("isUsehasVisitedbreak", "true");
    localStorage.setItem("breakTimes", JSON.stringify(breakTimes));
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
  const [totalDuration, setTotalDuration] = useState(
    localStorage.getItem("totalDuration") || "0h:0m"
  );

  // Update localStorage whenever totalDuration changes
  useEffect(() => {
    localStorage.setItem("totalDuration", totalDuration);
  }, [totalDuration]);



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

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    setTotalDuration(`${hours}h:${minutes}m`);

    // Disable the button if total duration equals 1 hour
    setIsAddButtonDisabled(totalMinutes >= 60);
  };
  const handleFilteredEmployees = (filteredEmployees) => {
    console.log("Filtered Employees:", filteredEmployees);
    setfilter(filteredEmployees)
  };
  return (
    <div>
      <SnackbarProvider />
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
      <EmployeeFilter employees={employees} onFilter={handleFilteredEmployees} />

      {/* Total Duration */}
      {(
        <>
          <div>
            <h3 style={{ marginTop: 20 }}>Total Break Time:</h3>
            <label htmlFor="totalDuration">Total Duration:</label>
            <input
              id="totalDuration"
              type="text"
              value={totalDuration}
              readOnly // Prevent direct editing
              style={{
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          {/* <input type="text" value={totalDuration} readOnly placeholder="Total Duration" /> */}

          <div className="takeScreenShotDiv">
            <div className="d-flex gap-3">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column", // Ensures new rows are added below each other
                  gap: "10px", // Adds spacing between rows
                }}
              >

                {/* {breakTimes.map((breakTime, index) => ( */}
                {breakTimes.map((breakTime, index) =>
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    {/* <h3>Break Time {index + 1}</h3> */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <label style={{ marginRight: "10px" }}>Break Start Time: {" "}</label>
                      <input
                        type="time"
                        value={breakTime.start || ""}
                        onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                        onChange={(e) =>
                          handleBreakTimeChange(index, "start", e.target.value)
                        }
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <label style={{ marginRight: "10px" }}>Break End Time:</label>
                      <input
                        type="time"
                        value={breakTime.end || ""}
                        onFocus={(e) => e.target.showPicker()}
                        onChange={(e) => handleBreakTimeChange(index, "end", e.target.value)}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveBreakTime(index)} // Pass index here
                      style={{
                        backgroundColor: "#7fc45a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="d-flex gap-3">
            <button
              onClick={handleAddBreakTime}
              disabled={isAddButtonDisabled} // Disable based on calculated total duration
              // disabled={clickCount >= 2} // Disable button after 2 clicks
              style={{
                padding: "10px 20px",
                backgroundColor: clickCount >= 2 ? "#ccc" : "#7fc45a",
                color: "#fff",
                gap: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: clickCount >= 2 ? "not-allowed" : "pointer",
              }}
            >
              Add Break Time
            </button>

            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 20px",
                backgroundColor: "#7fc45a",
                color: "#fff",
                border: "none",
                borderRadius: "5px",

              }}
            >
              Save
            </button>
          </div>
        </>
      )}



      <div className="activityLevelIndividual">
        <p className="settingScreenshotIndividual">Individual Settings</p>
        <p className="individualSettingFont">
          If enabled, the individual setting will be used instead of the team
          setting
        </p>

        <CompanyEmployess Setting={Setting} employees={filter.length > 0 ? filter : employees} />

      </div>
    </div>
  );
}

export default Screenshot;
