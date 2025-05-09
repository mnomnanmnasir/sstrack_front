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
                console.log('pay stubs history', response.data.data)
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
                                <div style={{ marginTop: '2rem' }}>
                                    <h4>🗂️ Pay Stub History</h4>
                                    <div
                                        style={{
                                            overflowX: 'auto',
                                            background: '#fff',
                                            borderRadius: '8px',
                                            padding: '20px',
                                            boxShadow: '0 0 10px rgba(0,0,0,0.05)',
                                            border: '1px solid #eee',
                                        }}
                                    >
                                        <table style={{ minWidth: '1400px', width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ background: '#f4f6f8', fontWeight: 'bold' }}>
                                                    <th style={{ padding: '10px', border: '1px solid #ddd', whiteSpace: 'nowrap' }}>Name</th>
                                                    {/* <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th> */}
                                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Country</th>
                                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>State</th>
                                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Frequency</th>
                                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Period</th>
                                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total Hours</th>
                                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Gross Pay</th>
                                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Net Pay</th>
                                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total Deductions</th>
                                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Currency</th>
                                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Generated At</th>
                                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {history.map((h, idx) => {
                                                    const currencySymbol = {
                                                        usd: '$', pkr: '₨', inr: '₹', cad: 'C$', eur: '€', gbp: '£'
                                                    }[h.currency?.toLowerCase()] || h.currency || '';

                                                    const totalDeductions = (h.taxBreakdown || []).reduce((sum, item) => sum + (item.amount || 0), 0) +
                                                        (h.totalDeductions || []).reduce((sum, item) => sum + (item.amount || 0), 0);

                                                    return (
                                                        <tr key={idx}>
                                                            <td style={{ padding: '10px', border: '1px solid #eee' }}>{h.name}</td>
                                                            {/* <td style={{ padding: '10px', border: '1px solid #eee' }}>{h.userId?.email || '—'}</td> */}
                                                            <td style={{ padding: '10px', border: '1px solid #eee' }}>{h.country || '—'}</td>
                                                            <td style={{ padding: '10px', border: '1px solid #eee' }}>{h.state || '—'}</td>
                                                            <td style={{ padding: '10px', border: '1px solid #eee' }}>{h.payPeriod}</td>
                                                            <td style={{ padding: '10px', border: '1px solid #eee' }}>{`${h.StartDate} - ${h.EndDate}`}</td>
                                                            <td style={{ padding: '10px', border: '1px solid #eee', textAlign: 'right' }}>{(h.regHours + h.OTHours).toFixed(2)}</td>
                                                            <td style={{ padding: '10px', border: '1px solid #eee', textAlign: 'right' }}>{currencySymbol} {h.grossPay?.toFixed(2)}</td>
                                                            <td style={{ padding: '10px', border: '1px solid #eee', textAlign: 'right' }}>{currencySymbol} {h.netPay?.toFixed(2)}</td>
                                                            <td style={{ padding: '10px', border: '1px solid #eee', textAlign: 'right' }}>{currencySymbol} {totalDeductions.toFixed(2)}</td>
                                                            <td style={{ padding: '10px', border: '1px solid #eee' }}>{h.currency}</td>
                                                            <td style={{ padding: '10px', border: '1px solid #eee' }}>{new Date(h.generateDate || h.payDate).toLocaleString()}</td>
                                                            <td style={{ padding: '10px', border: '1px solid #eee' }}>
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