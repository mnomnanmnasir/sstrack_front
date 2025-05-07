import jwtDecode from 'jwt-decode';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Form } from 'react-bootstrap';

const PayrollTable = ({ employees: initialEmployees = [], frequency: parentFrequency, onSelectionChange }) => {
  const token = localStorage.getItem('token');
  const user = useMemo(() => jwtDecode(token), [token]);
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

  const [payPeriod, setPayPeriod] = useState({ start: '2025-04-21', end: '2025-04-27' });
  const [payDate, setPayDate] = useState('2025-05-02');
  const [frequency] = useState(parentFrequency || '');
  const [month, setMonth] = useState('');
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);

  const fetchPayPeriods = async (selectedMonth) => {
    try {
      const response = await fetch(
        `${apiUrl}/owner/paystubs/getPayPeriodDates?date=${selectedMonth}&type=${frequency}`,
        { method: "GET", headers }
      );
      const data = await response.json();
      if (Array.isArray(data.data)) setPeriods(data.data);
      else console.warn("Unexpected API format:", data);
    } catch (error) {
      console.error("Failed to fetch pay periods:", error);
    }
  };

  const handleMonthChange = (e) => {
    const selected = e.target.value;
    console.log('monthhhhh', e)
    setMonth(selected);
    fetchPayPeriods(selected);
  };

  useEffect(() => {
    if (Array.isArray(initialEmployees)) {
      const workingDays = getWorkingDays(payPeriod.start, payPeriod.end);
      const defaultRegularHours = workingDays * 8;
      const mapped = initialEmployees.map((emp) => ({
        id: emp._id,
        name: emp.name,
        type: emp.billingInfo?.payType === 'hourly' ? 'Hourly' : 'Monthly',
        regularHours: defaultRegularHours,
        overtime: 0,
        hourlyRate: emp.billingInfo?.ratePerHour || 0,
        bonus: 0.0,
        memo: '',
        payMethod: 'Bank transfer',
      }));
      setEmployees(mapped);
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

  const calculateGrossPay = (emp) => {
    const regularPay = emp.regularHours * emp.hourlyRate;
    const overtimePay = emp.overtime * emp.hourlyRate * 1.5;
    return (regularPay + overtimePay + emp.bonus).toFixed(2);
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
      const selected = employees.filter(emp => selectedEmployees.includes(emp.id));
      const totalGross = selected.reduce((sum, emp) => sum + parseFloat(calculateGrossPay(emp)), 0);
      const employerContrib = selected.length * 0.41; // or whatever logic applies

      onSelectionChange({
        selectedEmployeeIds: selectedEmployees,
        payPeriodStart: payPeriod.start,
        payPeriodEnd: payPeriod.end,
        month,
        totalGross,
        employerContrib,
        payDate // already set in useState
      });
    }
  }, [selectedEmployees, payPeriod, employees, payDate]);


  const getWorkingDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    let count = 0;
    while (startDate <= endDate) {
      const day = startDate.getDay();
      if (day !== 0 && day !== 6) count++;
      startDate.setDate(startDate.getDate() + 1);
    }
    return count;
  };

  const styles = {
    container: { padding: '30px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f9fbfd' },
    header: { fontSize: '22px', marginBottom: '20px', color: '#2b2b2b' },
    controls: { display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' },
    input: { padding: '8px 10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' },
    th: { backgroundColor: '#e9eff5', padding: '10px', fontWeight: 600, textAlign: 'left', borderBottom: '1px solid #d4d4d4' },
    td: { padding: '10px', borderBottom: '1px solid #eee' }
  };

  return (
    <div style={styles.container}>
      {/* <div style={styles.header}>Run Payroll: Every Friday 2</div> */}

      <div style={styles.controls}>
        <Form.Group className="mb-3">
          <Form.Label>Select Month</Form.Label>
          <Form.Control type="month" value={month} onChange={handleMonthChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Pay Period</Form.Label>
          <Form.Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            disabled={periods.length === 0}
          >
            <option value="">-- Select Period --</option>
            {periods.map((p, idx) => <option key={idx} value={p}>{p}</option>)}
          </Form.Select>
        </Form.Group>

        <div>
          <label>Frequency:</label><br />
          <p style={{ ...styles.input, marginBottom: 0 }}>{frequency.charAt(0).toUpperCase() + frequency.slice(1)}</p>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>✔</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}> Rate ($)</th>
            <th style={styles.th}>Regular Hours</th>
            <th style={styles.th}>Overtime</th>
            <th style={styles.th}>Bonus</th>
            <th style={styles.th}>Gross Pay</th>
            <th style={styles.th}>Memo</th>
            <th style={styles.th}>Pay Method</th>
          </tr>
        </thead>
        <tbody>
          {employees
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((emp) => {
              const editable = selectedEmployees.includes(emp.id);
              return (
                <tr key={emp.id}>
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      checked={editable}
                      onChange={() => toggleEmployee(emp.id)}
                    />
                  </td>
                  <td style={styles.td}>{emp.name}</td>
                  <td style={styles.td}>{emp.type}</td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      value={emp.hourlyRate}
                      onChange={(e) => handleChange(emp.id, 'hourlyRate', e.target.value)}
                      disabled={!editable}
                      style={{ ...styles.input, width: '90px' }}
                    />
                  </td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      value={emp.regularHours}
                      onChange={(e) => handleChange(emp.id, 'regularHours', e.target.value)}
                      disabled={!editable}
                      style={{ ...styles.input, width: '70px' }}
                    />
                  </td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      value={emp.overtime}
                      onChange={(e) => handleChange(emp.id, 'overtime', e.target.value)}
                      disabled={!editable}
                      style={{ ...styles.input, width: '70px' }}
                    />
                  </td>
                  <td style={styles.td}>
                    <input
                      type="number"
                      value={emp.bonus}
                      onChange={(e) => handleChange(emp.id, 'bonus', e.target.value)}
                      disabled={!editable}
                      style={{ ...styles.input, width: '80px' }}
                    />
                  </td>
                  <td style={styles.td}>${calculateGrossPay(emp)}</td>
                  <td style={styles.td}>
                    <input
                      type="text"
                      value={emp.memo}
                      onChange={(e) => handleChange(emp.id, 'memo', e.target.value)}
                      disabled={!editable}
                      style={{ ...styles.input, width: '100%' }}
                    />
                  </td>
                  <td style={styles.td}>{emp.payMethod}</td>
                </tr>
              );
            })}
        </tbody>

      </table>
    </div>
  );
};

export default PayrollTable;