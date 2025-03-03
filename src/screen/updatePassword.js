import React, { useState } from "react";
import Header from "../screen/component/header";
import email from '../images/email.webp';
import Footer from "./component/footer";
import line from '../images/line.webp'
import axios from "axios";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import { useNavigate, useParams } from "react-router-dom";
import { setLogout } from "../store/timelineSlice";
import { useDispatch } from "react-redux";
// import Header from '../screen/component/header';

function UpdatePassword() {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const params = useParams()

    const handleUpdatePassword = async () => {
        if (password === "") {
            enqueueSnackbar("Password is required", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            return null
        }
        setLoading(true)
        try {
            const response = await axios.patch(`${apiUrl}/signin/users/update-password/${localStorage.getItem("verification_id")}`, {
                password: password,
            })
            if (response.status) {
                setLoading(false)
                enqueueSnackbar(response?.data?.message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                setTimeout(() => {
                    if (localStorage.getItem("token") !== null) {
                        localStorage.removeItem("items");
                        localStorage.removeItem("token");
                        dispatch(setLogout())
                        navigate('/')
                        window.location.reload()
                    }
                    else {
                        navigate("/dashboard")
                    }
                }, 1000);
                console.log("response ====>", response);
            }
        }
        catch (error) {
            setLoading(false)
            enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            console.log("catch error", error);
        }
    };

    return (
        <div>
            <SnackbarProvider />
            <Header />
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="mainInputDiv"
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            handleUpdatePassword()
                        }
                    }}>
                    <p className="getback">Create new password</p>
                    <div className="inputDiv">
                        <div><img src={email} /></div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New password"
                        />
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <button disabled={loading} onClick={handleUpdatePassword} className={loading ? "disabledAccountButton" : "accountButton"}>
                            {loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Update"}
                        </button>
                    </div>
                </div>
            </div>
            {/* <img className="lines" src={line} /> */}
        </div>
    )
}

export default UpdatePassword;