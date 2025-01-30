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
import { useNavigate, useLocation } from "react-router-dom";
import goBackIcon from '../images/go-back.svg'
import jwtDecode from "jwt-decode";

function Profile() {


    const navigate = useNavigate();
    const [model, setModel] = useState({
        name: null,
        email: null,
        company: null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: null
    });
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    let token = localStorage.getItem('token');
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");

    const [data, setData] = useState();
    const [timezone, setSelectedTimezone] = useState(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const items = jwtDecode(JSON.stringify(token)); // Fallback to empty object if items is null

    let headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
    };

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

    let fillModel = (key, val) => {
        setModel((prevModel) => ({
            ...prevModel, // Spread the previous state
            [key]: val,   // Update the key with the new value
        }));
    };

    const handleStartDateChange = (timezone) => {
        setSelectedTimezone(timezone);
        const newtime = timezone?.value;
        setModel((prevUserInfo) => ({
            ...prevUserInfo,
            timezone: newtime,
            timezoneOffset: timezone?.offset
        }));
    };

    async function handleSave() {
        if (location.state?.fromAccount) {
            // User navigated from /account
            await updateData();
        } else {
            // User navigated directly to profile
            await merafunction();
        }
    }


    async function updateData() {
        // Check if token is missing
        if (!token) {
            // If token is missing, redirect to login page (you can show a login modal or popup as well)
            navigate("/signin");
            return; // Exit the function, no need to proceed with the save
        }

        setLoading(true);
        try {
            const response = await axios.patch(`${apiUrl}/signin/users/Update`, { ...model }, { headers: headers });
            if (response.data) {
                setLoading(false);
                enqueueSnackbar("Profile updated successfully", { variant: "success", anchorOrigin: { vertical: "top", horizontal: "right" } });
                setTimeout(() => navigate("/account"), 1000);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("items", JSON.stringify(response.data.user));
            }
        } catch (error) {
            setLoading(false);
            enqueueSnackbar("Network error", { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } });
            console.error(error);
        }
    }

    useEffect(() => {
        if (items) {
            // Set model fields based on the available data in `items`
            fillModel("name", items?.name || null);
            fillModel("email", items?.email || null);
            fillModel("company", items?.company || null);
            fillModel("timezone", items.timezone || null);
            fillModel("timezoneOffset", items?.timezoneOffset || 5);

            if (items.timezone) {
                setSelectedTimezone(items?.timezone);
            }
        }
    }, []);
    // async function updateData() {
    //     setLoading(true);
    //     try {
    //         const response = await axios.patch(`${apiUrl}/signin/users/Update`, { ...model }, { headers: headers });
    //         if (response.data) {
    //             setLoading(false);
    //             enqueueSnackbar("Profile updated successfully", { variant: "success", anchorOrigin: { vertical: "top", horizontal: "right" } });
    //             // localStorage.setItem("token", response.data.token);
    //             // localStorage.setItem("items", JSON.stringify(response.data.user));
    //             setTimeout(() => navigate("/account"), 1000);
    //         }
    //     } catch (error) {
    //         setLoading(false);
    //         enqueueSnackbar("Network error", { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } });
    //         console.error(error);
    //     }
    // }

    function goBack() {
        navigate("/account");
    }



    useEffect(() => {
        // Retrieve the email from localStorage
        const googleEmail = localStorage.getItem("googleEmail");
        const googleName = localStorage.getItem("googleName");

        if (googleEmail) {
            setEmail(googleEmail); // Set the email in the input field
            setName(googleName); // Set the email in the input field
            setCompany()
        }
    }, []);

    // async function updateData() {
    //     // Check if token is missing
    //     if (!token) {
    //         // If token is missing, redirect to login page (you can show a login modal or popup as well)
    //         navigate("/signin");
    //         return; // Exit the function, no need to proceed with the save
    //     }

    //     setLoading(true);
    //     try {
    //         const response = await axios.patch(`${apiUrl}/microsoft/authSignup `, { ...model }, { headers: headers });
    //         if (response.data) {
    //             const updatedItems = { ...items, company: model.company, name: model.name, email: model.email, timezone: model.timezone, timezoneOffset: model.timezoneOffset };
    //             localStorage.setItem('items', JSON.stringify(updatedItems));    
    //             console.log("Updated on localStorage", updatedItems)
    //             setLoading(false);
    //             enqueueSnackbar("Profile updated successfully", { variant: "success", anchorOrigin: { vertical: "top", horizontal: "right" } });
    //             setTimeout(() => navigate("/dashboard"), 1000);
    //         }
    //     } catch (error) {
    //         setLoading(false);
    //         enqueueSnackbar("Network error", { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } });
    //         console.error(error);
    //     }
    // }

    async function merafunction() {
        console.log('Current model:', model);
        setLoading(true);

        try {
            const response = await axios.post(
                `https://myuniversallanguages.com:9093/api/v1/auth/microsoft/authSignup`,
                {
                    userId: "672cc6df2a2b7806b4bea9cb", // Replace with the actual userId if needed
                    name: model.name, // Use model.name
                    userType: items?.userType, // Ensure this is the correct user type
                    timezone: model.timezone, // Use the timezone from the model
                    timezoneOffset: model.timezoneOffset, // Use the timezone offset from the model
                    company: model.company // Ensure you're using model.company
                },
                { headers: headers }
            );

            // Log the entire response for debugging
            console.log('Response from API:', response);

            if (response.data.success) {

                // Save the updated model to localStorage
                const updatedItems = {
                    ...jwtDecode(JSON.stringify(token)),
                    name: model.name,
                    email: model.email,
                    company: model.company,
                    timezone: model.timezone,
                    timezoneOffset: model.timezoneOffset,
                };
                window.location.reload()
                // Navigate to the dashboard after a short delay to allow the snackbar to display
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000); // Adjust the delay as needed
                localStorage.setItem('items', JSON.stringify(updatedItems)); // Save to localStorage

                console.log('Data from API if post successful:', response.data);
                setLoading(false);
                enqueueSnackbar("Account Created Successfully", { variant: "success", anchorOrigin: { vertical: "top", horizontal: "right" } });
            } else {
                console.error('API response indicates failure:', response.data);
                setLoading(false);
                enqueueSnackbar("Failed to create account", { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } });
            }
        } catch (error) {
            setLoading(false);
            enqueueSnackbar("Network error", { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } });
            console.error('Error during API request:', error);
        }
    }
    // async function merafunction() {
    //     console.log('Current model:', model);
    //     setLoading(true);

    //     try {
    //         const response = await axios.post(
    //             `https://myuniversallanguages.com:9093/api/v1/auth/microsoft/authSignup`,
    //             {
    //                 userId: "672cc6df2a2b7806b4bea9cb", // Replace with the actual userId if needed
    //                 name: model.name, // Use model.name
    //                 userType: "owner", // Ensure this is the correct user type
    //                 timezone: model.timezone, // Use the timezone from the model
    //                 timezoneOffset: model.timezoneOffset, // Use the timezone offset from the model
    //                 company: model.company // Ensure you're using model.company
    //             },
    //             { headers: headers }
    //         );

    //         // Log the entire response for debugging
    //         console.log('Response from API:', response);

    //         if (response.data.success) {
    //             // Save the updated model to localStorage
    //             const updatedItems = {
    //                 ...JSON.parse(localStorage.getItem('items')),
    //                 name: model.name,
    //                 email: model.email,
    //                 company: model.company,
    //                 timezone: model.timezone,
    //                 timezoneOffset: model.timezoneOffset,
    //             };

    //             localStorage.setItem('items', JSON.stringify(updatedItems)); // Save to localStorage
    //             enqueueSnackbar("Account Created Successfully", { variant: "success", anchorOrigin: { vertical: "top", horizontal: "right" } });

    //             // Navigate to the dashboard after a short delay to allow the snackbar to display
    //             setTimeout(() => {
    //                 navigate("/dashboard");
    //             }, 2000); // Adjust the delay as needed
    //         } else {
    //             console.error('API response indicates failure:', response.data);
    //             enqueueSnackbar("Failed to create account", { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } });
    //         }
    //     } catch (error) {
    //         enqueueSnackbar("Network error", { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } });
    //         console.error('Error during API request:', error);
    //     } finally {
    //         setLoading(false); // Ensure loading state is set to false in all cases
    //     }
    // }


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
                                        {/* <input
                                            value={model?.name || ""}
                                            onChange={(e) => fillModel("name", e.target.value)}
                                            placeholder="Your full name"
                                        /> */}
                                        <input onChange={(e) => fillModel("name", e.target.value)} defaultValue={items?.name.charAt(0).toUpperCase() + items.name.slice(1)} />
                                        {/* <input defaultValue={items?.name} onChange={(e) => fillModel("name", e.target.value)} placeholder="Your full name" /> */}
                                    </div>

                                </div>
                                <div>
                                    <label className="countryLabel">Email</label>
                                    <div className={(items?.userType === "owner" || items?.userType === "admin") ? "countryDropdown" : "countryDropdownDisabled"}>
                                        <input  // Display email value here
                                            disabled={items?.userType !== "owner" ? true : false} onChange={(e) => fillModel("email", e.target.value)} style={{ width: '100%', backgroundColor: (items?.userType === "user" || items?.userType === "admin" || items?.userType === "manager") ? "#ccc" : "#E8F4FC" }} defaultValue={items?.email} />
                                    </div>
                                </div>
                                <div>
                                    <label className="countryLabel">Company</label>
                                    <div className={(items?.userType === "owner" || items?.userType === "admin") ? "countryDropdown" : "countryDropdownDisabled"}>
                                        <input
                                            disabled={
                                                (items?.userType === "owner" || items?.userType === "user" || items?.userType === "admin" || items?.userType === "manager")
                                                && items?.company // only disable if userType matches and company field is not empty
                                            }
                                            style={{
                                                width: '100%',
                                                backgroundColor: (items?.userType === "owner" || items?.userType === "user" || items?.userType === "admin" || items?.userType === "manager") && items?.company ? "#ccc" : "#E8F4FC"
                                            }}
                                            onChange={(e) => fillModel("company", e.target.value)}
                                            defaultValue={items?.company}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="countryLabel">Time Zone</label>
                                    <div className="dropdown">
                                        <TimezoneSelect value={timezone} onChange={handleStartDateChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="saveCancelButton">
                            <button disabled={loading} onClick={handleSave} className={loading ? "disabledAccountButton2" : "saveButton"}>{loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Save"}</button>
                            <p>Or</p>
                            <button onClick={() => navigate("/dashboard")} className="cancelButton">Cancel</button>
                            {/* <button onClick={merafunction} className="cancelButton">me hn buttn</button> */}
                        </div>
                    </div>
                </div>
            </div>
            <img src={line} className="profileLine" />
        </div>
    )

}

export default Profile; 