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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddEmployeeModal from './AddEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import EmployeeProfileModal from './EmployeeProfileModal';
import ViewDetails from './ViewDetails';
import AssignGeofenceModal from './AssignGeofenceModal';
import DeactivateEmployeeModal from './DeactivateEmployeeModal';
import InviteEmployeeModal from './InviteEmployeeModal';



const GeoFance = () => {
const navigate = useNavigate();
const tokens = localStorage.getItem("token");
const apiUrlS = 'https://myuniversallanguages.com:9093/api/v1/tracker';
let headers = {
        Authorization: 'Bearer ' + tokens,
    }
const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    activeGeofence: 0,
    employeesOnField: 0,
    alertsToday: 0,
  });
  const [geofenceEvents, setGeofenceEvents] = useState([]);
  const [geofenceStatus, setGeofenceStatus] = useState([]);
const [loading, setLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [selectedGeofence, setSelectedGeofence] = useState(null);

  const cardData = [
    {
      title: 'Total Employees',
      value: dashboardData.totalEmployees,
      icon: 'bi-people',
      trend: 'up',
      percent: '8.5%',
      note: 'vs last month',
      iconBg: 'success'
    },
    {
      title: 'Active Geofences',
      value: dashboardData.activeGeofence,
      icon: 'bi-send',
      iconBg: 'success'
    },
    {
      title: 'Employees on Field',
      value: dashboardData.employeesOnField,
      icon: 'bi-geo-alt',
      trend: 'up',
      percent: '12%',
      note: 'vs last month',
      iconBg: 'success'
    },
    {
      title: 'Alerts Today',
      value: dashboardData.alertsToday,
      icon: 'bi-bell',
      trend: 'down',
      percent: '25%',
      note: 'vs last month',
      iconBg: 'danger'
    }
  ];

const fetchDashboardData  = async () => {
  try {
    const response = await axios.get(`${apiUrlS}/getDashboardData`, 
        {headers}
    );
    if (response.data.success) {
        setDashboardData(response.data.data);
        console.log("response.data.data",response.data.data)
      } else {
        console.error('API request failed:', response.data);
      }
  } catch (error) {
    console.error('Error fetching dashboard data:',error);
  }
};
const fetchEventData = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get(`${apiUrlS}/getRecentGeofenceEvents`, {
        headers: { Authorization: `Bearer ${tokens}` }
      });
      if (response.data.success) {
        setGeofenceEvents(response.data.data);
      } else {
        console.error('Events API failed:', response.data);
        setGeofenceEvents([]);
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
      setGeofenceEvents([]);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchGeofenceStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrlS}/getGeofencesByAssignmentStatus`, {
        headers: {
          Authorization: `Bearer ${tokens}`
        }
      });

      if (response.data.success) {
        console.log("response.data",response.data)
        setGeofenceStatus(response.data.data);
      } else {
        setGeofenceStatus([]);
      }
    } catch (error) {
      console.error('Error fetching geofence events:', error);
      setGeofenceStatus([]);
    } finally {
      setLoading(false);
    }
  };

  const [empOnField, setEmpOnField] = useState([]);

const fetchEmpOnField = async () => {
  try {
    const response = await axios.get(`${apiUrlS}/employeesOnField`, { headers });
    if (response.data.success) {
      setEmpOnField(response.data.data);
    } else {
      console.error('API request failed:', response.data);
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};

    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
 const handleNavigate = (route) => {
        navigate(route);
    };
    useEffect(() => {
      fetchDashboardData ()
      fetchEventData()
      fetchGeofenceStatus()
      fetchEmpOnField()
    }, [])
    
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
      {cardData.map((item, idx) => (
        <div className="col-md-3 mb-3" key={idx}>
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-start">
              <div>
                <small className="text-muted">{item.title}</small>
                <h5 className="fw-bold mt-1">{item.value}</h5>
                {item.trend && (
                  <small className={`text-${item.trend === 'up' ? 'success' : 'danger'}`}>
                    <i className={`bi bi-arrow-${item.trend === 'up' ? 'up' : 'down'} me-1`}></i>
                    {item.percent} <span className="text-muted">{item.note}</span>
                  </small>
                )}
              </div>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: item.title === 'Alerts Today' ? '#FFB3B3' : '#C8E98A'
                }}
              >
                <i className={`bi ${item.icon} text-dark`}></i>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
                    </div>

                    <div className="row mt-4">

                        {/* Recent Geofence Events */}
                        <div
  className="col-md-8 mb-3 custom-scroll"
  style={{
    maxHeight: 370,
    overflow: "auto",
    scrollbarWidth: "none",        // Firefox
    msOverflowStyle: "none"        // IE 10+
  }}
>
  <div className="card h-100 shadow-sm border-0 rounded-4">
    <div className="card-body">
      <h6 className="mb-3 fw-semibold fs-6">Geofence Status Summary</h6>

      {loading ? (
        <p className="text-muted">Loading geofence data...</p>
      ) : geofenceEvents.length > 0 ? (
        geofenceEvents.map((geofence, index) => (
          <div key={index} className="mb-4">
            {geofence.userStatus.length > 0 && (
              <ul className="list-unstyled mb-0">
                {geofence.userStatus.map((userStatus, idx) => (
                  <li key={idx} className="d-flex align-items-start mb-3">
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center me-3"
                      style={{
                        backgroundColor:
                          userStatus.status === 'left' ? '#FFE0D1' : '#D1F1C7',
                        width: 36,
                        height: 36
                      }}
                    >
                      <i
                        className={`bi ${
                          userStatus.status === 'left'
                            ? 'bi-door-closed'
                            : userStatus.status === 'reached'
                            ? 'bi-door-open'
                            : 'bi-person-check'
                        } text-${userStatus.status === 'left' ? 'danger' : 'success'} fs-5`}
                      ></i>
                    </div>

                    <div>
                      <div style={{ fontSize: '14px' }}>
                        <strong>{userStatus.user.name}</strong>{" "}
                        <span className="text-muted" style={{ fontSize: '13px' }}>
                          {userStatus.status}
                        </span>{" "}
                        <a
                          href="#"
                          className="text-muted text-decoration-none fw-medium"
                        >
                          {geofence.geofenceName}
                        </a>
                      </div>
                      <small className="text-muted" style={{ fontSize: '12px' }}>
                        {userStatus.location.time}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p className="text-muted">No geofence data found.</p>
      )}
    </div>
  </div>
</div>




                        {/* Geofence Status */}
                        <div
  className="col-md-4 mb-3 custom-scroll"
  style={{
    maxHeight: 370,
    overflow: "auto",
    scrollbarWidth: "none",        // Firefox
    msOverflowStyle: "none"        // IE 10+
  }}
>
  <div className="card h-100 shadow-sm border-0 rounded-4">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0 fw-semibold fs-6">Geofence Status</h6>
        <span
          className="badge bg-light text-muted fw-normal"
          style={{ fontSize: '12px' }}
        >
          {geofenceStatus.filter(g => g.overallStatus === 'Active').length} Active
        </span>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 mb-0">Loading geofences...</p>
        </div>
      ) : (
        geofenceStatus.map((g, idx) => {
          const percent = g.totalUsersCount > 0
            ? Math.round((g.progressUsersCount / g.totalUsersCount) * 100)
            : 0;

          return (
            <div key={idx} className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="d-flex align-items-center">
                  <i className="bi bi-send text-primary me-2"></i>
                  <span className="fw-medium" style={{ fontSize: '14px' }}>
                    {g.geoFenceName || 'Unnamed Geofence'}
                  </span>
                </div>
                <span
                  className="badge bg-light text-muted fw-normal"
                  style={{ fontSize: '12px' }}
                >
                  <i className="bi bi-people me-1"></i>
                  {`${g.progressUsersCount}/${g.totalUsersCount}`}
                </span>
              </div>

              <div className="d-flex align-items-center">
                <div
                  className="flex-grow-1 position-relative"
                  style={{
                    height: '12px',
                    backgroundColor: '#d5e9d2',
                    borderRadius: '50px',
                    padding: '2px',
                    marginRight: '10px'
                  }}
                >
                  <div
                    className="h-100"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: '#0d6efd',
                      borderRadius: '50px'
                    }}
                  ></div>
                </div>

                <span
                  className={`badge ${g.overallStatus === 'Active' ? 'bg-primary' : 'bg-secondary'}`}
                  style={{ fontSize: '12px', padding: '4px 10px' }}
                >
                  {g.overallStatus}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
</div>

                    </div>
                    {/* Models */}

{/* <AddEmployeeModal
                                show={showModal}
                                handleClose={() => setShowModal(false)}
                                users={users} */}
                                {/* // onEmployeeAdded={getUsersWithRoles}  // 👈 add this line */}
                            {/* /> */}
                            <EditEmployeeModal
                                show={showEditModal}
                                handleClose={() => setShowEditModal(false)}
                                employee={selectedEmployee}
                            />

                            <EmployeeProfileModal
                                show={showProfileModal}
                                handleClose={() => setShowProfileModal(false)}
                                employee={selectedEmployee}
                            />

                            <ViewDetails
                                show={showViewModal}
                                handleClose={() => setShowViewModal(false)}
                                employee={selectedEmployee}
                                //  geofence="gf_12345"
                                geofence={selectedGeofence}
                            // geofence={selectedGeofence} // ✅ Correct
                            // geofenceId={selectedGeofence?.id}
                            />

                            <AssignGeofenceModal
                                show={showAssignModal}
                                handleClose={() => setShowAssignModal(false)}
                                employee={selectedEmployee}
                            />
                            <DeactivateEmployeeModal
                                show={showDeactivateModal}
                                handleClose={() => setShowDeactivateModal(false)}
                                employee={selectedEmployee}
                                onConfirm={(emp) => {
                                    // Do your logic here: API call or update state
                                    console.log('Deactivated:', emp.name);
                                }}
                            />
                            {/* Invite Modal (You can build similar like AddEmployeeModal) */}
                            {/* <InviteEmployeeModal show={showInviteModal} handleClose={() => setShowInviteModal(false)} /> */}
{/* Model end */}

                    <div className="row mt-5">
                        {/* Active Employees */}
                        <div className="col-md-6 mb-4">
                            <div className="card h-100 border-0 rounded-4" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
                                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                    <div className="bg-white">
                                        <h6 className="mb-0 fs-6">Active Employee</h6>
                                    </div>

                                    <button
                                    onClick={() =>handleNavigate("/geo-fance/add-employees")}
                                        className="btn btn-light d-flex align-items-center gap-1 px-3 py-1 border"
                                        style={{ fontSize: '12px', borderRadius: '8px' }}
                                    >
                                        <i className="bi bi-geo-alt" style={{ fontSize: '12px' }}></i> View All
                                    </button>
                                </div>
                               <div className="card-body p-0">
    {/* Header Map Placeholder (static for now) */}
    <div className="text-center py-0 bg-light text-muted">
        <MapContainer
            center={[24.8607, 67.0011]}
            zoom={13}
            style={{ height: "300px", width: "100%", borderRadius: "4px" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Static Marker for example */}
            <Marker position={[24.8607, 67.0011]}>
                <Popup>Example Location</Popup>
            </Marker>
        </MapContainer>
    </div>

    {/* Geofence-wise User Status List */}
    {empOnField.map((geo, geoIdx) => (
        <div key={geoIdx}>
            {/* <div className="bg-light px-3 py-2 border-bottom text-dark fw-bold" style={{ fontSize: '13px' }}>
                {geo.geofenceName}
            </div> */}

            {geo.userStatus.map((emp, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom">
                    <div className="d-flex align-items-center">
                        <div
                            className="rounded-circle text-dark d-flex align-items-center justify-content-center me-3"
                            style={{ background: "#C8E98A", width: 40, height: 40 }}
                        >
                            <span className="fw-semibold" style={{ fontSize: '14px' }}>
                                {emp.user.name.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <div className="fw-semibold" style={{ fontSize: '14px' }}>{emp.user.name}</div>
                            <div className="text-muted d-flex align-items-center" style={{ fontSize: '12px' }}>
                                <i className="bi bi-geo-alt me-1 text-primary" style={{ fontSize: '12px' }}></i>
                                {geo.geofenceName}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <span className="badge rounded-pill text-white" style={{
                            backgroundColor: emp.status === 'reached' ? '#198754' : '#0d6efd',
                            fontSize: '12px',
                            padding: '4px 10px'
                        }}>
                            {emp.time}
                        </span>
                        <div className="btn-group">
                                                                        <button
                                                                            type="button"
                                                                            className="p-0 border-0 bg-transparent"
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <i
                                                                                className="bi bi-three-dots-vertical"
                                                                                style={{
                                                                                    color: '#E5E7EB',
                                                                                    fontSize: '16px'
                                                                                }}
                                                                            ></i>
                                                                        </button>
                                                                        <ul
                                                                            className="dropdown-menu dropdown-menu-end shadow border-0"
                                                                            style={{
                                                                                backgroundColor: '#ffffff',
                                                                                borderRadius: '10px',
                                                                                padding: '2px 0',
                                                                                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)',
                                                                                fontSize: '10px'
                                                                            }}
                                                                        >
                                                                            <li>
                                                                                <a className="dropdown-item" href="#" onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    setSelectedEmployee(emp);
                                                                                    setSelectedGeofence(emp.geofences?.length ? { id: emp.geofences[0] } : null);
                                                                                    setShowViewModal(true);
                                                                                }}>
                                                                                    <span style={{ color: '#000' }}>View Details</span>
                                                                                </a>
                                                                            </li>
                                                                            <li>
                                                                                <a className="dropdown-item" href="#" onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    setSelectedEmployee(emp);
                                                                                    setShowProfileModal(true);
                                                                                }}>
                                                                                    <span style={{ color: '#000' }}>View Profile</span>
                                                                                </a>
                                                                            </li>
                                                                            <li>
                                                                                <a className="dropdown-item" href="#" onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    setSelectedEmployee(emp);
                                                                                    setShowEditModal(true);
                                                                                }}>
                                                                                    <span style={{ color: '#000' }}>Edit</span>
                                                                                </a>
                                                                            </li>
                                                                            <li>
                                                                                <a className="dropdown-item" href="#" onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    setSelectedEmployee(emp);
                                                                                    setShowAssignModal(true);
                                                                                }}>
                                                                                    <span style={{ color: '#000' }}>Assign to Geofence</span>
                                                                                </a>
                                                                            </li>
                                                                            <li>
                                                                                <a className="dropdown-item" href="#" onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    setSelectedEmployee(emp);
                                                                                    setShowDeactivateModal(true);
                                                                                }}>
                                                                                    <span style={{ color: '#EF4444' }}>Deactivate</span>
                                                                                </a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                        {/* <i className="bi bi-three-dots-vertical text-muted" style={{ fontSize: '16px' }}></i> */}
                    </div>
                </div>
            ))}
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
                                           { icon: "bi-person-plus", text: "Add Employee", path: "/geo-fance/add-employees" },
    { icon: "bi-send", text: "Create Geofence", path: "/geo-fance/add" },
    { icon: "bi-geo", text: "Track Employee", path: "/geo-fance/reports" },
    { icon: "bi-bell", text: "Manage Alerts", path: "/geo-fance/alert" }
                                        ].map((action, idx) => (
                                            <div className="col-6" key={idx} onClick={() => handleNavigate(action.path)}>
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
                                                    <div className="d-flex flex-column align-items-center justify-content-center" >
                                                        <i className={`bi ${action.icon}`} style={{ fontSize: '18px', marginBottom: '8px' }} ></i>
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
