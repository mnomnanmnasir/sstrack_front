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


const GeoFance = () => {

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
                                                className={`bg-${item.iconBg || 'secondary'} bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center`}
                                                style={{ width: 40, height: 40 }}
                                            >
                                                <i className={`bi ${item.icon} text-${item.iconBg || 'secondary'}`}></i>
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
                            <div className="card h-100">
                                <div className="card-body">
                                    <h6 className="mb-3 fw-semibold">Recent Geofence Events</h6>
                                    <ul className="list-unstyled mb-0">
                                        {[
                                            { name: "John Smith", action: "entered", location: "Main Office", time: "Today at 9:32 AM", icon: "bi-door-open", color: "success" },
                                            { name: "Mike Jones", action: "left", location: "Warehouse", time: "Today at 9:15 AM", icon: "bi-door-closed", color: "success" },
                                            { name: "Sarah Johnson", action: "triggered alert at", location: "Restricted Area", time: "Today at 8:45 AM", icon: "bi-exclamation-triangle", color: "danger" },
                                            { name: "Sarah Johnson", action: "entered", location: "Client Site B", time: "Yesterday at 4:20 PM", icon: "bi-door-open", color: "success" },
                                            { name: "John Smith", action: "left", location: "Main Office", time: "Yesterday at 5:30 PM", icon: "bi-door-closed", color: "success" }
                                        ].map((event, idx) => (
                                            <li key={idx} className="d-flex align-items-start mb-3">
                                                <div className={`bg-${event.color} bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3`} style={{ width: 32, height: 32 }}>
                                                    <i className={`bi ${event.icon} text-${event.color}`}></i>
                                                </div>
                                                <div>
                                                    <div>
                                                        <strong>{event.name}</strong> <span className="text-muted">{event.action}</span>{' '}
                                                        <a href="#" className="text-primary text-decoration-none fw-medium">{event.location}</a>
                                                    </div>
                                                    <small className="text-muted">{event.time}</small>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Geofence Status */}
                        <div className="col-md-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0 fw-semibold">Geofence Status</h6>
                                        <span className="badge bg-light text-muted fw-normal">3 Active</span>
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
                                                        <span className="fw-medium">{g.name}</span>
                                                    </div>
                                                    <span className="badge bg-light text-muted"><i className="bi bi-people me-1"></i>{`${g.current}/${g.total}`}</span>
                                                </div>
                                                <div className="progress" style={{ height: '6px' }}>
                                                    <div
                                                        className={`progress-bar ${g.status === 'Active' ? 'bg-primary' : 'bg-secondary'}`}
                                                        style={{ width: `${percent}%` }}
                                                    ></div>
                                                </div>
                                                <div className="d-flex justify-content-end mt-1">
                                                    <span className={`badge bg-${g.status === 'Active' ? 'primary' : 'secondary'}`}>{g.status}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default GeoFance;
