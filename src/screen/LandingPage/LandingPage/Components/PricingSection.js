// import axios from "axios";
// import jwtDecode from "jwt-decode";
// import { SnackbarProvider, enqueueSnackbar } from "notistack";
// import React, { useEffect, useRef, useState } from "react";
// import { Form, Modal } from 'react-bootstrap';
// import { useNavigate } from "react-router-dom";

// function PricingSection({ onContactButtonClick, language }) {
//     const [showModal, setShowModal] = useState(false);
//     const token = localStorage.getItem('token');


//     const [selectedPackage, setSelectedPackage] = useState();
//     const [isloadning, setisloading] = useState(false);
//     const navigate = useNavigate()
//     const [email, setEmail] = useState();
//     const [userCount, setUserCount] = useState('');
//     const [ssstoredFor, setssstoredFor] = useState('');
//     const [PaymentPlan, setPaymentPlan] = useState('');
//     const [joinTiming, setJoinTiming] = useState(''); // New state for join timing
//     const [phoneNo, setPhone] = useState('')
//     const [companyName, setCompanyName] = useState('')
//     const handleOpenModal = () => setShowModal(true);
//     const handleCloseModal = () => setShowModal(false);
//     const handleApply2 = async () => {
//         setisloading(true)
//         if (!email || !phoneNo || !companyName || !userCount || !joinTiming) {
//             enqueueSnackbar("Please fill in all required fields.", { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } });
//             return;
//         }

//         const formData = {
//             userCounts: userCount,
//             paymentPlan: PaymentPlan, // Static value as per the context
//             contactNumber: phoneNo,
//             ssStoredFor: ssstoredFor,
//             Discount: 0, // Assuming a default value for Discount
//             totalAmount: 1000, // Replace with calculated or default value
//             approved: 'pending', // Setting approved status as false by default
//         };

//         try {
//             // Make API call with headers
//             const response = await axios.post(
//                 "https://myuniversallanguages.com:9093/api/v1/owner/requestEnterprise",
//                 formData,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             // Handle success
//             if (response.status === 200 || response.status === 201) {
//                 enqueueSnackbar("Your application has been successfully submitted", {
//                     variant: "success",
//                     anchorOrigin: { vertical: "top", horizontal: "right" },
//                 });

//                 setisloading(false)

//                 // Reset form fields
//                 // setEmail('');
//                 setssstoredFor('');
//                 setPhone('');
//                 setPaymentPlan('');
//                 setUserCount('');
//                 setJoinTiming('');
//                 handleCloseModal();
//             }
//         } catch (error) {
//             // Handle errors

//             setisloading(false)
//             enqueueSnackbar("Failed to submit application. Please try again later.", {
//                 variant: "error",
//                 anchorOrigin: { vertical: "top", horizontal: "right" },
//             });

//             console.error("API Error:", error.response ? error.response.data : error.message);
//         }
//     };
//     useEffect(() => {
//         const token = localStorage.getItem('token'); // Fetch token from localStorage

//         if (token) {
//             try {
//                 const items = jwtDecode(token); // Decode the token if it exists
//                 if (items) {
//                     if (items.email) {
//                         setEmail(items.email); // Set email state
//                     }
//                     if (items.company) {
//                         setCompanyName(items.company); // Set company name state
//                     }
//                 }
//             } catch (error) {
//                 console.log('Failed to decode token:', error);
//             }
//         } else {
//             console.log('No token available');
//         }
//     }, []);



//     const isArabic = language === "ar";
//     return (
//         <div
//             style={{
//                 width: "100%",
//                 padding: "4rem 2rem",
//                 backgroundColor: "#FFFFFF",
//                 textAlign: "center",
//             }}
//         >
//             {/* Title */}
//             <h2
//                 style={{
//                     fontSize: "44px",
//                     fontWeight: "700",
//                     color: "#3B3C4E",
//                     marginBottom: "10px",
//                 }}
//             >
//                 {language === "ar" ? "الأسعار" : "Pricing"}
//             </h2>
//             <p
//                 style={{
//                     fontSize: "16px",
//                     fontWeight: "400",
//                     color: "#555555",
//                     marginBottom: "40px",
//                 }}
//             >
//                 {language === "ar"
//                     ? "عند اختيارك ssTrack.io، فأنت لا تشتري برنامجًا فقط—بل تستثمر في الدقة والتحكم والنمو."
//                     : "When you choose ssTrack.io, you’re not just buying software—you’re investing in precision, control, and growth."}
//             </p>

