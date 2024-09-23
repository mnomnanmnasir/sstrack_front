import React from 'react';
import circle from "../../images/circle.webp"
import { useLocation, useNavigate } from "react-router-dom";

const SystemAdminHeader = () => {

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
                    <div className={location.pathname === "/addCompany" ? "active-tab" : "ownerSectionUser"}>
                        <p style={{ margin: 0 }} onClick={() => navigate('/addCompany')} >Add Company</p>
                    </div>
                </div>
                <div>
                    <div className="ownerSectionCompany d-flex align-items-center cursor-default">
                        <div><img src={circle} /></div>
                        <p className="m-0">System Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SystemAdminHeader;