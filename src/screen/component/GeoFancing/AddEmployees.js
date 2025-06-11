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
import { BiCheck } from 'react-icons/bi';
import { BsChevronDown } from 'react-icons/bs';


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

    const [formData, setFormData] = useState({ category: 'All Departments' });

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
    const categoryOptions = ['All Departments', 'Field Technician', 'Safety Officers', 'Delivery Driver', 'Site Managers'];
    const [isOpen, setIsOpen] = useState(false);


    const employees = [
        {
            name: 'John Smith',
            role: 'Field Technician',
            email: 'nomannasir@i8is.com',
            location: 'Main Office',
            status: 'Active',
            geofences: ['Main Office', 'Client Site A', 'Warehouse A'],
            lastActive: '5 min ago'
        },
        {
            name: 'Sarah Johnson',
            role: 'Service Representative',
            email: 'nomannasir@i8is.com',
            location: 'Client Site A',
            status: 'Active',
            geofences: ['Main Office'],
            lastActive: '15 min ago'
        },
        {
            name: 'Mike Jones',
            role: 'Delivery Driver',
            email: 'nomannasir@i8is.com',
            location: 'Warehouse',
            status: 'Active',
            geofences: ['Main Office', 'Warehouse'],
            lastActive: '32 min ago'
        },
        {
            name: 'Emily Wilson',
            role: 'Marketing Representative',
            email: 'nomannasir@i8is.com',
            location: 'Offline',
            status: 'offline',
            geofences: ['Main Office', 'Client Site B'],
            lastActive: '2 days ago'
        },
        {
            name: 'David Brown',
            role: 'Support Worker',
            email: 'nomannasir@i8is.com',
            location: 'Offline',
            status: 'Inactive',
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
                                <div className="position-relative" style={{ flexGrow: 1, maxWidth: '600px' }}>
                                    <i
                                        className="bi bi-search position-absolute text-muted"
                                        style={{
                                            top: '50%',
                                            left: '14px',
                                            transform: 'translateY(-50%)',
                                            fontSize: '14px'
                                        }}
                                    />
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
                                <div style={{ position: 'relative', width: '200px', fontFamily: 'sans-serif' }}>
                                    <div
                                        onClick={() => setIsOpen(!isOpen)}
                                        className="d-flex justify-content-between align-items-center"
                                        style={{
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '6px',
                                            backgroundColor: '#fff',
                                            fontSize: '14px',
                                            padding: '10px 12px',
                                            cursor: 'pointer',
                                            userSelect: 'none',
                                        }}
                                    >
                                        {formData.category}
                                        <BsChevronDown className="text-muted" size={16} />
                                    </div>

                                    {isOpen && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '44px',
                                                left: 0,
                                                width: '100%',
                                                border: '1px solid #D1D5DB',
                                                borderRadius: '6px',
                                                backgroundColor: '#fff',
                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
                                                zIndex: 1000
                                            }}
                                        >
                                            {categoryOptions.map((option) => (
                                                <div
                                                    key={option}
                                                    onClick={() => {
                                                        setFormData((prev) => ({ ...prev, category: option }));
                                                        setIsOpen(false);
                                                    }}
                                                    style={{
                                                        padding: '10px 12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        backgroundColor: formData.category === option ? '#F0F9FF' : '#fff',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        color: '#111827',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    <span style={{ width: '16px', display: 'inline-block' }}>
                                                        {formData.category === option && <BiCheck className="text-dark" size={16} />}
                                                    </span>
                                                    <span>{option}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                        <table className="table align-middle" style={{ fontSize: '13px' }}>
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="text-secondary fw-normal" style={{ fontSize: '12px' }}>Employee</th>
                                                    <th className="text-secondary fw-normal" style={{ fontSize: '12px' }}>Role</th>
                                                    <th className="text-secondary fw-normal" style={{ fontSize: '12px' }}>Status</th>
                                                    <th className="text-secondary fw-normal" style={{ fontSize: '12px' }}>Current Location</th>
                                                    <th className="text-secondary fw-normal" style={{ fontSize: '12px' }}>Last Active</th>
                                                    <th className="text-secondary fw-normal text-center" style={{ fontSize: '12px' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredEmployees.map((emp, index) => (
                                                    <tr key={index} style={{ borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' }}>
                                                        {/* Employee: Avatar + Name + Email */}
                                                        <td className="ps-4 py-3">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div className="rounded-circle d-flex align-items-center text-white fw-semibold"
                                                                    style={{
                                                                        width: 36,
                                                                        height: 36,
                                                                        backgroundColor: '#CBD5E1',
                                                                        fontSize: '13px'
                                                                    }}>
                                                                    {emp.name?.charAt(0).toUpperCase() || '?'}
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold" style={{ fontSize: '13.5px' }}>{emp.name}</div>
                                                                    <div className="text-muted" style={{ fontSize: '12px' }}>{emp.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Role */}
                                                        <td className="py-3" style={{ fontSize: '13px' }}>{emp.role}</td>

                                                        {/* Status */}
                                                        <td className="py-3" style={{ minWidth: '130px' }}>
                                                            <span className="badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1"
                                                                style={{
                                                                    fontSize: '12px',
                                                                    backgroundColor: emp.status === 'Active' ? '#D1FAE5'
                                                                        : emp.status === 'Offline' ? '#FEF3C7'
                                                                            : emp.status === 'Inactive' ? '#F1F5F9'
                                                                                : '#E5E7EB',
                                                                    color: emp.status === 'Active' ? '#059669'
                                                                        : emp.status === 'Offline' ? '#D97706'
                                                                            : emp.status === 'Inactive' ? '#64748B'
                                                                                : '#374151'
                                                                }}>
                                                                <i className={`bi ${emp.status === 'Active'
                                                                    ? 'bi-check-circle'
                                                                    : emp.status === 'Offline'
                                                                        ? 'bi-exclamation-circle'
                                                                        : 'bi-slash-circle'}`}></i>
                                                                {emp.status}
                                                            </span>
                                                        </td>

                                                        {/* Location */}
                                                        <td style={{ minWidth: '160px' }}>
                                                            {emp.location && emp.location !== 'Unknown' ? (
                                                                <span className="d-flex align-items-center text-dark" style={{ fontSize: '13px' }}>
                                                                    <i className="bi bi-geo-alt me-1 text-primary"></i>{emp.location}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted" style={{ fontSize: '12px' }}>Unknown</span>
                                                            )}
                                                        </td>

                                                        {/* Last Active */}
                                                        <td className="py-3 text-muted" style={{ fontSize: '13px', minWidth: '120px' }}>
                                                            <i className="bi bi-clock me-1"></i>{emp.lastActive}
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="text-muted" >
                                                            <div className="btn-group">
                                                                <button
                                                                    type="button"
                                                                    className="btn p-0 border-0 bg-transparent"
                                                                    data-bs-toggle="dropdown"
                                                                    aria-expanded="false"
                                                                >
                                                                    <i className="bi bi-three-dots-vertical text-muted"></i>
                                                                </button>
                                                                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3"
                                                                    style={{
                                                                        backgroundColor: '#fff',
                                                                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                                                                        borderRadius: '0.5rem',
                                                                        minWidth: '200px',
                                                                        fontSize: '13px'
                                                                    }}
                                                                >
                                                                    <li><a className="dropdown-item text-dark" href="#">View Profile</a></li>
                                                                    <li><a className="dropdown-item text-dark" href="#">Edit</a></li>
                                                                    <li><a className="dropdown-item text-dark" href="#">Assign to Geofence</a></li>
                                                                    <li><a className="dropdown-item text-dark" href="#">View Location History</a></li>
                                                                    <li><hr className="dropdown-divider" /></li>
                                                                    <li><a className="dropdown-item text-danger" href="#">Deactivate</a></li>
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
                                                                    <span className="badge bg-light text-muted">offline</span>
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
