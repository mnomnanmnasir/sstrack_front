import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import Timer from "./component/timer";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import optVerifcation from '../images/opt-verifcation.svg';

function VerificationCode() {

    const navigate = useNavigate();
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [digits, setDigits] = useState("");

    const handleSendLink = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/superAdmin/verifycode`, {
                email: localStorage.getItem("email"),
                verification: digits
            });
            if (response.status === 200) {
                console.log("OTP code", response);
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
                setTimeout(() => {
                    navigate(`/update-password/${localStorage.getItem("verification_id")}`);
                }, 2000);
            }
        } catch (error) {
            console.error("catch error", error);
            enqueueSnackbar(error.response.data.message, {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (digits?.split("").length === 6) {
            handleSendLink();
        }
    }, [digits]);

    console.log(digits);

    return (
        <>
            <SnackbarProvider />
            <div className="maininputdivs">
                <div className="mainInputDiv" style={{ textAlign: "center" }}>
                    <Timer />
                    <img style={{ width: "100%", height: "300px", marginBottom: 30 }} src={optVerifcation} alt="" />
                    <p className="verification-code">Verification Code</p>
                    <p className="verification-code-sent">We have sent a verification code to your email address</p>
                    <div id="inputs" className="inputs">
                        <input onChange={(e) => setDigits(e.target.value)} className="input" type="text" value={digits} />
                    </div>
                    <button style={{ marginTop: 30 }} disabled={loading} className={loading ? "disabledAccountButton" : "accountButton"} onClick={handleSendLink}>
                        {loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Verify"}
                    </button>
                </div>
            </div>
        </>
    );
}

export default VerificationCode;