//             {/* Pricing Card */}
//             <div
//                 style={{
//                     display: "flex",
//                     width: "100%",
//                     // flexDirection: language === "ar" ? 'row-reverse' : 'row',
//                     justifyContent: "center",
//                     alignItems: "center",
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "center",
//                         width: "100%",
//                         maxWidth: "1391px",
//                         padding: "2rem",
//                         backgroundColor: "#FFFFFF",
//                         borderRadius: "10px",
//                         boxShadow: "0px 5px 24px -2px rgba(0, 0, 0, 0.1)",
//                     }}
//                 >
//                     {/* Left Section */}
//                     <div
//                         style={{
//                             flex: "1",
//                             textAlign: language === "ar" ? "right" : "left",
//                             paddingRight: "2rem",
//                             display: 'flex',
//                             flexDirection: 'column',
//                             //   justifyContent:'space-between',
//                             alignItems: language === "ar" ? "flex-end" : "flex-start",
//                             // backgroundColor: 'red',
//                             // height: '400px',
//                             //   borderRight: "1px solid #E0E0E0",
//                         }}
//                     >
//                         <h3
//                             style={{
//                                 fontSize: "24px", // Updated size
//                                 fontWeight: "700", // Match the weight
//                                 fontFamily: "'Sinkin Sans', sans-serif", // Use the specified font family
//                                 color: "#3B3C4E",
//                                 marginBottom: "10px",
//                                 // backgroundColor:'orange',
//                                 width: '100%',
//                                 borderBottom: "2px solid #E0E0E0",
//                                 paddingBottom: '10px'

//                             }}
//                         >
//                             {language === "ar" ? "المؤسسة" : "Enterprise"}

//                         </h3>
//                         <p
//                             style={{
//                                 fontSize: "16px",
//                                 fontWeight: "300",
//                                 color: "#555555",
//                                 marginBottom: "30px",
//                                 // marginTop: '20px'
//                             }}
//                         >
//                             {language === "ar" ? "الإدارة والأمان" : "Management & Security"}
//                         </p>
//                         <p
//                             style={{
//                                 fontSize: "28px",
//                                 fontWeight: "700",
//                                 color: "#7ACB59",
//                                 marginBottom: "10px",
//                                 marginTop: '10px',
//                                 alignItems: 'center',
//                             }}
//                         >
//                             <span style={{
//                                 fontSize: "28px",
//                                 fontWeight: "700",
//                                 color: 'black'
//                             }}>$ </span>   {language === "ar" ? "تسعير مخصص" : "Custom Pricing"}
//                         </p>
//                         <p
//                             style={{
//                                 fontSize: "16px",
//                                 fontWeight: "300",
//                                 color: "#555555",
//                                 marginBottom: "30px",
//                             }}
//                         >
//                             {language === "ar" ? "تسعير مخصص" : "Custom Pricing"}
//                         </p>
//                         <p
//                             style={{
//                                 fontSize: "15px",
//                                 fontWeight: "300",
//                                 color: "#555555",
//                             }}
//                         >
//                             {language === "ar"
//                                 ? "مصمم خصيصًا للمؤسسات التي لديها احتياجات معقدة—دعنا نخصص خطة لك."
//                                 : "Built for enterprises with complex needs—let us customize a plan for you."}

//                         </p>
//                     </div>

