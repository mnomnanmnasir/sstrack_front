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
    const [submittedUsers, setSubmittedUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedPayrollData, setSelectedPayrollData] = useState(null);
    const [loadingUserId, setLoadingUserId] = useState(null);

    const token = localStorage.getItem('token');
    const user = jwtDecode(JSON.stringify(token));
    const headers = { Authorization: `Bearer ${token}` };
    const apiUrl = 'https://myuniversallanguages.com:9093/api/v1';

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${apiUrl}/owner/getPayrolUsers`, { headers });
            setSubmittedUsers(res.data.data);
        } catch (err) {
            console.error('Failed to fetch payroll users:', err);
        }
    };

    const handleViewPayrollData = async (userId) => {
        setLoadingUserId(userId);
        try {
            const res = await axios.get(`${apiUrl}/owner/payrolData/${userId}/get`, { headers });
            setSelectedPayrollData(res.data);
            setViewModalOpen(true);
        } catch (err) {
            console.error('Failed to fetch payroll data:', err);
            alert('Record not Found');
        } finally {
            setLoadingUserId(null);
        }
    };

    const handleUpdateUser = async () => {
        console.log('Updating user ID:', editUser.userId);

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

            };

            const res = await axios.patch(
                `https://myuniversallanguages.com:9093/api/v1/owner/updatepayrolUser/${editUser.userId}`,
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
                    'https://myuniversallanguages.com:9093/api/v1/owner/getPayrolUsers',
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

    useEffect(() => {
        fetchUsers();
    }, []);
    console.log('again', submittedUsers)

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
                        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                            <table style={{ minWidth: '1300px', width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f4f6f8', fontWeight: 'bold' }}>
                                    <tr>
                                        <th style={cellStyle}>Name</th>
                                        <th style={cellStyle}>Email</th>
                                        <th style={cellStyle}>Pay Period</th>
                                        <th style={cellStyle}>Hourly Rate</th>
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
                                                    onClick={() => handleViewPayrollData(user.userId)}
                                                    disabled={!user.entries}
                                                    style={{
                                                        padding: '4px 10px',
                                                        fontSize: '12px',
                                                        backgroundColor: !user.entries ? '#ccc' : '#28a745',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: !user.entries ? 'not-allowed' : 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px'
                                                    }}
                                                >
                                                    {loadingUserId === user._id ? (
                                                        <span className="spinner-border spinner-border-sm"></span>
                                                    ) : (
                                                        'View'
                                                    )}
                                                </button>

                                            </td>
                                            <td style={cellStyle}>
                                                <button
                                                    onClick={() => {
                                                        setEditUser(user);
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
                                                            <td>{new Date(entry.startDate).toLocaleDateString()} - {new Date(entry.endDate).toLocaleDateString()}</td>
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
                                                        <option value="philiphine">Philipine</option>
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
                                                    <label className="form-label">Total Hours</label>
                                                    <input
                                                        className="form-control"
                                                        type="number"
                                                        value={editUser.totalHours || ''}
                                                        onChange={(e) => setEditUser({ ...editUser, totalHours: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Hourly Rate</label>
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default PayroleUser;
