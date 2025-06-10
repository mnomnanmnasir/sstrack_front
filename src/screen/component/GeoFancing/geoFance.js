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
import QuickStartModal from './QuickStartModal';



const GeoFance = () => {


    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <h5>Geo Fencing Dashboard</h5>
                </div>
                <div className="mainwrapper ownerTeamContainer" style={{ justifyContent: "center", paddingBottom: "90px" }}>
                    <div className="row">
                        {/* Left Panel */}
                        <div className="row mb-4">
                            {[
                                {
                                    title: 'Total Employees',
                                    value: 12,
                                    icon: 'bi-people',
                                    trend: 'up',
                                    percent: '8.5%',
                                    note: 'vs last month',
                                    iconBg: 'success'
                                },
                                {
                                    title: 'Active Geofences',
                                    value: 5,
                                    icon: 'bi-send',
                                    iconBg: 'success'
                                },
                                {
                                    title: 'Employees on Field',
                                    value: 8,
                                    icon: 'bi-geo-alt',
                                    trend: 'up',
                                    percent: '12%',
                                    note: 'vs last month',
                                    iconBg: 'success'
                                },
                                {
                                    title: 'Alerts Today',
                                    value: 3,
                                    icon: 'bi-bell',
                                    trend: 'down',
                                    percent: '25%',
                                    note: 'vs last month',
                                    iconBg: 'danger'
                                }
                            ].map((item, idx) => (
                                <div className="col-md-3 mb-3" key={idx}>
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-body d-flex justify-content-between align-items-start">
                                            <div>
                                                <small className="text-muted">{item.title}</small>
                                                <h5 className="fw-bold mt-1">{item.value}</h5>
                                                {item.trend && (
                                                    <small className={`text-${item.trend === 'up' ? 'success' : 'danger'}`}>
                                                        <i className={`bi bi-arrow-${item.trend === 'up' ? 'up' : 'down'} me-1`}></i>
                                                        {item.percent} <span className="text-muted"> {item.note}</span>
                                                    </small>
                                                )}
                                            </div>
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    backgroundColor: item.title === 'Alerts Today' ? '#FFB3B3' : '#C8E98A' // 🔴 red for Alerts Today, 🟢 green for others
                                                }}
                                            >
                                                <i className={`bi ${item.icon} text-dark`}></i> {/* icon color can be changed to white or dark */}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="row mt-4">

                        {/* Recent Geofence Events */}
                        <div className="col-md-8 mb-3">
                            <div className="card h-100 shadow-sm border-0 rounded-4">
                                <div className="card-body">
                                    <h6 className="mb-3 fw-semibold fs-6">Recent Geofence Events</h6>

                                    <ul className="list-unstyled mb-0">
                                        {[
                                            { name: "John Smith", action: "entered", location: "Main Office", time: "Today at 9:32 AM", icon: "bi-door-open", color: "success", bg: "#D1F1C7" },
                                            { name: "Mike Jones", action: "left", location: "Warehouse", time: "Today at 9:15 AM", icon: "bi-door-closed", color: "success", bg: "#D1F1C7" },
                                            { name: "Sarah Johnson", action: "triggered alert at", location: "Restricted Area", time: "Today at 8:45 AM", icon: "bi-exclamation-triangle", color: "danger", bg: "#FFE0D1" },
                                            { name: "Sarah Johnson", action: "entered", location: "Client Site B", time: "Yesterday at 4:20 PM", icon: "bi-door-open", color: "success", bg: "#D1F1C7" },
                                            { name: "John Smith", action: "left", location: "Main Office", time: "Yesterday at 5:30 PM", icon: "bi-door-closed", color: "success", bg: "#D1F1C7" }
                                        ].map((event, idx) => (
                                            <li key={idx} className="d-flex align-items-start mb-3">

                                                <div className="rounded-circle d-flex justify-content-center align-items-center me-3"
                                                    style={{ backgroundColor: event.bg, width: 36, height: 36 }}>
                                                    <i className={`bi ${event.icon} text-${event.color} fs-5`}></i>
                                                </div>

                                                <div>
                                                    <div style={{ fontSize: '14px' }}>
                                                        <strong>{event.name}</strong>{" "}
                                                        <span className="text-muted" style={{ fontSize: '13px' }}>{event.action}</span>{" "}
                                                        <a href="#" className="text-muted text-decoration-none fw-medium">{event.location}</a>
                                                    </div>
                                                    <small className="text-muted" style={{ fontSize: '12px' }}>{event.time}</small>
                                                </div>

                                            </li>
                                        ))}
                                    </ul>

                                </div>
                            </div>
                        </div>

                        {/* Geofence Status */}
                        <div className="col-md-4 mb-3">
                            <div className="card h-100 shadow-sm border-0 rounded-4">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className="mb-0 fw-semibold fs-6">Geofence Status</h6>
                                        <span className="badge bg-light text-muted fw-normal" style={{ fontSize: '12px' }}>3 Active</span>
                                    </div>

                                    {[
                                        { name: "Main Office", current: 2, total: 5, status: "Active" },
                                        { name: "Warehouse", current: 1, total: 4, status: "Active" },
                                        { name: "Client Site A", current: 1, total: 3, status: "Active" },
                                        { name: "Client Site B", current: 0, total: 2, status: "Inactive" }
                                    ].map((g, idx) => {
                                        const percent = Math.round((g.current / g.total) * 100);
                                        return (
                                            <div key={idx} className="mb-3">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <div className="d-flex align-items-center">
                                                        <i className="bi bi-send text-primary me-2"></i>
                                                        <span className="fw-medium" style={{ fontSize: '14px' }}>{g.name}</span>
                                                    </div>
                                                    <span className="badge bg-light text-muted fw-normal" style={{ fontSize: '12px' }}>
                                                        <i className="bi bi-people me-1"></i>{`${g.current}/${g.total}`}
                                                    </span>
                                                </div>

                                                {/* Progress Bar Row with Status */}
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-grow-1 position-relative" style={{
                                                        height: '12px',
                                                        backgroundColor: '#d5e9d2',
                                                        borderRadius: '50px',
                                                        padding: '2px',
                                                        marginRight: '10px'  // to create space for status badge
                                                    }}>
                                                        <div
                                                            className="h-100"
                                                            style={{
                                                                width: `${percent}%`,
                                                                backgroundColor: '#0d6efd',
                                                                borderRadius: '50px'
                                                            }}
                                                        ></div>
                                                    </div>

                                                    {/* Status badge beside progress */}
                                                    <span className={`badge ${g.status === 'Active' ? 'bg-primary' : 'bg-secondary'}`} style={{ fontSize: '12px', padding: '4px 10px' }}>
                                                        {g.status}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-5">
                        {/* Active Employees */}
                        <div className="col-md-6 mb-4">
                            <div className="card h-100 border-0 rounded-4" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
                                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                    <div className="bg-white">
                                        <h6 className="mb-0 fs-6">Active Employee</h6>
                                    </div>

                                    <button
                                        className="btn btn-light d-flex align-items-center gap-1 px-3 py-1 border"
                                        style={{ fontSize: '12px', borderRadius: '8px' }}
                                    >
                                        <i className="bi bi-geo-alt" style={{ fontSize: '12px' }}></i> View All
                                    </button>
                                </div>
                                <div className="card-body p-0">
                                    {/* Map Placeholder */}
                                    <div className="text-center py-0 bg-light text-muted">
                                        <MapContainer
                                            center={[24.8607, 67.0011]} // Karachi coordinates
                                            zoom={13}
                                            style={{ height: "300px", width: "100%", borderRadius: "4px" }}
                                        >
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            />
                                            <Marker position={[24.8607, 67.0011]}>
                                                <Popup>Location</Popup>
                                            </Marker>
                                        </MapContainer>

                                        {/* Directions Button */}
                                        {/* <div className="mt-2">
                                            <a
                                                href="https://www.google.com/maps/dir/?api=1&destination=24.8607,67.0011"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline-primary btn-sm mt-2"
                                            >
                                                <i className="bi bi-geo-alt me-1"></i> Get Directions
                                            </a>
                                        </div> */}
                                    </div>

                                    {/* Active Employee List */}
                                    {[
                                        { name: "John Smith", location: "Main Office", time: "45 min" },
                                        { name: "Sarah Johnson", location: "Client Site A", time: "2h 15min" },
                                        { name: "Mike Jones", location: "Warehouse", time: "10 min" },
                                    ].map((emp, idx) => (
                                        <div key={idx} className="d-flex align-items-center justify-content-between px-3 py-3">
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="rounded-circle text-dark d-flex align-items-center justify-content-center me-3"
                                                    style={{ background: "#C8E98A", width: 40, height: 40 }}
                                                >
                                                    <span className="fw-semibold" style={{ fontSize: '14px' }}>{emp.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <div className="fw-semibold" style={{ fontSize: '14px' }}>{emp.name}</div>
                                                    <div className="text-muted d-flex align-items-center" style={{ fontSize: '12px' }}>
                                                        <i className="bi bi-geo-alt me-1 text-primary" style={{ fontSize: '12px' }}></i>
                                                        {emp.location}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center gap-2">
                                                <span className="badge rounded-pill text-white" style={{
                                                    backgroundColor: '#0d6efd',
                                                    fontSize: '12px',
                                                    padding: '4px 10px'
                                                }}>{emp.time}</span>

                                                <i className="bi bi-three-dots-vertical text-muted" style={{ fontSize: '16px' }}></i>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="col-md-6 mb-4">
                            <div className="card h-100 border-0 rounded-4" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
                                {/* <div className="card-header bg-white border-bottom-0">
                                    <h6 className="mb-0 fs-6">Quick Actions</h6>
                                </div> */}
                                <div className="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center">
                                    <div className="card-header bg-white border-bottom-0">
                                        <h6 className="mb-0 fs-6">Quick Actions</h6>
                                        {/* <h6 className="mb-0 fs-6">Active Employee</h6> */}
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        {[
                                            { icon: "bi-person-plus", text: "Add Employee" },
                                            { icon: "bi-send", text: "Create Geofence" },
                                            { icon: "bi-geo", text: "Track Employee" },
                                            { icon: "bi-bell", text: "Manage Alerts" }
                                        ].map((action, idx) => (
                                            <div className="col-6" key={idx}>
                                                <button
                                                    className="btn w-100 border"
                                                    style={{
                                                        padding: '20px',
                                                        borderRadius: '10px',
                                                        // borderColor: '#e3e6ec',
                                                        backgroundColor: '#fff',
                                                        fontSize: '14px',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                                        <i className={`bi ${action.icon}`} style={{ fontSize: '18px', marginBottom: '8px' }}></i>
                                                        <span>{action.text}</span>
                                                    </div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
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
                <QuickStartModal show={showModal} onClose={() => setShowModal(false)} />

            </div>

        </>
    );
};

export default GeoFance;