//                     {/* Right Section */}
//                     <div
//                         style={{
//                             flex: "2",
//                             paddingLeft: "2rem",
//                             textAlign: language === "ar" ? "right" : "left",
//                             display: "flex",
//                             flexWrap: "wrap",
//                             gap: "2rem",
//                         }}
//                     >
//                         <p
//                             style={{
//                                 fontSize: "16px",
//                                 fontWeight: "400",
//                                 color: "#555555",
//                                 width: "100%",
//                                 // backgroundColor: 'yellow',
//                                 marginBottom: '-20px'
//                             }}
//                         >
//                             {language === "ar"
//                                 ? "يتضمن جميع ميزات خطة Pro، بالإضافة إلى:"
//                                 : "Includes all Pro Plan features, plus:"}
//                         </p>
//                         <ul
//                             style={{
//                                 listStyleType: "none",
//                                 padding: "0",
//                                 margin: "0",
//                                 flex: "1",
//                                 display: "flex",
//                                 flexDirection: 'column',
//                                 // backgroundColor: 'yellowgreen',
//                                 justifyContent: 'space-evenly'
//                             }}
//                         >
//                             {(language === "ar"
//                                 ? [
//                                     "عدد غير محدود من المستخدمين وأدوار الفريق (مسؤول، مدير، عضو)",
//                                     "تكاملات API مخصصة",
//                                     "فريق دعم مخصص",
//                                     "مساعدة في التهيئة لجميع أعضاء الفريق",
//                                     "أولوية الوصول إلى الميزات الجديدة",
//                                 ]
//                                 : [
//                                     "Unlimited users and team roles (Admin, Manager, Member)",
//                                     "Custom API integrations",
//                                     "Dedicated support team",
//                                     "Onboarding assistance for all team members",
//                                     "Priority access to new features",
//                                 ]
//                             ).map((feature, index) => (
//                                 <li
//                                     key={index}
//                                     style={{
//                                         fontSize: "14px",
//                                         fontWeight: "400",
//                                         color: "#555555",
//                                         marginBottom: "10px",
//                                         display: "flex",
//                                         alignItems: "center", // Vertically centers content
//                                         flexDirection: isArabic ? "row-reverse" : "row", // Conditional for RTL languages
//                                         justifyContent: isArabic ? "flex-start" : "flex-start", // Right alignment for Arabic
//                                     }}
//                                 >
//                                     <span
//                                         style={{
//                                             color: "#7ACB59",
//                                             fontSize: "18px",
//                                             marginRight: isArabic ? "0" : "10px", // Moves the checkmark to the left for Arabic
//                                             marginLeft: isArabic ? "10px" : "0", // Moves the checkmark to the right for Arabic
//                                             display: "flex",
//                                             alignItems: "center",
//                                         }}
//                                     >
//                                         ✓
//                                     </span>
//                                     {feature}
//                                 </li>
//                             ))}
//                         </ul>
//                         <ul
//                             style={{
//                                 listStyleType: "none",
//                                 padding: "0",
//                                 margin: "0",
//                                 flex: "1",
//                                 display: "flex",
//                                 flexDirection: 'column',
//                                 // alignItems: "center",
//                                 justifyContent: 'space-evenly'
//                             }}
//                         >
//                             {(language === "ar"
//                                 ? [
//                                     "خيارات العلامة البيضاء (تخصيص العلامة التجارية)",
//                                     "ميزات أمان متقدمة (التوافق مع GDPR، أذونات مستندة إلى الأدوار)",
//                                     "تعديلات سير العمل والميزات المخصصة",
//                                 ]
//                                 : [
//                                     "White-labeling options (custom branding)",
//                                     "Advanced security features (GDPR compliance, role-based permissions)",
//                                     "Tailored workflows and feature adjustments",
//                                 ]
//                             ).map((feature, index) => (
//                                 <li
//                                     key={index}
//                                     style={{
//                                         fontSize: "14px",
//                                         fontWeight: "400",
//                                         color: "#555555",
//                                         marginBottom: "10px",
//                                         display: "flex",
//                                         alignItems: "center", // Vertically centers content
//                                         flexDirection: isArabic ? "row-reverse" : "row", // Conditional for RTL languages
//                                         justifyContent: isArabic ? "flex-start" : "flex-start", // Right alignment for Arabic
//                                     }}
//                                 >
//                                     <span
//                                         style={{
//                                             color: "#7ACB59",
//                                             fontSize: "18px",
//                                             marginRight: isArabic ? "0" : "10px", // Moves the checkmark to the left for Arabic
//                                             marginLeft: isArabic ? "10px" : "0", // Moves the checkmark to the right for Arabic
//                                             display: "flex",
//                                             alignItems: "center",
//                                         }}
//                                     >
//                                         ✓
//                                     </span>
//                                     {feature}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>


//                     {/* CTA Button */}
//                     <div
//                         style={{
//                             flex: "1",
//                             textAlign: "center",
//                         }}
//                     >
//                         <button
//                             style={{
//                                 backgroundColor: "#7ACB59",
//                                 color: "#FFFFFF",
//                                 fontSize: "16px",
//                                 fontWeight: "600",
//                                 padding: "15px 50px",
//                                 borderRadius: "8px",
//                                 border: "none",
//                                 cursor: "pointer",
//                                 marginTop: "30px",
//                             }}
//                             onClick={handleOpenModal}
//                         >
//                             {isArabic ? "اتصل بنا" : "Contact Us"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             {/* Modal for applying */}
//             <Modal
//                 show={showModal}
//                 onHide={handleCloseModal}
//                 centered
//                 dialogClassName="modal-lg"
//             >

