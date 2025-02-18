// ErrorPopup.js
import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import img from '../../../images/upgrade.jpg';

const ErrorPopup = ({ open, message, onClose }) => {
    const navigate = useNavigate();

    const handleGoToAccount = () => {
        navigate("/account");
        onClose(); // Close popup after navigation
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    borderRadius: '24px',
                    padding: '16px',
                    maxWidth: '500px',
                    textAlign: 'center',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    overflowY: 'hidden' // Prevent vertical scrolling
                }
            }}
        >
            {/* Illustration Section */}
            <DialogContent style={{ padding: 0 }}>
                <div style={{
                    margin: '-32px auto 16px',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    backgroundColor: '#f0fff4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(140, 202, 107, 0.2)'
                }}>
                    <img
                        src={img}
                        alt="Upgrade Illustration"
                        style={{ 
                            width: '140px', 
                            height: '140px',
                            objectFit: 'contain'
                        }}
                    />
                </div>
            </DialogContent>

            {/* Text Content */}
            <div style={{ padding: '0 24px' }}>
                <DialogTitle style={{
                    padding: 0,
                    marginBottom: '12px',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: '#2f5d0a',
                }}>
                    Unlock Premium Features
                </DialogTitle>

                <DialogContent style={{
                    padding: 0,
                    marginBottom: '24px',
                    fontSize: '1rem',
                    color: '#5a5a5a',
                    lineHeight: 1.6
                }}>
                    <Typography variant="body2" style={{ marginBottom: '8px' }}>
                        Your current plan limits access to advanced features.
                    </Typography>
                    <Typography variant="body2">
                        Upgrade now to manage budgets, campaigns, and values through our Recognition Module.
                    </Typography>
                </DialogContent>
            </div>

            {/* Upgrade Section */}
            <div style={{
                backgroundColor: '#f8fff3',
                borderRadius: '16px',
                padding: '24px',
                margin: '16px 24px',
                border: '1px solid #e4f5d7'
            }}>
                <Button
                    fullWidth
                    onClick={handleGoToAccount}
                    variant="contained"
                    sx={{
                        py: 1.5,
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        textTransform: 'none',
                        backgroundColor: '#8CCA6B',
                        '&:hover': {
                            backgroundColor: '#7bb357',
                            boxShadow: '0 4px 12px rgba(140, 202, 107, 0.4)'
                        },
                        transition: 'all 0.2s ease'
                    }}
                >
                    Upgrade Plan - $99/month
                </Button>

                <Typography variant="caption" display="block" sx={{
                    mt: 1.5,
                    color: '#7a7a7a',
                    fontSize: '0.75rem'
                }}>
                    Includes 14-day money back guarantee
                </Typography>
            </div>

            {/* Close Action */}
            <DialogActions sx={{ justifyContent: 'center', py: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: '#7a7a7a',
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                    }}
                >
                    Maybe Later
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ErrorPopup;