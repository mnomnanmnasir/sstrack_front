<<<<<<< HEAD
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Badge, Card } from 'react-bootstrap';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardContent
} from '@mui/material';
import html2pdf from 'html2pdf.js';

export default function PayStubs() {
  const location = useLocation();
  const stubData = location.state?.stub;
  const stubUser = location.state?.user;
  const stubPeriod = location.state?.period;

  const data = stubData || {};

  useEffect(() => {
    if (stubData) {
      console.log('Stub:', stubData);
      console.log('User:', stubUser);
      console.log('Period:', stubPeriod);
    }
  }, [stubData, stubUser, stubPeriod]);

  const pdfRef = useRef();

  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin:       0.5,
      filename:     `${data.name || 'paystub'}-${data.StartDate}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (!stubData) {
    return <div className="text-center mt-5 text-muted">❌ No stub data provided.</div>;
  }

  return (
    <>
      <SnackbarProvider />
      <div className="container">
        <div className="userHeader ">
          <h5>Pay Stubs</h5>
        </div>

        <div className="mainwrapper">
          <div className="ownerTeamContainer">
            
             {/* 📄 PDF Download Button */}
             <div className="text-end mb-3">
              <button className="btn btn-success" onClick={handleDownloadPDF}>
                📥 Download PDF
              </button>
            </div>
            <div ref={pdfRef} className="max-w-4xl mx-auto p-4 space-y-5">


              {/* Header Card */}
              <Card>
                <CardContent className="space-y-2">
                  <h2 className="text-2xl font-bold">Paystub - {data.name ?? 'N/A'}</h2>
                  <div className="d-flex justify-content-between text-muted small">
                    <span>Pay Period: {data.StartDate ?? 'N/A'} to {data.EndDate ?? 'N/A'} ({data.payPeriod ?? 'N/A'})</span>
                    <span>Pay Date: {data.payDate ? new Date(data.payDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="d-flex gap-3 mt-2">
                    <Badge bg="secondary">Country: {data.country ?? 'N/A'}</Badge>
                    <Badge bg="secondary">Currency: {data.currency ?? 'N/A'}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Earnings Table */}
              <Card>
                <CardContent>
                  <h4 className="mb-3">Earnings</h4>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Hours</strong></TableCell>
                        <TableCell><strong>Rate</strong></TableCell>
                        <TableCell><strong>Current</strong></TableCell>
                        <TableCell><strong>YTD</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Regular</TableCell>
                        <TableCell>{data.regHours ?? 0}</TableCell>
                        <TableCell>{data.RegRate ?? 0}</TableCell>
                        <TableCell>{data.RegCurrent ?? 0}</TableCell>
                        <TableCell>{data.RegYTD ?? 0}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Overtime</TableCell>
                        <TableCell>{data.OTHours ?? 0}</TableCell>
                        <TableCell>{data.OTRate ?? 0}</TableCell>
                        <TableCell>{data.OTCurrent ?? 0}</TableCell>
                        <TableCell>{data.OTYTD ?? 0}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Shift Premium</TableCell>
                        <TableCell>{data.shiftPremiumHours ?? 0}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>{data.shiftPremiumCurrent ?? 0}</TableCell>
                        <TableCell>{data.shiftPremiumYTD ?? 0}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Deductions Table */}
              <Card>
                <CardContent>
                  <h4 className="mb-3">Deductions</h4>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Current</strong></TableCell>
                        <TableCell><strong>YTD</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(data.totalDeductions ?? []).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.deductionType ?? 'N/A'}</TableCell>
                          <TableCell>{item.amount ?? 0}</TableCell>
                          <TableCell>{item.YTD ?? 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Taxes Table */}
              <Card>
                <CardContent>
                  <h4 className="mb-3">Taxes</h4>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Tax Type</strong></TableCell>
                        <TableCell><strong>Current</strong></TableCell>
                        <TableCell><strong>YTD</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(data.taxBreakdown ?? []).map((tax, index) => (
                        <TableRow key={index}>
                          <TableCell>{tax.taxType ?? 'N/A'}</TableCell>
                          <TableCell>{tax.amount ?? 0}</TableCell>
                          <TableCell>{tax.YTD ?? 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Totals */}
              <Card>
                <CardContent className="d-flex justify-content-around text-center">
                  <div>
                    <h5>Net Pay</h5>
                    <p className="h4">₱{(data.netPay ?? 0).toLocaleString()}</p>
                    <small className="text-muted">YTD: ₱{(data.netPayYTD ?? 0).toLocaleString()}</small>
                  </div>
                  <div>
                    <h5>Gross Pay</h5>
                    <p className="h4">₱{(data.grossPay ?? 0).toLocaleString()}</p>
                    <small className="text-muted">YTD: ₱{(data.grossPayYTD ?? 0).toLocaleString()}</small>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
=======
import { SnackbarProvider } from 'notistack';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge, Card } from 'react-bootstrap';
import { CardContent, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import useLoading from '../hooks/useLoading';
import PayStubGenerator from './PayStubGenerator';
import { useLocation } from 'react-router-dom';

export default function PayStubs() {
    const [formData, setFormData] = useState({
        startDate: "2025-04-13",
        endDate: "2025-04-19",
        userId: "679a2da9ac8d9d680cf28fee",
        country: "Philippines",
        state: "maharashtra"
    });
    const [users, setUsers] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };
    const [error, setError] = useState(null);
    const { loading, setLoading, loading2, setLoading2 } = useLoading()
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const location = useLocation();
    const stubData = location.state?.stub;
    const stubUser = location.state?.user;
    const stubPeriod = location.state?.period;

    console.log('Received Stub Data:', stubData);
    useEffect(() => {
        if (stubData) {
            console.log('Received Stub Data:', stubData);
            console.log('User:', stubUser);
            console.log('Period:', stubPeriod);
        }
    }, [stubData, stubUser, stubPeriod]);


    const data = stubData.data[0] || {};
    console.log('Received Stub Data:', data);
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
                        {!data ? (
                            <div className="text-center mt-10 text-gray-500">Loading pay stub...</div>
                        ) : (
                            <div className="max-w-4xl mx-auto p-6 space-y-6">
                                <Card>
                                    <CardContent className="space-y-2">
                                        <h2 className="text-2xl font-bold">Paystub - {data.name ?? 'N/A'}</h2>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>
                                                Pay Period: {data.StartDate ?? 'N/A'} to {data.EndDate ?? 'N/A'} ({data.payPeriod ?? 'N/A'})
                                            </span>
                                            <span>Pay Date: {new Date(data.payDate).toLocaleDateString() ?? 'N/A'}</span>
                                        </div>
                                        <div className="flex gap-4 mt-2">
                                            <Badge variant="outline">Country: {data.country ?? 'N/A'}</Badge>
                                            <Badge variant="outline">Currency: {data.currency ?? 'N/A'}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="space-y-4">
                                        <h3 className="text-lg font-semibold">Earnings</h3>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Type</strong></TableCell>
                                                    <TableCell><strong>Hours</strong></TableCell>
                                                    <TableCell><strong>Rate</strong></TableCell>
                                                    <TableCell><strong>Current</strong></TableCell>
                                                    <TableCell><strong>YTD</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Regular</TableCell>
                                                    <TableCell>{data.regHours ?? 0}</TableCell>
                                                    <TableCell>{data.RegRate ?? 0}</TableCell>
                                                    <TableCell>{data.RegCurrent ?? 0}</TableCell>
                                                    <TableCell>{data.RegYTD ?? 0}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Overtime</TableCell>
                                                    <TableCell>{data.OTHours ?? 0}</TableCell>
                                                    <TableCell>{data.OTRate ?? 0}</TableCell>
                                                    <TableCell>{data.OTCurrent ?? 0}</TableCell>
                                                    <TableCell>{data.OTYTD ?? 0}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Shift Premium</TableCell>
                                                    <TableCell>{data.shiftPremiumHours ?? 0}</TableCell>
                                                    <TableCell>-</TableCell>
                                                    <TableCell>{data.shiftPremiumCurrent ?? 0}</TableCell>
                                                    <TableCell>{data.shiftPremiumYTD ?? 0}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="space-y-4">
                                        <h3 className="text-lg font-semibold">Deductions</h3>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Type</strong></TableCell>
                                                    <TableCell><strong>Current</strong></TableCell>
                                                    <TableCell><strong>YTD</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(data.totalDeductions || []).map((item, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell>{item.deductionType ?? 'N/A'}</TableCell>
                                                        <TableCell>{item.amount ?? 0}</TableCell>
                                                        <TableCell>{item.YTD ?? 0}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>

                                        <h3 className="text-lg font-semibold mt-6">Taxes</h3>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Tax Type</strong></TableCell>
                                                    <TableCell><strong>Current</strong></TableCell>
                                                    <TableCell><strong>YTD</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {(data.taxBreakdown || []).map((tax, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell>{tax.taxType ?? 'N/A'}</TableCell>
                                                        <TableCell>{tax.amount ?? 0}</TableCell>
                                                        <TableCell>{tax.YTD ?? 0}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="grid grid-cols-2 gap-6 text-center">
                                        <div>
                                            <h4 className="text-md font-medium">Net Pay</h4>
                                            <p className="text-xl font-bold">₱{(data.netPay ?? 0).toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">YTD: ₱{(data.netPayYTD ?? 0).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-md font-medium">Gross Pay</h4>
                                            <p className="text-xl font-bold">₱{(data.grossPay ?? 0).toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">YTD: ₱{(data.grossPayYTD ?? 0).toLocaleString()}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </>
    );
}

// Basic Table Style
const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
};

>>>>>>> 514acc53d373c755c7a8ee49026e4604ec60f675
