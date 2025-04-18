import React from 'react';
import { NavItem, Navbar, Nav, NavDropdown, Form, Row, Col, FormControl, Button, Container, NavLink } from 'react-bootstrap';
import logo from '../../images/sloganLogo.png';
import { useNavigate, useLocation } from "react-router-dom";
import line from '../../images/line.webp';
import { setLogout } from "../../store/timelineSlice";
import { useDispatch } from "react-redux";
import HeaderOption from './HeaderOption'

const NavigationBar = ({ scrollToSection1, scrollToSection2 }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();

    function logOut() {
        // localStorage.removeItem("items");
        localStorage.removeItem("token");
        localStorage.removeItem("cachedData");
        dispatch(setLogout());
        navigate('/');
        window.location.reload();
    }

    function goToDashboard() {
        navigate('/dashboard');
    }

    // console.log(currentUser);
    const location = useLocation();

    // Conditional styles
    const navbarBackground =
        location.pathname === "/"
            ? "transparent"
            : "linear-gradient(90deg, #0D4873, #0A304B, #071F2D, #0C364F, #0D4873)";
    return (

        <section>

            <Navbar expand="lg" style={{
                backgroundColor: "#0d3756",
                padding: "20px 30px",
                borderRadius: "20px",
                margin: "30px 30px 0 30px",
            }}>

                <Container fluid>
                    <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        {/* <img className="logo" src={logo} alt="Logo" /> */}
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbarSupportedContent" className="custom-toggler" style={{ color: 'white' }}>
                        {/* <span className="navbar-toggler-icon"></span> */}
                    </Navbar.Toggle>

                    <Navbar.Collapse id="navbarSupportedContent">
                        <Nav className="me-auto mb-2 mb-lg-0">

                        </Nav>
                        <Form className="d-flex">

                        </Form>

                        {/* <div className='align-items-center' style={{ marginTop: '-20px' }}>
                            <HeaderOption />
                        </div> */}
                        <div className="d-flex flex-column flex-lg-row align-items-start gap-2">
                            <div className="d-lg-block d-none">
                                {/* <Button style={{ marginRight: token ? 10 : 50 }} onClick={() => navigate('/download')} className="signUpButton" type="button">Download</Button> */}
                                {!token ? (
                                    <>
                                        <Button onClick={() => navigate('/download')} className="signUpButton" type="button" style={{
                                            marginRight: '20px',
                                            fontWeight: '400', // Sinkin Sans weight
                                            fontSize: '0.8rem',
                                            fontFamily: "'Sinkin Sans', sans-serif",

                                        }}>Download</Button>
                                        <Button onClick={() => navigate('/signin')} className="btn loginButton1" type="button" style={{
                                            marginRight: '10px',
                                            fontWeight: '400', // Sinkin Sans weight
                                            fontSize: '0.8rem',  // Text size
                                            fontFamily: "'Sinkin Sans', sans-serif",
                                            borderColor: '#8CCA6B', // Border color
                                            borderWidth: '1px',    // Optional for a visible border
                                        }}>
                                            Log In / Sign Up
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => goToDashboard()} className="btn signUpButton" style={{
                                            marginRight: '0.8rem',
                                            fontWeight: '400', // Sinkin Sans weight
                                            fontSize: '0.8rem',  // Text size

                                        }} type="button">Dashboard</Button>
                                        <Button onClick={() => logOut()} className="btn loginButton1" style={{
                                            marginRight: '10px',
                                            fontWeight: '400', // Sinkin Sans weight
                                            fontSize: '0.8rem',   // Text size
                                            borderColor: '#8CCA6B', // Border color
                                            borderWidth: '1px',    // Optional for a visible border
                                        }} type="button">Log out</Button>
                                    </>
                                )}
                            </div>
                            <div className="d-lg-none d-block" style={{ color: 'white', fontWeight: 'bold' }}>

                                <NavItem>
                                    <NavLink href="#" onClick={() => navigate('/download')}>Download</NavLink>
                                </NavItem>
                                {!token ? (
                                    <>
                                        <NavItem>
                                            <NavLink href="#" onClick={() => navigate('/signin')}>Log In</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="#" onClick={() => navigate('/signup')}>Sign Up</NavLink>
                                        </NavItem>
                                    </>
                                ) : (
                                    <>
                                        <NavItem>
                                            <NavLink href="#" onClick={() => goToDashboard()}>Dashboard</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="#" onClick={() => logOut()}>Log out</NavLink>
                                        </NavItem>
                                    </>
                                )}
                            </div>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar >
        </section >
    );
};

export default NavigationBar;




