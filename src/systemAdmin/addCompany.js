import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TimezoneSelect from 'react-timezone-select';
import email from "../images/emailIcon.webp";
import password from "../images/passwordIcon.webp";
import user from "../images/user.webp";
import company from "../images/account.webp";
import time from "../images/time.png";
import cut from "../images/cross.webp";
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import axios from 'axios';

const AddCompany = () => {

    const navigate = useNavigate();
    let token = localStorage.getItem('adminToken');
    const [timezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
    const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
    const [model, setModel] = useState({
        userType: 'owner',
    });
    const [currentTimezone, setCurrentTimeZone] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleCreateCompany() {
        console.log(model);
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
                        navigate('/systemAdminDashboard')
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
        console.log("timezone", selectedtimezone);
        setSelectedTimezone(selectedtimezone);
        setCurrentTimeZone(selectedtimezone)
        console.log(selectedtimezone);
        fillModel("timezoneOffset", selectedtimezone?.offset)
        fillModel("timezone", selectedtimezone?.value)
    };

    let fillModel = (key, val) => {
        model[key] = val;
        setModel({ ...model })
    }

    let headers = {
        Authorization: 'Bearer ' + token,
    }

    return (
        <div className="mt-5">
            <SnackbarProvider />
            <div className="maininputdivs">
                <div className="mainInputDiv">
                    <p className="accessFont">Create Company</p>
                    <div className="inputDiv">
                        <div><img src={user} /></div>
                        <input onChange={(e) => fillModel("name", e.target.value)} placeholder="Your full name" required />
                    </div>
                    <div className="inputDiv">
                        <div><img src={company} /></div>
                        <input onChange={(e) => fillModel("company", e.target.value)} placeholder="Company " required />
                    </div>
                    <div className="inputDiv">
                        <div><img src={email} /></div>
                        <input type="email" onChange={(e) => fillModel("email", e.target.value)} placeholder="Email" required />
                    </div>
                    <div className="inputDiv">
                        <div><img src={password} /></div>
                        <input onChange={(e) => fillModel("password", e.target.value)} type="password" placeholder="Password (8 or more characters)" required />
                    </div>
                    <div className="inputDiv">
                        <div><img src={time} /></div>
                        <div>
                            <TimezoneSelect value={timezone} onChange={handleStartDateChange} />
                        </div>
                    </div>
                    <button onClick={handleCreateCompany} className="accountButton">
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCompany;