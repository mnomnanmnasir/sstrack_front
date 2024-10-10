import React from 'react';
import { NavItem, Navbar, Nav, NavDropdown, Form, Row, Col, FormControl, Button, Container, NavLink } from 'react-bootstrap';
import logo from '../../images/ss-track-logo.svg';
import { useNavigate, useLocation } from "react-router-dom";
import line from '../../images/line.webp';
import { setLogout } from "../../store/timelineSlice";
import { useDispatch } from "react-redux";
import HeaderOption from './HeaderOption'

const NavigationBar = ({ scrollToSection1, scrollToSection2 }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('items'));
    const dispatch = useDispatch();

    function logOut() {
        localStorage.removeItem("items");
        localStorage.removeItem("token");
        localStorage.removeItem("cachedData");
        dispatch(setLogout());
        navigate('/');
        window.location.reload();
    }

    function goToDashboard() {
        navigate('/dashboard');
    }

    console.log(currentUser);
    const location = useLocation();

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
                        <img className="logo" src={logo} alt="Logo" />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbarSupportedContent" className="custom-toggler" style={{ color: 'white' }}>
                        {/* <span className="navbar-toggler-icon"></span> */}
                    </Navbar.Toggle>
                    {/* <HeaderOption /> */}
                    <Navbar.Collapse id="navbarSupportedContent">
                        <Nav className="me-auto mb-2 mb-lg-0">
                            {/* <Nav.Link href="#" className="active" aria-current="page">Home</Nav.Link>
                            <Nav.Link href="#">Link</Nav.Link>
                            <NavDropdown title="Dropdown" id="navbarDropdown">
                                <NavDropdown.Item href="#">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#">Another action</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#">Something else here</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="#" disabled tabIndex="-1" aria-disabled="true">Disabled</Nav.Link> */}

                        </Nav>
                        <Form className="d-flex">
                            {/* <FormControl type="search" placeholder="Search" className="me-2" aria-label="Search" />
                            <Button variant="outline-success" type="submit">Search</Button> */}
                        </Form>
                        {/* <HeaderOption /> */}

                        <div className='align-items-center' style={{marginTop: '-20px'}}>
                            <HeaderOption />
                        </div>
                        <div className="d-flex flex-column flex-lg-row align-items-start gap-2">
                            <div className="d-lg-block d-none">
                                <Button style={{ marginRight: token ? 10 : 50 }} onClick={() => navigate('/download')} className="signUpButton" type="button">Download</Button>
                                {!token ? (
                                    <>
                                        <Button onClick={() => navigate('/signin')} className="btn loginButton1" type="button" style={{ marginRight: '10px', fontWeight: 'bold' }}>Log In</Button>
                                        <Button onClick={() => navigate('/signup')} className="signUpButton" type="button">Sign Up</Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => goToDashboard()} className="btn loginButton1" style={{ marginRight: '10px' }} type="button">Dashboard</Button>
                                        <Button onClick={() => logOut()} className="btn signUpButton" type="button">Log out</Button>
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




