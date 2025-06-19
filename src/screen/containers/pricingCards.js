import axios from "axios";
import jwtDecode from "jwt-decode";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { Form, Modal } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";




const Pricing = () => {
    const section1Ref = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem('token');


    const [selectedPackage, setSelectedPackage] = useState();
    const [isloadning, setisloading] = useState(false);
    const navigate = useNavigate()
    const [email, setEmail] = useState();
    const [userCount, setUserCount] = useState('');
    const [ssstoredFor, setssstoredFor] = useState('');
    const [PaymentPlan, setPaymentPlan] = useState('');
    const [joinTiming, setJoinTiming] = useState(''); // New state for join timing
    const [phoneNo, setPhone] = useState('')
    const [companyName, setCompanyName] = useState('')
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    
    const plans = [
        { id: 1, name: ' Start your free trial' },
        { id: 2, name: 'Standard' },
        { id: 3, name: 'Premium' }
    ];
    const apiUrl = process.env.REACT_APP_API_URL;
    const handleApply2 = async () => {
        setisloading(true)
        if (!email || !phoneNo || !companyName || !userCount || !joinTiming) {
            enqueueSnackbar("Please fill in all required fields.", { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } });
            return;
        }

        const formData = {
            userCounts: userCount,
            paymentPlan: PaymentPlan, // Static value as per the context
            contactNumber: phoneNo,
            ssStoredFor: ssstoredFor,
            Discount: 0, // Assuming a default value for Discount
            totalAmount: 1000, // Replace with calculated or default value
            approved: 'pending', // Setting approved status as false by default
        };

        try {
            // Make API call with headers
            const response = await axios.post(
                `${apiUrl}/owner/requestEnterprise`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Handle success
            if (response.status === 200 || response.status === 201) {
                enqueueSnackbar("Your application has been successfully submitted", {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });

                setisloading(false)

                // Reset form fields
                // setEmail('');
                setssstoredFor('');
                setPhone('');
                setPaymentPlan('');
                setUserCount('');
                setJoinTiming('');
                handleCloseModal();
            }
        } catch (error) {
            // Handle errors

            setisloading(false)
            enqueueSnackbar("Failed to submit application. Please try again later.", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });

            console.error("API Error:", error.response ? error.response.data : error.message);
        }
    };

    // Retrieve the stored plan from localStorage and set the selected package
    useEffect(() => {
        const items = jwtDecode(JSON.stringify(token));
        if (items) {
            try {
                const parsedItems = JSON.parse(items); // Parse the JSON string
                if (parsedItems.email) {
                    setEmail(parsedItems.email); // Set email state
                }
                if (parsedItems.company) {
                    setCompanyName(parsedItems.company); // Set company name state
                }
            } catch (error) {
                console.error('Failed to parse localStorage item "items":', error);
            }

        }
        const storedPlanId = JSON.parse(localStorage.getItem('planIdforHome'));
        console.log('=====>>>>>>>', selectedPackage)
        // Check the stored plan type to set the selected package
        if (!storedPlanId?.planType || storedPlanId?.planType === 'Start your free trial') {
            setSelectedPackage(1); // Free plan
        } else if (storedPlanId?.planType === 'standard') {
            setSelectedPackage(2); // Standard plan
        } else if (storedPlanId?.planType === 'premium') {
            setSelectedPackage(3); // Premium plan
        }
    }, []); // Empty dependency array to run only once on component mount


    const getButtonDisabled = (planId) => {

        // If token is not available, return false
        if (!token) {
            return false;
        }
        // If token is available, show relevant disabled state based on the selected plan
        if (planId === selectedPackage) {
            return 'Current'; // The user is already on this plan
        } else {
            return false;
        }
    };

    const isButtonDisabled = (planId) => {
        const buttonText = getButtonText(planId);
        // return getButtonText(planId) === 'Downgrade'; // Disable if "Downgrade" text is shown
        return buttonText === 'Downgrade' || buttonText === 'Current'; // Disable if "Downgrade" or "Current" text is shown
    };

    const handleUpgradeClicks = (selectedPlan) => {
        // setSelectedPackage(selectedPlan); // Update the selected package state
        // Navigate to the payment page, passing along the relevant data
        navigate('/account', {
            state: {
                defaultPlanIndex: selectedPlan
            }
        });
    };

    // Function to return the appropriate button text
    const getButtonText = (planId) => {
        // Check if token is available
        if (!token) {
            // If token is not available, show the plan names (Free, Standard, Premium)
            if (planId === 1) return 'Free';
            if (planId === 2) return 'Standard';
            if (planId === 3) return 'Premium';
        }

        // If token is available, show relevant text based on the selected plan
        if (planId === selectedPackage) {
            return 'Current'; // The user is already on this plan
        } else if (planId > selectedPackage) {
            return 'Upgrade'; // The plan is higher than the current one
        } else {
            return 'Downgrade'; // The plan is lower than the current one
        }
    };


    return (
        <>
            <SnackbarProvider />

            <div className='container' id="section3">
                <p className="how-it-works-title text-center mt-3">Company Plans & Pricing.</p>
                <p className="how-it-works-title text-center" style={{ fontSize: '20px' }}>Powerful Features at Every Price Point.</p>
                <p className="text-center">When you choose ssTrack.io, you’re not just buying software—you’re investing in precision, control, and growth.</p>

                <div className="container my-5">
                    {/* <div className="row justify-content-center align-items-stretch g-0" > Ensures equal height */}
                    {/* Free Plan */}
                    <div className="row justify-content-center align-items-stretch " style={{ gap: '' }}>
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div
                                className="card p-4 text-start h-100" // Added h-100 for equal height

                                style={{
                                    borderRadius: "20px",
                                    backgroundColor: "#fff",
                                    border: "2px solid rgba(0, 0, 0, 0.1)", // Add border
                                    boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.2)", // Make shadow more prominent
                                    maxWidth: "380px", // Set max width for smaller cards
                                    margin: "auto", // Center-align the cards
                                    // height: '100%'
                                }}
                            >
                                <h5
                                    className="card-title fw-bold"
                                    style={{
                                        fontSize: "1.5rem",
                                        marginBottom: "10px",
                                    }}
                                >
                                    Basic Plan
                                </h5>
                                <hr style={{ marginTop: '3%' }} />
                                <p
                                    className="text-muted"
                                    style={{
                                        fontSize: "1rem",
                                        marginBottom: "20px",
                                        fontWeight: "500",
                                    }}
                                >
                                    Time & Billing
                                </p>
                                <h2
                                    style={{
                                        color: "#7ACB59",
                                        fontSize: "2.5rem",
                                        fontWeight: "700",
                                        marginBottom: "5px",
                                    }}
                                >
                                    $0{" "}
                                    {/* <span
                                            className="text-muted"
                                            style={{
                                                textDecoration: "line-through",
                                                fontSize: "1.2rem",
                                                fontWeight: "500",
                                            }}
                                        >
                                            $12.00
                                        </span> */}
                                </h2>
                                <p
                                    className="text-muted"
                                    style={{
                                        fontSize: "0.9rem",
                                        marginBottom: "5px",
                                    }}
                                >
                                    Free for 14 days, After 14 days - upgrade
                                </p>
                                <p
                                    className="text-muted text-center mt-4"
                                    style={{
                                        fontSize: "0.9rem",
                                        marginBottom: "20px",
                                        // marginTop: '2%'

                                    }}
                                >
                                    Perfect for freelancers and small teams.
                                </p>
                                <button
                                    className="btn btn-success w-100 mb-4"
                                    // onClick={() => handleUpgradeClicks(1)} disabled={isButtonDisabled(1)}
                                    style={{
                                        backgroundColor: getButtonDisabled(1) ? "#ccc" : "#7ACB59",
                                        borderRadius: "25px",
                                        padding: "12px",
                                        fontSize: "1rem",
                                        color: getButtonDisabled(1) ? "darkgreen" : "#fff", // Text color changes based on the disabled state
                                        marginTop: '25px',
                                        border: '1px solid #7ACB59'
                                    }}
                                    onClick={() => handleUpgradeClicks(1)} disabled={isButtonDisabled(1)}

                                >
                                    {getButtonText(1)}
                                </button>
                                <p
                                    className="fw-bold"
                                    style={{
                                        fontSize: "1rem",
                                        color: "#333",
                                        marginBottom: "15px",
                                    }}
                                >
                                    All Free features, plus:
                                </p>
                                <ul className="list-unstyled" style={{ marginTop: '1%' }}>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "18px" }}>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Real-time time tracking
                                    </li>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "16px" }}>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Weekly time limits
                                    </li>
                                    {/* <li style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            Configurable screenshot frequency
                                        </li> */}
                                    <li style={{ fontSize: "0.9rem", marginBottom: "18px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Configurable screenshot frequency
                                        </span>
                                    </li>
                                    {/* <li style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            Individual user settings (autopause, activity tracking)
                                        </li> */}
                                    <li style={{ fontSize: "0.9rem", marginBottom: "18px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Individual user settings (autopause, activity tracking)
                                        </span>
                                    </li>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "18px" }}>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Project and task management
                                    </li>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "18px" }}>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Basic reporting and analytics
                                    </li>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "18px" }}>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Team size limit: Up to 5 users
                                    </li>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "18px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Browser access with Chrome extension
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>




                        {/* Premium Plan */}
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div
                                className="card p-4 text-start h-100" // Added h-100 for equal height
                                style={{
                                    borderRadius: "20px",
                                    backgroundColor: "#fff",
                                    border: "2px solid rgba(0, 0, 0, 0.1)", // Add border
                                    boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.2)", // Make shadow more prominent
                                    maxWidth: "380px", // Set max width for smaller cards
                                    margin: "auto", // Center-align the cards
                                    // height: "100%"
                                }}
                            >

                                <h5
                                    className="card-title fw-bold"
                                    style={{
                                        fontSize: "1.5rem",
                                        marginBottom: "10px",
                                    }}
                                >
                                    Pro Plan
                                </h5>

                                <p
                                    className="text-muted"
                                    style={{
                                        fontSize: "1rem",
                                        marginBottom: "20px",
                                        fontWeight: "500",
                                        marginTop: '10%'
                                    }}
                                >
                                    Profit & Productivity
                                </p>
                                <h2
                                    style={{
                                        color: "#7ACB59",
                                        fontSize: "2.5rem",
                                        fontWeight: "700",
                                        marginBottom: "5px",
                                        marginTop: '-5px'
                                    }}
                                >
                                    $20.00{" "}
                                    <span
                                        className="text-muted"
                                        style={{
                                            textDecoration: "line-through",
                                            fontSize: "1.2rem",
                                            fontWeight: "500",
                                        }}
                                    >
                                        $30.00
                                    </span>
                                </h2>
                                <p
                                    className="text-muted"
                                    style={{
                                        fontSize: "0.9rem",
                                        marginBottom: "5px",
                                        // marginTop: '10%'
                                    }}
                                >
                                    per user per month billed Monthly
                                </p>
                                <p
                                    className="text-muted text-center"
                                    style={{
                                        fontSize: "0.9rem",
                                        marginBottom: "20px",
                                        marginTop: '6%'
                                    }}
                                >
                                    Ideal for growing teams looking for more control.
                                </p>
                                <button
                                    className="btn btn-success w-100 mb-4 mt-2"
                                    onClick={() => handleUpgradeClicks(3)}
                                    style={{
                                        backgroundColor: getButtonDisabled(3) ? "#ccc" : "#7ACB59",
                                        borderRadius: "25px",
                                        padding: "12px",
                                        fontSize: "1rem",
                                        color: getButtonDisabled(3) ? "darkgreen" : "#fff", // Text color changes based on the disabled state

                                        border: '1px solid #7ACB59'
                                    }}
                                    disabled={getButtonDisabled(3)}

                                >
                                    {getButtonText(3)}
                                </button>
                                <p
                                    className="fw-bold"
                                    style={{
                                        fontSize: "1rem",
                                        color: "#333",
                                        marginBottom: "15px",
                                    }}
                                >
                                    Everything in the Basic Plan, plus:
                                </p>
                                <ul className="list-unstyled">

                                    <li style={{ fontSize: "0.9rem", marginBottom: "8px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Advanced analytics and reporting
                                        </span>
                                    </li>

                                    <li style={{ fontSize: "0.9rem", marginBottom: "10px" }}>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Break and leave management
                                    </li>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "10px" }}>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Split, trim, and blur activity data
                                    </li>

                                    <li style={{ fontSize: "0.9rem", marginBottom: "10px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Mobile app with location tracking and timelines
                                        </span>
                                    </li>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "10px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Automated email notifications for leave and activity updates
                                        </span>
                                    </li>

                                    <li style={{ fontSize: "0.9rem", marginBottom: "16px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Invoice management: auto-generated and downloadable
                                        </span>
                                    </li>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "10px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Payment flexibility: PayPal, Visa, MasterCard, and other cards
                                        </span>
                                    </li>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "16px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Team size: Up to 20 users
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div
                                className="card p-4 text-start"
                                style={{
                                    borderRadius: "20px",
                                    backgroundColor: "#fff",
                                    border: "2px solid rgba(0, 0, 0, 0.1)", // Add border
                                    boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.2)", // Make shadow more prominent
                                    maxWidth: "380px", // Set max width for smaller cards
                                    margin: "auto", // Center-align the cards
                                }}
                            >
                                <h5
                                    className="card-title fw-bold"
                                    style={{
                                        fontSize: "1.5rem",
                                        marginBottom: "10px",
                                    }}
                                >
                                    Enterprise
                                </h5>
                                <hr />
                                <p
                                    className="text-muted"
                                    style={{
                                        fontSize: "1rem",
                                        marginBottom: "20px",
                                        fontWeight: "500",
                                    }}
                                >
                                    Management & Security
                                </p>
                                <h2
                                    style={{
                                        color: "#7ACB59",
                                        fontSize: "1.8rem",
                                        fontWeight: "700",
                                        marginBottom: "5px",
                                    }}
                                >
                                    $Custom Pricing
                                    {/* <span
                                            className="text-muted"
                                            style={{
                                                textDecoration: "line-through",
                                                fontSize: "1.2rem",
                                                fontWeight: "500",
                                            }}
                                        >
                                            $1.49
                                        </span> */}
                                </h2>
                                <p
                                    className="text-muted"
                                    style={{
                                        fontSize: "0.9rem",
                                        marginBottom: "5px",
                                    }}
                                >
                                    Custom Pricing
                                </p>
                                <p
                                    className="text-muted text-center"
                                    style={{
                                        fontSize: "0.9rem",
                                        marginBottom: "20px",
                                        marginTop: '26px'
                                    }}
                                >
                                    Built for enterprises with complex needs—let us customize a plan for you.
                                </p>
                                <button
                                    className="btn btn-success w-100 mb-4"
                                    style={{
                                        backgroundColor: "#7ACB59",
                                        borderRadius: "25px",
                                        padding: "12px",
                                        fontSize: "1rem",
                                        border: '1px solid #7ACB59',
                                        marginTop: '12px'
                                    }}
                                    onClick={handleOpenModal}

                                >
                                    Contact Us
                                </button>
                                <p
                                    className="fw-bold"
                                    style={{
                                        fontSize: "1rem",
                                        color: "#333",
                                        marginBottom: "13px",
                                        marginTop: '-2px'
                                    }}
                                >
                                    Includes all Pro Plan features, plus:
                                </p>
                                <ul className="list-unstyled">
                                    {/* <li style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            Unlimited users and team roles (Admin, Manager, Member)
                                        </li> */}
                                    <li style={{ fontSize: "0.9rem", marginBottom: "18px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Unlimited users and team roles (Admin, Manager, Member)
                                        </span>
                                    </li>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "18px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Custom API integrations
                                        </span>
                                    </li> <li style={{ fontSize: "0.9rem", marginBottom: "18px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Dedicated support team
                                        </span>
                                    </li> <li style={{ fontSize: "0.9rem", marginBottom: "18px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Onboarding assistance for all team members
                                        </span>
                                    </li>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "18px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            White-labeling options (custom branding)
                                        </span>
                                    </li>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "18px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Advanced security features (GDPR compliance, role-based permissions)
                                        </span>
                                    </li>
                                    {/* <li style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            Advanced security features (GDPR compliance, role-based permissions)
                                        </li> */}
                                    {/* <li style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            Tailored workflows and feature adjustments
                                        </li> */}
                                    <li style={{ fontSize: "0.9rem", marginBottom: "18px", display: "flex", alignItems: "flex-start" }}>
                                        <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "8px", flexShrink: 0 }}></i>
                                        <span style={{ lineHeight: "1.5" }}>
                                            Tailored workflows and feature adjustments
                                        </span>
                                    </li>
                                    <li style={{ fontSize: "0.9rem", marginBottom: "18px" }}>
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Priority access to new features
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal for applying */}
                <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    centered
                    dialogClassName="modal-lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Apply for Enterprise Plan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {token ? ( // Check if token is available
                            <>
                                <p className="text-muted">
                                    Fill out the details below to apply for the Enterprise Plan.
                                </p>
                                <Form>
                                    <Form.Group controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            required
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-100"
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formPhone" className="mt-3">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            required
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            value={phoneNo}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-100"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formCompanyName" className="mt-3">
                                        <Form.Label>Company Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your company name"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="w-100"
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formSSStoredFor" className="mt-3">
                                        <Form.Label>Sreen Shot Stored For</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                as="select"
                                                value={ssstoredFor}
                                                onChange={(e) => setssstoredFor(e.target.value)}
                                                className="w-100 pe-4"
                                                style={{ paddingRight: '2.5rem' }}
                                            >
                                                <option value="">select Payment Plan duration</option>
                                                <option value="6 months">6 months</option>
                                                <option value="1 year">1 year</option>
                                                <option value="2 year">2 year</option>
                                            </Form.Control>
                                            <span
                                                className="position-absolute"
                                                style={{
                                                    top: '50%',
                                                    right: '1rem',
                                                    transform: 'translateY(-50%)',
                                                    pointerEvents: 'none',
                                                }}
                                            >
                                                <i className="bi bi-chevron-down"></i>
                                            </span>
                                        </div>
                                    </Form.Group>
                                    <Form.Group controlId="formPaymentPlan" className="mt-3">
                                        <Form.Label>Payment Plan</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                as="select"
                                                value={PaymentPlan}
                                                onChange={(e) => setPaymentPlan(e.target.value)}
                                                className="w-100 pe-4"
                                                style={{ paddingRight: '2.5rem' }}
                                            >
                                                <option value="">select Payment Plan duration</option>
                                                <option value="6 months">6 months</option>
                                                <option value="1 year">1 year</option>
                                                <option value="2 year">2 year</option>
                                            </Form.Control>
                                            <span
                                                className="position-absolute"
                                                style={{
                                                    top: '50%',
                                                    right: '1rem',
                                                    transform: 'translateY(-50%)',
                                                    pointerEvents: 'none',
                                                }}
                                            >
                                                <i className="bi bi-chevron-down"></i>
                                            </span>
                                        </div>
                                    </Form.Group>
                                    <Form.Group controlId="formUserCount" className="mt-3">
                                        <Form.Label>Number of Employees</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                as="select"
                                                value={userCount}
                                                onChange={(e) => setUserCount(e.target.value)}
                                                className="w-100 pe-4"
                                                style={{ paddingRight: '2.5rem' }}
                                            >
                                                <option value="">Select number of employees</option>
                                                <option value="50-100">50 - 100</option>
                                                <option value="100-200">100 - 200</option>
                                                <option value="250-300">200 - 300</option>
                                            </Form.Control>
                                            <span
                                                className="position-absolute"
                                                style={{
                                                    top: '50%',
                                                    right: '1rem',
                                                    transform: 'translateY(-50%)',
                                                    pointerEvents: 'none',
                                                }}
                                            >
                                                <i className="bi bi-chevron-down"></i>
                                            </span>
                                        </div>
                                    </Form.Group>
                                    <Form.Group controlId="formJoinTiming" className="mt-3">
                                        <Form.Label>When would you like to join?</Form.Label>
                                        <div className="position-relative">
                                            <Form.Control
                                                as="select"
                                                value={joinTiming}
                                                onChange={(e) => setJoinTiming(e.target.value)}
                                                className="w-100 pe-4"
                                                style={{ paddingRight: '2.5rem' }}
                                            >
                                                <option value="">Select joining time</option>
                                                <option value="immediately">Immediately</option>
                                                <option value="1 month">In 1 month</option>
                                                <option value="2 months">In 2 months</option>
                                            </Form.Control>
                                            <span
                                                className="position-absolute"
                                                style={{
                                                    top: '50%',
                                                    right: '1rem',
                                                    transform: 'translateY(-50%)',
                                                    pointerEvents: 'none',
                                                }}
                                            >
                                                <i className="bi bi-chevron-down"></i>
                                            </span>
                                        </div>
                                    </Form.Group>
                                </Form>
                            </>
                        ) : (
                            <p className="fs-5 text-center" style={{ color: "#7ACB59" }}>Please login first to apply for the Enterprise Plan.</p>
                        )}
                    </Modal.Body>
                    {token &&
                        <Modal.Footer className="d-flex justify-content-center">
                            <button
                                className="btn btn-success"
                                style={{ width: '70%', height: '45px' }}
                                onClick={handleApply2}
                                disabled={isloadning} // Disable the button when loading
                            >
                                {isloadning ? (
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                ) : (
                                    'Apply'
                                )}
                            </button>

                        </Modal.Footer>
                    }
                </Modal>

            </div>
        </>
    )
}



export default Pricing;

