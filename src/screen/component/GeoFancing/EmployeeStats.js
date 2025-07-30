import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeStats = () => {
     const navigate = useNavigate();
    const tokens = localStorage.getItem("token");
    const apiUrlS = 'https://myuniversallanguages.com:9093/api/v1/tracker';
    let headers = {
            Authorization: 'Bearer ' + tokens,
        }
const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    activeGeofence: 0,
    departments: 0,
  });
    const fetchDashboardData  = async () => {
      try {
        const response = await axios.get(`${apiUrlS}/getDashboardData`, 
            {headers}
        );
        if (response.data.success) {
            setDashboardData(response.data.data);
            console.log("response.data.data",response.data.data)
          } else {
            console.error('API request failed:', response.data);
          }
      } catch (error) {
        console.error('Error fetching dashboard data:',error);
      }
    };

    useEffect(() => {
      fetchDashboardData()
    }, [])
    
    return (
        <div className="container"> {/* Container for proper left-right padding */}
            <div className="row g-3"> {/* g-3 for better gap between columns */}

                {/* Total Employees */}
                <div className="col-md-4">
                    <div className="border rounded-3 p-3 bg-white">
                        <h6 className="fw-semibold mb-1" style={{ fontSize: '14px' }}>Total Employees</h6>
                        <div className="text-muted mb-2" style={{ fontSize: '13px' }}>Company-wide staff</div>
                        <div className="fw-bold" style={{ fontSize: '26px' }}>{dashboardData.totalEmployees}</div>
                    </div>
                </div>

                {/* Active Now */}
                <div className="col-md-4">
                    <div className="border rounded-3 p-3 bg-white">
                        <h6 className="fw-semibold mb-1" style={{ fontSize: '14px' }}>Active Now</h6>
                        <div className="text-muted mb-2" style={{ fontSize: '13px' }}>On duty employees</div>
                        <div className="fw-bold" style={{ fontSize: '26px', color: '#22c55e' }}>{dashboardData.activeGeofence}</div>
                    </div>
                </div>

                {/* Departments */}
                <div className="col-md-4">
                    <div className="border rounded-3 p-3 bg-white">
                        <h6 className="fw-semibold mb-1" style={{ fontSize: '14px' }}>Departments</h6>
                        <div className="text-muted mb-2" style={{ fontSize: '13px' }}>Team breakdown</div>
                        <div className="fw-bold" style={{ fontSize: '26px' }}>{dashboardData.departments}</div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default EmployeeStats;
