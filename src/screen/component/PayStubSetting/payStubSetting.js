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
    appliedTaxes, setAppliedTaxes,
    appliedDeductions, setAppliedDeductions, // ✅ Add this
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

    const taxDeductionMap = {
        canada: {
            taxes: ["federal", "provincial"],
            deductions: ["cpp", "ei"]
        },
        india: {
            taxes: ["income tax", "gst", "professional tax"],
            deductions: ["pf", "esi", "section 80c", "section 80d"]
        },
        usa: {
            taxes: ["federal income tax", "state income tax", "social security tax", "medicare tax", "futa"],
            deductions: ["fica tax", "401(k) contributions", "hsa"]
        },
        philippines: {
            taxes: ["income tax", "vat", "estate tax"],
            deductions: ["sss", "philhealth", "pag-ibig"]
        },
        pakistan: {
            taxes: ["income tax", "sales tax", "excise duty"],
            deductions: ["social security", "provident fund", "zakat"]
        },
        ksa: {
            taxes: ["income tax (for foreign workers)", "vat", "khums"],
            deductions: ["gosi", "social insurance"]
        }
    };

    return (
        <div className="container" style={{ marginTop: "30px" }}>
            <p className="h4 mb-4">Pay Stub</p>

            <div className="row">
                <div className="col-md-5">
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

                <div className="col-md-3 mb-3">
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
                        <option value="philippines">Philippines</option>
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

                <div className="col-md-6 mb-3">
                    <label className="form-label">Applied Taxes</label>
                    <div className="border rounded p-2" style={{ maxHeight: 150, overflowY: "auto" }}>
                        {appliedTaxCountry && taxDeductionMap[appliedTaxCountry] ? (
                            taxDeductionMap[appliedTaxCountry].taxes.map((tax) => (
                                <div key={tax} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`tax-${tax}`}
                                        value={tax}
                                        checked={appliedTaxes.includes(tax)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            if (checked) {
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
                            <p className="text-muted">Please select a country to view tax options.</p>
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
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`deduction-${deduction}`}
                                        value={deduction}
                                        checked={appliedDeductions.includes(deduction)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            if (checked) {
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
                            <p className="text-muted">Please select a country to view deduction options.</p>
                        )}
                    </div>
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
                        onChange={(e) => {
                            const value = e.target.value;
                            setPayPeriodType(value);

                            // Auto-adjust Pay Type based on Pay Period selection
                            if (value === "monthly") {
                                setPayType("monthly");
                            } else if (pay_type === "monthly") {
                                setPayType("hourly");
                            }
                        }}
                    >
                        <option value="">Select Period</option>
                        {(pay_type === "" || pay_type === "hourly") && (
                            <>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-Weekly</option>
                            </>
                        )}
                        {(pay_type === "" || pay_type === "monthly") && (
                            <option value="monthly">Monthly</option>
                        )}
                    </select>
                </div>

                {/* PAY TYPE DROPDOWN */}
                <div className="col-md-6 mb-4">
                    <label className="form-label">Pay Type
                        <small className="text-muted d-block">(Please select either Hourly or Monthly pay type)</small>
                    </label>
                    <select
                        className="form-select"
                        value={pay_type}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPayType(value);

                            // Auto-adjust Pay Period if needed
                            if (value === "monthly") {
                                setPayPeriodType("monthly");
                            } else if (payPeriodType === "monthly") {
                                setPayPeriodType("");
                            }
                        }}
                    >
                        <option value="">Select Type</option>
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
