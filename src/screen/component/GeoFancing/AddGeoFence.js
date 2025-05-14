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

    const [showModal, setShowModal] = useState(false);
    const [selectedGeofence, setSelectedGeofence] = useState(null);
    const [isClient, setIsClient] = useState(false); // Ensures MapContainer only loads in browser
    const [geofences, setGeofences] = useState([]);
    const mapRef = useRef(null);
    // Inside your component
    const [activeTab, setActiveTab] = useState('employees'); // or 'geofences'
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // const geofences = [
    //     {
    //         name: 'Main Office',
    //         address: '123 Business Ave, Suite 200',
    //         size: '100m',
    //         employees: '2/5',
    //         lastEvent: '5 min ago',
    //         status: 'Active',
    //     },
    //     {
    //         name: 'Warehouse',
    //         address: '456 Industrial Park Road',
    //         size: 'Custom',
    //         employees: '1/4',
    //         lastEvent: '15 min ago',
    //         status: 'Active',
    //     },
    //     {
    //         name: 'Client Site A',
    //         address: '789 Customer Lane',
    //         size: '—',
    //         employees: '—',
    //         lastEvent: '—',
    //         status: 'Active',
    //     }
    // ];

    const fetchGeofences = async () => {
        try {
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
                    ...(result.data.assigned || []),
                    ...(result.data.unassigned || [])
                ]);
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

    const [form, setForm] = useState({
        latitude: '',
        longitude: '',
        address: '',
        time: '',
        fromDate: '',
        toDate: '',
        geoFenceName: '',
        description: ''
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

    const employees = [
        { name: 'John Smith', status: 'online' },
        { name: 'Sarah Johnson', status: 'online' },
        { name: 'Mike Jones', status: 'offline' },
    ];

    const handleLocationSearch = async (value) => {
        setQuery(value);
        if (value.length < 3) return setSuggestions([]);

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

        console.log("Selected Address:", updatedForm.address); // ✅ For debugging
    };

    return (
        <>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <h5>Geo Fancing</h5>
                </div>
                <div className="mainwrapper ownerTeamContainer" style={{ justifyContent: "center", paddingBottom: "90px" }}>
                    <div className="row">
                        {/* Left Panel */}
                        <div className="col-md-5">
                            <div className="card">

                                <div className="card-header bg-white">
                                    <strong>Geofence Management</strong>
                                    <input className="form-control mt-2" placeholder="Search geofences..." />
                                </div>

                                <div className="card-body" style={{ maxHeight: '520px', overflowY: 'auto' }}>
                                    {geofences.map((g, i) => (
                                        <div
                                            className="bg-white rounded-4 border px-4 py-3 mb-3 shadow-sm"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setSelectedGeofence(g);
                                                setShowModal(false);
                                            }}
                                        >
                                            <div className="d-flex justify-content-between">
                                                {/* LEFT: Icon + Name + Address */}
                                                <div className="d-flex">
                                                    {/* Icon */}
                                                    <div className="me-3">
                                                        <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                                            <i className="bi bi-geo-alt-fill text-primary fs-5"></i>
                                                        </div>
                                                    </div>

                                                    {/* Name + Status + Address */}
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

                                                {/* RIGHT: 3 dots icon */}
                                                <div>
                                                    <i className="bi bi-three-dots-vertical text-muted fs-5"></i>
                                                </div>
                                            </div>

                                            {/* BOTTOM: 3 Info Cards */}
                                            <div className="row mt-3 px-1">
                                                {/* Employees */}
                                                <div className="col-12 col-md-4 mb-2 mb-md-0">
                                                    <div className="bg-light rounded-3 text-center py-2 px-3 h-100">
                                                        <i className="bi bi-people text-primary"></i>
                                                        <div className="fw-semibold">{g.userId?.length || 0}/3</div>
                                                        <small className="text-muted">Employees</small>
                                                    </div>
                                                </div>

                                                {/* Size */}
                                                <div className="col-12 col-md-4 mb-2 mb-md-0">
                                                    <div className="bg-light rounded-3 text-center py-2 px-3 h-100">
                                                        <i className="bi bi-map text-primary"></i>
                                                        <div className="fw-semibold">{g.size || '—'}</div>
                                                        <small className="text-muted">Size</small>
                                                    </div>
                                                </div>

                                                {/* Last Event */}
                                                <div className="col-12 col-md-4">
                                                    <div className="bg-light rounded-3 text-center py-2 px-3 h-100">
                                                        <i className="bi bi-clock text-primary"></i>
                                                        <div className="fw-semibold">{g.reachedTime || '—'}</div>
                                                        <small className="text-muted">Last Event</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        {/* <button className="btn btn-light btn-sm me-2 active">Employees</button>
                                        <button className="btn btn-light btn-sm">Geofences</button> */}
                                    </div>
                                </div>

                                <div className="card-body p-0 d-flex">

                                    {/* Employees */}
                                    {/* <div style={{ width: '250px', borderRight: '1px solid #ccc' }} className="p-3"> */}
                                    {/* <div style={{ width: '250px', borderRight: '1px solid #ccc' }} className="p-3">
                                        {geofences.slice(0, 3).map((geo, idx) => (
                                            <div key={idx} className="d-flex align-items-center mb-3">
                                                <span
                                                    className="me-2 rounded-circle"
                                                    style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        backgroundColor: geo.status === 'assigned' ? 'green' : 'gray',
                                                    }}
                                                ></span>
                                                <span>{geo.geoFenceName || "Untitled"}</span>
                                                <i className="bi bi-geo-alt ms-auto"></i>
                                            </div>
                                        ))}
                                    </div> */}
                                    {/* </div> */}

                                    {/* Map Placeholder */}
                                    <div className="card-body p-0 position-relative" style={{ height: '100%', minHeight: '525px' }}>
                                        {/* Map Placeholder */}
                                        {isClient && form.latitude && form.longitude && (
                                            <MapContainer
                                                center={[parseFloat(form.latitude), parseFloat(form.longitude)]}
                                                zoom={13}
                                                style={{ height: "400px", width: "100%" }}
                                                whenCreated={(mapInstance) => {
                                                    mapRef.current = mapInstance;
                                                }}
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                />
                                                <Marker position={[parseFloat(form.latitude), parseFloat(form.longitude)]}>
                                                    <Popup>{form.geoFenceName || "Selected Location"}</Popup>
                                                </Marker>
                                            </MapContainer>
                                        )}

                                        {/* Zoom In / Zoom Out Buttons on Right */}
                                        {/* <div
                                            className="position-absolute d-flex flex-column"
                                            style={{
                                                right: '20px',
                                                top: '50%',
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
                                        </div> */}

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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                                </div>

                                {[{ label: "Time", name: "time", type: "time" }, { label: "From Date", name: "fromDate", type: "date" }, { label: "To Date", name: "toDate", type: "date" }].map(({ label, name, type }) => (
                                    <div className="mb-3" key={name}>
                                        <label className="form-label">{label}</label>
                                        <input type={type} className="form-control" name={name} value={form[name]} onChange={handleChange} />
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-success" onClick={handleCreateGeofence}>Save Geofence</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!showModal && selectedGeofence && (
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
            )}
        </>
    );
};

export default GeoFance;
