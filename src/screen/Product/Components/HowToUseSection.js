import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import HowToUseImage from "../../../images/howtoUseImage.png";

const HowToUseSection = ({ language }) => {
    // Content translations for Arabic and English
    const steps = {
        en: [
            {
                number: "1",
                title: "Sign Up & Set Up Your Team",
                description:
                    "Create your account at SSTRACK.IO, then head to your dashboard to add team members, manage roles, and configure your projects.",
            },
            {
                number: "2",
                title: "Download the SSTRACK.IO Desktop App",
                description:
                    "Have each team member install the desktop application. Once they start tracking, their time and activity data syncs automatically.",
            },
            {
                number: "3",
                title: " Monitor & Manage in Real Time",
                description:
                    "Use the dashboard to view employee activities, monitor productivity, and generate detailed reports—all from one centralized location.",
            },
        ],
        ar: [
            {
                number: "١",
                title: "قم بالتسجيل وأضف فريقك",
                description:
                    "أنشئ حسابك على SSTRACK.IO، ثم انتقل إلى لوحة التحكم لإضافة أعضاء الفريق، وإدارة الأدوار، وإعداد مشاريعك.",
            },
            {
                number: "٢",
                title: "قم بتنزيل تطبيق SSTRACK.IO لسطح المكتب",
                description:
                    "يجب على كل عضو في الفريق تثبيت تطبيق سطح المكتب. بمجرد أن يبدأوا التتبع، تتم مزامنة بيانات الوقت والنشاط تلقائيًا.",
            },
            {
                number: "٣",
                title: "راقب وأدر فريقك في الوقت الفعلي",
                description:
                    "استخدم لوحة التحكم لعرض أنشطة الموظفين، ومراقبة الإنتاجية، وإنشاء تقارير تفصيلية—كل ذلك من مكان واحد مركزي.",
            },
        ],
    };

    return (
        <div style={{ padding: "4rem 0", backgroundColor: "#FFFFFF" }}>
            <Container>
                {/* Title */}
                <Row>
                    <Col>
                        <h2
                            style={{
                                fontWeight: "700",
                                color: "#0D4873",
                                textAlign: "center",
                            }}
                        >
                            {language === "ar"
                                ? "كيفية استخدام"
                                : "How to Use SSTrack for"}{" "}
                            <span style={{ color: "#7ACB59" }}>Real-Time Employee Monitoring</span>
                        </h2>
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
