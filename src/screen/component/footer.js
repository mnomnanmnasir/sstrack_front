import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { IoMdMail } from 'react-icons/io';
import logo from '../../images/ss-track-logo.svg';
import { useNavigate } from "react-router-dom";

function Footer() {
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth',
            });
        }
    };

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
            <Row className="mb-4 justify-content-center g-4">
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
                                <a href="/integrations" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Integrations</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/#" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }} onClick={(e) => {
                                    e.preventDefault(); // Prevent default anchor behavior
                                    scrollToSection('pricing'); // Call the scroll function
                                }}>
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
                                <a href="//signup" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Activity log app</a>
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
                                <a href="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>About Us</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/#" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }} onClick={(e) => {
                                    e.preventDefault(); // Prevent default anchor behavior
                                    scrollToSection('section3'); // Call the scroll function
                                }}>Contact Us</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/partners" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>Partners</a>
                            </li>
                            <li style={{ marginBottom: '0.6rem' }}>
                                <a href="/#" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }} onClick={(e) => {
                                    e.preventDefault(); // Prevent default anchor behavior
                                    scrollToSection('faq'); // Call the scroll function
                                }}>FAQ</a>
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

                                placeholder="Enter your work email"
                                className="form-control me-2"
                                style={{ Width: '300px', marginBottom: '10px', fontSize: '12px' }}
                            />
                            <button className="btn " style={{ backgroundColor: '#7ACB59', color: 'white', fontSize: '12px', textAlign: 'center' }} onClick={() => navigate("/signup")}>Sign Up</button>
                        </div>
                        <img
                            src={logo}
                            alt="SS Track.io"
                            style={{ minWidth: '250px', marginTop: '30px' }}
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
