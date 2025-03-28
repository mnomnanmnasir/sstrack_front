import React, { useEffect, useState } from "react";
import line from '../images/line.webp';
import userIcon from '../images/user.webp';
import account from '../images/account.webp';
import emailIcon from "../images/emailIcon.webp";
import password from "../images/passwordIcon.webp";
import clock from "../images/time.png"
import Footer from "./component/footer";
import Header from "./component/header";
import { useNavigate, useParams } from "react-router-dom";
import TimezoneSelect from 'react-timezone-select';
import moment from "moment-timezone";
import link_expired from '../images/link-broken.svg'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import axios from "axios";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import showPasswordIcon from '../images/showPassword.svg';
import hidePasswordIcon from '../images/hidePassword.svg';
import passwordIcon from "../images/passwordIcon.webp";
import jwtDecode from "jwt-decode";
// import NewHeader from './component/Header/NewHeader';
import { useDispatch } from "react-redux";
import { setToken } from "../store/authSlice";

function CreateAccount({ language }) {

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const { code, email } = useParams()
    const [user, setUser] = useState(null);
    const [linkExpired, setLinkExpired] = useState(false);
    const [linkStatusMessage, setLinkStatusMessage] = useState("");
    const navigate = useNavigate();
    const [model, setModel] = useState({
        company: "",
        email: "",
        name: "",
        password: "",
        timezone: "",
        timezoneOffset: "",
        userType: "user",
    });

    const dispatch = useDispatch();

    const [err, setErr] = useState("");
    const [error, setError] = useState("");
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const [timezone, setSelectedTimezone] = useState(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    )
    const [currentTimezone, setCurrentTimeZone] = useState('')
    const token = localStorage.getItem('token');
    // const currentUser = jwtDecode(JSON.stringify(token));
    const headers = {
        Authorization: "Bearer " + token,
    };

    const [showMessage, setShowMessage] = useState(false);  // ✅ Track message visibility
    const [firstTimeGenerated, setFirstTimeGenerated] = useState(false);  // ✅ Track first-time status

    // ✅ Function to Generate Secure Password
    // const generatePassword = () => {
    //     if (!firstTimeGenerated) { // ✅ Sirf pehli baar message show karein
    //         const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    //         let password = "";
    //         for (let i = 0; i < 12; i++) {
    //             password += chars.charAt(Math.floor(Math.random() * chars.length));
    //         }
    //         fillModel("password", password);

    // setShowMessage(true);  // ✅ Message ko dikhayein
    // setFirstTimeGenerated(true);  // ✅ First-time flag set karein

    // setTimeout(() => {
    //     setShowMessage(false);  // ✅ 3s baad message hide karein
    // }, 3000);
    //     } 
    // };
    // ✅ Function to Generate Secure Password
    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        fillModel("password", password); // ✅ Password field update karein

        if (!firstTimeGenerated) { // ✅ Sirf pehli baar message show karein
            setShowMessage(true);
            setFirstTimeGenerated(true);

            setTimeout(() => {
                setShowMessage(false);
            }, 3000);
        }
        return password;
    };

    // ✅ Handle Key Press (',' Generates a New Password)
    const handleKeyPress = (e) => {
        if (e.key === " ") {
            e.preventDefault(); // Stop inputting ','
            fillModel("password", generatePassword()); // Generate new password
        }
    };

    async function handleCreateAccount() {
        if (
            !model.name ||
            !model.company ||
            !model.email ||
            !model.password ||
            !model.timezone ||
            !model.timezoneOffset
        ) {
            enqueueSnackbar("Please fill all fields", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            return;
        }

        if (!model.email.includes("@") || !model.email.includes(".")) {
            enqueueSnackbar("Invalid email, please enter a valid email", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/owner/updateemployee`, {
                company: model.company,
                email: model.email,
                _id: model.id,
                name: model.name,
                password: model.password,
                timezone: model.timezone,
                timezoneOffset: model.timezoneOffset,
                userType: model.userType,
            });

            console.log("Response create account", response);

            // ✅ Step 1: Get token from response
            const token = response?.data?.token;

            if (token) {
                dispatch(setToken(token));
                localStorage.setItem("token", token);

                enqueueSnackbar("Account created successfully!", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });

                if (user?.isSplashScreen === false) {
                    navigate("/splash");
                    console.log("Navigated to /splash");
                } else {
                    console.log("Navigated to /dashboard");
                    setTimeout(() => {
                        window.location.href = "/dashboard"; // ✅ Hard reload with redirect
                    }, 1000);
                }
            }

        } catch (error) {
            setLoading(false);
            enqueueSnackbar(
                error?.response?.data?.message || "Network error",
                {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                }
            );
            console.log("catch error ===>", error);
        }
    }



    const handleStartDateChange = (selectedtimezone) => {
        // Assuming selectedtimezone is an object with a 'value' property representing the time zone name
        const timezoneName = selectedtimezone.value;
        const offsetInMinutes = moment.tz(timezoneName).utcOffset();
        const offsetInHours = offsetInMinutes / 60;
        setSelectedTimezone(timezoneName);
        setCurrentTimeZone(timezoneName);
        fillModel("timezoneOffset", offsetInHours);
        fillModel("timezone", timezoneName);
        console.log(timezoneName);
    };

    let fillModel = (key, val) => {
        model[key] = val;
        setModel({ ...model })
    }

    useEffect(() => {
        const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const offsetInMinutes = moment.tz(defaultTimezone).utcOffset();
        const offsetInHours = offsetInMinutes / 60;
        setSelectedTimezone(defaultTimezone);
        setCurrentTimeZone(defaultTimezone);
        fillModel("timezoneOffset", offsetInHours);
        fillModel("timezone", defaultTimezone);

        // ✅ Auto-generate password on first render
        fillModel("password", generatePassword());
    }, []);

    async function getLink(params) {
        try {
            const res = await axios.get(`${apiUrl}/superAdmin/checkinvite/${code}/${email}`)
            if (res.status === 200) {
                console.log(res);
                setModel(() => ({
                    ...model, // Properly spread the previous state
                    id: res.data.user._id,
                    email: res.data.user.email,
                    company: res.data.user.company,
                    name: res.data.user.name
                }));
                console.log('Accounts Data', res)
                setUser(res.data.user)
                setLinkExpired(false)
                setLinkStatusMessage("")
            }
        } catch (error) {
            setUser(null)
            setLinkExpired(true)
            setLinkStatusMessage(error.response.data.message)
            console.log("catch error", error);
        }
    }

    useEffect(() => {
        console.log("Updated Model State:", model);
    }, [model]);


    // async function getLink() {
    //     try {
    //         const res = await axios.get(`${apiUrl}/superAdmin/checkinvite/${code}/${email}`);
    //         cons
    //         if (res.status === 200) {
    //             console.log("API Response:", res.data);

    //             // Update the model with fetched data
    //             setModel((prevModel) => ({
    //                 ...prevModel, // Spread the existing state
    //                 id: res.data.user._id || "", // Ensure all fields have a default value
    //                 email: res.data.user.email || "",
    //                 company: res.data.user.company || "",
    //                 name: res.data.user.name || ""
    //             }));

    //             console.log("Updated Model:", {
    //                 id: res.data.user._id,
    //                 email: res.data.user.email,
    //                 company: res.data.user.company,
    //                 name: res.data.user?.name
    //             });

    //             setUser(res.data.user); // Update the `user` state
    //             setLinkExpired(false);
    //             setLinkStatusMessage("");
    //         }
    //     } catch (error) {
    //         console.error("Error in getLink:", error);
    //         setUser(null);
    //         setLinkExpired(true);
    //         setLinkStatusMessage(error.response?.data?.message || "An error occurred");
    //     }
    // }

    useEffect(() => {
        getLink()
    }, [])

    console.log('Create Account', model);

    return (
        <div>
            <SnackbarProvider />
            <Header />
            {linkExpired ? (
                <div style={{
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    margin: "100px 180px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    padding: "30px",
                    borderRadius: "10px"
                }}>
                    <img width={800} src={link_expired} alt="" />
                    <p style={{
                        fontSize: "40px",
                        fontWeight: "600",
                        color: "#0E4772",
                        margin: "60px 0 10px 0"
                    }}>Sorry!</p>
                    <p style={{
                        fontWeight: "600",
                        color: "#444C57",
                        fontSize: "20px"
                    }}>The invitation link has been expire please contact the person who shared link with you</p>
                </div>
            ) : (
                <section>
                    <p className="account">Create an account</p>
                    <div className="maininputdivs"
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                handleCreateAccount()
                            }
                        }}
                    >
                        <div className="mainInputDiv">
                            <p className="getback">Create user account</p>
                            <div className="inputDiv">
                                <div><img src={userIcon} /></div>
                                <input
                                    className="autofill"
                                    value={model.name || ""} // Ensure no undefined values
                                    // value={model?.name} // Directly use model.name
                                    // type='text'  // Correct type for text input
                                    onChange={(e) => fillModel("name", e.target.value)}
                                    placeholder="Your full name"
                                />
                            </div>
                            {/* <div className="inputDiv">
                                <div><img src={account} /></div>
                                <input value={model?.company} placeholder="Company" />
                            </div>
                            <div className="inputDiv">
                                <div><img src={emailIcon} /></div>
                                <input className="autofill" value={model?.email} type="email" placeholder="Email" />
                            </div> */}
                               <div
                                className="inputDiv"
                                style={{
                                    backgroundColor: model?.company ? "#f0f0f0" : "white",
                                    opacity: model?.company ? 0.6 : 1,
                                    pointerEvents: model?.company ? "none" : "auto",
                                    padding: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    transition: "0.3s"
                                }}
                            >
                                <div><img src={account} /></div>
                                <input
                                    value={model?.company}
                                    placeholder="Company"
                                    disabled={!!model?.company}
                                    style={{
                                        backgroundColor: model?.company ? "#f0f0f0"  : "white",
                                        border: "none",
                                        outline: "none",
                                        flex: 1,
                                        padding: "5px"
                                    }}
                                />
                            </div>

                            <div
                                className="inputDiv"
                                style={{
                                    backgroundColor: model?.email ? "#f0f0f0" : "white",
                                    opacity: model?.email ? 0.6 : 1,
                                    pointerEvents: model?.email ? "none" : "auto",
                                    padding: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    transition: "0.3s"
                                }}
                            >
                                <div><img src={emailIcon} /></div>
                                <input
                                    value={model?.email}
                                    type="email"
                                    placeholder="Email"
                                    disabled={!!model?.email}
                                    style={{
                                        backgroundColor: model?.email ? "#f0f0f0" : "white",
                                        border: "none",
                                        outline: "none",
                                        flex: 1,
                                        padding: "5px"
                                    }}
                                />
                            </div>

                            {/* <div className="inputDiv">
                                <div><img src={password} /></div>
                                <input className="password" type={showPassword ? 'text' : 'password'} value={model.password} onChange={(e) => fillModel("password", e.target.value)} placeholder="Password (8 or more characters)" />
                                {model.password !== "" && <img style={{ cursor: "pointer" }} width={30} src={showPassword ? showPasswordIcon : hidePasswordIcon} alt="Password" onClick={() => setShowPassword(!showPassword)} />}
                            </div> */}
                            {/* ✅ Auto Generated Password with ',' Key Feature */}
                            <div className="inputDiv" style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <div><img src={passwordIcon} /></div>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={model.password}
                                    onChange={(e) => fillModel("password", e.target.value)}
                                    placeholder="Password (Press space to Generate)"
                                    onKeyPress={handleKeyPress} // ✅ Detect Key Press
                                />
                                {/* Auto Generate Button */}
                                <button
                                    onClick={() => {
                                        const newPassword = generatePassword(); // ✅ Random password generate karein
                                        fillModel("password", newPassword); // ✅ Password field update karein
                                    }}
                                    style={{
                                        position: "absolute",
                                        right: "35px", // ✅ Adjusted to fit before the eye icon
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
                                        right: "5px", // ✅ Adjusted after the Auto Generate button
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        width: "25px",
                                    }}
                                    src={showPassword ? showPasswordIcon : hidePasswordIcon}
                                    alt="Toggle Password"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>

                            {/* ✅ Secure Password Message */}
                            {showMessage && (
                                <p className="text-warning" style={{ fontSize: "14px", marginTop: "5px" }}>
                                    This is a secure, randomly generated password.
                                    It is encrypted for your safety and ensures strong protection.
                                </p>
                            )}

                            <div className="inputDiv2">
                                {/* <div><img src={clock} /></div> */}
                                {/* <div> */}
                                <TimezoneSelect value={timezone} onChange={handleStartDateChange} />
                                {/* </div> */}
                            </div>
                            <p className="err">{err}</p>
                            <button disabled={loading} onClick={handleCreateAccount} className={loading ? "disabledAccountButton" : "accountButton"}>{loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Create Account"}</button>
                        </div>
                    </div>
                    <p className="loginFont">Already have an account? <span onClick={() => navigate('/signin')}>Login</span></p>
                </section >
            )}

            <img className="liness" src={line} />

        </div>
    )
}

export default CreateAccount;
