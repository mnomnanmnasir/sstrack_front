import React, { useState, useEffect, useRef } from "react";
import { NavLink,useNavigate } from "react-router-dom";
import { Modal } from "bootstrap";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "../../../../store/authSlice";

function NewHeaderOpions({ language, showVertical = false }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showDemoModal, setShowDemoModal] = useState(false);
    const modalRef = useRef(null);
    const modalInstance = useRef(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const isLoggedIn = !!localStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        if (modalRef.current) {
            modalInstance.current = new Modal(modalRef.current, { backdrop: true, keyboard: true });
            if (showDemoModal) modalInstance.current.show();
            else modalInstance.current.hide();
            const onHidden = () => setShowDemoModal(false);
            modalRef.current.addEventListener("hidden.bs.modal", onHidden);
            return () => modalRef.current?.removeEventListener("hidden.bs.modal", onHidden);
            // return () => modalRef?.removeEventListener("hidden.bs.modal", onHidden);
        }
    }, [showDemoModal]);

    const handleLogin = async () => {
        setIsLoggingIn(true);
        try {
            const response = await axios.post(`${apiUrl}/signin/`, {
                email: "abdullahofficial2050@gmail.com",
                password: "12345678",
            }, { headers: { 'Content-Type': 'application/json' } });

            const token = response.data.token;
            dispatch(setToken(token));
            setTimeout(() => {
                modalInstance.current.hide();
                navigate("/dashboard");
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error("Login error:", error);
            setIsLoggingIn(false);
        }
    };

    // ✅ Reusable NavLink Component
    const CustomNavLink = ({ to, label, isButton }) => (
        <>
            <NavLink
                to={to}
                className="nav-link ownerSectionUser1"
                style={({ isActive }) => ({
                    color: isActive ? "#fff" : "#fff",
                    backgroundColor: isActive ? "#7ACB59" : "transparent",
                    padding: isActive ? "8px 20px" : "5px 10px",   // 👈 yahan padding conditionally
                    borderRadius: "5px",
                    fontSize: "15px",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    border: isButton ? "1px solid #7ACB59" : "none"
                })}
            >
                {label}
            </NavLink>
            <span className="d-none d-lg-inline" style={{ color: "#fff", margin: "0 8px", fontSize: "24px" }}>|</span>
        </>
    );

    return (
        <div className="cursor-pointer mt-3">
            <nav className="navbar navbar-expand-lg navbar-dark bg-transparent rounded-top">
                <div className="container-fluid px-2" style={{ paddingLeft: "50px", paddingRight: "10px" }}>
                    <div className={`d-flex ${showVertical ? "flex-column align-items-start" : "justify-content-end"}`} role="search">
                        <CustomNavLink to="/" label={language === "en" ? "Home" : "الصفحة الرئيسية"} />
                        <CustomNavLink to="/aboutUs" label={language === "en" ? "About Us" : "كيف يعمل"} />
                        <CustomNavLink to="/product" label={language === "en" ? "Product" : "منتج"} />
                        <CustomNavLink to="/workCards" label={language === "en" ? "How It Works" : "كيف يعمل"} />
                        <CustomNavLink to="/Training" label={language === "en" ? "Training Center" : "مركز التدريب"} />
                        <CustomNavLink to="/contact" label={language === "en" ? "Contact Us" : "اتصل بنا"} />

                        {/* Pricing Link */}
                        <NavLink
                            to="/"
                            className="nav-link ownerSectionUser1"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/", { state: { scrollTo: "pricing" } });
                            }}
                            style={({ isActive }) => ({
                                padding: "5px 10px",
                                borderRadius: "5px",
                                fontSize: "15px",
                                textDecoration: "none",
                            })}
                        >
                            {language === "en" ? "Pricing" : "التسعير"}
                        </NavLink>

                        <span className="d-none d-lg-inline" style={{ color: "#fff", margin: "0 8px", fontSize: "24px" }}>|</span>

                        {/* Demo Button */}
                        <button
                            className="nav-link ownerSectionUser1"
                            onClick={() => setShowDemoModal(true)}
                            style={{
                                color: "white",
                                fontSize: "15px",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            {language === "en" ? "Demo" : "ڈیمو"}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Demo Modal */}
            <div className="modal fade" ref={modalRef} tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{ borderRadius: "12px", padding: "20px" }}>
                        <div className="modal-header border-0 position-relative">
                            <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
                                <h5 className="modal-title" style={{ fontWeight: "600", color: "#222" }}>
                                    Switch to Demo Account?
                                </h5>
                            </div>
                            <button type="button" className="btn-close ms-auto" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body" style={{ textAlign: "center", fontSize: "14px", color: "#555" }}>
                            {isLoggedIn ? (
                                <>
                                    Your current session will be logged out and you will be redirected to a demo account.
                                    <br /><strong>Would you like to proceed?</strong>
                                </>
                            ) : (
                                <>
                                    You are about to switch to our <strong>Demo Account</strong>.
                                    <br /><strong>Would you like to continue?</strong>
                                </>
                            )}
                        </div>

                        <div className="modal-footer border-0 d-flex justify-content-center gap-2 px-4 pb-4">
                            {isLoggingIn ? (
                                <div className="spinner-border" style={{ color: '#7FC45B' }} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                <>
                                    <button className="btn" style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#7FC45B",
                                        color: "#fff",
                                        fontWeight: "600",
                                        borderRadius: "5px",
                                        minWidth: "100px"
                                    }} onClick={handleLogin}>Yes</button>

                                    <button className="btn" style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#ccc",
                                        color: "#333",
                                        fontWeight: "600",
                                        borderRadius: "5px",
                                    }} data-bs-dismiss="modal">Cancel</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewHeaderOpions;