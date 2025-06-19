import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';




const PayrollTable = ({ employees: initialEmployees = [], frequency: parentFrequency, onSelectionChange, payPeriods }) => {
  const token = localStorage.getItem('token');
  const user = useMemo(() => jwtDecode(token), [token]);
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [originalEmployees, setOriginalEmployees] = useState([]);
  const [payPeriod, setPayPeriod] = useState({ start: '2025-04-21', end: '2025-04-27' });
  const [payDate, setPayDate] = useState('2025-05-02');
  const [frequency] = useState(parentFrequency || '');
  const [month, setMonth] = useState('');
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalEmployee, setModalEmployee] = useState(null);
  const [shiftPremiumRate, setShiftPremiumRate] = useState('');
  const [overtimeRate, setOvertimeRate] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [appliedTaxCountry, setAppliedTaxCountry] = useState('');
  const [appliedTaxState, setAppliedTaxState] = useState('');
  const [appliedTaxes, setAppliedTaxes] = useState([]);
  const [appliedDeductions, setAppliedDeductions] = useState([]);
  const [currency, setCurrency] = useState('');
  const [vacationPay, setVacationPay] = useState('');
  const [payPeriodType, setPayPeriodType] = useState('');
  const [pay_type, setPayType] = useState('');

  const navigate = useNavigate();
  // ✅ Define the missing constants
  const countryStateMap = {
    canada: ['Alberta', 'British Columbia', 'Manitoba', 'Ontario'],
    usa: ['California', 'Texas', 'New York', 'Florida'],
    india: ['Maharashtra', 'Punjab', 'Kerala'],
  };


  const usStateNameToCode = {
    California: 'CA',
    Texas: 'TX',
    New_York: 'NY',
    Florida: 'FL'
  };

  const taxDeductionMap = {
    canada: {
      taxes: ['federal', 'provincial'],
      deductions: ['cpp', 'ei'],
    },
    india: {
      taxes: ['income tax', 'gst', 'professional tax'],
      deductions: ['pf', 'esi', 'section 80c', 'section 80d'],
    },
    usa: {
      taxes: ['federal income tax', 'state income tax', 'social security tax', 'medicare tax', 'futa'],
      deductions: [],
    },
    philippines: {
      taxes: ['income tax', 'vat', 'estate tax'],
      deductions: ['sss', 'philhealth', 'pag-ibig'],
    },
    pakistan: {
      taxes: ['income tax', 'sales tax', 'excise duty'],
      deductions: ['social security', 'provident fund', 'zakat'],
    },
    ksa: {
      taxes: ['income tax (for foreign workers)', 'vat', 'khums'],
      deductions: ['gosi', 'social insurance'],
    },
  };

  // ✅ Dummy updateStubSettings for now
  const updateStubSettings = async () => {
    const isPayrolUser = selectedEmp?.payrolUser;

    // Build the payload
    const payload = {
      shiftPremiumRate: Number(shiftPremiumRate),
      overtimeRate: Number(overtimeRate),
      hourlyRate: Number(hourlyRate),
      appliedTaxCountry,
      appliedTaxState:
        appliedTaxCountry === "usa" && usStateNameToCode[appliedTaxState]
          ? usStateNameToCode[appliedTaxState]
          : appliedTaxState,
      vacationPay: Number(vacationPay),
      currency,
      pay_type: pay_type || "hourly",
      payPeriodType,
      appliedTaxes,
      appliedDeductions,
      ...(isPayrolUser && { name: selectedEmp?.name }) // Include name only if payrolUser
    };

    console.log("selectedEmp.id:", selectedEmp?.id);
    console.log("selectedEmp.userId:", selectedEmp?.id);
    console.log("isPayrolUser:", isPayrolUser);


    const endpoint = isPayrolUser
      ? `${apiUrl}/owner/updatepayrolUser/${selectedEmp?.id}`
      : `${apiUrl}/superAdmin/updateStubsSetting/${selectedEmp?.id}`;

    try {
      const response = isPayrolUser
        ? await axios.patch(endpoint, payload, { headers }) // PATCH
        : await axios.post(endpoint, payload, { headers }); // POST

      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar("Stub settings updated successfully!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" }
        });

        setTimeout(() => window.location.reload(), 300);
        setShowSettingsModal(false);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update stub settings.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" }
      });

      console.error("❌ Error updating stub settings:", error);
    }
  };



  const fetchPayPeriods = async (selectedMonth) => {
    try {
      const response = await fetch(
        `${apiUrl}/owner/paystubs/getPayPeriodDates?date=${selectedMonth}&type=${frequency}`,
        { method: "GET", headers }
      );
      const data = await response.json();
      console.log('responceeee', response)
      if (Array.isArray(data.data)) {
        setPeriods(data.data); // All good
      } else if (typeof data.data === 'string') {
        setPeriods([data.data]); // Wrap the string in an array
      } else {
        console.error("Unexpected API format:", data.data);
      }

    } catch (error) {
      console.error("Failed to fetch pay periods:", error);
    }
  };

  useEffect(() => {
    if (selectedEmp) {
      setShiftPremiumRate(selectedEmp.shiftPremiumRate || 0);
      setOvertimeRate(selectedEmp.overtimeRate || 0);
      setHourlyRate(selectedEmp.hourlyRate || 0);
      setCurrency(selectedEmp.currency || '');
      setPayType(selectedEmp.payType || '');
      setPayPeriodType(selectedEmp.payPeriodType || '');
      setVacationPay(selectedEmp.vacationPay || 0);
      setAppliedTaxCountry(selectedEmp.appliedTaxCountry || '');
      setAppliedTaxState(selectedEmp.appliedTaxState || '');

      // You might fetch these from server if they're dynamic, for now empty arrays
      setAppliedTaxes(selectedEmp.appliedTaxes || []);
      setAppliedDeductions(selectedEmp.appliedDeductions || []);
    }
  }, [selectedEmp]);
  useEffect(() => {
    if (!showSettingsModal) {
      setShiftPremiumRate(0);
      setOvertimeRate(0);
      setHourlyRate(0);
      setCurrency('');
      setPayType('');
      setPayPeriodType('');
      setVacationPay(0);
      setAppliedTaxCountry('');
      setAppliedTaxState('');
      setAppliedTaxes([]);
      setAppliedDeductions([]);
    }
  }, [showSettingsModal]);



  useEffect(() => {
    if (Array.isArray(initialEmployees)) {
      const mapped = initialEmployees.map((emp) => ({
        id: emp._id,
        name: emp.name,
        email: emp.email,
        company: emp.company,
        companyId: emp.companyId,
        userType: emp.userType,

        // Billing Info
        hourlyRate: emp.billingInfo?.ratePerHour || 0,
        shiftPremiumRate: emp.billingInfo?.shiftPremiumRate || 0,
        overtimeRate: emp.billingInfo?.overtimeRate || 0,
        currency: emp.billingInfo?.currency || 'USD',
        payType: emp.billingInfo?.payType || '',

        // Time & Earnings
        type: emp.billingInfo?.payType === 'hourly' ? 'Hourly' : 'Monthly',
        regularHours: emp.totalHours?.userHours || 0,
        overTimeHours: emp.totalHours?.overTimeUser || 0,
        weekendPremiumHours: emp.totalHours?.weekendPremiumHours || 0,
        vacationPay: emp.vacationPay || 0,
        payPeriodType: emp.payPeriodType || '',
        totalHours: emp.totalHours || {},
        earnings: emp.earnings || {},

        // Stub Fields
        overtime: 0,
        bonus: 0.0,
        adjustments: 0,
        payrolUser: emp.payrolUser,
        memo: '',
        payMethod: 'Bank transfer',

        // Validation
        validationError: emp.validationErrors?.[0] || ''
      }));

      setEmployees(mapped);
      setOriginalEmployees(mapped); // ✅ Save for reset
    }
  }, [initialEmployees, payPeriod]);


  const toggleEmployee = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleChange = (id, field, value) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, [field]: field === 'memo' ? value : parseFloat(value) || 0 } : emp
      )
    );
  };



  useEffect(() => {
    if (selectedPeriod.includes(" - ")) {
      const [startStr, endStr] = selectedPeriod.split(" - ");
      const formatDate = (dateStr) => {
        const [month, day, year] = dateStr.split("/");
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      };
      setPayPeriod({ start: formatDate(startStr), end: formatDate(endStr) });
    }
  }, [selectedPeriod]);

  useEffect(() => {
    if (typeof onSelectionChange === 'function') {
      const selected = employees
        .filter(emp => selectedEmployees.includes(emp.id));

      const totalGross = selected.reduce((sum, emp) => sum + (parseFloat(emp.earnings?.grossPay) || 0), 0);

      const employerContrib = selected.length;

      const selectedEmployeeData = selected.map(emp => ({
        userId: emp.id,
        memo: emp.memo,
        bonus: parseFloat(emp.bonus) || 0,
        adjustments: parseFloat(emp.adjustments) || 0,
        payrolUser: emp.payrolUser || false
      }));
      onSelectionChange({
        selectedEmployeeIds: selectedEmployees,
        selectedEmployeeData, // ✅ enriched per-user data
        payPeriodStart: payPeriod.start,
        payPeriodEnd: payPeriod.end,
        month,
        totalGross,
        employerContrib,
        payDate
      });
    }
  }, [selectedEmployees, payPeriod, employees, payDate]);

  const currencySymbols = {
    usd: '$',
    pkr: '₨',
    cad: 'C$',
    eur: '€',
    gbp: '£',
    inr: '₹',
    aed: 'د.إ', // <-- added symbol for AED
  };
  const countryCurrencyMap = {
    canada: 'CAD',
    usa: 'USD',
    pakistan: 'PKR',
    philippines: 'PHP',
    india: 'INR',
    ksa: 'SAR'
  };



  const handleRegenerate = useCallback((emp) => {
    console.log("🔁 Opening regenerate modal for:", payPeriods);
    console.table(emp);
    setModalEmployee(emp);  // Store current employee
    setShowModal(true);     // Show modal
  }, []);

  const styles = {
    container: { padding: '30px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f9fbfd' },
    header: { fontSize: '22px', marginBottom: '20px', color: '#2b2b2b' },
    controls: {
      display: 'flex',
      gap: '20px',
      marginBottom: '25px',
      flexWrap: 'wrap',
      alignItems: 'center',       // Corrected property name
      justifyContent: 'center'    // Optional: horizontal centering
    },
    input: { padding: '8px 10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' },
    th: { backgroundColor: '#e9eff5', padding: '10px', fontWeight: 600, textAlign: 'left', borderBottom: '1px solid #d4d4d4' },
    td: { padding: '10px', borderBottom: '1px solid #eee' }
  };

  return (
    <div style={styles.container}>
      <h4 className="mb-4">Select a employees</h4>
      <div style={styles.header}>Run Payroll: {frequency.charAt(0).toUpperCase() + frequency.slice(1)}</div>
      <div style={{ fontSize: '1rem', marginBottom: '10px', fontWeight: 500 }}>
        Pay Period: {payPeriods?.start || '—'} to {payPeriods?.end || '—'}
      </div>
      <div style={{ fontSize: '0.85rem', color: '#333' }}>
        <span style={{ backgroundColor: '#e8f8ec', padding: '2px 6px', borderRadius: '4px' }}>
          Highlighted
        </span>{' '}
        rows indicate employees marked as payroll users.
      </div>
      <div style={{ alignSelf: 'flex-end', fontWeight: 600, padding: '8px 0' }}>
        Total Employees: {employees.length}
      </div>
      {employees.length > 0 ? (
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>✔</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}> Rate </th>
                <th style={styles.th}>Regular Hours</th>
                <th style={styles.th}>Overtime</th>
                <th style={styles.th}>Bonus</th>
                {frequency === 'monthly' && (
                  <th style={styles.th}>Adjustments</th>
                )}
                <th style={styles.th}>Gross Pay</th>
                <th style={styles.th}>Memo</th>
                <th style={styles.th}>Validation Error</th>
              </tr>
            </thead>
            <tbody>
              {employees
                .slice()
                .sort((a, b) => (a.name || '').localeCompare(b.name || ''))

                .map((emp) => {
                  const editable = selectedEmployees.includes(emp.id);

                  const rowStyle = emp.payrolUser ? { backgroundColor: '#e8f8ec' } : {}; // Highlight if payrolUser

                  return (
                    <tr key={emp.id} style={rowStyle}>
                      <td style={styles.td}>
                        <input
                          type="checkbox"
                          checked={editable}
                          onChange={() => toggleEmployee(emp.id)}
                          // disabled={!!emp.validationError}
                          disabled={emp.validationError === 'Already generated'}
                          title={emp.validationError === 'Already generated' ? 'This pay stub is already generated and cannot be selected.' : ''}
                        />
                      </td>
                      <td style={styles.td}>{emp.name}</td>
                      <td style={styles.td}>{emp.type}</td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          value={parseFloat(emp.hourlyRate || 0).toFixed(2)}
                          onChange={(e) => handleChange(emp.id, 'hourlyRate', e.target.value)}
                          disabled
                          style={{ ...styles.input, width: '90px' }}
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          value={parseFloat(emp.regularHours || 0).toFixed(2)}
                          onChange={(e) => handleChange(emp.id, 'regularHours', e.target.value)}
                          disabled
                          style={{ ...styles.input, width: '70px' }}
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          value={parseFloat(emp.totalHours?.overTimeUser || 0).toFixed(2)}
                          disabled
                          style={{ ...styles.input, width: '70px' }}
                        />
                      </td>
                      <td style={styles.td}>
                        <input
                          type="number"
                          value={parseFloat(emp.bonus || 0).toFixed(2)}
                          onChange={(e) => handleChange(emp.id, 'bonus', e.target.value)}
                          disabled={!editable}
                          style={{ ...styles.input, width: '80px' }}
                        />
                      </td>
                      {frequency === 'monthly' && (
                        <td style={styles.td}>
                          <input
                            type="number"
                            value={parseFloat(emp.adjustments || 0).toFixed(2)}
                            onChange={(e) => handleChange(emp.id, 'adjustments', e.target.value)}
                            disabled={!editable}
                            step="0.01"
                            style={{ ...styles.input, width: '80px' }}
                          />
                        </td>
                      )}

                      <td style={styles.td}>
                        {currencySymbols[emp.currency?.toLowerCase()] || ''} {(emp.earnings?.grossPay || 0).toFixed(2)}
                      </td>
                      <td style={styles.td}>
                        <input
                          type="text"
                          value={emp.memo}
                          onChange={(e) => handleChange(emp.id, 'memo', e.target.value)}
                          disabled={!editable}
                          style={{ ...styles.input, width: '100%' }}
                        />
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          color:
                            emp.validationError === 'Already generated'
                              ? 'green'
                              : emp.validationError
                                ? 'red'
                                : '#444'
                        }}
                      >
                        <span title={emp.validationError}>
                          {emp.validationError?.length > 80
                            ? emp.validationError.slice(0, 80) + '…'
                            : emp.validationError || '—'}
                        </span>

                        {emp.validationError === 'Already generated' ? (
                          <Button
                            onClick={() => handleRegenerate(emp)}
                            variant="primary"
                            style={{ marginLeft: '8px' }}
                          >
                            Regenerate
                          </Button>
                        ) : (
                          emp.validationError &&
                          emp.validationError !== '—' &&
                          !emp.validationError.trim().startsWith('The first stub should start from') && (
                            <span
                              onClick={() => {
                                setSelectedEmp(emp);
                                setShowSettingsModal(true);
                                console.log("🧠 emp object:", emp);
                              }}
                              style={{
                                marginLeft: '8px',
                                color: '#007bff',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                              }}
                              title="Open employee settings"
                            >
                              Settings
                            </span>
                          )
                        )}
                      </td>




                    </tr>
                  );
                })}
            </tbody>


          </table>
        </div>
      ) : (
        <div style={{ padding: '10px', fontStyle: 'italic', color: '#666' }}>
          Please select both Month and Pay Period to view the payroll table.
        </div>
      )}
      {modalEmployee && (
        <Form>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Regenerate Pay Stub</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Read-only Pay Period */}
              <Form.Group className="mb-3">
                <Form.Label>Pay Period Start</Form.Label>
                <Form.Control type="text" value={payPeriods?.start || ''} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Pay Period End</Form.Label>
                <Form.Control type="text" value={payPeriods?.end || ''} readOnly />
              </Form.Group>

              {/* Editable Inputs */}
              <Form.Group className="mb-3">
                <Form.Label>Bonus</Form.Label>
                <Form.Control
                  type="number"
                  value={modalEmployee.bonus ?? ''}
                  onChange={(e) =>
                    setModalEmployee({
                      ...modalEmployee,
                      bonus: e.target.value === '' ? '' : parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Adjustments</Form.Label>
                <Form.Control
                  type="number"
                  value={modalEmployee.adjustments ?? ''}
                  onChange={(e) =>
                    setModalEmployee({
                      ...modalEmployee,
                      adjustments: e.target.value === '' ? '' : parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Memo</Form.Label>
                <Form.Control
                  type="text"
                  value={modalEmployee.memo ?? ''}
                  onChange={(e) =>
                    setModalEmployee({ ...modalEmployee, memo: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Weekend Premium Hours</Form.Label>
                <Form.Control
                  type="number"
                  value={modalEmployee.weekendPremiumHours ?? ''}
                  onChange={(e) =>
                    setModalEmployee({
                      ...modalEmployee,
                      weekendPremiumHours: e.target.value === '' ? '' : parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rate Per Hour</Form.Label>
                <Form.Control
                  type="number"
                  value={modalEmployee.ratePerHour ?? ''}
                  onChange={(e) =>
                    setModalEmployee({
                      ...modalEmployee,
                      ratePerHour: e.target.value === '' ? '' : parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Overtime Hours</Form.Label>
                <Form.Control
                  type="number"
                  value={modalEmployee.overTimeUser ?? ''}
                  onChange={(e) =>
                    setModalEmployee({
                      ...modalEmployee,
                      overTimeUser: e.target.value === '' ? '' : parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>User Hours</Form.Label>
                <Form.Control
                  type="number"
                  value={modalEmployee.userHours ?? ''}
                  onChange={(e) =>
                    setModalEmployee({
                      ...modalEmployee,
                      userHours: e.target.value === '' ? '' : parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={isSubmitting}
                onClick={async () => {
                  const payload = {
                    startDate: payPeriods?.start,
                    endDate: payPeriods?.end,
                    employeeData: [
                      {
                        userId: modalEmployee.id || modalEmployee.userId,
                        weekendPremiumHours: parseFloat(modalEmployee.weekendPremiumHours) || 0,
                        ratePerHour: parseFloat(modalEmployee.ratePerHour) || 0,
                        overTimeUser: parseFloat(modalEmployee.overTimeUser) || 0,
                        userHours: parseFloat(modalEmployee.userHours) || 0,
                        memo: modalEmployee.memo || '',
                        bonus: parseFloat(modalEmployee.bonus) || 0,
                        adjustments: parseFloat(modalEmployee.adjustments) || 0,
                        payrolUser: modalEmployee.payrolUser || false,
                      },
                    ],
                  };

                  try {
                    setIsSubmitting(true);
                    const token = localStorage.getItem('token');
                    const headers = {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    };

                    const response = await axios.post(
                      `${apiUrl}/owner/reGeneratePayStubsForBoth`,
                      payload,
                      { headers }
                    );
                    console.log('payload of re generation', payload)
                    // ✅ Replaced alert with snackbar
                    enqueueSnackbar("✅ Stub regenerated successfully!", {
                      variant: "success",
                      anchorOrigin: { vertical: "top", horizontal: "right" },
                    });
                    navigate('/PayStub_history');
                    setShowModal(false);
                  } catch (error) {
                    console.error("❌ Error:", error.response?.data || error.message);
                    enqueueSnackbar("❌ Failed to regenerate stub.", {
                      variant: "error",
                      anchorOrigin: { vertical: "top", horizontal: "right" },
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Regenerating...
                  </>
                ) : (
                  'Regenerate'
                )}
              </Button>

            </Modal.Footer>
          </Modal>
        </Form>
      )}
      {showSettingsModal && selectedEmp && (
        <Modal show={showSettingsModal} onHide={() => setShowSettingsModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Stub Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Shift Premium Rate</label>
                  <input
                    type="number"
                    className="form-control"
                    value={shiftPremiumRate}
                    onChange={(e) => setShiftPremiumRate(e.target.value)}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Overtime Rate</label>
                  <input
                    type="number"
                    className="form-control"
                    value={overtimeRate}
                    onChange={(e) => setOvertimeRate(e.target.value)}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Hourly Rate</label>
                  <input
                    type="number"
                    className="form-control"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Tax Country</label>
                  <select
                    className="form-control"
                    value={appliedTaxCountry}
                    onChange={(e) => {
                      const country = e.target.value;
                      setAppliedTaxCountry(country);
                      setAppliedTaxes([]);
                      setAppliedDeductions([]);

                      // Automatically set currency based on selected country
                      const autoCurrency = countryCurrencyMap[country];
                      if (autoCurrency) {
                        setCurrency(autoCurrency);
                      }
                    }}
                  >
                    <option value="">Select Country</option>
                    <option value="canada">Canada</option>
                    <option value="usa">USA</option>
                    <option value="pakistan">Pakistan</option>
                    <option value="philippines">Philippines</option>
                    <option value="india">India</option>
                    <option value="ksa">KSA</option>
                  </select>

                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Tax State</label>
                  {["canada", "usa", "india"].includes(appliedTaxCountry) ? (
                    <select
                      className="form-control"
                      value={appliedTaxState}
                      onChange={(e) => setAppliedTaxState(e.target.value)}
                    >
                      <option value="">Select State</option>
                      {countryStateMap[appliedTaxCountry]?.map((state) => (
                        <option key={state} value={state}>
                          {appliedTaxCountry === "usa"
                            ? usStateNameToCode[state] || state
                            : state}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input type="text" className="form-control" disabled placeholder="No State" />
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Applied Taxes</label>
                  <div className="border rounded p-2" style={{ maxHeight: 150, overflowY: "auto" }}>
                    {appliedTaxCountry && taxDeductionMap[appliedTaxCountry] ? (
                      taxDeductionMap[appliedTaxCountry].taxes.map((tax) => (
                        <div key={tax} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
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
                    {appliedTaxCountry && taxDeductionMap[appliedTaxCountry] ? (
                      taxDeductionMap[appliedTaxCountry].deductions.map((deduction) => (
                        <div key={deduction} className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
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

                <div className="col-md-6 mb-3">
                  <label className="form-label">Currency</label>
                  <select className="form-control" value={currency} onChange={(e) => setCurrency(e.target.value)}>
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

                <div className="col-md-6 mb-3">
                  <label className="form-label">Vacation Pay</label>
                  <input
                    type="number"
                    className="form-control"
                    value={vacationPay}
                    onChange={(e) => setVacationPay(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Pay Period Type</label>
                  <select
                    className="form-control"
                    value={payPeriodType}
                    onChange={(e) => setPayPeriodType(e.target.value)}
                  >
                    <option value="">Select Period</option>
                    {(pay_type === '' || pay_type === 'hourly') && (
                      <>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-Weekly</option>
                      </>
                    )}
                    {(pay_type === '' || pay_type === 'monthly') && (
                      <option value="monthly">Monthly</option>
                    )}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Pay Rate Type</label>
                  <select
                    className="form-control"
                    value={pay_type}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPayType(value);
                      // Ensure monthly pay type has monthly period
                      if (value === "monthly") {
                        setPayPeriodType("monthly");
                      } else if (payPeriodType === "monthly") {
                        setPayPeriodType(""); // reset if inconsistent
                      }
                    }}
                  >
                    <option value="">Select Type</option>
                    <option value="hourly">Hourly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSettingsModal(false)}>
              Cancel
            </Button>
            <Button className="text-white" style={{ backgroundColor: "#5CB85C" }} onClick={updateStubSettings}>
              Save Stub Settings
            </Button>
          </Modal.Footer>
        </Modal>
      )}


    </div>
  );
};

export default PayrollTable;