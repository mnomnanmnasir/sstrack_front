import axios from "axios";
import moment from "moment-timezone";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import TimezoneSelect from 'react-timezone-select';
import account from '../images/account.webp';
import email from "../images/emailIcon.webp";
import line from '../images/line.webp';
import user from '../images/user.webp';
import verifyImge from '../images/verfiyImage.png';
import Header from '../screen/component/header';


function Signup() {

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [model, setModel] = useState({
        name: "",
        company: "",
        email: "",
        // password: "",
        timezone: "",
        timezoneOffset: "",
        userType: "owner"
    });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // To toggle success message

    const [showModal, setShowModal] = useState(false);
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
                    // password: model?.password,
                    timezone: model?.timezone,
                    timezoneOffset: model?.timezoneOffset,
                    userType: model?.userType,
                })
                if (response.status) {
                    setLoading(false)
                    // enqueueSnackbar(response.data.Message, {
                    //     variant: "success",
                    //     anchorOrigin: {
                    //         vertical: "top",
                    //         horizontal: "right"
                    //     }
                    // })
                    setShowSuccessMessage(true); // Show success message
                    // setTimeout(() => {
                    //     navigate('/signin')
                    // }, 3000);
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
            <Header/>

            <SnackbarProvider />
            <section>
                <div className="container"
                >
                    {showSuccessMessage ? (
                        <div className="text-center bg-white mt-3 py-2" style={{ borderRadius: "10px" }} >
                            <img
                                src={verifyImge}
                                alt="Verification"
                                className="img-fluid mb-4"
                                style={{ maxWidth: "50%", height: "auto" }} // Reduced width to 50%
                            />
                            <p className="lead text-center">
                                Thank you for signing up! We've sent a verification link to your email
                                address. Please check your inbox to verify your account.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="freePera">Try it Free for 14 days</p>
                            <p className="mainFont">Maintain it Free always on the Free Plan.</p>
                            <div className="maininputdivs">
                                <div className="mainInputDiv">
                                    <p className="account">Create an account</p>
                                    <div className="inputDiv">
                                        <div><img src={user} alt="User Icon" /></div>
                                        <input value={model?.name} onChange={(e) => fillModel("name", e.target.value)} placeholder="Your full name" />
                                    </div>
                                    <div className="inputDiv">
                                        <div><img src={account} alt="Company Icon" /></div>
                                        <input value={model?.company} onChange={(e) => fillModel("company", e.target.value)} placeholder="Company" />
                                    </div>
                                    <div className="inputDiv">
                                        <div><img src={email} alt="Email Icon" /></div>
                                        <input className="autofill" value={model?.email} onChange={(e) => fillModel("email", e.target.value)} placeholder="Email" />
                                    </div>
                                    <div className="inputDiv2">
                                        <TimezoneSelect value={timezone} onChange={handleStartDateChange} />
                                    </div>
                                    <button disabled={loading} onClick={handleCreateAccount} className={loading ? "disabledAccountButton" : "accountButton"}>
                                        {loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Create Account"}
                                    </button>
                                </div>
                            </div>
                            <p className="loginFont">Already have an account? <span
                                style={{
                                    color: "#7ACB59",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                }}
                                onClick={() => navigate('/signin')}>Login</span></p>
                        </>
                    )}
                </div>
            </section>
            <img className="liness" src={line} />

            {/* <Footer /> */}
        </div>
    )
}

export default Signup;