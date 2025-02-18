import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";
import jsPDF from 'jspdf';
import { enqueueSnackbar } from "notistack";
import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from '../../src/public/tracking.png';
import paidStamp from '../images/paid.png';
// import { link}
// import BillingComponent from "./BillingComponent";
import jwtDecode from "jwt-decode";
import { FerrisWheelSpinner } from 'react-spinner-overlay';



const stripePromise = loadStripe(process.env.REACT_AP_KEY);


const PayPalButton = ({ setMerchantId, selectedPlan }) => {

    const amount = selectedPlan?.costPerUser; // Dynamically set amount based on selectedPlan
    useEffect(() => {
        // Load the PayPal SDK script
        const script = document.createElement('script');
        // script.src = `https://www.paypal.com/sdk/js?client-id=AbjWITfwZjHD0s6nwfnGmZFpRKnhKLet_QEaADR6xkZ4LiBjI2niy3U6sHRvYi6zCKgaCA4H4RX3mIPh&currency=USD&disable-funding=credit,card`;
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}&currency=USD&disable-funding=credit,card`;
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

const BillingComponent = () => {

    const location = useLocation();
    const [show, setShow] = useState(false);
    const [plans, setPlans] = useState(location.state?.plans || []);
    const [deleteAccount, setDeleteAccount] = useState(false);
    const [updatePassword, setUpdatePassword] = useState(false);
    const [showModalwithoutcard, setShowModalwithoutcard] = useState(false);
    const [fetchError] = useState(location.state?.fetchError || null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [TotalUsers, setTotalUsers] = useState(0);
    const [paycard, setpaycard] = useState();
    const [selectedPlan, setSelectedPlan] = useState(() => {
        // Load initial plan data from localStorage if available
        return JSON.parse(localStorage.getItem('planIdforHome')) || plans[0] || null;
    });
    const [showNewCardModal, setshowNewCardModal] = useState(false);
    const [billingDate, setBillingDate] = useState(null);
    const [defaultPlanIndex] = useState(location.state?.defaultPlanIndex || 0);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [hasUnpaidInvoices, setHasUnpaidInvoices] = useState(false);
    const [newPassword2, setNewPassword2] = useState("");
    const [verify, setVerify] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [payments, setPayments] = useState([]);
    const [activeTab, setActiveTab] = useState('invoices');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [cards, setCards] = useState([]);
    const [isPlanChanging, setIsPlanChanging] = useState(false); // Add this new state
    const jwdtoken = localStorage.getItem('token');
    const items = jwtDecode(JSON.stringify(jwdtoken));
    const [invoice, setInvoice] = useState({ status: 'unpaid' }); // or retrieve it from your API or storage

    const fetchInvoices = async () => {
        try {
            const res = await fetch(`${apiUrl}/owner/getInvoice`, {
                headers,
            });
            const data = await res.json();
            console.log('invoices', data);

            console.log("Payment ka data agya", data.data.paymentsInfo.map(payment => payment.TotalAmount));


            // Transform paymentsInfo similar to invoiceInfo
            const transformedPayments = data.data.paymentsInfo.map((payment) => {
                // console.log('Payment Total Amount:', payment.TotalAmount);
                // console.log('Payment Receipt Id agyi:', payment.receiptId);
                return {
                    receiptId: payment.receiptId, // Assuming each payment has a unique id
                    amount: parseFloat(payment.TotalAmount).toFixed(2), // Format the total amount
                    payDate: new Date(payment.payDate).toLocaleDateString(), // Format payment date
                    paymentIntentId: payment.paymentIntentId, // Assuming each payment has a unique id
                    cardType: payment.cardType,
                    // invoiceNumber: payment.invoiceNumber, // Reference to associated invoice
                    status: payment.status // Payment status
                };
            });
            // Sort invoices so that today's invoices appear first
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time for comparison

            // Sort payments in descending order by payDate
            transformedPayments.sort((a, b) => {
                const aDate = new Date(a.payDate).setHours(0, 0, 0, 0); // Resetting time for comparison
                const bDate = new Date(b.payDate).setHours(0, 0, 0, 0); // Resetting time for comparison
                return bDate - aDate; // Sort by payDate in descending order
            });

            setPayments(transformedPayments);

            console.log("Payment ka data agya", transformedPayments);

            // Transform the API data to the desired structure
            const transformedInvoices = data.data.invoiceInfo.map((invoice) => {
                // Log the status of each invoice
                console.log('Invoice status:', invoice.status);

                return {
                    id: invoice.invoiceNumber,
                    date: new Date(invoice.invoiceDate).toLocaleDateString(),
                    description: `From ${new Date(invoice.billingPeriodStart).toLocaleDateString()} to ${new Date(invoice.billingPeriodEnd).toLocaleDateString()}`,
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

            

            transformedInvoices.sort((a, b) => {
                // Compare dates
                const aDate = new Date(a.date).setHours(0, 0, 0, 0);
                const bDate = new Date(b.date).setHours(0, 0, 0, 0);
                return bDate - aDate; // Sort in descending order
            });

            setInvoices(transformedInvoices);

            const hasUnpaidInvoice = transformedInvoices.some(invoice => invoice.status === 'unpaid');


            setShowWarning(hasUnpaidInvoice);
        } catch (error) {
            console.error('Error fetching invoices:!!!!!!!!!!!!!!!!', error);
        }
    };



    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    useEffect(() => {
        fetchInvoices();
    }, []);

  
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

                // Define header parameters
                const headerHeight = 60;
                const headerY = 20;
                const logoX = margin;
                const companyDetailsX = logoX + logoWidth + 20; // Position company details to the right of the logo

                // Add the header line
                doc.setLineWidth(5);
                doc.setDrawColor(211, 211, 211);
                const headerLineY = headerY + headerHeight;
                doc.line(margin, headerLineY, width - margin, headerLineY);

                // Add the logo
                doc.addImage(logoBase64, 'PNG', logoX, headerY, logoWidth, logoHeight);

                // Add company details
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('I8IS', companyDetailsX, headerY + 5);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('SSTRACK', companyDetailsX, headerY + 20);
                doc.text('4370 Steeles Avenue West', companyDetailsX, headerY + 35);
                doc.text('Unit 204 Vaughan ON L4L 4Y4', companyDetailsX, headerY + 50);

                // Adding the "Customer" section
                doc.setFont("helvetica", "bold");
                doc.text('Customer:', margin, 100);
                doc.setFont("helvetica", "normal");
                doc.text('I8IS', margin, 120);
                doc.text('Kamran', margin, 135);
                doc.text('kamrantariq@hotmail.com', margin, 150);
                doc.text('Canada', margin, 165);

                // Adding the "Payment Receipt" section
                doc.setFont("helvetica", "bold");
                doc.setFontSize(18);
                doc.text(`Payment Receipt #${payment.receiptId}`, margin, 220);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.text(`Payment #: ${payment.receiptId}`, margin, 250);
                doc.text(`Description: ${payment.cardType}, Transaction #: ${payment.paymentIntentId}`, margin, 290);
                doc.text(`Payment date: ${payment.payDate}`, margin, 270);
                // doc.text({payment.cardType}, Transaction#{payment.paymentIntentId}, margin, 290);
                doc.setFont("helvetica", "normal");
                doc.text(`Total paid: `, margin, 310);

                // Set font to bold for the amount
                doc.setFont("helvetica", "bold");
                doc.text(`$${parseFloat(payment.amount).toFixed(2)}`, margin + doc.getTextWidth(`Total Paid: `), 310); // Positioning the amount right after the text

                doc.setFont("helvetica", "normal");
                doc.text(`Your current balance: ($${payment.amount})`, margin, 330);

                // Optionally add a paid stamp if needed
                // doc.addImage(paidStampBase64, 'PNG', width - 140, 20, 100, 50); // Position and size as needed

                // Download the PDF
                doc.save(`Payment_${payment.receiptId}.pdf`);
            });
        });
    };




    const [billing, setBilling] = useState(''); // Default billing balance
    const [cardDetail, setCardetail] = useState(''); // Default card details
    const [storedPlanId, setStoredPlanId] = useState(null); // Plan details

    useEffect(() => {
        // Retrieve and parse the stored card details
        const storedCardDetails = localStorage.getItem('carddetail');

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
 



    useEffect(() => {
        if (cardDetail) {
            localStorage.setItem('carddetail', JSON.stringify(cardDetail));
        }
    }, [cardDetail]);

    useEffect(() => {
        if (storedPlanId) {
            localStorage.setItem('planId', JSON.stringify(storedPlanId));
        }
    }, [storedPlanId]);

    useEffect(() => {
        if (billing) {
            localStorage.setItem('billdetail', JSON.stringify(billing));
        }
    }, [billing]);




    useEffect(() => {
        const storedPlanId = JSON.parse(localStorage.getItem('planIdforHome'));
        if (storedPlanId) {
            setPlanData(storedPlanId); // Update the plan data whenever it changes in local storage
        }
    }, []);
    const navigate = useNavigate();
    const handleUpdatePaymentStatus = (status) => {
        setPaymentStatus(status);
        setHasUnpaidInvoices(status !== 'paid');
    };

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
                    setpaycard(defaultCard); // Update paycard state correctly
                } else {
                    setpaycard(null); // Clear paycard if no default card exists
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



    useEffect(() => {
        if (paycard) {
            localStorage.setItem('carddetail', JSON.stringify(paycard.cardNumber));
        }
    }, [paycard]);
    



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



  



    const CheckoutForm = () => {
        const stripe = useStripe();
        const elements = useElements();
        const [error, setError] = useState(null);
        const [success, setSuccess] = useState(false);
        const [loading, setLoading] = useState(false);
        // const items = JSON.parse(localStorage.getItem('items'));
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
                        // TotalAmount: '58.88',
                        // dueDate: '2024-07-30',
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


    //this api is for pricing plan who's data is to send to payment page
    const planapiUrl = "https://myuniversallanguages.com:9093/api/v1";


    const fetchPlans = async () => {
        try {
            const response = await axios.get(`${planapiUrl}/owner/getPlans`);
            const plans = response.data.data;
            console.log('plansssss====>', plans)
            setPlans(plans)
            setSelectedPlan(plans[1]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching plans:', error);

            setLoading(false);
        }
    };


    const [showPayPal, setShowPayPal] = useState(false);
    const amount = 10.00; // Set your amount here



    useEffect(() => {
        if (plans.length > 0) {
            setSelectedPlan(plans[defaultPlanIndex - 1] || plans[1]);

        } else {
            fetchPlans();
            setSelectedPlan(plans[0])
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
                                </div>
                            </Elements>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        );
    };





    const [selectedPackage, setSelectedPackage] = useState();
    // const storedPlanId = JSON.parse(localStorage.getItem('planId'));
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
        // setShowModal(true);  // For when the paycard is available
    };

    const handleShowModal2 = () => {
        console.log('No card available');
        // setShowModalwithoutcard(true);  // For when the paycard is not available
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    
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
                    <div className="text-left mb-4">
                        {selectedPlan ? (
                            <div>
                                {selectedPlan.planType === 'standard' ? (
                                    <p>
                                        If you proceed with upgrading or downgrading to this plan, the cost will be
                                        <strong>
                                            ${selectedPlan.costPerUser}
                                        </strong>
                                        per user per month.

                                        Starting today, this plan will take effect immediately. The price of ${selectedPlan.costPerUser} will be applied to your current billing cycle, and future payments will also reflect this price. All invoices moving forward will be generated based on the updated plan and its pricing structure.
                                        {/* You are Upgrading/Downgrade to the{' '}
                                        <strong>{selectedPlan.planType.charAt(0).toUpperCase() + selectedPlan.planType.slice(1)} Plan</strong>.
                                        <strong>Plan Price:</strong> ${selectedPlan.costPerUser} / month */}
                                    </p>
                                ) : (

                                    <p>
                                        If you proceed with upgrading or downgrading to this plan, the cost will be ${selectedPlan.costPerUser} per user per month.

                                        Starting today, this plan will take effect immediately. The price of ${selectedPlan.costPerUser} will be applied to your current billing cycle, and future payments will also reflect this price. All invoices moving forward will be generated based on the updated plan and its pricing structure.
                                        {/* You are upgrading{' '}
                                        <strong>{selectedPlan.planType.charAt(0).toUpperCase() + selectedPlan.planType.slice(1)} Plan</strong>.
                                        <strong>Plan Price:</strong> ${selectedPlan.costPerUser} / month */}
                                    </p>
                                )
                                }
                                <div className="container d-flex">
                                    <div className="row d-flex" style={{ width: '60rem' }}>
                                        <div className="col-md-12">
                                            <div className="card mt-2" style={{ marginLeft: '-12px' }}>
                                                <div className="card-body" style={{ height: '12rem' }}>
                                                    <div className="d-flex justify-content-between align-items-center">
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
                                                    <div className="d-flex">
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
                    <div className='d-flex' style={{ justifyContent: 'space-between', width: '100%' }}>
                        <button style={{
                            alignSelf: "center",

                            border: 'none',  // Removing default border
                            cursor: 'pointer',  // Pointer on hover
                        }}
                            onClick={() => {
                                handleDirectChangePlan1();
                                setPlanData(selectedPlan);
                                localStorage.setItem('planIdforHome', JSON.stringify(selectedPlan));
                                handleCloseModal2()
                            }}
                        // onClick={handleDirectChangePlan}
                        >
                            <PayPalButton amount={amount} selectedPlan={selectedPlan} setMerchantId={setMerchantId} />
                        </button>

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
                            // onClick={() => {
                            //     handleDirectChangePlan();
                            //     setPlanData(selectedPlan);
                            //     // localStorage.setItem('planIdforHome', JSON.stringify(selectedPlan));
                            // }}
                            onClick={async () => {
                                // Handle payment processing
                                handleCloseModal2()
                                setSelectedPlan(selectedPlan)
                                const success = await handleDirectChangePlan(); // Ensure this function returns true/false based on the response
                                // Close the modal after clicking "Pay Now"
                                if (success) {
                                    // Update the selected plan state only if the API call was successful
                                    setSelectedPlan(selectedPlan);
                                    handleCloseModal2(); // Close the modal right after payment processing
                                }
                                // handleCloseModal2(); // Close the modal after processing the payment
                            }}
                        // onClick={handleDirectChangePlan}
                        >Pay Now</button>
                    </div>
                </Modal.Footer>
            </Modal >
        );
    };

    const [responseMessage, setResponseMessage] = useState(null);

   
    useEffect(() => {
        if (selectedPlan) {
            localStorage.setItem('planIdforHome', JSON.stringify(selectedPlan));
        }
    }, [selectedPlan]);
    
    const handleDirectChangePlan = async () => {
        const DirectPayApiUrl = "https://myuniversallanguages.com:9093/api/v1";
        if (paycard) {
            console.log('Pay with this card:', paycard);
            setResponseMessage(null);
            setIsPlanChanging(true); // Start loader
            try {
                const res = await axios.post(`${DirectPayApiUrl}/owner/upgrade`, {
                    planId: selectedPlan._id,
                }, { headers });

                console.log('Response owner', res);

                // Check if the response indicates success
                if (res.data.success) {
                    setSelectedPlan(selectedPlan); // Update state with new plan

                    const receiptUrl = res.data.data.receiptUrl; // Retrieve receipt URL
                    console.log('Receipt URL:', receiptUrl);
                    window.open(receiptUrl, '_blank'); // Open receiptUrl in a new tab

                    // Notify the user of success
                    enqueueSnackbar("Plan Changed Successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    });
                    setPlanData(selectedPlan); // Update state
                    // localStorage.setItem('planIdforHome', JSON.stringify(selectedPlan)); // Sync to localStorage    
                } else {
                    // Handle failure response
                    alert(res.data.message || "An error occurred while changing the plan.");
                }
            } catch (error) {
                console.error('Error:', error.response?.data?.message);
                if (error.response && error.response.data) {
                    if (error.response.status === 403 || (error.response.status === 500 && error.response.data.success === false)) {
                        enqueueSnackbar("Sorry, upgrade unavailable due to uncleared invoices", {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right"
                            }
                        });
                    } else {
                        // Handle other errors
                        alert(error.response.data.message || "An unexpected error occurred.");
                    }
                }
            } finally {
                setIsPlanChanging(false); // End loading
                setShowModalwithoutcard(false);
            }
        } else {
            alert("No payment card available.");
        }
    };
  

    const [merchantId, setMerchantId] = useState(''); // Or whatever method you are using to get the ID

    const handleDirectChangePlan1 = async () => {
        const DirectPayApiUrl = "https://myuniversallanguages.com:9093/api/v1";

        if (paycard) {
            console.log('Pay with this card:', paycard);
            setResponseMessage(null);

            try {
                // Retrieve the token from localStorage
                const token = localStorage.getItem('token'); // Make sure the token is stored in localStorage

                // Make the request, including planId, transactionId, and token in the data
                const res = await axios.post(`${DirectPayApiUrl}/owner/upgradePayPal`, {
                    planId: selectedPlan._id,
                    transactionId: merchantId, // Use the merchantId from props
                    token // Include token in the request body
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                // If you get a new token in the response, decode and store it
                const newToken = res.data.token;
                if (newToken) {
                    const decoded = jwtDecode(newToken);
                    // localStorage.setItem("items", JSON.stringify(decoded));
                    localStorage.setItem("token", newToken); // Update the token if needed
                }
                console.log('Response owner', res);

                // Handle receipt URL if available
                const receiptUrl = res.data.data.receiptUrl;
                console.log('Receipt URL:', receiptUrl);
                window.open(receiptUrl, '_blank');

                // Display success message
                if (res.status === 200) {
                    enqueueSnackbar("Plan Changed Successfully", {
                        variant: "success",
                        anchorOrigin: {
                            vertical: "top",
                            horizontal: "right"
                        }
                    });
                } else {
                    if (res.status === 403) {
                        alert("Access denied. Please check your permissions.");
                    } else if (res.data.success === false) {
                        alert(res.data.message);
                    }
                }
                handleCloseModal2();
            } catch (error) {
                console.error('Error:', error.response?.data?.message);
                if (error.response && error.response.data) {
                    if (error.response.status === 403 && error.response.data.success === false) {
                        enqueueSnackbar("Sorry, upgrade unavailable due to uncleared invoices", {
                            variant: "error",
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "right"
                            }
                        });
                    }
                }
            } finally {
                setShowModalwithoutcard(false);
            }
        }
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

    const plandetail = `${costPerUser}/employee/mo`;

   
    const planchange = () => {
        console.log('Paycard:', paycard); // Debugging log
        if (paycard?.cardNumber) {
            setShowModalwithoutcard(true); // Open the modal
            setSelectedPlan(selectedPlan); // Set the selected plan
        } else {
            enqueueSnackbar("Please add your card", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
        }
    };


    const [isOpen, setIsOpen] = useState(false);


    const Cardetail = paycard?.cardNumber

    localStorage.setItem('carddetail', JSON.stringify(Cardetail));

    const [planData, setPlanData] = useState(JSON.parse(localStorage.getItem('planIdforHome')));






    return (
        <>
            {!(items?.userType === 'user' || items?.userType === 'manager' || items?.userType === 'admin') && (
                <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
                    <div style={{ marginBottom: '20px' }}>
                        {/* <h2 style={{ color: '#0E4772', fontSize: '20px', fontWeight: '600', marginTop: '50px' }}>{planData?.planType ? `${planData?.planType[0].toUpperCase()}${planData?.planType.slice(1)}` : 'Free'} Plan</h2> */}
                        <p style={{ marginTop: '50px' }}>
                            Price: <strong>${planData ? planData?.costPerUser : 0}/employee/mo</strong>
                        </p>
                        <Link to='/team' style={{ color: '#007bff', textDecoration: 'none', marginTop: '10px', display: 'inline-block' }}>
                            <span role="img" aria-label="employee icon">👥</span> Add or remove employees
                        </Link>
                        <p className="companyPlan">Company plan</p>
                        <p className="userEmail">If you track your time for other companies - you do not need a plan and do not have to pay - your company pays for you.</p>
                        {invoices.length > 0 && (
                            <div style={{ width: '80%', margin: '10px auto', fontFamily: 'Arial, sans-serif' }}>

                                <div style={{ display: 'flex', borderBottom: '2px solid #ddd', marginBottom: '10px' }}>
                                    <span
                                        style={{
                                            padding: '10px 20px',
                                            fontWeight: 'bold',
                                            borderBottom: activeTab === 'invoices' ? '3px solid #28659C' : 'none',
                                            color: activeTab === 'invoices' ? 'black' : 'grey',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleTabClick('invoices')}
                                    >
                                        Invoices
                                    </span>
                                    <span
                                        style={{
                                            padding: '10px 20px',
                                            fontWeight: 'bold',
                                            borderBottom: activeTab === 'payments' ? '3px solid #28659C' : 'none',
                                            color: activeTab === 'payments' ? 'black' : 'grey',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleTabClick('payments')}
                                    >
                                        Payments
                                    </span>
                                </div>
                                {activeTab === 'invoices' ? (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>
                                                    Invoice #
                                                </th>
                                                <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>
                                                    Date
                                                </th>
                                                <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>
                                                    Description
                                                </th>
                                                <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>
                                                    Amount
                                                </th>
                                                <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.map((invoice) => (
                                                <tr key={invoice.id}>
                                                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                                        {invoice.status === 'unpaid' ? (
                                                            <span style={{ color: 'orange', marginRight: '5px' }}>&#9888;</span>
                                                        ) : (
                                                            <span style={{ color: 'green', marginRight: '5px' }}>&#10003;</span>
                                                        )}
                                                        {invoice.id}
                                                    </td>
                                                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{invoice.date}</td>
                                                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{invoice.description}</td>
                                                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>${invoice.amount}</td>
                                                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                                        <a
                                                            href="#"
                                                            style={{
                                                                color: '#28659C',
                                                                textDecoration: 'none',
                                                                fontWeight: 'bold',
                                                                cursor: 'pointer',
                                                            }}
                                                            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                                                            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                                                            onClick={() => generatePDF(invoice)} // Generate PDF on click
                                                        >
                                                            PDF
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    // Payments Table
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>
                                                    Payment #
                                                </th>
                                                <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>
                                                    Date
                                                </th>
                                                <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>
                                                    Description
                                                </th>
                                                <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}>
                                                    Amount
                                                </th>
                                                <th style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd', padding: '10px', textAlign: 'left' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map((payment) => (
                                                <tr key={payment.id}>
                                                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{payment.receiptId}</td>
                                                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{payment.payDate}</td>
                                                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{payment.cardType}, Transaction#{payment.paymentIntentId}</td>
                                                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>${payment.amount}</td>
                                                    <td style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                                        <a
                                                            href="#"
                                                            style={{
                                                                color: '#28659C',
                                                                textDecoration: 'none',
                                                                fontWeight: 'bold',
                                                                cursor: 'pointer',
                                                            }}
                                                            onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                                                            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                                                            onClick={() =>
                                                                paymentPDF(payment)
                                                                // console.log('dfsdfsdfs')
                                                            } // View receipt on click
                                                        >
                                                            PDF
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                {/* <a
                                href="#"
                                style={{
                                    display: 'inline-block',
                                    marginTop: '10px',
                                    fontWeight: 'bold',
                                    textDecoration: 'none',
                                    color: '#28659C',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                                onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                            >
                                Download
                            </a> */}
                            </div>
                        )}
                    </div>
                    {/* <div className="row mt-4">
                        {loading ? (
                            <p className="col-12">Loading plans...</p>
                        ) : fetchError ? (
                            <p className="col-12">{fetchError}</p>
                        ) : (
                            plans
                                .filter((plan) => plan.planType !== 'trial') // Filter out trial plans
                                .map((plan, index) => (

                                    <div className={`col-6 ${index % 2 === 0 ? '' : 'pl-2'}`} style={{
                                        marginBottom: '10px',
                                        overflow: 'hidden', // Add this line
                                    }} key={plan._id}>
                                        <div className='card' >
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
                                                    width: '100%', // Add this to make the label full width
                                                    height: '100%', // Add this to make the label full height
                                                }}
                                                >
                                                    <input
                                                        type="radio"
                                                        id={plan._id}
                                                        name="plan"
                                                        value={plan?.planType}
                                                        checked={selectedPlan?._id === plan?._id}
                                                        onChange={() => handlePlanSelect(plan)}
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
                                                        backgroundColor: selectedPlan?._id === plan._id ? '#4CAF50' : '#0070BA', // Changed color
                                                        borderRadius: '50%',
                                                        transition: 'background-color 0.3s'
                                                    }}
                                                    ></span>
                                                    <span style={{
                                                        position: 'absolute',
                                                        top: '9px',
                                                        left: '9px',
                                                        height: '8px',
                                                        width: '8px',
                                                        borderRadius: '50%',
                                                        backgroundColor: selectedPlan?._id === plan._id ? 'white' : 'transparent',
                                                        display: selectedPlan?._id === plan._id ? 'block' : 'none'
                                                    }}
                                                    ></span>
                                                    <div style={{ marginLeft: '10px' }}>
                                                        {plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)} - ${plan.costPerUser}/month
                                                        {planData ? (
                                                            plan.planType.charAt(0).toUpperCase() === planData.planType.charAt(0).toUpperCase() ? (
                                                                <span style={{ color: 'green' }}> Current</span>
                                                            ) : (
                                                                selectedPlan?._id === plan._id ? (
                                                                    <>
                                                                        <button
                                                                            style={{
                                                                                marginLeft: '10px',
                                                                                padding: '5px 5px',
                                                                                backgroundColor: 'green',
                                                                                color: 'white',
                                                                                border: 'none',
                                                                                borderRadius: '5px',
                                                                                cursor: 'pointer',
                                                                                fontSize: '0.875rem'
                                                                            }}
                                                                            onClick={() => {
                                                                                planchange();
                                                                            }}
                                                                            disabled={isPlanChanging} // Disable button while loading
                                                                        >
                                                                            {isPlanChanging ? (
                                                                                <FerrisWheelSpinner loading={isPlanChanging} size={23} color="#fff" />
                                                                            ) : (
                                                                                selectedPlan?.planType?.charAt(0).toUpperCase() === 'S' ? 'Downgrade' : 'Upgrade'
                                                                            )}
                                                                        </button>
                                                                      
                                                                    </>
                                                                ) : (
                                                                    <span></span>
                                                                )
                                                            )

                                                        ) : (
                                                            selectedPlan?._id === plan._id ? (
                                                                <button style={{
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
                                                                        planchange();
                                                                    }}
                                                                >
                                                                    Upgrade
                                                                </button>
                                                            ) : (
                                                                <span></span>
                                                            )
                                                        )}
                                                        <p className="card-text" style={{ fontSize: '1rem' }}>{getPlanDescription(plan)}</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div> */}
                    <div className='card mt-4'>
                        <div className='card-body'>
                            <h3 className="card-title mt-4">Estimated payments</h3>
                            <div className="mt-2" style={{ maxWidth: "70%", color: 'grey' }}>Pay only for what you use. There is no minimum fee. If you add a worker for a single day, you'll pay for this day only. Not month. You are free to add or remove workers anytime as you see fit. Your credit card will not be charged today, only at the end of your billing period.</div>
                            <div className="container mt-4">
                                <div className="row">
                                    <div className="col-12">
                                        <p><strong>First billing period:</strong> {firstBillingPeriodStart && firstBillingPeriodEnd ? `${formatDate(firstBillingPeriodStart)}–${formatDate(firstBillingPeriodEnd)}` : 'N/A'}</p>
                                        <p><strong>First charge date:</strong> {billingDate ? formatDate(billingDate) : 'N/A'}</p>
                                        <p><strong>Current employees:</strong> {TotalUsers} — you won't be charged for yourself unless you track your own time</p>
                                        {/* {selectedPlan && (
                                            <>
                                                <p><strong>Price per user:</strong> ${selectedPlan.costPerUser}/month</p>

                                                <p className="font-weight-bold"><strong>Estimated total:</strong>  <span>${Math.floor(selectedPlan.costPerUser * TotalUsers * 100) / 100}/month</span></p>
                                            </>
                                        )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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





export default BillingComponent;