import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import TimezoneSelect from 'react-timezone-select';

const cellStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    whiteSpace: 'nowrap'
};

function PayroleUser() {
    const [loading, setLoading] = useState(false);
    const [submittedUsers, setSubmittedUsers] = useState([]);
    const [User_ID_for_add, setUser_ID_for_add] = useState('');
    const [editUser, setEditUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedPayrollData, setSelectedPayrollData] = useState(null);
    const [loadingUserId, setLoadingUserId] = useState(null);
    const [appliedTaxes, setAppliedTaxes] = useState([]);
    const [appliedDeductions, setAppliedDeductions] = useState([]);
    const token = localStorage.getItem('token');
    const user = jwtDecode(JSON.stringify(token));
    const headers = { Authorization: `Bearer ${token}` };
    const apiUrlS = process.env.REACT_APP_API_URL;
    // const apiUrl = process.env.REACT_APP_API_URL;


    const fetchUsers = async () => {
        setLoading(true); // Start loader
        try {
            const res = await axios.get(`${apiUrlS}/owner/getPayrolUsers`, { headers });
            setSubmittedUsers(res.data.data);
        } catch (err) {
            console.error('Failed to fetch payroll users:', err);
        } finally {
            setLoading(false); // End loader
        }
    };

    const handleViewPayrollData = async (userId) => {
        setLoadingUserId(userId);
        setUser_ID_for_add(userId)
        try {
            const res = await axios.get(`${apiUrlS}/owner/payrolData/${userId}/get`, { headers });

            let data = res.data;

            // Ensure structure and sanitize missing values
            if (!Array.isArray(data?.data?.entries)) {
                data.data = {
                    entries: [{
                        startDate: new Date(),
                        endDate: new Date(),
                        totalHours: 0,
                        overtimeHours: 0,
                        shiftPremiumHours: 0
                    }]
                };
            } else {
                data.data.entries = data.data.entries.map(entry => ({
                    ...entry,
                    totalHours: entry.totalHours ?? 0,
                    overtimeHours: entry.overtimeHours ?? 0,
                    shiftPremiumHours: entry.shiftPremiumHours ?? 0
                }));
            }

            setSelectedPayrollData(data);
            setViewModalOpen(true);
        } catch (err) {
            console.error('Failed to fetch payroll data:', err);

            // fallback: create default empty entry
            const fallbackData = {
                name: 'Unknown User',
                data: {
                    entries: [{
                        startDate: new Date(),
                        endDate: new Date(),
                        totalHours: 0,
                        overtimeHours: 0,
                        shiftPremiumHours: 0
                    }]
                }
            };

            setSelectedPayrollData(fallbackData);
            setViewModalOpen(true);
        } finally {
            setLoadingUserId(null);
        }
    };



    const handleAddPayrollEntry = async () => {
        const start = document.getElementById('newStartDate').value;
        const end = document.getElementById('newEndDate').value;
        const total = parseFloat(document.getElementById('newTotalHours').value) || 0;
        const ot = parseFloat(document.getElementById('newOvertimeHours').value) || 0;
        const shift = parseFloat(document.getElementById('newShiftPremiumHours').value) || 0;

        if (!start || !end) {
            alert('Please provide both start and end dates.');
            return;
        }

        const payload = {
            userId: User_ID_for_add, // must exist in your selectedPayrollData
            startDate: new Date(start),
            endDate: new Date(end),
            totalHours: total,
            overtimeHours: ot,
            shiftPremiumHours: shift
        };
        console.log('pauload', User_ID_for_add)

        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const res = await axios.post(
                `${apiUrlS}/owner/addPayrolData`,
                payload,
                { headers }
            );

            if (res.data.success) {
                alert('✅ Entry added successfully.');

                // Update local state (optional)
                setSelectedPayrollData(prev => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        entries: [...prev.data.entries, payload]
                    }
                }));

                // Clear inputs
                document.getElementById('newStartDate').value = '';
                document.getElementById('newEndDate').value = '';
                document.getElementById('newTotalHours').value = '';
                document.getElementById('newOvertimeHours').value = '';
                document.getElementById('newShiftPremiumHours').value = '';
            } else {
                alert('❌ Failed to add entry.');
            }
        } catch (err) {
            console.error('API error:', err);
            alert('❌ Server error. Please try again.');
        }
    };


    const handleUpdateUser = async () => {
        console.log('Updating user ID:', editUser.userId);
        // ✅ Format dates before building payload
        if (!editUser.name || !editUser.email || !editUser.timezone || !editUser.pay_type || !editUser.payPeriodType) {
            enqueueSnackbar("Please fill all required fields.", {
                variant: "warning",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
            return;
        }

        try {
            const payload = {
                name: editUser.name,
                email: editUser.email,
                timezone: editUser.timezone,
                timezoneOffset: editUser.timezoneOffset,
                payPeriodType: editUser.payPeriodType,
                shiftPremiumRate: parseFloat(editUser.billingInfo?.shiftPremiumRate || editUser.shiftPremiumRate || 0),
                overtimeRate: parseFloat(editUser.billingInfo?.overtimeRate || editUser.overtimeRate || 0),
                hourlyRate: parseFloat(editUser.billingInfo?.ratePerHour || editUser.hourlyRate || 0),
                appliedTaxCountry: editUser.appliedTaxCountry,
                appliedTaxState: editUser.appliedTaxState,
                vacationPay: parseFloat(editUser.vacationPay),
                pay_type: editUser.pay_type,
                currency: editUser.billingInfo?.currency,
                totalHours: parseFloat(editUser.totalHours || 0),

                // ✅ Add these two
                appliedTaxes: appliedTaxes,             // e.g., ["incomeTax", "eobi"]
                appliedDeductions: appliedDeductions    // e.g., ["eobi"]
            };


            const res = await axios.patch(
                `${apiUrlS}/owner/updatepayrolUser/${editUser.userId}`,
                payload,
                { headers }
            );

            // ✅ Show backend message on success
            if (res.data.success) {
                enqueueSnackbar(res.data.message || "✅ User updated successfully.", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });


                setShowModal(false);
                setEditUser(null);

                // Refresh the updated list from server
                const refreshed = await axios.get(
                    `${apiUrlS}/owner/getPayrolUsers`,
                    { headers }
                );
                setSubmittedUsers(refreshed.data.data);
            }
            else {
                enqueueSnackbar("❌ Something went wrong during update.", {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });
            }
        } catch (error) {
            console.error("❌ Update failed:", error?.response?.data || error.message);

            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "❌ Failed to update user.";

            enqueueSnackbar(errorMessage, {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        }
    };

    const usStateNameToCode = {
        "Alabama": "(AL)", "Alaska": "(AK)", "Arizona": "(AZ)", "Arkansas": "(AR)",
        "California": "(CA)", "Colorado": "(CO)", "Connecticut": "(CT)", "Delaware": "(DE)",
        "District of Columbia": "(DC)", "Florida": "(FL)", "Georgia": "(GA)", "Hawaii": "(HI)",
        "Idaho": "(ID)", "Illinois": "(IL)", "Indiana": "(IN)", "Iowa": "(IA)", "Kansas": "(KS)",
        "Kentucky": "(KY)", "Louisiana": "(LA)", "Maine": "(ME)", "Maryland": "(MD)",
        "Massachusetts": "(MA)", "Michigan": "(MI)", "Minnesota": "(MN)", "Mississippi": "(MS)",
        "Missouri": "(MO)", "Montana": "(MT)", "Nebraska": "(NE)", "Nevada": "(NV)",
        "New Hampshire": "(NH)", "New Jersey": "(NJ)", "New Mexico": "(NM)", "New York": "(NY)",
        "North Carolina": "(NC)", "North Dakota": "(ND)", "Ohio": "(OH)", "Oklahoma": "(OK)",
        "Oregon": "(OR)", "Pennsylvania": "(PA)", "Rhode Island": "(RI)", "South Carolina": "(SC)",
        "South Dakota": "(SD)", "Tennessee": "(TN)", "Texas": "(TX)", "Utah": "(UT)",
        "Vermont": "(VT)", "Virginia": "(VA)", "Washington": "(WA)", "West Virginia": "(WV)",
        "Wisconsin": "(WI)", "Wyoming": "(WY)"
    };

    const countryStateMap = {
        canada: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Nova Scotia", "Ontario"],
        usa: Object.keys(usStateNameToCode),
        india: ["Maharashtra", "Punjab", "Gujarat", "Kerala"]
    };

    const taxDeductionMap = {
        canada: {
            taxes: ["federal", "provincial"],
            deductions: ["cpp", "ei"]
        },
        india: {
            taxes: ["incomeTax", "cess", "professionalTax"],
            deductions: ["epf", "esi"]
        },
        usa: {
            taxes: ["federal", "socialSecurity", "medicare", "state"],
            deductions: [""]
        },
        Philippines: {
            taxes: ["incomeTax"],
            deductions: ["sss", "philHealth", "pagIbig"]
        },
        pakistan: {
            taxes: ["incomeTax"],
            deductions: ["eobi"]
        },
        ksa: {
            taxes: ["incomeTax", "zakat"],
            deductions: ["gosi"]
        }
    };

    useEffect(() => {
        if (editUser) {
            setAppliedTaxes(editUser.appliedTaxes || []);
            setAppliedDeductions(editUser.appliedDeductions || []);
        }
    }, [editUser]);


    useEffect(() => {
        fetchUsers();
    }, []);
    const countryCurrencyMap = {
        canada: 'CAD',
        usa: 'USD',
        pakistan: 'PKR',
        Philippines: 'PHP',
        india: 'INR',
        ksa: 'SAR'
    };


    return (
        <>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader ">
                    <h5>Pay Stubs</h5>
                </div>

                <div className="mainwrapper">
                    <div className="ownerTeamContainer">

                        <h4>📋 Payroll Employees</h4>
                        {loading ? (
                            <div style={{ textAlign: "center", marginTop: "40px" }}>
                                <div
                                    style={{
                                        border: "6px solid #f3f3f3",
                                        borderTop: "6px solid #7fc45a",
                                        borderRadius: "50%",
                                        width: "40px",
                                        height: "40px",
                                        animation: "spin 1s linear infinite",
                                        margin: "0 auto"
                                    }}
                                />
                                <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
                                    Loading payroll Users...
                                </p>
                                <style>
                                    {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
                                </style>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                                <table style={{ minWidth: '1300px', width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: '#f4f6f8', fontWeight: 'bold' }}>
                                        <tr>
                                            <th style={cellStyle}>Name</th>
                                            <th style={cellStyle}>Email</th>
                                            <th style={cellStyle}>Pay Period</th>
                                            <th style={cellStyle}>Payrate</th>
                                            <th style={cellStyle}>OT Rate</th>
                                            <th style={cellStyle}>Shift Premium </th>
                                            <th style={cellStyle}>Tax Country</th>
                                            <th style={cellStyle}>Tax State</th>
                                            <th style={cellStyle}>Pay Type</th>
                                            <th style={cellStyle}>Currency</th>
                                            <th style={cellStyle}>Timezone</th>
                                            <th style={cellStyle}>View</th>
                                            <th style={cellStyle}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submittedUsers.map((user, index) => (
                                            <tr key={index}>
                                                <td style={cellStyle}>{user.name}</td>
                                                <td style={cellStyle}>{user.email}</td>
                                                <td style={cellStyle}>{user.payPeriodType}</td>
                                                <td style={cellStyle}>{user.billingInfo?.ratePerHour ?? '-'}</td>
                                                <td style={cellStyle}>{user.billingInfo?.overtimeRate ?? '-'}</td>
                                                <td style={cellStyle}>{user.billingInfo?.shiftPremiumRate ?? '-'}</td>
                                                <td style={cellStyle}>{user.appliedTaxCountry}</td>
                                                <td style={cellStyle}>{user.appliedTaxState}</td>
                                                <td style={cellStyle}>{user.billingInfo?.payType}</td>
                                                <td style={cellStyle}>{user.billingInfo?.currency}</td>
                                                <td style={cellStyle}>{user.timezone}</td>
                                                <td style={cellStyle}>
                                                    <button
                                                        onClick={() => handleViewPayrollData(user.userId)}
                                                        title="View and edit payroll records"
                                                        style={{
                                                            padding: '4px 10px',
                                                            fontSize: '12px',
                                                            backgroundColor: '#28a745',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px'
                                                        }}
                                                    >
                                                        {loadingUserId === user.userId ? (
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                        ) : (
                                                            'View & Edit'
                                                        )}
                                                    </button>


                                                </td>
                                                <td style={cellStyle}>
                                                    <button
                                                        onClick={() => {
                                                            setEditUser(user);
                                                            setAppliedTaxes(user.appliedTaxes || []);             // ✅ Set immediately
                                                            setAppliedDeductions(user.appliedDeductions || []);   // ✅ Set immediately
                                                            console.log('editUser in modal:', user);
                                                            setShowModal(true);
                                                        }}
                                                        style={{ padding: '4px 10px', fontSize: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                    >
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}


                        {viewModalOpen && selectedPayrollData && (
                            <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
                                <div className="modal-dialog modal-lg" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Payroll Data — {selectedPayrollData.name}</h5>
                                            <button type="button" className="btn-close" onClick={() => setViewModalOpen(false)}></button>
                                        </div>

                                        <div className="modal-body">
                                            {/* Table of Entries */}
                                            <table className="table table-bordered">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Date Range</th>
                                                        <th>Total Hours</th>
                                                        <th>Overtime Hours</th>
                                                        <th>Shift Premium Hours</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedPayrollData.data.entries?.map((entry, idx) => {
                                                        const formatDate = (dateStr) => {
                                                            const date = new Date(dateStr);
                                                            const mm = String(date.getMonth() + 1).padStart(2, '0');
                                                            const dd = String(date.getDate()).padStart(2, '0');
                                                            const yyyy = date.getFullYear();
                                                            return `${mm}/${dd}/${yyyy}`;
                                                        };
                                                        return (
                                                            <tr key={idx}>
                                                                <td>{formatDate(entry.startDate)} - {formatDate(entry.endDate)}</td>
                                                                <td>{entry.totalHours}</td>
                                                                <td>{entry.overtimeHours}</td>
                                                                <td>{entry.shiftPremiumHours}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>

                                            {/* Add Entry Section */}
                                            <div className="mt-4 p-3 border rounded shadow-sm bg-light">
                                                <h5 className="mb-3 d-flex align-items-center">
                                                    <i className="bi bi-plus-circle me-2" style={{ fontSize: '1.3rem', color: '#0d6efd' }}></i>
                                                    Add New Payroll Entry
                                                </h5>

                                                <div className="row g-3">
                                                    <div className="col-md-3">
                                                        <label className="form-label fw-semibold" style={{ fontSize: '15px' }}>Start Date</label>
                                                        <input type="date" className="form-control" id="newStartDate" style={{ fontSize: '14px' }} />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="form-label fw-semibold" style={{ fontSize: '15px' }}>End Date</label>
                                                        <input type="date" className="form-control" id="newEndDate" style={{ fontSize: '14px' }} />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label className="form-label fw-semibold" style={{ fontSize: '15px' }}>Total Hours</label>
                                                        <input type="number" min="0" className="form-control" id="newTotalHours" style={{ fontSize: '14px' }} />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label className="form-label fw-semibold" style={{ fontSize: '15px' }}>OT Hours</label>
                                                        <input type="number" min="0" className="form-control" id="newOvertimeHours" style={{ fontSize: '14px' }} />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <label className="form-label fw-semibold" style={{ fontSize: '15px' }}>Shift Premium</label>
                                                        <input type="number" min="0" className="form-control" id="newShiftPremiumHours" style={{ fontSize: '14px' }} />
                                                    </div>
                                                </div>

                                                <div className="d-flex justify-content-end mt-4">
                                                    <button
                                                        className="btn btn-primary d-inline-flex align-items-center gap-2"
                                                        style={{
                                                            fontWeight: '500',
                                                            padding: '8px 20px',
                                                            fontSize: '15px',
                                                            borderRadius: '6px',
                                                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                                                        }}
                                                        onClick={handleAddPayrollEntry}
                                                    >
                                                        <i className="bi bi-plus-lg" style={{ fontWeight: 'bold' }}></i> Add Entry
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-footer">
                                            <button className="btn btn-secondary" onClick={() => setViewModalOpen(false)}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                        {showModal && editUser && (
                            <div className="modal d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog modal-lg" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Update Employee</h5>
                                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Name</label>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        value={editUser.name || ''}
                                                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Email</label>
                                                    <input
                                                        className="form-control"
                                                        type="email"
                                                        value={editUser.email || ''}
                                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Pay Period</label>
                                                    <select
                                                        className="form-select"
                                                        value={editUser.payPeriodType || ''}
                                                        onChange={(e) => {
                                                            const selected = e.target.value;
                                                            let resetPayType = editUser.pay_type;

                                                            // Clear incompatible pay type
                                                            if (["weekly", "biweekly"].includes(selected) && resetPayType !== "hourly") {
                                                                resetPayType = "";
                                                            }
                                                            if (selected === "monthly" && resetPayType !== "monthly") {
                                                                resetPayType = "";
                                                            }

                                                            setEditUser({
                                                                ...editUser,
                                                                payPeriodType: selected,
                                                                pay_type: resetPayType
                                                            });
                                                        }}
                                                    >
                                                        <option value="">Select Period</option>

                                                        {(!editUser.pay_type || editUser.pay_type === "hourly") && (
                                                            <>
                                                                <option value="weekly">Weekly</option>
                                                                <option value="biweekly">Bi-Weekly</option>
                                                            </>
                                                        )}

                                                        {(!editUser.pay_type || editUser.pay_type === "monthly") && (
                                                            <option value="monthly">Monthly</option>
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Applied Tax Country</label>
                                                    <select
                                                        className="form-select"
                                                        value={editUser.appliedTaxCountry || ''}
                                                        onChange={(e) => {
                                                            const selectedCountry = e.target.value;
                                                            const defaultCurrency = countryCurrencyMap[selectedCountry] || '';

                                                            setEditUser((prev) => ({
                                                                ...prev,
                                                                appliedTaxCountry: selectedCountry,
                                                                appliedTaxState: '',
                                                                billingInfo: {
                                                                    ...prev.billingInfo,
                                                                    currency: defaultCurrency // ✅ Always update based on country
                                                                }
                                                            }));
                                                        }}
                                                    >
                                                        <option value="">Select Country</option>
                                                        <option value="canada">Canada</option>
                                                        <option value="usa">USA</option>
                                                        <option value="pakistan">Pakistan</option>
                                                        <option value="Philippines">Philippines</option>
                                                        <option value="india">India</option>
                                                        <option value="ksa">KSA</option>
                                                    </select>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Applied Tax State</label>
                                                    {["canada", "usa", "india"].includes(editUser.appliedTaxCountry) ? (
                                                        <select
                                                            className="form-select"
                                                            value={editUser.appliedTaxState || ''}
                                                            onChange={(e) => setEditUser({ ...editUser, appliedTaxState: e.target.value })}
                                                        >
                                                            <option value="">Select State</option>
                                                            {countryStateMap[editUser.appliedTaxCountry]?.map((state) => (
                                                                <option key={state} value={state}>
                                                                    {editUser.appliedTaxCountry === "usa" ? usStateNameToCode[state] || state : state}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="No State"
                                                            disabled
                                                        />
                                                    )}
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Select Timezone</label>
                                                    <TimezoneSelect
                                                        value={{ value: editUser.timezone, label: editUser.timezone }}
                                                        onChange={(tz) => {
                                                            setEditUser({
                                                                ...editUser,
                                                                timezone: tz.value,
                                                                timezoneOffset: tz.offset
                                                            });
                                                        }}
                                                        styles={{
                                                            control: (base) => ({
                                                                ...base,
                                                                minHeight: '38px',
                                                                height: '32px',
                                                                fontSize: '0.875rem',
                                                            }),
                                                            valueContainer: (base) => ({
                                                                ...base,
                                                                padding: '0 6px',
                                                                height: '32px',
                                                            }),
                                                            indicatorsContainer: (base) => ({
                                                                ...base,
                                                                height: '38px',
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Vacation Pay</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        value={editUser.vacationPay || ''}
                                                        onChange={(e) => setEditUser({ ...editUser, vacationPay: e.target.value })}
                                                        min="0"
                                                    />
                                                </div>
                                                {/* <div className="col-md-6 mb-3">
                                                    <label className="form-label">Total Hours</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        value={editUser.totalHours || ''}
                                                        onChange={(e) => setEditUser({ ...editUser, totalHours: e.target.value })}
                                                    />
                                                </div> */}
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Payrate</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        min="0"
                                                        value={editUser.billingInfo?.ratePerHour || ''}
                                                        onChange={(e) => setEditUser({
                                                            ...editUser,
                                                            billingInfo: {
                                                                ...editUser.billingInfo,
                                                                ratePerHour: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">OT Rate</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        min="0"
                                                        value={editUser.billingInfo?.overtimeRate || ''}
                                                        onChange={(e) => setEditUser({
                                                            ...editUser,
                                                            billingInfo: {
                                                                ...editUser.billingInfo,
                                                                overtimeRate: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Shift Premium Rate</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        min="0"
                                                        value={editUser.billingInfo?.shiftPremiumRate || ''}
                                                        onChange={(e) => setEditUser({
                                                            ...editUser,
                                                            billingInfo: {
                                                                ...editUser.billingInfo,
                                                                shiftPremiumRate: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Currency</label>
                                                    <select
                                                        className="form-select"
                                                        value={editUser.billingInfo?.currency || ''}
                                                        onChange={(e) => setEditUser({
                                                            ...editUser,
                                                            billingInfo: {
                                                                ...editUser.billingInfo,
                                                                currency: e.target.value
                                                            }
                                                        })}
                                                    >
                                                        <option value="">Select Currency</option>
                                                        <option value="USD">USD</option>
                                                        <option value="CAD">CAD</option>
                                                        <option value="QAR">QAR</option>
                                                        <option value="PKR">PKR</option>
                                                        <option value="SAR">SAR</option>
                                                        <option value="AED">AED</option>
                                                        <option value="PHP">PHP</option>
                                                        <option value="INR">INR</option>
                                                    </select>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Pay Type</label>
                                                    <select
                                                        className="form-select"
                                                        value={editUser.pay_type || ''}
                                                        onChange={(e) => {
                                                            const selected = e.target.value;
                                                            let resetPeriod = editUser.payPeriodType;

                                                            // Clear incompatible payPeriodType
                                                            if (selected === "hourly" && !["weekly", "biweekly"].includes(resetPeriod)) {
                                                                resetPeriod = "";
                                                            }
                                                            if (selected === "monthly" && resetPeriod !== "monthly") {
                                                                resetPeriod = "";
                                                            }

                                                            setEditUser({
                                                                ...editUser,
                                                                pay_type: selected,
                                                                payPeriodType: resetPeriod
                                                            });
                                                        }}
                                                    >
                                                        <option value="">Select Type</option>

                                                        {(!editUser.payPeriodType || ["weekly", "biweekly"].includes(editUser.payPeriodType)) && (
                                                            <option value="hourly">Hourly</option>
                                                        )}

                                                        {(!editUser.payPeriodType || editUser.payPeriodType === "monthly") && (
                                                            <option value="monthly">Monthly</option>
                                                        )}
                                                    </select>
                                                </div>
                                                {/* <div className="col-md-6 mb-3">
                                                    <label className="form-label">Start Date</label>
                                                    <input
                                                        className="form-control"
                                                        type="date"
                                                        value={editUser.startDate || ''}
                                                        onChange={(e) =>
                                                            setEditUser({ ...editUser, startDate: e.target.value })
                                                        }
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">End Date</label>
                                                    <input
                                                        className="form-control"
                                                        type="date"
                                                        value={editUser.endDate || ''}
                                                        onChange={(e) =>
                                                            setEditUser({ ...editUser, endDate: e.target.value })
                                                        }
                                                    />
                                                </div> */}


                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Applied Taxes</label>
                                                    <div className="border rounded p-2" style={{ maxHeight: 150, overflowY: "auto" }}>
                                                        {editUser.appliedTaxCountry && taxDeductionMap[editUser.appliedTaxCountry] ? (
                                                            taxDeductionMap[editUser.appliedTaxCountry].taxes.map((tax) => (
                                                                <div key={tax} className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`tax-${tax}`}
                                                                        checked={appliedTaxes.includes(tax)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setAppliedTaxes([...appliedTaxes, tax]);
                                                                            } else {
                                                                                setAppliedTaxes(appliedTaxes.filter((t) => t !== tax));
                                                                            }
                                                                        }}
                                                                    />
                                                                    <label className="form-check-label" htmlFor={`tax-${tax}`}>
                                                                        {tax}
                                                                    </label>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-muted">Select country to view taxes</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Applied Deductions</label>
                                                    <div className="border rounded p-2" style={{ maxHeight: 150, overflowY: "auto" }}>
                                                        {editUser.appliedTaxCountry === "usa" ? (
                                                            <p className="text-muted mb-2">Note: USA has no applicable deductions.</p>
                                                        ) : editUser.appliedTaxCountry && taxDeductionMap[editUser.appliedTaxCountry] ? (
                                                            taxDeductionMap[editUser.appliedTaxCountry].deductions.map((deduction) => (
                                                                <div key={deduction} className="form-check">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id={`deduction-${deduction}`}
                                                                        checked={appliedDeductions.includes(deduction)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setAppliedDeductions([...appliedDeductions, deduction]);
                                                                            } else {
                                                                                setAppliedDeductions(appliedDeductions.filter((d) => d !== deduction));
                                                                            }
                                                                        }}
                                                                    />
                                                                    <label className="form-check-label" htmlFor={`deduction-${deduction}`}>
                                                                        {deduction}
                                                                    </label>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-muted">Select country to view deductions</p>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                            <button className="btn btn-primary" onClick={handleUpdateUser}>Save Changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PayroleUser;
