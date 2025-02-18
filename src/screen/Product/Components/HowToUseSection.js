import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import HowToUseImage from "../../../images/howtoUseImage.png";

const HowToUseSection = ({ language }) => {
    // Content translations for Arabic and English
    const steps = {
        en: [
            {
                number: "1",
                title: "Download the SS Track.io Desktop Application",
                description:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            },
            {
                number: "2",
                title: "Track time to projects and tasks",
                description:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            },
            {
                number: "3",
                title: "Use time tracking software to generate time reports",
                description:
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            },
        ],
        ar: [
            {
                number: "١",
                title: "قم بتنزيل تطبيق SS Track.io لسطح المكتب",
                description:
                    "لوريم إيبسوم هو ببساطة نص شكلي يستخدم في صناعة الطباعة والتنضيد. كان لوريم إيبسوم النص القياسي لهذه الصناعة منذ القرن الخامس عشر.",
            },
            {
                number: "٢",
                title: "تتبع الوقت للمشاريع والمهام",
                description:
                    "لوريم إيبسوم هو ببساطة نص شكلي يستخدم في صناعة الطباعة والتنضيد. كان لوريم إيبسوم النص القياسي لهذه الصناعة منذ القرن الخامس عشر.",
            },
            {
                number: "٣",
                title: "استخدم برنامج تتبع الوقت لإنشاء تقارير زمنية",
                description:
                    "لوريم إيبسوم هو ببساطة نص شكلي يستخدم في صناعة الطباعة والتنضيد. كان لوريم إيبسوم النص القياسي لهذه الصناعة منذ القرن الخامس عشر.",
            },
        ],
    };

    return (
        <div style={{ padding: "4rem 0", backgroundColor: "#FFFFFF" }}>
            <Container>
                {/* Title */}
                <Row>
                    <Col>
                        <h1
                            style={{
                                fontWeight: "700",
                                color: "#0D4873",
                                textAlign: "center",
                            }}
                        >
                            {language === "ar"
                                ? "كيفية استخدام"
                                : "How to use"}{" "}
                            <span style={{ color: "#7ACB59" }}>SS Track.io</span>
                        </h1>
                    </Col>
                </Row>

                {/* Steps and Image */}
                <Row className="mt-5 align-items-center">
                    {/* Left Steps */}
                    <Col lg={6} style={{ position: "relative" }}>
                        {/* Light Grey Vertical Line */}
                        <div
                            style={{
                                position: "absolute",
                                top: "10px", // Adjusted to align with the first circle
                                bottom: "20px", // Leave space at the bottom
                                left: "32px", // Matches the center of the circles
                                width: "2px",
                                backgroundColor: "#E4E4E4", // Light grey color
                                zIndex: "0",
                            }}
                        ></div>

                        {steps[language].map((step, index) => (
                            <Row
                                key={index}
                                className="mb-4 align-items-start"
                                style={{ position: "relative", zIndex: "1" }}
                            >
                                <Col xs={2} className="text-center">
                                    <div
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            backgroundColor: "#7ACB59",
                                            color: "#FFFFFF",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontWeight: "600",
                                            zIndex: "1",
                                        }}
                                    >
                                        {step.number}
                                    </div>
                                </Col>
                                <Col xs={10}>
                                    <h5
                                        style={{
                                            fontWeight: "700",
                                            color: "#0D4873",
                                        }}
                                    >
                                        {step.title}
                                    </h5>
                                    <p style={{ color: "#6C757D" }}>
                                        {step.description}
                                    </p>
                                </Col>
                            </Row>
                        ))}
                    </Col>

                    {/* Right Image */}
                    <Col lg={6} className="text-center">
                        <img
                            src={HowToUseImage} // Replace with your actual image path
                            alt="How to Use"
                            style={{
                                width: "100%",
                                height: "auto",
                                maxWidth: "400px",
                                borderRadius: "10px",
                                // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HowToUseSection;
