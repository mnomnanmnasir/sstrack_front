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

function PayrollHistory() {
    const [history, setHistory] = useState([]);
    const [submittedUsers, setSubmittedUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('history');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedPayrollData, setSelectedPayrollData] = useState(null);
    const [loadingUserId, setLoadingUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = jwtDecode(JSON.stringify(token));
    const headers = { Authorization: `Bearer ${token}` };
    const apiUrl = process.env.REACT_APP_API_URL;

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




    const handleUpdateUser = async () => {
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
                currency: editUser.billingInfo?.currency
            };

            const res = await axios.patch(
                `${apiUrl}/owner/updatepayrolUser/${editUser._id}`,
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
                    `${apiUrl}/owner/getPayrolUsers`,
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




    const fetchAllStubs = async () => {
        try {
            const response = await axios.get(`${apiUrl}/owner/paystubs/getAllStubs`, { headers });
            if (Array.isArray(response.data.data)) {
                console.log('stubssss yaha heee',response.data.data)
                setHistory(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch all stubs:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${apiUrl}/owner/getPayrolUsers`, { headers });
            setSubmittedUsers(res.data.data);
            { console.log('submitted users', res.data.data) }
        } catch (err) {
            console.error('Failed to fetch payroll users:', err);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            await fetchAllStubs();
            await fetchUsers();
            setIsLoading(false);
        };

        fetchAllData();
    }, []);


    const handleViewStub = (record) => {
        
        navigate('/pay_stub_View', {
            state: {
                stub: record,
                user: record.name,
                period: record.payPeriod
            }
        });
    };

    const handleViewPayrollData = async (userId) => {
        setLoadingUserId(userId);
        try {
            const res = await axios.get(
                `${apiUrl}/owner/payrolData/${userId}/get`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSelectedPayrollData(res.data);
            setViewModalOpen(true);
        } catch (err) {
            console.error("Failed to fetch payroll data:", err);
            alert("Record not Found");
        } finally {
            setLoadingUserId(null);
        }
    };



    return (
        <>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <h5>Pay Stubs</h5>
                </div>

                <div className='mainwrapper'>
                    <div className="ownerTeamContainer">
                        {/* <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                            {['history', 'submitted'].map((tab) => {
                                const isActive = activeTab === tab;
                                const tooltip =
                                    tab === 'submitted'
                                        ? 'This shows only employees who are part of the payroll.'
                                        : 'This shows all SStrack users with history.';

                                return (
                                    <button
                                        key={tab}
                                        title={tooltip}
                                        onClick={() => setActiveTab(tab)}
                                        style={{
                                            padding: '10px 20px',
                                            border: '1px solid #7ACB59',
                                            backgroundColor: isActive ? '#7ACB59' : '#ffffff',
                                            color: isActive ? '#ffffff' : '#7ACB59',
                                            fontWeight: isActive ? 'bold' : 'normal',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            boxShadow: isActive ? '0 2px 6px rgba(0, 0, 0, 0.15)' : 'none',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {tab === 'history' ? 'SStrack Employees' : 'Payroll Employees'}
                                    </button>
                                );
                            })}
                        </div> */}





                        {activeTab === 'history' && (
                            <div style={{ marginTop: '2rem' }}>
                                <h4>🗂️ Pay Stub History</h4>

                                {isLoading ? (
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
                                            Loading payroll history...
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
                                    <div style={{
                                        overflowX: 'auto',
                                        background: '#fff',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        boxShadow: '0 0 10px rgba(0,0,0,0.05)',
                                        border: '1px solid #eee'
                                    }}>
                                        <table style={{ minWidth: '1400px', width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ background: '#f4f6f8', fontWeight: 'bold' }}>
                                                    <th style={cellStyle}>Name</th>
                                                    <th style={cellStyle}>Country</th>
                                                    <th style={cellStyle}>State</th>
                                                    <th style={cellStyle}>Frequency</th>
                                                    <th style={cellStyle}>Period</th>
                                                    <th style={cellStyle}>Total Hours</th>
                                                    <th style={cellStyle}>Gross Pay</th>
                                                    <th style={cellStyle}>Net Pay</th>
                                                    <th style={cellStyle}>Total Deductions</th>
                                                    <th style={cellStyle}>Currency</th>
                                                    <th style={cellStyle}>Generated At</th>
                                                    <th style={cellStyle}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {history.map((h, idx) => {
                                                    const currencySymbol = {
                                                        usd: '$', pkr: '₨', inr: '₹', cad: 'C$', eur: '€', gbp: '£'
                                                    }[h.currency?.toLowerCase()] || h.currency || '';

                                                    const totalDeductions = (h.taxBreakdown || []).reduce((sum, item) => sum + (item.amount || 0), 0)
                                                        + (h.totalDeductions || []).reduce((sum, item) => sum + (item.amount || 0), 0);

                                                    const rowStyle = h.payrolUser ? { backgroundColor: '#e8f8ec' } : {};

                                                    return (
                                                        <tr key={idx} style={rowStyle}>
                                                            <td style={cellStyle}>{h.name}</td>
                                                            <td style={cellStyle}>{h.country || '—'}</td>
                                                            <td style={cellStyle}>{h.state || '—'}</td>
                                                            <td style={cellStyle}>{h.payPeriod}</td>
                                                            <td style={cellStyle}>{`${h.StartDate} - ${h.EndDate}`}</td>
                                                            <td style={{ ...cellStyle, textAlign: 'right' }}>{(h.regHours + h.OTHours).toFixed(2)}</td>
                                                            <td style={{ ...cellStyle, textAlign: 'right' }}>{currencySymbol} {h.grossPay?.toFixed(2)}</td>
                                                            <td style={{ ...cellStyle, textAlign: 'right' }}>{currencySymbol} {h.netPay?.toFixed(2)}</td>
                                                            <td style={{ ...cellStyle, textAlign: 'right' }}>{currencySymbol} {totalDeductions.toFixed(2)}</td>
                                                            <td style={cellStyle}>{h.currency}</td>
                                                            <td style={cellStyle}>{new Date(h.generateDate || h.payDate).toLocaleString()}</td>
                                                            <td style={cellStyle}>
                                                                <button
                                                                    onClick={() => handleViewStub(h)}
                                                                    style={{
                                                                        padding: '4px 10px',
                                                                        fontSize: '12px',
                                                                        backgroundColor: '#007bff',
                                                                        color: '#fff',
                                                                        border: 'none',
                                                                        borderRadius: '4px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}


                        {activeTab === 'submitted' && submittedUsers.length > 0 && (
                            <div style={{ marginTop: '2rem' }}>
                                <h4>📋 Submitted Employees</h4>
                                <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                                    <table style={{ minWidth: '1300px', width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ background: '#f4f6f8', fontWeight: 'bold' }}>
                                            <tr>
                                                <th style={cellStyle}>Name</th>
                                                <th style={cellStyle}>Email</th>
                                                <th style={cellStyle}>Pay Period</th>
                                                <th style={cellStyle}>Payrate</th>
                                                <th style={cellStyle}>OT Rate</th>
                                                <th style={cellStyle}>Shift Premium</th>
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
                                                            onClick={() => handleViewPayrollData(user._id)}
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
                                                            {loadingUserId === user._id ? <span className="spinner-border spinner-border-sm"></span> : 'View'}
                                                        </button>
                                                    </td>

                                                    <td style={cellStyle}>
                                                        <button
                                                            onClick={() => {
                                                                setEditUser(user);
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
                                                        onChange={(e) => setEditUser({ ...editUser, payPeriodType: e.target.value })}
                                                    >
                                                        <option value="">Select Period</option>
                                                        <option value="weekly">Weekly</option>
                                                        <option value="biweekly">Bi-Weekly</option>
                                                        <option value="monthly">Monthly</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Applied Tax Country</label>
                                                    <select
                                                        className="form-select"
                                                        value={editUser.appliedTaxCountry || ''}
                                                        onChange={(e) => {
                                                            setEditUser({
                                                                ...editUser,
                                                                appliedTaxCountry: e.target.value,
                                                                appliedTaxState: '' // Reset state on country change
                                                            });
                                                        }}
                                                    >
                                                        <option value="">Select Country</option>
                                                        <option value="canada">Canada</option>
                                                        <option value="usa">USA</option>
                                                        <option value="pakistan">Pakistan</option>
                                                        <option value="Philippines">Philipine</option>
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
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Payrate</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
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
                                                    <label className="form-label">Shift Premium</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
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
                                                    <input
                                                        className="form-control"
                                                        value={editUser.billingInfo?.currency || ''}
                                                        onChange={(e) => setEditUser({
                                                            ...editUser,
                                                            billingInfo: {
                                                                ...editUser.billingInfo,
                                                                currency: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Pay Type</label>
                                                    <select
                                                        className="form-select"
                                                        value={editUser.pay_type || ''}
                                                        onChange={(e) => setEditUser({
                                                            ...editUser,
                                                            pay_type: e.target.value
                                                        })}
                                                    >
                                                        <option value="">Select Type</option>
                                                        <option value="hourly">Hourly</option>
                                                        <option value="monthly">Monthly</option>
                                                    </select>
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

                        {viewModalOpen && selectedPayrollData && (

                            <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
                                <div className="modal-dialog modal-lg" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Payroll Data - {selectedPayrollData.name}</h5>
                                            <button type="button" className="btn-close" onClick={() => setViewModalOpen(false)}></button>
                                        </div>
                                        <div className="modal-body">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Total Hours</th>
                                                        <th>Overtime Hours</th>
                                                        <th>Shift Premium Hours</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedPayrollData.data.entries?.map((entry, idx) => (
                                                        <tr key={idx}>
                                                            <td>
                                                                {new Date(entry.startDate).toLocaleDateString()} - {new Date(entry.endDate).toLocaleDateString()}
                                                            </td>
                                                            <td>{entry.totalHours}</td>
                                                            <td>{entry.overtimeHours}</td>
                                                            <td>{entry.shiftPremiumHours}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>

                                            </table>
                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn btn-secondary" onClick={() => setViewModalOpen(false)}>Close</button>
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

export default PayrollHistory;
