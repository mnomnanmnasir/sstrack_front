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
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = jwtDecode(JSON.stringify(token));
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [timezoneOffset, setTimezoneOffset] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [submittedUsers, setSubmittedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [showModalupload, setShowModalupload] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
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
        "Oregon": "(OR)", "Pennsylvania": "(PA)", "Rhode Island": "(RI)",
        "South Carolina": "(SC)", "South Dakota": "(SD)", "Tennessee": "(TN)", "Texas": "(TX)",
        "Utah": "(UT)", "Vermont": "(VT)", "Virginia": "(VA)", "Washington": "(WA)",
        "West Virginia": "(WV)", "Wisconsin": "(WI)", "Wyoming": "(WY)"
    };

    const countryStateMap = {
        canada: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"],

        "usa": Object.entries(usStateNameToCode).map(([name, code]) => [code, name]),

        india: ["Maharashtra", "Karnataka", "West Bengal", "Gujarat", "Tamil Nadu", "Telangana", "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Kerala", "Punjab", "Odisha"]

    };



    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select an Excel file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(
                'https://myuniversallanguages.com:9093/api/v1/owner/payrolData/upload',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            alert(response.data.message || '✅ File uploaded successfully!');
            setShowModalupload(false);
            setSelectedFile(null);
        } catch (error) {
            console.error('❌ Upload failed:', error);
            alert(error.response?.data?.message || 'Failed to upload file.');
        }
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

    const handleDownloadTemplate = async () => {
        try {
            const response = await axios.get(
                'https://myuniversallanguages.com:9093/api/v1/owner/payrolData/template?startDate=2025-05-01&endDate=2025-05-12',
                {
                    responseType: 'blob', // Important for file
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'payroll_template.xlsx'); // or .csv based on API
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('❌ Error downloading template:', error);
            alert('Failed to download template.');
        }
    };


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
                <div
                    className="userHeader"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        // marginBottom: '1rem',
                    }}
                >
                    <h5 style={{ margin: 0 }}>Add Employees for Payroll</h5>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleDownloadTemplate}
                            style={{
                                padding: '6px 14px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Download Template
                        </button>

                        <button
                            onClick={() => setShowModalupload(true)}
                            style={{
                                padding: '6px 14px',
                                backgroundColor: '#28a745',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Upload CSV
                        </button>
                    </div>
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
                            onClick={handleSubmit}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#7ACB59',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: '600',
                                fontSize: '14px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease, transform 0.2s ease',
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#6ab64f';
                                e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#7ACB59';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            Submit Payroll User
                        </button>



                        {/* Modal */}
                        {showModalupload && (
                            <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Upload Payroll Excel</h5>
                                            <button className="btn-close" onClick={() => setShowModal(false)}></button>
                                        </div>
                                        <div className="modal-body">
                                            <input
                                                type="file"
                                                accept=".xlsx"
                                                className="form-control"
                                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                            />
                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                            <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
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
