import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Modal, Button, Form } from 'react-bootstrap';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CardSelection from './component/CardSelection';
import CustomModal from './component/CustomModal';
// import './Payment.css'; // Import the CSS file for styling
// import Modal from 'react-bootstrap/Modal';

// const stripePromise = loadStripe('pk_test_51PcoPgRrrKRJyPcXmQ4mWHBaIEBqhR8lWBt3emhk5sBzbPuQDpGfGazHa9SU5RP7XHH2Xlpp4arUsGWcDdk1qQhe00zIasVFrZ');
const stripePromise = loadStripe('pk_test_51PvKZy04DfRmMVhLfSwskHpqnq7CRiBA28dvixlIB65W0DnpIZ9QViPT2qgAbNyaf0t0zV3MLCUy9tlJHF1KyQpr00BqjmUrQw');

// publishable_key= pk_test_51PvKZy04DfRmMVhLfSwskHpqnq7CRiBA28dvixlIB65W0DnpIZ9QViPT2qgAbNyaf0t0zV3MLCUy9tlJHF1KyQpr00BqjmUrQw
// secret_key= sk_test_51PvKZy04DfRmMVhLpUwgsNqAG7DjWlohkftPfj49gTzGMIBiZKaXh0DHYgdrKPElaAw71X94yF20MvWYyOKWOSHj00P3ayGG2K


