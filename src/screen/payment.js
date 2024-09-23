import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Modal, Button, Form } from 'react-bootstrap';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import CardSelection from './component/CardSelection';
import CustomModal from './component/CustomModal';
// import './Payment.css'; // Import the CSS file for styling

const stripePromise = loadStripe('pk_test_51PcoPgRrrKRJyPcXmQ4mWHBaIEBqhR8lWBt3emhk5sBzbPuQDpGfGazHa9SU5RP7XHH2Xlpp4arUsGWcDdk1qQhe00zIasVFrZ');



const Payment = () => {
    const location = useLocation();
    const [plans, setPlans] = useState(location.state?.plans || []);
    const [fetchError] = useState(location.state?.fetchError || null);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [defaultPlanIndex] = useState(location.state?.defaultPlanIndex || 0);
    const [showModal, setShowModal] = useState(false);
    const [TotalUsers, setTotalUsers] = useState(0);
    const [showNewCardModal, setshowNewCardModal] = useState(false);
    const [billingDate, setBillingDate] = useState(null);
    const [paycard, setpaycard] = useState();
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [selectedCard, setSelectedCard] = useState(
        cards.find(card => card.defaultCard)?._id || null
    );


    const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };

    useEffect(() => {
        if (plans.length > 0) {
            setSelectedPlan(plans[defaultPlanIndex] || plans[0]);

        }
    }, [plans, defaultPlanIndex]);

    // const handlePlanSelect = (plan) => {
    //     setSelectedPlan(plan);


    // };

    const getPlanDescription = (plan) => {
        return `$${plan.costPerUser} per month per user, up to ${plan.screenshotsPerHr} screenshots per hour, screenshots kept ${plan.ssStored} days, individual settings, activity level tracking, ${plan.mobileApp ? 'mobile app included' : 'no mobile app'}, app & URL tracking`;
    };
    console.log('Selected plan:==============', plans);

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const getData = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/owner/companies`, { headers });
            const ownerUser = response?.data?.employees?.find(user => user.userType === 'owner');
            if (ownerUser) {
                setBillingDate(ownerUser.billingDate);
            }
            setTotalUsers(response?.data?.count);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [headers]);




    const fetchTokenAndSuspendedStatus = async () => {
        if (token) {
            try {
                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const apiUrl1 = 'https://myuniversallanguages.com:9093/api/v1';
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






    useEffect(() => {
        getData();
        fetchTokenAndSuspendedStatus();
        console.log('selectedPlan=========jjjjjjjjjjjj', selectedPlan);

    }, []);







    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const addMonth = (date) => {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + 1);
        return newDate;
    };

    const firstBillingPeriodStart = billingDate ? new Date(billingDate) : null;
    const firstBillingPeriodEnd = billingDate ? addMonth(firstBillingPeriodStart) : null;



    const CheckoutForm2 = () => {
        const stripe = useStripe();
        const elements = useElements();
        const [error, setError] = useState(null);
        const [success, setSuccess] = useState(false);
        const [loading, setLoading] = useState(false);
        const items = JSON.parse(localStorage.getItem('items'));
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: "Bearer " + token,
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            setLoading(true);

            if (!stripe || !elements) {
                setError('Stripe has not loaded correctly.');
                setLoading(false);
                return;
            }

            const cardElement = elements.getElement(CardElement);

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {

                console.log('Card Info:', {

                    cardType: paymentMethod.card.brand,
                    expMonth: paymentMethod.card.exp_month,
                    expYear: paymentMethod.card.exp_year,
                    cardNumber: paymentMethod.card.last4,

                });
                const planUpgradeApiUrl = "https://myuniversallanguages.com:9093/api/v1";
                try {
                    const response = await axios.post(`${planUpgradeApiUrl}/owner/addNewCard`, {
                        // tokenId: paymentMethod.id,
                        // TotalAmount: selectedPlan.costPerUser,
                        // planId: selectedPlan._id,
                        cardType: paymentMethod.card.brand,
                        expMonth: paymentMethod.card.exp_month,
                        expYear: paymentMethod.card.exp_year,
                        cardNumber: paymentMethod.card.last4,
                        tokenId: paymentMethod.id,
                        // TotalAmount: '58.88',
                        // dueDate: '2024-07-30',
                        // planId: selectedPlan._id,
                    }, { headers });

                    console.log('Payment Response:', response);

                    if (response.data.success) {
                        setSuccess(true);
                    } else {
                        setError(`Payment failed: ${response.data.message}`);
                    }
                } catch (error) {
                    setError(`Payment failed: ${error.response ? error.response.data.message : error.message}`);
                }
                setLoading(false);
            }
        };

        return (
            <form onSubmit={handleSubmit} className="payment-form">
                <CardElement className="card-element" />
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Card Added successful!</div>}
                <button type="submit" disabled={!stripe || loading} className="submit-button">
                    {loading ? 'Adding...' : 'Add Card'}
                </button>
            </form>
        );
    };
    const CheckoutForm = () => {
        const stripe = useStripe();
        const elements = useElements();
        const [error, setError] = useState(null);
        const [success, setSuccess] = useState(false);
        const [loading, setLoading] = useState(false);
        const items = JSON.parse(localStorage.getItem('items'));
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: "Bearer " + token,
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            setLoading(true);

            if (!stripe || !elements) {
                setError('Stripe has not loaded correctly.');
                setLoading(false);
                return;
            }

            const cardElement = elements.getElement(CardElement);

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {

                console.log('Card Info:', {

                    cardType: paymentMethod.card.brand,
                    expMonth: paymentMethod.card.exp_month,
                    expYear: paymentMethod.card.exp_year,
                    cardNumber: paymentMethod.card.last4,

                });
                const planUpgradeApiUrl = "https://myuniversallanguages.com:9093/api/v1";
                try {
                    const response = await axios.post(`${planUpgradeApiUrl}/owner/upgrade`, {
                        // tokenId: paymentMethod.id,
                        // TotalAmount: selectedPlan.costPerUser,
                        // planId: selectedPlan._id,
                        cardType: paymentMethod.card.brand,
                        expMonth: paymentMethod.card.exp_month,
                        expYear: paymentMethod.card.exp_year,
                        cardNumber: paymentMethod.card.last4,
                        tokenId: paymentMethod.id,
                        TotalAmount: '58.88',
                        dueDate: '2024-07-30',
                        planId: selectedPlan._id,
                    }, { headers });

                    console.log('Payment Response:', response);

                    if (response.data.success) {
                        setSuccess(true);
                    } else {
                        setError(`Payment failed: ${response.data.message}`);
                    }
                } catch (error) {
                    setError(`Payment failed: ${error.response ? error.response.data.message : error.message}`);
                }
                setLoading(false);
            }
        };

        return (
            <form onSubmit={handleSubmit} className="payment-form">
                <CardElement className="card-element" />
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Payment successful!</div>}
                <button type="submit" disabled={!stripe || loading} className="submit-button">
                    {loading ? 'Processing...' : 'Pay'}
                </button>
            </form>
        );
    };



    //this api is for pricing plan who's data is to send to payment page
    const planapiUrl = "https://myuniversallanguages.com:9093/api/v1";


    const fetchPlans = async () => {
        try {
            const response = await axios.get(`${planapiUrl}/owner/getPlans`);
            const plans = response.data.data;
            console.log('plansssss====>', plans)
            setPlans(plans)
            setSelectedPlan(plans[1]);
            // Store plans in localStorage
            // localStorage.setItem('plans', JSON.stringify(plans));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching plans:', error);

            setLoading(false);
        }
    };






    useEffect(() => {
        if (plans.length > 0) {
            setSelectedPlan(plans[defaultPlanIndex - 1] || plans[1]);

        } else {
            fetchPlans();
            // setSelectedPlan(plans[0])
        }

    }, [plans, defaultPlanIndex]);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);


    };

    const PaymentModal = ({ showModal, handleClose }) => {

        return (
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Payment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-left mb-4">
                        {/* <h5 className="owner-name">Owner Name</h5> */}
                        {/* <h5 className="employee-count">Number of employees: 5</h5> */}


                        {selectedPlan && (
                            <Elements stripe={stripePromise}>
                                <div className="payment-container mt-4">
                                    <p className="mb-4">Complete Your Payment</p>
                                    <CheckoutForm />
                                </div>
                            </Elements>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        );
    };


    const NewCardModal = ({ showNewCardModal, handleClose }) => {

        const token = localStorage.getItem('token');

        const [activeTab, setActiveTab] = useState('cardSelection');


        
        const tabButtonStyle = {
            flex: 1,
            padding: '0.5rem',
            border: '1px solid #6ABB47',
            backgroundColor: 'white',
            color: '#6ABB47',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.3s, color 0.3s'
        };

        const activeTabButtonStyle = {
            ...tabButtonStyle,
            backgroundColor: '#6ABB47',
            color: 'white'
        };

        const handleSelectCard = (card) => {
            setSelectedCard(card._id);
            // console.log('Selected Card Full Info:', card);
        };

        return (
            <CustomModal
                show={showNewCardModal}
                onClose={handleClose}
                title="Select Card for Payment"
            >
                <div className="text-left mb-4">
                    <div style={{ display: 'flex', marginBottom: '1rem', }}>
                        <button
                            style={activeTab === 'cardSelection' ? activeTabButtonStyle : tabButtonStyle}
                            onClick={() => setActiveTab('cardSelection')}
                        >
                            Card Selection
                        </button>

                        <button
                            style={activeTab === 'payment' ? activeTabButtonStyle : tabButtonStyle}
                            onClick={() => setActiveTab('payment')}
                        >
                            Add New Card
                        </button>

                    </div>

                    {activeTab === 'cardSelection' && (
                        <CardSelection
                            cards={cards}
                            selectedCard={selectedCard}
                            onSelect={handleSelectCard}
                            onActionComplete={fetchTokenAndSuspendedStatus}

                        />
                    )}

                    {activeTab === 'payment' && (
                        <Elements stripe={stripePromise}>
                            <div className="payment-container mt-4">
                                <p className="mb-4">Complete Your Payment</p>
                                <CheckoutForm2 />
                            </div>
                        </Elements>
                    )}
                </div>
            </CustomModal>
        );
    };







    const handleShowNewModal = () => {
        setshowNewCardModal(true);

    };

    const handleCloseNewModal = () => {
        setshowNewCardModal(false);
    };


    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePayPalClick = () => {
        const amount = selectedPlan.costPerUser * TotalUsers;
        const paypalUrl = `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_PAYPAL_EMAIL&amount=${amount}&currency_code=USD`;
        window.open(paypalUrl, '_blank');
    };

    const handlePayWithThisCard = async () => {
        const DirectPayApiUrl = "https://myuniversallanguages.com:9093/api/v1";
        if (paycard) {
            console.log('Pay with this card:', paycard);
            setIsLoading(true);
            setResponseMessage(null);
            try {
                const response = await axios.post(`${DirectPayApiUrl}/owner/payNow`, {
                    cardNumber: paycard.cardNumber,
                    expMonth: paycard.expMonth,
                    expYear: paycard.expYear,
                    tokenId: paycard.tokenId,
                    cardType: paycard.cardType,
                }, { headers });

                if (response.data.success) {
                    console.log('Payment successful:', response);
                    setResponseMessage('Payment successful!');
                } else {
                    console.error('Payment failed:', response.data.error);
                    setResponseMessage('Payment failed: ' + response.data.error);
                }
            } catch (error) {
                console.error('Error:', error);
                setResponseMessage('Error: ' + error.response.data.message);
            } finally {
                setIsLoading(false);
            }
        }

    };

    const totalbill = selectedPlan?.costPerUser * TotalUsers
    console.log('_____________________', paycard?.cardNumber)
    const Cardetail = paycard?.cardNumber
    localStorage.setItem('billdetail', JSON.stringify(totalbill));
    localStorage.setItem('carddetail', JSON.stringify(Cardetail));


    return (
        <div>
            <div className="container">
                <div className="userHeader">
                    <div>
                        <h5>Paid plan</h5>
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="ownerTeamContainer">
                        <h3 className="card-title mb-4">Selected Plan</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            {loading ? (
                                <p>Loading plans...</p>
                            ) : fetchError ? (
                                <p>{fetchError}</p>
                            ) : (
                                plans
                                    .filter((plan) => plan.planType !== 'trial') // Filter out trial plans
                                    .map((plan) => (
                                        <div className="card w-75" style={{ marginBottom: '10px' }} key={plan._id}>
                                            <div className="card-body">
                                                <label style={{
                                                    position: 'relative',
                                                    paddingLeft: '30px',
                                                    cursor: 'pointer',
                                                    fontSize: '22px',
                                                    userSelect: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                                >
                                                    <input
                                                        type="radio"
                                                        id={plan._id}
                                                        name="plan"
                                                        value={plan.planType}
                                                        checked={selectedPlan?._id === plan._id}
                                                        onChange={() => handlePlanSelect(plan)}
                                                        style={{
                                                            position: 'absolute',
                                                            opacity: 0,
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        height: '25px',
                                                        width: '25px',
                                                        backgroundColor: selectedPlan?._id === plan._id ? '#4CAF50' : '#0070BA', // Changed color
                                                        borderRadius: '50%',
                                                        transition: 'background-color 0.3s'
                                                    }}
                                                    ></span>
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '9px',
                                                        left: '9px',
                                                        height: '8px',
                                                        width: '8px',
                                                        borderRadius: '50%',
                                                        backgroundColor: selectedPlan?._id === plan._id ? 'white' : 'transparent',
                                                        display: selectedPlan?._id === plan._id ? 'block' : 'none'
                                                    }}
                                                    ></span>
                                                    {plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)} - ${plan.costPerUser}/month
                                                </label>
                                                <p className="card-text">{getPlanDescription(plan)}</p>
                                            </div>
                                        </div>

                                    ))
                            )}




                        </div>
                        <h3 className="card-title mt-4">Estimated payments</h3>
                        <div className="mt-2" style={{ maxWidth: "70%", color: 'grey' }}>Pay only for what you use. There is no minimum fee. If you add a worker for a single day, you'll pay for this day only. Not month. You are free to add or remove workers anytime as you see fit. Your credit card will not be charged today, only at the end of your billing period.</div>
                        <div className="container mt-4">
                            <div className="row">
                                <div className="col-12">
                                    <p><strong>First billing period:</strong> {firstBillingPeriodStart && firstBillingPeriodEnd ? `${formatDate(firstBillingPeriodStart)}–${formatDate(firstBillingPeriodEnd)}` : 'N/A'}</p>
                                    <p><strong>First charge date:</strong> {billingDate ? formatDate(billingDate) : 'N/A'}</p>
                                    <p><strong>Current employees:</strong> {TotalUsers} — you won't be charged for yourself unless you track your own time</p>
                                    {selectedPlan && (
                                        <>
                                            <p><strong>Price per user:</strong> ${selectedPlan.costPerUser}/month</p>
                                            {/* <p className="font-weight-bold"><strong>Estimated total:</strong> <span>${selectedPlan.costPerUser * TotalUsers}/month</span></p> */}
                                            <p className="font-weight-bold"><strong>Estimated total:</strong>  <span>${Math.floor(selectedPlan.costPerUser * TotalUsers * 100) / 100}/month</span></p>

                                        </>
                                    )}
                                </div>
                            </div>
                        </div>





                        <div style={{
                            padding: "20px",
                            border: "1px solid #ccc",
                            borderRadius: "15px",
                            backgroundColor: "#fff",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            marginBottom: "20px",
                            width: '400px',
                            backgroundImage: 'linear-gradient(135deg, #0070BA, #00A1F1)',
                            color: 'white',
                            fontFamily: 'Arial, sans-serif',
                            textAlign: 'left',
                            position: 'relative',
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>
                                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                                    {paycard ? paycard.cardType : "Visa"}
                                </span>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                                    alt="Visa logo"
                                    style={{ width: '60px', height: 'auto' }}
                                />
                            </div>
                            <div style={{
                                fontSize: "16px",
                                letterSpacing: "2px",
                                marginBottom: '20px'
                            }}>
                                **** **** **** {paycard ? paycard.cardNumber : ""}
                                {/* **** **** **** {paycard.cardNumber.slice(-4)} */}

                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontSize: "12px", fontWeight: "bold" }}>Expires</div>
                                    <div style={{ fontSize: "14px" }}>{paycard ? paycard.expMonth : '**'}/{paycard ? paycard.expYear : '**'}</div>
                                    {/* <div style={{ fontSize: "14px" }}>12/25</div> */}
                                </div>
                            </div>
                            <button
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    right: '20px',
                                    display: "inline-block",
                                    padding: "10px 20px",
                                    backgroundColor: isLoading ? "#ccc" : "#7CCB58",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontSize: "14px",
                                    cursor: isLoading ? "not-allowed" : "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                                onClick={handlePayWithThisCard}
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : "Pay with this card"}
                            </button>
                        </div>
                        {responseMessage && (
                            <div style={{
                                marginTop: '50px',
                                padding: '10px',
                                borderRadius: '5px',
                                backgroundColor: responseMessage.includes('successful') ? '#7CCB58' : '#ff4d4d',
                                color: 'white',
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}>
                                {responseMessage}
                            </div>
                        )}


                        <div className="container mt-4">
                            <div style={{ display: "flex" }}>
                                {/* Pay with Card Section */}
                                <div
                                    className="col-sm-4"
                                    style={{
                                        border: "1px solid #ddd",
                                        display: "flex",
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: "8px",
                                        padding: "10px", // Reduced padding
                                        backgroundColor: "#fff",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                                        marginRight: "10px", // Add margin for spacing between sections
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: "1.2em", // Reduced font size
                                            color: "#333",
                                            marginBottom: "5px", // Reduced margin
                                        }}
                                    >
                                        Upgrade to Paid Plan
                                    </h3>
                                    <p style={{ marginBottom: "10px", fontSize: "0.9em" }}> {/* Reduced margin and font size */}
                                        This card will be charged monthly
                                    </p>
                                    <button
                                        onClick={handleShowModal}
                                        style={{
                                            display: "inline-block",
                                            padding: "8px 16px", // Reduced padding
                                            backgroundColor: "#7CCB58",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "5px",
                                            fontSize: "0.9em", // Reduced font size
                                            cursor: "pointer",
                                            transition: "background-color 0.3s ease",
                                        }}
                                    >
                                        Upgrade to Paid Plan
                                    </button>
                                </div>

                                {/* Pay with PayPal Section */}
                                <div
                                    className="col-sm-4"
                                    style={{
                                        border: "1px solid #ddd",
                                        display: "flex",
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: "8px",
                                        padding: "10px", // Reduced padding
                                        backgroundColor: "#fff",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                                        marginRight: "10px",
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: "1.2em", // Reduced font size
                                            color: "#333",
                                            marginBottom: "5px", // Reduced margin
                                        }}
                                    >
                                        or Pay with PayPal
                                    </h3>
                                    <button
                                        onClick={handlePayPalClick}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '10px 20px',
                                            backgroundColor: '#FFB730', // Yellow background color
                                            border: '2px solid #FFB730', // Border to match the background
                                            borderRadius: '50px', // Rounded corners
                                            cursor: 'pointer',
                                            textDecoration: 'none',
                                            fontSize: '1em',
                                            fontWeight: 'bold',
                                            color: '#0070BA', // PayPal blue color for text
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Slight shadow for effect
                                            transition: 'background-color 0.3s ease',
                                            margin: '10px',
                                        }}
                                    >
                                        <img
                                            src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                                            alt="PayPal"
                                            style={{
                                                width: '24px',
                                                height: 'auto',
                                                marginRight: '8px', // Space between icon and text
                                            }}
                                        />
                                        PayPal
                                    </button>
                                    <p style={{ fontSize: "0.9em", marginBottom: "0" }}> {/* Reduced font size and margin */}
                                        PayPal will <strong>NOT</strong> be charged monthly automatically, we
                                        will remind you when it is time to pay or you can add credit in
                                        advance.
                                    </p>
                                </div>

                                {/* Pay with Card Section */}
                                <div
                                    className="col-sm-4"
                                    style={{
                                        border: "1px solid #ddd",
                                        display: "flex",
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: "8px",
                                        padding: "10px", // Reduced padding
                                        backgroundColor: "#fff",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                                        marginRight: "10px", // Add margin for spacing between sections
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: "1.2em", // Reduced font size
                                            color: "#333",
                                            marginBottom: "5px", // Reduced margin
                                        }}
                                    >
                                        Add new card
                                    </h3>
                                    <p style={{ marginBottom: "10px", fontSize: "0.9em" }}> {/* Reduced margin and font size */}
                                        The card will be charged monthly
                                    </p>
                                    <button
                                        onClick={handleShowNewModal}
                                        style={{
                                            display: "inline-block",
                                            padding: "8px 16px", // Reduced padding
                                            backgroundColor: "#7CCB58",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "5px",
                                            fontSize: "0.9em", // Reduced font size
                                            cursor: "pointer",
                                            transition: "background-color 0.3s ease",
                                        }}
                                    >
                                        Select Card
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <PaymentModal
                    showModal={showModal}
                    handleClose={handleCloseModal}
                    selectedPlan={selectedPlan}
                />
                <NewCardModal
                    showNewCardModal={showNewCardModal}
                    handleClose={handleCloseNewModal}
                />
            </div>
        </div>
    );
};









export default Payment;
