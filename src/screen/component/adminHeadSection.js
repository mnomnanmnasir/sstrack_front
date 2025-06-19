import React from "react";
import circle from "../../images/circle.webp"
import { useLocation, useNavigate } from "react-router-dom";

function AdminHead() {

    let token = localStorage.getItem('token');
    const items = JSON.parse(localStorage.getItem('items'));
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div className="cursor-pointer">
            <div
                className="d-flex justify-content-between align-items-center"
                style={{
                    backgroundColor: "white",
                    padding: "10px 20px",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                    margin: "0 30px 0 30px",
                }}>
                <div className="d-flex gap-1 align-items-center">
                    <div className={location.pathname === "/dashboard" || location.pathname === "/admindashboard/adminuser" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/dashboard')} >Dashboard</p>
                    </div>
                    {/* <div className={location.pathname === "/company-owner-user-signup" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/company-owner-user-signup')}>Add User</p>
                    </div> */}
                    <div className={location.pathname === "/adminteam" || location.pathname === "/admindashboard/admin-user-signup" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/adminteam')}>Team</p>
                    </div>
                    <div className={location.pathname === "/admin-reports" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/admin-reports')}>Reports</p>
                    </div>
                    {/* <div className={location.pathname === "/setting" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/setting')}>Settings</p>
                    </div>
                    <div className={location.pathname === "/adminProject" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/adminProject')}>Project</p>
                    </div>
                    <div className={location.pathname === "/admin-reports" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/admin-reports')}>Reports</p>
                    </div> */}
                </div>
                <div>
                    <div className="ownerSectionCompany d-flex align-items-center cursor-default">
                        <div><img src={circle} /></div>
                        <p className="m-0">{items?.company}</p>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default AdminHead;