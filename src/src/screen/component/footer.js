import React from "react";
import {Navbar, Container, Row, Col } from 'react-bootstrap';
import footerLogo from '../../images/FooterLogo.png';
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdMail } from 'react-icons/io';

function Footer({ scrollToSection }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <footer className="text-white py-3" style={{ backgroundColor: '#0d3756', borderRadius: '20px' }}>
            <Container fluid>
                <Row className="align-items-center justify-content-center">
                    <Col xs={12} md={2} className="align-items-center justify-content-center text-md-left mb-3 mb-md-0">
                        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>  
                            <img width={70} src={footerLogo} alt="FooterLogo.png" className="align-items-center footerImg" />
                        </Navbar.Brand>
                    </Col>
                    <Col xs={12} md={8} className="d-flex justify-content-center justify-content-md-center mb-3 mb-md-0">
                        <div className="footerLinks d-flex flex-wrap justify-content-center text-center">
                            <p className="mx-2 mb-1" onClick={() => location.pathname === "/" ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate("/")}>Home</p>
                            <p className="mx-2 mb-1" onClick={() => location.pathname === "/" ? scrollToSection('section1') : navigate("/")}>About us</p>
                            <p className="mx-2 mb-1" onClick={() => location.pathname === "/" ? scrollToSection('section2') : navigate("/")}>Contact</p>
                            <p className="mx-2 mb-1" onClick={() => location.pathname === "/" ? scrollToSection('section3') : navigate("/")}>Pricing</p>
                            <p className="mx-2 mb-1" onClick={() => navigate("/privacy-policy")}>Privacy Policy</p>
                            <p className="mx-2 mb-1" onClick={() => navigate("/download")}>Download</p>
                        </div>
                    </Col>
                    <Col xs={12} md={2} className="text-right mb-3 mb-md-0">
                        <p className="mb-0 d-flex justify-content-end align-items-center footerLink" style={{ fontSize: "16px", textDecoration: "none" }}>
                            <IoMdMail color="#fff" size={20} style={{ marginRight: '3px' }} />
                            <a href="mailto:info@sstrack.io" className="text-white" style={{ textDecoration: "none" }}>info@sstrack.io</a>
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;
