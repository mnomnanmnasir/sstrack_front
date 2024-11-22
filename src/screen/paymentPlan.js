import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Modal, Button, Form } from 'react-bootstrap';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import CardSelection from './component/CardSelection';
import CustomModal from './component/CustomModal';
// import './Payment.css'; // Import the CSS file for styling
import PaymentCards from './paymentCards'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'



// const stripePromise = loadStripe('pk_test_51PcoPgRrrKRJyPcXmQ4mWHBaIEBqhR8lWBt3emhk5sBzbPuQDpGfGazHa9SU5RP7XHH2Xlpp4arUsGWcDdk1qQhe00zIasVFrZ');
const stripePromise = loadStripe('pk_test_51PvKZy04DfRmMVhLfSwskHpqnq7CRiBA28dvixlIB65W0DnpIZ9QViPT2qgAbNyaf0t0zV3MLCUy9tlJHF1KyQpr00BqjmUrQw');

// publishable_key= pk_test_51PvKZy04DfRmMVhLfSwskHpqnq7CRiBA28dvixlIB65W0DnpIZ9QViPT2qgAbNyaf0t0zV3MLCUy9tlJHF1KyQpr00BqjmUrQw
// secret_key= sk_test_51PvKZy04DfRmMVhLpUwgsNqAG7DjWlohkftPfj49gTzGMIBiZKaXh0DHYgdrKPElaAw71X94yF20MvWYyOKWOSHj00P3ayGG2K


