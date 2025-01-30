import React, { useEffect, useState } from "react";
import Switch from "../../screen/component/switch";
import user from "../../images/groupImg.svg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CompanyEmployess from "../../screen/component/breakTimeEmployess";
import SaveChanges from "../../screen/component/button";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import {
  getEmployess,
  setAllUserSetting,
  setAllUserSetting2,
  setAllUserSetting3,
  setEmployess,
  setEmployessSetting,
  setEmployessSetting2,
  setEmployessSetting4,
} from "../../store/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function Screenshot() {
  let token = localStorage.getItem("token");
  let headers = {
    Authorization: "Bearer " + token,
  };
  // const [startTime, setStartTime] = useState("");
  // const [endTime, setEndTime] = useState("");
  const dispatch = useDispatch();
  const [number, setNumber] = useState(null);
  const ids = useSelector((state) => state.adminSlice.ids);
  const employees = useSelector((state) => state?.adminSlice?.employess);

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
        <div>
          <input
            checked={employee?.effectiveSettings?.screenshots?.enabled === true}
            onChange={() => {
              handleApplySettings(employee, "setting1", true);
              dispatch(
                setEmployessSetting({ id: employee._id, checked: true })
              );
            }}
            type="radio"
            id={`${employee._id}_take`} // Unique ID for "Take" option
            name={`${employee._id}_takeOption`} // Unique name for this user's radio button group
            value="take"
          />
          <label htmlFor={`${employee._id}_take`}>Take21212</label>
        </div>
        <div>
          <select
            value={number}
            className="myselect"
            onChange={(e) => {
              handleApplySettings(employee, "setting2", e.target.value);
              dispatch(
                setEmployessSetting2({
                  id: employee._id,
                  frequency: e.target.value,
                })
              );
            }}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={12}>12</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
        </div>
        <div>
          <p>per hour</p>
        </div>
        <div>
          <select
            value={
              employee?.effectiveSettings?.screenshots?.allowBlur === true
                ? "Blur"
                : "Do Not Blur"
            }
            className="myselect"
            onChange={(e) => {
              const isBlurAllowed = e.target.value === "Blur"; // Check for "Blur" option
              handleApplySettings(employee, "setting3", isBlurAllowed);
              dispatch(
                setEmployessSetting4({
                  id: employee._id,
                  checked: isBlurAllowed,
                })
              );
            }}
          >
            <option value="Blur">Allow Blur</option>
            <option value="Do Not Blur">Disallow Blur</option>
            <option value="Blur All">Blur all</option>
          </select>
        </div>
        {/* <div>
                    <input
                    type="checkbox"
                        name="fav_language"
                    />
                    <label for="test2">Do not take</label>
                </div> */}
        <div>
          <input
            checked={
              employee?.effectiveSettings?.screenshots?.enabled === false
            }
            onChange={() => {
              handleApplySettings(employee, "setting1", false);
              dispatch(
                setEmployessSetting({ id: employee._id, checked: false })
              );
            }}
            type="radio"
            id={`${employee._id}_do_not_take`} // Unique ID for "Do Not Take" option
            name={`${employee._id}_takeOption`} // Unique name for this user's radio button group
            value="do_not_take"
          />
          <label htmlFor={`${employee._id}_do_not_take`}>Do Not Take</label>
        </div>
      </>
    );
  }

  async function handleApply(type) {
    try {
      const res = await axios.patch(
        `https://myuniversallanguages.com:9093/api/v1/superAdmin/settingsE`,
        employees
          ?.filter((f) => f.effectiveSettings?.individualss === false)
          .map((prevEmployess) => {
            return {
              userId: prevEmployess._id,
              settings: {
                ...prevEmployess?.effectiveSettings,
                screenshots: {
                  ...prevEmployess?.effectiveSettings?.screenshots,
                  enabled: type === "take" ? true : false,
                },
                userId: prevEmployess._id,
              },
            };
          }),
        { headers }
      );
      if (res.status === 200) {
        enqueueSnackbar("Employee settings updated", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      }
      console.log(res);
    } catch (error) {
      if (error.response && error.response.data) {
        if (
          error.response.status === 404 &&
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
        `https://myuniversallanguages.com:9093/api/v1/superAdmin/employees`,
        { headers }
      );
      const json = await response.json();
      const employeesData = json?.convertedEmployees || [];
  
      // Transform and set breakTimes to show in UTC format
      const transformedBreakTimes =
        employeesData[0]?.punctualityData?.breakTime.map((breakEntry) => {
          const breakStartUTC = new Date(breakEntry.breakStartTime).toISOString(); // Store in UTC
          const breakEndUTC = new Date(breakEntry.breakEndTime).toISOString(); // Store in UTC
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
  
  

  //
  //
  //
  //
  useEffect(() => {
    getData();
  }, []);

  console.log("screenshot employess =====>", employees);
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

  const validateAndFormatDuration = (input) => {
    const regex = /^(\d+)\s*hr\s*(\d+)?\s*min?$/i; // Match inputs like "0 hr 1 min"
    const match = input.match(regex);

    if (match) {
      const hours = parseInt(match[1], 10) || 0; // Extract hours
      const minutes = parseInt(match[2], 10) || 0; // Extract minutes

      if (hours === 0 && minutes >= 1 && minutes <= 59) {
        // Allow valid range for 0 hours
        setCalculatedDuration(`0 hr ${minutes} min`);
        calculateStartAndEndTime(0, minutes);
      } else if (hours === 1 && minutes === 0) {
        // Allow exactly 1 hr 0 min
        setCalculatedDuration("1 hr 0 min");
        calculateStartAndEndTime(1, 0);
      } else {
        // Invalid input
        setCalculatedDuration("Invalid Time Range");
        alert(
          "Please enter a valid duration between 0 hr 1 min and 1 hr 0 min."
        );
      }
    } else if (input === "") {
      // Clear input
      setCalculatedDuration("");
    } else {
      // Invalid input
      setCalculatedDuration("Invalid Time Range");
      alert("Please enter a valid duration between 0 hr 1 min and 1 hr 0 min.");
    }
  };

  const formatDurationInput = (input) => {
    const regex = /^(\d+)\s*:?(\d+)?$/; // Matches numbers with optional separator (e.g., "2 30" or "2:30")
    const match = input.match(regex);

    if (match) {
      const hours = Math.min(parseInt(match[1], 10) || 0, 1); // Restrict hours to max 1
      const minutes = parseInt(match[2], 10) || 0;

      if (hours === 1 && minutes > 0) {
        // If hours is 1, minutes must be 0
        setCalculatedDuration("1 hr 0 min");
        calculateStartAndEndTime(1, 0);
      } else if (hours === 0 && minutes >= 1 && minutes <= 59) {
        // Allow valid minutes range for 0 hours
        setCalculatedDuration(`0 hr ${minutes} min`);
        calculateStartAndEndTime(0, minutes);
      } else if (hours === 1 && minutes === 0) {
        // Allow exactly 1 hr 0 min
        setCalculatedDuration("1 hr 0 min");
        calculateStartAndEndTime(1, 0);
      } else {
        // Invalid input outside the range
        setCalculatedDuration("Invalid Time Range");
        alert(
          "Please enter a valid duration between 0 hr 1 min and 1 hr 0 min."
        );
      }
    } else {
      setCalculatedDuration("");
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

  const formatEndTime = (startDate, hours, minutes) => {
    const endDate = new Date(startDate);
    endDate.setHours(
      startDate.getHours() + hours,
      startDate.getMinutes() + minutes
    );
    return endDate.toTimeString().slice(0, 5);
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    calculateDuration(newStartTime, endTime);
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    calculateDuration(startTime, newEndTime);
  };


  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false); // Track if the Add Break Time button is disabled

  const calculateDuration = (start, end) => {
    if (start && end) {
      const startDate = new Date(`1970-01-01T${start}:00`);
      const endDate = new Date(`1970-01-01T${end}:00`);

      if (endDate > startDate) {
        const durationMs = endDate - startDate;
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor(
          (durationMs % (1000 * 60 * 60)) / (1000 * 60)
        );

        setCalculatedDuration(`${durationHours}h:${durationMinutes}m`);
      } else {
        setCalculatedDuration("Invalid Time Range");
        enqueueSnackbar("End time must be after start time.", {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      }
    } else {
      setCalculatedDuration("");
    }
  };

  const validateTimeDifference = (start, end) => {
    if (start && end) {
      const startDate = new Date(`1970-01-01T${start}:00`);
      const endDate = new Date(`1970-01-01T${end}:00`);

      const differenceMs = endDate - startDate;
      const differenceMinutes = differenceMs / (1000 * 60); // Convert ms to minutes

      if (differenceMinutes > 60) {
        enqueueSnackbar("The time difference cannot exceed 1 hour.", {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
        setEndTime(""); // Clear the invalid end time
      } else if (differenceMinutes < 0) {
        enqueueSnackbar("End time must be after start time.", {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
        setEndTime(""); // Clear the invalid end time
      } else {
        setEndTime(end); // Valid end time
      }
    }
  };

  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
    // Reset all fields when checkbox is unchecked
    if (isCheckboxChecked) {
      setStartTime("");
      setEndTime("");
      setCalculatedDuration("");
    }
  };


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


  const [breakCount, setBreakCount] = useState(0); // Track the number of breaks added

  const addBreakTimeField = () => {
    if (breakCount < 2) {
      setBreakCount(breakCount + 1);
      enqueueSnackbar("Break time added!", {
        variant: "success",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
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




  
 
  const handleSubmit = async () => {
    try {
      // Validate that all break times have start and end
      breakTimes.forEach((slot, index) => {
        if (!slot.start || !slot.end) {
          throw new Error(`Please fill both start and end time for Break ${index + 1}.`);
        }
      });
  
      // Format the break times in UTC
      const formattedBreakTimes = breakTimes.map((slot) => {
        const currentDate = new Date().toISOString().split("T")[0]; // Get today's date
        const breakStartTime = new Date(`${currentDate}T${slot.start}:00Z`).toISOString();
        const breakEndTime = new Date(`${currentDate}T${slot.end}:00Z`).toISOString();
  
        // Calculate total hours and minutes
        const durationMinutes =
          (new Date(breakEndTime) - new Date(breakStartTime)) / (1000 * 60);
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
  
        return {
          TotalHours: `${hours}h:${minutes}m`,
          breakStartTime,
          breakEndTime,
        };
      });
  
      // Prepare only the specific userIds (do not update global allUsers)
      const specificUserIds = employees.map((employee) => employee._id);
  
      // API payload: send only userIds and breakTime settings
      const requestData = specificUserIds.map((userId) => ({
        userId,
        settings: {
          breakTime: formattedBreakTimes,
          puncStartTime: "2024-11-21T09:00:00.000Z", // Example time
          puncEndTime: "2024-11-21T17:00:00.000Z",
        },
      }));
  
      // API call to update break time for selected userIds
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
      // Handle errors without affecting global states
      enqueueSnackbar(
        error.message || "Error submitting punctuality rule. Please try again later.",
        { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } }
      );
      console.error("Error submitting punctuality rule:", error);
    }
  };
  


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

  const handleIndividualPunctualitySubmit = async () => {
    try {
      // Create the request payload for all users
      const requestData = employees.map((employee) => ({
        userId: employee.userId, // Extract userId dynamically
        settings: {
          breakTime: breakTime.map((slot) => {
            const startTime = new Date(slot.breakStartTime);
            const endTime = new Date(slot.breakEndTime);

            // Calculate total hours and minutes
            const totalMinutes = Math.floor(
              (endTime - startTime) / (1000 * 60)
            );
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            return {
              TotalHours: `${hours}h:${minutes}m`,
              breakStartTime: startTime.toISOString(),
              breakEndTime: endTime.toISOString(),
            };
          }),
          puncStartTime: new Date(puncStartTime).toISOString(),
          puncEndTime: new Date(puncEndTime).toISOString(),
        },
      }));

      console.log("Request Data:", requestData); // Debugging

      // Send the POST request to the API
      const response = await axios.post(
        "https://myuniversallanguages.com:9093/api/v1/superAdmin/addIndividualPunctuality",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        enqueueSnackbar("Punctuality rules successfully submitted!", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
        console.log("API Response:", response.data);
      } else {
        enqueueSnackbar("Failed to submit punctuality rules.", {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      }
    } catch (error) {
      console.error("Error submitting punctuality rules:", error);
      enqueueSnackbar(
        error?.response?.data?.message ||
        "An error occurred while submitting the rules.",
        {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        }
      );
    }
  };

  // const handleStartTimeChange = (e) => {
  //     const newStartTime = e.target.value;
  //     setStartTime(newStartTime);
  //     calculateDuration(newStartTime, endTime);
  // };

  // const handleEndTimeChange = (e) => {
  //     const newEndTime = e.target.value;
  //     setEndTime(newEndTime);
  //     calculateDuration(startTime, newEndTime);
  // };
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

  // const [breakTimes, setBreakTimes] = useState([]); // Track the added break times
  const [breakTimes, setBreakTimes] = useState([]);
  // Load break times from localStorage when the component mounts
  // const savedBreakTimes = localStorage.getItem("breakTimes");
  // return savedBreakTimes ? JSON.parse(savedBreakTimes) : []; // Default to an empty array if nothing is saved
  //   });

  // Save breakTimes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("breakTimes", JSON.stringify(breakTimes));
  }, [breakTimes]);
  // const handleBreakTimeChange = (index, field, value) => {
  //     const newBreakTimes = [...breakTimes];
  //     newBreakTimes[index][field] = value;
  //     setBreakTimes(newBreakTimes);
  // };
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

  return (
    <div>
      <SnackbarProvider />
      <div
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
        <p>How frequently screenshots will be taken.</p>
        <p>
          This number is an average since screenshots are taken at random
          intervals.
        </p>
      </div>
      {/* Total Duration */}
      <h3>Total Break Time:</h3>
      <div>
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
            {console.log("meee yaha hn bhai aap ka breakTime", breakTime)}
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
                <div>
                  <label>Break Start Time:</label>
                  <input
                    type="time"
                    value={breakTime.start || ""}
                    onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                    onChange={(e) =>
                      handleBreakTimeChange(index, "start", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label>Break End Time:</label>
                  <input
                    type="time"
                    value={breakTime.end || ""}
                    onFocus={(e) => e.target.showPicker()} // Automatically open the time picker
                    onChange={(e) =>
                      handleBreakTimeChange(index, "end", e.target.value)
                    }
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
          {/* <div style={{ marginTop: "20px" }}>
                        <h3>Total Duration:</h3>
                        <input type="text" value={totalDuration} readOnly placeholder="Total Duration" />
                    </div> */}
        </div>
      </div>
      {/* <h3>Total Duration:</h3>
            <input type="text" value={totalDuration} readOnly placeholder="Total Duration" /> */}
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
            // cursor: clickCount >= 2 ? "not-allowed" : "pointer",
          }}
        >
          Save
        </button>
      </div>

      <div className="activityLevelIndividual">
        <p className="settingScreenshotIndividual">Individual Settings</p>
        <p className="individualSettingFont">
          If enabled, the individual setting will be used instead of the team
          setting
        </p>
        {/* {loading ? (
                    <>
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                        <Skeleton count={1} height="107px" style={{ margin: "0 0 10px 0" }} />
                    </>
                ) : ( */}
        <CompanyEmployess Setting={Setting} />
        {/* )} */}
      </div>
    </div>
  );
}

export default Screenshot;
