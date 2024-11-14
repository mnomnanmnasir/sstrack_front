import React, { useCallback, useEffect, useState } from 'react';



const PayPalButton = ({ setMerchantId, selectedPlan }) => {

    const amount = selectedPlan?.costPerUser; // Dynamically set amount based on selectedPlan
    useEffect(() => {
        // Load the PayPal SDK script
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=AbjWITfwZjHD0s6nwfnGmZFpRKnhKLet_QEaADR6xkZ4LiBjI2niy3U6sHRvYi6zCKgaCA4H4RX3mIPh&currency=USD&disable-funding=credit,card`;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: { value: amount?.toString() }, // Use dynamic amount here
                        }],
                    });
                },

                onApprove: async (data, actions) => {
                    return actions.order.capture().then(async details => {
                        console.log("Transaction completed by:", details.payer.name.given_name);
                        const transactionId = details.purchase_units[0].payments.captures[0].id;
                        setMerchantId(transactionId);

                        const requestData = {
                            planId: selectedPlan?._id,
                            transactionId: transactionId
                        };
                        console.log("Sending API request with:", requestData);

                        if (!requestData.planId || !requestData.transactionId) {
                            alert("Missing required parameters: planId or transactionId.");
                            return;
                        }

                        try {
                            // Retrieve the token from localStorage
                            const token = localStorage.getItem('token');

                            const res = await axios.post("https://myuniversallanguages.com:9093/api/v1/owner/upgradePayPal", requestData, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}` // Send the token in the headers
                                }
                            });
                            console.log('API Response:', res.data);
                            if (res.status === 200) {
                                alert("Payment processed successfully!");
                            } else {
                                alert("Error: " + (res.data.message || 'Unknown error.'));
                            }
                        } catch (error) {
                            console.error('API Error:', error);
                            alert("An error occurred while processing the payment.");
                        }
                    });
                },

                onError: (err) => {
                    console.error('PayPal Checkout onError', err);
                    alert("An error occurred with PayPal. Please try again.");
                },
            }).render('#paypal-button-container');
        };
        return () => {
            document.body.removeChild(script);
        };
    }, [amount, selectedPlan]);

    return <div id="paypal-button-container" style={{ width: '200px', margin: '0 auto' }}></div>; // Set desired width
};

export default PayPalButton;