const Payment = ({ updatePaymentStatus }) => {

    const location = useLocation();
    const [plans, setPlans] = useState(location.state?.plans || []);
    const [fetchError] = useState(location.state?.fetchError || null);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [defaultPlanIndex] = useState(location.state?.defaultPlanIndex || 0);
    const [showModal, setShowModal] = useState(false);
    const [showModalwithoutcard, setShowModalwithoutcard] = useState(false);
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
    const items = JSON.parse(localStorage.getItem('items'));


    const navigate = useNavigate();
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

    const apiUrl = "https://ss-track-xi.vercel.app/api/v1";
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
                const apiUrl1 = 'https://ss-track-xi.vercel.app/api/v1';
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
                const planUpgradeApiUrl = "https://ss-track-xi.vercel.app/api/v1";
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

    const [modalData, setModalData] = useState({});

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
                const planUpgradeApiUrl = "https://ss-track-xi.vercel.app/api/v1";
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


                    console.log('Payment acctual:', response);

                    if (response.data.success) {
                        setSuccess(true);
                        setTimeout(() => {
                            setShowModal(false);
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

        return (
            <form onSubmit={handleSubmit} className="payment-form">
                <CardElement className="card-element" />
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Payment successful!</div>}
                <button type="submit" disabled={!stripe || loading} className="submit-button">
                    {loading ? 'Upgrade to paid plan' : 'Pay'}

                </button>
            </form>
        );
    };


    //this api is for pricing plan who's data is to send to payment page
    const planapiUrl = "https://ss-track-xi.vercel.app/api/v1";


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
        console.log('planssssssssss', plan)

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


    const [selectedPackage, setSelectedPackage] = useState();
    const storedPlanId = JSON.parse(localStorage.getItem('planId'));
    // Retrieve the stored plan from localStorage and set the selected package
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


    const handleUpgradeClick = (defaultPlanIndex) => {
        // Update the selected package when a button is clicked
        navigate('/payment', {
            state: {
                plans,
                fetchError,
                loading: false,
                // defaultPlanIndex
            }
        });
        // setSelectedPackage(defaultPlanIndex);
    };

    // Function to return the appropriate button text
    const getButtonText = (buttonPackage) => {
        if (buttonPackage === selectedPackage) {
            return 'Current';
        } else if (buttonPackage > selectedPackage) {
            return 'Upgrade';
        } else {
            return 'Downgrade';
        }
    };

    const handleShowNewModal = () => {
        setshowNewCardModal(true);

    };

    const handleCloseNewModal = () => {
        setshowNewCardModal(false);
    };

    const handleShowModal = () => {
        setShowModal(true);  // For when the paycard is available
    };

    const handleShowModal2 = () => {
        console.log('No card available');
        // setShowModalwithoutcard(true);  // For when the paycard is not available
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    /////// enter your card number close the modal///////////
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
                   
                    
                </Modal.Footer>
            </Modal >
        );
    };
    
    // const handleDirectChangePlan = async () => {
    // const DirectPayApiUrl = "https://ss-track-xi.vercel.app/api/v1";
    // if (paycard) {
    //     console.log('Pay with this card:', paycard);
    //     // setIsLoading(true);
    //     setResponseMessage(null);
    //         try {
    //             const response = await axios.post(`${DirectPayApiUrl}/owner/upgrade`,
    //                 {
    //                     // tokenId: paymentMethod.id,
    //                     // TotalAmount: selectedPlan.costPerUser,
    //                     // planId: selectedPlan._id,

    //                     planId: selectedPlan._id,
    //                 }, { headers });
    //             if (response.status === 200) {
    //                 console.log('Payment successfully upgraded:', response.data.success);
    //                 enqueueSnackbar(response.data.success, {
    //                     variant: "success",
    //                     anchorOrigin: {
    //                         vertical: "top",
    //                         horizontal: "right"
    //                     }
    //                 })
    //                 // setResponseMessage('Payment successful!');
    //                 // handleUpdatePaymentStatus('paid'); 
    //                 // setInvoice({ status: 'paid' });
    //                 // setHasUnpaidInvoices(false) 
    //             } else {
    //                 console.error('Payment failed:', response.data.error);
    //                 enqueueSnackbar(response.data.success, {
    //                     variant: "error",
    //                     anchorOrigin: {
    //                         vertical: "top",
    //                         horizontal: "right"
    //                     }
    //                 })
    //                 // setResponseMessage('Payment failed: ' + response.data.error);
    //             }
    // handleCloseModal2()
    //         } catch (error) {
    //             console.error('Error:', error.response.data.message);
    //             if (error.response && error.response.data) {
    //                 if (error.response.status === 403 && error.response.data.success === false) {
    //                     alert(error.response.data.message)
    //                     enqueueSnackbar(error.response.data.message, {
    //                         variant: "error",
    //                         anchorOrigin: {
    //                             vertical: "top",
    //                             horizontal: "right"
    //                         }
    //                     })
    //                 }
    //             }
    //             // setResponseMessage('Error: ' + error.response.data.message);
    // } finally {
    //     // setIsLoading(false);
    //     setShowModalwithoutcard(false);
    // }
    //     }
    // };
    const handleDirectChangePlan = async () => {
        const DirectPayApiUrl = "https://ss-track-xi.vercel.app/api/v1";
        if (paycard) {
            console.log('Pay with this card:', paycard);
            // setIsLoading(true);
            setResponseMessage(null);
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

    const planchange = () => {
        if (paycard) {
            setShowModalwithoutcard(true);  // For when the paycard is not available
            console.log('card is available', showModalwithoutcard);
        } else {
            console.log('card is not available');
            handleShowModal();
        }
        // setPlanData(plan)
    }

    const [isOpen, setIsOpen] = useState(false);

    const totalbill = selectedPlan?.costPerUser * TotalUsers
    console.log('_____________________', paycard?.cardNumber)
    const Cardetail = paycard?.cardNumber
    localStorage.setItem('billdetail', JSON.stringify(totalbill));
    localStorage.setItem('carddetail', JSON.stringify(Cardetail));
    // const planData = JSON.parse(localStorage.getItem('planIdforHome'));
    const [planData, setPlanData] = useState(JSON.parse(localStorage.getItem('planIdforHome')));
    // const [planData, setPlanData] = useState(JSON.parse(localStorage.getItem('planIdforHome')));
    // const [planData, setPlanData] = useState(JSON.parse(localStorage.getItem('planIdforHome')));

    const premiumPlan = plans.find((plan) => plan.planType === 'premium');

    const handleOpenModal = () => {
        setIsOpen(true);
    };



    return (
        <>
            <SnackbarProvider />
            
            <div className='container mt-4'>
                <div className="row">
                    {loading ? (
                        <p className="col-12">Loading plans...</p>
                    ) : fetchError ? (
                        <p className="col-12">{fetchError}</p>
                    ) : (
                        plans
                            .filter((plan) => plan.planType !== 'trial') // Filter out trial plans
                            .map((plan, index) => (

                                <div className={`col-6 ${index % 2 === 0 ? '' : 'pl-2'}`} style={{
                                    marginBottom: '10px',
                                    overflow: 'hidden', // Add this line
                                }} key={plan._id}>
                                    <div className='card' >
                                        <div className="card-body w-100" style={{
                                            backgroundColor: selectedPlan?._id === plan._id ? '#8accff' : '',
                                        }}>
                                            <label style={{
                                                position: 'relative',
                                                paddingLeft: '30px',
                                                cursor: 'pointer',
                                                fontSize: '22px',
                                                userSelect: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%', // Add this to make the label full width
                                                height: '100%', // Add this to make the label full height
                                            }}
                                            >
                                                <input
                                                    type="radio"
                                                    id={plan._id}
                                                    name="plan"
                                                    value={plan?.planType}
                                                    checked={selectedPlan?._id === plan?._id}
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
                                                <div style={{ marginLeft: '10px' }}>
                                                    {plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)} - ${plan.costPerUser}/month
                                                    {planData ? (
                                                        plan.planType.charAt(0).toUpperCase() === planData.planType.charAt(0).toUpperCase() ? (
                                                            <span style={{ color: 'green' }}> Current</span>
                                                        ) : (
                                                            selectedPlan?._id === plan._id ? (
                                                                <>
                                                                    <button style={{
                                                                        marginLeft: '10px',
                                                                        padding: '5px 5px',  // Adjusting padding for a smaller size
                                                                        backgroundColor: 'green',  // Green background
                                                                        color: 'white',  // White text
                                                                        border: 'none',  // Removing default border
                                                                        borderRadius: '5px',  // Rounded corners
                                                                        cursor: 'pointer',  // Pointer on hover
                                                                        fontSize: '0.875rem'
                                                                    }}
                                                                        onClick={() => {
                                                                            planchange();
                                                                            // setPlanData(plan);
                                                                            // localStorage.setItem('planIdforHome', JSON.stringify(plan));
                                                                            // handleDirectChangePlan()
                                                                            // window.open(receiptUrl, '_blank'); // Open receiptUrl in a new tab
                                                                        }}
                                                                    >
                                                                        {plan.planType.charAt(0).toUpperCase() === 'S' ? 'Downgrade' : 'Upgrade'}
                                                                    </button>
                                                                    {/* <a
                                                                        href={receiptUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{
                                                                            marginLeft: '10px',
                                                                            padding: '5px 5px',  // Adjusting padding for a smaller size
                                                                            backgroundColor: 'green',  // Green background
                                                                            color: 'white',  // White text
                                                                            border: 'none',  // Removing default border
                                                                            borderRadius: '5px',  // Rounded corners
                                                                            cursor: 'pointer',  // Pointer on hover
                                                                            fontSize: '0.875rem',
                                                                            textDecoration: 'none'  // Remove underline
                                                                        }}
                                                                    >
                                                                        {plan.planType.charAt(0).toUpperCase() === 'S' ? 'Downgrade' : 'Upgrade'}
                                                                    </a> */}
                                                                </>
                                                            ) : (
                                                                <span></span>
                                                            )
                                                        )

                                                    ) : (
                                                        selectedPlan?._id === plan._id ? (
                                                            <button style={{
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
                                                                    planchange();
                                                                    // setPlanData(plan);
                                                                    // handleDirectChangePlan()
                                                                    // localStorage.setItem('planIdforHome', JSON.stringify(plan));
                                                                }}
                                                            >
                                                                Upgrade
                                                            </button>
                                                        ) : (
                                                            <span></span>
                                                        )
                                                    )}
                                                    <p className="card-text" style={{ fontSize: '1rem' }}>{getPlanDescription(plan)}</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
            <br />
            <div className='container'>
                <div className='card'>
                    <div className='card-body'>
                        <h3 className="card-title mt-4">Estimated</h3>
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
                    </div>
                </div>
            </div>
            
            {/* {responseMessage && (
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
                        )} */}
            {/* {showModal && ( */}
            <PaymentModal
                showModal={showModal}
                handleClose={handleCloseModal}
                selectedPlan={selectedPlan}
            />
            {/* // )} */}
            <Withoutcardpayment
                showModalwithoutcard={showModalwithoutcard}
                handleCloseModal2={handleCloseModal2}
                selectedPlan={selectedPlan}
            />


        </>

    );
};

export default Payment;
