import React, { useState } from "react";
import picture from '../../../images/contactImage-cropped.svg'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import axios from "axios";
function ContactSection({ language }) {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent page refresh on form submit

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/;

        if (
            fullName === '' ||
            message === '' ||
            email === '' ||
            phoneNumber === "" ||
            companyName === ""
        ) {
            enqueueSnackbar("All Fields are required", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            return;
        } else if (!emailRegex.test(email)) {
            enqueueSnackbar('Please enter a valid email address', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
            return;
        } else if (!phoneRegex.test(phoneNumber)) {
            enqueueSnackbar('Please enter a valid phone number', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                },
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/event/contactForm`, {
                fullName,
                email,
                companyName,
                phoneNumber,
                message
            });

            if (response.status === 200) {
                setLoading(false);
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
                // Reset form fields
                setFullName("");
                setCompanyName("");
                setEmail("");
                setPhoneNumber("");
                setMessage("");
            }
        } catch (error) {
            setLoading(false);
            enqueueSnackbar('Something went wrong. Please try again later.', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                },
            });
        }
    };

    return (
        <>
        <SnackbarProvider />
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh",
                backgroundColor: "#ffffff", // Background of the entire section
                padding: "2rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "1200px",
                    //   padding: "2rem",
                    backgroundColor: "#FFFFFF", // White background for the container
                    borderRadius: "10px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                {/* Left Section - Contact Info */}
                <div
                    style={{
                        flex: 1,

                    }}
                >
                    {/* Picture */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            //   marginBottom: "2rem", // Adds space between the picture and text
                        }}
                    >
                        <object
                            data={picture} // Replace with your SVG file URL
                            type="image/svg+xml"
                            style={{
                                width: "450px",
                                pointerEvents: "none", // Ensures the object cannot be interacted with
                            }}
                            aria-label="Contact"
                        />
                    </div>
                </div>

                {/* Right Section - Contact Form */}
                <div
                    style={{
                        flex: 1.5,
                        paddingLeft: "2rem",
                        display: "flex",
                        padding: "2rem",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "1rem",
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <label
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: 'normal',
                                    color: "#333",
                                    transition: "0.2s ease all",
                                    pointerEvents: "none",
                                }}
                                    
                            >
                                {language === "en" ? "Full Name" : "الاسم الكامل"}
                            </label>

                            <input
                                type="text"
                                placeholder={language === "en" ? "Full Name" : "الاسم الكامل"}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={{
                                    flex: 1,
                                    fontSize: "0.875rem",
                                    padding: "1rem",
                                    border: "0px  solid #E0E0E0",
                                    borderRadius: "5px",
                                    boxShadow: "0px 4px 4px rgba(171, 171, 171, 0.2)", // Shadow based on your screenshot
                                    borderLeft: "1px solid #4CAF50", // Green border on the right
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <label
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: 'normal',
                                    color: "#333",
                                    transition: "0.2s ease all",
                                    pointerEvents: "none",
                                }}
                            >
                                {language === "en" ? "Email" : "البريد الإلكتروني"}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}

                                placeholder={language === "en" ? "Email" : "البريد الإلكتروني"}
                                style={{
                                    flex: 1,
                                    padding: "1rem",
                                    fontSize: "0.875rem",
                                    border: "0px  solid #E0E0E0",
                                    borderRadius: "5px",
                                    boxShadow: "0px 4px 4px rgba(171, 171, 171, 0.2)", // Shadow based on your screenshot
                                    borderLeft: "1px solid #4CAF50", // Green border on the right
                                }}
                            />
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: "1rem",
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <label
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: 'normal',
                                    color: "#333",
                                    transition: "0.2s ease all",
                                    pointerEvents: "none",
                                }}
                            >
                                {language === "en" ? "Phone Number" : "رقم الهاتف"}

                            </label>
                            <input
                                type="text"
                                placeholder={language === "en" ? "Phone Number" : "رقم الهاتف"}
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}

                                style={{
                                    flex: 1,
                                    padding: "1rem",
                                    fontSize: "0.875rem",
                                    border: "0px  solid #E0E0E0",
                                    borderRadius: "5px",
                                    boxShadow: "0px 4px 4px rgba(171, 171, 171, 0.2)", // Shadow based on your screenshot
                                    borderLeft: "1px solid #4CAF50", // Green border on the right
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <label
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: 'normal',
                                    color: "#333",
                                    transition: "0.2s ease all",
                                    pointerEvents: "none",
                                }}
                            >
                                {language === "en" ? "Company Name" : "اسم الشركة"}

                            </label>
                            <input
                                type="text"
                                placeholder={language === "en" ? "Company Name" : "اسم الشركة"}
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "1rem",
                                    fontSize: "0.875rem",
                                    border: "0px  solid #E0E0E0",
                                    borderRadius: "5px",
                                    boxShadow: "0px 4px 4px rgba(171, 171, 171, 0.2)", // Shadow based on your screenshot
                                    borderLeft: "1px solid #4CAF50", // Green border on the right
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <label
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: 'normal',
                                color: "#333",
                                transition: "0.2s ease all",
                                pointerEvents: "none",
                            }}
                        >
                            {language === "en" ? "Message" : "الرسالة"}

                        </label>
                        <textarea
                            placeholder={language === "en" ? "Message" : "الرسالة"}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}

                            style={{
                                flex: 1,
                                padding: "1rem",
                                fontSize: "0.875rem",
                                border: "0px  solid #E0E0E0",
                                borderRadius: "5px",
                                boxShadow: "0px 4px 4px rgba(171, 171, 171, 0.2)", // Shadow based on your screenshot
                                borderBottom: "1px solid #4CAF50",
                                minHeight: '200px'
                            }}
                        />
                    </div>
                    <button
                       onClick={handleSubmit}

                        style={{
                            alignSelf: "flex-start",
                            padding: "0.5rem 2rem",
                            backgroundColor: "#7ACB59",
                            color: "#FFFFFF",
                            border: "none",
                            width: '100%',
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: '13px'
                        }}
                    >
                        {language === "en" ? "Send Message" : "إرسال الرسالة"}
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}

export default ContactSection;
