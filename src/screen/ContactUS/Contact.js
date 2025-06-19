import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import axios from "axios";
import { CircularProgress } from "@mui/material";
import NewHeader from '../component/Header/NewHeader';


function Contact() {
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [message, setMessage] = useState('');

    const apiUrl = process.env.REACT_APP_API_URL;

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

    const [language, setLanguage] = useState('en');

    const handleToggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <>

            <NewHeader language={language} handleToggleLanguage={handleToggleLanguage} />

            {/* <div id="section5"> */}


            <Container fluid className="py-5" style={{ backgroundColor: "#F8F9FA" }} id="section5">

            <p className='ethical'>Contact</p>

                
                <Row className="justify-content-center">
                    {/* Left Section */}
                    <SnackbarProvider />

                    <Col
                        md={5}
                        className="d-flex flex-column text-white p-5 gap-4"
                        style={{
                            background: "linear-gradient(90deg, #0D4873, #0A304B, #071F2D, #0C364F, #0D4873)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: "10px",
                            minHeight: "500px",
                            paddingTop: "10%",
                        }}
                    >
                        <h2 className="mb-4" style={{ fontSize: "40px" }}>
                            {language === "en" ? "Contact Us" : "معلومات الاتصال"}
                        </h2>

                        <p className="mt-4" style={{ fontSize: "22px", marginBottom: "20px" }}>
                            {language === "en"
                                ? "We're here to assist you! If you have any questions or need assistance, please feel free to reach out to us."
                                : "نحن هنا لمساعدتك! إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة، فلا تتردد في التواصل معنا."}
                        </p>

                        <strong>
                            <a href="mailto:info@sstrack.io" className="text-white" style={{ fontSize: "25px" }}>info@sstrack.io</a>
                        </strong>
                    </Col>

                    {/* Right Section */}
                    <Col
                        md={6}
                        className="bg-white p-4"
                        style={{
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                    >
                        {/* <h2 className="mb-4">Get in Touch</h2> */}
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="fullName">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
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
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="email">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}

                                            placeholder={language === "en" ? "Email Address" : "البريد الإلكتروني"}
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
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="phone">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
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
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="company">
                                        <Form.Label>Company Name</Form.Label>
                                        <Form.Control
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
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* <Form.Group controlId="message" className="mb-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                placeholder={language === "en" ? "Message" : "الرسالة"}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}

                                style={{
                                    flex: 1,
                                    padding: "0.5rem",
                                    fontSize: "0.875rem",
                                    border: "0px  solid #E0E0E0",
                                    borderRadius: "5px",
                                    boxShadow: "0px 4px 4px rgba(171, 171, 171, 0.2)", // Shadow based on your screenshot
                                    borderBottom: "1px solid #4CAF50",
                                    minHeight: '200px'
                                }}
                            />
                        </Form.Group> */}
                            <Form.Group controlId="message" className="mb-3">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder={language === "en" ? "Message" : "الرسالة"}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: "0.5rem",  // Reduced padding
                                        fontSize: "0.875rem",
                                        border: "0px solid #E0E0E0",
                                        borderRadius: "5px",
                                        boxShadow: "0px 4px 4px rgba(171, 171, 171, 0.2)",
                                        borderLeft: "1px solid #4CAF50",
                                        minHeight: "150px" // Adjust height if necessary
                                    }}
                                />
                            </Form.Group>

                            <button
                                onClick={handleSubmit}

                                style={{
                                    alignSelf: "flex-end",
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
                                {loading ? (
                                    <>
                                        <CircularProgress size={18} style={{ color: "white" }} />
                                        {/* <span>Loading...</span> */}
                                    </>
                                ) : (
                                    language === "en" ? "Send Message" : "إرسال الرسالة"
                                )}
                            </button>
                        </Form>
                    </Col>
                </Row>
            </Container>

            {/* </div> */}

        </>

    );
}

export default Contact;