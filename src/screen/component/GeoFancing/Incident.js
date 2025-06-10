import React, { useState } from 'react';
import { FaFileAlt, FaExclamationTriangle } from 'react-icons/fa';
import { MdPriorityHigh } from 'react-icons/md';
import { AiOutlineWarning } from 'react-icons/ai';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';


const Incident = () => {

    const [activeTab, setActiveTab] = useState('all');

    // Static data
    const incidentData = [
        {
            id: 1,
            title: "Fallen Tree Blocking Path",
            by: "John Smith",
            location: "North Access Road",
            severity: "High",
            reported: "May 16, 01:45 PM",
            status: "Resolved",
            tabType: "resolved",
            icon: <AiOutlineWarning style={{ color: '#DC2626', marginRight: '5px' }} />
        },
        {
            id: 2,
            title: "Broken Fence",
            by: "Sarah Johnson",
            location: "East Boundary",
            severity: "Medium",
            reported: "May 15, 07:30 PM",
            status: "Reported",
            tabType: "open",
            icon: <BsExclamationCircle style={{ color: '#2563EB', marginRight: '5px' }} />
        },
        {
            id: 3,
            title: "Water Leak in Building B",
            by: "Mike Wilson",
            location: "Building B, Main Hallway",
            severity: "High",
            reported: "May 16, 03:15 PM",
            status: "Investigating",
            tabType: "high",
            icon: <AiOutlineWarning style={{ color: '#DC2626', marginRight: '5px' }} />
        },
        {
            id: 4,
            title: "Graffiti on South Wall",
            by: "Lisa Chen",
            location: "South Loading Area",
            severity: "Low",
            reported: "May 14, 02:20 PM",
            status: "Reported",
            tabType: "open",
            icon: <BsExclamationCircle style={{ color: '#2563EB', marginRight: '5px' }} />
        },
        {
            id: 5,
            title: "Slippery Pathway After Rain",
            by: "David Brown",
            location: "Building C Entrance",
            severity: "Medium",
            reported: "May 10, 09:45 PM",
            status: "Resolved",
            tabType: "resolved",
            icon: <AiOutlineWarning style={{ color: '#DC2626', marginRight: '5px' }} />
        }
    ];

    // Filter logic
    const filteredData = activeTab === 'all'
        ? incidentData
        : incidentData.filter(item => item.tabType === activeTab);

    return (
        <>
            <div className="container">
                <div className="userHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ fontSize: '24px', fontWeight: 'bold' }}>Incident Reports</h5>
                    <button style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}>
                        + Report Incident
                    </button>
                </div>

                <div className="mainwrapper ownerTeamContainer" style={{ justifyContent: "center", paddingBottom: "90px", display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

                    {/* All Incidents */}
                    <div style={{
                        flex: '1',
                        minWidth: '250px',
                        background: 'linear-gradient(to bottom right, #f8fafd, #ffffff)',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '1px solid #e0e7ff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <FaFileAlt style={{ color: '#2563eb', marginRight: '8px' }} />
                            <h6 style={{ fontWeight: '600' }}>All Incidents</h6>
                        </div>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>Total reported incidents</p>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb', marginTop: '10px' }}>5</div>
                    </div>

                    {/* Open Incidents */}
                    <div style={{
                        flex: '1',
                        minWidth: '250px',
                        background: 'linear-gradient(to bottom right, #fffbea, #ffffff)',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '1px solid #fef3c7',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <FaExclamationTriangle style={{ color: '#f59e0b', marginRight: '8px' }} />
                            <h6 style={{ fontWeight: '600' }}>Open Incidents</h6>
                        </div>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>Requiring attention</p>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d97706', marginTop: '10px' }}>3</div>
                    </div>

                    {/* High Priority */}
                    <div style={{
                        flex: '1',
                        minWidth: '250px',
                        background: 'linear-gradient(to bottom right, #fff1f2, #ffffff)',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '1px solid #fecaca',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <MdPriorityHigh style={{ color: '#dc2626', marginRight: '8px' }} />
                            <h6 style={{ fontWeight: '600' }}>High Priority</h6>
                        </div>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>Critical incidents</p>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc2626', marginTop: '10px' }}>2</div>
                    </div>

                    <div className="container">
                        {/* Search Box */}
                        <div style={{
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            padding: '10px 15px',
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px',
                            background: '#F9FAFB'
                        }}>
                            <FiSearch style={{ color: '#9CA3AF', fontSize: '18px', marginRight: '10px' }} />
                            <input type="text" placeholder="Search incidents..." style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                background: 'transparent',
                                fontSize: '15px'
                            }} />
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '0px',
                            marginBottom: '20px',
                            backgroundColor: '#6B7280',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            width: 'fit-content',
                            padding: '2px'
                        }}>
                            {['all', 'open', 'high', 'resolved'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '6px 16px',
                                        backgroundColor: activeTab === tab ? '#FFFFFF' : 'transparent',
                                        color: tab === 'high'
                                            ? '#DC2626'
                                            : activeTab === tab ? '#111827' : '#D1D5DB',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        border: 'none',
                                        borderRadius: tab === 'all' ? '8px 0 0 8px' : tab === 'resolved' ? '0 8px 8px 0' : '0',
                                        boxShadow: activeTab === tab ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {tab === 'all' && 'All Incidents'}
                                    {tab === 'open' && 'Open (2)'}
                                    {tab === 'high' && 'High Priority (1)'}
                                    {tab === 'resolved' && 'Resolved (2)'}
                                </button>
                            ))}
                        </div>

                        {/* Table */}
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: '#6B7280', fontSize: '14px' }}>
                                    <th style={{ padding: '12px 10px' }}>Title</th>
                                    <th style={{ padding: '12px 10px' }}>Location</th>
                                    <th style={{ padding: '12px 10px' }}>Severity</th>
                                    <th style={{ padding: '12px 10px' }}>Reported</th>
                                    <th style={{ padding: '12px 10px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '15px', color: '#111827' }}>
                                {filteredData.map(row => (
                                    <tr key={row.id} style={{ borderTop: '1px solid #E5E7EB' }}>
                                        <td style={{ padding: '15px 10px' }}>
                                            {row.icon}
                                            {row.title} <br />
                                            <span style={{ color: '#6B7280', fontSize: '13px' }}>By: {row.by}</span>
                                        </td>
                                        <td style={{ padding: '15px 10px' }}>{row.location}</td>
                                        <td style={{ padding: '15px 10px' }}>
                                            {row.severity}
                                        </td>
                                        <td style={{ padding: '15px 10px' }}>{row.reported}</td>
                                        <td style={{ padding: '15px 10px' }}>{row.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </>
    )
}

export default Incident;
