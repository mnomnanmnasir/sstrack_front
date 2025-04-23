import React, { useEffect, useRef, useState } from "react";
import menu from "../../images/menu.webp";
import loader from "../../images/Rectangle.webp";
import check from "../../images/check.webp";
import circle from "../../images/circle.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from '../../images/ss-track-logo.svg';
import { useDispatch } from "react-redux";
import { useSocket } from '../../io'; // Correct import
import axios from "axios";
import { setToken } from "../../store/authSlice";
import { Modal } from "bootstrap";
import { FaBars } from "react-icons/fa";


function UserDashboardSection(params) {

    // const navigate = useNavigate();
    const location = useLocation();
    const items = JSON.parse(localStorage.getItem('items'));
    const modalInstance = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const modalRef = useRef(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const user = JSON.parse(localStorage.getItem('items'));
    const [showContent, setShowContent] = useState(false);
    const [userType, setUserType] = useState(user?.userType);
    const navigate = useNavigate("");
    const dispatch = useDispatch()
    const [showDemoModal, setShowDemoModal] = useState(false);
    const socket = useSocket()
    let token = localStorage.getItem('token');
    let headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
    }
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const wordsAfterSpace = user?.name?.split(" ")[1] ? user?.name?.split(" ")[1].charAt(0).toUpperCase() : "";
    const capitalizedWord = user?.name?.charAt(0).toUpperCase();

    // Bootstrap Modal initialization and control
    useEffect(() => {
        if (modalRef.current) {
            modalInstance.current = new Modal(modalRef.current, {
                backdrop: true,
                keyboard: true,
            });

            if (showDemoModal) {
                modalInstance.current.show();
            } else {
                modalInstance.current.hide();
            }

            const onHidden = () => setShowDemoModal(false);
            modalRef.current.addEventListener("hidden.bs.modal", onHidden);

            return () => {
                modalRef.current?.removeEventListener("hidden.bs.modal", onHidden);
            };
        }
    }, [showDemoModal]);

    const handleLogin = async (e) => {
        setIsLoggingIn(true); // Show loader

        try {
            const response = await axios.post(`${apiUrl}/signin/`, {
                email: "abdullahofficial2050@gmail.com",  // Hardcoded email
                password: "12345678",
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            const token = response.data.token;
            const user = response.data.user; // Assuming user object contains isSplash
            dispatch(setToken(token));
            console.log('/dashboard navigation trigger');
            setTimeout(() => {
                modalInstance.current.hide(); // Hide modal after delay
                navigate("/dashboard");
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error("Login error:", error);
            setIsLoggingIn(false); // Reset loader if failed
        }
    };

    // const handleDismiss = () => {
    //     localStorage.setItem("isAccountSetupComplete", "true");
    //     window.dispatchEvent(new Event("storage")); // Notify other components
    // };
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth',
            });
        }
    };
    return (


        <div className="cursor-pointer mt-3">
            {/* <Header /> */}
            <>
                {/* <HeaderOption /> */}
                <nav className="navbar navbar-expand-lg navbar-dark" style={{
                    backgroundColor: "#0d3756",
                    padding: "10px 0px",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    margin: "0px 30px 0 30px",
                }}>
                    {/* <HeaderOption /> */}
                    <div className="container-fluid" style={{ position: "relative" }}>
                        <div>
                            {/* <img onClick={() => navigate('/')} className="logo" src={logo} /> */}
                            {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button> */}
                        </div>
                        <button className="navbar-toggler" type="button" onClick={() => setMenuOpen(!menuOpen)}>
                            <FaBars style={{ color: "white" }} />
                        </button>
                        <div>
                            <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""} w-100 text-center mt-3`}>
                                <div className="d-flex flex-column gap-2">

                                    {/* <div className="ownerSectionUser1 text-white" onClick={() => {
                                        navigate('/')
                                    }} >
                                        <p style={{ margin: 0 }} onClick={() => {
                                            navigate('/')

                                        }}>Home</p>
                                    </div> */}
                                    {/* <div className="ownerSectionUser1 text-white" onClick={() => {
                                        navigate('/download')
                                    }} >
                                        <p className="ownerSectionUser1 text-white" style={{ margin: 0 }} onClick={() => {
                                            navigate('/download')
                                        }}>Download</p>
                                    </div> */}

                                    {/* ✅ This div will be hidden on /signin */}

                                    <Link to="/#" className="ownerSectionUser1" style={{ color: 'white', textDecoration: 'none', margin: 0 }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (window.location.pathname !== "/") {
                                                navigate("/", { state: { scrollTo: "pricing" } });
                                            } else {
                                                scrollToSection('pricing'); // Call the scroll function if already on homepage
                                            }
                                        }}>Pricing</Link>
                                    {/* <div className=" text-white" > */}
                                    <Link
                                        to="/workCards"
                                        className="ownerSectionUser1"
                                        // state={{ scrollTo: "section5" }}
                                        style={{ color: 'white', textDecoration: 'none', margin: 0 }}
                                    >
                                        How It Works</Link>
                                    {/* <p style={{ margin: 0 }} onClick={() => location.pathname === "/" ? scrollToSection('section4') : navigate("/")}>How It Work</p> */}
                                    {/* </div> */}
                                    {/* <div className="ownerSectionUser1 text-white" onClick={() => {
                                        navigate('/pricing')
                                    }} >
                                        <p style={{ margin: 0 }} onClick={() => location.pathname === "/" ? scrollToSection('section3') : navigate("/")}>Pricing</p>
                                    </div> */}
                                    {/* <div className="ownerSectionUser1 text-white" style={{ whiteSpace: 'nowrap' }}
                                    > */}
                                    <Link
                                        to="/Training"
                                        className="ownerSectionUser1"
                                        style={{ color: "white", textDecoration: "none", margin: 0 }}
                                    // onClick={() => handleDismiss()} // Call function on click
                                    >
                                        Training Center
                                    </Link>
                                    {(location.pathname !== "/signin") && (location.pathname !== "/signup") && (

                                        <Link to="/#" className="ownerSectionUser1" style={{ color: 'white', textDecoration: 'none' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (window.location.pathname !== "/") {
                                                    navigate("/download", { state: { scrollTo: "" } });
                                                } else {
                                                    scrollToSection(''); // Call the scroll function if already on homepage
                                                }
                                            }}>Download</Link>
                                    )}
                                    <Link
                                        to="#"
                                        className="ownerSectionUser1"
                                        style={{ color: 'white', textDecoration: 'none', margin: 0 }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowDemoModal(true); // 🔥 Show modal first
                                        }}
                                    >
                                        Demo
                                    </Link>
                                </div>
                                {/* Bootstrap Modal Markup */}
                                <div
                                    className="modal fade"
                                    ref={modalRef}
                                    tabIndex="-1"
                                    aria-labelledby="demoModalLabel"
                                    aria-hidden="true"
                                >
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content" style={{ borderRadius: "12px", padding: "20px" }}>
                                            <div className="modal-header border-0 position-relative">
                                                <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
                                                    <h5
                                                        className="modal-title"
                                                        id="demoModalLabel"
                                                        style={{ fontWeight: "600", color: "#222", margin: 0 }}
                                                    >
                                                        Switch to Demo Account?
                                                    </h5>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn-close ms-auto"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close"
                                                ></button>
                                            </div>

                                            <div className="modal-body" style={{ textAlign: "center", fontSize: "14px", color: "#555", lineHeight: "1.6" }}>
                                                Your current session will be logged out and you will be redirected to a demo account for testing purposes. <br />
                                                <strong>Would you like to proceed?</strong>
                                            </div>
                                            {/* <div className="modal-footer border-0 d-flex justify-content-center">
                                                <button
                                                    className="btn"
                                                    style={{
                                                        padding: "10px 20px",
                                                        backgroundColor: "#7FC45B",
                                                        color: "#fff",
                                                        fontWeight: "600",
                                                        borderRadius: "5px",
                                                    }}
                                                    onClick={() => {
                                                        modalInstance.current.hide();
                                                        handleLogin();
                                                    }}
                                                >
                                                    Yes
                                                </button> */}
                                            <div className="modal-footer border-0 d-flex justify-content-center gap-2 px-4 pb-4">
                                                {isLoggingIn ? (
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <div className="spinner-border" style={{ color: '#7FC45B' }} role="status">
                                                            <span className="visually-hidden" style={{ marginLeft: "-30px" }}>Loading...</span>
                                                        </div>
                                                        {/* <span style={{ marginLeft: "10px", fontWeight: 600 }}>Logging in...</span> */}
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* <button
                                                            className="btn"
                                                            style={{
                                                                padding: "10px 20px",
                                                                backgroundColor: "#7FC45B",
                                                                color: "#fff",
                                                                fontWeight: "600",
                                                                borderRadius: "5px",
                                                                minWidth: "120px",
                                                                height: "40px",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                textAlign: "center"
                                                            }}
                                                            onClick={() => {
                                                                setIsLoggingIn(true);
                                                                handleLogin();
                                                            }}
                                                            disabled={isLoggingIn}
                                                        >
                                                            {isLoggingIn ? (
                                                                <>
                                                                    <span
                                                                        className="spinner-border spinner-border-sm text-light"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                        style={{ marginLeft: "-30px" }}
                                                                    ></span>
                                                                    Loading
                                                                </>
                                                            ) : (
                                                                "Yes"
                                                            )}
                                                        </button> */}

                                                        <button
                                                            className="btn"
                                                            style={{
                                                                padding: "10px 20px",
                                                                backgroundColor: "#7FC45B",
                                                                color: "#fff",
                                                                fontWeight: "600",
                                                                borderRadius: "5px",
                                                                minWidth: "100px"
                                                            }}
                                                            onClick={() => {
                                                                setIsLoggingIn(true); // Show loader immediately
                                                                // modalInstance.current.hide();
                                                                handleLogin();
                                                            }}
                                                        >
                                                            Yes
                                                        </button>
                                                        <button
                                                            className="btn"
                                                            disabled={isLoggingIn}
                                                            style={{
                                                                padding: "10px 20px",
                                                                backgroundColor: "#ccc",
                                                                color: "#333",
                                                                fontWeight: "600",
                                                                borderRadius: "5px",
                                                            }}
                                                            data-bs-dismiss="modal"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>

                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <Link to="/#" className="ownerSectionUser1" style={{ color: 'white', textDecoration: 'none', margin: 0 }}
                                        onClick={handleLogin}>Demo</Link> */}
                                {/* <p style={{ margin: 0, fontSize: '0.8rem', }} onClick={() => location.pathname === "/" ? scrollToSection('section1') : navigate("/aboutUs")}>{language === "en" ? "About Us" : "كيف يعمل"}</p> */}
                                {/* </div> */}
                            </div>

                        </div>
                    </div>
                </nav>
            </>
        </div >
    )
}

export default UserDashboardSection;