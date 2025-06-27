import axios from 'axios';
import jwtDecode from 'jwt-decode';
import * as L from "leaflet";

import "leaflet/dist/leaflet.css";
import { SnackbarProvider } from 'notistack';
import { useEffect, useRef, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import Joyride from 'react-joyride';
import makeAnimated from 'react-select/animated';
// import SelectBox from '../companyOwner/ownerComponent/selectBox';
import SelectBox from '../companyOwner/ownerComponent/selectedBox';
import { components } from 'react-select';
// import { useRef } from 'react';
import { useSnackbar } from 'notistack';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const apiUrlS = 'https://myuniversallanguages.com:9093/api/v1';

// import Select from "react-select";

// Custom option with green dot
const CustomOption = ({ data, innerRef, innerProps }) => {
    return (
        <div ref={innerRef} {...innerProps} style={{ display: "flex", alignItems: "center", padding: 6 }}>
            <span style={{
                height: 10,
                width: 10,
                borderRadius: "50%",
                backgroundColor: data.dotColor,
                marginRight: 8
            }} />
            {data.label}
        </div>
    );
};

const CustomSingleValue = ({ data }) => {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{
                height: 10,
                width: 10,
                borderRadius: "50%",
                backgroundColor: data.dotColor,
                marginRight: 8
            }} />
            {data.label}
        </div>
    );
};

