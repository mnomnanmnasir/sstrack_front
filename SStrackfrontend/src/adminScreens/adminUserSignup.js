import React, { useEffect, useState } from "react";
import line from '../images/line.webp';
import user from '../images/user.webp';
import account from '../images/account.webp';
import email from "../images/emailIcon.webp";
import password from "../images/passwordIcon.webp";
import clock from "../images/time.png"
import { useNavigate } from "react-router-dom";
import TimezoneSelect from 'react-timezone-select';
import moment from "moment-timezone";
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import axios from "axios";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import AdminHead from "../screen/component/adminHeadSection";
import showPasswordIcon from '../images/showPassword.svg';
import hidePasswordIcon from '../images/hidePassword.svg';
import jwtDecode from "jwt-decode";

function AdminUserSignup() {

    const [showPassword, setShowPassword] = useState(false);
    const currentUser = jwtDecode(JSON.stringify(token));
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [model, setModel] = useState({
        name: "",
        company: "",
        email: "",
        password: "",
        timezone: "",
        timezoneOffset: "",
    });
    const [err, setErr] = useState("");
    const [error, setError] = useState("");
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const [timezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
    const [currentTimezone, setCurrentTimeZone] = useState('')

    console.log(currentUser);

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
            try {
                const response = await axios.post(`${apiUrl}/signup`, {
                    company: model?.company,
                    email: model?.email,
                    name: model?.name,
                    password: model?.password,
                    timezone: model?.timezone,
                    timezoneOffset: model?.timezoneOffset
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
                        if (currentUser.userType === "owner") {
                            navigate('/company-owner')
                        }
                        if (currentUser.userType === "admin") {
                            navigate('/admindashboard')
                        }
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

    return (
        <div>
            <SnackbarProvider />
            <section>
                <div className="maininputdivs">
                    <div className="mainInputDiv">
                        <p className="account">Create an account</p>
                        <div className="inputDiv">
                            <div><img src={user} /></div>
                            <input value={model.name} onChange={(e) => fillModel("name", e.target.value)} placeholder="Your full name" />
                        </div>
                        <div className="inputDiv">
                            <div><img src={account} /></div>
                            <input value={model.company} placeholder="Company" />
                        </div>
                        <div className="inputDiv">
                            <div><img src={email} /></div>
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

export default AdminUserSignup;