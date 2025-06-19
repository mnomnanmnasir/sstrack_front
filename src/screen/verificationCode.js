import React, { useEffect, useState } from "react";
import axios from "axios";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import Timer from "./component/timer";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import optVerification from '../images/opt-verifcation.svg';
import Header from '../screen/component/header';

function VerificationCode() {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    // const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [digits, setDigits] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [timerActive, setTimerActive] = useState(true);
    const [isCodeExpired, setIsCodeExpired] = useState(false);
    const [resendClicked, setResendClicked] = useState(false);  // Track if Resend Code is clicked

    // Function to verify the code
    const handleSendLink = async () => {
        if (isCodeExpired) {
            enqueueSnackbar("Please enter the new code.", { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } });
            return;
        }
    
        setLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/superAdmin/verifycode`, {
                email: localStorage.getItem("email"),
                verification: digits
            });

            if (response.status === 200 && response.data.success) {
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });

                setTimeout(() => {
                    navigate(`/update-password/${localStorage.getItem("verification_id")}`);
                }, 2000);
            }
        } catch (error) {
            console.log("catch error ===>", error?.response?.data?.message);

            // Extract error message safely
            let errorMessage = "Something went wrong. Please try again.";

            if (error.response && error.response.data) {
                errorMessage = error.response.data.message || "Invalid verification code.";

                // If the error is specifically "Invalid verification code", ensure proper display
                if (errorMessage.toLowerCase().includes("invalid verification code")) {
                    errorMessage = "Invalid verification code. Please enter the correct one.";
                }
            }

            // Show error message in Snackbar instead of alert
            enqueueSnackbar(errorMessage, {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        } finally {
            setLoading(false);
        }
    };


    // Function to resend the verification code
    const handleResendCode = async () => {
        setResendLoading(true);
        setResendClicked(true);  // Track that resend was clicked
        try {
            const response = await axios.post(`${apiUrl}/superAdmin/resetpassword`, {
                email: localStorage.getItem("email")
            });

            if (response.status === 200) {
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });

                setTimerActive(false);
                setTimeout(() => setTimerActive(true), 10);
                setTimer(60);  // Restart the timer
                setIsCodeExpired(false);  // Reset expired state
                setDigits("");  // Clear previous input
            }
        } catch (error) {
            enqueueSnackbar("error?.response?.data?.message" || "Failed to resend code.", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
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
        } else {
            setIsCodeExpired(true);  // Mark code as expired
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Auto-submit when 6 digits are entered
    useEffect(() => {
        if (digits.length === 6) {
            handleSendLink();
        }
    }, [digits]);

    return (
        <>
            <Header />
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
                            maxLength="6"
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
                        {resendLoading ? "Resending..." : `Resend Code`}
                    </button>
                </div>
            </div>
        </>
    );
}

export default VerificationCode;
