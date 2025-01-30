import React, { useState } from "react";
import passwordIcon from "../images/passwordIcon.webp";
import edit from "../images/editIcon.webp";
import deleteIcon from "../images/deleteIcon.webp";
import line from "../images/line.webp";
import AdminHead from "../screen/component/adminHeadSection";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import user from "../images/user-account.webp";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import axios from "axios";
import moment from "moment-timezone";

function AccountAdmin() {

    const [show, setShow] = useState(false);
    const [updatePassword, setUpdatePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [verify, setVerify] = useState(false);
    let token = localStorage.getItem('token');
    const navigate = useNavigate('');
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    
    const items = jwtDecode(JSON.stringify(token));

    let headers = {
        Authorization: 'Bearer ' + token,
    }

    const handleShow = () => setShow(true);

    async function deleteMyAccount() {
        const res = await fetch(`${apiUrl}/signin/userDelete/${items._id}`, {
            headers,
            method: "DELETE"
        })
        try {
            if (res.status === 200) {
                console.log((await res.json()));
                localStorage.removeItem("items");
                localStorage.removeItem("token");
                navigate("/signin")
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    async function verifyPassword() {
        const res = await fetch(`${apiUrl}/signin/users/Verifypass`, {
            headers,
            method: "PATCH",
            body: JSON.stringify({
                oldPassword: oldPassword
            }),
        })
        try {
            if (res.status === 200) {
                console.log((await res.json()));
                enqueueSnackbar("password verify successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    
    const updateMyPassword = async () => {
        setUpdatePassword(false)
        const res = await fetch(`${apiUrl}/signin/users/Update`, {
            headers,
            method: "PATCH",
            body: JSON.stringify({
                password: password
            }),
        })
        try {
            if (res.status === 200) {
                console.log((await res.json()));
                enqueueSnackbar("password updated successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const offsetInMinutes = moment.tz(items.timezone).utcOffset();
    const offsetInHours = offsetInMinutes / 60;
    const offsetSign = offsetInHours >= 0 ? '+' : '-';
    const formattedOffset = `${offsetSign}${Math.abs(offsetInHours)}`;

    return (
        <div>
            <SnackbarProvider />
            {show ? <Modal show={show} onHide={() => setShow(false)} animation={false} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>Are you sure want to delete your account ?</p>
                    <p>All of the time tracking data and screenshots for this employee will be lost. This can not be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={deleteMyAccount}>
                        DELETE
                    </button>
                    <button className="teamActionButton" onClick={() => setShow(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            {updatePassword ? <Modal show={updatePassword} onHide={() => setShow(false)} animation={false} centered>
                <Modal.Body>
                <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>{verify ? "Update password" : "Old password"}</p>
                    {verify ? (
                        <input placeholder="Enter your new password" onChange={(e) => setPassword(e.target.value)} style={{
                            fontSize: "18px",
                            padding: "5px 10px",
                            width: "100%",
                            border: "1px solid #cacaca"
                        }} />
                    ) : (
                        <input placeholder="Enter your old password" onChange={(e) => setOldPassword(e.target.value)} style={{
                            fontSize: "18px",
                            padding: "5px 10px",
                            width: "100%",
                            border: "1px solid #cacaca"
                        }} />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={verify === true ? updateMyPassword : verifyPassword}>
                        UPDATE
                    </button>
                    <button className="teamActionButton" onClick={() => setUpdatePassword(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            <div className="container">
                <div className="userHeader">
                    <div className="headerTop">
                        <img src={user} />
                        <h5>My Account </h5>
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="accountContainer">
                        <p className="asadMehmood">{items?.name} <span>{items?.company}</span></p>
                        <p className="userEmail">
                            {items?.email}
                            <br />
                            {items?.timezone}
                            <br />
                            UTC {formattedOffset}
                        </p>
                        <div className="accountDiv">
                            <div onClick={() => navigate('/profile')} className="accountEditDiv"><div><img src={edit} /></div><p>Edit Profile</p></div>
                            <div onClick={() => setUpdatePassword(true)} className="accountEditDiv"><div><img src={passwordIcon} /></div><p>Change Password</p></div>
                            <div onClick={handleShow} className="accountEditDiv"><div><img src={deleteIcon} /></div><p>Delete my Account</p></div>
                        </div>
                        <p className="companyPlan">Company plan</p>
                        <p className="userEmail">If you track your time for other companies - you do not need a plan and do not have to pay - your company pays for you.</p>
                    </div>
                </div>
            </div>
            <img className="accountLine" src={line} />
        </div>
    )

}

export default AccountAdmin;