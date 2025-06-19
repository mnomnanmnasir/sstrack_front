import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import TimezoneSelect from 'react-timezone-select';
import SuccessPic from '../../images/Success.jpg'

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
    const [timezone, setTimezone] = useState('');
    const [appliedTaxes, setAppliedTaxes] = useState([]);
    const [appliedDeductions, setAppliedDeductions] = useState([]);
    const [timezoneOffset, setTimezoneOffset] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [submittedUsers, setSubmittedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [editUser, setEditUser] = useState(null);
    const [showModalupload, setShowModalupload] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const apiUrlS = process.env.REACT_APP_API_URL;
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
            setSuccessMessage('❌ Please select an Excel file to upload.');
            setShowSuccessModal(true);
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(
                `${apiUrlS}/owner/payrolData/upload`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setSuccessMessage(response.data.message || '✅ File uploaded successfully!');
            setShowSuccessModal(true);
            setShowModalupload(false);
            setSelectedFile(null);


        } catch (error) {
            console.error('❌ Upload failed:', error);
            setSuccessMessage(error.response?.data?.message || '❌ Failed to upload file.');
            setShowSuccessModal(true);
        }
    };


    const handleSubmit = async () => {
        // Basic required field validation
        const requiredFields = [
            'name',
            'email',
            'timezone',
            'timezoneOffset',
            'payPeriodType',
            'shiftPremiumRate',
            'overtimeRate',
            'hourlyRate',
            'appliedTaxCountry',
            'vacationPay',
            'pay_type',
            'currency'
        ];

        const emptyFields = requiredFields.filter(field => !formData[field]);
        if (emptyFields.length > 0) {
            enqueueSnackbar(`Please fill all required fields: ${emptyFields.join(', ')}`, {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
            return;
        }

        try {
            const payload = {
                ...formData,
                appliedTaxes,
                appliedDeductions
            };

            const response = await axios.post(
                `${apiUrlS}/owner/addPayrolUsers`,
                payload,
                { headers }
            );

            if (response.status === 200 || response.status === 201) {
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });

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

                setAppliedTaxes([]);
                setAppliedDeductions([]);

                const newUser = {
                    ...payload,
                    billingInfo: {
                        ratePerHour: formData.hourlyRate,
                        shiftPremiumRate: formData.shiftPremiumRate,
                        overtimeRate: formData.overtimeRate,
                        currency: formData.currency,
                        payType: formData.pay_type
                    }
                };

                setSubmittedUsers(prev => [...prev, newUser]);
                navigate('/PayStub_user');
            }
        } catch (error) {
            console.error("❌ Failed to add payroll user:", error.response?.data || error.message);
            enqueueSnackbar("❌ Something went wrong!", { variant: "error" });
        }
    };


    const handleDownloadTemplate = async () => {
        try {
            const response = await axios.get(
                `${apiUrlS}/owner/payrolData/template?startDate=2025-05-01&endDate=2025-05-12`,
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

    const countryCurrencyMap = {
        canada: 'CAD',
        usa: 'USD',
        pakistan: 'PKR',
        Philippines: 'PHP',
        india: 'INR',
        ksa: 'SAR'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "appliedTaxCountry") {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                currency: countryCurrencyMap[value] || "",
            }));
        } else if (name === "pay_type") {
            setFormData((prev) => {
                let resetPeriod = prev.payPeriodType;
                if (value === "hourly" && !["weekly", "biweekly"].includes(resetPeriod)) {
                    resetPeriod = "";
                }
                if (value === "monthly" && resetPeriod !== "monthly") {
                    resetPeriod = "";
                }

                return {
                    ...prev,
                    [name]: value,
                    payPeriodType: resetPeriod,
                };
            });
        } else if (name === "payPeriodType") {
            setFormData((prev) => {
                let resetPayType = prev.pay_type;
                if (["weekly", "biweekly"].includes(value) && resetPayType !== "hourly") {
                    resetPayType = "";
                }
                if (value === "monthly" && resetPayType !== "monthly") {
                    resetPayType = "";
                }

                return {
                    ...prev,
                    [name]: value,
                    pay_type: resetPayType,
                };
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
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
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${apiUrlS}/owner/getPayrolUsers`, {
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

                                    {(!formData.pay_type || formData.pay_type === "hourly") && (
                                        <>
                                            <option value="weekly">Weekly</option>
                                            <option value="biweekly">Bi-Weekly</option>
                                        </>
                                    )}

                                    {(!formData.pay_type || formData.pay_type === "monthly") && (
                                        <option value="monthly">Monthly</option>
                                    )}
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
                                    min="0"
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
                                    min="0"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Payrate</label>
                                <input
                                    type="number"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Payrate"
                                    min="0"
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
                                    <option value="Philippines">Philippines</option>
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
                                    <option value="Philippines">Philippines</option>
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
                                    min="0"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Payrate Type</label>
                                <select
                                    name="pay_type"
                                    value={formData.pay_type}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Select Payrate Type</option>

                                    {(!formData.payPeriodType || ["weekly", "biweekly"].includes(formData.payPeriodType)) && (
                                        <option value="hourly">Hourly</option>
                                    )}

                                    {(!formData.payPeriodType || formData.payPeriodType === "monthly") && (
                                        <option value="monthly">Monthly</option>
                                    )}
                                </select>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Select Currency</label>
                                <select
                                    className="form-select"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
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

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Applied Taxes</label>
                                <div className="border rounded p-2" style={{ maxHeight: 150, overflowY: "auto" }}>
                                    {formData.appliedTaxCountry && taxDeductionMap[formData.appliedTaxCountry] ? (
                                        taxDeductionMap[formData.appliedTaxCountry].taxes.map((tax) => (
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
                                    {formData.appliedTaxCountry === "usa" ? (
                                        <p className="text-muted mb-2">Note: USA has no applicable deductions.</p>
                                    ) : formData.appliedTaxCountry && taxDeductionMap[formData.appliedTaxCountry] ? (
                                        taxDeductionMap[formData.appliedTaxCountry].deductions.map((deduction) => (
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

                        <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
                            <button
                                className="btn"
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

                            <button
                                className="btn"
                                onClick={() => navigate('/PayStub_user')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
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
                                    e.target.style.backgroundColor = '#0069d9';
                                    e.target.style.transform = 'translateY(-1px)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#007bff';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                View PayStub Users
                            </button>
                        </div>




                        {/* Modal */}
                        {showModalupload && (
                            <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Upload Payroll Excel</h5>
                                            <button className="btn-close" onClick={() => setShowModalupload(false)}></button>
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
                                            <button className="btn btn-secondary" onClick={() => setShowModalupload(false)}>Cancel</button>
                                            <button className="btn btn-primary" onClick={handleUpload}>Upload</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showSuccessModal && (
                            <div
                                className="modal d-block"
                                tabIndex="-1"
                                role="dialog"
                                style={{ background: 'rgba(0,0,0,0.4)' }}
                            >
                                <div
                                    className="modal-dialog"
                                    role="document"
                                    style={{ maxWidth: '900px', width: '90%' }}
                                >
                                    <div className="modal-content text-center">
                                        <div className="modal-header">
                                            <h5 className="modal-title w-100">Status</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={() => setShowSuccessModal(false)}
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <img
                                                src={SuccessPic}
                                                alt="Success"
                                                style={{ width: '200px', marginBottom: '30px' }} // 🔥 Bigger image
                                            />
                                            <p style={{ fontSize: '18px', fontWeight: '500' }}>{successMessage}</p>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() => {
                                                    setShowSuccessModal(false);
                                                    navigate('/PayStub_user'); // Navigate on close
                                                }}
                                            >
                                                Go to See it!
                                            </button>
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
