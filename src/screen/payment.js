import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Modal, Button, Form } from 'react-bootstrap';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import CardSelection from './component/CardSelection';
import CustomModal from './component/CustomModal';
// import './Payment.css'; // Import the CSS file for styling
import PaymentCards from './paymentCards'
import PaymentPlans from './paymentPlan'
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
            const res = await fetch(`${apiUrl}/owner/getInvoice`, {
                headers,
            });
            const data = await res.json();
            console.log('invoices', data);

            console.log("Invoices ka data agya", data.data.invoiceInfo.map(invoice => invoice.invoiceNumber));


            // Transform the API data to the desired structure
            const transformedInvoices = data.data.invoiceInfo.map((invoice) => {
                // Log the status of each invoice
                console.log('Invoice status:', invoice.status);
                // console.log("Invoices ka data agya main", data.data.invoiceInfo.invpinvoiceNumber)

                data.data.invoiceInfo.forEach((invoice, index) => {
                    console.log(`Invoice ${index + 1} Number:`, invoice.invoiceNumber);
                });

                return {
                    id: invoice.invoiceNumber,
                    date: new Date(invoice.invoiceDate).toLocaleDateString(),
                    description: `For ${new Date(invoice.employee[0].periodStart).toLocaleDateString()}–${new Date(
                        invoice.employee[0].periodEnd
                    ).toLocaleDateString()}`,
                    amount: parseFloat(invoice.subTotal).toFixed(2),
                    balance: parseFloat(invoice.balance).toFixed(2),
                    status: (invoice.status),
                    details: invoice.employee.map(emp => ({
                        name: emp.name,
                        periodStart: new Date(emp.periodStart).toLocaleDateString(),
                        periodEnd: new Date(emp.periodEnd).toLocaleDateString(),
                        amount: emp.amount,
                    })),
                };
            });

            // if (Array.isArray(data.data.invoiceInfo)) {
            //     // Get all invoiceNumbers as an array and log them
            //     const invoiceNumbers = data.data.invoiceInfo.map(invoice => invoice.invoiceNumber);
            //     console.log("Invoice Numbers:", invoiceNumbers); // Log all invoice numbers

            //     // Transform the API data to the desired structure
            //     const transformedInvoices = data.data.invoiceInfo.map((invoice) => {
            //         // Log the status of each invoice
            //         console.log('Invoice status:', invoice.status);

            //         return {
            //             id: invoice.invoiceNumber, // Correcting the reference to use the current invoice
            //             date: new Date(invoice.invoiceDate).toLocaleDateString(),
            //             description: `For ${new Date(invoice.employee[0].periodStart).toLocaleDateString()}–${new Date(
            //                 invoice.employee[0].periodEnd
            //             ).toLocaleDateString()}`,
            //             amount: parseFloat(invoice.subTotal).toFixed(2),
            //             balance: parseFloat(invoice.balance).toFixed(2),
            //             status: invoice.status,
            //             details: invoice.employee.map(emp => ({
            //                 name: emp.name,
            //                 periodStart: new Date(emp.periodStart).toLocaleDateString(),
            //                 periodEnd: new Date(emp.periodEnd).toLocaleDateString(),
            //                 amount: emp.amount,
            //             })),
            //         };
            //     });

            setHasUnpaidInvoices(hasUnpaidInvoice); // Set hasUnpaidInvoices state
            setInvoices(transformedInvoices);
            // Check if there is any unpaid invoice
            const hasUnpaidInvoice = transformedInvoices.some(invoice => invoice.status === 'unpaid');
            setShowButton(hasUnpaidInvoice);
        } catch (error) {
            console.error('Error fetching invoices:!!!!!!!!!!!!!!!!', error);
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
                        handleCloseModal(); // call handleClose function to close the modal
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
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Body>
                    <form onSubmit={handleSubmit} className="payment-form">
                        <CardElement className="card-element" />
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">Card Added successful!</div>}
                        <button type="submit" disabled={!stripe || loading} className="submit-button">
                            {loading ? 'Adding...' : 'Add Card'}
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
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

        const [showAnotherModal, setShowAnotherModal] = useState(false);
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: "Bearer " + token,
        };
        const [upgradeResponse, setUpgradeResponse] = useState(null);


        // const handleOkClick = async () => {
        //     handleClose(); // Add this line to close the modal
        //     setShowAnotherModal(false);

        //     try {
        //         const response = await axios.post(`https://myuniversallanguages.com:9093/api/v1/owner/upgrade`, {
        //             cardType: paycard.cardType,
        //             expMonth: paycard.expMonth,
        //             expYear: paycard.expYear,
        //             cardNumber: paycard.cardNumber,
        //             TotalAmount: '58.88',
        //             dueDate: '2024-07-30',
        //             planId: selectedPlan._id,
        //         }, { headers });

        //         console.log('upgrade repsonose:', cardType);

        //         if (response.data.success) {
        // enqueueSnackbar("Payment Successfully", {
        //     variant: "success",
        //     anchorOrigin: {
        //         vertical: "top",
        //         horizontal: "right"
        //     }
        // })
        //         } else {
        //             enqueueSnackbar(`Payment failed: ${response.data.message}`, {
        //                 variant: "error",
        //                 anchorOrigin: {
        //                     vertical: "top",
        //                     horizontal: "right"
        //                 }
        //             })
        //         }
        //     } catch (error) {
        //         enqueueSnackbar(`Payment failed: ${error.response ? error.response.data.message : error.message}`, {
        //             variant: "error",
        //             anchorOrigin: {
        //                 vertical: "top",
        //                 horizontal: "right"
        //             }
        //         })
        //     }
        // };

        const [error, setError] = useState(null); // Define the error variable
        const [success, setSuccess] = useState(false);

        const handleOkClick = async (event) => {
            event.preventDefault();
            setLoading(true);

            try {
                const response = await axios.post(`https://myuniversallanguages.com:9093/api/v1/owner/upgrade`, {
                    cardType: paycard.cardType,
                    expMonth: paycard.expMonth,
                    expYear: paycard.expYear,
                    cardNumber: paycard.cardNumber,
                    TotalAmount: '58.88',
                    dueDate: '2024-07-30',
                    planId: selectedPlan._id,
                }, { headers });

                console.log('Payment ka reponse:', response);

                if (response.data.success) {
                    setSuccess(true);
                } else {
                    setError(`Payment failed: ${response.data.message}`);
                }
            } catch (error) {
                setError(`Payment failed: ${error.response ? error.response.data.message : error.message}`);
            }
            setLoading(false);
        };

        return (
            <div>
                <Modal show={showModal && (!paycard || !paycard.cardNumber)} onHide={handleClose} centered>
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
                <Modal show={showModal && paycard && paycard.cardNumber} onHide={() => setShowAnotherModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Payment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>are sure you want to change plan?</p>
                        {upgradeResponse && (
                            <div>
                                <h5>Upgrade Response:</h5>
                                <pre>{JSON.stringify(upgradeResponse, null, 2)}</pre>
                            </div>
                        )}
                        <form onSubmit={handleOkClick} className="payment-form">
                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">Payment successful!</div>}
                            <button type="submit" disabled={loading} className="submit-button">
                                {loading ? 'Processing...' : 'Pay'}
                            </button>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
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


        return (
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
                    onActionComplete={fetchTokenAndSuspendedStatus}
                // setpaycard={setpaycard} // add this prop
                />
                {/* <Elements stripe={stripePromise}>
                        <div className="payment-container mt-4">
                            <p className="mb-4">Complete Your Payment</p>
                            <CheckoutForm2 />
                        </div>
                    </Elements> */}

            </div>

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

    const handlePayWithThisCard = async () => {
        const DirectPayApiUrl = "https://myuniversallanguages.com:9093/api/v1";
        if (paycard) {
            console.log('Pay with this card:', paycard);
            setIsLoading(true);
            setResponseMessage(null);
            // setButtonText("Processing...");
            try {
                // setIsLoading(true);
                const response = await axios.post(`${DirectPayApiUrl}/owner/payNow`, {
                    cardNumber: paycard.cardNumber,
                    expMonth: paycard.expMonth,
                    expYear: paycard.expYear,
                    tokenId: paycard.tokenId,
                    cardType: paycard.cardType,
                }, { headers });
                 
                if (response.data.success === 200) {
                    console.log('Payment successful:', response.data.success);
                    setResponseMessage('Payment successful!');
                    handleUpdatePaymentStatus('unpaid'); // Update paymentStatus and hasUnpaidInvoices states
                    // setInvoice({ status: 'unpaid' }); // Update invoice status to 'paid'
                    setHasUnpaidInvoices(false) // Set hasUnpaidInvoices to false when payment is successful
                    enqueueSnackbar("Payment Successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                } 
                else {
                    console.error('Payment failed:', response.data.error);
                    enqueueSnackbar('Payment failed: ' + response.data.error, {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                }
                // if (res.status === 200) {
                //     enqueueSnackbar("Payment Successfully", {
                //         variant: "success",
                //         anchorOrigin: {
                //             vertical: "top",
                //             horizontal: "right"
                //         }
                //     })
                // }
                // else {
                //     if (res.status === 403) {
                //         alert("Access denied. Please check your permissions.")
                //     } else if (res.data.success === false) {
                //         alert(res.data.message)
                //     }
                // }
            } catch (error) {
                if (error.response && error.response.data) {
                    if (error.response.status === 400 && error.response.data.success === false) {
                        // alert(error.response.data.message)
                        enqueueSnackbar(error.response.data.message, {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right"
                            },
                            onExited: () => {
                                setIsLoading(false); // Add this line to set isLoading to false
                            }
                        })
                        // console.log('Erorr agya', error.response.data.message)
                        // alert(error.response.data.message)
                    }
                }
            }
            finally {
                setTimeout(() => {
                    setIsLoading(false); // Add this line to set isLoading to false
                }, 1000); // Wait for 2 seconds before setting isLoading to false
            }
            // finally {
            //     // setIsLoading(false); // Add this line to set isLoading to false
            //     if (error.response.data.message) {
            //         enqueueSnackbar(error.response.data.message, {
            //             variant: "error",
            //             anchorOrigin: {
            //                 vertical: "top",
            //                 horizontal: "right"
            //             }
            //         })
            //     }
            // }
            // setIsLoading(false);
            // finally {
            //     setIsLoading(false); // Add this line to set isLoading to false
            //   }
            // finally {

            //     if (error.response && error.response.data) {
            //         if (error.response.status === 400 && error.response.data.success === false) {
            //             // alert(error.response.data.message)
            //             setIsLoading(false);
            //             enqueueSnackbar(error.response.data.message, {
            //                 variant: "error",
            //                 anchorOrigin: {
            //                     vertical: "top",
            //                     horizontal: "right"
            //                 }
            //             })


            //             // console.log('Erorr agya', error.response.data.message)
            //             // alert(error.response.data.message)
            //         }
            //     }
            // }
            // setIsLoading(false);
            // setTimeout(() => {
            //     enqueueSnackbar(error.response.data.message, {
            //         variant: "error",
            //         anchorOrigin: {
            //             vertical: "top",
            //             horizontal: "right"
            //         }
            //     })
            // }, 100)

            // setIsLoading(false);
        }

    };

    const totalbill = selectedPlan?.costPerUser * TotalUsers
    console.log('_____________________', paycard?.cardNumber)
    const Cardetail = paycard?.cardNumber
    localStorage.setItem('billdetail', JSON.stringify(totalbill));
    localStorage.setItem('carddetail', JSON.stringify(Cardetail));


    return (

        <div>
            <SnackbarProvider />
            <div className="container">
                <div className="userHeader">
                    <div>
                        <h5>Paid plan</h5>
                    </div>
                </div>
                <div className="mainwrapper">
                    <div className="ownerTeamContainer">
                        <h3 className="card-title mb-4">Selected Plan</h3>
                        <PaymentPlans />
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
                        <div className='container d-flex'>
                            <div className="row d-flex" style={{ width: '60rem' }}>
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
                        </div>
                        <br />
                        <NewCardModal
                            paycard={paycard}
                            setpaycard={setpaycard}
                            cards={cards}
                        />
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
                        <PaymentCards />
                        {/* <PaymentPlans /> */}
                    </div>
                </div>
                <PaymentModal
                    showModal={showModal}
                    handleClose={handleCloseModal}
                    selectedPlan={selectedPlan}
                />
            </div>

        </div >
    );
};


export default Payment;
