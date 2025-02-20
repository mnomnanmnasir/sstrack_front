import React, { useEffect, useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { IoMdMail } from 'react-icons/io';
import logo from '../../images/ss-track-logo.svg';
import { useLocation, useNavigate, Link } from "react-router-dom";

function Footer() {
    const location = useLocation();
    const [email, setEmail] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSignUp = () => {
        // Navigate to /signup and pass email in the state or as a query param
        navigate("/signup", { state: { email } });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSignUp();
        }
    };
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth',
            });
        }
    };
    // Listen for changes in the route and scroll if the state includes `scrollTo`
    useEffect(() => {
        if (location.state?.scrollTo) {
            scrollToSection(location.state.scrollTo);
        }
    }, [location]);

    const navigate = useNavigate();
    return (
        <footer
            className="text-white py-5"
            style={{
                background: 'linear-gradient(90deg, #0D4873, #0A304B, #071F2D, #0C364F, #0D4873)',
                width: '100%',
                minHeight: '50vh'

            }}
        >
            <Container>
                <Row className="mb-4 justify-content-center">
                    {/* Product Section */}
                    <Col xs={12} sm={6} lg={3}>
                        <h5 className="mb-3" style={{ fontSize: '16px' }}>Product</h5>
                        <ul className="list-unstyled" >
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="https://chromewebstore.google.com/detail/sstrack/gkmllhjndmaaapegaopkpapaamfaeckg?hl=en-US" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Chrome Extension</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/download" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Desktop Application</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="https://play.google.com/store/apps/details?id=com.SSTRACK&pcampaignid=web_share" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Mobile Application</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Integrations</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a
                                    href="/"
                                    style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (window.location.pathname !== "/") {
                                            navigate("/", { state: { scrollTo: "faq" } });
                                        } else {
                                            scrollToSection('pricing'); // Call the scroll function if already on homepage
                                        }
                                    }}
                                >
                                    Pricing <span className="badge badge-success">Free trial</span>
                                </a>
                            </li>

                        </ul>
                    </Col>

                    {/* Features Section */}
                    <Col xs={12} sm={6} lg={3}>
                        <h5 className="mb-3" style={{ fontSize: '16px' }}>Features</h5>
                        <ul className="list-unstyled">
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Time tracker with screenshots</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Employee timesheet software</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>GPS time clock</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Overtime tracker</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Time reporting</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Attendance tracker</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Web-based time tracker</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Activity log app</a>
                            </li>
                        </ul>

                    </Col>

                    {/* Solutions Section */}
                    {/* <Col xs={6} md={2}>
                        <h5 className="mb-3" style={{ fontSize: '16px' }}>Solutions</h5>
                        <h6 className="mb-2" style={{ fontSize: '15px', fontWeight: 'bold' }}>By Industry</h6>
                        <ul className="list-unstyled">
                            <li style={{ fontSize: '12px', marginBottom: '0.6rem' }}>Agencies</li>
                            <li style={{ fontSize: '12px', marginBottom: '0.6rem' }}>Software Development</li>
                            <li style={{ fontSize: '12px', marginBottom: '0.6rem' }}>Consulting</li>
                            <li style={{ fontSize: '12px', marginBottom: '0.6rem' }}>See all industries</li>
                        </ul>
                        <h6 className="mt-3 mb-2" style={{ fontSize: '15px', fontWeight: 'bold' }}>By Workforce</h6>
                        <ul className="list-unstyled">
                            <li style={{ fontSize: '12px', marginBottom: '0.6rem' }}>Fully remote</li>
                            <li style={{ fontSize: '12px', marginBottom: '0.6rem' }}>Hybrid</li>
                            <li style={{ fontSize: '12px', marginBottom: '0.6rem' }}>Field</li>
                        </ul>
                    </Col> */}

                    {/* Company Section */}
                    <Col xs={12} sm={6} lg={3}>
                        <h5 className="mb-3" style={{ fontSize: '16px' }}>Company</h5>
                        <ul className="list-unstyled">
                            <li style={{ marginBottom: '0.6rem' }}>
                                <Link to="/aboutUs" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>About Us</Link>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/#" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (window.location.pathname !== "/") {
                                            navigate("/", { state: { scrollTo: "section3" } });
                                        } else {
                                            scrollToSection('section3'); // Call the scroll function if already on homepage
                                        }
                                    }}>Contact Us</a>
                            </li>
                            
                            <li style={{ marginBottom: '0.6rem' }}>
                                <Link to="/privacy-policy" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Prvacy Policy</Link>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/#" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (window.location.pathname !== "/") {
                                            navigate("/", { state: { scrollTo: "faq" } });
                                        } else {
                                            scrollToSection('faq'); // Call the scroll function if already on homepage
                                        }
                                    }}
                                >FAQ</a>
                            </li>
                        </ul>
                        <h5 className="mb-3" style={{ fontSize: '16px', marginTop: '2rem' }}>Apps Download</h5>
                        <ul className="list-unstyled">
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/download" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Windows time tracker</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/download" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Android time tracker</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/download" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>iOS time tracker</a>
                            </li>
                        </ul>
                    </Col>
                    {/* Signup Section */}
                    <Col xs={12} sm={6} lg={3}>
                        <h4 style={{ fontWeight: '500' }}>Ready to get started?</h4>
                        <div className="d-flex flex-column">
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                onKeyDown={handleKeyPress}
                                placeholder="Enter your work email"
                                className="form-control me-2"
                                style={{ Width: '300px', marginBottom: '10px', fontSize: '12px' }}
                            />

                            <button
                                className="btn"
                                onClick={handleSignUp}
                                style={{ backgroundColor: '#7ACB59', color: 'white', fontSize: '12px', textAlign: 'center', width: '100%' }}
                            >
                                Sign Up
                            </button>

                        </div>
                        <img
                            className='logo'
                            src={logo}
                            alt="SS Track.io"
                            style={{ marginLeft: '5px', marginTop: '30px' }}
                            width={150}
                        />
                    </Col>

                </Row>



                {/* Bottom Row */}
                <Row>
                    <Col>
                        <p
                            className="text-center mb-0"
                            style={{
                                fontSize: "12px",
                                marginTop: "10%",
                            }}
                        >
                            © All Rights Reserved 2025 SS Track.io
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;










