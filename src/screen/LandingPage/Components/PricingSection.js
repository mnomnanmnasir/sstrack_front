

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

    const translations = {
        en: [
            "Unlimited users and team roles (Admin, Manager, Member)",
            "Custom API integrations",
            "Dedicated support team",
            "Onboarding assistance",
            "Priority access to new features"
        ],
        ar: [
            "عدد غير محدود من المستخدمين وأدوار الفريق",
            "تكاملات API مخصصة",
            "فريق دعم مخصص",
            "المساعدة في الإعداد",
            "الوصول الأولوي إلى الميزات الجديدة"
        ]
    };

    const isArabic = language === "ar";

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
            enqueueSnackbar("Failed to submit application. Please try again later.", { variant: "error" });
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


                {/* <Col>
        <ul className="list-unstyled card-subtitle-responsive">
            {translations[language].map((feature, index) => (
                <li key={index} className="d-flex align-items-center justify-content-center justify-content-md-start mb-2">
                    <span className="text-success me-2">✓</span> {feature}
                </li>
            ))}
        </ul>
    </Col> */}

            </Row>

            {/* Pricing Card Section */}
            <Row className="justify-content-center px-4 py-4 h-100">
                <Col xs={12} md={10} lg={10}>
                    <Card className="shadow-sm p-4 p-lg-3"
                        style={{ border: '2px solid #F0F0F0', boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.05)' }}>

                        {/* Content Row with Equal Gaps */}
                        <Row className="align-items-start justify-content-center g-4"> {/* Centered on small screens */}

                            {/* Enterprise Title & Pricing */}
                            <Col xs={12} md={3} className="text-md-start text-center d-flex flex-column">
                                <h3 className="fw-bold border-bottom pb-2">
                                    {language === "ar" ? "المؤسسة" : "Enterprise"}
                                </h3>
                                <p className="text-muted" style={{ fontSize: '14px' }}>
                                    {language === "ar" ? "الإدارة والأمان" : "Management & Security"}
                                </p>
                                <h4 style={{ color: '#000' }} className="fw-bold">
                                    $ <span style={{ color: '#7ACB59' }}>
                                        {language === "ar" ? "تسعير مخصص" : "20 / user / month"}
                                    </span>
                                </h4>

                                <h6 style={{ color: '#000' }} className="mt-3">
                                    <span className="fw-bold">
                                        {language === "ar" ? "تسعير مخصص" : "30-day free trial"}
                                    </span>
                                    <span className="text-muted">
                                        {" "}({language === "ar" ? "لا يلزم بطاقة ائتمان" : "No credit card required"})
                                    </span>
                                </h6>

                                <p className="text-muted mt-3" style={{ fontSize: '14px' }}>
                                    {language === "ar"
                                        ? "مصمم خصيصًا للمؤسسات التي لديها احتياجات معقدة—دعنا نخصص خطة لك."
                                        : "Built for enterprises with complex needs—let us customize a plan for you."}
                                </p>
                            </Col>

                            {/* Features List 1 */}
                            <Col xs={12} md={3} className="text-md-start text-center d-flex flex-column" style={{ marginTop: '3.5%' }}>
                                <p className="text-muted fw-semibold" style={{ fontSize: '15px' }}>
                                    {language === "ar" ? "يتضمن جميع ميزات خطة Pro، بالإضافة إلى:" : "Includes all Pro Plan features, plus:"}
                                </p>
                                <ul className="list-unstyled">
                                    {translations[language].map((feature, index) => (
                                        <li key={index} className="d-flex align-items-center mb-3">
                                            <span className="text-success text-md-center me-2">✓</span> {feature}
                                        </li>
                                    ))}
                                </ul>
                            </Col>

                            {/* Features List 2 */}
                            <Col xs={12} md={3} className="text-md-start text-center d-flex flex-column" style={{ marginTop: '5.5%' }}>
                                <ul className="list-unstyled">
                                    {[
                                        isArabic ? "خيارات العلامة البيضاء" : "White-labeling options (custom branding)",
                                        isArabic ? "ميزات الأمان المتقدمة" : "Advanced security features (GDPR compliance, role-based permissions)",
                                        isArabic ? "سير عمل مخصص" : "Tailored workflows and feature adjustments"
                                    ].map((feature, index) => (
                                        <li key={index} className="d-flex align-items-center mb-3">
                                            <span className="text-success me-2">✓</span> {feature}
                                        </li>
                                    ))}
                                </ul>
                            </Col>

                            {/* Contact Us Button - Centered */}
                            <Col xs={12} md={3} className="d-flex align-items-center justify-content-center" style={{ marginTop: '8%' }}>
                                <Button
                                    variant="success"
                                    className="px-4 py-2 w-70"
                                    onClick={() => setShowModal(true)}
                                    style={{
                                        backgroundColor: "#7ACB59",
                                        color: "#FFFFFF",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        borderRadius: "8px",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    {language === "ar" ? "اتصل بنا" : "Contact Us"}
                                </Button>
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