const Payment = ({ updatePaymentStatus }) => {


    const navigate = useNavigate()
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
    const [invoice, setInvoice] = useState({ status: 'unpaid' }); // or retrieve it from your API or storage
    const [paymentStatus, setPaymentStatus] = useState('');
    const [hasUnpaidInvoices, setHasUnpaidInvoices] = useState(false);
    // const [plans, setPlans] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [fetchError, setFetchError] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(0);
    const [showModal1, setShowModal1] = useState(false);



    const handleUpdatePaymentStatus = (status) => {
        setPaymentStatus(status);
        setHasUnpaidInvoices(status !== 'paid');
    };

    // Update hasUnpaidInvoices state when invoice status changes
    useEffect(() => {
        handleUpdatePaymentStatus(invoice.status);
    }, [invoice.status]);

    useEffect(() => {
        if (paymentStatus === 'paid') {
            setHasUnpaidInvoices(false);
        } else {
            setHasUnpaidInvoices(true);
        }
    }, [paymentStatus]);

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
                        console.log('me chalaaaaaaa')
                        setSuccess(true);
                        setTimeout(() => {
                            setshowNewCardModal(false);
                        }, 1000); // Close the modal after 0.5 seconds
                    } else {
                        setError(`Payment failed: ${response.data.message}`);
                    }
                } catch (error) {
                    setError(`Payment failed: ${error.response ? error.response.data.message : error.message}`);
                }
    
                setLoading(false);
            }
        };

        useEffect(() => {
            if (success) {
                console.log("paymentv...................")
                setTimeout(() => {
                    setShowModal(false);
                    console.log("paymentv...................")
                }, 500); // Close the modal after 2 seconds
            }
        }, [success, setShowModal]);

        return (

            success ? (
                <div>
                    <div className="success-message">Card Added successful!</div>
                    {setShowModal(false)}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="payment-form">
                    <CardElement className="card-element" />
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">Card Added successful!</div>
                    }
                    {/* {setShowModal(false)} */}
                    <button type="submit" disabled={!stripe || loading} className="submit-button">
                        {loading ? 'Adding...' : 'Add Card'}
                    </button>
                </form>

            )
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
                                    {setShowModal(false)}
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
                title="Enter your new card"
            >
                <div className="text-left mb-12">
                    <div style={{ display: 'flex', marginBottom: '1rem', }}>
                        {/* <button
                            style={activeTab === 'cardSelection' ? activeTabButtonStyle : tabButtonStyle}
                            onClick={() => setActiveTab('cardSelection')}
                        >
                            Card Selection
                        </button> */}


                    </div>


                    {/* <CardSelection
                            cards={cards}
                            selectedCard={selectedCard}
                            onSelect={handleSelectCard}
                            onActionComplete={fetchTokenAndSuspendedStatus}

                        /> */}


                    {/* {activeTab === 'payment' && ( */}
                    <Elements stripe={stripePromise}>
                        <div className="payment-container mt-4">
                            <p className="mb-4">Complete Your Payment</p>
                            <CheckoutForm2 />
                        </div>
                    </Elements>
                    {/* )} */}
                </div>
            </CustomModal>
        );
    };







    /////////// add card close the modal/////////////
    const handleShowNewModal = () => {
        setshowNewCardModal(true);

    };

    /////////// add card close the modal/////////////
    const handleCloseNewModal = () => {
        setshowNewCardModal(false);
    };


    const handleShowModal1 = () => {
        setShowModal1(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleCloseModal1 = () => {
        setShowModal1(false);
    };

    const handlePayPalClick = () => {
        const amount = selectedPlan.costPerUser * TotalUsers;
        const paypalUrl = `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_PAYPAL_EMAIL&amount=${amount}&currency_code=USD`;
        window.open(paypalUrl, '_blank');
    };

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     setLoading(true);

    //     if (!stripe || !elements) {
    //         setError('Stripe has not loaded correctly.');
    //         setLoading(false);
    //         return;
    //     }

    //     const cardElement = elements.getElement(CardElement);

    //     const { error, paymentMethod } = await stripe.createPaymentMethod({
    //         type: 'card',
    //         card: elements.getElement(CardElement),
    //     });

    //     if (error) {
    //         setError(error.message);
    //         setLoading(false);
    //     } else {

    //         console.log('Card Info:', {

    //             cardType: paymentMethod.card.brand,
    //             expMonth: paymentMethod.card.exp_month,
    //             expYear: paymentMethod.card.exp_year,
    //             cardNumber: paymentMethod.card.last4,

    //         });
    //         const planUpgradeApiUrl = "https://myuniversallanguages.com:9093/api/v1";
    //         try {
    //             const response = await axios.post(`${planUpgradeApiUrl}/owner/upgrade`, {
    //                 // tokenId: paymentMethod.id,
    //                 // TotalAmount: selectedPlan.costPerUser,
    //                 // planId: selectedPlan._id,
    //                 cardType: paymentMethod.card.brand,
    //                 expMonth: paymentMethod.card.exp_month,
    //                 expYear: paymentMethod.card.exp_year,
    //                 cardNumber: paymentMethod.card.last4,
    //                 tokenId: paymentMethod.id,
    //                 TotalAmount: '58.88',
    //                 dueDate: '2024-07-30',
    //                 planId: selectedPlan._id,
    //             }, { headers });

    //             console.log('Payment Response:', response);

    //             if (response.data.success) {
    //                 setSuccess(true);
    //             } else {
    //                 setError(`Payment failed: ${response.data.message}`);
    //             }
    //         } catch (error) {
    //             setError(`Payment failed: ${error.response ? error.response.data.message : error.message}`);
    //         }
    //         setLoading(false);
    //     }
    // };
    // const handlePayWithCard = async () => {
    //     const DirectPayApiUrl = "https://myuniversallanguages.com:9093/api/v1";
    //     if (paycard) {
    //         console.log('Pay with this card:', paycard);
    //         setIsLoading(true);
    //         setResponseMessage(null);
    //         try {
    //             const response = await axios.post(`${DirectPayApiUrl}/owner/payNow`, {
    //                 cardNumber: paycard.cardNumber,
    //                 expMonth: paycard.expMonth,
    //                 expYear: paycard.expYear,
    //                 tokenId: paycard.tokenId,
    //                 cardType: paycard.cardType,
    //             }, { headers });

    //             if (response.data.success) {
    //                 console.log('Payment successful:', response);
    //                 setResponseMessage('Payment successful!');
    //             } else {
    //                 console.error('Payment failed:', response.data.error);
    //                 setResponseMessage('Payment failed: ' + response.data.error);
    //             }
    //         } catch (error) {
    //             console.error('Error:', error);
    //             setResponseMessage('Error: ' + error.response.data.message);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }

    // };

    const [showCard, setShowCard] = useState(false);


    const handleYes = () => {
        setShowCard(true);
    };

    const handleNo = () => {
        setShowModal1(false);
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
                    handleUpdatePaymentStatus('paid'); // Update paymentStatus and hasUnpaidInvoices states
                    setInvoice({ status: 'paid' }); // Update invoice status to 'paid'
                    setHasUnpaidInvoices(false) // Set hasUnpaidInvoices to false when payment is successful
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

    const handleUpgradeClick = (defaultPlanIndex) => {
        // Update the selected package when a button is clicked
        navigate('/payment', {
            state: {
                plans,
                fetchError,
                loading: false,
                defaultPlanIndex
            }
        });
        // setSelectedPackage(defaultPlanIndex);
    };
    useEffect(() => {
        const storedPlanId = JSON.parse(localStorage.getItem('planId'));

        if (storedPlanId?.planType === 'free') {
            setSelectedPackage(1); // Basic
        } else if (storedPlanId?.planType === 'standard') {
            setSelectedPackage(2); // Standard
        } else if (storedPlanId?.planType === 'premium') {
            setSelectedPackage(3); // Premium
        }
    }, []); // Empty dependency array to run only once on component mount

    useEffect(() => {
        if (selectedPlan) {
            localStorage.setItem('planId', JSON.stringify(selectedPlan));
        }
    }, [selectedPlan]);

    return (
        <>
            <div className='container'>
                <div className='row' style={{ marginLeft: '2px', gap: '50px' }}>

                    <div className="card" style={{ width: '22rem' }}>
                        <div className="card-body text-center">
                            <h3 className='text-center'
                                style={{
                                    fontSize: "1.2em", // Reduced font size
                                    color: "#333",
                                    marginBottom: "5px", // Reduced margin
                                }}
                            >
                                or Pay with PayPal
                            </h3>
                            <button className='align-items-center text-center'
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
                    </div>
                    <div className="card" style={{ width: '22rem' }}>

                        <div className="card-body text-center mt-3">
                            <h3
                                style={{
                                    fontSize: "1.2em", // Reduced font size
                                    color: "#333",
                                    marginBottom: "5px", // Reduced margin
                                }}
                            >
                                Add new card
                            </h3>
                            <p style={{ marginBottom: "10px", fontSize: "0.9em" }} className='mt-3' > {/* Reduced margin and font size */}
                                The card will be charged monthly
                            </p>
                            <button className='mt-2'
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
                                Add Card
                            </button>

                        </div>
                    </div>
                </div>
                <PaymentModal
                    showModal={showModal}
                    handleClose={handleCloseModal}
                    selectedPlan={selectedPlan}
                />
                {/* // )} */}
            </div >
            <div>
                <NewCardModal
                    showNewCardModal={showNewCardModal}
                    handleClose={handleCloseNewModal}
                />
            </div>
        </>


    );
};









export default Payment;
