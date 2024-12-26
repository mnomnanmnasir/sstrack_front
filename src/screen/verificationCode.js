import React, { useEffect, useState } from "react";
import axios from "axios";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import Timer from "./component/timer";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import optVerification from '../images/opt-verifcation.svg';

function VerificationCode() {

    const navigate = useNavigate();
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [digits, setDigits] = useState("");
    const [resendLoading, setResendLoading] = useState(false); // Resend button loading state
    const [timer, setTimer] = useState(60); // Timer for Resend button disable state
    const [timerActive, setTimerActive] = useState(true); // Timer active state

    // Function to verify the code
    const handleSendLink = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/superAdmin/verifycode`, {
                email: localStorage.getItem("email"),
                verification: digits
            });
            if (response.status === 200) {
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
            enqueueSnackbar(error.response?.data?.message || "Something went wrong.", {
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

    // Function to resend the verification code
    const handleResendCode = async () => {
        setResendLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/superAdmin/resetpassword`, {
                email: localStorage.getItem("email")
            });
            if (response.status === 200) {
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
                setTimerActive(false); // Reset timer
                setTimeout(() => setTimerActive(true), 10); // Restart timer
                setTimer(60); // Restart the timer for the resend button
            }
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || "Failed to resend code.", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
        } finally {
            setResendLoading(false);
        }
    };

    // Timer functionality
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Auto-submit when 6 digits are entered
    useEffect(() => {
        if (digits?.split("").length === 6) {
            handleSendLink();
        }
    }, [digits]);

    return (
        <>
            <SnackbarProvider />
            <div className="maininputdivs">
                <div className="mainInputDiv" style={{ textAlign: "center" }}>
                <Timer timerActive={timerActive} />
                <img style={{ width: "100%", height: "300px", marginBottom: 30 }} src={optVerification} alt="" />
                    <p className="verification-code">Verification Code</p>
                    <p className="verification-code-sent">We have sent a verification code to your email address</p>
                    <div id="inputs" className="inputs">
                        <input
                            onChange={(e) => setDigits(e.target.value)}
                            className="input"
                            type="text"
                            value={digits}
                            maxLength="6" // Restrict input to 6 digits
                        />
                    </div>
                    <button
                        style={{ marginTop: 30 }}
                        disabled={loading}
                        className={loading ? "disabledAccountButton" : "accountButton"}
                        onClick={handleSendLink}
                    >
                        {loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Verify"}
                    </button>
                    <button
                        style={{
                            marginTop: 10,
                            color: timer === 0 ? "#007bff" : "#bbb",
                            cursor: timer === 0 ? "pointer" : "not-allowed",
                            border: "none",
                            background: "transparent"
                        }}
                        disabled={timer > 0 || resendLoading}
                        onClick={handleResendCode}
                    >
                        {resendLoading
                            ? "Resending..."
                            : `Resend Code`}
                    </button>
                </div>
            </div>
        </>
    );
}

export default VerificationCode;
