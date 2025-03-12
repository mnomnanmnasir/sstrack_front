
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
                ? `https://myuniversallanguages.com:9093/api/v1/tracker/getTrackerData?date=${formattedDate}`
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

    // Fetch data whenever the selected date changes
    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate, userID]);

    const handleSelectUsers = (e) => {
        setuserId(e?.value)
        console.log('here', e?.value)
    }
    const animatedComponents = makeAnimated();
    useEffect(() => {
        // Determine the initial center of the map
        const initialCenter = polylinePath.length > 0 && polylinePath[0].length > 0
            ? polylinePath[0][0] // Use the first coordinate of the first polyline
            : [37.7749, -122.4194]; // Default to San Francisco if no polylines are available

        const map = L.map("map").setView(initialCenter, 13); // Set the initial view

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // Add polylines to the map
        polylinePath.forEach((polyline) => {
            L.polyline(polyline, {
                color: "blue",
                weight: 4,
            }).addTo(map);
        });

        // Cleanup map instance on unmount
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
                    formattedUsers = response.data.employees.map(emp => ({
                        value: emp._id,  // Use a unique identifier
                        label: emp.name  // Use the name as the label
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

    // // Default to San Francisco if no polylines are available
    // const defaultCenter = { lat: 37.7749, lng: -122.4194 };

    // Extract the initial center based on the polyline path
    // const initialCenter =
    //     polylinePath.length > 0 && polylinePath[0].length > 0
    //         ? { lat: polylinePath[0][0][0], lng: polylinePath[0][0][1] }
    //         : defaultCenter;

    // // Polyline data conversion (Leaflet uses [lat, lng], Google Maps uses { lat, lng })
    // const convertedPolylines = polylinePath.map((polyline) =>
    //     polyline.map(([lat, lng]) => ({ lat, lng }))
    // );
    // const mapContainerStyle = {
    //     width: "100%",
    //     height: "500px",
    // };

    //google map
    // useEffect(() => {
    //     const loadGoogleMapsScript = (callback) => {
    //         const existingScript = document.getElementById("googleMaps");

    //         if (!existingScript) {
    //             const script = document.createElement("script");
    //             script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
    //             script.id = "googleMaps";
    //             script.async = true;
    //             script.defer = true;
    //             script.onload = () => callback();
    //             document.body.appendChild(script);
    //         } else {
    //             existingScript.onload = () => callback();
    //         }
    //     };

    //     const initMap = () => {
    //         const mapCenter =
    //             polylinePath.length > 0 && polylinePath[0].length > 0
    //                 ? { lat: polylinePath[0][0][0], lng: polylinePath[0][0][1] }
    //                 : { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco

    //         const map = new window.google.maps.Map(document.getElementById("map"), {
    //             center: mapCenter,
    //             zoom: 19,
    //         });

    //         // Add polylines
    //         polylinePath.forEach((polyline) => {
    //             const googlePolyline = new window.google.maps.Polyline({
    //                 path: polyline.map(([lat, lng]) => ({ lat, lng })),
    //                 geodesic: true,
    //                 strokeColor: "#0000FF",
    //                 strokeOpacity: 1.0,
    //                 strokeWeight: 4,
    //             });
    //             googlePolyline.setMap(map);
    //         });
    //     };

    //     loadGoogleMapsScript(() => {
    //         initMap();
    //     });
    // }, [polylinePath]);
    //google map

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
                                            {totalDistance}
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

                            {/* Latest Tracking Session */}
                            {/* <div
                                style={{
                                    flex: "1",
                                    marginLeft: "10px",
                                    padding: "20px",
                                    borderLeft: "1px solid #E5E5E5",
                                    borderRadius: "12px",
                                    // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    textAlign: "left",
                                    backgroundColor: "#FFFFFF",
                                }}
                            >
                                <h3 style={{ color: "#2C5282", fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
                                    Latest Tracking Sessions
                                </h3>
                                <div style={{ border: "1px solid #E5E5E5", padding: "20px", }}>
                                    <p style={{ fontSize: "16px", color: "#4A5568", fontWeight: "500", marginBottom: "10px" }}>
                                        {latestSession.timeRange}
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "10px",

                                        }}
                                    >
                                        <div style={{ flex: "1", display: 'flex', flexDirection: 'Row', }}>
                                            <div
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    marginRight: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "#E6F4EA",
                                                    borderRadius: "50%",
                                                    marginBottom: "10px",

                                                }}
                                            >
                                                <span style={{ fontSize: "24px", color: "#4A90E2" }}>⏲</span>
                                            </div>
                                            <div style={{ flexDirection: 'Column', }}>

                                                <h4 style={{ color: "#32CD32", fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
                                                    Total Time
                                                </h4>
                                                <p style={{ fontSize: "18px", fontWeight: "bold", color: "#2C5282" }}>
                                                    {latestSession.totalTime}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ flex: "1", display: 'flex', flexDirection: 'Row', }}>
                                            <div
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    // margin: "0 auto",
                                                    marginRight: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "#E6F4EA",
                                                    borderRadius: "50%",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                <span style={{ fontSize: "24px", color: "#4A90E2" }}>📍</span>
                                            </div>
                                            <div style={{ flexDirection: 'Column', }}>
                                                <h4 style={{ color: "#32CD32", fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
                                                    Total Distance
                                                </h4>
                                                <p style={{ fontSize: "18px", fontWeight: "bold", color: "#2C5282" }}>
                                                    {latestSession.totalDistance}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                                        <span
                                            style={{
                                                color: "#32CD32",
                                                fontSize: "14px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                display: "inline-flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            Show More ▼
                                        </span>
                                    </div>
                                </div>
                            </div> */}
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
                        {/* <LoadScript googleMapsApiKey="AIzaSyAkuGHrq6iEysHhbYV7hchbKAs7nvMHc1g">
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={initialCenter}
                                zoom={13}
                            >
                                {convertedPolylines.map((path, index) => (
                                    <Polyline
                                        key={index}
                                        path={path}
                                        options={{
                                            strokeColor: "blue",
                                            strokeWeight: 4,
                                        }}
                                    />
                                ))}
                            </GoogleMap>
                        </LoadScript> */}
                        {/* Active Summary */}
                        <div>
                            <h3 style={{ fontSize: "23px", color: "#28659C", fontWeight: "600", }}> Active Summary</h3>
                            <div style={{ marginBottom: "20px" }}>
                                <ul
                                    style={{
                                        listStyleType: "none",
                                        display: "flex",
                                        flexWrap: "wrap",
                                        padding: "0",
                                        margin: "0",
                                    }}
                                >
                                    {activeSummary.map((summary, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "10px",
                                                marginRight: "20px", // Space between items
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
                                                    marginRight: "8px", // Space between dot and text
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
            </div >

        </>
    );
};

export default LocaitonTracking;


