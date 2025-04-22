import axios from "axios";
import moment from "moment-timezone";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import TimezoneSelect from 'react-timezone-select';
import account from '../images/account.webp';
import email from "../images/emailIcon.webp";
import line from '../images/line.webp';
import user from '../images/user.webp';
import verifyImge from '../images/verfiyImage.png';
import Header from '../screen/component/header';
import { FaEnvelope, FaGoogle } from "react-icons/fa"; // Import Email Icon
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';


function Signup() {
    const location = useLocation();
    const emailfromlink = location.state?.email;
    console.log('new email', emailfromlink)
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [model, setModel] = useState({
        name: "",
        company: "",
        email: "",
        // password: "",
        phoneNumber: "", // ✅ Add this line
        timezone: "",
        timezoneOffset: "",
        userType: "owner"
    });

    // const emailfromlink = location.state?.email;

    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // To toggle success message

    useEffect(() => {
        if (emailfromlink) {
            fillModel("email", emailfromlink); // ✅ Autofill email in the input
        }
    }, [location]);

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
                    phoneNumber: model?.phoneNumber,
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
        if (emailfromlink) {
            fillModel("email", emailfromlink);
        }
        const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const offsetInMinutes = moment.tz(defaultTimezone).utcOffset();
        const offsetInHours = offsetInMinutes / 60;
        setSelectedTimezone(defaultTimezone);
        setCurrentTimeZone(defaultTimezone);
        fillModel("timezoneOffset", offsetInHours);
        fillModel("timezone", defaultTimezone);
        // fillModel("email", "");
        fillModel("password", "");

    }, [location]);

    console.log('sdssdsdds', model);

    return (
        <div>
            {/* <Header /> */}
            <Header />

            <SnackbarProvider />
            <section>
                <div className="" id='signUp-btn'
                >
                    {showSuccessMessage ? (
                        <div className="container">
                            <div className=" row align-items-center justify-content-center bg-white mt-3 py-2" style={{ borderRadius: "10px" }}>
                                <div className="col-lg-6 ml-3 d-flex flex-column align-items-center">
                                    <p className="lead text-center">
                                        {/* Thank you for signing up! We've sent a verification link to your email
                                        address. Please check your inbox to verify your account. */}
                                        {/* Thanks for signing up! */}
                                        {/* <br /> */}
                                        <span className="d-block">Thanks for signing up!</span>
                                        <span className="d-block">A verification link has been sent to your email.</span>
                                        {/* A verification link has been sent to your email. */}
                                        {/* Please check your inbox and follow the instructions to activate your account. */}
                                        {/* If you don’t see it, check your spam or junk folder. */}
                                    </p>
                                    {/* 🔹 Resend Verification Email Button */}
                                    {/* 🔹 Resend Verification Email Button */}
                                    {/* <div className="alig"> */}
                                    {/* <button> */}
                                    <div className="d-flex align-items-center gap-3">
                                        <a
                                            href="https://mail.google.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary mt-3 d-flex gap-1 align-items-center justify-content-center text-center"
                                            // className="btn btn-primary mt-3 d-flex align-items-center justify-content-center"

                                            style={{
                                                backgroundColor: "#7ACB59",
                                                border: "none",
                                                padding: "10px 20px",
                                                fontSize: "16px",
                                                width: '250px',
                                                borderRadius: "5px",
                                                display: "inline-block"

                                            }}
                                        // onClick={() => enqueueSnackbar("Redirecting to your email for verification...", { variant: "info" })}
                                        >
                                            <FaGoogle size={18} style={{ color: "white" }} />
                                            Open Gmail →
                                        </a>
                                        <a
                                            href={`mailto:${emailfromlink}?subject=Resend Verification Email&body=Hello, please resend my verification email.`}
                                            className="btn btn-primary mt-3 d-flex gap-1 align-items-center justify-content-center text-center"
                                            // className="btn btn-primary mt-3 d-flex align-items-center justify-content-center"

                                            style={{
                                                backgroundColor: "#7ACB59",
                                                border: "none",
                                                padding: "10px 20px",
                                                fontSize: "16px",
                                                // width: '150px',
                                                borderRadius: "5px",
                                                display: "inline-block"

                                            }}
                                        // onClick={() => enqueueSnackbar("Redirecting to your email for verification...", { variant: "info" })}
                                        >
                                            <FaEnvelope size={18} style={{ color: "white" }} /> {/* Email Icon */}
                                            Verify Your Email Now →
                                        </a>

                                    </div>
                                    {/* </button> */}
                                    {/* 🔹 Text with Different Font Sizes */}
                                    {/* <p className=" flex-end text-center" style={{ marginTop: '5%', fontSize: "18px", fontWeight: "bold" }}> */}
                                    <span style={{ marginTop: '5%', fontSize: "18px", fontWeight: "bold" }}>
                                        Please check your inbox and
                                    </span>
                                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                        follow the instructions to activate your account.
                                    </span>
                                    {/* </p> */}
                                    <p className="text-muted" style={{ marginTop: '2%', fontSize: "14px" }}>
                                        If you don’t see it, check your spam or junk folder.
                                    </p>
                                    {/* <span className="d-block" style={{ marginTop: '10%', fontSize: "14px", marginTop: "-2%" }}>Please check your inbox and
                                    </span>
                                    <span>
                                        follow the instructions to activate your account.
                                    </span>
                                        <p className="text-muted" style={{ marginTop: '10%', fontSize: "14px", marginTop: "-2%" }}>
                                        If you don’t see it, check your spam or junk folder.
                                    </p>
                                    {/* <span className="d-block">A verification link has been sent to your email.</span> */}
                                    {/* </div> */}
                                </div>
                                <div className="col-lg-6 text-center">
                                    <img
                                        src={verifyImge}
                                        alt="Verification"
                                        className="img-fluid"
                                        style={{ maxWidth: "80%", height: "auto" }} // Adjust width as needed
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* <p className="freePera" >Try it Free for 14 days</p> */}

                            <p className="freePera">Sign Up Now</p>

                            {/* <p className="mainFont">Maintain it Free always on the Free Plan.</p> */}
                            {/* <div className="maininputdivs" id='signUp-btn'> */}
                            <div className="container my-5">
                                <div className="row justify-content-center">
                                    <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                                        <div className="card p-4 shadow">
                                            {/* <div className="mainInputDiv"> */}
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

                                            {/* <div className="mb-3">
                                                <PhoneInput
                                                    country={'us'}
                                                    value={model.phoneNumber}
                                                    onChange={(value) => fillModel('phoneNumber', `+${value}`)} // ✅ Add "+"
                                                    inputClass="form-control"
                                                    inputStyle={{ width: "100%" }}
                                                    placeholder="Enter phone number"
                                                    enableSearch
                                                />
                                            </div> */}

                                            <div className="phoneNumber">
                                                {/* <div><img src={email} alt="Phone Icon" /></div> */}
                                                <PhoneInput
                                                    country={'us'}
                                                    value={model.phoneNumber}
                                                    onChange={(value) => fillModel('phoneNumber', `+${value}`)}
                                                    inputClass="phoneInputInner"
                                                    inputStyle={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        width: '100%',
                                                        fontSize: '14px',
                                                        background: 'transparent'
                                                    }}
                                                    containerStyle={{ width: '100%' }}
                                                    buttonStyle={{ background: 'transparent', border: 'none' }}
                                                    enableSearch
                                                    placeholder="Phone Number"
                                                />
                                            </div>
                                
                                            <button disabled={loading} onClick={handleCreateAccount} className={loading ? "disabledAccountButton" : "accountButton"}>
                                                {loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Create Account"}
                                            </button>
                                            {/* </div> */}
                                        </div>
                                        <p className="loginFont">Already have an account? <span
                                            style={{
                                                color: "#7ACB59",
                                                textDecoration: "underline",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => navigate('/signin')}>Login</span></p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
            <img className="liness" src={line} />
        </div>
    )
}

export default Signup;