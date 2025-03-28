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
import passwordIcon from "../images/passwordIcon.webp";
import showPasswordIcon from '../images/showPassword.svg';
import hidePasswordIcon from '../images/hidePassword.svg';

function UpdatePassword() {

    const dispatch = useDispatch()
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate()
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const params = useParams()
    const [showMessage, setShowMessage] = useState(false);  // ✅ Message state added

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
    const [isFirstGenerate, setIsFirstGenerate] = useState(true);  // ✅ Track first-time generate

    // ✅ Strong Password Generator
    // const generatePassword = () => {
    //     const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    //     let newPassword = "";
    //     for (let i = 0; i < 12; i++) {
    //         newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    //     }
    //     setPassword(newPassword);
    //     setShowMessage(true);  // ✅ Message show karein

    //     setTimeout(() => {
    //         setShowMessage(false);  // ✅ 5s baad message hide karein
    //     }, 5000);
    // };
    // ✅ Secure Password Generator
    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
        let newPassword = "";
        for (let i = 0; i < 12; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPassword);

        // ✅ Pehli dafa showMessage true karein
        if (isFirstGenerate) {
            setShowMessage(true);
            setIsFirstGenerate(false);  // ✅ Dobara show nahi hoga

            setTimeout(() => {
                setShowMessage(false);  // ✅ 3s baad message hide karein
            }, 3000);
        }
    };

    // ✅ Handle Space Key Press
    const handleKeyPress = (e) => {
        if (e.key === " ") {
            e.preventDefault(); // Space press ko disable karein
            setPassword(generatePassword()); // ✅ Sirf "New Password" field mein set hoga
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
                    <div className="inputDiv" style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        {/* Password Icon */}
                        <div><img src={passwordIcon} /></div>

                        {/* Password Input Field */}
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password (Press space to Generate)"
                            onKeyDown={handleKeyPress} // ✅ Space press handle karega
                            style={{ flex: 1, paddingRight: "90px" }} // ✅ Space for buttons
                        />

                        {/* Auto Generate Button */}
                        <button
                            onClick={generatePassword}
                            style={{
                                position: "absolute",
                                right: "35px", // ✅ Thoda left shift to adjust for eye icon
                                top: "50%",
                                transform: "translateY(-50%)",
                                backgroundColor: "#6ABB47",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "12px",
                                padding: "5px 8px",
                            }}>
                            Auto Generate
                        </button>

                        {/* Eye Icon */}
                        <img
                            style={{
                                cursor: "pointer",
                                position: "absolute",
                                right: "5px", // ✅ Auto Generate button ke bilkul baad
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: "25px",
                            }}
                            src={showPassword ? showPasswordIcon : hidePasswordIcon}
                            alt="Toggle Password"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                    {/* ✅ Security Message Below the Input Field */}
                    {showMessage && (
                        <p className='text-warning' style={{fontSize: "14px", marginTop: "5px" }}>
                            This is a secure, randomly generated password.
                            It is encrypted for your safety and ensures strong protection.
                        </p>
                    )}

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