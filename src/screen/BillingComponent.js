import React, { useEffect, useState } from "react";
import UserHeader from "./component/userHeader";
import menu from "../images/menu.webp";
import loader from "../images/Rectangle.webp";
import check from "../images/check.webp";
import circle from "../images/circle.webp";
import user from "../images/user-account.webp";
import email from "../images/email.webp";
import passwords from "../images/passwordIcon.webp";
import edit from "../images/editIcon.webp";
import deleteIcon from "../images/deleteIcon.webp";
import line from "../images/line.webp";
import Footer from "./component/footer";
import UserDashboardSection from "./component/userDashboardsection";
import { json, useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import axios from "axios";
import moment from "moment-timezone";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../../src/public/tracking.png';
import paidStamp from '../images/paid.png';
import { Link } from 'react-router-dom'
// import { link}
// import BillingComponent from "./BillingComponent";
import Payment from './payment'





    const BillingComponent = () => {
        const [show, setShow] = useState(false);
        const [deleteAccount, setDeleteAccount] = useState(false);
        const [updatePassword, setUpdatePassword] = useState(false);
        const [currentPassword, setCurrentPassword] = useState("");
        const [newPassword, setNewPassword] = useState("");
        const [newPassword2, setNewPassword2] = useState("");
        const [verify, setVerify] = useState(false);
        const [invoices, setInvoices] = useState([]);
        const [isLoading, setIsLoading] = useState(false);
        const [showWarning, setShowWarning] = useState(false);
        const [activeTab, setActiveTab] = useState('invoices');
        let token = localStorage.getItem('token');
        const navigate = useNavigate('');
        const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
        const items = JSON.parse(localStorage.getItem('items'));
        let headers = {
            Authorization: 'Bearer ' + token,
        }
    
        // const [billing, setBilling] = useState(JSON.parse(localStorage.getItem('billdetail')) || ''); // Default billing balance
        // const [Cardetail, setCardetail] = useState(JSON.parse(localStorage.getItem('carddetail')) || ''); // Default card details
        // const [storedPlanId, setStoredPlanId] = useState(JSON.parse(localStorage.getItem('planId')) || null); // Plan details
      
        // useEffect(() => {
        //     const storedCardDetails = localStorage.getItem('carddetail');

        //     // Retrieve and parse the stored card details
        //     console.log("=============>>>>>>>>>>>>>", storedCardDetails)
        //     if (storedCardDetails) {
        //         try {
        //             const cardDetails = JSON.parse(storedCardDetails);
        //             if (cardDetails) {
        //                 setCardetail(cardDetails); // Get last 4 digits of the card
        //             }
        //         } catch (error) {
        //             console.error('Error parsing card details:', error);
        //         }
        //     } else {
        //         console.log('No card details found in localStorage.');
        //     }
    
        //     // Optionally, retrieve plan details if necessary
        //     const storedPlan = localStorage.getItem('planId');
    
        //     if (storedPlan) {
        //         try {
        //             const planDetails = JSON.parse(storedPlan);
        //             setStoredPlanId(planDetails);
        //         } catch (error) {
        //             console.error('Error parsing plan details:', error);
        //         }
        //     }
    
        //     // Optionally, retrieve billing balance if necessary
        //     const storedBilling = localStorage.getItem('billdetail');
        //     // const [billing, setBilling] = useState(JSON.parse(localStorage.getItem('billdetail')) || ''); // Default billing balance

        //     let price = 0;
    
        //     if (storedBilling === 'Standard') {
        //         price = 3.99;
        //     } else if (storedBilling === 'Premium') {
        //         price = 4.99;
        //     } else {
        //         price = 0; // default to 0 if no plan is selected
        //     }
    
        //     if (storedBilling) {
        //         try {
        //             const billingDetails = JSON.parse(storedBilling);
        //             setBilling(billingDetails); // Assuming the stored data has a `balance` field
        //         } catch (error) {
        //             console.error('Error parsing billing details:', error);
        //         }
        //     }
        //     // const storedCardDetails = localStorage.getItem('carddetail');
        //     console.log("=============>>>>>>>>>>>>>", storedCardDetails)
        //     if (storedCardDetails) {
        //         try {
        //             const cardDetails = JSON.parse(storedCardDetails);
        //             if (cardDetails) {
        //                 setCardetail(cardDetails); // Get last 4 digits of the card
        //             }
        //         } catch (error) {
        //             console.error('Error parsing card details:', error);
        //         }
        //     } else {
        //         console.log('No card details found in localStorage.');
        //     }
    
        //     // Optionally, retrieve plan details if necessary
        //     // const storedPlan = localStorage.getItem('planId');
    
        //     if (storedPlan) {
        //         try {
        //             const planDetails = JSON.parse(storedPlan);
        //             setStoredPlanId(planDetails);
        //         } catch (error) {
        //             console.error('Error parsing plan details:', error);
        //         }
        //     }
    
        //     // Optionally, retrieve billing balance if necessary
        //     // const storedBilling = localStorage.getItem('billdetail');
        //     // let price = 0;
    
        //     if (storedBilling === 'Standard') {
        //         price = 3.99;
        //     } else if (storedBilling === 'Premium') {
        //         price = 4.99;
        //     } else {
        //         price = 0; // default to 0 if no plan is selected
        //     }
        //     if (storedBilling) {
        //         try {
        //             const billingDetails = JSON.parse(storedBilling);
        //             setBilling(billingDetails); // Assuming the stored data has a `balance` field
        //         } catch (error) {
        //             console.error('Error parsing billing details:', error);
        //         }
        //     }
        // }, []);
    
     
        const [billing, setBilling] = useState(''); // Default billing balance
        const [Cardetail, setCardetail] = useState(''); // Default card details
        const [storedPlanId, setStoredPlanId] = useState(null); // Plan details

        useEffect(() => {
            // Retrieve and parse the stored card details
            const storedCardDetails = localStorage.getItem('carddetail');
            console.log("=============>>>>>>>>>>>>>", storedCardDetails)
            if (storedCardDetails) {
                try {
                    const cardDetails = JSON.parse(storedCardDetails);
                    if (cardDetails) {
                        setCardetail(cardDetails); // Get last 4 digits of the card
                    }
                } catch (error) {
                    console.error('Error parsing card details:', error);
                }
            } else {
                console.log('No card details found in localStorage.');
            }

            // Optionally, retrieve plan details if necessary
            const storedPlan = localStorage.getItem('planId');

            if (storedPlan) {
                try {
                    const planDetails = JSON.parse(storedPlan);
                    setStoredPlanId(planDetails);
                } catch (error) {
                    console.error('Error parsing plan details:', error);
                }
            }

            // Optionally, retrieve billing balance if necessary
            const storedBilling = localStorage.getItem('billdetail');
            let price = 0;

            if (storedBilling === 'Standard') {
                price = 3.99;
            } else if (storedBilling === 'Premium') {
                price = 4.99;
            } else {
                price = 0; // default to 0 if no plan is selected
            }

            if (storedBilling) {
                try {
                    const billingDetails = JSON.parse(storedBilling);
                    setBilling(billingDetails); // Assuming the stored data has a `balance` field
                } catch (error) {
                    console.error('Error parsing billing details:', error);
                }
            }
        }, []);
        // useEffect(() => {
        // }, [])


        return (
            <>
                {!(items?.userType === 'user' || items?.userType === 'manager' || items?.userType === 'admin') && (
                    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ color: '#0E4772', fontSize: '20px', fontWeight: '600', marginTop: '50px' }}>{storedPlanId?.planType ? `${storedPlanId?.planType[0].toUpperCase()}${storedPlanId?.planType.slice(1)}` : 'Free'} Plan</h2>
                            <p style={{ margin: '5px 0' }}>
                                Price: <strong>${storedPlanId ? storedPlanId?.costPerUser : 0}/employee/mo</strong>
                            </p>
                            {/* <Link to='/payment' style={{ color: '#007bff', textDecoration: 'none' }}>Change plan</Link> */}
                            <div>
                                <Link to='/team' style={{ color: '#007bff', textDecoration: 'none', marginTop: '10px', display: 'inline-block' }}>
                                    <span role="img" aria-label="employee icon">👥</span> Add or remove employees
                                </Link>
                            </div>
                        </div>
                        {/* <div style={{ paddingTop: '10px' }}>
                            <h2 style={{ color: '#0E4772', fontSize: '20px', fontWeight: '600', marginTop: '50px' }}>Billing</h2>
                            <p style={{ margin: '5px 0' }}>
                                Your balance: <span style={{ color: 'green', fontWeight: 'bold' }}>${billing && storedPlanId ? Math.floor(billing * 100) / 100 : 0}</span>
                            </p>
                            
                            <p style={{ margin: '5px 0' }}>
                                Billing method: <span style={{ marginRight: '5px' }}>💳•••• {Cardetail && storedPlanId ? Cardetail : '****'}</span>
                              
                            </p>
                        </div> */}
                    </div>
                )}
            </>
        );
    };

    const payments = [
        {
            id: 'PAY-001',
            date: '2024-10-01',
            description: 'For 04/06/2024–03/07/2024',
            amount: 150.00,
        },
        {
            id: 'PAY-002',
            date: '2024-09-15',
            description: 'For 04/06/2024–03/07/2024',
            amount: 200.00,
        },
        {
            id: 'PAY-003',
            date: '2024-08-30',
            description: 'For 04/06/2024–03/07/2024',
            amount: 350.00,
        },
        {
            id: 'PAY-004',
            date: '2024-08-05',
            description: 'For 04/06/2024–03/07/2024',
            amount: 450.00,
        },
        {
            id: 'PAY-005',
            date: '2024-07-22',
            description: 'For 04/06/2024–03/07/2024',
            amount: 500.00,
        },
    ];



export default BillingComponent;