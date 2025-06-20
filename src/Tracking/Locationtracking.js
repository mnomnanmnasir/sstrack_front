import axios from 'axios';
import jwtDecode from 'jwt-decode';
import * as L from "leaflet";

import "leaflet/dist/leaflet.css";
import { SnackbarProvider } from 'notistack';
import { useEffect, useRef, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import Joyride from 'react-joyride';
import makeAnimated from 'react-select/animated';
import SelectBox from '../companyOwner/ownerComponent/selectBox';
// import { useRef } from 'react';
import { useSnackbar } from 'notistack';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const apiUrlS = 'https://myuniversallanguages.com:9093/api/v1';

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
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);


    const handleDateChange = (date) => {

        setSelectedDate(date); // Update selected date as a Date object
    };
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
    const fetchData = async (dateStr) => {
        console.log('ahahahahahha', dateStr);
        try {
            const formattedDate = dateStr; // Already in YYYY-MM-DD format
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
                let polylines = []; // Array to hold multiple polyline paths

                groupedLocations.forEach((group) => {
                    group.locations.forEach((location) => {
                        totalDistance += location.distance;

                        // Parse and sum up the times
                        const timeParts = location.totalTime.split(" ");
                        const hours = parseInt(timeParts[0].replace("h", "")) || 0;
                        const minutes = parseInt(timeParts[1].replace("m", "")) || 0;

                        totalTimeMinutes += hours * 60 + minutes;

                        // Extract location data for the active summary
                        location.location.forEach((loc) => {
                            activeSummary.push(`${loc.location} at ${loc.time}`);
                        });

                        // Add coordinates for the polyline
                        const polyline = location.coordinates.map((coord) => [
                            parseFloat(coord.latitude),
                            parseFloat(coord.longitude),
                        ]);
                        polylines.push(polyline);
                    });
                });

                // Convert total minutes back to hours and minutes format
                const totalHours = Math.floor(totalTimeMinutes / 60);
                const totalMinutes = totalTimeMinutes % 60;

                // Update the states
                setTotalDistance(totalDistance.toFixed(2));
                setTotalTime(`${totalHours}h ${totalMinutes}m`);
                setActiveSummary(activeSummary);
                setPolylinePath(polylines);
            } else {
                console.error("API call was not successful.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const hasShownNoDataSnackbar = useRef(false);

    const fetchAvailableDates = async (uid) => {
        try {
            setLoadingMap(true); // ⬅️ Show loader before API starts
            hasShownNoDataSnackbar.current = false;

            const today = new Date();
            const formattedToday = today.toISOString().split("T")[0];

            const response = await axios.get(
                `${apiUrlS}/tracker/getTrackerDataByDate/${uid}?date=${formattedToday}`,
                { headers }
            );

            if (response.data.success) {
                const availableDates = response.data.data.dataByDay.map(day => {
                    const [d, m, y] = day.date.split("-");
                    const date = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
                    return {
                        value: date.toLocaleDateString("sv-SE") ,
                        label: `${date.toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric"
                        })} (${day.dataExist ? 'Data Available' : 'No Data'})`,
                        isAvailable: day.dataExist
                    };
                });

                setDataAvailability(availableDates);

                if (availableDates.length > 0) {
                    setSelectedDate(availableDates[0].value.split("T")[0]);
                } else {
                    setSelectedDate(today);
                    if (!hasShownNoDataSnackbar.current) {
                        enqueueSnackbar("Data not found", { variant: "warning" });
                        hasShownNoDataSnackbar.current = true;
                    }
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
            setLoadingMap(false); // ⬅️ Hide loader after completion
        }
    };


    // Fetch data whenever the selected date changes
    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate]);  // ✅ run only when selectedDate changes


    // const handleSelectUsers = (e) => {
    //     setuserId(e?.value)
    //     console.log('here', e?.value)
    // }

    const handleSelectUsers = (e) => {
        const selectedUserId = e?.value;
        setuserId(selectedUserId);
        fetchAvailableDates(selectedUserId);  // <-- this line
    };

    const animatedComponents = makeAnimated();

    useEffect(() => {
        if (userID) {
            fetchAvailableDates(userID);
        }
    }, [userID]);  // ✅ run only when userID changes


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
            if (!Array.isArray(polyline) || polyline.length < 2) return;

            const line = L.polyline(polyline, {
                color: "blue",
                weight: 8,
                opacity: 0.9,
            }).addTo(mapInstance);
            featureGroup.addLayer(line);

            const start = polyline[0];
            const end = polyline[polyline.length - 1];

            const startMarker = L.marker(start, {
                icon: L.icon({
                    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                    iconSize: [32, 32],
                }),
                title: "Start Point",
            }).addTo(mapInstance);
            startMarker.bindPopup("Start Point");
            featureGroup.addLayer(startMarker);

            const endMarker = L.marker(end, {
                icon: L.icon({
                    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    iconSize: [32, 32],
                }),
                title: "End Point",
            }).addTo(mapInstance);
            endMarker.bindPopup("End Point");
            featureGroup.addLayer(endMarker);
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
        const dateStr = date.toISOString().split("T")[0];

        const match = dataAvailability.find((d) => {
            const originalDate = new Date(d.value);
            const previousDate = new Date(originalDate);
            previousDate.setDate(originalDate.getDate() - 1); // Subtract one day
            return previousDate.toISOString().split("T")[0] === dateStr && d.isAvailable;
        });

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
    const getEmployess = async () => {
        try {
            const response = await axios.get(`${apiUrlS}/owner/companies`, { headers });
            if (response.status === 200) {
                const user = items?.userType || "user";
                let formattedUsers = [];

                if (user === "admin" || user === "owner") {
                    // formattedUsers = response.data.employees.map(emp => ({
                    //     value: emp._id,  // Use a unique identifier
                    //     label: emp.name  // Use the name as the label
                    // }));
                    formattedUsers = response.data.employees
                        .filter(emp => emp && emp.name && emp._id) // ✅ filter null/invalid entries
                        .map(emp => ({
                            value: emp._id,
                            label: emp.name
                        }));
                } else if (user === "manager") {
                    const managerEmployees = await getManagerEmployees();
                    formattedUsers = managerEmployees.map(emp => ({
                        value: emp._id,
                        label: emp.name
                    }));
                } else {
                    const userByEmail = response.data.employees.find(emp => items.email === emp.email);
                    if (userByEmail) {
                        formattedUsers = [{ value: userByEmail._id, label: userByEmail.name }];
                    }
                }

                setUsers(formattedUsers);
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const defaultValue = users.length > 0 ? [{ value: users[0].value }] : [];
    useEffect(() => {
        getEmployess();
    }, []);  // ✅ run once on mount


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
                                <SelectBox
                                    onChange={(e) => handleSelectUsers(e)}
                                    options={users}
                                    closeMenuOnSelect={true}
                                    components={animatedComponents}
                                    defaultValue={defaultValue}
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
                                        selected={new Date(selectedDate)}
                                        onChange={(date) => handleDateChange(date.toISOString().split("T")[0])}
                                        maxDate={new Date()}
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
                                                    value={selectedDate}
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
                                    {showFullSummary ? "Hide Details" : "Show All"}
                                </button>

                                {!showFullSummary && activeSummary.length > 2 && (
                                    <div style={{ color: "#555", fontSize: "14px", fontWeight: "500" }}>
                                        Showing 1 and {activeSummary.length} of {activeSummary.length}
                                    </div>
                                )}
                            </div>

                            <ul
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
                            </ul>
                        </div>
                    </div>
                </div>
            </div >

        </>
    );
};

export default LocaitonTracking;