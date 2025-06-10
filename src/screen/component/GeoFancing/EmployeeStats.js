import React from 'react';

const EmployeeStats = () => {
    return (
        <div className="container"> {/* Container for proper left-right padding */}
            <div className="row g-3"> {/* g-3 for better gap between columns */}

                {/* Total Employees */}
                <div className="col-md-4">
                    <div className="border rounded-3 p-3 bg-white">
                        <h6 className="fw-semibold mb-1" style={{ fontSize: '14px' }}>Total Employees</h6>
                        <div className="text-muted mb-2" style={{ fontSize: '13px' }}>Company-wide staff</div>
                        <div className="fw-bold" style={{ fontSize: '26px' }}>5</div>
                    </div>
                </div>

                {/* Active Now */}
                <div className="col-md-4">
                    <div className="border rounded-3 p-3 bg-white">
                        <h6 className="fw-semibold mb-1" style={{ fontSize: '14px' }}>Active Now</h6>
                        <div className="text-muted mb-2" style={{ fontSize: '13px' }}>On duty employees</div>
                        <div className="fw-bold" style={{ fontSize: '26px', color: '#22c55e' }}>3</div>
                    </div>
                </div>

                {/* Departments */}
                <div className="col-md-4">
                    <div className="border rounded-3 p-3 bg-white">
                        <h6 className="fw-semibold mb-1" style={{ fontSize: '14px' }}>Departments</h6>
                        <div className="text-muted mb-2" style={{ fontSize: '13px' }}>Team breakdown</div>
                        <div className="fw-bold" style={{ fontSize: '26px' }}>4</div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default EmployeeStats;
