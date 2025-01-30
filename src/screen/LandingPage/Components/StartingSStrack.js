import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function StartingSStrack({ language }) {
    const navigate = useNavigate();
    return (
        <div style={{ paddingBottom: "9rem", paddingTop: '5rem', backgroundColor: "#FFFFFF", textAlign: "center" }}>

            <div
                style={{
                    padding: "8rem",
                    background: "linear-gradient(90deg, #0D4873, #0A304B, #071F2D, #0C364F, #0D4873)",
                    textAlign: "center",
                    borderRadius: "40px",
                    color: "#FFFFFF",
                    maxWidth: "70%",
                    margin: "auto",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
                }}
            >
                <h4 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "2rem" }}>
                    {language === "en"
                        ? "Starting with SS Track.io is easy, fast and free"
                        : "البدء مع SS Track.io سهل وسريع ومجاني"
                    }

                </h4>
                <p style={{ fontSize: "1rem", marginBottom: "2rem" }}>
                    {language === "en"
                        ? "It only takes a few clicks to get started"
                        : "يستغرق الأمر بضع نقرات فقط للبدء"
                    }

                </p>
                <button
                    style={{
                        padding: "0.8rem 1.5rem",
                        backgroundColor: "white",
                        color: "#7ACB59",
                        fontSize: "1rem",
                        fontWeight: "500",
                        border: "none",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        marginBottom: "1rem",
                    }}
                    onMouseEnter={(e) => {

                        e.target.style.backgroundColor = "#7ACB59";
                        e.target.style.color = "white";
                        e.target.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.color = "#7ACB59";
                        e.target.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
                    }}
                    onClick={() => navigate("/signup")}
                >
                    {language === "en"
                        ? "Get started - it’s free"
                        : "ابدأ الآن - مجاني"
                    }

                </button>
                <p style={{ fontSize: "0.9rem" }}>{language === "en"
                    ? "Free for 14 days, no credit card required."
                    : "مجاني لمدة 14 يومًا، لا حاجة لبطاقة ائتمان."
                }
                </p>
            </div>
        </div>
    );
}

export default StartingSStrack;
