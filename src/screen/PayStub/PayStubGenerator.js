import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { SnackbarProvider } from 'notistack';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import PayrollTable from './PayrollTable';
import PayStubs from './PayStubs';
import { useLocation } from 'react-router-dom';

const PayStubGenerator = () => {
    const [step, setStep] = useState(0);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [month, setMonth] = useState('');
    const [frequency, setFrequency] = useState('');
    const [selectedEmployeeData, setSelectedEmployeeData] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedPeriodDates, setSelectedPeriodDates] = useState({ start: '', end: '' });
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [generatedStubs, setGeneratedStubs] = useState([]);
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
    const location = useLocation();

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

            try {
                setLoading(true);

                const startDate = moment(selectedPeriodDates.start).format("YYYY-MM-DD");
                const endDate = moment(selectedPeriodDates.end).format("YYYY-MM-DD");

                const payload = {
                    startDate,
                    endDate,
                    userIds: selectedIds,
                    // country: "Philippines",  // Replace if dynamic
                    // state: "maharashtra",    // Replace if dynamic
                    employeeData: selectedEmployeeData || []
                };

                const res = await axios.post(`${apiUrl}/owner/generatePayStubs`, payload, { headers });
                if (res.data?.data) {
                    setGeneratedStubs(res.data.data);
                    // Add this state to hold the generated stub records
                }

                await fetchAllStubs(); // Optional
                console.log('stub generation', res)
                alert("Stubs generated successfully!");
                setStep(prev => prev + 1);
            } catch (error) {
                console.error("Error generating stubs:", error);
                alert(error?.response?.data?.message || "Failed to generate stubs.");
            } finally {
                setLoading(false);
            }

        } else if (step === 3) {
            navigate('/PayStub_history')
            console.log("✅ Final review data:");
            console.log("Selected IDs:", selectedIds);
            console.log("Pay Period:", selectedPeriodDates);
            console.log("Selected Employees:", selectedEmployeeData);
            console.log("Total Gross:", totalGross);
            console.log("Employer Contribution:", employerContrib);
            console.log("Pay Date:", payDate);
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

            const payload = {
                startDate,
                endDate,
                country: "Philippines",
                state: "maharashtra",
                userStubs: selectedEmployeeData.map(emp => ({
                    userId: emp.userId,
                    memo: emp.memo,
                    bonus: emp.bonus,
                    adjustment: emp.adjustments,
                }))
            };

            const res = await axios.post(`${apiUrl}/owner/generatePayStubs`, payload, { headers });

            await fetchAllStubs();
            alert('Stub generated successfully!');
            setShowSummary(true);
        } catch (res) {
            console.log("Error generating stub:", res.response?.data?.message);
            alert(res.response?.data?.message || 'Failed to generate stub.');
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

    useEffect(() => {
        // If coming from navigate with state
        if (location.state?.step) {
            setStep(location.state.step);
        }
    }, [location.state]);
    // ---- Payroll Summary Calculations ----
    const currencySymbolMap = {
        usd: '$', pkr: '₨', inr: '₹', cad: 'C$', eur: '€', gbp: '£'
    };

    const displayCurrency = generatedStubs[0]?.currency?.toLowerCase() || 'usd';
    const currencySymbol = currencySymbolMap[displayCurrency] || '$';

    const totalGrossAmount = generatedStubs.reduce((sum, stub) => sum + (stub.grossPay || 0), 0);
    const totalNetAmount = generatedStubs.reduce((sum, stub) => sum + (stub.netPay || 0), 0);
    const totalHoursWorked = generatedStubs.reduce((sum, stub) => sum + ((stub.regHours || 0) + (stub.OTHours || 0)), 0);
    const totalDeductions = generatedStubs.reduce((sum, stub) => {
        const tax = (stub.taxBreakdown || []).reduce((s, t) => s + (t.amount || 0), 0);
        const other = (stub.totalDeductions || []).reduce((s, d) => s + (d.amount || 0), 0);
        return sum + tax + other;
    }, 0);

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
                            <h2>🧾 Pay Stub Wizard</h2>
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
                                            onClick={() => navigate('/add-employee')}
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
                                    onSelectionChange={({
                                        selectedEmployeeIds,
                                        selectedEmployeeData, // <-- New
                                        payPeriodStart,
                                        payPeriodEnd,
                                        month,
                                        totalGross,
                                        employerContrib,
                                        payDate
                                    }) => {
                                        setSelectedIds(selectedEmployeeIds);
                                        setSelectedEmployeeData(selectedEmployeeData); // ✅ new state
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
                                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                                    {currencySymbol} {(totalGrossAmount + employerContrib).toFixed(2)}
                                                </div>
                                                <div className="text-muted">Gross pay <span className="float-end">{currencySymbol} {totalGrossAmount.toFixed(2)}</span></div>
                                                <div className="text-muted">Net pay <span className="float-end">{currencySymbol} {totalNetAmount.toFixed(2)}</span></div>
                                                <div className="text-muted">
                                                    Employer taxes & contributions <span className="float-end">{currencySymbol} {totalDeductions.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ps-4">
                                            <div><strong>Funding account:</strong> <span className="text-muted">--</span></div>
                                            <div><strong>Pay period:</strong> <span className="text-muted">{selectedPeriodDates.start} to {selectedPeriodDates.end}</span></div>
                                            <div><strong>Pay date:</strong> <span className="text-muted">{payDate}</span></div>
                                        </div>
                                    </div>

                                    <div className="table-responsive">

                                        <table className="table table-bordered mt-3 bg-white">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Total hours</th>
                                                    <th>Gross Pay</th>
                                                    <th>Taxes & Deductions</th>
                                                    <th>Net Pay</th>
                                                    <th>Employer Contributions</th>
                                                    <th>Memo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {generatedStubs.map((stub, idx) => {
                                                    const currencySymbol = {
                                                        usd: '$', pkr: '₨', inr: '₹', cad: 'C$', eur: '€', gbp: '£'
                                                    }[stub.currency?.toLowerCase()] || '$';

                                                    const totalDeductions = (stub.taxBreakdown || []).reduce((sum, item) => sum + (item.amount || 0), 0) +
                                                        (stub.totalDeductions || []).reduce((sum, item) => sum + (item.amount || 0), 0);

                                                    const memo = selectedEmployeeData.find(emp => emp.userId === stub.userId)?.memo || '';

                                                    return (
                                                        <tr key={stub._id || idx}>
                                                            <td>{stub.name}</td>
                                                            <td>{stub.regHours + stub.OTHours}</td>
                                                            <td>{currencySymbol} {stub.grossPay?.toFixed(2)}</td>
                                                            <td>{currencySymbol} {totalDeductions.toFixed(2)}</td>
                                                            <td>{currencySymbol} {stub.netPay?.toFixed(2)}</td>
                                                            <td>--</td>
                                                            <td>{memo}</td>
                                                        </tr>
                                                    );
                                                })}
                                                <tr className="fw-bold">
                                                    <td>Total</td>
                                                    <td>{generatedStubs.reduce((sum, s) => sum + (s.regHours + s.OTHours), 0)}</td>
                                                    <td>
                                                        {generatedStubs.length > 0 && (() => {
                                                            const curr = generatedStubs[0].currency?.toLowerCase() || 'usd';
                                                            const symbol = {
                                                                usd: '$', pkr: '₨', inr: '₹', cad: 'C$', eur: '€', gbp: '£'
                                                            }[curr] || '$';
                                                            const total = generatedStubs.reduce((sum, s) => sum + (s.grossPay || 0), 0);
                                                            return `${symbol} ${total.toFixed(2)}`;
                                                        })()}
                                                    </td>
                                                    <td>--</td>
                                                    <td>--</td>
                                                    <td>--</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                </>
                            )}

                            <div className="d-flex justify-content-between mt-4">
                                <Button onClick={handleBack} disabled={step === 0}>Back</Button>
                                <Button onClick={handleNext} variant="primary" disabled={loading}>
                                    {loading ? <Spinner size="sm" animation="border" /> : step === 2 ? 'Generate Stub' : step === 3 ? 'Submit' : 'Next'}
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
