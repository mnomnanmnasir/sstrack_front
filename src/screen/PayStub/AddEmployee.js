<<<<<<< HEAD
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import TimezoneSelect from 'react-timezone-select';

function AddEmployee() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        timezone: '',
        timezoneOffset: '',
        payPeriodType: '',
        shiftPremiumRate: '',
        overtimeRate: '',
        hourlyRate: '',
        appliedTaxCountry: '',
        appliedTaxState: '',
        vacationPay: '',
        pay_type: '',
        currency: ''
    });
    const [users, setUsers] = useState([]);

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
        "Oregon": "(OR)", "Pennsylvania": "(PA)", "Rhode Island": "(RI)",
        "South Carolina": "(SC)", "South Dakota": "(SD)", "Tennessee": "(TN)", "Texas": "(TX)",
        "Utah": "(UT)", "Vermont": "(VT)", "Virginia": "(VA)", "Washington": "(WA)",
        "West Virginia": "(WV)", "Wisconsin": "(WI)", "Wyoming": "(WY)"
    };

    const countryStateMap = {
        canada: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"],
        // "usa": Object.keys(usStateNameToCode), // <- Only use full names in dropdown
        "usa": Object.entries(usStateNameToCode).map(([name, code]) => [code, name]),
        // Pakistan: ["Punjab", "Sindh", "KPK", "Balochistan"],
        // Philiphines: ["Metro Manila", "Cebu", "Davao", "Laguna"],
        india: ["Maharashtra", "Karnataka", "West Bengal", "Gujarat", "Tamil Nadu", "Telangana", "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Kerala", "Punjab", "Odisha"]
        // "Saudia Arabia": ["Riyadh", "Jeddah", "Dammam", "Mecca"],
    };

    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);

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
                `https://myuniversallanguages.com:9093/api/v1/owner/updatepayrolUser/${editUser._id}`,
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

    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [timezoneOffset, setTimezoneOffset] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [submittedUsers, setSubmittedUsers] = useState([]);

    const handleTimezoneChange = (tz) => {
        setTimezone(tz);
        setFormData(prev => ({
            ...prev,
            timezone: tz.value,
            timezoneOffset: tz.offset
        }));
    };

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = jwtDecode(JSON.stringify(token));
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                'https://myuniversallanguages.com:9093/api/v1/owner/addPayrolUsers',
                formData,
                { headers }
            );

            if (response.status === 200 || response.status === 201) {
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });

                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    timezone: '',
                    timezoneOffset: '',
                    payPeriodType: '',
                    shiftPremiumRate: '',
                    overtimeRate: '',
                    hourlyRate: '',
                    appliedTaxCountry: '',
                    appliedTaxState: '',
                    vacationPay: '',
                    pay_type: '',
                    currency: ''
                });

                // Add the new user with billingInfo structure
                const newUser = {
                    ...formData,
                    billingInfo: {
                        ratePerHour: formData.hourlyRate,
                        shiftPremiumRate: formData.shiftPremiumRate,
                        overtimeRate: formData.overtimeRate,
                        currency: formData.currency,
                        payType: formData.pay_type
                    }
                };

                setSubmittedUsers(prev => [...prev, newUser]);
            }
        } catch (error) {
            console.error("❌ Failed to add payroll user:", error.response?.data || error.message);
            enqueueSnackbar("❌ Something went wrong!", { variant: "error" });
        }
    };


    // const fetchUsers = async () => {
    //     try {
    //         const res = await axios.get('https://myuniversallanguages.com:9093/api/v1/owner/getPayrolUsers', { headers });
    //         setUsers(res.data.data);
    //     } catch (err) {
    //         enqueueSnackbar("Error fetching users.", { variant: 'error' });
    //     }
    // };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('https://myuniversallanguages.com:9093/api/v1/owner/getPayrolUsers', {
                    headers
                });
                setSubmittedUsers(res.data.data); // assuming the data array is in `data.data`
            } catch (err) {
                console.error('Failed to fetch payroll users:', err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader ">
                    <h5>Add Employees</h5>
                </div>

                <div className="mainwrapper">
                    <div className="ownerTeamContainer">

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Name"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Email"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Pay Period Type</label>
                                <select
                                    name="payPeriodType"
                                    value={formData.payPeriodType}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Select Period</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="biweekly">Bi-Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Shift Premium Rate</label>
                                <input
                                    type="number"
                                    name="shiftPremiumRate"
                                    value={formData.shiftPremiumRate}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Shift Premium Rate"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Overtime Rate</label>
                                <input
                                    type="number"
                                    name="overtimeRate"
                                    value={formData.overtimeRate}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Overtime Rate"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Hourly Rate</label>
                                <input
                                    type="number"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Hourly Rate"
                                />
                            </div>

                            {/* <input
                                    type="text"
                                    name="appliedTaxCountry"
                                    value={formData.appliedTaxCountry}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Tax Country"
                                /> */}
                            {/* <div className="col-md-4 mb-3">
                                <label className="form-label">Applied Tax Country</label>
                                <select
                                    name="appliedTaxCountry"
                                    value={formData.appliedTaxCountry}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Select Country</option>
                                    <option value="canada">Canada</option>
                                    <option value="usa">USA</option>
                                    <option value="pakistan">Pakistan</option>
                                    <option value="philiphine">Philipine</option>
                                    <option value="india">india</option>
                                    <option value="ksa">ksa</option>
                                </select>
                            </div> */}
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Applied Tax Country</label>
                                <select
                                    name="appliedTaxCountry"   // ✅ ADD THIS LINE
                                    className="form-control"
                                    value={formData.appliedTaxCountry}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Country</option>
                                    <option value="canada">Canada</option>
                                    <option value="usa">USA</option>
                                    <option value="pakistan">Pakistan</option>
                                    <option value="philiphine">Philipine</option>
                                    <option value="india">india</option>
                                    <option value="ksa">ksa</option>
                                </select>
                            </div>
                            {/* <div className="col-md-4 mb-3">
                                <label className="form-label">Applied Tax State</label>
                                <input
                                    type="text"
                                    name="appliedTaxState"
                                    value={formData.appliedTaxState}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Tax State"
                                />
                            </div> */}

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Applied Tax State</label>
                                {["canada", "usa", "india"].includes(formData.appliedTaxCountry) ? (
                                    <select
                                        name="appliedTaxState"   // ✅ ADD THIS LINE
                                        className="form-control"
                                        value={formData.appliedTaxState}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select State</option>
                                        {countryStateMap[formData.appliedTaxCountry]?.map((state) => (
                                            <option key={state} value={state}>
                                                {formData.appliedTaxCountry === "usa" ? usStateNameToCode[state] || state : state}
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

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Vacation Pay</label>
                                <input
                                    type="number"
                                    name="vacationPay"
                                    value={formData.vacationPay}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Vacation Pay"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Pay Type</label>
                                <select
                                    name="pay_type"
                                    value={formData.pay_type}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Select Pay Type</option>
                                    <option value="hourly">Hourly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Currency</label>
                                <input
                                    type="text"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Currency"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Select Timezone</label>
                                {/* <div style={{ border: '1px solid #ced4da', borderRadius: '.25rem', padding: '2px 6px', minHeight: '32px', fontSize: '0.875rem' }}> */}
                                <TimezoneSelect
                                    value={timezone}
                                    onChange={(tz) => {
                                        setTimezone(tz);
                                        setFormData((prev) => ({
                                            ...prev,
                                            timezone: tz.value,
                                            timezoneOffset: tz.offset,
                                        }));
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
                                {/* </div> */}
                            </div>
                        </div>

                        <button
                            className="btn mt-2"
                            style={{

                            }}
                            onClick={handleSubmit}
                        >
                            Submit Payroll User
                        </button>

                        {submittedUsers.length > 0 && (
                            <div className="mt-5">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Pay Period</th>
                                                <th>Hourly Rate</th>
                                                <th>OT Rate</th>
                                                <th>Shift Premium</th>
                                                <th>Tax Country</th>
                                                <th>Tax State</th>
                                                <th>Pay Type</th>
                                                <th>Currency</th>
                                                <th>Timezone</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submittedUsers.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.payPeriodType}</td>
                                                    <td>{user.billingInfo?.ratePerHour ?? '-'}</td>
                                                    <td>{user.billingInfo?.overtimeRate ?? '-'}</td>
                                                    <td>{user.billingInfo?.shiftPremiumRate ?? '-'}</td>
                                                    <td>{user.appliedTaxCountry}</td>
                                                    <td>{user.appliedTaxState}</td>
                                                    <td>{user.billingInfo?.payType}</td>
                                                    <td>{user.billingInfo?.currency}</td>
                                                    <td>{user.timezone}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => {
                                                                setEditUser(user);
                                                                setShowModal(true);
                                                            }}
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
            </div >

        </>
    );
}

export default AddEmployee;
=======
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import TimezoneSelect from 'react-timezone-select';

function AddEmployee() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        timezone: '',
        timezoneOffset: '',
        payPeriodType: '',
        shiftPremiumRate: '',
        overtimeRate: '',
        hourlyRate: '',
        appliedTaxCountry: '',
        appliedTaxState: '',
        vacationPay: '',
        pay_type: '',
        currency: ''
    });
    const [users, setUsers] = useState([]);

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
        "Oregon": "(OR)", "Pennsylvania": "(PA)", "Rhode Island": "(RI)",
        "South Carolina": "(SC)", "South Dakota": "(SD)", "Tennessee": "(TN)", "Texas": "(TX)",
        "Utah": "(UT)", "Vermont": "(VT)", "Virginia": "(VA)", "Washington": "(WA)",
        "West Virginia": "(WV)", "Wisconsin": "(WI)", "Wyoming": "(WY)"
    };

    const countryStateMap = {
        canada: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"],
        // "usa": Object.keys(usStateNameToCode), // <- Only use full names in dropdown
        "usa": Object.entries(usStateNameToCode).map(([name, code]) => [code, name]),
        // Pakistan: ["Punjab", "Sindh", "KPK", "Balochistan"],
        // Philiphines: ["Metro Manila", "Cebu", "Davao", "Laguna"],
        india: ["Maharashtra", "Karnataka", "West Bengal", "Gujarat", "Tamil Nadu", "Telangana", "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Kerala", "Punjab", "Odisha"]
        // "Saudia Arabia": ["Riyadh", "Jeddah", "Dammam", "Mecca"],
    };

    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [timezoneOffset, setTimezoneOffset] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [submittedUsers, setSubmittedUsers] = useState([]);

    const handleTimezoneChange = (tz) => {
        setTimezone(tz);
        setFormData(prev => ({
            ...prev,
            timezone: tz.value,
            timezoneOffset: tz.offset
        }));
    };

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = jwtDecode(JSON.stringify(token));
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                'https://myuniversallanguages.com:9093/api/v1/owner/addPayrolUsers',
                formData,
                { headers }
            );

            if (response.status === 200 || response.status === 201) {
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });

                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    timezone: '',
                    timezoneOffset: '',
                    payPeriodType: '',
                    shiftPremiumRate: '',
                    overtimeRate: '',
                    hourlyRate: '',
                    appliedTaxCountry: '',
                    appliedTaxState: '',
                    vacationPay: '',
                    pay_type: '',
                    currency: ''
                });

                // Add the new user with billingInfo structure
                const newUser = {
                    ...formData,
                    billingInfo: {
                        ratePerHour: formData.hourlyRate,
                        shiftPremiumRate: formData.shiftPremiumRate,
                        overtimeRate: formData.overtimeRate,
                        currency: formData.currency,
                        payType: formData.pay_type
                    }
                };

                setSubmittedUsers(prev => [...prev, newUser]);
            }
        } catch (error) {
            console.error("❌ Failed to add payroll user:", error.response?.data || error.message);
            enqueueSnackbar("❌ Something went wrong!", { variant: "error" });
        }
    };


    // const fetchUsers = async () => {
    //     try {
    //         const res = await axios.get('https://myuniversallanguages.com:9093/api/v1/owner/getPayrolUsers', { headers });
    //         setUsers(res.data.data);
    //     } catch (err) {
    //         enqueueSnackbar("Error fetching users.", { variant: 'error' });
    //     }
    // };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('https://myuniversallanguages.com:9093/api/v1/owner/getPayrolUsers', {
                    headers
                });
                setSubmittedUsers(res.data.data); // assuming the data array is in `data.data`
            } catch (err) {
                console.error('Failed to fetch payroll users:', err);
            }
        };

        fetchUsers();
    }, []);

    return (
        <>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader ">
                    <h5>Add Employees</h5>
                </div>

                <div className="mainwrapper">
                    <div className="ownerTeamContainer">

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Name"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Email"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Pay Period Type</label>
                                <select
                                    name="payPeriodType"
                                    value={formData.payPeriodType}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Select Period</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="biweekly">Bi-Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Shift Premium Rate</label>
                                <input
                                    type="number"
                                    name="shiftPremiumRate"
                                    value={formData.shiftPremiumRate}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Shift Premium Rate"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Overtime Rate</label>
                                <input
                                    type="number"
                                    name="overtimeRate"
                                    value={formData.overtimeRate}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Overtime Rate"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Hourly Rate</label>
                                <input
                                    type="number"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Hourly Rate"
                                />
                            </div>

                            {/* <input
                                    type="text"
                                    name="appliedTaxCountry"
                                    value={formData.appliedTaxCountry}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Tax Country"
                                /> */}
                            {/* <div className="col-md-4 mb-3">
                                <label className="form-label">Applied Tax Country</label>
                                <select
                                    name="appliedTaxCountry"
                                    value={formData.appliedTaxCountry}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Select Country</option>
                                    <option value="canada">Canada</option>
                                    <option value="usa">USA</option>
                                    <option value="pakistan">Pakistan</option>
                                    <option value="philiphine">Philipine</option>
                                    <option value="india">india</option>
                                    <option value="ksa">ksa</option>
                                </select>
                            </div> */}
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Applied Tax Country</label>
                                <select
                                    name="appliedTaxCountry"   // ✅ ADD THIS LINE
                                    className="form-control"
                                    value={formData.appliedTaxCountry}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Country</option>
                                    <option value="canada">Canada</option>
                                    <option value="usa">USA</option>
                                    <option value="pakistan">Pakistan</option>
                                    <option value="philiphine">Philipine</option>
                                    <option value="india">india</option>
                                    <option value="ksa">ksa</option>
                                </select>
                            </div>
                            {/* <div className="col-md-4 mb-3">
                                <label className="form-label">Applied Tax State</label>
                                <input
                                    type="text"
                                    name="appliedTaxState"
                                    value={formData.appliedTaxState}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Tax State"
                                />
                            </div> */}

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Applied Tax State</label>
                                {["canada", "usa", "india"].includes(formData.appliedTaxCountry) ? (
                                    <select
                                        name="appliedTaxState"   // ✅ ADD THIS LINE
                                        className="form-control"
                                        value={formData.appliedTaxState}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select State</option>
                                        {countryStateMap[formData.appliedTaxCountry]?.map((state) => (
                                            <option key={state} value={state}>
                                                {formData.appliedTaxCountry === "usa" ? usStateNameToCode[state] || state : state}
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

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Vacation Pay</label>
                                <input
                                    type="number"
                                    name="vacationPay"
                                    value={formData.vacationPay}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Vacation Pay"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Pay Type</label>
                                <select
                                    name="pay_type"
                                    value={formData.pay_type}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Select Pay Type</option>
                                    <option value="hourly">Hourly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Currency</label>
                                <input
                                    type="text"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Currency"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Select Timezone</label>
                                {/* <div style={{ border: '1px solid #ced4da', borderRadius: '.25rem', padding: '2px 6px', minHeight: '32px', fontSize: '0.875rem' }}> */}
                                <TimezoneSelect
                                    value={timezone}
                                    onChange={(tz) => {
                                        setTimezone(tz);
                                        setFormData((prev) => ({
                                            ...prev,
                                            timezone: tz.value,
                                            timezoneOffset: tz.offset,
                                        }));
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
                                {/* </div> */}
                            </div>
                        </div>

                        <button
                            className="btn mt-2"
                            style={{

                            }}
                            onClick={handleSubmit}
                        >
                            Submit Payroll User
                        </button>

                        {submittedUsers.length > 0 && (
                            <div className="mt-5">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Pay Period</th>
                                                <th>Hourly Rate</th>
                                                <th>OT Rate</th>
                                                <th>Shift Premium</th>
                                                <th>Tax Country</th>
                                                <th>Tax State</th>
                                                <th>Pay Type</th>
                                                <th>Currency</th>
                                                <th>Timezone</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submittedUsers.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.payPeriodType}</td>
                                                    <td>{user.billingInfo?.ratePerHour ?? '-'}</td>
                                                    <td>{user.billingInfo?.overtimeRate ?? '-'}</td>
                                                    <td>{user.billingInfo?.shiftPremiumRate ?? '-'}</td>
                                                    <td>{user.appliedTaxCountry}</td>
                                                    <td>{user.appliedTaxState}</td>
                                                    <td>{user.billingInfo?.payType}</td>
                                                    <td>{user.billingInfo?.currency}</td>
                                                    <td>{user.timezone}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

        </>
    );
}

export default AddEmployee;
>>>>>>> 3502fcfa31a61dcd71a6163fc157b6ed0a4fa3c7