//                 <Modal.Header closeButton>
//                     <Modal.Title>Apply for Enterprise Plan</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {token ? ( // Check if token is available
//                         <>
//                             <p className="text-muted">
//                                 Fill out the details below to apply for the Enterprise Plan.
//                             </p>
//                             <Form>
//                                 <Form.Group controlId="formEmail">
//                                     <Form.Label>Email</Form.Label>
//                                     <Form.Control
//                                         required
//                                         type="email"
//                                         placeholder="Enter your email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         className="w-100"
//                                     // readOnly
//                                     />
//                                 </Form.Group>
//                                 <Form.Group controlId="formPhone" className="mt-3">
//                                     <Form.Label>Phone Number</Form.Label>
//                                     <Form.Control
//                                         required
//                                         type="tel"
//                                         placeholder="Enter your phone number"
//                                         value={phoneNo}
//                                         onChange={(e) => setPhone(e.target.value)}
//                                         className="w-100"
//                                     />
//                                 </Form.Group>
//                                 <Form.Group controlId="formCompanyName" className="mt-3">
//                                     <Form.Label>Company Name</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         placeholder="Enter your company name"
//                                         value={companyName}
//                                         onChange={(e) => setCompanyName(e.target.value)}
//                                         className="w-100"
//                                     // readOnly
//                                     />
//                                 </Form.Group>
//                                 <Form.Group controlId="formSSStoredFor" className="mt-3">
//                                     <Form.Label>Sreen Shot Stored For</Form.Label>
//                                     <div className="position-relative">
//                                         <Form.Control
//                                             as="select"
//                                             value={ssstoredFor}
//                                             onChange={(e) => setssstoredFor(e.target.value)}
//                                             className="w-100 pe-4"
//                                             style={{ paddingRight: '2.5rem' }}
//                                         >
//                                             <option value="">select Payment Plan duration</option>
//                                             <option value="6 months">6 months</option>
//                                             <option value="1 year">1 year</option>
//                                             <option value="2 year">2 year</option>
//                                         </Form.Control>
//                                         <span
//                                             className="position-absolute"
//                                             style={{
//                                                 top: '50%',
//                                                 right: '1rem',
//                                                 transform: 'translateY(-50%)',
//                                                 pointerEvents: 'none',
//                                             }}
//                                         >
//                                             <i className="bi bi-chevron-down"></i>
//                                         </span>
//                                     </div>
//                                 </Form.Group>
//                                 <Form.Group controlId="formPaymentPlan" className="mt-3">
//                                     <Form.Label>Payment Plan</Form.Label>
//                                     <div className="position-relative">
//                                         <Form.Control
//                                             as="select"
//                                             value={PaymentPlan}
//                                             onChange={(e) => setPaymentPlan(e.target.value)}
//                                             className="w-100 pe-4"
//                                             style={{ paddingRight: '2.5rem' }}
//                                         >
//                                             <option value="">select Payment Plan duration</option>
//                                             <option value="6 months">6 months</option>
//                                             <option value="1 year">1 year</option>
//                                             <option value="2 year">2 year</option>
//                                         </Form.Control>
//                                         <span
//                                             className="position-absolute"
//                                             style={{
//                                                 top: '50%',
//                                                 right: '1rem',
//                                                 transform: 'translateY(-50%)',
//                                                 pointerEvents: 'none',
//                                             }}
//                                         >
//                                             <i className="bi bi-chevron-down"></i>
//                                         </span>
//                                     </div>
//                                 </Form.Group>
//                                 <Form.Group controlId="formUserCount" className="mt-3">
//                                     <Form.Label>Number of Employees</Form.Label>
//                                     <div className="position-relative">
//                                         <Form.Control
//                                             as="select"
//                                             value={userCount}
//                                             onChange={(e) => setUserCount(e.target.value)}
//                                             className="w-100 pe-4"
//                                             style={{ paddingRight: '2.5rem' }}
//                                         >
//                                             <option value="">Select number of employees</option>
//                                             <option value="50-100">50 - 100</option>
//                                             <option value="100-200">100 - 200</option>
//                                             <option value="250-300">200 - 300</option>
//                                         </Form.Control>
//                                         <span
//                                             className="position-absolute"
//                                             style={{
//                                                 top: '50%',
//                                                 right: '1rem',
//                                                 transform: 'translateY(-50%)',
//                                                 pointerEvents: 'none',
//                                             }}
//                                         >
//                                             <i className="bi bi-chevron-down"></i>
//                                         </span>
//                                     </div>
//                                 </Form.Group>
//                                 <Form.Group controlId="formJoinTiming" className="mt-3">
//                                     <Form.Label>When would you like to join?</Form.Label>
//                                     <div className="position-relative">
//                                         <Form.Control
//                                             as="select"
//                                             value={joinTiming}
//                                             onChange={(e) => setJoinTiming(e.target.value)}
//                                             className="w-100 pe-4"
//                                             style={{ paddingRight: '2.5rem' }}
//                                         >
//                                             <option value="">Select joining time</option>
//                                             <option value="immediately">Immediately</option>
//                                             <option value="1 month">In 1 month</option>
//                                             <option value="2 months">In 2 months</option>
//                                         </Form.Control>
//                                         <span
//                                             className="position-absolute"
//                                             style={{
//                                                 top: '50%',
//                                                 right: '1rem',
//                                                 transform: 'translateY(-50%)',
//                                                 pointerEvents: 'none',
//                                             }}
//                                         >
//                                             <i className="bi bi-chevron-down"></i>
//                                         </span>
//                                     </div>
//                                 </Form.Group>
//                             </Form>
//                         </>
//                     ) : (
//                         <p className="fs-5 text-center" style={{ color: "#7ACB59" }}>Please login first to apply for the Enterprise Plan.</p>
//                     )}
//                 </Modal.Body>
//                 {token &&
//                     <Modal.Footer className="d-flex justify-content-center">
//                         <button
//                             className="btn "
//                             style={{ width: '70%', height: '45px', backgroundColor: '#7ACB59', color: "white" }}
//                             onClick={handleApply2}
//                             disabled={isloadning} // Disable the button when loading
//                         >
//                             {isloadning ? (
//                                 <span
//                                     className="spinner-border spinner-border-sm"
//                                     role="status"
//                                     aria-hidden="true"
//                                 ></span>
//                             ) : (
//                                 'Apply'
//                             )}
//                         </button>

