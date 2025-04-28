import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { SnackbarProvider } from 'notistack';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PayStubGenerator = () => {

    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const token = localStorage.getItem('token');
    const user = jwtDecode(JSON.stringify(token));
    const headers = {
        Authorization: "Bearer " + token,
    };
    const [month, setMonth] = useState('');
    const [frequency, setFrequency] = useState('');
    const [periods, setPeriods] = useState([]);
  
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const userss = ['John Doe', 'Jane Smith', 'Michael Brown']; // Example users
    const selectedUser = users.find((u) => u._id === selectedUserId);
    const generateWeeklyPeriods = (month) => {
        const periods = [];
        const startDate = new Date(`${month}-01`);
        const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();

        let currentDay = 1;

        while (currentDay <= daysInMonth) {
            const start = currentDay;
            let end = currentDay + 6;

            if (end > daysInMonth) {
                end = daysInMonth;
            }

            periods.push(`${start}/${startDate.getMonth() + 1} - ${end}/${startDate.getMonth() + 1}`);
            currentDay = end + 1;
        }

        return periods;
    };
    const navigate = useNavigate();
    const generateBiWeeklyPeriods = (month) => {
        const periods = [];
        const startDate = new Date(`${month}-01`);
        const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();

        periods.push(`1/${startDate.getMonth() + 1} - 15/${startDate.getMonth() + 1}`);
        periods.push(`16/${startDate.getMonth() + 1} - ${daysInMonth}/${startDate.getMonth() + 1}`);

        return periods;
    };

    const generateMonthlyPeriod = (month) => {
        const startDate = new Date(`${month}-01`);
        const daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();

        return [`1/${startDate.getMonth() + 1} - ${daysInMonth}/${startDate.getMonth() + 1}`];
    };

    useEffect(() => {
        if (!month || !frequency) return;

        let generatedPeriods = [];

        if (frequency === 'weekly') {
            generatedPeriods = generateWeeklyPeriods(month);
        } else if (frequency === 'biweekly') {
            generatedPeriods = generateBiWeeklyPeriods(month);
        } else if (frequency === 'monthly') {
            generatedPeriods = generateMonthlyPeriod(month);
        }

        setPeriods(generatedPeriods);
        setSelectedPeriod('');
    }, [month, frequency]);

    const handleGenerate = async () => {
        if (!selectedUserId || !month || !frequency || !selectedPeriod) {
            alert('Please complete all fields.');
            return;
        }

        setLoading(true);

        try {
            // Parse and format start & end date
            const [start, end] = selectedPeriod.split(' - ');
            const [year, monthNumber] = month.split('-');
            const [startDay, startMonth] = start.split('/');
            const [endDay, endMonth] = end.split('/');

            const startDate = `${year}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`;
            const endDate = `${year}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`;

            // Create payload
            const formData = {
                startDate,
                endDate,
                userId: selectedUserId,
                country: "Philippines",
                state: "maharashtra"
            };

            const token = localStorage.getItem('token');
            const res = await axios.post(
                'https://myuniversallanguages.com:9093/api/v1/owner/generatePayStubs',
                {
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    userIds: [formData.userId],
                    country: formData.country,
                    state: formData.state
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log('Pay Stub Response:', res.data);


            // Optionally: Add to local history
            const newRecord = {
                ...formData,
                month,
                frequency,
                period: selectedPeriod,
                user: selectedUser?.name || 'N/A', // Add user's name here
                dateGenerated: new Date().toLocaleString(),
                stubData: res.data
            };
            setHistory([newRecord, ...history]);

            alert('Stub generated successfully!');
            setShowSummary(false);
        } catch (error) {
            console.error("Error generating pay stub:", error.response?.data || error.message);
            alert("Failed to generate stub. Check console for details.");
        } finally {
            setLoading(false);
        }
    };



    //get users Id 
    const getData = async () => {
        setLoading(true)
        try {

            const response = await axios.get(`${apiUrl}/owner/companies`, { headers })
            if (response.status) {

                setLoading(false)
                setUsers(() => {
                    return response?.data?.employees?.sort((a, b) => {
                        if (a.inviteStatus !== b.inviteStatus) {
                            return a.inviteStatus ? 1 : -1;
                        }
                        if (a.isArchived !== b.isArchived) {
                            return a.isArchive ? 1 : -1;
                        }
                        return 0;
                    });
                })

            }
        }
        catch (err) {
            console.log(err);
            setLoading(false)

        }
    }
    const handleViewStub = (record) => {
        console.log("Viewing stub:", record);
        navigate('/pay_stub_View', {
            state: {
              stub: record.stubData,
              user: record.user,
              period: record.period
            }
          });
          
        // You can also:
        // - open a modal
        // - navigate to a stub detail page
        // - trigger a PDF download
    };


    const getManagerTeam = async () => {
        setLoading(true)
        try {


            const response = await axios.get(`${apiUrl}/manager/employees`, { headers })
            if (response.status) {
                setLoading(false)

                setUsers(() => {
                    const filterCompanies = response?.data?.convertedEmployees?.sort((a, b) => {
                        if (a.inviteStatus !== b.inviteStatus) {
                            return a.inviteStatus ? 1 : -1;
                        }
                        if (a.isArchived !== b.isArchived) {
                            return a.isArchive ? 1 : -1;
                        }
                        return 0;
                    });
                    return filterCompanies
                })

            }
        }
        catch (err) {
            console.log(err);
            setLoading(false)

        }
    }

    useEffect(() => {
        if (user?.userType === "manager") {
            getManagerTeam();
        }
        else {
            getData();
        }
    }, [])

    return (
        <>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <div>
                        <h5>Pay Stubs</h5>
                    </div>
                </div>

                <div className='mainwrapper'>
                    <div className="ownerTeamContainer">
                        <div className="container p-4">
                            <h2 className="mb-4">🧾 Pay Stub Generator</h2>

                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select User</Form.Label>
                                    <Form.Select
                                        value={selectedUserId}
                                        onChange={(e) => {
                                            const selectedId = e.target.value;
                                            setSelectedUserId(selectedId);
                                        }}
                                    >
                                        <option value=''>-- Select User --</option>
                                        {users?.map((u, index) => (
                                            <option key={index} value={u._id}>
                                                {u.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Select Pay Month</Form.Label>
                                    <Form.Control type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Select Pay Frequency</Form.Label>
                                    <Form.Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                                        <option value=''>-- Select Frequency --</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="biweekly">Bi-Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </Form.Select>
                                </Form.Group>

                                {periods.length > 0 && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Select Pay Period</Form.Label>
                                        <Form.Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                                            <option value=''>-- Select Period --</option>
                                            {periods.map((p, index) => <option key={index} value={p}>{p}</option>)}
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                <Button variant="primary" onClick={() => setShowSummary(true)} disabled={loading}>
                                    {loading ? <Spinner size="sm" animation="border" /> : 'Generate Stub'}
                                </Button>
                            </Form>

                            {/* Summary Modal */}
                            <Modal show={showSummary} onHide={() => setShowSummary(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Confirm Stub Generation</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <p><strong>User:</strong> {selectedUser?.name || 'N/A'}</p>
                                    <p><strong>Month:</strong> {month}</p>
                                    <p><strong>Frequency:</strong> {frequency}</p>
                                    <p><strong>Period:</strong> {selectedPeriod}</p>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowSummary(false)}>Cancel</Button>
                                    <Button variant="success" onClick={handleGenerate} disabled={loading}>
                                        {loading ? <Spinner size="sm" animation="border" /> : 'Confirm & Generate'}
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            {/* History Section */}
                            {history.length > 0 && (
                                <div className="mt-5">
                                    <h4>🗂️ Pay Stub History</h4>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Month</th>
                                                <th>Frequency</th>
                                                <th>Period</th>
                                                <th>Date Generated</th>
                                                <th>Action</th> {/* New column for the button */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((h, idx) => (
                                                <tr key={idx}>
                                                    <td>{h.user}</td>
                                                    <td>{h.month}</td>
                                                    <td>{h.frequency}</td>
                                                    <td>{h.period}</td>
                                                    <td>{h.dateGenerated}</td>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PayStubGenerator;
