import React, { useRef, useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaCog } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import GeoMap from './GeoMap';
import StaticMap from './GeoMap';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Polyline } from 'react-leaflet';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import axios from "axios";
import QuickStartModal from './QuickStartModal';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

// Set default marker icon globally
L.Marker.prototype.options.icon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const GeoFance = () => {

    const [showModal1, setShowModal1] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [selectedGeofence, setSelectedGeofence] = useState(null);
    const [isClient, setIsClient] = useState(false); // Ensures MapContainer only loads in browser
    const [geofences, setGeofences] = useState([]);
    const mapRef = useRef(null);
    // Inside your component
    const [activeTab, setActiveTab] = useState('employees'); // or 'geofences'
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [liveLocation, setLiveLocation] = useState(null);
    const defaultLat = 51.5074;
    const defaultLng = -0.1278;
    const [searchTerm, setSearchTerm] = useState('');
    const [viewType, setViewType] = useState("list"); // "list" | "grid"
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (mapRef.current && liveLocation) {
            mapRef.current.flyTo([liveLocation.lat, liveLocation.lng], 14);
        }
    }, [liveLocation]);

    const handleOpenModal = () => {
        setShowModal1(true);
    };

    const fetchGeofences = async () => {
        try {
            setLoading(true); // Start loading
            const token = localStorage.getItem("token");
            const response = await fetch("https://myuniversallanguages.com:9093/api/v1/tracker/getGeofencesByAssignmentStatus", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const result = await response.json();

            if (response.ok && result.success) {
                // ✅ Combine assigned + unassigned arrays
                setGeofences([
                    ...(result.data.geoFenceName || []),
                    ...(result.data.unassigned || [])
                ]);
                console.log("Geofence Name:", result.data[0]?.geoFenceName);
            } else {
                throw new Error(result?.message || "Failed to fetch geofences");
            }
        } catch (error) {
            console.error("Error fetching geofences:", error.message);
            enqueueSnackbar(error.message, {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        }
    };

    // const fetchGeofences = async () => {
    //     try {
    //         setLoading(true); // Start loader
    //         const token = localStorage.getItem("token");
    //         const response = await fetch("https://myuniversallanguages.com:9093/api/v1/tracker/getGeofencesByAssignmentStatus", {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //         const result = await response.json();

    //         if (response.ok && result.success) {
    //             setGeofences([
    //                 ...(result.data.assigned || []),
    //                 ...(result.data.unassigned || [])
    //             ]);
    //         } else {
    //             throw new Error(result?.message || "Failed to fetch geofences");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching geofences:", error.message);
    //         enqueueSnackbar(error.message, {
    //             variant: "error",
    //             anchorOrigin: { vertical: "top", horizontal: "right" }
    //         });
    //     } finally {
    //         setLoading(false); // ✅ Always stop loader
    //     }
    // };

    const [form, setForm] = useState({
        latitude: '',
        longitude: '',
        address: '',
        time: '',
        fromDate: '',
        toDate: '',
        geoFenceName: '',
        description: '',
        type: 'Circle',    // ✅ default to Circle
        radius: ''         // ✅ optional, only used for Circle
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreateGeofence = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://myuniversallanguages.com:9093/api/v1/tracker/createGeofence", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result?.message || "Failed to create geofence");
            }

            enqueueSnackbar(result?.message || 'Geofence created!', {
                variant: "success",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });

            setShowModal(false);
            setForm({
                latitude: '',
                longitude: '',
                address: '',
                time: '',
                fromDate: '',
                toDate: '',
                geoFenceName: '',
                description: ''
            });
            // ⬇️ Fetch updated geofences and update the list
            fetchGeofences();

        } catch (error) {
            enqueueSnackbar(error.message, {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        }
    };

    useEffect(() => {
        setIsClient(true);
        fetchGeofences();  // on load
    }, []);

    useEffect(() => {
        const reverseGeocode = async () => {
            if (form.latitude && form.longitude) {
                try {
                    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                        params: {
                            format: 'json',
                            lat: form.latitude,
                            lon: form.longitude
                        }
                    });

                    const address = res.data.display_name;
                    if (address) {
                        setQuery(address); // update Search Location input
                        setForm(prev => ({ ...prev, address }));
                    }
                } catch (error) {
                    console.error("Reverse geocoding failed:", error);
                }
            }
        };

        reverseGeocode();
    }, [form.latitude, form.longitude]);

    const employees = [
        { name: 'John Smith', status: 'online' },
        { name: 'Sarah Johnson', status: 'online' },
        { name: 'Mike Jones', status: 'offline' },
    ];

    const handleLocationSearch = async (value) => {
        setQuery(value);
        if (value.length < 1) return setSuggestions([]);

        try {
            const res = await axios.get(`https://corsproxy.io/?https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`);
            setSuggestions(res.data);
        } catch (error) {
            console.error("CORS Error:", error);
        }
    };

    const handleSelectSuggestion = (place) => {
        const updatedForm = {
            ...form,
            address: place.display_name,
            latitude: place.lat,
            longitude: place.lon
        };
        setForm(updatedForm);
        setQuery(place.display_name);
        setSuggestions([]);

        // ✅ Set liveLocation so map and marker update
        setLiveLocation({
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon)
        });

        console.log("Selected Address:", updatedForm.address);
    };

    return (
        <>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <h5>Geo Fencing</h5>
                </div>
                <div className="mainwrapper ownerTeamContainer" style={{ justifyContent: "center", paddingBottom: "90px" }}>
                    <div className="row">


                        {/* Right Panel */}

                    </div>
                    {viewType === 'grid' ? (
                        <div className="row">
                            <div className='col-12'>
                                <div className="d-flex justify-content-end mb-2">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => {
                                            setSelectedGeofence(null); // Clear previous selection
                                            setShowModal(true);
                                        }}
                                    >
                                        + Create Geofence
                                    </button>
                                </div>
                                <div className="card h-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>

                                        </div>
                                    </div>
                                    {/* <div className="card-body p-0 d-flex"> */}
                                    {/* Map Placeholder */}
                                    <div className="card-body p-0 position-relative" style={{ height: '100%', minHeight: '525px' }}>
                                        {/* Map Placeholder */}
                                        {isClient && (
                                            <MapContainer
                                                center={liveLocation ? [liveLocation.lat, liveLocation.lng] : [defaultLat, defaultLng]}
                                                zoom={13}
                                                zoomControl={false} // ✅ This removes the default zoom buttons
                                                style={{ height: "400px", width: "100%" }}
                                                whenCreated={(mapInstance) => {
                                                    mapRef.current = mapInstance;
                                                }}
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                />

                                                {/* Live Location Marker */}
                                                {liveLocation && (
                                                    <Marker position={[liveLocation.lat, liveLocation.lng]}>
                                                        <Popup>📍 Live Location</Popup>
                                                    </Marker>
                                                )}
                                            </MapContainer>
                                        )}

                                        {/* Geofence List Floating Box */}
                                        <div
                                            className="position-absolute bg-white shadow rounded-3 p-3"
                                            style={{
                                                top: '20px',
                                                // right: '20px',
                                                left: '10px', // ✅ Add this line to push it from the left
                                                width: '250px',
                                                zIndex: 999,
                                                maxHeight: '320px',
                                                overflowY: 'auto',
                                                border: '1px solid #ccc',
                                            }}
                                        >
                                            {/* Tabs */}
                                            <div className="btn-group w-100 mb-3 rounded overflow-hidden">
                                                <button
                                                    className={`btn fw-semibold ${activeTab === 'employees' ? 'bg-white text-primary border-primary' : 'bg-light text-dark'}`}
                                                    onClick={() => setActiveTab('employees')}
                                                    style={{ width: '50%' }}
                                                >
                                                    Employees
                                                </button>
                                                <button
                                                    className={`btn fw-semibold ${activeTab === 'geofences' ? 'bg-white text-primary border-primary' : 'bg-light text-dark'}`}
                                                    onClick={() => setActiveTab('geofences')}
                                                    style={{ width: '50%' }}
                                                >
                                                    Geofences
                                                </button>
                                            </div>

                                            {/* Content */}
                                            {activeTab === 'employees' ? (
                                                geofences.slice(0, 3).map((geo, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="d-flex align-items-center justify-content-between px-3 py-2 rounded mb-2"
                                                        style={{ backgroundColor: '#f8f9fa' }}
                                                    >
                                                        <div className="d-flex align-items-center">
                                                            <span
                                                                className="me-2 rounded-circle"
                                                                style={{
                                                                    width: '10px',
                                                                    height: '10px',
                                                                    backgroundColor: geo.status === 'assigned' ? '#007bff' : '#999',
                                                                    display: 'inline-block',
                                                                }}
                                                            ></span>
                                                            <span className="fw-medium text-dark">{geo.geoFenceName}</span>
                                                        </div>
                                                        <i className="bi bi-geo-alt text-secondary"></i>
                                                    </div>
                                                ))
                                            ) : (
                                                geofences.slice(0, 3).map((geo, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="d-flex align-items-center justify-content-between px-3 py-2 rounded mb-2"
                                                        style={{ backgroundColor: '#f8f9fa' }}
                                                    >
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-send text-primary me-2"></i> {/* Left icon */}
                                                            {/* <span
                                                                className="me-2 rounded-circle"
                                                                style={{
                                                                    width: '10px',
                                                                    height: '10px',
                                                                    // backgroundColor: geo.status === 'assigned' ? '#007bff' : '#999',
                                                                    display: 'inline-block',
                                                                }}
                                                            ></span> */}
                                                            <span className="fw-medium text-dark">{geo.geoFenceName || "Untitled"}</span>
                                                        </div>
                                                        <i className="bi bi-person-circle text-secondary"></i> {/* Right icon */}
                                                    </div>

                                                ))
                                            )}
                                        </div>
                                        {/* 👉 Zoom Buttons - RIGHT SIDE */}
                                        <div
                                            className="position-absolute d-flex flex-column"
                                            style={{
                                                right: '20px',
                                                top: '20%',
                                                transform: 'translateY(-50%)',
                                                zIndex: 1000
                                            }}
                                        >
                                            <button
                                                className="btn btn-info text-white rounded-circle mb-2"
                                                onClick={() => {
                                                    if (mapRef.current) {
                                                        mapRef.current.zoomIn();
                                                    }
                                                }}
                                            >
                                                <i className="bi bi-plus"></i>
                                            </button>
                                            <button
                                                className="btn btn-info text-white rounded-circle mb-2"
                                                onClick={() => {
                                                    if (mapRef.current) {
                                                        mapRef.current.zoomOut();
                                                    }
                                                }}
                                            >
                                                <i className="bi bi-dash"></i>
                                            </button>
                                            {/* Map Direction (Crosshair) */}
                                            <button
                                                className="btn btn-info text-white rounded-circle"
                                                onClick={() => {
                                                    if (mapRef.current && form.latitude && form.longitude) {
                                                        mapRef.current.setView([parseFloat(form.latitude), parseFloat(form.longitude)], 13);
                                                    }
                                                }}
                                            >
                                                <i className="bi bi-crosshair"></i>
                                            </button>
                                        </div>
                                    </div>
                                    {/* </div> */}
                                </div>
                            </div>
                            <div className="col-12 mb-3" style={{ marginTop: '5%' }}>

                                <div className="card-header bg-white">
                                    <strong>Geofence Management</strong>
                                    <input
                                        className="form-control mt-2"
                                        placeholder="Search by name or address..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {/* <input className="form-control mt-2" placeholder="Search geofences..." /> */}
                                    <button
                                        className={`btn btn-sm px-3 py-1 ${viewType === 'list' ? 'text-dark fw-bold' : 'text-muted'} border-0 bg-transparent`}
                                        onClick={() => setViewType('list')}
                                    >
                                        List
                                    </button>
                                    <button
                                        className={`btn btn-sm px-3 py-1 ${viewType === 'grid' ? 'text-dark fw-bold' : 'text-muted'} border-0 bg-transparent`}
                                        onClick={() => setViewType('grid')}
                                    >
                                        Grid
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                geofences
                                    .filter((g) => {
                                        const keyword = searchTerm.toLowerCase();
                                        return (
                                            g.geoFenceName?.toLowerCase().includes(keyword) ||
                                            g.address?.toLowerCase().includes(keyword)
                                        );
                                    })
                                    .map((g, i) => (
                                        <div className="col-md-6 col-lg-4 mb-3" key={i}>
                                            <div
                                                className="card border rounded-4 shadow-sm p-3 h-100"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setSelectedGeofence(g);
                                                    setShowModal(false);
                                                }}
                                            >
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <h6 className="fw-bold mb-0">{g.geoFenceName || "Untitled"}</h6>
                                                    <span className={`badge rounded-pill px-2 py-1 ${g.status === 'Active' ? 'bg-primary' : 'bg-secondary'}`}>
                                                        {g.status || "Inactive"}
                                                    </span>
                                                </div>
                                                <p className="text-muted small mb-2">{g.address || "No address available"}</p>
                                                <div className="d-flex justify-content-between text-center">
                                                    <div>
                                                        <i className="bi bi-people text-primary"></i>
                                                        <div>{g.userId?.length || 0}/3</div>
                                                        <small className="text-muted">Employees</small>
                                                    </div>
                                                    <div>
                                                        <i className="bi bi-map text-primary"></i>
                                                        <div>{g.size || '—'}</div>
                                                        <small className="text-muted">Size</small>
                                                    </div>
                                                    <div>
                                                        <i className="bi bi-clock text-primary"></i>
                                                        <div>{g.reachedTime || '—'}</div>
                                                        <small className="text-muted">Last Event</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            )}

                        </div>

                    ) : (
                        <>
                            <div className="row">
                                {/* Left Panel */}
                                <div className="col-md-5">
                                    <div className="card">

                                        <div className="card-header bg-white">
                                            <strong>Geofence Management</strong>
                                            <input
                                                className="form-control mt-2"
                                                placeholder="Search by name or address..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                            {/* <input className="form-control mt-2" placeholder="Search geofences..." /> */}
                                            <button
                                                className={`btn btn-sm px-3 py-1 ${viewType === 'list' ? 'text-dark fw-bold' : 'text-muted'} border-0 bg-transparent`}
                                                onClick={() => setViewType('list')}
                                            >
                                                List
                                            </button>
                                            <button
                                                className={`btn btn-sm px-3 py-1 ${viewType === 'grid' ? 'text-dark fw-bold' : 'text-muted'} border-0 bg-transparent`}
                                                onClick={() => setViewType('grid')}
                                            >
                                                Grid
                                            </button>
                                        </div>

                                        <div className="card-body" style={{ maxHeight: '520px', overflowY: 'hidden' }}>
                                            {viewType === 'list' && (
                                                <div className="row">
                                                    <div className="card-body" style={{ maxHeight: '520px', overflowY: 'auto' }}>

                                                        {loading ? (
                                                            <div className="d-flex justify-content-center align-items-center py-5">
                                                                <div className="spinner-border text-primary" role="status">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            geofences
                                                                .filter((g) => {
                                                                    const keyword = searchTerm.toLowerCase();
                                                                    return (
                                                                        g.geoFenceName?.toLowerCase().includes(keyword) ||
                                                                        g.address?.toLowerCase().includes(keyword)
                                                                    );
                                                                })
                                                                .map((g, i) => (
                                                                    <div
                                                                        key={i}
                                                                        className="bg-white rounded-4 border px-4 py-3 mb-3 shadow-sm"
                                                                        style={{ cursor: 'pointer' }}
                                                                        onClick={() => {
                                                                            setSelectedGeofence(g);
                                                                            setShowModal(false);
                                                                        }}
                                                                    >
                                                                        <div className="d-flex justify-content-between">
                                                                            <div className="d-flex">
                                                                                <div className="me-3">
                                                                                    <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                                                                        <i className="bi bi-geo-alt-fill text-primary fs-5"></i>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="d-flex align-items-center mb-1">
                                                                                        <h6 className="mb-0 fw-semibold me-2">{g.geoFenceName || "Untitled"}</h6>
                                                                                        <span className={`badge rounded-pill px-2 py-1 ${g.status === 'Active' ? 'bg-primary' : 'bg-secondary'}`}>
                                                                                            {g.status || "Inactive"}
                                                                                        </span>
                                                                                    </div>
                                                                                    <p className="text-muted small mb-0">{g.address || "No address available"}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <i className="bi bi-three-dots-vertical text-muted fs-5"></i>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row mt-3 px-1">
                                                                            <div className="col-12 col-md-4 mb-2 mb-md-0">
                                                                                <div className="bg-light rounded-3 text-center py-2 px-3 h-100">
                                                                                    <i className="bi bi-people text-primary"></i>
                                                                                    <div className="fw-semibold">{g.userId?.length || 0}/3</div>
                                                                                    <small className="text-muted">Employees</small>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12 col-md-4 mb-2 mb-md-0">
                                                                                <div className="bg-light rounded-3 text-center py-2 px-3 h-100">
                                                                                    <i className="bi bi-map text-primary"></i>
                                                                                    <div className="fw-semibold">{g.size || '—'}</div>
                                                                                    <small className="text-muted">Size</small>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-12 col-md-4">
                                                                                <div className="bg-light rounded-3 text-center py-2 px-3 h-100">
                                                                                    <i className="bi bi-clock text-primary"></i>
                                                                                    <div className="fw-semibold">{g.reachedTime || '—'}</div>
                                                                                    <small className="text-muted">Last Event</small>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                        )
                                                        }
                                                    </div>

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Panel */}
                                <div className="col-md-7">

                                    <div className="d-flex justify-content-end mb-2">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => {
                                                setSelectedGeofence(null); // Clear previous selection
                                                setShowModal(true);
                                            }}
                                        >
                                            + Create Geofence
                                        </button>
                                    </div>
                                    <div className="card h-100">
                                        {/* <div className="d-flex justify-content-between align-items-center">
                                            <div>

                                            </div>
                                        </div> */}

                                        {/* <div className="card-body p-0 d-flex"> */}
                                        {/* Map Placeholder */}
                                        {/* <div className="card-body p-0 position-relative" style={{ height: '100%', minHeight: '525px' }}> */}
                                        {/* Map Placeholder */}
                                        <div style={{ position: 'relative', zIndex: 0 }}>

                                            {isClient && (
                                                <MapContainer
                                                    center={liveLocation ? [liveLocation.lat, liveLocation.lng] : [defaultLat, defaultLng]}
                                                    zoom={13}
                                                    zoomControl={false} // ✅ This removes the default zoom buttons
                                                    style={{ height: "400px", width: "100%" }}
                                                    whenCreated={(mapInstance) => {
                                                        mapRef.current = mapInstance;
                                                    }}
                                                >
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    />

                                                    {/* Live Location Marker */}
                                                    {liveLocation && (
                                                        <Marker position={[liveLocation.lat, liveLocation.lng]}>
                                                            <Popup>📍 Live Location</Popup>
                                                        </Marker>
                                                    )}
                                                </MapContainer>
                                            )}
                                        </div>
                                        {/* Geofence List Floating Box */}
                                        <div
                                            className="position-absolute bg-white shadow rounded-3 p-3"
                                            style={{
                                                top: '20px',
                                                // right: '20px',
                                                left: '10px', // ✅ Add this line to push it from the left
                                                width: '250px',
                                                zIndex: 999,
                                                maxHeight: '320px',
                                                overflowY: 'auto',
                                                border: '1px solid #ccc',
                                            }}
                                        >
                                            {/* Tabs */}
                                            <div className="btn-group w-100 mb-3 rounded overflow-hidden">
                                                <button
                                                    className={`btn fw-semibold ${activeTab === 'employees' ? 'bg-white text-primary border-primary' : 'bg-light text-dark'}`}
                                                    onClick={() => setActiveTab('employees')}
                                                    style={{ width: '50%' }}
                                                >
                                                    Employees
                                                </button>
                                                <button
                                                    className={`btn fw-semibold ${activeTab === 'geofences' ? 'bg-white text-primary border-primary' : 'bg-light text-dark'}`}
                                                    onClick={() => setActiveTab('geofences')}
                                                    style={{ width: '50%' }}
                                                >
                                                    Geofences
                                                </button>
                                            </div>

                                            {/* Content */}
                                            {activeTab === 'employees' ? (
                                                geofences.slice(0, 3).map((geo, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="d-flex align-items-center justify-content-between px-3 py-2 rounded mb-2"
                                                        style={{ backgroundColor: '#f8f9fa' }}
                                                    >
                                                        <div className="d-flex align-items-center">
                                                            <span
                                                                className="me-2 rounded-circle"
                                                                style={{
                                                                    width: '10px',
                                                                    height: '10px',
                                                                    backgroundColor: geo.status === 'assigned' ? '#007bff' : '#999',
                                                                    display: 'inline-block',
                                                                }}
                                                            ></span>
                                                            <span className="fw-medium text-dark">{geo.geoFenceName}</span>
                                                        </div>
                                                        <i className="bi bi-geo-alt text-secondary"></i>
                                                    </div>
                                                ))
                                            ) : (
                                                geofences.slice(0, 3).map((geo, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="d-flex align-items-center justify-content-between px-3 py-2 rounded mb-2"
                                                        style={{ backgroundColor: '#f8f9fa' }}
                                                    >
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-send text-primary me-2"></i> {/* Left icon */}
                                                            {/* <span
                                                                className="me-2 rounded-circle"
                                                                style={{
                                                                    width: '10px',
                                                                    height: '10px',
                                                                    // backgroundColor: geo.status === 'assigned' ? '#007bff' : '#999',
                                                                    display: 'inline-block',
                                                                }}
                                                            ></span> */}
                                                            <span className="fw-medium text-dark">{geo.geoFenceName || "Untitled"}</span>
                                                        </div>
                                                        <i className="bi bi-person-circle text-secondary"></i> {/* Right icon */}
                                                    </div>

                                                ))
                                            )}
                                        </div>
                                        {/* 👉 Zoom Buttons - RIGHT SIDE */}
                                        <div
                                            className="position-absolute d-flex flex-column"
                                            style={{
                                                right: '20px',
                                                top: '20%',
                                                transform: 'translateY(-50%)',
                                                zIndex: 0
                                            }}
                                        >
                                            <button
                                                className="btn btn-info text-white rounded-circle mb-2"
                                                onClick={() => {
                                                    if (mapRef.current) {
                                                        mapRef.current.zoomIn();
                                                    }
                                                }}
                                            >
                                                <i className="bi bi-plus"></i>
                                            </button>
                                            <button
                                                className="btn btn-info text-white rounded-circle mb-2"
                                                onClick={() => {
                                                    if (mapRef.current) {
                                                        mapRef.current.zoomOut();
                                                    }
                                                }}
                                            >
                                                <i className="bi bi-dash"></i>
                                            </button>
                                            {/* Map Direction (Crosshair) */}
                                            <button
                                                className="btn btn-info text-white rounded-circle"
                                                onClick={() => {
                                                    if (mapRef.current && form.latitude && form.longitude) {
                                                        mapRef.current.setView([parseFloat(form.latitude), parseFloat(form.longitude)], 13);
                                                    }
                                                }}
                                            >
                                                <i className="bi bi-crosshair"></i>
                                            </button>
                                        </div>
                                        {/* </div> */}
                                        {/* </div> */}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Floating Button */}
                <button
                    onClick={handleOpenModal}
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        backgroundColor: '#A4DC3F',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        border: 'none',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        zIndex: 9999
                    }}
                >
                    <i className="bi bi-question-circle" style={{ fontSize: '28px', color: '#000' }}></i>
                </button>

                {/* Modal */}
                <QuickStartModal show={showModal1} onClose={() => setShowModal1(false)} />

            </div>


            {/* </div> */}

            {/* ✅ Bootstrap Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
                    <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create New Geofence</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {[{ label: "Geofence Name", name: "geoFenceName" }, { label: "Description", name: "description" }].map(({ label, name }) => (
                                    <div className="mb-3" key={name}>
                                        <label className="form-label">{label}</label>
                                        <input type="text" className="form-control" name={name} value={form[name]} onChange={handleChange} />
                                    </div>
                                ))}

                                <div className="row">
                                    {/* Type Dropdown (Circle or Polygon) */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Type</label>
                                        <select
                                            name="type"
                                            value={form.type || ''}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="">Select any one option</option>
                                            <option value="Circle">Circle</option>
                                            <option value="Polygon">Polygon</option>
                                        </select>
                                    </div>

                                    {/* Radius Dropdown — Only visible when Type is 'Circle' */}

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Radius</label>
                                        <select
                                            name="radius"
                                            value={form.radius || ''}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="">Select the radius</option>
                                            <option value="30">30m</option>
                                            <option value="40">40m</option>
                                            <option value="50">50m</option>
                                            <option value="60">60m</option>
                                            <option value="70">70m</option>
                                            <option value="80">80m</option>
                                            <option value="90">90m</option>
                                            <option value="100">100m</option>
                                            <option value="auto">Auto</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Search Location</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={query}
                                        onChange={(e) => handleLocationSearch(e.target.value)}
                                        placeholder="Type address..."
                                    />
                                    <div className="list-group mt-2">
                                        {suggestions.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className="list-group-item list-group-item-action"
                                                onClick={() => handleSelectSuggestion(suggestion)}
                                            >
                                                {suggestion.display_name}
                                            </div>
                                        ))}
                                    </div>
                                    {/* ✅ Display Lat/Lng if available */}
                                    {/* {form.latitude && form.longitude && ( */}
                                    <div className="row mt-3">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Latitude</label>
                                            <input
                                                type="text"
                                                name="latitude"
                                                value={form.latitude}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Latitude"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Longitude</label>
                                            <input
                                                type="text"
                                                name="longitude"
                                                value={form.longitude}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Longitude"
                                            />
                                        </div>
                                    </div>
                                    {/* )} */}
                                </div>
                                <div className="row">
                                    {[{ label: "Time", name: "time", type: "time" }, { label: "From Date", name: "fromDate", type: "date" }, { label: "To Date", name: "toDate", type: "date" }].map(({ label, name, type }) => (
                                        <div className="col-md-4 mb-3" key={name}>
                                            <label className="form-label">{label}</label>
                                            <input
                                                type={type}
                                                className="form-control"
                                                name={name}
                                                value={form[name]}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" onClick={handleCreateGeofence}>Create GeoFence</button>
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div >
            )}

            {
                !showModal && selectedGeofence && (
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        onClick={() => {
                            setSelectedGeofence(null); // hide detail modal
                            setShowModal(false);        // show create modal
                        }}

                    >
                        <div
                            className="modal-dialog"
                            role="document"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Geofence Details</h5>
                                    <button type="button" className="btn-close" onClick={() => {
                                        setShowModal(false);
                                        setSelectedGeofence(null);
                                    }}></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Name:</strong> {selectedGeofence.geoFenceName}</p>
                                    <p><strong>Address:</strong> {selectedGeofence.address}</p>
                                    <p><strong>Size:</strong> {selectedGeofence.size}</p>
                                    <p><strong>Description:</strong> {selectedGeofence.description}</p>
                                    <p><strong>Last Event:</strong> {selectedGeofence.lastEvent}</p>
                                    <p><strong>Status:</strong> {selectedGeofence.status}</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-danger">Delete</button>
                                    <button className="btn btn-secondary" onClick={() => {
                                        setShowModal(false);
                                        setSelectedGeofence(null);
                                    }}>Cancel</button>
                                    <button className="btn btn-success">Edit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default GeoFance;
