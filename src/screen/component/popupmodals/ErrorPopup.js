// ErrorPopup.js
import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import img from '../../../images/upgrade.jpg'
// to navigate to /account

const ErrorPopup = ({ open, message, onClose }) => {
    const navigate = useNavigate();

    // Navigate to /account when the user clicks the link
    const handleGoToAccount = () => {
        navigate("/account");
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    borderRadius: '16px',
                    padding: '24px',
                    maxWidth: '650px',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }
            }}
        >
            {/* Top Illustration */}
            <DialogContent style={{ padding: 0 }}>
                <div style={{ marginBottom: '16px' }}>
                    <img
                        src={img}
                        alt="Upgrade Illustration"
                        style={{ width: '150px', height: '150px' }}
                    />
                </div>
            </DialogContent>

            {/* Title */}
            <DialogTitle style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#8CCA6B',
                marginBottom: '8px'
            }}>
                Upgrade your Plan
            </DialogTitle>

            {/* Description */}
            <DialogContent style={{
                margin: '0 20px 24px',
                fontSize: '1rem',
                color: '#555',
                lineHeight: '1.6'
            }}>
                <p>Please upgrade your plan to get access to the Recognition Module to manage budget, campaigns, and values.</p>
            </DialogContent>

            {/* Price and Button */}
            <div style={{
                background: '#F8F9FB',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px'
            }}>
                <p style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    margin: '0 0 12px',
                    color: '#8CCA6B'
                }}>
                click below to upgrade
                </p>
                <Button
                    onClick={handleGoToAccount}
                    style={{
                        backgroundColor: '#8CCA6B',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        width: '100%',
                        textTransform: 'none'
                    }}
                >
                    Upgrade Now
                </Button>
            </div>

            {/* Close Button */}
            <DialogActions style={{ justifyContent: 'center' }}>
                <Button
                    onClick={onClose}
                    style={{
                        color: '#555',
                        textTransform: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>


    );
};

export default ErrorPopup;
