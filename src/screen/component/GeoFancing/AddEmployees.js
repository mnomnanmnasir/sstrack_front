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
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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

const AddEmployees = () => {

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
    const [viewType, setViewType] = useState("list"); // or "grid"

    const employees = [
        {
            name: 'John Smith',
            role: 'Field Technician',
            location: 'Main Office',
            status: 'online',
            geofences: ['Main Office', 'Client Site A', 'Warehouse'],
            lastActive: '5 min ago'
        },
        {
            name: 'Sarah Johnson',
            role: 'Service Representative',
            location: 'Client Site A',
            status: 'online',
            geofences: ['Client Site A', 'Client Site B'],
            lastActive: '15 min ago'
        },
        {
            name: 'Mike Jones',
            role: 'Delivery Driver',
            location: 'Warehouse',
            status: 'online',
            geofences: ['Main Office', 'Warehouse'],
            lastActive: '32 min ago'
        },
        {
            name: 'Emily Wilson',
            role: 'Marketing Representative',
            location: 'Offline',
            status: 'offline',
            geofences: ['Main Office', 'Client Site B'],
            lastActive: '2 days ago'
        },
        {
            name: 'David Brown',
            role: 'Support Worker',
            location: 'Offline',
            status: 'offline',
            geofences: ['Client Site A'],
            lastActive: '1 day ago'
        },
    ];

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // useEffect(() => {
    //     if (window.bootstrap) {
    //         const dropdownTriggers = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    //         dropdownTriggers.forEach(triggerEl => {
    //             new window.bootstrap.Dropdown(triggerEl);
    //         });
    //     }
    // }, [viewType, filteredEmployees]);

    // useEffect(() => {
    //     const dropdownTriggers = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    //     dropdownTriggers.forEach(triggerEl => {
    //         new bootstrap.Dropdown(triggerEl); // using the imported bootstrap, not window.bootstrap
    //     });
    // }, [viewType, filteredEmployees]);


    return (
        <>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <h5>Add Employees</h5>
                </div>
                <div className="mainwrapper ownerTeamContainer" style={{ justifyContent: "center", paddingBottom: "90px" }}>
                    <div className="row">
                        {/* Left Panel */}
                        <div className="col-md-12">
                            {/* Employee List View UI */}
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header bg-white">
                                    <h5 className="mb-1 fw-bold">Employee Management</h5>
                                    <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                                        Manage your field employees and their assigned geofences.
                                    </p>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search employees..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        {/* <div className="d-flex align-items-center gap-2">
                                            <button className={`btn btn-sm ${viewType === 'list' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewType('list')}>
                                                List
                                            </button>
                                            <button className={`btn btn-sm ${viewType === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setViewType('grid')}>
                                                Grid
                                            </button>
                                        </div> */}
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-outline-secondary btn-sm">
                                                <i className="bi bi-funnel"></i> Filter
                                            </button>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <button
                                            className={`btn btn-toggle-view ${viewType === 'list' ? 'active' : ''}`}
                                            onClick={() => setViewType('list')}
                                        >
                                            List
                                        </button>
                                        <button
                                            className={`btn btn-toggle-view ${viewType === 'grid' ? 'active' : ''}`}
                                            onClick={() => setViewType('grid')}
                                        >
                                            Grid
                                        </button>
                                    </div>
                                </div>

                                <div className="card-body p-0" style={{ overflow: 'visible' }}>
                                    {viewType === "list" ? (
                                        <table className="table table-hover table-bordered align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Employee</th>
                                                    <th>Current Location</th>
                                                    <th>Assigned Geofences</th>
                                                    <th>Last Active</th>
                                                    <th className="text-end">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredEmployees.map((emp, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            {/* Avatar + Name + Role */}
                                                            <h6 className="mb-0 fw-bold">{emp.name}</h6>

                                                        </td>
                                                        <td>{emp.location || <span className="badge bg-light text-muted">Offline</span>}</td>
                                                        <td>
                                                            {(emp.geofences || []).map((g, i) => (
                                                                <span key={i} className="badge bg-info me-1 mb-1">{g}</span>
                                                            ))}
                                                        </td>
                                                        <td><i className="bi bi-clock me-1"></i>{emp.lastActive}</td>
                                                        {/* <td className="text-end">...</td> */}
                                                        <div class="btn-group">
                                                            <button
                                                                type="button"
                                                                className="btn p-0 border-0 bg-transparent"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            >
                                                                <i className="bi bi-three-dots-vertical text-muted"></i>
                                                            </button>
                                                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                                                                <li><a class="dropdown-item" href="#">Action</a></li>
                                                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                                                <li><a class="dropdown-item" href="#">Something else here</a></li>
                                                                <li><hr class="dropdown-divider" /></li>
                                                                <li><a class="dropdown-item" href="#">Separated link</a></li>
                                                            </ul>
                                                        </div>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="row">
                                            <div className="row">
                                                {filteredEmployees.map((emp, index) => (
                                                    <div className="col-md-6 col-lg-4 mb-4" key={index}>
                                                        <div className="card shadow-sm border-0 rounded-4 p-3 position-relative h-100">

                                                            {/* Header: Avatar, Name, Role */}
                                                            <div className="d-flex align-items-center mb-3">
                                                                <div className="rounded-circle bg-light d-flex justify-content-center align-items-center me-3" style={{ width: 45, height: 45 }}>
                                                                    <i className="bi bi-person text-secondary fs-4"></i>
                                                                </div>
                                                                <div>
                                                                    <h6 className="mb-0 fw-bold">{emp.name}</h6>
                                                                    <small className="text-muted">{emp.role || "Field Employee"}</small>
                                                                    {emp.status === "online" && (
                                                                        <span className="ms-2 badge bg-success rounded-circle" style={{ width: 8, height: 8 }}></span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Status */}
                                                            <div className="mb-2">
                                                                <strong>Status:</strong>{" "}
                                                                <span className="badge rounded-pill bg-primary-subtle text-primary fw-medium">
                                                                    Active
                                                                </span>
                                                            </div>

                                                            {/* Location */}
                                                            <div className="mb-2">
                                                                <strong>Location:</strong>{" "}
                                                                {emp.location ? (
                                                                    <span className="text-dark">{emp.location}</span>
                                                                ) : (
                                                                    <span className="badge bg-light text-muted">Offline</span>
                                                                )}
                                                            </div>

                                                            {/* Last Active */}
                                                            <div className="mb-2">
                                                                <strong>Last active:</strong> <span>{emp.lastActive}</span>
                                                            </div>

                                                            {/* Geofences */}
                                                            <div className="mb-3">
                                                                <strong>Assigned Geofences:</strong>
                                                                <div className="mt-1 d-flex flex-wrap gap-1">
                                                                    {(emp.geofences || []).map((geo, i) => (
                                                                        <span className="badge bg-primary-subtle text-primary fw-medium" key={i}>
                                                                            <i className="bi bi-geo-alt me-1"></i> {geo}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Action Dropdown */}
                                                            <div class="btn-group">
                                                                <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    Action
                                                                </button>
                                                                <ul class="dropdown-menu text-dark"
                                                                    style={{
                                                                        backgroundColor: '#fff',
                                                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                                                                        border: 'none',
                                                                        borderRadius: '0.5rem',
                                                                        padding: '0.5rem',
                                                                        minWidth: '200px',
                                                                    }}
                                                                >
                                                                    <li><a className="dropdown-item text-dark" href="#">View Profile</a></li>
                                                                    <li><a class="dropdown-item text-dark" href="#">Edit</a></li>
                                                                    <li><a class="dropdown-item text-dark" href="#">Assign to Geofence</a></li>
                                                                    <li><a class="dropdown-item text-dark" href="#">View Location History</a></li>
                                                                    <li><a class="dropdown-item text-danger" href="#">Deactivate</a></li>
                                                                </ul>
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </>
    );
};

export default AddEmployees;
