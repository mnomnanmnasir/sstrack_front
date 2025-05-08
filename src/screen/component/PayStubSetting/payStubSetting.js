import React from 'react';

const PayStubSettings = ({
    shiftPremiumRate,
    setShiftPremiumRate,
    overtimeRate,
    setOvertimeRate,
    hourlyRate,
    setHourlyRate,
    appliedTaxCountry,
    setAppliedTaxCountry,
    appliedTaxState,
    setAppliedTaxState,
    currency,
    setCurrency,
    vacationPay,
    setVacationPay,
    payPeriodType,
    setPayPeriodType,
    pay_type,
    setPayType,
    countryStateMap,
    usStateNameToCode,
    updateStubSettings,
}) => {
    return (
        <div className="container" style={{ marginTop: "30px" }}>
            <p className="h4 mb-4">Pay Stub</p>

            <div className="row">
                <div className="col-md-4 mb-3">
                    <label className="form-label">Shift Premium Rate</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter Shift Premium Rate"
                        value={shiftPremiumRate || ''}
                        onChange={(e) => setShiftPremiumRate(e.target.value)}
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">Overtime Rate</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter Overtime Rate"
                        value={overtimeRate || ''}
                        onChange={(e) => setOvertimeRate(e.target.value)}
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">Hourly Rate</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter Hourly Rate"
                        value={hourlyRate || ''}
                        onChange={(e) => setHourlyRate(e.target.value)}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Applied Tax Country</label>
                    <select
                        className="form-control"
                        value={appliedTaxCountry}
                        onChange={(e) => setAppliedTaxCountry(e.target.value)}
                    >
                        <option value="">Select Country</option>
                        <option value="canada">Canada</option>
                        <option value="usa">USA</option>
                        <option value="pakistan">Pakistan</option>
                        <option value="philiphine">Philipine</option>
                        <option value="india">india</option>
                        <option value="ksa">ksa</option>
                    </select>
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Applied Tax State</label>
                    {["canada", "usa", "india"].includes(appliedTaxCountry) ? (
                        <select
                            className="form-control"
                            value={appliedTaxState}
                            onChange={(e) => setAppliedTaxState(e.target.value)}
                        >
                            <option value="">Select State</option>
                            {countryStateMap[appliedTaxCountry].map((state) => (
                                <option key={state} value={state}>
                                    {appliedTaxCountry === "usa" ? `${state}` : state}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            className="form-control"
                            placeholder="No State"
                            disabled
                        />
                    )}
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Currency</label>
                    <select
                        className="form-control"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <option value="">Select Currency</option>
                        <option value="USD">USD</option>
                        <option value="QAR">QAR</option>
                        <option value="PKR">PKR</option>
                        <option value="SAR">SAR</option>
                        <option value="AED">AED</option>
                        <option value="PHP">PHP</option>
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Vacation Pay</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter Vacation Pay"
                        value={vacationPay || ''}
                        onChange={(e) => setVacationPay(e.target.value)}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <label className="form-label">Pay Period Type
                        <small className="text-muted d-block">(Please select either Weekly or Bi-Weekly pay period)</small>
                    </label>
                    <select
                        className="form-select"
                        value={payPeriodType}
                        onChange={(e) => setPayPeriodType(e.target.value)}
                    >
                        <option value="">Select Period</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div className="col-md-6 mb-4">
                    <label className="form-label">Pay Type
                        <small className="text-muted d-block">(Please select either Hourly or Monthly pay type)</small>
                    </label>
                    <select
                        className="form-select"
                        value={pay_type}
                        onChange={(e) => setPayType(e.target.value)}
                    >
                        {/* <option value="">Select Type</option> */}
                        <option value="hourly">Hourly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            </div>

            <button className="btn w-100 text-white" style={{ backgroundColor: '#5CB85C' }} onClick={updateStubSettings}>
                Save Stub Settings
            </button>
        </div>
    );
};

export default PayStubSettings;
