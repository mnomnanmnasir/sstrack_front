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
      margin: 0.5,
      filename: `${data.name || 'paystub'}-${data.StartDate}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const currencySymbols = {
    USD: "$",
    PKR: "₨",
    CAD: "C$",
    INR: "₹",
    PHP: "₱",
    EUR: "€",
    GBP: "£",
    AUD: "A$",
    JPY: "¥"
  };

  const currencySymbol = currencySymbols[(data.currency || '').toUpperCase()] || '';

  if (!stubData) {
    return <div className="text-center mt-5 text-muted">❌ No stub data provided.</div>;
  }

  return (
    <>
      <SnackbarProvider />
      <div className="container">
        <div className="userHeader">
          <h5>Pay Stubs</h5>
        </div>

        <div className="mainwrapper">
          <div className="ownerTeamContainer">
            <div className="text-end mb-3">
              <button className="btn btn-success" onClick={handleDownloadPDF}>
                🗕️ Download PDF
              </button>
            </div>

            <div ref={pdfRef} className="max-w-4xl mx-auto p-4 space-y-5">
              <div className="col-12">
                <Card>
                  <CardContent>
                    <h2 className="h4 fw-bold">Paystub - {data.name ?? 'N/A'}</h2>
                    <div className="d-flex flex-wrap justify-content-between small text-muted">
                      <span>Pay Period: {data.StartDate ?? 'N/A'} to {data.EndDate ?? 'N/A'} ({data.payPeriod ?? 'N/A'})</span>
                      <span>Pay Date: {data.payDate ? new Date(data.payDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      <Badge bg="secondary">Country: {data.country ?? 'N/A'}</Badge>
                      <Badge bg="secondary">Currency: {data.currency ?? 'N/A'}</Badge>
                      <Badge bg="secondary">Memo: {data.memo || 'None'}</Badge>
                      <Badge bg="secondary">Bonus: {Number(data.bonus ?? 0).toFixed(2)}</Badge>
                      <Badge bg="secondary">Adjustments: {Number(data.adjustments ?? 0).toFixed(2)}</Badge>
                      <Badge bg="secondary">Generate Date: {data.generateDate ? new Date(data.generateDate).toLocaleString() : 'N/A'}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

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
                        <TableCell>{Number(data.regHours ?? 0).toFixed(2)}</TableCell>
                        <TableCell>{Number(data.RegRate ?? 0).toFixed(2)}</TableCell>
                        <TableCell>{Number(data.RegCurrent ?? 0).toFixed(2)}</TableCell>
                        <TableCell>{Number(data.RegYTD ?? 0).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Overtime</TableCell>
                        <TableCell>{Number(data.OTHours ?? 0).toFixed(2)}</TableCell>
                        <TableCell>{Number(data.OTRate ?? 0).toFixed(2)}</TableCell>
                        <TableCell>{Number(data.OTCurrent ?? 0).toFixed(2)}</TableCell>
                        <TableCell>{Number(data.OTYTD ?? 0).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Shift Premium</TableCell>
                        <TableCell>{Number(data.shiftPremiumHours ?? 0).toFixed(2)}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>{Number(data.shiftPremiumCurrent ?? 0).toFixed(2)}</TableCell>
                        <TableCell>{Number(data.shiftPremiumYTD ?? 0).toFixed(2)}</TableCell>
                      </TableRow>
                      {data.bonus > 0 && (
                        <TableRow>
                          <TableCell>Bonus</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>{Number(data.bonus).toFixed(2)}</TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                      )}
                      {data.adjustments > 0 && (
                        <TableRow>
                          <TableCell>Adjustments</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>{Number(data.adjustments).toFixed(2)}</TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

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
                          <TableCell>{Number(item.amount ?? 0).toFixed(2)}</TableCell>
                          <TableCell>{Number(item.YTD ?? 0).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

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
                          <TableCell>{Number(tax.amount ?? 0).toFixed(2)}</TableCell>
                          <TableCell>{Number(tax.YTD ?? 0).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="d-flex justify-content-around text-center">
                  <div>
                    <h5>Net Pay</h5>
                    <p className="h4">{currencySymbol}{Number(data.netPay ?? 0).toFixed(2)}</p>
                    <small className="text-muted">YTD: {currencySymbol}{Number(data.netPayYTD ?? 0).toFixed(2)}</small>
                  </div>
                  <div>
                    <h5>Gross Pay</h5>
                    <p className="h4">{currencySymbol}{Number(data.grossPay ?? 0).toFixed(2)}</p>
                    <small className="text-muted">YTD: {currencySymbol}{Number(data.grossPayYTD ?? 0).toFixed(2)}</small>
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
