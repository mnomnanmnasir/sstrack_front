import React, { useEffect, useState } from "react";
import line from '../images/line.webp';
import userIcon from '../images/user.webp';
import account from '../images/account.webp';
import emailIcon from "../images/emailIcon.webp";
import password from "../images/passwordIcon.webp";
import clock from "../images/time.png"
// import Footer from "./component/footer";
// import Header from "./component/header";
import { useNavigate, useParams } from "react-router-dom";
import TimezoneSelect from 'react-timezone-select';
import link_expired from '../images/link-broken.svg'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import axios from "axios";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import showPasswordIcon from '../images/showPassword.svg';
import hidePasswordIcon from '../images/hidePassword.svg';
import moment from 'moment-timezone';
import jwtDecode from "jwt-decode";

function OwnerUserSignup() {
    const token = localStorage.getItem('token');
    const [showPassword, setShowPassword] = useState(false);
    const currentUser = jwtDecode(JSON.stringify(token));
    const [loading, setLoading] = useState(false)
    const { code, email } = useParams()
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [model, setModel] = useState({
        name: "",
        company: currentUser.company,
        email: "",
        password: "",
        timezone: "",
        timezoneOffset: "",
        userType: "user",
    });
    const [err, setErr] = useState("");
    const [error, setError] = useState("");
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const [timezone, setSelectedTimezone] = useState(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    )
    const [currentTimezone, setCurrentTimeZone] = useState('')

    // const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };

    async function handleCreateAccount() {
        if (model?.name === "" || model?.company === "" || model?.email === "" || model?.password === "" || model?.timezone === "" || model?.timezoneOffset === "") {
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
            console.log({
                company: model?.company,
                email: model?.email,
                name: model?.name,
                password: model?.password,
                timezone: model?.timezone,
                timezoneOffset: model?.timezoneOffset,
                userType: model?.userType,
            });
            try {
                const response = await axios.post(`${apiUrl}/signup`, {
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
                        navigate('/dashboard')
                    }, 2000);
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
        fillModel("company", currentUser?.company);
    }, []);
    
    console.log(model);
    console.log(currentUser);

    return (
        <div>
            <SnackbarProvider />
            <section>
                <div 
                className="maininputdivs" 
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        handleCreateAccount()
                    }
                }}
                >
                    <div className="mainInputDiv">
                        <p className="account">Create an account</p>
                        <div className="inputDiv">
                            <div><img src={userIcon} /></div>
                            <input value={model.name} onChange={(e) => fillModel("name", e.target.value)} placeholder="Your full name" />
                        </div>
                        <div className="inputDiv">
                            <div><img src={account} /></div>
                            <input value={model.company} placeholder="Company" />
                        </div>
                        <div className="inputDiv">
                            <div><img src={emailIcon} /></div>
                            <input type="email" className="autofill" value={model.email} onChange={(e) => fillModel("email", e.target.value)} placeholder="Email" />
                        </div>
                        <div className="inputDiv">
                            <div><img src={password} /></div>
                            <input className="autofill" type={showPassword ? 'text' : 'password'} value={model.password} onChange={(e) => fillModel("password", e.target.value)} placeholder="Password (8 or more characters)" />
                            {model.password !== "" && <img style={{ cursor: "pointer" }} width={30} src={showPassword ? showPasswordIcon : hidePasswordIcon} alt="Password" onClick={() => setShowPassword(!showPassword)} />}
                        </div>
                        <div className="inputDiv2">
                            {/* <div><img src={clock} /></div> */}
                            {/* <div> */}
                            <TimezoneSelect value={timezone} onChange={handleStartDateChange} />
                            {/* </div> */}
                        </div>
                        <button disabled={loading} onClick={handleCreateAccount} className={loading ? "disabledAccountButton" : "accountButton"}>{loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Create Account"}</button>
                    </div>
                </div>
                <p className="loginFont">Already have an account? <span onClick={() => navigate('/signin')}>Login</span></p>
            </section>
            <img className="liness" src={line} />
        </div>
    )
}

export default OwnerUserSignup;