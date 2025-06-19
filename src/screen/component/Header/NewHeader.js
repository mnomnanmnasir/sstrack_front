import React, { useState } from 'react';
import { Button, Container, Form, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from '../../../images/sloganLogo.png';
import { setLogout } from "../../../store/timelineSlice";
import NewHeaderOptions from './components/NewHeaderOptions';

const NewHeader = ({ language, handleToggleLanguage, show }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');

    const [showDrawer, setShowDrawer] = useState(false);

    function logOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("cachedData");
        dispatch(setLogout());
        navigate('/');
        window.location.reload();
    }

    function goToDashboard() {
        navigate("/dashboard");
        window.location.reload();
    }

    const navbarBackground = "linear-gradient(90deg, #0D4873, #0A304B, #071F2D, #0C364F, #0D4873)";

    return (
        <>
            <Navbar expand="lg" style={{ background: navbarBackground, padding: '0.5rem 1rem' }}>
                {/* Wrapper div to contain both rows */}
                <div className="w-100 d-flex flex-column gap-1">
                    {/* ✅ Row 1: Logo on left, Toggle + Buttons on right */}
                    <div className="d-flex justify-content-between align-items-center w-100" style={{ paddingBottom: 0 }}>
                        {/* Logo */}
                        <div style={{ flexShrink: 0 }}>
                            <img
                                className="logo"
                                src={logo}
                                alt="Logo"
                                width={150}
                                style={{ display: 'inline-block', verticalAlign: 'middle' }}
                            />
                        </div>

                        {/* Toggle + Buttons */}
                        <div className="d-none d-lg-flex align-items-center flex-wrap justify-content-end" style={{ gap: '10px' }}>
                            {/* <div className="d-none d-lg-flex align-items-center flex-wrap justify-content-end" style={{ gap: '10px' }}> */}
                            {!show && (
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label={language === 'en' ? 'العربية' : 'English'}
                                    checked={language === 'ar'}
                                    onChange={handleToggleLanguage}
                                    className="text-white"
                                />
                            )}

                            {!token ? (
                                <>
                                    <Button onClick={() => navigate('/signup')} className="btn loginButton1" style={btnStyle}>
                                        {language === "en" ? "Sign Up" : "اشتراك"}
                                    </Button>
                                    <Button onClick={() => navigate('/download')} className="signUpButton" style={btnStyle}>
                                        {language === "en" ? "Download" : "تحميل"}
                                    </Button>
                                    <Button onClick={() => navigate('/signin')} className="btn loginButton1" style={btnStyle}>
                                        {language === "en" ? "Log In" : "تسجيل الدخول"}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={goToDashboard} className="signUpButton" style={btnStyle}>
                                        {language === "en" ? "Dashboard" : "لوحة القيادة"}
                                    </Button>
                                    <Button onClick={logOut} className="btn loginButton1" style={btnStyle}>
                                        {language === "en" ? "Log out" : "تسجيل الخروج"}
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Hamburger (mobile only) */}
                        <Button
                            variant="outline-light"
                            className="d-lg-none"
                            onClick={() => setShowDrawer(true)}
                        >
                            ☰
                        </Button>
                        {/* </div> */}
                    </div>

                    {/* ✅ Row 2: Centered NewHeaderOptions */}
                    <div
                        className="w-100 d-none d-lg-flex justify-content-center"
                        style={{ position: 'relative', top: '-2px' }}
                    >
                        <NewHeaderOptions language={language} />
                    </div>
                </div>
            </Navbar>

            {showDrawer && <div className="custom-backdrop" onClick={() => setShowDrawer(false)}></div>
            }
            <Offcanvas show={showDrawer} onHide={() => setShowDrawer(false)} placement="start"
                style={{
                    background: navbarBackground,
                    color: 'white',
                    zIndex: 1052,
                }}
            >
                <Offcanvas.Header>
                    <img className="logo" src={logo} alt="Logo" width={150} />
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowDrawer(false)}
                        style={{ color: 'white', filter: 'invert(1)' }}
                    ></button>
                </Offcanvas.Header>



                <Offcanvas.Body>
                    <Nav className="d-flex flex-column align-items-start">

                        {!show && (
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label={language === 'en' ? 'العربية' : 'English'}
                                checked={language === 'ar'}
                                onChange={handleToggleLanguage}
                                className="mb-3"
                            />
                        )}

                        <NewHeaderOptions language={language} showVertical={true} />
                        {!token ? (
                            <>
                                <Button onClick={() => navigate('/signup')}
                                    style={{
                                        marginTop: '20px',
                                        backgroundColor: 'transparent',
                                        marginRight: '10px',
                                        fontWeight: '400', // Sinkin Sans weight
                                        fontSize: '0.8rem',  // Text size
                                        fontFamily: "'Sinkin Sans', sans-serif",
                                        borderColor: '#8CCA6B', // Border color
                                        borderWidth: '1px',    // Optional for a visible border
                                    }}
                                >{language === "en" ? "Sign Up" : "تسجيل الدخول"}</Button>
                                <Button onClick={() => navigate('/download')}
                                    style={{
                                        marginTop: '20px',
                                        marginRight: '20px',
                                        fontWeight: '400', // Sinkin Sans weight
                                        fontSize: '0.8rem',
                                        fontFamily: "'Sinkin Sans', sans-serif",
                                        backgroundColor: '#8CCA6B',
                                        borderWidth: '0px',
                                    }}
                                >{language === "en" ? "Download" : "تحميل"}</Button>
                                <Button onClick={() => navigate('/signin')}
                                    style={{
                                        marginTop: '20px',
                                        backgroundColor: 'transparent',
                                        marginRight: '10px',
                                        fontWeight: '400', // Sinkin Sans weight
                                        fontSize: '0.8rem',  // Text size
                                        fontFamily: "'Sinkin Sans', sans-serif",
                                        borderColor: '#8CCA6B', // Border color
                                        borderWidth: '1px',    // Optional for a visible border
                                    }}
                                >{language === "en" ? "Log In" : "تسجيل الدخول"}</Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={goToDashboard}
                                    style={{
                                        marginTop: '40px',
                                        marginRight: '20px',
                                        fontWeight: '400', // Sinkin Sans weight
                                        fontSize: '0.8rem',
                                        fontFamily: "'Sinkin Sans', sans-serif",
                                        backgroundColor: '#8CCA6B',
                                        borderWidth: '0px',
                                    }}
                                >{language === "en" ? "Dashboard" : "لوحة القيادة"}</Button>
                                <Button onClick={logOut}
                                    style={{
                                        marginTop: '20px',
                                        backgroundColor: 'transparent',
                                        marginRight: '10px',
                                        fontWeight: '400', // Sinkin Sans weight
                                        fontSize: '0.8rem',  // Text size
                                        fontFamily: "'Sinkin Sans', sans-serif",
                                        borderColor: '#8CCA6B', // Border color
                                        borderWidth: '1px',    // Optional for a visible border
                                    }}
                                >{language === "en" ? "Log Out" : "تسجيل الخروج"}</Button>
                            </>
                        )}
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

const btnStyle = {
    fontWeight: '400',
    fontSize: '0.8rem',
    fontFamily: "'Sinkin Sans', sans-serif",
    borderColor: '#8CCA6B',
    borderWidth: '1px',
    backgroundColor: 'transparent',
};

export default NewHeader;