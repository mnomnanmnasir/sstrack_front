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
import AddEmployeeModal from './AddEmployeeModal';  // Import the modal you just created
import InviteEmployeeModal from './InviteEmployeeModal';
import EmployeeStats from './EmployeeStats';
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

const AddEmployees = () => {

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
    const [viewType, setViewType] = useState("list"); // or "grid"
    const [employeeFilter, setEmployeeFilter] = useState('all'); // all | active | inactive
    // const [showModal, setShowModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

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

    // const filteredEmployees = employees.filter(emp =>
    //     emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const handleOpenModal = () => {
        setShowModal1(true);
    };

    const activeCount = employees.filter(emp => emp.status === 'online').length;
    const inactiveCount = employees.filter(emp => emp.status === 'offline').length;

    const filteredEmployees = employees
        .filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(emp => {
            if (employeeFilter === 'active') return emp.status === 'online';
            if (employeeFilter === 'inactive') return emp.status === 'offline';
            return true; // for 'all'
        });

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

                        {/* Top Title & Add Button Row */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="fw-bold mb-0">Employees</h4>


                            <div className="d-flex gap-2">
                                {/* Invite Button */}
                                <button
                                    className="btn btn-light d-flex align-items-center gap-2 px-3 py-2 border"
                                    style={{ borderColor: '#e0e0e0', borderRadius: '8px' }}
                                    onClick={() => setShowInviteModal(true)}
                                >
                                    <i className="bi bi-person-plus" style={{ fontSize: '14px' }}></i> Invite
                                </button>

                                {/* Add Employee Button */}
                                <button
                                    className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                                    onClick={() => setShowModal(true)}
                                >
                                    <i className="bi bi-plus-lg"></i> Add Employee
                                </button>
                            </div>


                            <AddEmployeeModal show={showModal} handleClose={() => setShowModal(false)} />

                            {/* Invite Modal (You can build similar like AddEmployeeModal) */}
                            <InviteEmployeeModal show={showInviteModal} handleClose={() => setShowInviteModal(false)} />

                        </div>

                        <EmployeeStats />

                        {/* Left Panel */}
                        <div className="col-md-12 mt-1">
                            <div className="d-flex justify-content-between align-items-center mt-2 gap-2">

                                {/* Search Bar */}
                                <div className="flex-grow-1 position-relative">
                                    <i className="bi bi-search position-absolute text-muted"
                                        style={{ top: '50%', left: '14px', transform: 'translateY(-50%)', fontSize: '14px' }}>
                                    </i>
                                    <input
                                        type="text"
                                        className="form-control ps-5"
                                        style={{
                                            borderRadius: '8px',
                                            borderColor: '#e0e0e0',
                                            fontSize: '13px',
                                            height: '40px'
                                        }}
                                        placeholder="Search employees..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Department Dropdown */}
                                <div>
                                    <select className="form-select" style={{
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        height: '40px',
                                        width: '150px'
                                    }}>
                                        <option>All Departments</option>
                                        <option>HR</option>
                                        <option>Sales</option>
                                        <option>IT</option>
                                        {/* You can map dynamic departments here */}
                                    </select>
                                </div>

                                {/* View Switch Icons */}
                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        className={`btn ${viewType === 'list' ? 'btn-primary' : 'btn-outline-secondary'} rounded-3 p-2`}
                                        onClick={() => setViewType('list')}
                                    >
                                        <i className="bi bi-person" style={{ fontSize: '16px' }}></i>
                                    </button>

                                    <button
                                        className={`btn ${viewType === 'grid' ? 'btn-primary' : 'btn-outline-secondary'} rounded-3 p-2`}
                                        onClick={() => setViewType('grid')}
                                    >
                                        <i className="bi bi-funnel" style={{ fontSize: '16px' }}></i>
                                    </button>
                                </div>

                            </div>

                            <div className="d-flex align-items-center p-1 mb-0 mt-2"
                                style={{ backgroundColor: "grey", borderRadius: "10px", width: "fit-content" }}>

                                <button
                                    className={`btn btn-sm px-3 py-2 fw-semibold ${employeeFilter === 'all' ? 'btn-light text-dark' : 'btn-transparent text-white'}`}
                                    style={{
                                        borderRadius: "8px",
                                        backgroundColor: employeeFilter === 'all' ? '#fff' : 'transparent',
                                        border: 'none',
                                        boxShadow: employeeFilter === 'all' ? '0 0 2px rgba(0,0,0,0.2)' : 'none'
                                    }}
                                    onClick={() => setEmployeeFilter('all')}
                                >
                                    All Employees
                                </button>

                                <button
                                    className={`btn btn-sm px-3 py-2 fw-semibold ${employeeFilter === 'active' ? 'btn-light text-dark' : 'btn-transparent text-white'}`}
                                    style={{
                                        borderRadius: "8px",
                                        backgroundColor: employeeFilter === 'active' ? '#fff' : 'transparent',
                                        border: 'none',
                                        boxShadow: employeeFilter === 'active' ? '0 0 2px rgba(0,0,0,0.2)' : 'none'
                                    }}
                                    onClick={() => setEmployeeFilter('active')}
                                >
                                    Active ({activeCount})
                                </button>

                                <button
                                    className={`btn btn-sm px-3 py-2 fw-semibold ${employeeFilter === 'inactive' ? 'btn-light text-dark' : 'btn-transparent text-white'}`}
                                    style={{
                                        borderRadius: "8px",
                                        backgroundColor: employeeFilter === 'inactive' ? '#fff' : 'transparent',
                                        border: 'none',
                                        boxShadow: employeeFilter === 'inactive' ? '0 0 2px rgba(0,0,0,0.2)' : 'none'
                                    }}
                                    onClick={() => setEmployeeFilter('inactive')}
                                >
                                    Inactive ({inactiveCount})
                                </button>
                            </div>

                            {/* Employee List View UI */}
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header bg-white">
                                    {/* <h5 className="mb-1 fw-bold">Employee Management</h5>
                                    <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                                        Manage your field employees and their assigned geofences.
                                    </p> */}

                                    {/* 👇 This row aligns search left, filter right */}


                                    {/* View Switch Buttons */}
                                    {/* <div className="d-flex align-items-center gap-2">
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
                                    </div> */}
                                </div>



                                <div className="card-body p-0" style={{ overflow: 'visible' }}>
                                    {viewType === "list" ? (
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="text-secondary fw-normal small">Employee</th>
                                                    <th className="text-secondary fw-normal small">Current Location</th>
                                                    <th className="text-secondary fw-normal small">Assigned Geofences</th>
                                                    <th className="text-secondary fw-normal small">Last Active</th>
                                                    <th className="text-secondary fw-normal small text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredEmployees.map((emp, index) => (
                                                    <tr key={index}>
                                                        {/* Employee: Avatar + Name + Role */}
                                                        {/* Employee */}
                                                        <td className="ps-4 py-3">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div className="rounded-circle d-flex justify-content-center align-items-center"
                                                                    style={{ width: 42, height: 42, backgroundColor: '#EAF3FB' }}>
                                                                    <i className="bi bi-person text-primary fs-5"></i>
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold" style={{ fontSize: '14px' }}>{emp.name}</div>
                                                                    <div className="text-muted" style={{ fontSize: '12px' }}>{emp.role || "Field Employee"}</div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Current Location */}
                                                        <td className="py-3">
                                                            {emp.location && emp.location !== 'Offline' ? (
                                                                <span className="d-flex align-items-center text-dark" style={{ fontSize: '13px' }}>
                                                                    <i class="bi bi-geo-alt me-1 text-primary"></i>{emp.location}
                                                                </span>
                                                            ) : (
                                                                <span className="badge rounded-pill bg-light text-muted px-3 py-2" style={{ fontSize: '12px' }}>Offline</span>
                                                            )}
                                                        </td>

                                                        {/* Assigned Geofences */}
                                                        <td className="py-3">
                                                            <div className="d-flex flex-wrap gap-2">
                                                                {(emp.geofences || []).map((g, i) => (
                                                                    <span key={i} className="badge rounded-pill" style={{
                                                                        backgroundColor: '#0ea5e9',
                                                                        fontSize: '12px',
                                                                        padding: '6px 12px'
                                                                    }}>
                                                                        {g}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>

                                                        {/* Last Active */}
                                                        <td className="py-3">
                                                            <span className="d-flex align-items-center text-muted" style={{ fontSize: '13px' }}>
                                                                <i className="bi bi-clock me-1"></i>{emp.lastActive}
                                                            </span>
                                                        </td>

                                                        {/* <td className="text-end">...</td> */}
                                                        <td className="text-center">
                                                            <div class="btn-group">
                                                                <button
                                                                    type="button"
                                                                    className="btn p-0 border-0 bg-transparent"
                                                                    data-bs-toggle="dropdown"
                                                                    aria-expanded="false"
                                                                >
                                                                    <i className="bi bi-three-dots-vertical text-muted"></i>
                                                                </button>
                                                                <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3"
                                                                    style={{
                                                                        backgroundColor: '#fff',
                                                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                                                                        border: 'none',
                                                                        borderRadius: '0.5rem',
                                                                        padding: '0.5rem',
                                                                        minWidth: '200px',
                                                                    }}
                                                                >
                                                                    <li><a class="dropdown-item text-dark" href="#">View Profile</a></li>
                                                                    <li><a class="dropdown-item text-dark" href="#">Edit</a></li>
                                                                    <li><a class="dropdown-item text-dark" href="#">Assign to Geofence</a></li>
                                                                    <li><a class="dropdown-item text-dark" href="#">View Location History</a></li>
                                                                    {/* <li><a class="dropdown-item text-danger" href="#">Deactivate</a></li> */}
                                                                </ul>
                                                            </div>
                                                        </td>
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
                                                                    <li><a class="dropdown-item text-dark" href="#">View Profile</a></li>
                                                                    <li><a class="dropdown-item text-dark" href="#">Edit</a></li>
                                                                    <li><a class="dropdown-item text-dark" href="#">Assign to Geofence</a></li>
                                                                    <li><a class="dropdown-item text-dark" href="#">View Location History</a></li>
                                                                    {/* <li><a class="dropdown-item text-danger" href="#">Deactivate</a></li> */}
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

        </>
    );
};

export default AddEmployees;
