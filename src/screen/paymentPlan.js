import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Modal } from 'react-bootstrap';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import CustomModal from './component/CustomModal';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';

const stripePromise = loadStripe('pk_test_51PvKZy04DfRmMVhLfSwskHpqnq7CRiBA28dvixlIB65W0DnpIZ9QViPT2qgAbNyaf0t0zV3MLCUy9tlJHF1KyQpr00BqjmUrQw');

const Payment = ({ updatePaymentStatus }) => {
    const location = useLocation();
    const [plans, setPlans] = useState(location.state?.plans || []);
    const [fetchError] = useState(location.state?.fetchError || null);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [TotalUsers, setTotalUsers] = useState(0);
    const [cards, setCards] = useState([]);
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (plans.length > 0) {
            setSelectedPlan(plans[0]); // Set the first plan as the default selected plan
        }
    }, [plans]);

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

    const getData = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/owner/companies`, { headers });
            setTotalUsers(response?.data?.count);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [headers]);

    useEffect(() => {
        getData();
    }, [getData]);

    const CheckoutForm = () => {
        const stripe = useStripe();
        const elements = useElements();
        const [error, setError] = useState(null);
        const [success, setSuccess] = useState(false);
        const [loading, setLoading] = useState(false);

        const handleSubmit = async (event) => {
            event.preventDefault();
            setLoading(true);

            if (!stripe || !elements) {
                setError('Stripe has not loaded correctly.');
                setLoading(false);
                return;
            }

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                try {
                    const response = await axios.post(`${apiUrl}/owner/upgrade`, {
                        cardType: paymentMethod.card.brand,
                        expMonth: paymentMethod.card.exp_month,
                        expYear: paymentMethod.card.exp_year,
                        cardNumber: paymentMethod.card.last4,
                        tokenId: paymentMethod.id,
                        planId: selectedPlan._id,
                    }, { headers });

                    if (response.data.success) {
                        setSuccess(true);
                        setTimeout(() => {
                            setShowModal(false);
                        }, 1000); // Close the modal after 1 second
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
                    {loading ? 'Upgrading...' : 'Pay'}
                </button>
            </form>
        );
    };

    const PaymentModal = ({ showModal, handleClose }) => {
        return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Payment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-left mb-4">
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

const handleShowModal = () => {
    setShowModal(true);
};

const handleCloseModal = () => {
    setShowModal(false);
};

const fetchPlans = async () => {
    try {
        const response = await axios.get(`${apiUrl}/owner/getPlans`);
        const plans = response.data.data;
        setPlans(plans);
        setSelectedPlan(plans[0]); // Set the first plan as the default selected plan
        setLoading(false);
    } catch (error) {
        console.error('Error fetching plans:', error);
        setLoading(false);
    }
};

useEffect(() => {
    fetchPlans();
}, []);

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
                    plans.map((plan, index) => (
                        <div className={`col-6 ${index % 2 === 0 ? '' : 'pl-2'}`} style={{ marginBottom: '10px' }} key={plan._id}>
                            <div className='card'>
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
                                        width: '100%',
                                        height: '100%',
                                    }}>
                                        <input
                                            type="radio"
                                            id={plan._id}
                                            name="plan"
                                            value={plan?.planType}
                                            checked={selectedPlan?._id === plan?._id}
                                            onChange={() => setSelectedPlan(plan)}
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
                                            backgroundColor: selectedPlan?._id === plan._id ? '#4CAF50' : '#0070BA',
                                            borderRadius: '50%',
                                            transition: 'background-color 0.3s'
                                        }}></span>
                                        <span style={{
                                            position: 'absolute',
                                            top: '9px',
                                            left: '9px',
                                            height: '8px',
                                            width: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: selectedPlan?._id === plan._id ? 'white' : 'transparent',
                                            display: selectedPlan?._id === plan._id ? 'block' : 'none'
                                        }}></span>
                                        <div style={{ marginLeft: '10px' }}>
                                            {plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)} - ${plan.costPerUser }/month
                                            <button style={{
                                                marginLeft: '10px',
                                                padding: '5px 10px',
                                                backgroundColor: 'green',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem'
                                            }}
                                                onClick={handleShowModal}
                                            >
                                                Upgrade
                                            </button>
                                            <p className="card-text" style={{ fontSize: '1rem' }}>
                                                {`${plan.description}`} {/* Assuming there's a description field */}
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        <PaymentModal
            showModal={showModal}
            handleClose={handleCloseModal}
            selectedPlan={selectedPlan}
        />
    </>
);
};
