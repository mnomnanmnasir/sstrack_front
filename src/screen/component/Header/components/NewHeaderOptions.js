import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setToken } from "../../../../store/authSlice";

function NewHEaderOpions({ language, showVertical = false }) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedLink, setSelectedLink] = useState(""); // New state to track the selected link

    let token = localStorage.getItem("token");
    let headers = {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
    };

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: "smooth",
            });
        }
    }
    console.log('====================================');
    console.log(selectedLink);
    console.log('====================================');

    const handleLogin = async (e) => {
        try {
            const response = await axios.post(
                `${apiUrl}/signin/`,
                {
                    email: "abdullahofficial2050@gmail.com", // Hardcoded email
                    password: "12345678",
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            const token = response.data.token;
            const user = response.data.user; // Assuming user object contains isSplash
            dispatch(setToken(token));
            console.log("/dashboard navigation trigger");
            setTimeout(() => {
                navigate("/dashboard");
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    // Function to handle clicking and setting the selected link
    const handleLinkClick = (linkName) => {
        setSelectedLink(linkName);
    };

    return (
        <div className="cursor-pointer mt-3">
            <nav
                className="navbar navbar-expand-lg navbar-dark"
                style={{
                    backgroundColor: "transparent",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                }}
            >
                <div className="container-fluid" style={{ position: "relative" }}>
                    <div>
                        <div
                            className={`d-flex amButton ${
                                showVertical ? "flex-column align-items-start" : "justify-content-end"
                            }`}
                            role="search"
                        >
                            <Link
                                to="/"
                                className={`ownerSectionUser1 ${selectedLink === "home" ? "highlighted" : ""}`}
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontSize: "17px",
                                }}
                                onClick={() => handleLinkClick("home")}
                            >
                                {language === "en" ? "Home" : "الصفحة الرئيسية"}
                            </Link>

                            <Link
                                to="/aboutUs"
                                className={`ownerSectionUser1 ${selectedLink === "aboutUs" ? "highlighted" : ""}`}
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontSize: "15px",
                                }}
                                onClick={() => handleLinkClick("aboutUs")}
                            >
                                {language === "en" ? "About Us" : "كيف يعمل"}
                            </Link>

                            <Link
                                to="/product"
                                className={`ownerSectionUser1 ${selectedLink === "product" ? "highlighted" : ""}`}
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontSize: "15px",
                                }}
                                onClick={() => handleLinkClick("product")}
                            >
                                {language === "en" ? "Product" : "منتج"}
                            </Link>

                            <Link
                                to="/#"
                                className={`ownerSectionUser1 ${selectedLink === "pricing" ? "highlighted" : ""}`}
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontSize: "15px",
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (window.location.pathname !== "/") {
                                        navigate("/", { state: { scrollTo: "pricing" } });
                                    } else {
                                        scrollToSection("pricing");
                                    }
                                    handleLinkClick("pricing"); // Set the selected link when clicked
                                }}
                            >
                                {language === "en" ? "Pricing" : "التسعير"}
                            </Link>

                            <Link
                                to="/workCards"
                                className={`ownerSectionUser1 ${selectedLink === "howItWorks" ? "highlighted" : ""}`}
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontSize: "15px",
                                }}
                               
                            >
                                {language === "en" ? "How It Works" : "كيف يعمل"}
                            </Link>

                            <Link
                                to="/"
                                className={`ownerSectionUser1 ${selectedLink === "contact" ? "highlighted" : ""}`}
                                style={{
                                    color: "white",
                                    textDecoration: "none",
                                    fontSize: "15px",
                                }}
                                onClick={() => {
                                    location.pathname === "/"
                                        ? scrollToSection("section3")
                                        : navigate("/");
                                    handleLinkClick("contact");
                                }}
                            >
                                {language === "en" ? "Contact Us" : "اتصل بنا"}
                            </Link>

                            {/* <Link
                                to="/#"
                                className="ownerSectionUser1"
                                style={{ color: "white", textDecoration: "none", fontSize: "15px" }}
                                onClick={handleLogin}
                            >
                                {language === "en" ? "Demo" : "تجريبي"}
                            </Link> */}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default NewHEaderOpions;