//                     </Modal.Footer>
//                 }
//             </Modal>
//         </div>
//     );
// }

// export default PricingSection;

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function PricingSection({ language }) {
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Form State
    const [email, setEmail] = useState("");
    const [phoneNo, setPhone] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [userCount, setUserCount] = useState("");
    const [ssStoredFor, setSsStoredFor] = useState("");
    // const [paymentPlan, setPaymentPlan] = useState("");
    const [joinTiming, setJoinTiming] = useState("");
    const [selectedPackage, setSelectedPackage] = useState();
    const [isloadning, setisloading] = useState(false);
    // const navigate = useNavigate()
    // const [email, setEmail] = useState();
    // const [userCount, setUserCount] = useState('');
    const [ssstoredFor, setssstoredFor] = useState('');
    const [PaymentPlan, setPaymentPlan] = useState('');
    // const [joinTiming, setJoinTiming] = useState(''); // New state for join timing
    // const [phoneNo, setPhone] = useState('')
    // const [companyName, setCompanyName] = useState('')
    useEffect(() => {
        if (token) {
            try {
                const userData = jwtDecode(token);
                if (userData) {
                    setEmail(userData.email || "");
                    setCompanyName(userData.company || "");
                }
            } catch (error) {
                console.log("Failed to decode token:", error);
            }
        }
    }, []);

    const handleApply = async () => {
        setIsLoading(true);
        if (!email || !phoneNo || !companyName || !userCount || !joinTiming) {
            // enqueueSnackbar("Please fill in all required fields.", { variant: "error" });
            enqueueSnackbar("Please fill in all required fields.", { variant: "error", anchorOrigin: { vertical: "top", horizontal: "right" } });
            setIsLoading(false);
            return;
        }

        const formData = {
            userCounts: userCount,
            paymentPlan: PaymentPlan,
            contactNumber: phoneNo,
            ssStoredFor: ssStoredFor,
            Discount: 0,
            totalAmount: 1000,
            approved: "pending",
        };

        try {
            const response = await axios.post(
                "https://myuniversallanguages.com:9093/api/v1/owner/requestEnterprise",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                // enqueueSnackbar("Your application has been successfully submitted", { variant: "success" });
                enqueueSnackbar("Your application has been successfully submitted", { variant: "success", anchorOrigin: { vertical: "top", horizontal: "right" } });
                setShowModal(false);
                setPhone("");
                setPaymentPlan("");
                setUserCount("");
                setJoinTiming("");
                setSsStoredFor("");
            }
        } catch (error) {
            enqueueSnackbar(error.response ? error.response.data : error.message, { variant: "error" });
            console.error("API Error:", error.response ? error.response.data : error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container fluid className="bg-white py-5">
            {/* Title */}
            <Row className="text-center">
                <Col>
                    <h2 className="fw-bold text-dark card-title-responsive">{language === "ar" ? "الأسعار" : "Pricing"}</h2>
                    <p className="text-muted card-subtitle-responsive">
                        {language === "ar"
                            ? "عند اختيارك ssTrack.io، فأنت لا تشتري برنامجًا فقط—بل تستثمر في الدقة والتحكم والنمو."
                            : "When you choose ssTrack.io, you’re not just buying software—you’re investing in precision, control, and growth."}
                    </p>
                </Col>
            </Row>

            {/* Pricing Card Section */}
            <Row className="justify-content-center">
                <Col xs={12} lg={10}>
                    <Card className="shadow-sm p-4 border-light">
                        <Row className="align-items-center">
                            {/* Left Section */}
                            <Col xs={12} md={5} className="text-md-start text-center mb-4 mb-md-0">
                                <h3 className="fw-bold border-bottom pb-2 card-title-responsive">{language === "ar" ? "المؤسسة" : "Enterprise"}</h3>
                                <p className="text-muted card-subtitle-responsive">{language === "ar" ? "الإدارة والأمان" : "Management & Security"}</p>
                                <h4 className="text-success fw-bold card-title-responsive">
                                    ${language === "ar" ? "تسعير مخصص" : "Custom Pricing"}
                                </h4>
                                <p className="text-muted card-subtitle-responsive">
                                    {language === "ar"
                                        ? "مصمم خصيصًا للمؤسسات التي لديها احتياجات معقدة—دعنا نخصص خطة لك."
                                        : "Built for enterprises with complex needs—let us customize a plan for you."}
                                </p>
                            </Col>

                            {/* Right Section */}
                            <Col xs={12} md={7} className="text-md-start text-center mb-4 mb-md-0">
                                <p className="text-muted card-subtitle-responsive">{language === "ar" ? "يتضمن جميع ميزات خطة Pro، بالإضافة إلى:" : "Includes all Pro Plan features, plus:"}</p>
                                <Row >
                                    <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-start text-center text-md-start">
                                        <ul className="list-unstyled card-subtitle-responsive">
                                            {[
                                                "Unlimited users and team roles",
                                                "Custom API integrations",
                                                "Dedicated support team",
                                                "Onboarding assistance",
                                                "Priority access to new features",
                                            ].map((feature, index) => (
                                                <li key={index} className="d-flex align-items-center justify-content-center justify-content-md-start mb-2">
                                                    <span className="text-success me-2">✓</span> {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </Col>
                                    <Col xs={12} md={6} className="d-flex justify-content-center justify-content-md-start text-center text-md-start">
                                        <ul className="list-unstyled card-subtitle-responsive">
                                            {[
                                                "White-labeling options",
                                                "Advanced security features",
                                                "Tailored workflows",
                                            ].map((feature, index) => (
                                                <li key={index} className="d-flex align-items-center mb-2">
                                                    <span className="text-success me-2">✓</span> {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </Col>
                                </Row>

                                {/* CTA Button */}
                                <div className="text-center text-md-start">
                                    <Button variant="success" className="mt-3 card-title-responsive" onClick={() => setShowModal(true)}
                                        style={{
                                            backgroundColor: "#7ACB59",
                                            color: "#FFFFFF",
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            padding: "10px 20px",
                                            borderRadius: "8px",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {language === "ar" ? "اتصل بنا" : "Contact Us"}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            {/* Modal Form */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{language === "ar" ? "طلب خطة المؤسسة" : "Apply for Enterprise Plan"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {token ? ( // Check if token is available
                        <>
                            <p className="text-muted">
                                Fill out the details below to apply for the Enterprise Plan.
                            </p>
                            <Form>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-100"
                                    // readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPhone" className="mt-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        required
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={phoneNo}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-100"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formCompanyName" className="mt-3">
                                    <Form.Label>Company Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your company name"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="w-100"
                                    // readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="formSSStoredFor" className="mt-3">
                                    <Form.Label>Sreen Shot Stored For</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            as="select"
                                            value={ssstoredFor}
                                            onChange={(e) => setssstoredFor(e.target.value)}
                                            className="w-100 pe-4"
                                            style={{ paddingRight: '2.5rem' }}
                                        >
                                            <option value="">select Payment Plan duration</option>
                                            <option value="6 months">6 months</option>
                                            <option value="1 year">1 year</option>
                                            <option value="2 year">2 year</option>
                                        </Form.Control>
                                        <span
                                            className="position-absolute"
                                            style={{
                                                top: '50%',
                                                right: '1rem',
                                                transform: 'translateY(-50%)',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            <i className="bi bi-chevron-down"></i>
                                        </span>
                                    </div>
                                </Form.Group>
                                <Form.Group controlId="formPaymentPlan" className="mt-3">
                                    <Form.Label>Payment Plan</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            as="select"
                                            value={PaymentPlan}
                                            onChange={(e) => setPaymentPlan(e.target.value)}
                                            className="w-100 pe-4"
                                            style={{ paddingRight: '2.5rem' }}
                                        >
                                            <option value="">select Payment Plan duration</option>
                                            <option value="6 months">6 months</option>
                                            <option value="1 year">1 year</option>
                                            <option value="2 year">2 year</option>
                                        </Form.Control>
                                        <span
                                            className="position-absolute"
                                            style={{
                                                top: '50%',
                                                right: '1rem',
                                                transform: 'translateY(-50%)',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            <i className="bi bi-chevron-down"></i>
                                        </span>
                                    </div>
                                </Form.Group>
                                <Form.Group controlId="formUserCount" className="mt-3">
                                    <Form.Label>Number of Employees</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            as="select"
                                            value={userCount}
                                            onChange={(e) => setUserCount(e.target.value)}
                                            className="w-100 pe-4"
                                            style={{ paddingRight: '2.5rem' }}
                                        >
                                            <option value="">Select number of employees</option>
                                            <option value="50-100">50 - 100</option>
                                            <option value="100-200">100 - 200</option>
                                            <option value="250-300">200 - 300</option>
                                        </Form.Control>
                                        <span
                                            className="position-absolute"
                                            style={{
                                                top: '50%',
                                                right: '1rem',
                                                transform: 'translateY(-50%)',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            <i className="bi bi-chevron-down"></i>
                                        </span>
                                    </div>
                                </Form.Group>
                                <Form.Group controlId="formJoinTiming" className="mt-3">
                                    <Form.Label>When would you like to join?</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            as="select"
                                            value={joinTiming}
                                            onChange={(e) => setJoinTiming(e.target.value)}
                                            className="w-100 pe-4"
                                            style={{ paddingRight: '2.5rem' }}
                                        >
                                            <option value="">Select joining time</option>
                                            <option value="immediately">Immediately</option>
                                            <option value="1 month">In 1 month</option>
                                            <option value="2 months">In 2 months</option>
                                        </Form.Control>
                                        <span
                                            className="position-absolute"
                                            style={{
                                                top: '50%',
                                                right: '1rem',
                                                transform: 'translateY(-50%)',
                                                pointerEvents: 'none',
                                            }}
                                        >
                                            <i className="bi bi-chevron-down"></i>
                                        </span>
                                    </div>
                                </Form.Group>
                            </Form>
                        </>
                    ) : (
                        <p className="fs-5 text-center" style={{ color: "#7ACB59" }}>Please login first to apply for the Enterprise Plan.</p>
                    )}
                </Modal.Body>
                {token && (
                    <Modal.Footer>
                        <Button variant="success" onClick={handleApply} disabled={isLoading}>
                            {isLoading ? "Applying..." : "Apply"}
                        </Button>
                    </Modal.Footer>
                )}
            </Modal>
        </Container>
    );
}

export default PricingSection;
