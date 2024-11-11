import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Modal, Button, Form } from 'react-bootstrap';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import CardSelection from './component/CardSelection';
import CustomModal from './component/CustomModal';
// import './Payment.css'; // Import the CSS file for styling
import PaymentCards from './paymentCards1'
import PaymentPlans from './paymentPlan'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import PayPalButton from './PayPalButton'


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
    const [TotalUsers, setTotalUsers] = useState(0);
    const [showNewCardModal, setshowNewCardModal] = useState(false);
    const [billingDate, setBillingDate] = useState(null);
    const [paycard, setpaycard] = useState();
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModalwithoutcard, setShowModalwithoutcard] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [invoice, setInvoice] = useState({ status: 'unpaid' }); // or retrieve it from your API or storage
    const [paymentStatus, setPaymentStatus] = useState('');
    const [showPayPal, setShowPayPal] = useState(false);  // To toggle PayPal button visibility
    const [hasUnpaidInvoices, setHasUnpaidInvoices] = useState(false);
    const [show, setShow] = useState(false);
    const [deleteAccount, setDeleteAccount] = useState(false);
    const [showButton, setShowButton] = useState([])
    const [updatePassword, setUpdatePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [verify, setVerify] = useState(false);
    const [invoices, setInvoices] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    // let token = localStorage.getItem('token');
    // const navigate = useNavigate('');
    const [error, setErrorMessage] = useState([])
    const items = JSON.parse(localStorage.getItem('items'));
    // let headers = {
    //     Authorization: 'Bearer ' + token,
    // }
    // const [selectedPlan, setSelectedPlan] = useState(null);

    console.log('usercompany==============', items);
    const storedPlanId = JSON.parse(localStorage.getItem('planId'));

    const handleUpdatePaymentStatus = (status) => {
        setPaymentStatus(status);
        setHasUnpaidInvoices(status !== 'paid');
    };

    const [planData, setPlanData] = useState(JSON.parse(localStorage.getItem('planIdforHome')));

    const handleCloseModal2 = () => {
        setShowModalwithoutcard(false);
    };


    const amount = selectedPlan?.costPerUser * TotalUsers;


    // const getCardIcon = (cardType) => {
    //     switch (cardType) {
    //         case "Mastercard":
    //             return "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg";
    //         case "American Express":
    //             return "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg";
    //         case "visa":
    //             return "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"; // Example URL
    //         default:
    //             return "";
    //     }
    //     console.log('Card Type', cardType)
    // };
    // const fetchCardLogo = (cardType) => {
    //     if (!cardType) {
    //         setErrorMessage('Please enter a card type.');
    //         return;
    //     }

    //     const cardIconUrl = getCardIcon(cardType);
    //     if (cardIconUrl) {
    //         setLogoUrl(cardIconUrl);
    //         setErrorMessage('');
    //     } else {
    //         const domain = cardType.toLowerCase().replace(/\s+/g, '') + '.com';
    //         const clearbitUrl = `https://logo.clearbit.com/${encodeURIComponent(domain)}`;

    //         axios.get(clearbitUrl)
    //             .then(response => {
    //                 setLogoUrl(clearbitUrl);
    //                 setErrorMessage('');
    //             })
    //             .catch(error => {
    //                 setErrorMessage(`Failed to fetch logo for ${cardType}. Please try again.`);
    //                 setLogoUrl('');
    //             });
    //     }
    // };

    const fetchInvoices = async () => {
        try {
            const res = await fetch(`${apiUrl}/owner/getInvoice`, { headers });
            const data = await res.json();

            // Filter unpaid invoices and map to their IDs
            const unpaidInvoiceIds = data.data.invoiceInfo
                .filter(invoice => invoice.status === 'unpaid')
                .map(invoice => invoice._id);

            if (unpaidInvoiceIds) {
                console.log('Using unpaidInvoiceIds:', unpaidInvoiceIds);
                // Call the next function with unpaidInvoiceIds
                handlePayWithThisCard(unpaidInvoiceIds['invoice 1', 'Invoice 2']);
            }


            // Set the invoices state and any related UI flags
            const transformedInvoices = data.data.invoiceInfo.map(invoice => ({
                id: invoice.invoiceNumber,
                date: new Date(invoice.invoiceDate).toLocaleDateString(),
                description: `For ${new Date(invoice.employee[0].periodStart).toLocaleDateString()}–${new Date(invoice.employee[0].periodEnd).toLocaleDateString()}`,
                amount: parseFloat(invoice.subTotal).toFixed(2),
                balance: parseFloat(invoice.balance).toFixed(2),
                status: invoice.status,
                details: invoice.employee.map(emp => ({
                    name: emp.name,
                    periodStart: new Date(emp.periodStart).toLocaleDateString(),
                    periodEnd: new Date(emp.periodEnd).toLocaleDateString(),
                    amount: emp.amount,
                })),
            }));

            setInvoices(transformedInvoices);
            setHasUnpaidInvoices(unpaidInvoiceIds.length > 0);
            setShowButton(unpaidInvoiceIds.length > 0);
            return unpaidInvoiceIds; // Return unpaid invoice IDs for use in other functions

        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };


    useEffect(() => {
        fetchInvoices();
    }, []);


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

    // const [selectedCard, setSelectedCard] = useState(cards[0]); // default card select krna
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

    const addNewCard = (newCard) => {
        setCards((prevCards) => [...prevCards, newCard]);
        setSelectedCard(newCard._id);
    };

    // addNewCard(newCard); // Call the function to update the state
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
                const newCard = {
                    cardType: paymentMethod.card.brand,
                    expMonth: paymentMethod.card.exp_month,
                    expYear: paymentMethod.card.exp_year,
                    cardNumber: paymentMethod.card.last4,
                    tokenId: paymentMethod.id,
                };
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
                        console.log('me')
                        setSuccess(true);
                        setTimeout(() => {
                            setshowNewCardModal(false);
                            addNewCard(newCard); // Call the function to update the state
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

                    console.log('Payment1111 Response:', response);

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


    // const PaymentModal = ({ showModal, handleClose }) => {

    //     return (
    //       <Modal show={showModal} onHide={handleClose} centered>
    //         <Modal.Header closeButton>
    //           <Modal.Title>Payment Details</Modal.Title>
    //         </Modal.Header>
    //         <Modal.Body>
    //           <div className="text-left mb-4">
    //             {selectedPlan ? (
    //               <Elements stripe={stripePromise}>
    //                 <div className="payment-container mt-4">
    //                   <p className="mb-4">Complete Your Payment</p>
    //                   <CheckoutForm />
    //                 </div>
    //               </Elements>
    //             ) : (
    //               <p>Please enter your card number to proceed with payment.</p>
    //             )}
    //           </div>
    //         </Modal.Body>
    //       </Modal>
    //     );
    //   };

    // const handleSetDefaultCard = async (cards) => {
    //     const token = localStorage.getItem('token');
    //     const headers = {
    //         Authorization: "Bearer " + token,
    //     };
    //     console.log('default card set', cards);
    //     const DefaultPayApiUrl = "https://myuniversallanguages.com:9093/api/v1";
    //     try {
    //         const response = await axios.post(`${DefaultPayApiUrl}/owner/setDefaultCard 	`, {
    //             cardNumber: cards.cardNumber,
    //             cardType: cards.cardType,
    //         }, { headers });

    //         if (response.data.success) {
    //             console.log('Default card set successfully:', response);
    // enqueueSnackbar("Default card set successfully", {
    //     variant: "success",
    //     anchorOrigin: {
    //         vertical: "top",
    //         horizontal: "right"
    //     }
    // })
    //             setpaycard(cards); // update paycard state
    //             // onActionComplete();
    //         } else {
    //             console.error('Failed to set default card:', response.data.error);

    //         }
    //     } catch (error) {
    //         console.error('Error:', error);

    //     }
    // };
    const NewCardModal = ({ showNewCardModal, handleClose, cards, paycard, setpaycard, onSetDefaultCard }) => {

        const token = localStorage.getItem('token');


        // const [activeTab, setActiveTab] = useState('cardSelection');



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
            // setpaycard(card); // update paycard state
            // console.log('Selected Card Full Info:', card);
        };

        const addNewCard = (newCard) => {
            setCards((prevCards) => [...prevCards, newCard]);
            setSelectedCard(newCard._id); // Optionally select the new card
        };

        return (
            <>
                <div className="text-left mb-4">
                    <div style={{ display: 'flex', marginBottom: '1rem', }}>
                        {/* <button
                            // style={activeTab === 'cardSelection' ? activeTabButtonStyle : tabButtonStyle}
                            // onClick={() => setActiveTab('cardSelection')}
                        >
                            Card Selection
                        </button>

                        <button
                            // style={activeTab === 'payment' ? activeTabButtonStyle : tabButtonStyle}
                            // onClick={() => setActiveTab('payment')}
                        >
                            Add New Card
                        </button> */}

                    </div>

                    <CardSelection
                        cards={cards}
                        selectedCard={selectedCard}
                        onSelect={handleSelectCard}
                        // onAddCard={handleAddCard} // Pass the function to add a new card
                        onAddCard={addNewCard} // Pass the function to add a new card
                        onActionComplete={fetchTokenAndSuspendedStatus}
                        paycard={paycard} // Pass the paycard
                    />
                    {/* <Elements stripe={stripePromise}>
                            <div className="payment-container mt-4">
                                <p className="mb-4">Complete Your Payment</p>
                                <CheckoutForm2 />
                            </div>
                        </Elements> */}

                </div>
                <CustomModal
                    show={showNewCardModal}
                    onClose={handleClose}
                    title="Enter Your New Card"
                >

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
                            <CheckoutForm2 addNewCard={addNewCard} />
                        </div>
                    </Elements>
                    {/* )} */}

                </CustomModal>
            </>
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

    // const handlePayPalClick = () => {
    //     const amount = selectedPlan.costPerUser * TotalUsers;
    //     const paypalUrl = `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_PAYPAL_EMAIL&amount=${amount}&currency_code=USD`;
    //     window.open(paypalUrl, '_blank');
    // };
    const handlePayPalClick = () => {
        setShowPayPal(prevState => !prevState);
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

    // const handlePayWithThisCard = async () => {
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
    //                 enqueueSnackbar("Payment Successfully", {
    //                     variant: "success",
    //                     anchorOrigin: {
    //                         vertical: "top",
    //                         horizontal: "right"
    //                     }
    //                 })
    //                 // setResponseMessage('Payment successful!');
    //                 handleUpdatePaymentStatus('unpaid'); // Update paymentStatus and hasUnpaidInvoices states
    //                 // setInvoice({ status: 'unpaid' }); // Update invoice status to 'paid'
    //                 // setHasUnpaidInvoices(false) // Set hasUnpaidInvoices to false when payment is successful
    //             } else {
    //                 console.error('Payment failed:', response.data.error);
    //                 setResponseMessage('Payment failed: ' + response.data.error);
    //             }
    //         } catch (error) {
    //             console.error('Error:', error);
    //             // setResponseMessage('Error: ' + error.response.data.message);
    //             console.log('Error ka messgae' + error.response.data.message)
    //             enqueueSnackbar(error.response.data.message, {
    //                 variant: "error",
    //                 anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "right"
    //                 }
    //             })

    //         } finally {
    // setIsLoading(false);
    //         }
    //     }
    // };

    // const [buttonText, setButtonText] = useState("Pay with this card");

    // useEffect(() => {
    //     return () => {
    //       setIsLoading(false);
    //     };
    //   }, []);
    const handlePayWithThisCard1 = async (unpaidInvoiceIds) => {
        const DirectPayApiUrl = "https://myuniversallanguages.com:9093/api/v1";

        if (paycard) {
            console.log('Pay with this card:', paycard);
            setIsLoading(true);
            setResponseMessage(null);

            try {
                const response = await axios.post(`${DirectPayApiUrl}/owner/payNowPayPal`, {
                    transactionId: '123',
                    invoiceId: unpaidInvoiceIds
                }, { headers });

                console.log('API Response:', response.data); // Log the entire response data

                // Check for successful response
                if (response.data.status == 200) {
                    const successMessage = response.data.message || "Payment Successful"; // Default success message
                    console.log("Response Payment", successMessage);

                    // Check if the API indicates success
                    if (response.data.status === 200) {
                        // Display success message in snackbar
                        enqueueSnackbar(successMessage, {
                            variant: "success",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right"
                            },
                            onExited: () => {
                                setIsLoading(false); // Set isLoading to false when the snackbar exits
                            }
                        });
                        setResponseMessage(successMessage); // Update response message with success message
                        handleUpdatePaymentStatus('unpaid'); // Update paymentStatus and hasUnpaidInvoices states
                        setInvoice({ status: 'unpaid' }); // Update invoice status to 'paid'
                        setHasUnpaidInvoices(false); // Set hasUnpaidInvoices to false when payment is successful
                    } else {
                        // Handle case where response indicates failure even if status is 200
                        const errorMessage = response.data.message || "Payment failed";
                        enqueueSnackbar(errorMessage, {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right"
                            },
                            onExited: () => {
                                setIsLoading(false); // Set isLoading to false when the snackbar exits
                            }
                        });
                    }
                } else {
                    // Handle unexpected response status
                    // console.error('Unexpected response status:', response.status);
                    enqueueSnackbar('Payment Successfull', {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        },
                        onExited: () => {
                            setIsLoading(false); // Set isLoading to false when the snackbar exits
                        }
                    });
                }
            } catch (error) {
                console.error('Error occurred during payment:', error);
                if (error.response && error.response.data) {
                    if (error.response.status === 400 && error.response.data.success === false) {
                        enqueueSnackbar(error.response.data.message, {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right"
                            },
                            onExited: () => {
                                setIsLoading(false); // Set isLoading to false when the snackbar exits
                            }
                        });
                    } else {
                        // Handle other types of errors
                        enqueueSnackbar('An error occurred. Please try again.', {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right"
                            },
                            onExited: () => {
                                setIsLoading(false); // Set isLoading to false when the snackbar exits
                            }
                        });
                    }
                } else {
                    // Handle cases where there is no response
                    enqueueSnackbar('Network error. Please check your connection.', {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        },
                        onExited: () => {
                            setIsLoading(false); // Set isLoading to false when the snackbar exits
                        }
                    });
                }
            } finally {
                setTimeout(() => {
                    setIsLoading(false); // Set isLoading to false after a delay
                }, 1000); // Wait for 1 second before setting isLoading to false
            }
        }
    };
   
    const handlePayWithThisCard = async (unpaidInvoiceIds) => {
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

                console.log('API Response:', response.data); // Log the entire response data
                const paypalResponse = await axios.post(`${DirectPayApiUrl}/owner/payNowPayPal`, 
                    {
                        transactionId: transactionId,  // Send transactionId directly
                        invoiceId: unpaidInvoiceIds // Send invoiceId as an array
                    },
                    {
                        headers: {
                            ...headers,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log('Second API Response:', paypalResponse.data);
                // Check for successful response
                if (response.data.status == 200) {
                    const successMessage = response.data.message || "Payment Successful"; // Default success message
                    console.log("Response Payment", successMessage);
                    if (paypalResponse.status === 200) {
                        enqueueSnackbar(successMessage, {
                            variant: "success",
                            anchorOrigin: { vertical: "top", horizontal: "right" },
                            onExited: () => setIsLoading(false)
                        });
                        setResponseMessage(successMessage);
                        handleUpdatePaymentStatus('paid');
                        setInvoice({ status: 'paid' });
                        setHasUnpaidInvoices(false);
                    } else {
                        enqueueSnackbar('Payment Successfull' || "PayPal Payment failed", {
                            variant: "error",
                            anchorOrigin: { vertical: "top", horizontal: "right" },
                            onExited: () => setIsLoading(false)
                        });
                    }
                } else {
                    // Handle unexpected response status
                    // console.error('Unexpected response status:', response.status);
                    enqueueSnackbar('Payment Successfull', {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        },
                        onExited: () => {
                            setIsLoading(false); // Set isLoading to false when the snackbar exits
                        }
                    });
                }
                    // Check if the API indicates success
                    if (response.data.status === 200) {
                        // Display success message in snackbar
                        enqueueSnackbar(successMessage, {
                            variant: "success",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right"
                            },
                            onExited: () => {
                                setIsLoading(false); // Set isLoading to false when the snackbar exits
                            }
                        });
                        setResponseMessage(successMessage); // Update response message with success message
                        handleUpdatePaymentStatus('unpaid'); // Update paymentStatus and hasUnpaidInvoices states
                        setInvoice({ status: 'unpaid' }); // Update invoice status to 'paid'
                        setHasUnpaidInvoices(false); // Set hasUnpaidInvoices to false when payment is successful
                    } else {
                        // Handle case where response indicates failure even if status is 200
                        const errorMessage = response.data.message || "Payment failed";
                        enqueueSnackbar(errorMessage, {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right"
                            },
                            onExited: () => {
                                setIsLoading(false); // Set isLoading to false when the snackbar exits
                            }
                        });
                    }
            } catch (error) {
                console.error('Error occurred during payment:', error);
                if (error.response && error.response.data) {
                    if (error.response.status === 400 && error.response.data.success === false) {
                        enqueueSnackbar(error.response.data.message, {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right"
                            },
                            onExited: () => {
                                setIsLoading(false); // Set isLoading to false when the snackbar exits
                            }
                        });
                    } else {
                        // Handle other types of errors
                        enqueueSnackbar('An error occurred. Please try again.', {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right"
                            },
                            onExited: () => {
                                setIsLoading(false); // Set isLoading to false when the snackbar exits
                            }
                        });
                    }
                } else {
                    // Handle cases where there is no response
                    enqueueSnackbar('Payment Successfull', {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        },
                        onExited: () => {
                            setIsLoading(false); // Set isLoading to false when the snackbar exits
                        }
                    });
                }
            } finally {
                setTimeout(() => {
                    setIsLoading(false); // Set isLoading to false after a delay
                }, 1000); // Wait for 1 second before setting isLoading to false
            }
        }
    };
    const handleDirectChangePlan = async () => {
        const DirectPayApiUrl = "https://myuniversallanguages.com:9093/api/v1";
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

    const Withoutcardpayment = ({ showModalwithoutcard, handleCloseModal2, selectedPlan }) => {
        return (
            <Modal show={showModalwithoutcard} onHide={handleCloseModal2} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Change Your Plan</Modal.Title>
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
                            localStorage.setItem('planIdforHome', JSON.stringify(selectedPlan));
                            handleCloseModal2()
                        }}
                    // onClick={handleDirectChangePlan}
                    >Pay Now</button>
                </Modal.Footer>
            </Modal >
        );
    };

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


    const totalbill = selectedPlan?.costPerUser * TotalUsers
    console.log('_____________________', paycard?.cardNumber)
    const Cardetail = paycard?.cardNumber
    localStorage.setItem('billdetail', JSON.stringify(totalbill));
    localStorage.setItem('carddetail', JSON.stringify(Cardetail));


    return (
        <>

            <SnackbarProvider />

            {/* <div className="userHeader">
                    <div>
                        <h5>Paid plan</h5>
                    </div>
                </div> */}
            {/* <h3 className="card-title mb-4">Selected Plan</h3> */}
            {/* <PaymentPlans /> */}

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
            <br />
            {/* <button
                                onClick={
                                    handleShowModal
                                }
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
                            </button> */}
            {!(items?.userType === 'user' || items?.userType === 'manager' || items?.userType === 'admin') && (
                <div className="row d-flex mt-3" style={{ width: '60rem' }}>
                    <div className="col-md-6">
                        <div className='card'>
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
                                {invoice.status === 'unpaid' && paycard && paycard.cardNumber ? (
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
                                        onClick={selectedPlan ? handlePayWithThisCard : null}
                                        disabled={isLoading || !selectedPlan}
                                    >
                                        {isLoading ? "Processing..." : "Pay with this card"}
                                    </button>
                                ) : (
                                    <span></span>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
            <br />
            {!(items?.userType === 'user' || items?.userType === 'manager' || items?.userType === 'admin') && (
                <NewCardModal
                    paycard={paycard}
                    setpaycard={setpaycard}
                    cards={cards}
                    showNewCardModal={showNewCardModal}
                    handleClose={handleCloseNewModal}
                    addNewCard={addNewCard} // Pass the function here
                />
            )}
            {/* <div className="card" style={{ width: '18rem' }}>
                                <div className="card-body">
                                    <h5 className="card-title">Card title</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    {invoice.status === 'unpaid' ? (
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
                                            onClick={selectedPlan ? handlePayWithThisCard : null}
                                            disabled={isLoading || !selectedPlan}
                                        >
                                            {isLoading ? "Processing..." : "Pay with this card"}
                                        </button>
                                    ) : (
                                        <span></span>
                                    )}
                                </div>
                            </div> */}
            {/* <CardSelection
                                cards={cards}
                                selectedCard={selectedCard}
                                onSelect={handleSelectCard}
                                onActionComplete={fetchTokenAndSuspendedStatus}
                            /> */}
            {!(items?.userType === 'user' || items?.userType === 'manager' || items?.userType === 'admin') && (
                <>
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
                                <button
                                    className="mt-2"
                                    onClick={handlePayPalClick}
                                    style={{
                                        display: 'inline-block',
                                        padding: '5px 10px',
                                        backgroundColor: '#FFB730',
                                        // color: '#0070BA',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '1em',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s ease',
                                        // boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    <img
                                        src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                                        alt="PayPal"
                                        style={{ width: '24px', marginRight: '8px' }}
                                    />
                                    PayPal  {/* <PayPalButton amount={amount} /> */}
                                    {showPayPal &&
                                        <PayPalButton amount={amount} />
                                    }
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
                    {/* <PaymentCards /> */}
                    {/* <PaymentModal
                        showModal={showModal}
                        handleClose={handleCloseModal}
                        selectedPlan={selectedPlan}
                    /> */}
                    {/* // )} */}
                </>

            )}
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
            {/* <br /> */}
            {/* <PaymentCards /> */}
            {/* <PaymentPlans /> */}


            <PaymentModal
                showModal={showModal}
                handleClose={handleCloseModal}
                selectedPlan={selectedPlan}
            />

        </>
    );
};


export default Payment;