const LocaitonTracking = () => {
    const [loadingMap, setLoadingMap] = useState(false);
    const [run, setRun] = useState(true);
    const [setStepIndex] = useState(0);
    const [users, setUsers] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0); // Total distance in KM
    const [totalTime, setTotalTime] = useState("0h 0m");
    const tokens = localStorage.getItem("token");
    const [showFullSummary, setShowFullSummary] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [trackingSummaries, setTrackingSummaries] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userNames, setUserNames] = useState([]);
    const [loadingSummary, setLoadingSummary] = useState(false);

    const mapRef = useRef(null);

    // const summaryPreviewCount = 3;
    const items = jwtDecode(JSON.stringify(tokens));
    const [userID, setuserId] = useState(items?._id)
    // const [overviewData, setOverviewData] = useState({
    //     totalDistance: "0 KM",
    //     totalTime: "0h : 0m",
    // });

    let headers = {
        Authorization: 'Bearer ' + tokens,
    }

    const [dataAvailability, setDataAvailability] = useState([]); // To hold dates with dataExist=true
    const [activeSummary, setActiveSummary] = useState([]);

    // State to hold map polyline data
    const [polylinePath, setPolylinePath] = useState([]);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    // const [selectedDate, setSelectedDate] = useState(`${yyyy}-${mm}-${dd}`);
    const [selectedDate, setSelectedDate] = useState(new Date());
    // const [selectedDate, setSelectedDate] = useState(`${yyyy}-${mm}-${dd}`);

    const handleDateChange = (date) => {
        setSelectedDate(date); // Update selected date as a Date object
    };

    // const filterByTwoMinutes = (entries) => {
    //     const filtered = [];
    //     let lastTime = null;

    //     for (let i = 0; i < entries.length; i++) {
    //         const entry = entries[i];

    //         // Convert time to Date object (assumes entry.time is like "9:24 AM")
    //         const currentTime = new Date(`1970-01-01T${convertTo24Hr(entry.time)}`);

    //         if (!lastTime || (currentTime - lastTime) / 60000 >= 2) {
    //             filtered.push(entry);
    //             lastTime = currentTime;
    //         }
    //     }

    //     return filtered;
    // };

    // // Helper to convert "9:24 AM" → "09:24"
    // const convertTo24Hr = (timeStr) => {
    //     const [time, modifier] = timeStr.split(" ");
    //     let [hours, minutes] = time.split(":");
    //     if (modifier === "PM" && hours !== "12") hours = String(+hours + 12);
    //     if (modifier === "AM" && hours === "12") hours = "00";
    //     return `${hours.padStart(2, "0")}:${minutes}:00`;
    // };
    const filterByTwoMinutes = (entries) => {
        const filtered = [];
        let lastTime = null;

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            // Convert "9:24 AM" → "09:24:00" → Date object
            const currentTime = new Date(`1970-01-01T${convertTo24Hr(entry.time)}`);

            if (!lastTime || (currentTime - lastTime) / 60000 >= 5) {
                filtered.push(entry);
                lastTime = currentTime;
            }
        }

        return filtered;
    };

    const convertTo24Hr = (timeStr) => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":");
        if (modifier === "PM" && hours !== "12") hours = String(+hours + 12);
        if (modifier === "AM" && hours === "12") hours = "00";
        return `${hours.padStart(2, "0")}:${minutes}:00`;
    };

    const filteredSummaries = filterByTwoMinutes(trackingSummaries);

    const steps = [
        {
            target: '#stepone',
            content: 'here you can see your location total distance and total time',
            disableBeacon: true,
            continuous: true,
        },
        {
            target: '#datePicker',
            content: 'here you can select the date you want to see your location tracking',
            continuous: true,
        },
        {
            target: '#mapView',
            content: 'here you can see routes in map',
            continuous: true,
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
    // const fetchData = async (dateStr) => {
    //     try {
    //         const formattedDate = dateStr; // Already in YYYY-MM-DD format
    //         const token = localStorage.getItem("token");

    //         const endpoint =
    //             items?.userType === "user"
    //                 ? `${apiUrlS}/tracker/getTrackerDataByDate/${userID}?date=${formattedDate}`
    //                 : `${apiUrlS}/owner/getTrackerDataByUser/${userID}?date=${formattedDate}`;

    //         const response = await fetch(endpoint, {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         if (!response.ok) {
    //             console.log("Response not OK:", response.status);
    //         }

    //         const data = await response.json();

    //         if (data.success) {
    //             console.log("API Response:", data.data);

    //             const groupedLocations = data.data.groupedLocations;

    //             let totalDistance = 0;
    //             let totalTimeMinutes = 0;
    //             let activeSummary = [];
    //             let polylines = []; // Array to hold multiple polyline paths

    //             groupedLocations.forEach((group) => {
    //                 group.locations.forEach((location) => {
    //                     totalDistance += location.distance;

    //                     // Parse and sum up the times
    //                     const timeParts = location.totalTime.split(" ");
    //                     const hours = parseInt(timeParts[0].replace("h", "")) || 0;
    //                     const minutes = parseInt(timeParts[1].replace("m", "")) || 0;

    //                     totalTimeMinutes += hours * 60 + minutes;

    //                     // Extract location data for the active summary
    //                     location.location.forEach((loc) => {
    //                         activeSummary.push(`${loc.location} at ${loc.time}`);
    //                     });

    //                     // Add coordinates for the polyline
    //                     const polyline = location.coordinates.map((coord) => [
    //                         parseFloat(coord.latitude),
    //                         parseFloat(coord.longitude),
    //                     ]);
    //                     polylines.push(polyline);
    //                 });
    //             });

    //             // Convert total minutes back to hours and minutes format
    //             const totalHours = Math.floor(totalTimeMinutes / 60);
    //             const totalMinutes = totalTimeMinutes % 60;

    //             // Update the states
    //             setTotalDistance(totalDistance.toFixed(2));
    //             setTotalTime(`${totalHours}h ${totalMinutes}m`);
    //             setActiveSummary(activeSummary);
    //             setPolylinePath(polylines);
    //         } else {
    //             console.error("API call was not successful.");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // };

    // const getMobileTrackerUsers = async () => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         const response = await axios.get(`${apiUrlS}/tracker/getMobileTrackerUsers`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         if (response.status === 200 && Array.isArray(response.data)) {
    //             const usersArray = response.data;

    //             /* The above code is a JavaScript code snippet that is using the `map` method on an array called
    //             `usersArray`. It is transforming each element of the `usersArray` array into a new object with three
    //             properties: `value`, `label`, and `isActiveOnMb`. The `value` property is set to the `_id` of the
    //             user, the `label` property is set to the `name` of the user, and the `isActiveOnMb` property is set
    //             to a boolean value based on whether the `isActiveOnMb` property of the user is `true`. However */
    //             // const formattedUsers = usersArray.map(user => ({
    //             //     value: user._id,
    //             //     label: user.name,
    //             //     isActiveOnMb: user.isActiveOnMb === true
    //             // }));
    //             const formattedUsers = usersArray.map(user => ({
    //                 value: user._id,
    //                 label: user.name,
    //                 isActiveOnMb: user.isActiveOnMb === true
    //             }));

    //             const sortedUsers = formattedUsers.sort((a, b) => a.label.localeCompare(b.label));
    //             setUsers(sortedUsers); // 🔁 populates dropdown
    //             return sortedUsers; // ✅ returning in case you want it elsewhere
    //         } else {
    //             console.warn("⚠️ Unexpected API response:", response.data);
    //             setUsers([]);
    //             return [];
    //         }
    //     } catch (error) {
    //         console.error("❌ Error calling getMobileTrackerUsers API:", error);
    //         setUsers([]);
    //         return [];
    //     }
    // };

    useEffect(() => {
        if (selectedUser && users.length > 0) {
            const match = users.find(u => u.value === selectedUser.value);
            if (match && JSON.stringify(match) !== JSON.stringify(selectedUser)) {
                setSelectedUser(match); // 🔁 Resync with updated hasTodayData
            }
        }
    }, [users]);

    useEffect(() => {
        if (users.length > 0 && !selectedUser) {
            setSelectedUser(users[0]);
            setuserId(users[0].value);
            fetchAvailableDates(users[0].value);
        }
    }, [users]);

    const fetchData = async (dateStr) => {
        try {
            setLoadingSummary(true); // START loading
            const formattedDate = dateStr;
            const token = localStorage.getItem("token");

            const endpoint =
                items?.userType === "user"
                    ? `${apiUrlS}/tracker/getTrackerDataByDate/${userID}?date=${formattedDate}`
                    : `${apiUrlS}/owner/getTrackerDataByUser/${userID}?date=${formattedDate}`;

            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.log("Response not OK:", response.status);
            }

            const data = await response.json();

            if (data.success) {
                console.log("API Response:", data.data);

                const groupedLocations = data.data.groupedLocations;

                let totalDistance = 0;
                let totalTimeMinutes = 0;
                let activeSummary = [];
                let polylines = [];
                let trackingSummaries = []; // 🆕 new array to store group-level summaries
                let flattenedSummaries = [];

                groupedLocations.forEach((group) => {
                    // 🟢 Add group-level time/location summary
                    trackingSummaries.push({
                        startTime: group.startTime,
                        endTime: group.endTime,
                        StartLocation: group.StartLocation,
                        EndLocation: group.EndLocation,
                    });

                    group.locations.forEach((location) => {
                        totalDistance += location.distance;

                        // Parse and sum up time
                        const timeParts = location.totalTime.split(" ");
                        const hours = parseInt(timeParts[0].replace("h", "")) || 0;
                        const minutes = parseInt(timeParts[1].replace("m", "")) || 0;
                        totalTimeMinutes += hours * 60 + minutes;

                        // Location timeline
                        location.location.forEach((loc) => {
                            const summary = `${loc.location} at ${loc.time}`;
                            activeSummary.push(summary);

                            flattenedSummaries.push({
                                location: loc.location,
                                time: loc.time,
                                startTime: group.startTime,
                                endTime: group.endTime,
                            });
                        });

                        // Polyline coordinates
                        const polyline = location.coordinates.map((coord) => [
                            parseFloat(coord.latitude),
                            parseFloat(coord.longitude),
                        ]);
                        polylines.push(polyline);
                    });
                });

                // Convert to readable format
                const totalHours = Math.floor(totalTimeMinutes / 60);
                const totalMinutes = totalTimeMinutes % 60;

                // Update states
                setTotalDistance(totalDistance.toFixed(2));
                setTotalTime(`${totalHours}h ${totalMinutes}m`);
                setActiveSummary(activeSummary);
                setPolylinePath(polylines);
                setTrackingSummaries(flattenedSummaries); // ✅ Use this new structure
            } else {
                console.error("API call was not successful.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        finally {
            setLoadingSummary(false); // END loading
        }
    };

    const hasShownNoDataSnackbar = useRef(false);

    const fetchAvailableDates = async (uid) => {
        try {
            setLoadingMap(true);
            hasShownNoDataSnackbar.current = false;

            const today = new Date();
            const formattedToday = today.toISOString().split("T")[0];

            const response = await axios.get(
                `${apiUrlS}/tracker/getTrackerDataByDate/${uid}?date=${formattedToday}`,
                { headers }
            );

            if (response.data.success) {
                const fetchedDates = response.data.data.dataByDay.map(day => {
                    const [d, m, y] = day.date.split("-");
                    const localDate = new Date(+y, +m - 1, +d);

                    return {
                        value: localDate.toISOString().split("T")[0],
                        label: `${localDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })} (${day.dataExist ? 'Data Available' : 'No Data'})`,
                        isAvailable: day.dataExist,
                    };
                });

                setDataAvailability(fetchedDates);

                // ✅ ✅ ✅ Now check hasTodayData from freshly fetched dates
                const hasTodayData = fetchedDates.some(
                    d => d.value === formattedToday && d.isAvailable
                );

                // setUsers(prevUsers =>
                //     prevUsers.map(user =>
                //         user.value === uid ? { ...user, hasTodayData } : user
                //     )
                // );
                setUsers(prevUsers => {
                    const updatedUsers = prevUsers.map(user =>
                        user.value === uid ? { ...user, hasTodayData } : user
                    );

                    // ✅ Sync selectedUser with updated object
                    const updatedSelected = updatedUsers.find(u => u.value === uid);
                    setSelectedUser(updatedSelected);

                    return updatedUsers;
                });

                setSelectedUser(() => {
                    const updated = users.find(u => u.value === uid);
                    return updated || null;
                });

                const firstAvailable = fetchedDates.find(d => d.isAvailable);
                if (firstAvailable) {
                    const [year, month, day] = firstAvailable.value.split("-");
                    const localDate = new Date(+year, +month - 1, +day);
                    setSelectedDate(localDate);

                    const formattedDate = `${year}-${month}-${day}`;
                    fetchData(formattedDate);
                } else {
                    setSelectedDate(today);
                }
            }
        } catch (err) {
            console.error("Error fetching availability:", err);
            setDataAvailability([]);
            setSelectedDate(new Date());

            if (!hasShownNoDataSnackbar.current) {
                enqueueSnackbar("Error fetching data", { variant: "error" });
                hasShownNoDataSnackbar.current = true;
            }
        } finally {
            setLoadingMap(false);
        }
    };


    // Fetch data whenever the selected date changes
    // useEffect(() => {
    //     fetchData(selectedDate);
    // }, [selectedDate]);  // ✅ run only when selectedDate changes

    // useEffect(() => {
    //     const yyyy = selectedDate.getFullYear();
    //     const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    //     const dd = String(selectedDate.getDate()).padStart(2, '0');
    //     const dateStr = `${yyyy}-${mm}-${dd}`;
    //     fetchData(dateStr);
    // }, [selectedDate]);
    useEffect(() => {
        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;
        fetchData(dateStr);
    }, [selectedDate]);

    // const handleSelectUsers = (e) => {
    //     setuserId(e?.value)
    //     console.log('here', e?.value)
    // }
    // const handleSelectUsers = (e) => {
    //     const selectedUserId = e?.value;

    //     if (!selectedUserId) {
    //         enqueueSnackbar("Please select the user", { variant: "warning" });
    //         return;
    //     }

    //     setuserId(selectedUserId);
    //     fetchAvailableDates(selectedUserId);
    // };
    // const handleSelectUsers = (e) => {
    //     const selectedUserId = e?.value;

    //     if (!selectedUserId) {
    //         enqueueSnackbar("Please select the user", { variant: "warning" });
    //         return;
    //     }

    //     setSelectedUser(e); // <-- save the full object
    //     setuserId(selectedUserId);
    //     fetchAvailableDates(selectedUserId);
    // };

    const handleSelectUsers = (e) => {
        const fullUser = users.find(u => u.value === e?.value);
        if (!fullUser) return;

        setSelectedUser(fullUser);   // ✅ must use the updated object with hasTodayData
        setuserId(fullUser.value);
        fetchAvailableDates(fullUser.value);
    };

    // const handleSelectUsers = (e) => {
    //     const selectedUserId = e?.value;
    //     setuserId(selectedUserId);
    //     fetchAvailableDates(selectedUserId);  // <-- this line
    // };

    const animatedComponents = makeAnimated();

    // useEffect(() => {
    //     if (userID) {
    //         fetchAvailableDates(userID);
    //     }
    // }, [userID]);  // ✅ run only when userID changes


    useEffect(() => {
        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
            console.warn("Map container not found");
            return;
        }

        // Clean up any previous map
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }

        // Fallback center (New York City in this case)
        const defaultCenter = [40.7128, -74.0060]; // You can change this to any default location
        const initialCenter =
            Array.isArray(polylinePath) &&
                polylinePath.length > 0 &&
                Array.isArray(polylinePath[0]) &&
                polylinePath[0].length > 0
                ? polylinePath[0][0]
                : defaultCenter;

        const mapInstance = L.map(mapContainer, {
            center: initialCenter,
            zoom: 13,
        });
        mapRef.current = mapInstance;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstance);

        const featureGroup = L.featureGroup().addTo(mapInstance);

        polylinePath.forEach((polyline) => {
            if (!Array.isArray(polyline) || polyline.length === 0) return;

            // Always add polyline if at least 2 points exist
            if (polyline.length >= 2) {
                const line = L.polyline(polyline, {
                    color: "blue",
                    weight: 8,
                    opacity: 0.9,
                }).addTo(mapInstance);
                featureGroup.addLayer(line);
            }

            // Always show start marker if 1+ points exist
            const start = polyline[0];
            if (start) {
                const startMarker = L.marker(start, {
                    icon: L.icon({
                        iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        iconSize: [32, 32],
                    }),
                    title: "Start Point",
                }).addTo(mapInstance);
                startMarker.bindPopup("Start Point");
                featureGroup.addLayer(startMarker);
            }

            // Show end marker only if distinct from start
            const end = polyline[polyline.length - 1];
            if (end && polyline.length > 1 && (start[0] !== end[0] || start[1] !== end[1])) {
                const endMarker = L.marker(end, {
                    icon: L.icon({
                        iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        iconSize: [32, 32],
                    }),
                    title: "End Point",
                }).addTo(mapInstance);
                endMarker.bindPopup("End Point");
                featureGroup.addLayer(endMarker);
            }
        });


        // Fit bounds if polylines were drawn
        if (featureGroup.getLayers().length > 0) {
            mapInstance.fitBounds(featureGroup.getBounds(), { padding: [30, 30] });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [polylinePath]);




    const customDayClassName = (date) => {
        const dateStr = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD

        const match = dataAvailability.find((d) => d.value === dateStr && d.isAvailable);

        return match ? "highlighted-date" : "";
    };



    const getManagerEmployees = async () => {
        try {
            const response = await axios.get(`${apiUrlS}/manager/employees`, { headers });
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

    const isToday = (dateStr) => {
        const today = new Date();
        const [day, month, year] = dateStr.split("-");
        const localDate = new Date(+year, +month - 1, +day);
        return localDate.toDateString() === today.toDateString();
    };

    const checkTodayTracking = async (userId) => {
        try {
            const res = await axios.get(
                `${apiUrlS}/tracker/getTrackerDataByDate/${userId}?date=${new Date().toISOString().split("T")[0]}`,
                { headers }
            );

            if (res.data.success && res.data.data?.dataByDay?.length > 0) {
                return res.data.data.dataByDay.some(day => isToday(day.date) && day.dataExist);
            }

            return false;
        } catch (err) {
            console.error(`Error checking tracking for user ${userId}:`, err);
            return false;
        }
    };

    const getEmployess = async () => {
        try {
            const response = await axios.get(`${apiUrlS}/tracker/getMobileTrackerUsers`, { headers });

            if (
                response.status === 200 &&
                response.data &&
                Array.isArray(response.data.updatedUsers)
            ) {
                const employees = response.data.updatedUsers.filter(emp => emp && emp.name && emp._id);

                const formattedUsers = employees.map(emp => {
                    let dotColor = "gray"; // default

                    if (emp.isActiveOnMb && emp.wasActiveInLast24Hours) {
                        dotColor = "green";
                    } else if (!emp.isActiveOnMb && emp.wasActiveInLast24Hours) {
                        dotColor = "orange";
                    } else if (emp.isActiveOnMb && !emp.wasActiveInLast24Hours) {
                        dotColor = "green";
                    }

                    return {
                        value: emp._id,
                        label: emp.name,
                        dotColor
                    };
                });

                // ✅ Sort alphabetically by name (ascending)
                const sortedUsers = formattedUsers.sort((a, b) => a.label.localeCompare(b.label));

                setUsers(sortedUsers);
            } else {
                console.warn("⚠️ Unexpected response structure:", response.data);
                setUsers([]);
            }
        } catch (error) {
            console.error("❌ Error fetching mobile tracker users:", error);
            setUsers([]);
        }
    };

    // const defaultValue = users.length > 0 ? [{ value: users[0].value }] : [];
    const defaultValue = users.length > 0 ? users[0] : null;

    useEffect(() => {
        getEmployess();
    }, []);
    // Converts 24-hour time string like "17:56" or "05:56" to "5:56 PM"
    const formatTo12Hr = (time) => {
        const [hourStr, minuteStr] = time.split(":");
        const hour = parseInt(hourStr);
        const suffix = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${displayHour}:${minuteStr} ${suffix}`;
    };

    // Main summarizer
    const summarizeTimeline = (entries) => {
        if (!Array.isArray(entries)) return [];

        const result = [];
        let buffer = [];
        let lastTime = null;

        for (let i = 0; i < entries.length; i++) {
            const { location, time } = entries[i];

            if (i === 0 || time !== lastTime) {
                if (buffer.length === 1) {
                    result.push(`${formatTo12Hr(lastTime)} - ${buffer[0]}`);
                } else if (buffer.length > 1) {
                    const uniqueLocations = [...new Set(buffer)];
                    result.push(
                        `${formatTo12Hr(lastTime)} - ${uniqueLocations.join(" → ")}${buffer.length > uniqueLocations.length ? " (repeated toggling)" : ""
                        }`
                    );
                }
                buffer = [];
                lastTime = time;
            }

            buffer.push(location);
        }

        // Handle the final group
        if (buffer.length === 1) {
            result.push(`${formatTo12Hr(lastTime)} - ${buffer[0]}`);
        } else if (buffer.length > 1) {
            const uniqueLocations = [...new Set(buffer)];
            result.push(
                `${formatTo12Hr(lastTime)} - ${uniqueLocations.join(" → ")}${buffer.length > uniqueLocations.length ? " (repeated toggling)" : ""
                }`
            );
        }

        return result;
    };


    return (

        <>
            <style>
                {`
    .highlighted-date {
        background-color: #64c47c !important;
        color: white !important;
        border-radius: 50% !important;
        font-weight: bold;
    }
`},
                {`
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`}
            </style>

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
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <h5>Data overview</h5>
                </div>
                <div
                    className="mainwrapper ownerTeamContainer"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        paddingBottom: "90px",
                    }}
                >
                    <div style={{ width: "90%", fontFamily: "Arial, sans-serif", }}>
                        {/* {items?.userType===} */}
                        {items?.userType !== "user" && (
                            <div className="crossButtonDiv">
                                {console.log("Dropdown options:", users)}
                                <SelectBox
                                    onChange={handleSelectUsers}
                                    options={users}
                                    components={{
                                        ...animatedComponents,
                                        Option: CustomOption,
                                        SingleValue: CustomSingleValue,
                                    }}
                                    isLoading={users.length === 0}
                                    loadingMessage={() => "Loading..."}
                                    noOptionsMessage={() => (users.length === 0 ? null : "No users found")}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            minHeight: '38px',       // Prevent extra height
                                            height: '48px',
                                        }),
                                        valueContainer: (provided) => ({
                                            ...provided,
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                            height: '38px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }),
                                        indicatorsContainer: (provided) => ({
                                            ...provided,
                                            height: '38px',
                                        }),
                                        singleValue: (provided) => ({
                                            ...provided,
                                            margin: 0,
                                            padding: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }),
                                        input: (provided) => ({
                                            ...provided,
                                            margin: 0,
                                            padding: 0,
                                        }),
                                    }}
                                />
                                {console.dir(users, { depth: null })}
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", }}>
                            {/* Overview Data */}
                            <div
                                style={{
                                    flex: "1",
                                    marginRight: "10px",
                                    padding: "20px",
                                    textAlign: "left",
                                }}
                            >
                                <h3 style={{
                                    color: "#2C5282", fontSize: "23px", marginBottom: "10px", fontWeight: "600",
                                }}>Overview Data</h3>
                                <div id='stepone' style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", }}>
                                    {/* Total Distance Card */}
                                    <div
                                        style={{
                                            flex: "1",
                                            marginRight: "10px",
                                            padding: "20px",
                                            border: "1px solid #E5E5E5",
                                            borderRadius: "12px",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            textAlign: "center",
                                            backgroundColor: "#FFFFFF",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "#E6F4EA",
                                                    borderRadius: "50%",
                                                }}
                                            >
                                                <span style={{ fontSize: "20px", color: "#32CD32" }}>📍</span>
                                            </div>
                                            <h4 style={{ marginLeft: "10px", color: "#32CD32", fontSize: "16px", fontWeight: "600" }}>
                                                Total Distance
                                            </h4>
                                        </div>
                                        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#2C5282", margin: "0" }}>
                                            {totalDistance} KM
                                        </p>
                                    </div>

                                    {/* Total Time Card */}
                                    <div
                                        style={{
                                            flex: "1",
                                            marginLeft: "10px",
                                            padding: "20px",
                                            border: "1px solid #E5E5E5",
                                            borderRadius: "12px",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            textAlign: "center",
                                            backgroundColor: "#FFFFFF",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                                            <div
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "#E6F4EA",
                                                    borderRadius: "50%",
                                                }}
                                            >
                                                <span style={{ fontSize: "20px", color: "#32CD32" }}>⏱</span>
                                            </div>
                                            <h4 style={{ marginLeft: "10px", color: "#32CD32", fontSize: "16px", fontWeight: "600" }}>
                                                Total Time
                                            </h4>
                                        </div>
                                        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#2C5282", margin: "0" }}>
                                            {totalTime}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Picker */}
                        {loadingMap ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        border: "3px solid #ccc",
                                        borderTop: "3px solid #64C47C",
                                        borderRadius: "50%",
                                        animation: "spin 1s linear infinite",
                                    }}
                                />
                                <span style={{ fontSize: "14px", color: "#555" }}>Loading dates...</span>
                            </div>
                        ) : (
                            <div style={{ marginBottom: "20px" }}>
                                {/* Section Title */}
                                <h3 style={{ fontSize: "20px", color: "#28659C", fontWeight: "600" }}>
                                    Select Date
                                </h3>

                                {/* Date Picker Wrapper */}
                                <div
                                    id="datePicker"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        padding: "10px 12px",
                                        width: "fit-content",
                                        cursor: "pointer",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: "#fff",
                                        marginTop: "20px",
                                        position: "relative",
                                        zIndex: 1000,
                                    }}
                                >
                                    <FaCalendarAlt
                                        style={{
                                            color: "#64C47C",
                                            fontSize: "20px",
                                            marginRight: "10px",
                                        }}
                                    />

                                    <DatePicker
                                        key={selectedDate.toISOString()}  // ✅ force re-render on selectedDate change
                                        selected={new Date(selectedDate)}
                                        onChange={(date) => handleDateChange(date)}
                                        maxDate={new Date()}
                                        openToDate={new Date()}  // 👈 This ensures calendar opens on current month
                                        dayClassName={customDayClassName}
                                        dateFormat="yyyy-MM-dd"
                                        customInput={
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <input
                                                    value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`}
                                                    // value={selectedDate.toISOString().split("T")[0]}
                                                    // value={selectedDate}
                                                    readOnly
                                                    style={{
                                                        border: "none",
                                                        outline: "none",
                                                        fontSize: "15px",
                                                        fontWeight: "500",
                                                        color: "#000",
                                                        backgroundColor: "transparent",
                                                        cursor: "pointer",
                                                        paddingRight: "8px",
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        fontSize: "14px",
                                                        color: "#888",
                                                        pointerEvents: "none",
                                                    }}
                                                >
                                                    ▼
                                                </span>
                                            </div>
                                        }

                                        wrapperClassName="datePickerWrapper"
                                    />
                                </div>








                            </div>

                        )}


                        {/* Map View */}
                        <div id="mapView" style={{ marginBottom: "20px" }}>
                            <h3 style={{ fontSize: "23px", color: "#28659C", fontWeight: "600" }}>
                                Map View
                            </h3>
                            <div
                                id="map"
                                style={{
                                    zIndex: 0, // Correct camelCase syntax
                                    border: "1px solid #ccc",
                                    height: "300px",
                                    width: "100%",
                                    position: "relative", // Add position for z-index to take effect
                                }}
                            ></div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: "23px", color: "#28659C", fontWeight: "600" }}>Active Summary</h3>

                            {/* {loadingSummary && (
                                <div style={{
                                    padding: "12px 0",
                                    fontSize: "16px",
                                    color: "#555",
                                    fontWeight: "500",
                                    textAlign: "center"
                                }}>
                                    Loading summary...
                                </div>
                            )} */}

                            <div style={{ marginBottom: "10px" }}>
                                <button
                                    onClick={() => setShowFullSummary(!showFullSummary)}
                                    style={{
                                        padding: "8px 16px",
                                        fontSize: "14px",
                                        backgroundColor: "#28659C",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        marginBottom: "10px",
                                    }}
                                >
                                    {showFullSummary ? "Hide Details" : `Show All`}
                                </button>

                                {!showFullSummary && filteredSummaries.length > 2 && (
                                    <div style={{ color: "#555", fontSize: "14px", fontWeight: "500" }}>
                                        {loadingSummary ? "Loading summary..." : `Showing 1 and ${filteredSummaries.length} of ${filteredSummaries.length}`}
                                    </div>
                                )}
                            </div>

                            {/* <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {(showFullSummary
                                    ? trackingSummaries
                                    : trackingSummaries.slice(0, 1).concat(trackingSummaries.slice(-1))
                                ).map((entry, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: "24px",
                                            padding: "16px 20px",
                                            border: "1px solid #E0E0E0",
                                            borderRadius: "10px",
                                            backgroundColor: "#FAFAFA",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <div
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#E6F4EA",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: "12px",
                                                    border: "2px solid #32CD32",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "6px",
                                                        height: "6px",
                                                        borderRadius: "50%",
                                                        backgroundColor: "#32CD32",
                                                    }}
                                                ></div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: "15px", fontWeight: "600", color: "#2C3E50" }}>
                                                    {entry.location}
                                                </div>
                                                <div style={{ fontSize: "13px", color: "#7F8C8D" }}>
                                                    at {entry.time}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                            <div style={{ fontSize: "14px", fontWeight: "500", color: "#34495E" }}>
                                                <strong>Start:</strong> {entry.startTime}
                                            </div>
                                            <div style={{ fontSize: "14px", fontWeight: "500", color: "#34495E" }}>
                                                <strong>End:</strong> {entry.endTime}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div> */}

                            {/* <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {(showFullSummary ? trackingSummaries : trackingSummaries.slice(0, 1).concat(trackingSummaries.slice(-1))).map((entry, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "30px",
                                            padding: "10px 0",
                                            borderBottom: "1px solid #ccc",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                                            <div
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#E6F4EA",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    marginRight: "8px",
                                                    border: "2px solid #32CD32",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: "6px",
                                                        height: "6px",
                                                        borderRadius: "50%",
                                                        backgroundColor: "#32CD32",
                                                    }}
                                                ></div>
                                            </div>
                                            <span style={{ fontSize: "14px", fontWeight: "500", color: "#000" }}>
                                                {entry.location} at {entry.time}
                                            </span>
                                        </div>
                                        <div style={{ flex: 1, fontSize: "14px", color: "#333", fontWeight: "500" }}>
                                            <div><strong>Start:</strong> {entry.startTime}</div>
                                            <div><strong>End:</strong> {entry.endTime}</div>
                                        </div>
                                    </div>
                                ))}
                            </div> */}

                            <div className="timeline-container">
                                {Array.from({ length: Math.ceil(filteredSummaries.length / 6) }).map((_, rowIndex) => {
                                    const rowItems = filteredSummaries.slice(rowIndex * 6, rowIndex * 6 + 6);
                                    const topItems = rowItems.slice(0, 3);
                                    const bottomItems = rowItems.slice(3, 6);

                                    const fillPlaceholders = (arr) => {
                                        const filled = [...arr];
                                        while (filled.length < 3) {
                                            filled.push(null); // Add nulls as placeholders
                                        }
                                        return filled;
                                    };

                                    return (
                                        <div className="timeline-block" key={rowIndex}>
                                            {/* Line across */}
                                            <div className="timeline-line"></div>

                                            {/* Top Row */}
                                            <div className="timeline-row top left">
                                                {fillPlaceholders(topItems).map((entry, index) => (
                                                    <div className="timeline-card-wrapper" key={index}>
                                                        {entry ? (
                                                            <>
                                                                <div className="timeline-card top">
                                                                    <strong>{entry.location}</strong><br />
                                                                    at {entry.time}<br />
                                                                    <small>Start: {entry.startTime}</small><br />
                                                                    <small>End: {entry.endTime}</small>
                                                                </div>
                                                                <div className="timeline-dot"></div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="timeline-card top" style={{ visibility: "hidden" }}>Placeholder</div>
                                                                <div className="timeline-dot" style={{ visibility: "hidden" }}></div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Bottom Row */}
                                            <div className="timeline-row bottom right">
                                                {fillPlaceholders(bottomItems).map((entry, index) => (
                                                    <div className="timeline-card-wrapper" key={index}>
                                                        {entry ? (
                                                            <>
                                                                <div className="timeline-dot"></div>
                                                                <div className="timeline-card bottom">
                                                                    <strong>{entry.location}</strong><br />
                                                                    at {entry.time}<br />
                                                                    <small>Start: {entry.startTime}</small><br />
                                                                    <small>End: {entry.endTime}</small>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="timeline-dot" style={{ visibility: "hidden" }}></div>
                                                                <div className="timeline-card bottom" style={{ visibility: "hidden" }}>Placeholder</div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>


                            {/* <ul
                                style={{
                                    listStyleType: "none",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    padding: "0",
                                    margin: "0",
                                }}
                            >
                                {(showFullSummary
                                    ? activeSummary
                                    : activeSummary.length > 1
                                        ? [activeSummary[0], activeSummary[activeSummary.length - 1]]
                                        : activeSummary
                                ).map((summary, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: "10px",
                                            marginRight: "20px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            color: "#000",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "12px",
                                                height: "12px",
                                                borderRadius: "50%",
                                                backgroundColor: "#E6F4EA",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: "8px",
                                                border: "2px solid #32CD32",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "6px",
                                                    height: "6px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#32CD32",
                                                }}
                                            ></div>
                                        </div>
                                        {summary}
                                    </li>
                                ))}
                            </ul> */}
                            <div>
                                <h3 style={{ fontSize: "20px", color: "#28659C", fontWeight: "600" }}>
                                    Timeline Summary
                                </h3>
                                <ul style={{ paddingLeft: "0", listStyle: "none" }}>
                                    {summarizeTimeline(filteredSummaries).map((line, index) => (
                                        <li key={index} style={{ padding: "6px 0", fontSize: "15px", color: "#333" }}>
                                            {line}
                                        </li>
                                    ))}
                                </ul>
                            </div>


                        </div>
                    </div>
                </div>
            </div >

        </>
    );
};

export default LocaitonTracking;