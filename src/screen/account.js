import axios from "axios";
import moment from "moment-timezone";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import deleteIcon from "../images/deleteIcon.webp";
import edit from "../images/editIcon.webp";
import line from "../images/line.webp";
import passwords from "../images/passwordIcon.webp";
import user from "../images/user-account.webp";
import jwtDecode from 'jwt-decode';
import BillingComponent from "./BillingComponent";

import Payment from './payment';

function Account({ suspended }) {

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    // const [showTooltip, setShowTooltip] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(true); // ✅ Track first-time password generation
    const [firstTimeGenerated, setFirstTimeGenerated] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [show, setShow] = useState(false);
    const [updatePassword, setUpdatePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("")
    const [ setLoading] = useState(false);
    const [cards, setCards] = useState([]);
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [verify, setVerify] = useState(false);
    const [showModalwithoutcard, setShowModalwithoutcard] = useState(false);
    const [showWarning] = useState(false);
    let token = localStorage.getItem('token');
    const navigate = useNavigate('');
    const apiUrl = process.env.REACT_APP_API_URL;
    const items = jwtDecode(JSON.stringify(token));
    const [ratePerHour, setRatePerHour] = useState(null);
    let headers = {
        Authorization: 'Bearer ' + token,
    }
    const [selectedPlan] = useState(null);

    const [paycard, setpaycard] = useState();
    const [breakStartTime, setBreakStartTime] = useState("");
    const [breakEndTime, setBreakEndTime] = useState("");
    const [puncStartTime, setPuncStartTime] = useState("");
        const [puncEndTime, setPuncEndTime] = useState("");
        const [currencySymbol, setCurrencySymbol] = useState('');


    const generatePassword = () => {
        if (isFirstTime) { // ✅ Only show the message if it's the first time after opening modal
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
            let password = "";
            for (let i = 0; i < 12; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            setNewPassword(password);
            setNewPassword2(password);

            setShowMessage(true);
            setIsFirstTime(false); // ✅ Prevent message from showing again in this session

            // ✅ Hide message after 5 seconds
            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
        } else {
            // ✅ Just generate password without showing the message again
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
            let password = "";
            for (let i = 0; i < 12; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            setNewPassword(password);
            setNewPassword2(password);
        }
    };

    // ✅ Reset `isFirstTime` when the modal opens
    React.useEffect(() => {
        if (show) {
            setIsFirstTime(true);
        }
    }, [show]);


    const handleKeyPress = (e) => {
        if (e.key === " ") {
            e.preventDefault();
            const newGeneratedPassword = generatePassword();
            setNewPassword(newGeneratedPassword);
            setNewPassword2(newGeneratedPassword);
        }
    };

    const fetchBreakTime = async (userId) => {
        try {
            const response = await axios.get(
                `${apiUrl}/timetrack/getPunctualityDataEachUser`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 200) {
                console.log("Full API Response:", response.data);

                const data = response.data.data;
                const breakData = data.convertedBreakTimes?.[0];
                // const rate = data.ratePerHour;
                const rate = data.billingInfo?.ratePerHour; // ✅ CORRECT
                const currency = data.billingInfo?.currency;

                console.log("Rate Per Hour:", rate);
                setRatePerHour(rate);
                setCurrencySymbol(currency); // 👈 create a new state for this
                setCurrencySymbol(getCurrencySymbol(currency));

                const puncStart = data.puncStartTime ? data.puncStartTime.substring(11, 16) : "";
                const puncEnd = data.puncEndTime ? data.puncEndTime.substring(11, 16) : "";

                console.log("PuncStart:", puncStart);
                console.log("PuncEnd:", puncEnd);



                if (breakData) {
                    const breakStart = breakData.breakStartTime
                        ? breakData.breakStartTime.substring(11, 16)
                        : "";

                    const breakEnd = breakData.breakEndTime
                        ? breakData.breakEndTime.substring(11, 16)
                        : "";

                    console.log("✅ Break Start Time (formatted):", breakStart);
                    console.log("✅ Break End Time (formatted):", breakEnd);

                    fillModel("breakStartTime", breakStart);
                    fillModel("breakEndTime", breakEnd);
                }

                fillModel("puncStartTime", puncStart);
                fillModel("puncEndTime", puncEnd);
            }
        } catch (error) {
            console.error("Error fetching break time:", error);
        }
    };

    const getCurrencySymbol = (currencyCode) => {
        switch (currencyCode) {
            case "USD": return "$";
            case "CAD": return "C$";
            case "INR": return "₹";
            case "PKR": return "PKR";
            case "PHP": return "₱";
            case "SAR": return "SAR";
            case "QAR": return "QAR";
            case "AED": return "AED";
            default: return currencyCode || "";
        }
    };

    // ✅ State Update Function
    const fillModel = (field, value) => {
        if (field === "breakStartTime") {
            setBreakStartTime(value);
        } else if (field === "breakEndTime") {
            setBreakEndTime(value);
        } else if (field === "puncStartTime") {  // ✅ Added
            setPuncStartTime(value);
        } else if (field === "puncEndTime") {    // ✅ Added
            setPuncEndTime(value);
        }
    };

    useEffect(() => {
        // ✅ Call API to Fetch Break Time & Punctuality Time
        fetchBreakTime(items._id);
    });

    // Create the plandetail string
    const [isArchived, setIsArchived] = useState(null);

    const handleShow = () => {
        if (isArchived) {
            setShowConfirmModal(true);

        } else {
            setShow(true);
        }
    };

    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");



    async function deleteMyAccount() {
        try {
            const ownerId = items._id; // Owner ID get kar rahe hain

            const res = await fetch(`${apiUrl}/signin/userDelete/${ownerId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                console.log("User Archived Successfully!");
                enqueueSnackbar("Account archived successfully", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });
                setIsArchived(true); // ✅ UI instantly update hoga


                // Step 2: Call verifyDeleteAccount function
                verifyDeleteAccount();
            } else {
                const errorData = await res.json(); // Error message extract karna
                enqueueSnackbar(`Failed: ${errorData.message || "Error occurred"}`, {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });
            }
        } catch (error) {
            console.error("Error archiving account:", error);
            enqueueSnackbar("Error deleting account", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        }
    }

    const handleConfirmArchive = () => {
        setShowConfirmModal(false)

        setTimeout(() => {
            setShowVerifyModal(true);
            enqueueSnackbar("Please check your email for verification code.", {
                variant: "info",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        }, 500);
    };

    // const handleArchive = async () => {
    //     await deleteMyAccount(); // Archive function ko pehle execute karein

    //     setTimeout(() => {
    //         setShow(false);  // Pehle archive modal close karein
    //         setShowVerifyModal(true); // Phir verification modal open karein
    //     }, 500); // 0.5 second ka delay taake state properly update ho
    // };


    const handleArchive = async () => {
        await deleteMyAccount();
        setShow(false);

        setTimeout(() => {
            setShowConfirmModal(true);
        }, 500);
    };


    // const [showVerifyModal, setShowVerifyModal] = useState(false);
    // const [verificationCode, setVerificationCode] = useState("");
    // const [email, setEmail] = useState(items.email);
    const [setShowDeleteButton] = useState(false);

    // ✅ Jab bhi isArchived change hoga, yeh useEffect chalega

    // Step 1: Send verification code to email
    async function verifyDeleteAccount() {
        try {
            console.log("Verifying delete request for:", items.email);

            const res = await fetch(`${apiUrl}/superAdmin/verifyDeleteAccount`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: items.email
                })
            });

            const responseData = await res.json();

            if (responseData.user.isArchived) {
                setIsArchived(true);  // ✅ isArchived ko state me update karein
                localStorage.setItem("isArchived", true); // ✅ LocalStorage me bhi save karein
            }

            enqueueSnackbar("Verification code sent to email", {
                variant: "info",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });

            setShowDeleteButton(true);
            // setShowVerifyModal(true);

        } catch (error) {
            console.error("Error sending verification code:", error);
            enqueueSnackbar(error.message, {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        }
    }

    const [setIsDeleted] = useState(false);

    // Step 2: Verify Code API Call
    async function verifyCode() {
        try {
            console.log("Verifying code for email:", items.email); // Debugging ke liye

            const res = await fetch(`${apiUrl}/superAdmin/verifycode`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    verification: verificationCode,  // ✅ Correct verification code
                    email: items.email               // ✅ Correct email
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Invalid verification code");
            }

            enqueueSnackbar("Verification successful", {
                variant: "success",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });

            setShowVerifyModal(false);
            // ✅ Step 4: Delete Account Permanently
            deleteCompanyAndUsers();
            setIsDeleted(true);

        } catch (error) {
            console.error("Error verifying code:", error);
            enqueueSnackbar(error.message, {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        }
    }

    // Final Delete API Call
    async function deleteCompanyAndUsers() {
        try {
            const res = await fetch(`${apiUrl}/superAdmin/deleteCompanyAndUsers`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ email: items.email })
            });

            if (res.status === 200) {
                enqueueSnackbar("Account successfully deleted", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });

                // Clear local storage and logout
                localStorage.removeItem("items");
                localStorage.removeItem("token");

                setTimeout(() => {
                    navigate("/");
                    window.location.reload();
                }, 1000);
            } else {
                enqueueSnackbar("Failed to delete account completely", {
                    variant: "error",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });
            }
        } catch (error) {
            console.error("Error deleting account permanently:", error);
            enqueueSnackbar("Error deleting account permanently", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });
        }
    }


    async function verifyPassword() {
        if (currentPassword !== "") {
            try {
                const res = await axios.patch(`${apiUrl}/signin/users/Verifypass`, {
                    oldPassword: currentPassword
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.status === 200) {
                    console.log(res);
                    setVerify(true);
                    enqueueSnackbar("Password verified successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    });
                    updateMyPassword()
                } else {
                    // Handle cases where the status is not 200 (e.g., 400, 401, etc.)
                    setVerify(false);
                    enqueueSnackbar("Failed to verify password", {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    });
                }
            } catch (error) {
                // Catch and handle any network or other unexpected errors
                setVerify(false);
                console.log(error);
                enqueueSnackbar(error?.response?.data?.message, {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            }
        }
    }


    const updateMyPassword = async () => {
        if (newPassword === "" || newPassword2 === "") {
            console.log("asddas");
        }
        if (newPassword === currentPassword || newPassword2 === currentPassword) {
            enqueueSnackbar("New password should unique", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        } else {
            setUpdatePassword(false)
            try {
                const params = new URLSearchParams();
                params.append('password', newPassword);

                const res = await fetch(`${apiUrl}/signin/users/Update`, {
                    method: "PATCH",
                    body: params,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                console.log("API Response:", res);
                if (res.status === 200) {
                    console.log((await res.json()));
                    enqueueSnackbar("password updated successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                } else {
                    const errorResponse = await res.json(); // Extract the error response
                    console.log("Error updating password:", errorResponse.message); // Log the error message to the console

                    // Display the error message in the snackbar
                    enqueueSnackbar(errorResponse.message || "Failed to update password", {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    });
                }
            } catch (error) {
                console.log("Error updating password:", error);
                enqueueSnackbar(error.response?.data?.message, {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
        }
    }


    const offsetInMinutes = moment.tz(items.timezone).utcOffset();
    const offsetInHours = offsetInMinutes / 60;
    const offsetSign = offsetInHours >= 0 ? '+' : '-';
    const formattedOffset = `${offsetSign}${Math.abs(offsetInHours)}`;




    const [ setSelectedCard] = useState(
        cards.find(card => card.defaultCard)?._id || null
    );

    const fetchTokenAndSuspendedStatus = async () => {
        if (token) {
            try {
                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const apiUrl1 = '${apiUrl}';
                const response = await axios.get(`${apiUrl1}/owner/getCompanyInfo`, { headers });
                const fetchedCards = response?.data.data[0].cardInfo;
                console.log('Fetched Cards:', fetchedCards);

                // Set the cards
                setCards(fetchedCards);

                // Set the default card as the selected card
                const defaultCard = fetchedCards.find(card => card.defaultCard);
                if (defaultCard) {
                    setSelectedCard(defaultCard._id);
                    setpaycard(defaultCard);
                }

            } catch (err) {
                console.error('Error fetching data', err);
            }
        }
        setLoading(false);
    };

    const getData = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/owner/companies`, { headers });

            // ✅ اگر API response میں employees موجود ہیں
            if (response?.data?.employees) {
                const ownerUser = response.data.employees.find(user => user.userType === "owner");

                if (ownerUser) {
                    console.log("Fetched isArchived:", ownerUser.isArchived); 
                }
            }
        } catch (error) {
            console.error("Error fetching owner data:", error);

            if (error.response?.data?.isArchived !== undefined) {
                console.log("Error Response isArchived:", error.response.data.isArchived);
                setIsArchived(error.response.data.isArchived);
            } else {
                setIsArchived(false);  // Default false رکھیں
            }
        }
    }, [headers]);

    useEffect(() => {
        getData();
    });

    useEffect(() => {
        getData();
        fetchTokenAndSuspendedStatus();

    });

    useEffect(() => {
        const fetchArchivedStatus = async () => {
            try {
                const response = await axios.get(`${apiUrl}/owner/companies`, { headers });
                const ownerUser = response?.data?.employees?.find(user => user.userType === 'owner');

                if (ownerUser) {
                    setIsArchived(ownerUser.isArchived);
                    console.log("Updated isArchived after refresh:", ownerUser.isArchived);
                }
            } catch (error) {
                console.error("Error fetching owner data:", error);
            }
        };

        fetchArchivedStatus();
    });

    useEffect(() => {
        if (isArchived) {
            // setShowVerifyModal(true);
        }
    }, [isArchived]);

    const fetchOwnerData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/owner/companies`, { headers });
            const ownerUser = response?.data?.employees?.find(user => user.userType === 'owner');

            if (ownerUser) {
                setIsArchived(ownerUser.isArchived);
                localStorage.setItem("isArchived", ownerUser.isArchived);
            }
        } catch (error) {
            console.error("Error fetching owner data:", error);
        }
    };

    useEffect(() => {
        fetchOwnerData();
    }); 




    const [setSelectedPackage] = useState()

    useEffect(() => {
        const storedPlanId = JSON.parse(localStorage.getItem('planId'));
        if (storedPlanId?.planType === 'free') {
            setSelectedPackage(1); // Basic
        } else if (storedPlanId?.planType === 'standard') {
            setSelectedPackage(2); // Standard
        } else if (storedPlanId?.planType === 'premium') {
            setSelectedPackage(3); // Premium
        }
    }); // Empty dependency array to run only once on component mount


    const handleCloseModal2 = () => {
        setShowModalwithoutcard(false);
    };

    const Withoutcardpayment = ({ showModalwithoutcard, handleCloseModal2, selectedPlan }) => {
        return (
            <Modal show={showModalwithoutcard} onHide={handleCloseModal2} centered>
                <Modal.Header closeButton>
                    {/* <Modal.Title>Change Your Plan</Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                    <div className="text-left mb-4" >
                        {/* Optional elements can be placed here */}
                        {selectedPlan ? (
                            <div>
                                Are you sure you want to chage your plan
                                <div className='container d-flex'>
                                    <div className="row d-flex" style={{ width: '60rem' }}>
                                        <div className="col-md-12">
                                            <div className='card mt-2' style={{ marginLeft: '-12px' }}>
                                                <div className="card-body" style={{ height: '12rem' }}>
                                                    <div className='d-flex justify-content-between align-items-center'>
                                                        {paycard ? paycard.cardType : "Visa"}
                                                        <img
                                                            src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                                                            alt="Visa logo"
                                                            style={{ width: '60px', height: 'auto' }}
                                                        />
                                                    </div>
                                                    <span>
                                                        **** **** **** {paycard ? paycard.cardNumber : ""}
                                                    </span>
                                                    <div className='d-flex'>
                                                        Expires
                                                    </div>
                                                    <div>
                                                        {paycard ? paycard.expMonth : '**'}/{paycard ? paycard.expYear : '**'}
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>No plan selected</div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button style={{
                        alignSelf: "center",
                        marginLeft: '10px',
                        padding: '5px 10px',  // Adjusting padding for a smaller size
                        backgroundColor: 'green',  // Green background
                        color: 'white',  // White text
                        border: 'none',  // Removing default border
                        borderRadius: '5px',  // Rounded corners
                        cursor: 'pointer',  // Pointer on hover
                        fontSize: '0.875rem'
                    }}
                        onClick={() => {
                            handleDirectChangePlan();
                            setPlanData(selectedPlan);
                            // localStorage.setItem('planIdforHome', JSON.stringify(selectedPlan));
                            handleCloseModal2()
                        }}
                    // onClick={handleDirectChangePlan}
                    >Pay Now</button>
                </Modal.Footer>
            </Modal >
        );
    };


    const handleDirectChangePlan = async () => {
        const DirectPayApiUrl = `${apiUrl}`;
        if (paycard) {
            console.log('Pay with this card:', paycard);
            // setIsLoading(true);
            try {
                const res = await axios.post(`${DirectPayApiUrl}/owner/upgrade`,
                    {
                        planId: selectedPlan._id,
                    }, { headers })
                console.log('Response owner', res);
                const receiptUrl = res.data.data.receiptUrl; // Add this line
                console.log('Receipt URL:', receiptUrl); // Add this line
                window.open(receiptUrl, '_blank'); // Open receiptUrl in a new tab



                if (res.status === 200) {
                    console.log('Response', res.data.success)
                    enqueueSnackbar("Plan Changed Successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }

                    })
                    // window.open(receiptUrl, '_blank'); // Open receiptUrl in a new tab
                }

                else {
                    if (res.status === 403) {
                        alert("Access denied. Please check your permissions.")
                    } else if (res.data.success === false) {
                        alert(res.data.message)
                    }
                }
                handleCloseModal2()
                // console.log('Employee setting ka message', response?.data?.message);
            } catch (error) {
                console.error('Error:', error.response.data.message);
                if (error.response && error.response.data) {
                    if (error.response.status === 403 && error.response.data.success === false) {
                        // alert(error.response.data.message)
                        enqueueSnackbar("Sorry, upgrade unavailable due to uncleared invoices", {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right"
                            }
                        })
                    }
                }
            }
            finally {
                // setIsLoading(false);
                setShowModalwithoutcard(false);
            }
        }
    }

    const Cardetail = paycard?.cardNumber

    localStorage.setItem('carddetail', JSON.stringify(Cardetail));

    const [setPlanData] = useState(JSON.parse(localStorage.getItem('planIdforHome')));

    return (
        <>


            <SnackbarProvider />
            {show ? <Modal show={show} onHide={() => {
                setUpdatePassword(false);
                setShowMessage(false);  // ✅ Message Reset
                setFirstTimeGenerated(false);  // ✅ First-time flag Reset
                setCurrentPassword("");  // ✅ Current Password Reset
                setNewPassword("");  // ✅ New Password Reset
                setNewPassword2("");  // ✅ Confirm Password Reset
            }} animation={false} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>
                        Are you sure you want to archive your account?
                    </p>
                    <p>
                        Your account will be <strong>archived</strong>, and all time tracking data & screenshots will be saved.
                        If you want to <strong>permanently delete</strong> your account, you will need to verify the process.
                    </p>
                    <p>
                        Click <strong>Archive</strong> to proceed. A verification code will be sent to your email.
                        Enter the code in the next step to permanently delete your account.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={handleArchive}>
                        ARCHIVE
                    </button>
                    <button className="teamActionButton" onClick={() => setShow(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}


            {updatePassword ? <Modal show={updatePassword} onHide={() => {
                setUpdatePassword(false);
                setShowMessage(false);  // ✅ Message Reset
                setFirstTimeGenerated(false);  // ✅ First-time flag Reset
                setCurrentPassword("");  // ✅ Current Password Reset
                setNewPassword("");  // ✅ New Password Reset
                setNewPassword2("");  // ✅ Confirm Password Reset
            }}

                animation={false} centered>
                <Modal.Body onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        verifyPassword()
                    }
                }}>
                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>Change password</p>
                    <p style={{ marginBottom: "0", fontWeight: "500", fontSize: "16px" }}>Current password</p>
                    <input
                        value={currentPassword}
                        placeholder="Current password"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={{
                            fontSize: "18px",
                            padding: "5px 10px",
                            margin: "10px 0 20px 0",
                            width: "100%",
                            border: "1px solid #cacaca"
                        }}
                    />
                    <p style={{ marginBottom: "0", fontWeight: "500", fontSize: "16px" }}>New password</p>
                    {/* <input
                        value={newPassword}
                        placeholder="New password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        onKeyDown={handleKeyPress}  // ✅ Space press karein to password generate ho
                        style={{
                            fontSize: "18px",
                            padding: "5px 10px",
                            margin: "10px 0 20px 0",
                            width: "100%",
                            border: "1px solid #cacaca"
                        }}
                    /> */}
                    <div style={{ position: "relative", width: "100%" }}>
                        <input
                            value={newPassword}
                            placeholder="New password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            // onKeyDown={handleKeyPress}
                            style={{
                                fontSize: "18px",
                                padding: "10px 40px 10px 10px",
                                width: "100%",
                                border: "1px solid #cacaca",
                                borderRadius: "5px",
                                position: "relative",
                            }}
                        />
                        <button
                            onClick={() => {
                                if (!firstTimeGenerated) {
                                    setShowMessage(true); // ✅ Pehli baar message show hoga
                                    setTimeout(() => setShowMessage(false), 5000); // ✅ 5s baad hide hoga
                                    setFirstTimeGenerated(true); // ✅ Message dobara show nahi hoga jab tak modal reopen na ho
                                }
                                generatePassword();
                            }}
                            style={{
                                position: "absolute",
                                right: "5px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                backgroundColor: "#6ABB47",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "14px",
                                padding: "5px 10px",
                            }}>
                            Auto Generate
                        </button>
                    </div>

                    {/* ✅ Security Message Below the Input Field */}
                    {showMessage && (
                        <p className='text-warning' style={{ fontSize: "14px", marginTop: "5px" }}>
                            This is a secure, randomly generated password.
                            It is encrypted for your safety and ensures strong protection.
                        </p>
                    )}
                    <p style={{ marginBottom: "0", fontWeight: "500", fontSize: "16px" }}>Confirm new password</p>
                    <input
                        value={newPassword2}
                        placeholder="Retype new password"
                        onChange={(e) => setNewPassword2(e.target.value)}
                        onKeyDown={handleKeyPress}  // ✅ Space press karein to password generate ho
                        style={{
                            fontSize: "18px",
                            padding: "5px 10px",
                            margin: "10px 0",
                            width: "100%",
                            border: "1px solid #cacaca"
                        }}
                    />
                    {/* <button
                        onClick={handleGeneratePassword}
                        style={{
                            padding: "5px 10px",
                            backgroundColor: "#6ABB47",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}>
                        Generate
                    </button> */}
                </Modal.Body>
                <Modal.Footer>
                    <button style={{ backgroundColor: (currentPassword === "" || newPassword === "" || newPassword2 === "") && "grey", borderColor: (currentPassword === "" || newPassword === "" || newPassword2 === "") && "grey" }} className="teamActionButton" disabled={(currentPassword === "" || newPassword === "" || newPassword2 === "") ? true : false} onClick={() => {
                        if (verify === true) {
                            updateMyPassword()
                        }
                        else {
                            verifyPassword()
                        }
                    }}>
                        UPDATE
                    </button>
                    <button className="teamActionButton" onClick={() => setUpdatePassword(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            <div className="container">
                <div className="userHeader">
                    <div className="headerTop">
                        <img src={user} alt=''/>
                        <h5>My Account </h5>
                    </div>
                </div>

                <div className="mainwrapper">

                    <div className="accountContainer">
                        {suspended ? (
                            <div className="text-center text-white alert alert-warning" style={{ backgroundColor: '#fc6568' }}>
                                Your account is currently suspended. Please upgrade your plan
                            </div>
                        ) : (
                            <div>
                            
                            </div>
                        )}
                        {showWarning && (
                            <div style={{
                                padding: '10px',
                                backgroundColor: '#ffdddd',
                                border: '1px solid #ffcccc',
                                color: '#d8000c',
                                marginBottom: '20px',
                                borderRadius: '5px',
                                textAlign: "center",
                            }}>
                                <strong>Warning:</strong> You have unpaid invoices and payment is past due.
                            </div>
                        )}
                        <p className="asadMehmood">{items?.name} <span>{items?.company}</span></p>
                        <p className="userEmail">
                            {items?.email}
                            <br />
                            {items?.timezone}
                            <br />
                            UTC {formattedOffset}
                        </p>
                        {/* {!(items?.userType === "owner") && (
                            <p className='userEmail'><strong>Pay Rate:</strong> {ratePerHour && !isNaN(ratePerHour) ? `$${ratePerHour} / hr` : "Not Specified"}</p>
                        )} */}

                        {!(items?.userType === "owner") && (
                            <p className='userEmail'>
                                <strong>Pay Rate:</strong>{" "}
                                {ratePerHour === null ? (
                                    "Loading..."
                                ) : !isNaN(ratePerHour) && ratePerHour !== "" ? (
                                    `${currencySymbol}${ratePerHour} / hr`
                                ) : (
                                    "Not Specified"
                                )}
                            </p>
                        )}

                        {/* <p>
                            <strong>Pay Rate:</strong> {items?.payRate ? `$${items.payRate} / hr` : "Not Available"}
                        </p> */}

                        <div className="accountDiv">
                            <div onClick={() => navigate("/profile", { state: { fromAccount: true } })} className="accountEditDiv"><div><img src={edit} alt=''/></div><p>Edit Profile</p></div>
                            {/* <div onClick={() => navigate('/profile')} className="accountEditDiv"><div><img src={edit} /></div><p>Edit Profile</p></div> */}
                            <div onClick={() => setUpdatePassword(true)} className="accountEditDiv"><div><img src={passwords} alt=''/></div><p>Change Password</p></div>
                            {items?.userType === "owner" && (
                                // <div className="accountEditDiv" style={isDeleted ? { opacity: 0.5, cursor: "not-allowed" } : {}} onClick={!isDeleted ? handleShow : null}>
                                //     <div><img src={deleteIcon} alt="Delete Icon" /></div>
                                //     <p>{isDeleted ? "Permanently Deleted" : "Delete my Account"}</p>
                                // </div>
                                <>
                                    <div
                                        className="accountEditDiv"
                                        onClick={handleShow}
                                    >
                                        <div><img src={deleteIcon} alt="Delete Icon" /></div>
                                        <p>
                                            {isArchived ? "Archived My Account" : "Delete My Account"}
                                        </p>
                                    </div>
                                    {/* <p>Debugging: isArchived = {String(isArchived)}</p> */}
                                </>
                            )}
                        </div>
                        {!(items?.userType === "owner") && (
                            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                <div style={{ flex: 1 }}>
                                    <label className="countryLabel">Break Start Time</label>
                                    <div className="countryDropdown">
                                        <input
                                            type="time"
                                            value={breakStartTime || ""}
                                            onChange={(e) => fillModel("breakStartTime", e.target.value)}
                                            placeholder="Select Start Time"
                                        />
                                    </div>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <label className="countryLabel">Break End Time</label>
                                    <div className="countryDropdown">
                                        <input
                                            type="time"
                                            value={breakEndTime || ""}
                                            onChange={(e) => fillModel("breakEndTime", e.target.value)}
                                            placeholder="Select End Time"
                                        />
                                    </div>
                                </div>

                                {/* ✅ NEW: Punctuality Start Time */}
                                <div style={{ flex: 1 }}>
                                    <label className="countryLabel">Punctuality Start Time</label>
                                    <div className="countryDropdown">
                                        <input
                                            type="time"
                                            value={puncStartTime || ""}
                                            onChange={(e) => fillModel("puncStartTime", e.target.value)}
                                            placeholder="Select Punctuality Start Time"
                                        />
                                    </div>
                                </div>

                                {/* ✅ NEW: Punctuality End Time */}
                                <div style={{ flex: 1 }}>
                                    <label className="countryLabel">Punctuality End Time</label>
                                    <div className="countryDropdown">
                                        <input
                                            type="time"
                                            value={puncEndTime || ""}
                                            onChange={(e) => fillModel("puncEndTime", e.target.value)}
                                            placeholder="Select Punctuality End Time"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        {show ? <Modal show={show} onHide={() => setShow(false)} animation={false} centered>
                            <Modal.Body>
                                <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>
                                    Are you sure you want to archive your account?
                                </p>
                                <p>
                                    Your account will be <strong>archived</strong>, and all time tracking data & screenshots will be saved.
                                    If you want to <strong>permanently delete</strong> your account, you will need to verify the process.
                                </p>
                                <p>
                                    Click <strong>Archive</strong> to proceed. A verification code will be sent to your email.
                                    Enter the code in the next step to permanently delete your account.
                                </p>
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="teamActionButton" onClick={handleArchive}>
                                    ARCHIVE
                                </button>
                                <button className="teamActionButton" onClick={() => setShow(false)}>
                                    CANCEL
                                </button>
                            </Modal.Footer>
                        </Modal> : null}

                        {/* Are you sure? Modal */}
                        {showConfirmModal ? (
                            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} animation={false} centered>
                                <Modal.Body>
                                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>
                                        Are you sure you want to delete this account?
                                    </p>
                                    <p>
                                        Your account will be permanently deleted. You will receive a verification code via email to complete the deletion process.
                                    </p>
                                </Modal.Body>
                                <Modal.Footer>
                                    <button className="teamActionButton" onClick={handleConfirmArchive}>
                                        Yes
                                    </button>
                                    <button className="teamActionButton" onClick={() => setShowConfirmModal(false)}>
                                        No
                                    </button>
                                </Modal.Footer>
                            </Modal>
                        ) : null}

                        {/* Verification Modal */}
                        {showVerifyModal && (
                            <Modal show={showVerifyModal} onHide={() => setShowVerifyModal(false)} centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Enter Verification Code</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <input
                                        type="text"
                                        placeholder="Enter Code"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
                                    />
                                </Modal.Body>
                                <Modal.Footer>
                                    <button onClick={verifyCode} className="teamActionButton">
                                        Verify & Delete
                                    </button>
                                </Modal.Footer>
                            </Modal>
                        )}

                        {/* {showDeleteButton && (
                            <button onClick={() => setShowVerifyModal(true)} className="delete-btn">
                                Permanently Delete Account
                            </button>
                        )} */}

                        {/* <Payment /> */}

                        <BillingComponent />
                        <Withoutcardpayment
                            showModalwithoutcard={showModalwithoutcard}
                            handleCloseModal2={handleCloseModal2}
                            selectedPlan={selectedPlan}
                        />
                        <Payment />
                    </div>
                </div>
            </div>
            <img className="accountLine" src={line} alt='' />

        </>
    )
}
export default Account;