
import { SnackbarProvider } from 'notistack';
import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import Joyride from 'react-joyride';
import jwtDecode from 'jwt-decode';
import SelectBox from '../companyOwner/ownerComponent/selectBox';
import makeAnimated from 'react-select/animated';
import axios from 'axios';



const LocaitonTracking = () => {
    const [run, setRun] = useState(true);
    const [stepIndex, setStepIndex] = useState(0);
    const [users, setUsers] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0); // Total distance in KM
    const [totalTime, setTotalTime] = useState("0h 0m");
    const tokens = localStorage.getItem("token");
    const [showFullSummary, setShowFullSummary] = useState(false);

    const summaryPreviewCount = 3;
    const items = jwtDecode(JSON.stringify(tokens));
    const [userID, setuserId] = useState(items?._id)
    const [overviewData, setOverviewData] = useState({
        totalDistance: "0 KM",
        totalTime: "0h : 0m",
    });
    let headers = {
        Authorization: 'Bearer ' + tokens,
    }
    const [latestSession, setLatestSession] = useState({
        timeRange: "N/A",
        totalTime: "0h : 0m",
        totalDistance: "0 KM",
    });

    const [dataAvailability, setDataAvailability] = useState([]); // To hold dates with dataExist=true
    const [activeSummary, setActiveSummary] = useState([]);
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

    // State to hold map polyline data
    const [polylinePath, setPolylinePath] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

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
    const fetchData = async (date) => {
        try {
            const formattedDate = date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
            const token = localStorage.getItem("token");
            const apiUrl = items?.userType === "user"
                // ? `https://myuniversallanguages.com:9093/api/v1/tracker/getTrackerData?date=${formattedDate}`
                ? `https://myuniversallanguages.com:9093/api/v1/tracker/getTrackerDataByDate/${userID}?date=${formattedDate}`
                : `https://myuniversallanguages.com:9093/api/v1/owner/getTrackerDataByUser/${userID}?date=${formattedDate}`;
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });


            if (!response.ok) {
                // const error = await response.json();
                // throw new Error(`HTTP error! status: ${response.status}`);
                console.log('response.status', response)
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
                setTotalDistance(totalDistance.toFixed(2)); // Update total distance
                setTotalTime(`${totalHours}h ${totalMinutes}m`); // Update total time
                setActiveSummary(activeSummary); // Update active summary
                setPolylinePath(polylines); // Update polylines
            } else {
                console.error("API call was not successful.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchAvailableDates = async (uid) => {
        try {
            const today = new Date();
            const formattedToday = today.toISOString().split("T")[0];
            const response = await axios.get(
                `${apiUrl}/tracker/getTrackerDataByDate/${uid}?date=${formattedToday}`,
                { headers }
            );

            if (response.data.success) {
                const availableDates = response.data.data.dataByDay
                    .filter(day => day.dataExist)
                    .map(day => {
                        const [d, m, y] = day.date.split("-");
                        return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
                    });
                setDataAvailability(availableDates);
            }
        } catch (err) {
            console.error("Error fetching availability:", err);
            setDataAvailability([]);
        }
    };

    // Fetch data whenever the selected date changes
    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate, userID]);

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
    }, [userID]);

    useEffect(() => {
        if (!polylinePath || polylinePath.length === 0) return;

        // Clean up any previous map
        let mapContainer = document.getElementById("map");
        if (mapContainer._leaflet_id) {
            mapContainer._leaflet_id = null;
        }

        const initialCenter = polylinePath[0][0] || [37.7749, -122.4194];

        const map = L.map("map").setView(initialCenter, 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        const featureGroup = L.featureGroup().addTo(map);

        polylinePath.forEach((polyline, polylineIndex) => {
            if (polyline.length > 1) {
                const line = L.polyline(polyline, {
                    color: "blue",
                    weight: 8,
                    opacity: 0.9,
                }).addTo(map);
                featureGroup.addLayer(line);

                console.log(`Polyline ${polylineIndex + 1} Coordinates:`);
                polyline.forEach((coord, coordIndex) => {
                    console.log(`→ [${coord[0]}, ${coord[1]}]`);

                    // Marker at each coordinate
                    const coordMarker = L.marker(coord, {
                        icon: L.icon({
                            iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            iconSize: [32, 32],
                        }),
                        title: `Point ${coordIndex + 1}`,
                    }).addTo(map);
                    coordMarker.bindPopup(`Point ${coordIndex + 1}`).openPopup();

                    featureGroup.addLayer(coordMarker);
                });
            }
        });

        if (featureGroup.getLayers().length > 0) {
            map.fitBounds(featureGroup.getBounds(), {
                padding: [30, 30],
            });
        }

        return () => {
            map.remove();
        };
    }, [polylinePath]);



    const getManagerEmployees = async () => {
        try {
            const response = await axios.get(`${apiUrl}/manager/employees`, { headers });
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
            const response = await axios.get(`${apiUrl}/owner/companies`, { headers });
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
    }, []);

    return (
        <>
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
                                    position: "relative", // Added for proper stacking context
                                    zIndex: 10,
                                }}
                            >
                                {/* Calendar Icon */}
                                <FaCalendarAlt
                                    style={{
                                        color: "#64C47C",
                                        fontSize: "20px",
                                        marginRight: "10px",
                                    }}
                                />

                                {/* DatePicker Input */}
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    dateFormat="MMM d, yyyy EEEE" // Example: Dec 9, 2024 Monday
                                    popperPlacement="bottom-start"
                                    highlightDates={dataAvailability} // ✅ Add this line
                                    popperModifiers={[
                                        {
                                            name: "preventOverflow",
                                            options: {
                                                boundary: "viewport", // Prevents hiding in limited spaces
                                            },
                                        },
                                    ]}
                                    customInput={
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <span
                                                style={{
                                                    fontSize: "16px",
                                                    fontWeight: "600",
                                                    color: "#000",
                                                    marginRight: "5px",
                                                }}
                                            >
                                                {selectedDate.toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    weekday: "long",
                                                })}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: "14px",
                                                    color: "#666",
                                                }}
                                            >
                                                ▼
                                            </span>
                                        </div>
                                    }
                                />
                            </div>

                        </div>

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
            </div>

        </>
    );
};

export default LocaitonTracking;


