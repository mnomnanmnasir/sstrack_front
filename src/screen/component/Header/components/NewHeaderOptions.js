import React from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";

function NewHEaderOpions({ language, showVertical = false }) {
    const location = useLocation();
    const navigate = useNavigate();

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 50, // Adjust scroll position
                behavior: "smooth",
            });
        }
    }

    return (
        <div className="cursor-pointer mt-3">
            <nav className="navbar navbar-expand-lg navbar-dark bg-transparent rounded-top">
                <div className="container-fluid">
                    <div>
                        <div
                            className={`d-flex amButton ${showVertical ? "flex-column align-items-start" : "justify-content-end"
                                }`}
                            role="search"
                        >
                            <NavLink
                                to="/"
                                className="nav-link ownerSectionUser1"
                                style={({ isActive }) => ({
                                    color: isActive ? "#7ACB59" : "white",
                                    fontSize: "17px",
                                })}
                            >
                                {language === "en" ? "Home" : "الصفحة الرئيسية"}
                            </NavLink>

                            <NavLink
                                to="/aboutUs"
                                className="nav-link ownerSectionUser1"
                                style={({ isActive }) => ({
                                    color: isActive ? "#7ACB59" : "white",
                                    fontSize: "15px",
                                })}
                            >
                                {language === "en" ? "About Us" : "كيف يعمل"}
                            </NavLink>

                            <NavLink
                                to="/product"
                                className="nav-link ownerSectionUser1"
                                style={({ isActive }) => ({
                                    color: isActive ? "#7ACB59" : "white",
                                    fontSize: "15px",
                                })}
                            >
                                {language === "en" ? "Product" : "منتج"}
                            </NavLink>

                            {/* Pricing Link (Corrected) */}
                            {location.pathname === "/" ? (
                                <button
                                    className="nav-link ownerSectionUser1"
                                    style={{
                                        color: location.hash === "#pricing" ? "#7ACB59" : "white",
                                        fontSize: "15px",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => scrollToSection("pricing")}
                                >
                                    {language === "en" ? "Pricing" : "التسعير"}
                                </button>
                            ) : (
                                <NavLink
                                    to="/"
                                    className="nav-link ownerSectionUser1"
                                    style={({ isActive }) => ({
                                        color: isActive ? "#7ACB59" : "white",
                                        fontSize: "15px",
                                    })}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate("/", { state: { scrollTo: "pricing" } });
                                    }}
                                >
                                    {language === "en" ? "Pricing" : "التسعير"}
                                </NavLink>
                            )}

                            <NavLink
                                to="/workCards"
                                className="nav-link ownerSectionUser1"
                                style={({ isActive }) => ({
                                    color: isActive ? "#7ACB59" : "white",
                                    fontSize: "15px",
                                })}
                            >
                                {language === "en" ? "How It Works" : "كيف يعمل"}
                            </NavLink>

                            {/* Contact Us Link (Corrected) */}
                            {location.pathname === "section3" ? (
                                <button
                                    className="nav-link ownerSectionUser1"
                                    style={{
                                        color: location.hash === "#contact" ? "#7ACB59" : "white",
                                        fontSize: "15px",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => scrollToSection("section3")}
                                >
                                    {language === "en" ? "Contact Us" : "اتصل بنا"}
                                </button>
                            ) : (
                                <NavLink
                                    to="section3"
                                    className="nav-link ownerSectionUser1"
                                    style={({ isActive }) => ({
                                        color: isActive ? "#7ACB59" : "white",
                                        fontSize: "15px",
                                    })}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate("/", { state: { scrollTo: "section3" } });
                                    }}
                                >
                                    {language === "en" ? "Contact Us" : "اتصل بنا"}
                                </NavLink>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default NewHEaderOpions;
