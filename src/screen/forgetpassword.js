import React, { useState } from "react";
import emailIcon from '../images/email.webp';
import line from '../images/line.webp'
import axios from "axios";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSendLink() {
        if (email === "") {
            enqueueSnackbar("Email is required", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            return null
        }
        try {
            setLoading(true)
            const response = await axios.post(`${apiUrl}/superAdmin/resetpassword`, {
                email: email
            })
            if (response.status) {
                console.log(response);
                localStorage.setItem("verification_id", response.data.user._id)
                setLoading(false)
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                localStorage.setItem("email", email)
                setTimeout(() => {
                    navigate("/verification-code")
                }, 2000);
            }
        }
        catch (error) {
            console.log("catch error ===>", error);
            setLoading(false)
            enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        }
    }

    return (
        <div>
            <SnackbarProvider />
            <div className="maininputdivs"
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        handleSendLink()
                    }
                }}>
                <div className="mainInputDiv">
                    <p className="getback">Want to get back into your account ?</p>
                    <div className="inputDiv">
                        <img src={emailIcon} />
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    <div style={{
                        textAlign: "center"
                    }}>
                        <button disabled={loading} onClick={handleSendLink} className={loading ? "disabledAccountButton2" : "saveButton"}>
                            {loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Send Code"}
                        </button>
                    </div>
                </div>
            </div>
            <img className="lines" src={line} />
        </div>
    )
}

export default ForgetPassword;