import React, { useCallback, useEffect, useState } from 'react';



const PayPalButton = ({ amount }) => {
    useEffect(() => {
        // Load the PayPal SDK script
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=AbjWITfwZjHD0s6nwfnGmZFpRKnhKLet_QEaADR6xkZ4LiBjI2niy3U6sHRvYi6zCKgaCA4H4RX3mIPh&currency=USD&disable-funding=credit,card`;

        script.async = true;

        // Append the script to the document
        document.body.appendChild(script);

        script.onload = () => {
            // Initialize the PayPal button once the script is loaded
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: amount, // Pass the amount for the transaction
                            },
                        }],
                    });
                },

                onApprove: (data, actions) => {
                return actions.order.capture().then(details => {
                    console.log("Transaction completed by:", details.payer.name.given_name);
                    const payeeObject = details.purchase_units[0].payee;
                    console.log("Capture details", payeeObject); // Log the payee object
            
                    alert('Transaction completed by ' + details.payer.name.given_name);
                });
            },
                onError: (err) => {
                    console.error('PayPal Checkout onError', err);
                },
            }).render('#paypal-button-container'); // Render the PayPal button
};

// Cleanup function to remove the script when the component unmounts
return () => {
    document.body.removeChild(script);
};
    }, [amount]); // Re-run effect if amount changes

return <div id="paypal-button-container" style={{ width: '40%' }}></div>; // Render container for PayPal button
};


export default PayPalButton;