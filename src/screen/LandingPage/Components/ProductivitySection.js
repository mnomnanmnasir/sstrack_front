import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import productivity_image from "../../../images/productivity_image.png"; // Replace with your image path
import { useNavigate, Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

function ProductivitySection({ language }) {
    const navigate = useNavigate();

    return (
        <div style={{ width: "100%", backgroundColor: "white", padding: "50px 0" }}>
            <Container fluid className="bg-light py-5">
                <Row className="align-items-center justify-content-center ">
                    {/* Left Column (Text Section) */}
                    <Col xs={12} md={6} lg={5} className="d-flex flex-column justify-content-center align-items-md-start align-items-center text-center text-md-start mb-4">
                        {/* Subtitle */}
                        <p className="text-muted small mb-2 card-title-responsive">
                            {language === "en" ? "With Advanced Reporting" : "مع التقارير المتقدمة"}
                        </p>

                        {/* Title */}
                        <h1 className="fw-bold text-dark">
                            {language === "en" ? "Achieve more Productivity" : "حقق المزيد من الإنتاجية"}{" "}
                            <br />
                            {language === "en" ? "with" : "مع"}{" "}
                            <span style={{ color: "#7ACB59" }}>SSTRACK.IO</span>
                        </h1>

                        {/* Description */}
                        <p className="text-muted card-subtitle-responsive">
                            {language === "en"
                                ? "Start your journey toward optimized productivity today!"
                                : "ابدأ رحلتك نحو تحسين الإنتاجية اليوم!"}
                        </p>

                        {/* Features List */}
                        <ul className="list-unstyled">
                            <li className="mb-3">
                                <strong className="text-dark card-title-responsive">
                                    {language === "en" ? "Timesheet Reports:" : "تقارير الجداول الزمنية:"}
                                </strong>{" "}
                                <p className="card-subtitle-responsive">
                                    {language === "en"
                                        ? "Easily track and analyze employee work hours for payroll and project cost management."
                                        : "تتبع وحلل ساعات عمل الموظفين بسهولة لإدارة الرواتب وتكاليف المشاريع."}
                                </p>
                            </li>
                            <li className="mb-3">
                                <strong className="text-dark card-title-responsive">
                                    {language === "en" ? "Real-Time Reports:" : "تقارير الوقت الفعلي:"}
                                </strong>{" "}
                                <p className="card-subtitle-responsive">
                                    {language === "en"
                                        ? "Access live data and updates to ensure your team stays aligned and focused."
                                        : "الوصول إلى البيانات الحية والتحديثات لضمان بقاء فريقك متوافقًا ومركّزًا."}
                                </p>
                            </li>
                            <li>
                                <strong className="text-dark card-title-responsive">
                                    {language === "en" ? "Productivity Reports:" : "تقارير الإنتاجية:"}
                                </strong>{" "}
                                <p className="card-subtitle-responsive">
                                    {language === "en"
                                        ? "Understand key productivity trends and identify areas for improvement."
                                        : "فهم اتجاهات الإنتاجية الرئيسية وتحديد مجالات التحسين."}
                                </p>
                            </li>
                        </ul>

                        {/* CTA Button */}
                        <Link
                            to="/signup"
                            state={{ scrollTo: "signUp-btn" }}
                            style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}
                        >
                            <Button
                                variant="success"
                                className="mt-3 card-title-responsive"
                                size="lg"
                                // onClick={() => navigate("/signup")}
                                style={{
                                    backgroundColor: "#7ACB59",
                                    color: "#FFFFFF",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                {language === "en" ? "Get Started →" : "ابدأ الآن →"}
                            </Button>
                        </Link>
                    </Col>

                    {/* Right Column (Image Section) */}
                    <Col xs={12} md={6} lg={5} className="d-flex justify-content-center align-items-center mb-4">
                        <img
                            src={productivity_image}
                            alt="Productivity Illustration"
                            className="img-fluid rounded"
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    </Col>
                </Row>
            </Container>
        </div >
    );
}

export default ProductivitySection;
