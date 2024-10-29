import React, { useCallback, useEffect, useState } from 'react';
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
import { loadStripe } from '@stripe/stripe-js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../../src/public/tracking.png';
import paidStamp from '../images/paid.png';
import { Link } from 'react-router-dom'
// import { link}
import BillingComponent from "./BillingComponent";
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Payment from './payment'
import CardSelection from './component/CardSelection';
import { useLocation } from 'react-router-dom';
import CustomModal from './component/CustomModal'

const stripePromise = loadStripe('pk_test_51PvKZy04DfRmMVhLfSwskHpqnq7CRiBA28dvixlIB65W0DnpIZ9QViPT2qgAbNyaf0t0zV3MLCUy9tlJHF1KyQpr00BqjmUrQw');


function Account({ suspended }) {

    const [responseMessage, setResponseMessage] = useState(null);
    const location = useLocation();
    const [plans, setPlans] = useState(location.state?.plans || []);
    const [show, setShow] = useState(false);
    const [deleteAccount, setDeleteAccount] = useState(false);
    const [updatePassword, setUpdatePassword] = useState(false);
    const [fetchError] = useState(location.state?.fetchError || null);
    const [currentPassword, setCurrentPassword] = useState("")
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState([]);
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [verify, setVerify] = useState(false);
    const [showModalwithoutcard, setShowModalwithoutcard] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [defaultPlanIndex] = useState(location.state?.defaultPlanIndex || 0);
    const [showNewCardModal, setshowNewCardModal] = useState(false);
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
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [TotalUsers, setTotalUsers] = useState(0);
    const [paycard, setpaycard] = useState();

    console.log('usercompany==============', items);
    const storedPlanId = JSON.parse(localStorage.getItem('planId'))
    // const premiumPlan = plans.find((plan) => plan.planType === 'premium');

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

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };




    const getBase64Image = (imgUrl, callback) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            callback(dataURL, img.width, img.height);
        };
        img.src = imgUrl;
    };

    const costPerUser = storedPlanId?.costPerUser || 0;  // Use storedPlanId's costPerUser or 0 as a fallback
    const getPlanDescription = (plan) => {
        return `$${plan.costPerUser} per month per user, up to ${plan.screenshotsPerHr} screenshots per hour, screenshots kept ${plan.ssStored} days, individual settings, activity level tracking, ${plan.mobileApp ? 'mobile app included' : 'no mobile app'}, app & URL tracking`;
    };
    // Create the plandetail string
    const plandetail = `${costPerUser}/employee/mo`;

    //pdf generation
    const generatePDF = (invoice) => {
        getBase64Image(logo, (logoBase64, logoWidth, logoHeight) => {
            getBase64Image(paidStamp, (paidStampBase64, paidStampWidth, paidStampHeight) => {
                const doc = new jsPDF('p', 'pt', 'a4');
                const width = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const margin = 40;


                // Helper function to add a new page
                const addNewPage = () => {
                    doc.addPage();
                    y = margin; // Reset Y position for new page
                };

                // Define helper function to check if content exceeds the page height
                const checkContentOverflow = (currentY) => {
                    if (currentY > pageHeight - margin) {
                        console.log('Content exceeding page height. Adding new page...');
                        addNewPage();
                        return true;
                    }
                    return false;
                };
                // Define the maximum width and height for the logo image
                const maxLogoWidth = 100;
                const maxLogoHeight = 50;

                // Calculate the new width and height while maintaining the aspect ratio
                if (logoWidth > maxLogoWidth || logoHeight > maxLogoHeight) {
                    const aspectRatio = logoWidth / logoHeight;
                    if (logoWidth > maxLogoWidth) {
                        logoWidth = maxLogoWidth;
                        logoHeight = maxLogoWidth / aspectRatio;
                    }
                    if (logoHeight > maxLogoHeight) {
                        logoHeight = maxLogoHeight;
                        logoWidth = maxLogoHeight * aspectRatio;
                    }
                }

                // Define the header height and draw the header with line
                const headerHeight = 60;
                const headerY = 20;
                const logoX = 40;
                const companyDetailsX = logoX + logoWidth + 20; // Position company details to the right of the logo
                const rightMargin = 40; // Margin from the right

                // Add the header line (adjusted to move up)
                doc.setLineWidth(5);
                doc.setDrawColor(211, 211, 211);
                const headerLineY = headerY + headerHeight; // Adjust this value to move the line up
                doc.line(40, headerLineY, width - 40, headerLineY);

                // Add the logo
                doc.addImage(logoBase64, 'PNG', logoX, headerY, logoWidth, logoHeight);

                // Add company details to the right of the logo
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('I8IS', companyDetailsX, headerY + 5); // Align with top of logo
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('SSTRACK', companyDetailsX, headerY + 20); // Align with top of logo
                doc.text('4370 Steeles Avenue West', companyDetailsX, headerY + 35); // New address line 1
                doc.text('Unit 204 Vaughan ON L4L 4Y4', companyDetailsX, headerY + 50); // New address line 2


                // Move up and add margin from the right for invoice details
                const invoiceDetailsY = headerY + 90; // Move up as needed
                const invoiceDetailsX = width - rightMargin - 200; // Adjust for right margin

                // Hardcoded plan variable for testing
                let plan = 'professional'; // Options: 'professional', 'standard', 'free'
                // Determine the plan details based on the hardcoded plan
                // let plandetail = ''
                // let planText = ''; // Initialize plan text
                // if (plan === 'professional') {
                //     planText = 'Professional Plan:';
                //     plandetail = '$6.99/employee/mo';
                // } else if (plan === 'standard') {
                //     planText = 'Standard Plan:';
                //     plandetail = '$3.99/employee/mo';
                // }


                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text('Invoice no.:', invoiceDetailsX, invoiceDetailsY);
                doc.text('Invoice date:', invoiceDetailsX, invoiceDetailsY + 15);
                doc.text('Balance:', invoiceDetailsX, invoiceDetailsY + 30);
                doc.text('Billing period:', invoiceDetailsX, invoiceDetailsY + 45);
                doc.text(storedPlanId?.planType, invoiceDetailsX, invoiceDetailsY + 60);

                doc.setFont('helvetica', 'normal');
                doc.text(invoice.id, width - rightMargin - 100, invoiceDetailsY);
                doc.text(invoice.date, width - rightMargin - 100, invoiceDetailsY + 15);
                doc.text('$' + invoice.balance, width - rightMargin - 100, invoiceDetailsY + 30);
                doc.text(invoice.description.split(' ')[1], width - rightMargin - 100, invoiceDetailsY + 45);
                doc.text(plandetail, width - rightMargin - 100, invoiceDetailsY + 60);


                // Add customer details on the left side
                const customerDetailsY = invoiceDetailsY; // Use the same top margin as invoice details
                const customerDetailsX = 40; // Left margin

                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('Customer:', customerDetailsX, customerDetailsY);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(items.company, customerDetailsX, customerDetailsY + 15);
                doc.text(items.name, customerDetailsX, customerDetailsY + 30);
                doc.text(items.email, customerDetailsX, customerDetailsY + 45);
                doc.text('Canada', customerDetailsX, customerDetailsY + 60);

                // Add PAID stamp if paid
                if (invoice.status === 'paid') {
                    // Define the maximum width and height for the PAID stamp image
                    const maxPaidStampWidth = 250;  // Maximum width
                    const maxPaidStampHeight = 125;  // Maximum height

                    // Calculate the aspect ratio for the PAID stamp
                    const paidStampAspectRatio = paidStampWidth / paidStampHeight;

                    // Adjust the width and height while maintaining the aspect ratio
                    if (paidStampWidth > maxPaidStampWidth || paidStampHeight > maxPaidStampHeight) {
                        if (paidStampWidth > maxPaidStampWidth) {
                            paidStampWidth = maxPaidStampWidth;
                            paidStampHeight = maxPaidStampWidth / paidStampAspectRatio;
                        }
                        if (paidStampHeight > maxPaidStampHeight) {
                            paidStampHeight = maxPaidStampHeight;
                            paidStampWidth = maxPaidStampHeight * paidStampAspectRatio;
                        }
                    }

                    const paidStampX = width / 2.5 - paidStampWidth / 2.5; // Center the PAID stamp
                    const paidStampY = 140 - paidStampHeight / 2;      // Adjust Y position
                    doc.addImage(paidStampBase64, 'PNG', paidStampX, paidStampY, paidStampWidth, paidStampHeight);
                }

                // Add Invoice Details
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('Invoice #' + invoice.id, 40, 210);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');

                doc.setFont('helvetica', 'bold');
                doc.text('Item', 40, 230);
                doc.text('Service', 120, 230);
                doc.text('Amount', width - 100, 230);

                let y = 237; // Starting Y position for the table

                invoice.details.forEach((item, index) => {
                    y += 5; // Move down to the next row

                    // Check if content exceeds page
                    if (checkContentOverflow(y)) return;

                    // Draw the top border
                    doc.setLineWidth(0.5);

                    y += 7; // Move down to draw the text
                    doc.setFont('helvetica', 'normal');
                    doc.text(String(index + 1), 40, y);
                    doc.setFont('helvetica', 'normal');
                    doc.text(item.name, 120, y);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(128, 128, 128);
                    doc.text(' ' + item.periodStart + ' - ' + item.periodEnd, 120 + doc.getTextWidth(item.name) + 5, y); // Adjust position based on bold text width
                    // Reset text color back to black after the gray text
                    doc.setTextColor(0, 0, 0);
                    const amount = Number(item.amount); // Ensure item.amount is a number
                    doc.text('$' + amount.toFixed(2), width - 100, y);

                    y += 7; // Move down to draw the bottom border

                    // Check if content exceeds page before drawing bottom border
                    if (checkContentOverflow(y)) return;
                    doc.line(40, y, width - 40, y); // Draw the bottom border
                });

                // Add total amount row
                const subTotal = Number(invoice.balance);
                const salesTax = 0;
                const totalAmount = subTotal + salesTax;

                // Add SubTotal
                y += 20;
                if (!checkContentOverflow(y)) {
                    doc.setFont('helvetica', 'bold');
                    doc.text('SubTotal', 120, y);
                    doc.setFont('helvetica', 'normal');
                    doc.text('$' + ' ' + subTotal.toFixed(2), width - 100, y);
                }

                // Add Sales Tax (VAT)
                y += 20;
                if (!checkContentOverflow(y)) {
                    doc.setFont('helvetica', 'bold');
                    doc.text('Sales Tax (VAT)', 120, y);
                    doc.setFont('helvetica', 'normal');
                    doc.text('$' + ' ' + salesTax.toFixed(2), width - 100, y);
                }

                // Add total amount row with upper and lower border
                y += 20;
                if (!checkContentOverflow(y)) {
                    doc.setFont('helvetica', 'bold');
                    doc.text('Total Amount', 120, y);
                    doc.setFont('helvetica', 'normal');
                    doc.text('$' + ' ' + totalAmount.toFixed(2), width - 100, y);

                    // Draw upper border
                    doc.setLineWidth(0.5);
                    doc.setDrawColor(0, 0, 0);
                    doc.line(40, y - 11, width - 40, y - 11); // Upper border

                    // Draw lower border
                    doc.line(40, y + 5, width - 40, y + 5); // Lower border
                }
                // Download the PDF
                doc.save(`Invoice_${invoice.id}.pdf`);
            });
        });
    };
    const paymentPDF = (payment) => {
        getBase64Image(logo, (logoBase64, logoWidth, logoHeight) => {
            getBase64Image(paidStamp, (paidStampBase64, paidStampWidth, paidStampHeight) => {
                const doc = new jsPDF('p', 'pt', 'a4');
                const width = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const margin = 40;

                // Define the maximum width and height for the logo image
                const maxLogoWidth = 100;
                const maxLogoHeight = 50;

                // Calculate the new width and height while maintaining the aspect ratio
                if (logoWidth > maxLogoWidth || logoHeight > maxLogoHeight) {
                    const aspectRatio = logoWidth / logoHeight;
                    if (logoWidth > maxLogoWidth) {
                        logoWidth = maxLogoWidth;
                        logoHeight = maxLogoWidth / aspectRatio;
                    }
                    if (logoHeight > maxLogoHeight) {
                        logoHeight = maxLogoHeight;
                        logoWidth = maxLogoHeight * aspectRatio;
                    }
                }

                // Define the header height and draw the header with line
                const headerHeight = 60;
                const headerY = 20;
                const logoX = 40;
                const companyDetailsX = logoX + logoWidth + 20; // Position company details to the right of the logo

                // Add the header line (adjusted to move up)
                doc.setLineWidth(5);
                doc.setDrawColor(211, 211, 211);
                const headerLineY = headerY + headerHeight; // Adjust this value to move the line up
                doc.line(40, headerLineY, width - 40, headerLineY);

                // Add the logo
                doc.addImage(logoBase64, 'PNG', logoX, headerY, logoWidth, logoHeight);

                // Add company details to the right of the logo
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('I8IS', companyDetailsX, headerY + 5); // Align with top of logo
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('SSTRACK', companyDetailsX, headerY + 20); // Align with top of logo
                doc.text('4370 Steeles Avenue West', companyDetailsX, headerY + 35); // New address line 1
                doc.text('Unit 204 Vaughan ON L4L 4Y4', companyDetailsX, headerY + 50); // New address line 2

                // Adding the "Customer" section
                doc.setFont("helvetica", "bold");
                doc.text('Customer:', 40, 100);
                doc.setFont("helvetica", "normal");
                doc.text('I8IS', 40, 120);
                doc.text('Kamran', 40, 135);
                mailto: doc.text('kamrantariq@hotmail.com', 40, 150);
                doc.text('Canada', 40, 165);

                // Adding the "Payment Receipt" section
                doc.setFont("helvetica", "bold");
                doc.setFontSize(18);
                doc.text(`Payment Receipt #${payment.id}`, 40, 220);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.text(`Payment #: ${payment.id}`, 40, 250);
                doc.text(`Payment date: ${payment.date}`, 40, 270);
                doc.text(`Description: PayPal, Transaction #76A80100YW016703J`, 40, 290);
                doc.setFont("helvetica", "bold");
                doc.text(`Total paid: $${payment.TotalAmount}`, 40, 310);
                doc.setFont("helvetica", "normal");
                doc.text(`Your current balance: ($${payment.amount})`, 40, 330);

                // Download the PDF
                doc.save(`Invoice_${payment.id}.pdf`);
            });
        });
    }






    const handleShow = () => setShow(true);

    async function deleteMyAccount() {
        const res = await fetch(`${apiUrl}/signin/userDelete/${items._id}`, {
            headers,
            method: "DELETE"
        })
        try {
            if (res.status === 200) {
                console.log((await res.json()));
                localStorage.removeItem("items");
                localStorage.removeItem("token");
                enqueueSnackbar("Account Deleted successfully", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
                setTimeout(() => {
                    navigate("/")
                    window.location.reload()
                }, 1000);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    async function verifyPassword() {
        if (currentPassword !== "") {
            try {
                const res = await axios.patch(`${apiUrl}/signin/users/Verifypass`, {
                    oldPassword: currentPassword
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.status === 200) {
                    console.log(res);
                    setVerify(true);
                    enqueueSnackbar("Password verified successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    });
                    updateMyPassword()
                } else {
                    // Handle cases where the status is not 200 (e.g., 400, 401, etc.)
                    setVerify(false);
                    enqueueSnackbar("Failed to verify password", {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    });
                }
            } catch (error) {
                // Catch and handle any network or other unexpected errors
                setVerify(false);
                console.log(error);
                enqueueSnackbar(error?.response?.data?.message, {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            }
        }
    }

    // const updateMyPassword = async () => {
    //     if (newPassword === "" || newPassword2 === "") {
    //         console.log("asddas");
    //     }
    //     if (newPassword === currentPassword || newPassword2 === currentPassword) {
    //         enqueueSnackbar("New password should unique", {
    //             variant: "error",
    //             anchorOrigin: {
    //                 vertical: "top",
    //                 horizontal: "right"
    //             }
    //         })
    //     }
    //     else {
    //         setUpdatePassword(false)
    //         const res = await fetch(`${apiUrl}/signin/users/Update?password=${newPassword}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             },
    //             method: "PATCH",
    //         });
    //         try {
    //             if (res.status === 200) {
    //                 console.log((await res.json()));
    //                 enqueueSnackbar("password updated successfully", {
    //                     variant: "success",
    //                     anchorOrigin: {
    //                         vertical: "top",
    //                         horizontal: "right"
    //                     }
    //                 })
    //             }
    //         }
    //         catch (error) {
    //             console.log(error);
    //         }
    //     }
    // }
    const updateMyPassword = async () => {
        if (newPassword === "" || newPassword2 === "") {
            console.log("asddas");
        }
        if (newPassword === currentPassword || newPassword2 === currentPassword) {
            enqueueSnackbar("New password should unique", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        } else {
            setUpdatePassword(false)
            try {
                const params = new URLSearchParams();
                params.append('password', newPassword);

                const res = await fetch(`${apiUrl}/signin/users/Update`, {
                    method: "PATCH",
                    body: params,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                console.log("API Response:", res);
                if (res.status === 200) {
                    console.log((await res.json()));
                    enqueueSnackbar("password updated successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                } else {
                    console.log("Error updating password:", res.status, res.statusText);
                    enqueueSnackbar("Failed to update password", {
                        variant: "error",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    })
                }
            } catch (error) {
                console.log("Error updating password:", error);
                enqueueSnackbar("Error updating password", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
        }
    }


    const offsetInMinutes = moment.tz(items.timezone).utcOffset();
    const offsetInHours = offsetInMinutes / 60;
    const offsetSign = offsetInHours >= 0 ? '+' : '-';
    const formattedOffset = `${offsetSign}${Math.abs(offsetInHours)}`;

    console.log(items)
    console.log(verify)


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

    const [selectedCard, setSelectedCard] = useState(
        cards.find(card => card.defaultCard)?._id || null
    );

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
    const [billingDate, setBillingDate] = useState(null);

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


    const [selectedPackage, setSelectedPackage] = useState()
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

    // const handleDirectChangePlan = async () => {
    // const DirectPayApiUrl = "https://myuniversallanguages.com:9093/api/v1";
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


    const handleOpenModal = () => {
        setIsOpen(true);
    };



    // const BillingComponent = () => {

    //     const [billing, setBilling] = useState(''); // Default billing balance
    //     const [Cardetail, setCardetail] = useState(''); // Default card details
    //     const [storedPlanId, setStoredPlanId] = useState(null); // Plan details

    // useEffect(() => {
    //     // Retrieve and parse the stored card details
    //     const storedCardDetails = localStorage.getItem('carddetail');
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
    // }, []);
    //     return (
    //         <>
    //             {!(items?.userType === 'user' || items?.userType === 'manager' || items?.userType === 'admin') && (
    //                 <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
    //                     <div style={{ marginBottom: '20px' }}>
    //                         <h2 style={{ color: '#0E4772', fontSize: '20px', fontWeight: '600', marginTop: '50px' }}>{storedPlanId?.planType ? `${storedPlanId?.planType[0].toUpperCase()}${storedPlanId?.planType.slice(1)}` : 'Free'} Plan</h2>
    //                         <p style={{ margin: '5px 0' }}>
    //                             Price: <strong>${storedPlanId ? storedPlanId?.costPerUser : 0}/employee/mo</strong>
    //                         </p>
    //                         {/* <Link to='/payment' style={{ color: '#007bff', textDecoration: 'none' }}>Change plan</Link> */}
    //                         <div>
    //                             <Link to='/team' style={{ color: '#007bff', textDecoration: 'none', marginTop: '10px', display: 'inline-block' }}>
    //                                 <span role="img" aria-label="employee icon">👥</span> Add or remove employees
    //                             </Link>
    //                         </div>
    //                     </div>
    //                     <div style={{ paddingTop: '10px' }}>
    //                         <h2 style={{ color: '#0E4772', fontSize: '20px', fontWeight: '600', marginTop: '50px' }}>Billing</h2>
    //                         <p style={{ margin: '5px 0' }}>
    //                             Your balance: <span style={{ color: 'green', fontWeight: 'bold' }}>${billing && storedPlanId ? Math.floor(billing * 100) / 100 : 0}</span>
    //                             {/* Your balance: <span style={{ color: 'green', fontWeight: 'bold' }}>${0}</span> */}

    //                             {/* <a href="#add-credit" style={{ color: '#007bff', textDecoration: 'none', marginLeft: '5px' }}>Add credit</a> */}
    //                         </p>
    //                         {/* <p style={{ margin: '5px 0' }}>
    //                     Next payment due: 09/24/2024 (for 08/25/2024 – 09/24/2024)
    //                 </p> */}
    //                         <p style={{ margin: '5px 0' }}>
    //                             Billing method: <span style={{ marginRight: '5px' }}>💳•••• {Cardetail && storedPlanId ? Cardetail : '****'}</span>
    //                             {/* <a href="#edit-billing" style={{ color: '#007bff', textDecoration: 'none' }}>Edit</a> */}
    //                         </p>
    //                     </div>
    //                 </div>
    //             )}
    //         </>
    //     );
    // };




    return (
        <>


            <SnackbarProvider />
            {show ? <Modal show={show} onHide={() => setShow(false)} animation={false} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>Are you sure want to delete your account ?</p>
                    <p>All of the time tracking data and screenshots for this employee will be lost. This can not be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={deleteMyAccount}>
                        DELETE
                    </button>
                    <button className="teamActionButton" onClick={() => setShow(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            {updatePassword ? <Modal show={updatePassword} onHide={() => setShow(false)} animation={false} centered>
                <Modal.Body onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        verifyPassword()
                    }
                }}>
                    <p style={{ marginBottom: "20px", fontWeight: "600", fontSize: "20px" }}>Change password</p>
                    <p style={{ marginBottom: "0", fontWeight: "500", fontSize: "16px" }}>Current password</p>
                    <input
                        value={currentPassword}
                        placeholder="Current password"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={{
                            fontSize: "18px",
                            padding: "5px 10px",
                            margin: "10px 0 20px 0",
                            width: "100%",
                            border: "1px solid #cacaca"
                        }}
                    />
                    <p style={{ marginBottom: "0", fontWeight: "500", fontSize: "16px" }}>New password</p>
                    <input
                        value={newPassword}
                        placeholder="New password"
                        onChange={(e) => setNewPassword(e.target.value)} style={{
                            fontSize: "18px",
                            padding: "5px 10px",
                            margin: "10px 0 20px 0",
                            width: "100%",
                            border: "1px solid #cacaca"
                        }}
                    />
                    <p style={{ marginBottom: "0", fontWeight: "500", fontSize: "16px" }}>Confirm new password</p>
                    <input
                        value={newPassword2}
                        placeholder="Retype new password"
                        onChange={(e) => setNewPassword2(e.target.value)}
                        style={{
                            fontSize: "18px",
                            padding: "5px 10px",
                            margin: "10px 0",
                            width: "100%",
                            border: "1px solid #cacaca"
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button style={{ backgroundColor: (currentPassword === "" || newPassword === "" || newPassword2 === "") && "grey", borderColor: (currentPassword === "" || newPassword === "" || newPassword2 === "") && "grey" }} className="teamActionButton" disabled={(currentPassword === "" || newPassword === "" || newPassword2 === "") ? true : false} onClick={() => {
                        if (verify === true) {
                            updateMyPassword()
                        }
                        else {
                            verifyPassword()
                        }
                    }}>
                        UPDATE
                    </button>
                    <button className="teamActionButton" onClick={() => setUpdatePassword(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}
            <div className="container">
                <div className="userHeader">
                    <div className="headerTop">
                        <img src={user} />
                        <h5>My Account </h5>
                    </div>
                </div>

                <div className="mainwrapper">

                    <div className="accountContainer">
                        {suspended ? (
                            <div className="text-center text-white alert alert-warning" style={{ backgroundColor: '#fc6568' }}>
                                Your account is currently suspended. Please upgrade your plan
                            </div>
                        ) : (
                            <div>
                                {/* Regular account content goes here */}
                                <h1></h1>
                                {/* Other account details */}
                            </div>
                        )}
                        {showWarning && (
                            <div style={{
                                padding: '10px',
                                backgroundColor: '#ffdddd',
                                border: '1px solid #ffcccc',
                                color: '#d8000c',
                                marginBottom: '20px',
                                borderRadius: '5px',
                                textAlign: "center",
                            }}>
                                <strong>Warning:</strong> You have unpaid invoices and payment is past due.
                            </div>
                        )}
                        <p className="asadMehmood">{items?.name} <span>{items?.company}</span></p>
                        <p className="userEmail">
                            {items?.email}
                            <br />
                            {items?.timezone}
                            <br />
                            UTC {formattedOffset}
                        </p>
                        <div className="accountDiv">
                            <div onClick={() => navigate('/profile')} className="accountEditDiv"><div><img src={edit} /></div><p>Edit Profile</p></div>
                            <div onClick={() => setUpdatePassword(true)} className="accountEditDiv"><div><img src={passwords} /></div><p>Change Password</p></div>
                            {items?.userType === "owner" && (
                                <div onClick={handleShow} className="accountEditDiv">
                                    <div><img src={deleteIcon} alt="Delete Icon" /></div>
                                    <p>Delete my Account</p>
                                </div>
                            )}
                        </div>
                        {/* <Payment /> */}

                        <BillingComponent />
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
                        <Payment />
                    </div>
                </div>
            </div>
            <img className="accountLine" src={line} />

            {/* <Payment /> */}
        </>
    )
}
export default Account;