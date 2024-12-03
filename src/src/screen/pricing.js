import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const Pricing = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const [downloadOS, setDownloadOS] = useState("mac")
    const [accessToken, setAccessToken] = useState('');
    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [fullName, setfullName] = useState('')
    const [email, setemail] = useState('')
    const [phoneNumber, setphoneNumber] = useState('')
    const [companyName, setcompanyName] = useState('')
    const [message, setmessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // or 'error'
    const [text, setText] = useState("");
    // const [plans, setPlans] = useState([]);
    // const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const [fetchError, setFetchError] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState();
  
    // let token = localStorage.getItem('token');
    // const navigate = useNavigate("");


    const plans = [
        { id: 1, name: 'Free' },
        { id: 2, name: 'Standard' },
        { id: 3, name: 'Premium' }
    ];


    // const storedPlanId = JSON.parse(localStorage.getItem('planId'));
    // Retrieve the stored plan from localStorage and set the selected package
    useEffect(() => {
        const storedPlanId = JSON.parse(localStorage.getItem('planIdforHome'));
        console.log('=====>>>>>>>', selectedPackage)
        // Check the stored plan type to set the selected package
        if (!storedPlanId?.planType || storedPlanId?.planType === 'free') {
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

    const handleUpgradeClicks = (selectedPlan) => {
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
            <div className='container mt-5 mb-4' id="section3">
    
                <p className="how-it-works-title text-white text-center">Company Plans & Pricing</p>
                <p className="text-center text-white">These monthly plans are for Companies to track their employees or for freelancers to track their own time.
                    If you track your own time for other companies — you do not need a plan and do not have to pay — your company pays for you. Just ask your manager to send you an invitation email to their SSTrack team to start tracking your time and screenshots for them.</p>

                <div className="row justify-content-center align-items-center">

                    {/* ------------------------------ pricing card 1 ------------------------- */}

                    <div className="card m-3" style={{ width: "18rem", height: "44.5rem", backgroundColor: '#f2f5f5', border: "8px solid grey", borderRadius: "1rem" }}>
                        <div className="card-body">
                            <h5 className="card-title text-center fw-bold fs-2" style={{ color: "grey" }} id="section3">Free Trial</h5>
                            <div class="price-container">
                                {/* <span class="old-price align-items-center">$50.00</span> */}
                                <span class="old-price align-items-center" style={{ fontSize: '3rem' }}>
                                    <small class="small-dollar"></small>
                                </span>
                            </div>
                            <div class="price-container new-price">
                                {/* <span class="old-price align-items-center">$50.00</span> */}
                                <span class="free-price align-items-center" style={{ color: "grey", fontSize: '3.5rem', marginTop: "23%" }}>
                                    <small class="small-dollar text-center">$</small>0
                                </span>
                            </div>
                            <p className="text-center text-red">
                                Limited Time Offer
                            </p>
                            <p className="card-text text-center" style={{ marginTop: "37%" }}>
                                Time Tracking
                                SSTrack
                                up to <b>10</b> screenshots per hour
                                screenshots stored for <b>15 days</b>
                            </p>
                            <p className="activtiyUrl text-center" style={{ marginTop: '18%' }} >Individual settings
                            </p>
                            <p className="activtiyUrl text-center" > Activity Level Tracking</p>
                            <p className="activtiyUrl text-center" >
                                App & URL Tracking
                            </p>
                            <br />
                            <div className="mt-auto">
                                <button type="button" className="pricingButton2" style={{ width: '150px', alignItems: 'center', color: 'white', backgroundColor: getButtonDisabled(1) ? "#ccc" : "#e4eced", marginTop: '20px' }}
                                    disabled={true}
                                > {getButtonText(1)}</button>
                            </div>
                            {/* <button type="button" className="pricingButton2" style={{ width: '150px', alignItems: 'center', color: 'grey', backgroundColor: "#e4eced", marginTop: '20px' }}>
                  Current Plan
                </button> */}
                            <br />
                        </div>
                    </div>
                    {/* ------------------------------ pricing card 2 ------------------------- */}
                    <div className="card m-3" style={{ width: "18rem", height: '44.5rem', border: "8px solid  #7ACB59", backgroundColor: "#f2faf6", borderRadius: "1rem" }}>
                        <div className="card-body px-3">
                            <h5 className="card-title text-center fw-bold fs-2" style={{ color: " #7ACB59" }}>Standard</h5>
                            <div class="price-container new-price">
                                {/* <span class="old-price align-items-center">$50.00</span> */}
                                <span class="old-price align-items-center" style={{ color: "grey", fontSize: '3.5rem' }}>
                                    <small class="small-dollar">$</small>6
                                </span>
                            </div>
                            <p className="text-center"> per user per month</p>
                            <div class="price-container new-price">
                                {/* <span class="new-price">$35.00</span> */}
                                <span style={{ fontSize: "3rem" }}>
                                    <small class="small-dollar">$</small>3<sup class="small-number">99</sup>
                                </span>
                            </div>
                            <p className="text-center text-red">
                                per user per month
                                if you start now!
                            </p>
                            <p className="card-text text-center">
                                Time Tracking
                                SSTrack
                                up to <b>10</b> screenshots per hour
                                screenshots stored for <b>6<br /> months</b>
                            </p>
                            <p className="activtiyUrl text-center">    Individual settings
                            </p>
                            <p className="text-center"> Activity Level Tracking</p>
                            <p className="activtiyUrl text-center">
                                App & URL Tracking
                            </p>
                            <p className="activtiyUrl text-center">
                            </p>
                            <br />
                            <div className="mt-auto">
                                <button type="button" className="pricingButton" style={{ color: 'white', width: '150px', backgroundColor: getButtonDisabled(2) ? "#ccc" : "#7ACB59", marginTop: '20px' }}
                                    onClick={() => handleUpgradeClicks(2)} disabled={getButtonDisabled(2)}
                                >{getButtonText(2)}</button>
                            </div>
                            <p className="text-center fw-bold" style={{ fontSize: "15px", color: '#7a8f91' }}>Switch to Free Plan any time</p>

                        </div>
                    </div>

                    {/* ------------------------------ pricing card 3 ------------------------- */}

                    <div className="card m-3" style={{ width: "18rem", height: '44.5rem', border: "8px solid  #3f7299", backgroundColor: "#f2faf6", borderRadius: "1rem" }}>

                        <div className="card-body px-3">
                            <h5 className="card-title text-center fw-bold fs-2" style={{ color: "#0E4772" }}>Premium</h5>
                            <div class="price-container new-price">
                                {/* <span class="old-price align-items-center">$50.00</span> */}
                                <span class="old-price align-items-center" style={{ color: "grey", fontSize: '3.5rem' }}>
                                    <small class="small-dollar">$</small>10
                                </span>
                            </div>
                            <p className="text-center"> per user per month</p>
                            <div class="price-container new-price">
                                {/* <span class="new-price">$35.00</span> */}
                                <span style={{ fontSize: "3rem" }}>
                                    <small class="small-dollar">$</small>4<sup class="small-number">99</sup>
                                </span>
                            </div>
                            <p className="text-center text-red">
                                per user per month
                                if you start now!
                            </p>
                            <p className="card-text text-center">
                                Time Tracking
                                SSTrack
                                up to <b>30</b> screenshots per hour
                                screenshots stored for <b>1 <br /> year</b>
                            </p>
                            <p className="activtiyUrl text-center">    Individual settings
                            </p>
                            <p className="text-center"> Activity Level Tracking</p>
                            <p className="activtiyUrl text-center">
                                App & URL Tracking
                            </p>
                            <p className="activtiyUrl text-center">
                                Mobile Application
                            </p>
                            <p className="activtiyUrl text-center">
                            </p>
                            <div className="mt-auto">
                                <button type="button" className="pricingButton1" style={{ color: 'white', width: '150px', backgroundColor: getButtonDisabled(3) ? "#ccc" : "#0E4772", marginTop: '20px' }} disabled={getButtonDisabled(3)}
                                    onClick={() => handleUpgradeClicks(3)}>{getButtonText(3)}</button>
                            </div>
                            <p className="text-center fw-bold" style={{ fontSize: "15px", color: '#7a8f91' }}>Switch to Free Plan any time</p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}


export default Pricing;