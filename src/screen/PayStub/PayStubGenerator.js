import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { SnackbarProvider } from 'notistack';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import PayrollTable from './PayrollTable';
import PayStubs from './PayStubs';

const PayStubGenerator = () => {
    const [step, setStep] = useState(0);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [month, setMonth] = useState('');
    const [frequency, setFrequency] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedPeriodDates, setSelectedPeriodDates] = useState({ start: '', end: '' });
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showSummary, setShowSummary] = useState(false);
    const [payScheduleCounts, setPayScheduleCounts] = useState({});
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [totalGross, setTotalGross] = useState(0);
    const [employerContrib, setEmployerContrib] = useState(0);
    const [payDate, setPayDate] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = jwtDecode(JSON.stringify(token));
    const headers = { Authorization: `Bearer ${token}` };
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

    const handleNext = async () => {
        if (step === 1) {
            if (!frequency) {
                alert("Please select a pay schedule.");
                return;
            }
            try {
                setLoading(true);
                const response = await axios.get(`${apiUrl}/owner/filterUsersBypayPeriod/${frequency}`, { headers });
                if (response.data?.success) {
                    setFilteredUsers(response.data.data);
                    setStep(prev => prev + 1);
                } else {
                    console.warn("Unexpected response from filter API:", response.data);
                }
            } catch (error) {
                console.error("Error fetching filtered users:", error);
                alert("Failed to load users for selected schedule.");
            } finally {
                setLoading(false);
            }
        } else if (step === 2) {
            if (!selectedPeriodDates.start || !selectedPeriodDates.end || selectedIds.length === 0) {
                alert("Please select month, pay period and employees.");

                return;
            }
            setStep(prev => prev + 1);
        } else if (step === 3) {
            await handleGenerate();
        }
    };

    const handleViewStub = (record) => {
        console.log("Viewing stub:", record);
        navigate('/pay_stub_View', {
            state: {
                stub: record,
                user: record.name,
                period: record.payPeriod
            }
        });

        // You can also:
        // - open a modal
        // - navigate to a stub detail page
        // - trigger a PDF download
    };

    const handleBack = () => {
        if (step > 0) setStep(prev => prev - 1);
    };

    const getManagerTeam = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/manager/employees`, { headers });
            if (response.status) {
                const sorted = response.data?.convertedEmployees?.sort((a, b) => {
                    if (a.inviteStatus !== b.inviteStatus) return a.inviteStatus ? 1 : -1;
                    if (a.isArchived !== b.isArchived) return a.isArchived ? 1 : -1;
                    return 0;
                });
                setUsers(sorted);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/owner/companies`, { headers });
            if (response.status) {
                const sorted = response.data?.employees?.sort((a, b) => {
                    if (a.inviteStatus !== b.inviteStatus) return a.inviteStatus ? 1 : -1;
                    if (a.isArchived !== b.isArchived) return a.isArchived ? 1 : -1;
                    return 0;
                });
                setUsers(sorted);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllStubs = async () => {
        try {
            const response = await axios.get(`${apiUrl}/owner/paystubs/getAllStubs`, { headers });
            if (Array.isArray(response.data.data)) {
                setHistory(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch all stubs:", error);
        }
    };

    const fetchPayScheduleCounts = async () => {
        try {
            const res = await axios.get(`${apiUrl}/owner/countUsersByPayPeriodType`, { headers });
            if (res.data?.success) setPayScheduleCounts(res.data.data);
        } catch (err) {
            console.error("Failed to fetch pay period type counts:", err);
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const { start, end } = selectedPeriodDates;
            const startDate = moment(start).format("YYYY-MM-DD");
            const endDate = moment(end).format("YYYY-MM-DD");
            const res = await axios.post(
                `${apiUrl}/owner/generatePayStubs`,
                {
                    startDate,
                    endDate,
                    userIds: selectedIds,
                    country: "Philippines",
                    state: "maharashtra"
                },
                { headers }
            );
            await fetchAllStubs();
            alert('Stub generated successfully!');
            setShowSummary(true);
        } catch (error) {
            console.error("Error generating stub:", error.message);
            alert(error.message || 'Failed to generate stub.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.userType === "manager") getManagerTeam();
        else getData();
        fetchPayScheduleCounts();
        fetchAllStubs();
    }, []);

    return (
        <>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <h5>Pay Stubs</h5>
                </div>
                <div className='mainwrapper'>
                    <div className="ownerTeamContainer">
                        <div className="container p-4">
                            <h2>🧾 Pay Stub </h2>
                            {step === 0 && (
                                <>
                                    <h4 className="mb-4">🔗 Shortcuts</h4>
                                    <div className="d-flex gap-4 flex-wrap">
                                        {/* Run Payroll */}
                                        <div
                                            className="text-center border rounded p-3 shadow-sm bg-white"
                                            style={{ width: '140px', cursor: 'pointer' }}
                                            onClick={() => setStep(1)}
                                            role="button"
                                            aria-label="Run payroll"
                                        >
                                            <img
                                                src="https://img.icons8.com/fluency/48/money.png"
                                                alt="Run payroll"
                                                width="40"
                                                height="40"
                                                className="mb-2"
                                            />
                                            <div className="fw-semibold">Run payroll</div>
                                        </div>

                                        {/* Add Employee */}
                                        <div
                                            className="text-center border rounded p-3 shadow-sm bg-white"
                                            style={{ width: '140px', cursor: 'pointer' }}
                                            role="button"
                                            aria-label="Add employee"
                                            onClick={() => navigate('/team')}
                                        >
                                            <img
                                                src="https://img.icons8.com/fluency/48/add-user-group-man-man.png"
                                                alt="Add employee"
                                                width="40"
                                                height="40"
                                                className="mb-2"
                                            />
                                            <div className="fw-semibold">Add employee</div>
                                        </div>

                                        {/* Edit Payroll Items */}
                                        <div
                                            className="text-center border rounded p-3 shadow-sm bg-white"
                                            style={{ width: '140px', cursor: 'pointer' }}
                                            role="button"
                                            aria-label="Edit payroll items"
                                            onClick={() => navigate('/PayStub_history')}
                                        >
                                            <img
                                                src="https://img.icons8.com/fluency/48/edit-property.png"
                                                alt="Edit payroll items"
                                                width="40"
                                                height="40"
                                                className="mb-2"
                                            />
                                            <div className="fw-semibold">Edit payroll items</div>
                                        </div>
                                    </div>
                                </>
                            )}


                            {step === 1 && (
                                <>
                                    <h4 className="mb-4">Select a pay schedule for this payroll</h4>
                                    {["weekly", "biweekly", "monthly"].map((value, index) => {
                                        const label = value === 'weekly' ? 'Every Friday' : value === 'biweekly' ? 'Biweekly' : 'Every month';
                                        const nextPay = value === 'monthly' ? '09/05/2025' : '02/05/2025';
                                        const count = payScheduleCounts[value] || 0;
                                        return (
                                            <div key={index} onClick={() => setFrequency(value)} style={{ border: frequency === value ? '2px solid green' : '1px solid #ccc', borderRadius: '8px', padding: '12px 16px', marginBottom: '12px', cursor: 'pointer', backgroundColor: frequency === value ? '#f6fff6' : '#fff' }}>
                                                <div style={{ fontWeight: 'bold' }}>{`${label} (${count} ${count === 1 ? 'employee' : 'employees'})`}</div>
                                                <div style={{ fontSize: '14px', color: '#666' }}>Next pay date: {nextPay}</div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                            {step === 2 && (
                                <PayrollTable
                                    employees={filteredUsers}
                                    frequency={frequency}
                                    onSelectionChange={({ selectedEmployeeIds, payPeriodStart, payPeriodEnd, month, totalGross, employerContrib, payDate }) => {
                                        setSelectedIds(selectedEmployeeIds);
                                        setSelectedPeriodDates({ start: payPeriodStart, end: payPeriodEnd });
                                        setMonth(month);
                                        setTotalGross(totalGross);
                                        setEmployerContrib(employerContrib);
                                        setPayDate(payDate);
                                    }}

                                />
                            )}

                            {step === 3 && (
                                <>
                                    <h4>Step 4: Review</h4>
                                    {/* Summary Section */}
                                    {/* Payroll Cost Summary Card */}
                                    <div className="card p-3 mb-4 shadow-sm d-flex flex-row justify-content-between align-items-center" style={{ backgroundColor: '#f9fbfd' }}>
                                        <div>
                                            <h5>Total Payroll Cost</h5>
                                            <div className="bg-white border rounded p-3 mt-2">
                                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${(totalGross + employerContrib).toFixed(2)}</div>
                                                <div className="text-muted">Gross pay <span className="float-end">${totalGross.toFixed(2)}</span></div>
                                                <div className="text-muted">Employer taxes & contributions   <span className="float-end">${employerContrib.toFixed(2)}</span></div>
                                            </div>
                                        </div>

                                        <div className="ps-4">
                                            <div><strong>Funding account:</strong> <span className="text-muted">--</span></div>
                                            <div><strong>Pay period:</strong> <span className="text-muted">{selectedPeriodDates.start} to {selectedPeriodDates.end}</span></div>
                                            <div><strong>Pay date:</strong> <span className="text-muted">{payDate}</span></div>
                                            {/* <div className="mt-2">
                                                <label><strong>Chart of account:</strong></label>
                                                <select className="form-select mt-1" style={{ width: '180px' }}>
                                                    <option>Chequing</option>
                                                    <option>Savings</option>
                                                    <option>Payroll Account</option>
                                                </select>
                                            </div> */}
                                        </div>
                                    </div>

                                    {/* History Section */}
                                    {history.length > 0 && (
                                        <div className="mt-5">
                                            <h4>🗂️ Pay Stub History</h4>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>User</th>
                                                        {/* <th>Month</th> */}
                                                        <th>Frequency</th>
                                                        <th>Period</th>
                                                        <th>Date Generated</th>
                                                        <th>Action</th> {/* New column for the button */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {history.map((h, idx) => (
                                                        <tr key={idx}>
                                                            <td>{h.name}</td>
                                                            {/* <td>{h.month}</td> */}
                                                            <td>{h.payPeriod}</td>
                                                            <td>{`${h.StartDate} - ${h.EndDate}`}</td>
                                                            <td>{h.payDate}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => handleViewStub(h)}
                                                                >
                                                                    View
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>
                                    )}
                                </>
                            )}

                            <div className="d-flex justify-content-between mt-4">
                                <Button onClick={handleBack} disabled={step === 0}>Back</Button>
                                <Button onClick={handleNext} variant="primary" disabled={loading}>
                                    {loading ? <Spinner size="sm" animation="border" /> : step === 3 ? 'Generate Stub' : 'Next'}
                                </Button>
                            </div>


                            <Modal show={showSummary} onHide={() => setShowSummary(false)}>
                                <Modal.Header closeButton><Modal.Title>Stub Generated</Modal.Title></Modal.Header>
                                <Modal.Body>Pay stub has been successfully created.</Modal.Body>
                            </Modal>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PayStubGenerator;