// import React, { useEffect } from "react";
// import { Container, Row, Col } from 'react-bootstrap';
// import logo from '../../images/ss-track-logo.svg';
// import { useNavigate, Link } from "react-router-dom";

// const Footer = ({ language }) => {
//     const navigate = useNavigate();

//     // Debugging: Check if language updates correctly
//     useEffect(() => {
//         console.log("Current Language in Footer:", language);
//     }, [language]); // Runs when language changes

//     const translations = {
//         en: {
//             product: "Product",
//             chromeExtension: "Chrome Extension",
//             desktopApp: "Desktop Application",
//             mobileApp: "Mobile Application",
//             integrations: "Integrations",
//             pricing: "Pricing",
//             freeTrial: "Free trial",
//             company: "Company",
//             aboutUs: "About Us",
//             contactUs: "Contact Us",
//             partners: "Partners",
//             faq: "FAQ",
//             readyToStart: "Ready to get started?",
//             signUp: "Sign Up",
//             allRightsReserved: "© All Rights Reserved 2025 SS Track.io",
//         },
//         ar: {
//             product: "المنتج",
//             chromeExtension: "إضافة كروم",
//             desktopApp: "تطبيق سطح المكتب",
//             mobileApp: "تطبيق الهاتف المحمول",
//             integrations: "التكاملات",
//             pricing: "الأسعار",
//             freeTrial: "تجربة مجانية",
//             company: "الشركة",
//             aboutUs: "من نحن",
//             contactUs: "اتصل بنا",
//             partners: "الشركاء",
//             faq: "الأسئلة الشائعة",
//             readyToStart: "هل أنت جاهز للبدء؟",
//             signUp: "اشترك",
//             allRightsReserved: "© جميع الحقوق محفوظة 2025 SS Track.io",
//         }
//     };

//     // Select translations based on the language state
//     const t = translations[language || "en"]; 

//     return (
//         <footer className="text-white py-5" style={{ background: 'linear-gradient(90deg, #0D4873, #0A304B, #071F2D, #0C364F, #0D4873)', width: '100%', minHeight: '50vh' }}>
//             <Container>
//                 <Row className="mb-4 justify-content-center">
//                     {/* Product Section */}
//                     <Col xs={12} sm={6} lg={3}>
//                         <h5 className="mb-3">{t.product}</h5>
//                         <ul className="list-unstyled">
//                             <li><a href="https://chromewebstore.google.com" style={{ color: 'white', textDecoration: 'none' }}>{t.chromeExtension}</a></li>
//                             <li><a href="/download" style={{ color: 'white', textDecoration: 'none' }}>{t.desktopApp}</a></li>
//                             <li><a href="https://play.google.com" style={{ color: 'white', textDecoration: 'none' }}>{t.mobileApp}</a></li>
//                         </ul>
//                     </Col>

//                     {/* Company Section */}
//                     <Col xs={12} sm={6} lg={3}>
//                         <h5 className="mb-3">{t.company}</h5>
//                         <ul className="list-unstyled">
//                             <li><Link to="/aboutUs" style={{ color: 'white', textDecoration: 'none' }}>{t.aboutUs}</Link></li>
//                             <li><a href="/#" style={{ color: 'white', textDecoration: 'none' }}>{t.contactUs}</a></li>
//                         </ul>
//                     </Col>

//                     {/* Signup Section */}
//                     <Col xs={12} sm={6} lg={3}>
//                         <h4>{t.readyToStart}</h4>
//                         <div className="d-flex flex-column">
//                             <button className="btn" onClick={() => navigate("/signup")} style={{ backgroundColor: '#8CCA6B', color: 'white' }}>{t.signUp}</button>
//                         </div>
//                         <img className='logo' src={logo} alt="SS Track.io" width={150} />
//                     </Col>
//                 </Row>

//                 {/* Bottom Row */}
//                 <Row>
//                     <Col>
//                         <p className="text-center mb-0" style={{ fontSize: "12px" }}>
//                             {t.allRightsReserved}
//                         </p>
//                     </Col>
//                 </Row>
//             </Container>
//         </footer>
//     );
// };

// export default Footer;

