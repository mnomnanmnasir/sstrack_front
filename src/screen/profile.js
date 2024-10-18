import React, { useEffect, useState } from "react";
import user from "../images/user-account.webp";
import UserHeader from "./component/userHeader";
import line from "../images/line.webp";
import Footer from "./component/footer";
import UserDashboardSection from "./component/userDashboardsection";
import TimezoneSelect from 'react-timezone-select';
import AdminDashboardHeader from "./component/adminHeadSection";
import OwnerDashboardHeader from "../companyOwner/ownerComponent/ownerSection";
import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { FerrisWheelSpinner } from "react-spinner-overlay";
import { useNavigate } from "react-router-dom";
import goBackIcon from '../images/go-back.svg'

function Profile() {

    const navigate = useNavigate();
    const [model, setModel] = useState({});
    const [loading, setLoading] = useState(false);
    let token = localStorage.getItem('token');
    const [data, setData] = useState();
    const [timezone, setSelectedTimezone] = useState(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    )
    const items = JSON.parse(localStorage.getItem('items'));

    let headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
    }

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

    let fillModel = (key, val) => {
        console.log(val);
        model[key] = val;
        setModel({ ...model })
        console.log(JSON.stringify(model));
    }

    const handleStartDateChange = (timezone) => {
        console.log(timezone);
        setSelectedTimezone(timezone);
        const newtime = timezone?.value;
        setModel({ "timezoneOffset": timezone?.offset })
        setModel((prevUserInfo) => ({
            ...prevUserInfo,
            timezone: newtime,
        }));
    };


    async function updateData() {
        setLoading(true)
        try {
            const response = await axios.patch(`${apiUrl}/signin/users/Update`, {
                ...model
            }, {
                headers: headers
            })
            if (response.data) {
                console.log(response);
                setLoading(false)
                enqueueSnackbar("profile updated successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("items", JSON.stringify(response.data.user));
                setTimeout(() => {
                    navigate("/account")
                }, 1000);
            }
        } catch (error) {
            setLoading(false)
            enqueueSnackbar("Network error", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            console.log(error);
        }
    }

    function goBack() {
        navigate("/account")
    }

    useEffect(() => {
        setSelectedTimezone(items.timezone)
    }, [])

    console.log(items)

    return (
        <div>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <div className="headerTop">
                        <img src={user} />
                        <h5>My Profile</h5>
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="profileContainer">
                        <img onClick={goBack} src={goBackIcon} alt="" width={40} style={{ cursor: "pointer" }} />
                        <div className="profileDiv container d-flex justify-content-center">
                            <div className="profileWidth">
                                <div>
                                    <label className="countryLabel">Full Name</label>
                                    <div className="countryDropdown">
                                        <input onChange={(e) => fillModel("name", e.target.value)} defaultValue={items?.name.charAt(0).toUpperCase() + items.name.slice(1)} />
                                    </div>
                                </div>
                                <div>
                                    <label className="countryLabel">Email</label>
                                    <div className={(items?.userType === "owner" || items?.userType === "admin") ? "countryDropdown" : "countryDropdownDisabled"}>
                                        <input disabled={items?.userType !== "owner" ? true : false} onChange={(e) => fillModel("email", e.target.value)} style={{ width: '100%', backgroundColor: (items?.userType === "user" || items?.userType === "admin" || items?.userType === "manager") ? "#ccc" : "#E8F4FC" }} defaultValue={items?.email} />
                                    </div>
                                </div>
                                <div>
                                    <label className="countryLabel">Company</label>
                                    <div className={(items?.userType === "owner" || items?.userType === "admin") ? "countryDropdown" : "countryDropdownDisabled"}>
                                        <input disabled={items?.userType === "owner" || items?.userType === "user" || items?.userType === "admin" || items?.userType === "manager"} style={{ width: '100%', backgroundColor: (items?.userType === "owner" || items?.userType === "user" || items?.userType === "admin" || items?.userType === "manager") ? "#ccc" : "#E8F4FC" }}
                                            onChange={(e) => fillModel("company", e.target.value)} defaultValue={items?.company} />
                                    </div>
                                </div>
                                <div>
                                    <label className="countryLabel">Time Zone</label>
                                    <div className="dropdown">
                                        <div>
                                            <TimezoneSelect value={timezone ? timezone : items.timezone} onChange={handleStartDateChange} />
                                        </div>
                                        {/* <Timezone /> */}
                                        {/* <button className="btn btn-secondary dropdown-toggle  countryDropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                (UTC+05:00) Islamabad, Karachi
                                            </button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="saveCancelButton">
                            <button disabled={loading} onClick={updateData} className={loading ? "disabledAccountButton2" : "saveButton"}>{loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Save"}</button>
                            <p>Or</p>
                            <button onClick={() => navigate("/account")} className="cancelButton">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            <img src={line} className="profileLine" />
        </div>
    )

}

export default Profile;