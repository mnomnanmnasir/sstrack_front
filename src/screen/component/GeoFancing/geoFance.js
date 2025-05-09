import React, { useState, useEffect } from 'react';
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


    useEffect(() => {
        setIsClient(true);
    }, []);

    const geofences = [
        {
            name: 'Main Office',
            address: '123 Business Ave, Suite 200',
            size: '100m',
            employees: '2/5',
            lastEvent: '5 min ago',
            status: 'Active',
        },
        {
            name: 'Warehouse',
            address: '456 Industrial Park Road',
            size: 'Custom',
            employees: '1/4',
            lastEvent: '15 min ago',
            status: 'Active',
        },
        {
            name: 'Client Site A',
            address: '789 Customer Lane',
            size: '—',
            employees: '—',
            lastEvent: '—',
            status: 'Active',
        }
    ];

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
        } catch (error) {
            enqueueSnackbar(error.message, {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        }
    };

    const employees = [
        { name: 'John Smith', status: 'online' },
        { name: 'Sarah Johnson', status: 'online' },
        { name: 'Mike Jones', status: 'offline' },
    ];

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
                                            className="border rounded p-3 mb-3"
                                            key={i}
                                            onClick={() => {
                                                setSelectedGeofence(g);
                                                setShowModal(false);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1">
                                                        <i className="bi bi-geo-alt-fill me-2" />
                                                        {g.name} <span className="badge bg-secondary ms-2">{g.status}</span>
                                                    </h6>
                                                    <p className="mb-1 text-muted">{g.address}</p>
                                                    <div className="d-flex text-muted small">
                                                        <div className="me-3"><i className="bi bi-people" /> {g.employees} Employees</div>
                                                        <div className="me-3"><i className="bi bi-map" /> {g.size} Size</div>
                                                        <div><i className="bi bi-clock-history" /> {g.lastEvent} Last Event</div>
                                                    </div>
                                                </div>
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Panel */}
                        <div className="col-md-7">
                            <div className="card h-100">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                        <button className="btn btn-light btn-sm me-2 active">Employees</button>
                                        <button className="btn btn-light btn-sm">Geofences</button>
                                    </div>
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

                                <div className="card-body p-0 d-flex">
                                    {/* Employees */}
                                    <div style={{ width: '250px', borderRight: '1px solid #ccc' }} className="p-3">
                                        {employees.map((emp, idx) => (
                                            <div key={idx} className="d-flex align-items-center mb-3">
                                                <span className="me-2 rounded-circle" style={{
                                                    width: '10px',
                                                    height: '10px',
                                                    backgroundColor: emp.status === 'online' ? 'green' : 'gray',
                                                }}></span>
                                                <span>{emp.name}</span>
                                                <i className="bi bi-geo-alt ms-auto"></i>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Map Placeholder */}
                                    <div className="flex-grow-1 text-center" style={{ height: "100%", minHeight: "400px" }}>
                                        {isClient && form.latitude && form.longitude && (
                                            <MapContainer
                                                center={[parseFloat(form.latitude), parseFloat(form.longitude)]}
                                                zoom={13}
                                                style={{ height: "400px", width: "100%" }}
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Bootstrap Modal */}
            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    role="dialog"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="modal-dialog"
                        role="document"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create New Geofence</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {[
                                    { label: "Geofence Name", name: "geoFenceName" },
                                    { label: "Description", name: "description" },
                                    { label: "Address", name: "address" },
                                    { label: "Latitude", name: "latitude", type: "number" },
                                    { label: "Longitude", name: "longitude", type: "number" },
                                    { label: "Time", name: "time", type: "time" },
                                    { label: "From Date", name: "fromDate", type: "date" },
                                    { label: "To Date", name: "toDate", type: "date" }
                                ].map(({ label, name, type = "text" }) => (
                                    <div className="mb-3" key={name}>
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
                                <p><strong>Name:</strong> {selectedGeofence.name}</p>
                                <p><strong>Address:</strong> {selectedGeofence.address}</p>
                                <p><strong>Size:</strong> {selectedGeofence.size}</p>
                                <p><strong>Employees:</strong> {selectedGeofence.employees}</p>
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
