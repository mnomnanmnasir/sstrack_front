import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

function PayrollHistory() {

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
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = jwtDecode(JSON.stringify(token));
    const headers = { Authorization: `Bearer ${token}` };
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";






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

    useEffect(() => {
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
                        <>
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                                    <div className="text-center">
                                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-3 text-muted">Fetching pay stub history...</p>
                                    </div>
                                </div>
                            ) : history.length > 0 ? (
                                <div className="mt-5">
                                    <h4>🗂️ Pay Stub History</h4>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Frequency</th>
                                                <th>Period</th>
                                                <th>Date Generated</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((h, idx) => (
                                                <tr key={idx}>
                                                    <td>{h.name}</td>
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
                            ) : (
                                <div className="text-muted mt-4">No pay stubs available at the moment.</div>
                            )}

                        </>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PayrollHistory