import React, { useEffect, useState } from "react";
import line from '../images/line.webp';
import user from '../images/user.webp';
import account from '../images/account.webp';
import email from "../images/emailIcon.webp";
import password from "../images/passwordIcon.webp";
import clock from "../images/time.png"
import Footer from "./component/footer";
import Header from "./component/header";
import { useNavigate } from "react-router-dom";
import TimezoneSelect from 'react-timezone-select';
import moment from "moment-timezone";
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import axios from "axios";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import logo from '../images/inner-icon.svg'
import showPasswordIcon from '../images/showPassword.svg';
import hidePasswordIcon from '../images/hidePassword.svg';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
// import { googleLogout } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';



function Signup() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [model, setModel] = useState({
        name: "",
        company: "",
        email: "",
        password: "",
        timezone: "",
        timezoneOffset: "",
        userType: "owner"
    });
    const [err, setErr] = useState("");
    const [error, setError] = useState("");
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const [timezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
    const [currentTimezone, setCurrentTimeZone] = useState('')

    async function handleCreateAccount() {
        console.log(model);
        if (model?.name === "" || model?.company === "" || model?.email === "" || model?.timezone === "" || model?.timezoneOffset === "") {
            enqueueSnackbar("Please fill all fields", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            return null
        }
        if (!model.email.includes("@") || !model.email.includes(".")) {
            enqueueSnackbar("Invalid email please enter valid email", {
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
                const response = await axios.post(`${apiUrl}/signup/ownerSignUp`, {
                    company: model?.company,
                    email: model?.email,
                    name: model?.name,
                    password: model?.password,
                    timezone: model?.timezone,
                    timezoneOffset: model?.timezoneOffset,
                    userType: model?.userType,
                })
                if (response.status) {
                    setLoading(false)
                    enqueueSnackbar(response.data.Message, {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                    setTimeout(() => {
                        navigate('/signin')
                    }, 3000);
                }
                console.log("signup from link response =====>", response);
            } catch (error) {
                setLoading(false)
                enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                console.log("catch error ===>", error);
            }
        }
    }

    const handleGoogleLogout = () => {
        googleLogout(); // Logs out of Google session
        setIsLoggedIn(false); // Update state to logged out
        enqueueSnackbar("Logged out successfully", { variant: "info" });
    };

    // async function handleCreateAccount() {
    //     console.log(model);
    //     if (model?.name === "" || model?.company === "" || model?.email === "" || model?.password === "" || model?.timezone === "" || model?.timezoneOffset === "") {
    //         enqueueSnackbar("Please fill all fields", {
    //             variant: "error",
    //             anchorOrigin: {
    //                 vertical: "top",
    //                 horizontal: "right"
    //             }
    //         })
    //         return null
    //     }
    //     if (!model.email.includes("@") || !model.email.includes(".")) {
    //         enqueueSnackbar("Invalid email please enter valid email", {
    //             variant: "error",
    //             anchorOrigin: {
    //                 vertical: "top",
    //                 horizontal: "right"
    //             }
    //         })
    //         return null
    //     }
    //     else {
    //         setLoading(true)
    //         navigate('/payment');
    //     }
    // }

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
        fillModel("email", "");
        fillModel("password", "");
    }, []);

    console.log(model);

    return (
        <div>
            {/* <Header /> */}
            <SnackbarProvider />
            <section>
                <p className="freePera">Try it Free for 7 days</p>
                <p className="mainFont">Maintain it Free always on the Free Plan.</p>
                <div className="maininputdivs"
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            console.log(e);
                            handleCreateAccount()
                        }
                    }}>
                    <div className="mainInputDiv">
                        <p className="account">Create an account</p>
                        <div className="inputDiv">
                            <div><img src={user} /></div>
                            <input value={model.name} onChange={(e) => fillModel("name", e.target.value)} placeholder="Your full name" />
                        </div>
                        <div className="inputDiv">
                            <div><img src={account} /></div>
                            <input value={model.company} onChange={(e) => fillModel("company", e.target.value)} placeholder="Company" />
                        </div>
                        <div className="inputDiv">
                            <div><img src={email} /></div>
                            <input className="autofill" value={model.email} onChange={(e) => fillModel("email", e.target.value)} placeholder="Email" />
                        </div>
                        {/* <div className="inputDiv">
                            <div><img src={password} /></div>
                            <input className="autofill" type={showPassword ? 'text' : 'password'} value={model.password} onChange={(e) => fillModel("password", e.target.value)} placeholder="Password (8 or more characters)" />
                            {model.password !== "" && <img style={{ cursor: "pointer" }} width={30} src={showPassword ? showPasswordIcon : hidePasswordIcon} alt="Password" onClick={() => setShowPassword(!showPassword)} />}
                        </div> */}
                        <div className="inputDiv2">
                            {/* <div><img src={clock} /></div> */}
                            {/* <div> */}
                            <TimezoneSelect value={timezone} onChange={handleStartDateChange} />
                            {/* </div> */}
                        </div>
                        <button disabled={loading} onClick={handleCreateAccount} className={loading ? "disabledAccountButton" : "accountButton"}>{loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Create Account"}</button>
                        {/* <GoogleLogin
                        onSuccess={credentialResponse => {
                            const token = credentialResponse.credential;
                            const decodedToken = jwt_decode(token); // Decode the token
                            console.log("User's email:", decodedToken.email); // Log the email
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        useOneTap
                    /> */}
                        <div className="d-flex justify-content-center mt-4">
                            {/* <GoogleLogin
                                onSuccess={credentialResponse => {
                                    const token = credentialResponse.credential;
                                    const decodedToken = jwt_decode(token); // Decode the token
                                    console.log("User's email:", decodedToken.email); // Log the email
                                    localStorage.setItem("googleEmail", decodedToken.email); // Store the email
                                    localStorage.setItem("googleName", decodedToken.name); // Store the email
                                    console.log("User's name:", decodedToken.name); // Log the email
                                    // Redirect to "/profile" with email as state
                                    navigate('/profile');
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                // useOneTap
                            /> */}
                        </div>
                        <div class="container">
                            <div className="text-center justify-content-center text-primary gap-4 d-flex">
                                <a href="https://myuniversallanguages.com:9093/api/v1/auth/google" className="btn btn-light border-3" style={{ borderRadius: '50px', border: '5px solid #000000' }}
                                ><span class="fa fa-google"></span> Sign Up with Google</a
                                >
                                <br />
                                <br />
                                <a href="https://myuniversallanguages.com:9093/api/v1/auth/microsoft" className="btn btn-primary border-3" style={{ borderRadius: '40px' }}>
                                    <span class="fa fa-windows"></span> Sign Up with Microsoft
                                </a>
                            </div>
                        </div>
                        {/* <div className="d-flex justify-content-center mt-4">
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    const token = credentialResponse.credential;
                                    const decodedToken = jwt_decode(token);
                                    const email = decodedToken.email;
                                    console.log("User Email", email)
                                    // Save email to localStorage
                                    localStorage.setItem("googleEmail", email);

                                    // Redirect to "/profile" with email as state
                                    navigate('/profile');
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                useOneTap
                            />
                        </div> */}
                    </div>
                </div>
                <p className="loginFont">Already have an account? <span
                    style={{
                        color: "#7ACB59",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                    onClick={() => navigate('/signin')}>Login</span></p>

            </section>
            <img className="liness" src={line} />
            {/* <Footer /> */}
        </div>
    )
}

export default Signup;