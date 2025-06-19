import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const PayrollFilterControls = ({
  frequency,
  apiUrl,
  token,
  originalEmployees,
  onFilterChange,
  setFilterLoading,
}) => {
  const [month, setMonth] = useState('');
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchPayPeriods = async (selectedMonth) => {
    try {
      const response = await fetch(
        `${apiUrl}/owner/paystubs/getPayPeriodDates?date=${selectedMonth}&type=${frequency}`,
        { method: "GET", headers }
      );
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setPeriods(data.data);
      } else if (typeof data.data === 'string') {
        setPeriods([data.data]);
      }
    } catch (error) {
      console.error("Failed to fetch pay periods:", error);
    }
  };

  const handleMonthChange = (e) => {
    const selected = e.target.value;
    setMonth(selected);
    fetchPayPeriods(selected);
    setSelectedPeriod('');
  };
  const selectedMonthFromPeriod = (period) => {
    const [startStr] = period.split(" - ");
    const [mm, dd, yyyy] = startStr.split("/");
    return `${yyyy}-${mm.padStart(2, '0')}`; // Format: "YYYY-MM"
  };

  const handlePeriodChange = async (e) => {
    const selected = e.target.value;
    setSelectedPeriod(selected);

    if (!selected || !frequency) return;

    const [startStr, endStr] = selected.split(" - ");
    const formatDate = (dateStr) => {
      const [month, day, year] = dateStr.split("/");
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };
    const startDate = formatDate(startStr);
    const endDate = formatDate(endStr);

    if (setFilterLoading) setFilterLoading(true); // ✅ Start loading

    try {
      const response = await fetch(
        `${apiUrl}/owner/filterUsersBypayPeriod/${frequency}?startDate=${startDate}&endDate=${endDate}`,
        { method: "GET", headers }
      );
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        onFilterChange({
          employees: result.data,
          month: selectedMonthFromPeriod(selected),
          payPeriod: { start: startDate, end: endDate },
          selectedPeriod: selected
        });
      }
    } catch (error) {
      console.error("Error fetching filtered employees:", error);
    } finally {
      if (setFilterLoading) setFilterLoading(false); // ✅ End loading
    }
  };


  const handleReset = () => {
    setMonth('');
    setSelectedPeriod('');
    setPeriods([]);
    onFilterChange({
      employees: originalEmployees,
      month: '',
      payPeriod: { start: '', end: '' },
      selectedPeriod: ''
    });
  };

  const styles = {
    input: { padding: '8px 10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
      <h4 className="w-100 my-4">Paystub filter</h4>

      <Form.Group>
        <Form.Label>Select Month</Form.Label>
        <Form.Control type="month" value={month} onChange={handleMonthChange} />
      </Form.Group>

      <Form.Group>
        <Form.Label>Select Pay Period</Form.Label>
        <Form.Select value={selectedPeriod} onChange={handlePeriodChange} disabled={periods.length === 0}>
          <option value="">-- Select Period --</option>
          {periods.map((p, idx) => <option key={idx} value={p}>{p}</option>)}
        </Form.Select>
      </Form.Group>

      <div>
        <label>Frequency:</label><br />
        <p style={{ ...styles.input, marginBottom: 0 }}>{frequency.charAt(0).toUpperCase() + frequency.slice(1)}</p>
      </div>

      <Button variant="secondary" onClick={handleReset} style={{ marginTop: '24px', height: '38px' }}>
        Reset Filters
      </Button>

      {/* <div style={{ fontSize: '0.85rem', color: '#333' }}>
        <span style={{ backgroundColor: '#e8f8ec', padding: '2px 6px', borderRadius: '4px' }}>
          Highlighted
        </span>{' '}
        rows indicate employees marked as payroll users.
      </div> */}
    </div>
  );
};

export default PayrollFilterControls;
