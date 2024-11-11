import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import olivia from "../../images/olivia.webp";
import banner from '../../images/ss-track-banner.svg';
import pheonix from "../../images/pheonix.webp";
import lana from "../../images/lana.webp";
import candice from "../../images/candice.webp";
import natali from "../../images/natali.webp";
import drew from "../../images/drew.webp";
import leftArrow from "../../images/Leftarrow.webp";
import rightArrow from "../../images/Rightarrow.webp";
import dean from "../../images/manage.svg";
import { Modal, Form } from 'react-bootstrap';


const Pricing = () => {
    const section1Ref = useRef(null);
    const token = localStorage.getItem('token');
    const [fetchError, setFetchError] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState();
    const navigate = useNavigate()
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [userCount, setUserCount] = useState(''); // Change to userCount
    const [joinTiming, setJoinTiming] = useState(''); // New state for join timing

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


    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    const handleOpenModal = () => {
        setShowModal(true); // Open the modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
    };

    return (
        <>
            <div className='container' id="section3">
                <p className="how-it-works-title text-center">Company Plans & Pricing</p>
                <p className="text-center">These monthly plans are for Companies to track their employees or for freelancers to track their own time.
                    If you track your own time for other companies — you do not need a plan and do not have to pay — your company pays for you. Just ask your manager to send you an invitation email to their SSTrack team to start tracking your time and screenshots for them.</p>

                <div className="row justify-content-center align-items-center">

                    {/* ------------------------------ pricing card 1 ------------------------- */}

                    <div className="card m-3" style={{ width: "18rem", height: "44.5rem", backgroundColor: '#f2f5f5', border: "8px solid grey", borderRadius: "1rem" }}>
                        <div className="card-body">
                            <h5 className="card-title text-center fw-bold fs-2" style={{ color: "grey" }}>Free Trial</h5>
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
                                    onClick={() => handleUpgradeClicks(1)} disabled={isButtonDisabled(1)}
                                > {getButtonText(1)}</button>
                            </div>
                            {/* <button type="button" className="pricingButton2" style={{ width: '150px', alignItems: 'center', color: 'grey', backgroundColor: "#e4eced", marginTop: '20px' }}>
                  Current Plan
                </button> */}
                            <br />
                        </div>
                    </div>


                    {/* ------------------------------ pricing card 2 ------------------------- */}

                    <div className="card m-3" style={{ width: "18rem", height: '44.5rem', border: "8px solid  #0E4772", backgroundColor: "#f2faf6", borderRadius: "1rem" }}>
                        <div className="card-body px-3">
                            <h5 className="card-title text-center fw-bold fs-2" style={{ color: " #0E4772" }}>Premium</h5>
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
                                screenshots stored for <b>6 <br /> months</b>
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



                    {/* ------------------------------ pricing card 3 ------------------------- */}

                    <div className="card m-3" style={{ width: "18rem", height: '44.5rem', border: "8px solid #7ACB59", backgroundColor: "#f2faf6", borderRadius: "1rem" }}>
                        <div className="card-body px-3">
                            <h5 className="card-title text-center fw-bold fs-2" style={{ color: " #7ACB59" }}>Enterprise</h5>
                            {/* <div className="price-container new-price">
                        <span className="old-price align-items-center" style={{ color: "grey", fontSize: '3.5rem' }}>
                            <small className="small-dollar">$</small>6
                        </span>
                    </div> */}
                            {/* <p className="text-center"> per user per month</p> */}
                            <div className="price-container new-price mt-5">
                                <span style={{ fontSize: "3rem" }}>
                                    <small className="small-dollar"></small>Upto 50%<sup className="small-number"></sup>
                                </span>
                            </div>
                            <p className="text-center text-red mt-3">
                                per user per month if you start now!
                            </p>

                            <p className="card-text text-center">
                                Time Tracking SSTrack up to <b>30</b> screenshots per hour
                                screenshots stored for <b>1<br /> year</b>
                            </p>
                            <p className="activtiyUrl text-center">Individual settings</p>
                            <p className="text-center">Activity Level Tracking</p>
                            <p className="activtiyUrl text-center">App & URL Tracking</p>
                            <br />
                            <div className="mt-auto">
                                <button type="button" className="pricingButton" style={{ color: 'white', width: '150px', backgroundColor: "#7ACB59", marginTop: '20px' }}
                                    onClick={handleOpenModal}
                                >
                                    Apply
                                </button>
                            </div>
                            <p className="text-center fw-bold" style={{ fontSize: "15px", color: '#7a8f91' }}>Switch to Free Plan any time</p>
                        </div>
                    </div>

                    {/* Modal for applying */}

                    <Modal show={showModal} onHide={handleCloseModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Apply for Enterprise Plan</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Are you sure you want to apply for the Enterprise Plan?</p>
                            <Form>
                                {/* <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group> */}
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Company Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your Company Name"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formUser Count" className="mt-3">
                                    <Form.Label>Number of Employees</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={userCount}
                                        onChange={(e) => setUserCount(e.target.value)}
                                    >
                                        <option value="">Select number of employees</option>
                                        <option value="100">50 - 100</option>
                                        <option value="200">100 - 200</option>
                                        <option value="300">250 - 300</option>

                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formJoinTiming" className="mt-3">
                                    <Form.Label>When would you like to join?</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={joinTiming}
                                        onChange={(e) => setJoinTiming(e.target.value)}
                                    >
                                        <option value="">Select joining time</option>
                                        <option value="immediately">Immediately</option>
                                        <option value="1 month">In 1 month</option>
                                        <option value="2 months">In 2 months</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <button style={{
                                alignSelf: "center",
                                marginLeft: '10px',
                                padding: '5px 10px',  // Adjusting padding for a smaller size
                                // backgroundColor: 'green',  // Green background
                                color: 'green',  // White text
                                border: 'none',  // Removing default border
                                borderRadius: '5px',  // Rounded corners
                                cursor: 'pointer',  // Pointer on hover
                                fontSize: '0.875rem'
                            }} onClick={handleCloseModal}>
                                Cancel
                            </button>
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
                            }} onClick={() => {
                                // Handle the apply action here
                                // For example, you could call an API to apply for the plan
                                handleCloseModal(); // Close the modal after applying
                            }}>
                                Apply
                            </button>
                        </Modal.Footer>
                    </Modal>

                </div>
            </div >
        </>
    )
}



export default Pricing;