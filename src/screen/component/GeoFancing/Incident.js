import React, { useState } from 'react';
import { FaFileAlt, FaExclamationTriangle } from 'react-icons/fa';
import { MdPriorityHigh } from 'react-icons/md';
import { AiOutlineWarning } from 'react-icons/ai';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { BiCheck } from 'react-icons/bi';
import { BsChevronDown } from 'react-icons/bs';


const Incident = () => {

    const [activeTab, setActiveTab] = useState('all');
    const [showModal, setShowModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    // const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const categoryOptions = ['Safety', 'Security', 'Maintenance', 'Other'];
    const severityOptions = ['Low', 'Medium', 'High'];

    const [isSeverityOpen, setIsSeverityOpen] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        setFormData((prev) => ({ ...prev, category: option }));
        setIsOpen(false); // Close dropdown after selection
    };

    const [formData, setFormData] = useState({
        title: '',
        email: '',
        location: '',
        severity: 'Medium',
        category: 'Safety',
        reporter: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log('Form Data:', formData);
        handleClose();
    };

    // ✅ STYLE OBJECTS DEFINED HERE
    const labelStyle = {
        fontWeight: 500,
        fontSize: '14px',
        marginBottom: '6px'
    };

    const inputStyle = {
        fontSize: '14px',
        padding: '10px 12px'
    };

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
    // const filteredData = activeTab === 'all'
    //     ? incidentData
    //     : incidentData.filter(item => item.tabType === activeTab);
    const filteredData = incidentData.filter(item => {
        const matchesTab = activeTab === 'all' || item.tabType === activeTab;
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.by.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <>
            <div className="container">
                <div className="userHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ fontSize: '24px', fontWeight: 'bold' }}>Incident Reports</h5>
                    <button
                        onClick={handleShow}
                        style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '10px 20px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        + Report Incident
                    </button>

                </div>


                <div className="mainwrapper ownerTeamContainer" style={{ justifyContent: "center", paddingBottom: "90px", display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

                    {/* ✅ Direct Modal Usage from react-bootstrap */}
                    <Modal show={showModal} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontWeight: '600', fontSize: '18px' }}>Report New Incident</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ padding: '24px' }}>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label style={labelStyle}>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        placeholder="Brief description of the incident"
                                        value={formData.title}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label style={labelStyle}>Email Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="email"
                                        placeholder="Detailed description of what happened"
                                        value={formData.email}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label style={labelStyle}>Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location"
                                        placeholder="Where did this happen"
                                        value={formData.location}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </Form.Group>

                                <Row className="mb-3">
                                    {/* Severity Dropdown */}
                                    <Col>
                                        <Form.Group>
                                            <Form.Label style={labelStyle}>Severity</Form.Label>
                                            <div style={{ position: 'relative' }}>
                                                <div className="border rounded-2 px-3 py-2 d-flex justify-content-between align-items-center"
                                                    onClick={() => setIsSeverityOpen(!isSeverityOpen)}
                                                    style={{
                                                        border: '1px solid #D1D5DB',
                                                        borderRadius: '6px',
                                                        background: '#fff',
                                                        fontSize: '14px',
                                                        padding: '10px 12px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {formData.severity}
                                                    <BsChevronDown className="text-muted" size={14} />
                                                </div>

                                                {isSeverityOpen && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: '42px',
                                                            left: 0,
                                                            right: 0,
                                                            zIndex: 9999,
                                                            border: '1px solid #D1D5DB',
                                                            borderRadius: '6px',
                                                            background: '#fff',
                                                            fontSize: '14px',
                                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                            maxHeight: '200px',
                                                            overflowY: 'auto'
                                                        }}
                                                    >
                                                        {severityOptions.map((option) => (
                                                            <div
                                                                key={option}
                                                                onClick={() => {
                                                                    setFormData((prev) => ({ ...prev, severity: option }));
                                                                    setIsSeverityOpen(false);
                                                                }}
                                                                style={{
                                                                    padding: '10px 12px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    backgroundColor: formData.severity === option ? '#E0F2FE' : '#fff',
                                                                    cursor: 'pointer',
                                                                    gap: '6px'
                                                                }}
                                                            >
                                                                <span style={{ width: '16px', display: 'inline-block' }}>
                                                                    {formData.severity === option && <BiCheck className="text-dark" size={16} />}
                                                                </span>
                                                                <span>{option}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label style={labelStyle}>Category</Form.Label>

                                            <div style={{ position: 'relative' }}>
                                                {/* Dropdown Header */}
                                                {/* <div */}
                                                <div className="border rounded-2 px-3 py-2 d-flex justify-content-between align-items-center"
                                                    onClick={() => setIsOpen(!isOpen)}
                                                    style={{
                                                        border: '1px solid #D1D5DB',
                                                        borderRadius: '6px',
                                                        background: '#fff',
                                                        fontSize: '14px',
                                                        padding: '10px 12px',
                                                        cursor: 'pointer',
                                                        userSelect: 'none'
                                                    }}
                                                >
                                                    {formData.category}
                                                    <BsChevronDown className="text-muted" size={14} />
                                                </div>

                                                {/* Dropdown Menu */}
                                                {isOpen && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: '42px',
                                                            left: 0,
                                                            right: 0,
                                                            zIndex: 9999,
                                                            border: '1px solid #D1D5DB',
                                                            borderRadius: '6px',
                                                            background: '#fff',
                                                            fontSize: '14px',
                                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                            maxHeight: '200px',
                                                            overflowY: 'auto'
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
                                                                    backgroundColor: formData.category === option ? '#E0F2FE' : '#fff',
                                                                    cursor: 'pointer',
                                                                    gap: '6px'
                                                                }}
                                                            >
                                                                {/* ✅ Reserve space for icon */}
                                                                <span style={{ width: '16px', display: 'inline-block' }}>
                                                                    {formData.category === option && <BiCheck className="text-dark" size={16} />}
                                                                </span>
                                                                <span>{option}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group>
                                    <Form.Label style={labelStyle}>Your Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="reporter"
                                        placeholder="Who is reporting this incident ?"
                                        value={formData.reporter}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer style={{ padding: '16px 24px' }}>
                            <Button
                                variant="light"
                                onClick={handleClose}
                                style={{
                                    border: '1px solid #d1d5db',
                                    fontSize: '14px',
                                    padding: '8px 16px'
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                style={{
                                    fontSize: '14px',
                                    padding: '8px 16px'
                                }}
                            >
                                Report Incident
                            </Button>
                        </Modal.Footer>
                    </Modal>

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
                            {/* <input type="text" placeholder="Search incidents..." style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                background: 'transparent',
                                fontSize: '15px'
                            }} /> */}
                            <input
                                type="text"
                                placeholder="Search incidents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                    background: 'transparent',
                                    fontSize: '15px'
                                }}
                            />
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
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: '#6B7280', fontSize: '14px' }}>
                                    <th style={{ padding: '8px 12px' }}>Title</th>
                                    <th style={{ padding: '8px 12px' }}>Location</th>
                                    <th style={{ padding: '8px 12px' }}>Severity</th>
                                    <th style={{ padding: '8px 12px' }}>Reported</th>
                                    <th style={{ padding: '8px 12px' }}>Status</th>
                                    <th style={{ padding: '8px 12px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '15px', color: '#111827' }}>
                                {filteredData.map(row => (
                                    <tr key={row.id} style={{
                                        background: '#fff',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                        borderRadius: '8px'
                                    }}>
                                        <td style={{ padding: '14px 12px', verticalAlign: 'top' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {row.icon}
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{row.title}</div>
                                                    <div style={{ fontSize: '13px', color: '#6B7280' }}>By: {row.by}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 12px', verticalAlign: 'top' }}>{row.location}</td>
                                        <td style={{ padding: '14px 12px', verticalAlign: 'top' }}>
                                            <span style={{
                                                fontSize: '13px',
                                                padding: '2px 10px',
                                                borderRadius: '9999px',
                                                backgroundColor: row.severity === 'High' ? '#FECACA'
                                                    : row.severity === 'Medium' ? '#FEF3C7'
                                                        : '#DBEAFE',
                                                color: row.severity === 'High' ? '#B91C1C'
                                                    : row.severity === 'Medium' ? '#B45309'
                                                        : '#2563EB',
                                                fontWeight: 500
                                            }}>
                                                {row.severity}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 12px', verticalAlign: 'top' }}>{row.reported}</td>
                                        <td style={{ padding: '14px 12px', verticalAlign: 'top' }}>
                                            <span style={{
                                                fontSize: '13px',
                                                padding: '2px 10px',
                                                borderRadius: '9999px',
                                                backgroundColor: row.status === 'Resolved' ? '#D1FAE5'
                                                    : row.status === 'Investigating' ? '#FEF3C7'
                                                        : '#DBEAFE',
                                                color: row.status === 'Resolved' ? '#059669'
                                                    : row.status === 'Investigating' ? '#B45309'
                                                        : '#2563EB',
                                                fontWeight: 500
                                            }}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 12px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                                            <button style={{
                                                padding: '6px 12px',
                                                fontSize: '13px',
                                                borderRadius: '6px',
                                                background: '#F3F4F6',
                                                border: '1px solid #E5E7EB',
                                                marginRight: '6px',
                                                cursor: 'pointer'
                                            }}>
                                                View Details
                                            </button>
                                            {(row.status !== 'Resolved') && (
                                                <button style={{
                                                    padding: '6px 12px',
                                                    fontSize: '13px',
                                                    color: '#2563EB',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                }}>
                                                    {row.status === 'Reported' ? 'Investigate' : 'Resolve'}
                                                </button>
                                            )}
                                        </td>
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
