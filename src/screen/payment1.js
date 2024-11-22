import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Modal, Button, Form } from 'react-bootstrap';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import CardSelection from './component/CardSelection';
import CustomModal from './component/CustomModal';
// import './Payment.css'; // Import the CSS file for styling
import Account from './account';
const stripePromise = loadStripe('pk_test_51PcoPgRrrKRJyPcXmQ4mWHBaIEBqhR8lWBt3emhk5sBzbPuQDpGfGazHa9SU5RP7XHH2Xlpp4arUsGWcDdk1qQhe00zIasVFrZ');



const Payment = () => {
    const location = useLocation();
    const [plans] = useState(location.state?.plans || []);
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
                // const planUpgradeApiUrl = "https://ss-track-xi.vercel.app/api/v1";
                const planUpgradeApiUrl = "https://ss-track-xi.vercel.app/api/v1";
                try {
                    const response = await axios.post(`${planUpgradeApiUrl}/addNewCard`, {
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
        // const DirectPayApiUrl = "https://ss-track-xi.vercel.app/api/v1";
        const DirectPayApiUrl = "https://ss-track-xi.vercel.app/api/v1";

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




    return (

        <>
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
                                    }}>
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
                                        {/* <span style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            height: '25px',
                                            width: '25px',
                                            backgroundColor: '#7CCB58',
                                            borderRadius: '50%'
                                        }}></span> */}
                                        {/* <span style={{
                                            position: 'absolute',
                                            top: '9px',
                                            left: '9px',
                                            height: '8px',
                                            width: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: selectedPlan?._id === plan._id ? 'white' : 'transparent',
                                            display: selectedPlan?._id === plan._id ? 'block' : 'none'
                                        }}></span> */}
                                        {plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)} - ${plan.costPerUser}/month
                                    </label>
                                    {/* <p className="card-text">{getPlanDescription(plan)}</p> */}
                                </div>
                            </div>
                        ))
                )}
            </div>
                <Account />


        </>


    );
};




export default Payment;
