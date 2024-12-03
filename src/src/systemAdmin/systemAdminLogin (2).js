
import React, { useState } from "react";
import { useNavigate } from "react-router";
import email from '../../src/images/emailIcon.webp';
import password from "../../src/images/passwordIcon.webp";
import jwtDecode from "jwt-decode";
import { FerrisWheelSpinner } from 'react-spinner-overlay'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import axios from "axios";

function SystemAdminLogin() {

    const [model, setModel] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false)
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('items'));

    const loginUser = async () => {
        if (model?.email === "" || model?.password === "") {
            enqueueSnackbar("Email and password is required", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            return null
        }
        else {
            setLoading(true)
            try {
                const response = await axios.post(`${apiUrl}/signin/ownerSignIn`, {
                    email: model?.email,
                    password: model?.password,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                console.log(response);
                const token = response.data.token;
                const decoded = jwtDecode(token);
                localStorage.setItem("items", JSON.stringify(decoded));
                localStorage.setItem("adminToken", response.data.token);
                navigate("/systemAdminDashboard")
            }
            catch (error) {
                setLoading(false)
                console.log("catch error", error);
                enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
        };
    }

    const fillModel = (key, val) => {
        setModel(prevModel => ({ ...prevModel, [key]: val }));
    };

    return (
        <div>
            <SnackbarProvider />
            <div className="container d-flex justify-content-center align-items-center">
                <div className="text-center text-white">
                    <div className="mainInputDiv">
                        <p className="accessFont">Login to Your account</p>
                        <div className="inputDiv">
                            <div><img src={email} alt="Email" /></div>
                            <input value={model.email} onChange={(e) => fillModel("email", e.target.value)} required placeholder="Email" />
                        </div>
                        <div className="inputDiv">
                            <div><img src={password} alt="Password" /></div>
                            <input value={model.password} type="password" className="text-black" onChange={(e) => fillModel("password", e.target.value)} placeholder="Password (8 or more characters)" />
                        </div>
                        <button disabled={loading} onClick={loginUser} className={loading ? "disabledAccountButton" : "accountButton"}>{loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Login"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SystemAdminLogin;