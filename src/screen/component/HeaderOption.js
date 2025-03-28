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


function UserDashboardSection(params) {

    // const navigate = useNavigate();
    const location = useLocation();
    const items = JSON.parse(localStorage.getItem('items'));

    const user = JSON.parse(localStorage.getItem('items'));
    const [showContent, setShowContent] = useState(false);
    const [userType, setUserType] = useState(user?.userType);
    const navigate = useNavigate("");
    const dispatch = useDispatch()
    const socket = useSocket()
    let token = localStorage.getItem('token');
    let headers = {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
    }
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const wordsAfterSpace = user?.name?.split(" ")[1] ? user?.name?.split(" ")[1].charAt(0).toUpperCase() : "";
    const capitalizedWord = user?.name?.charAt(0).toUpperCase();

    const handleLogin = async (e) => {

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
                navigate("/dashboard");
                window.location.reload();
            }, 2000);

        } catch (error) {

            console.error("Login error:", error);

        }
    };

    const handleDismiss = () => {
        localStorage.setItem("isAccountSetupComplete", "true");
        window.dispatchEvent(new Event("storage")); // Notify other components
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
                        <div>
                            <div className="d-flex amButton justify-content-end" role="search">
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
                                    onClick={() => handleDismiss()} // Call function on click
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
                                <Link to="/#" className="ownerSectionUser1" style={{ color: 'white', textDecoration: 'none', margin: 0 }}
                                    onClick={handleLogin}>Demo</Link>
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