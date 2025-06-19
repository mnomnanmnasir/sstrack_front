// import React from "react";
// import productivityImage from "../../../images/break.svg"; // Replace with your image path
// import { useNavigate } from "react-router-dom";

// function ProductivitySection({ language }) {
//     const navigate = useNavigate();
//     return (
//         <div
//             className="productivity-container"
//             style={{
//                 display: "flex",
//                 flexDirection: language === "ar" ? "row-reverse" : "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 padding: "3rem",
//                 backgroundColor: "#F9FAFB",
//                 flexWrap: "wrap", // Ensures wrapping for responsiveness
//             }}
//         >
//             {/* Left Column */}
//             <div className="productivity-text"
//                 style={{
//                     flex: "1",
//                     paddingRight: language === "ar" ? "0rem" : "2rem",
//                     paddingLeft: language === "ar" ? "2rem" : "0rem",
//                     minWidth: "350px",
//                     textAlign: language === "ar" ? "right" : "left",
//                 }}
//             >
//                 {/* Subtitle */}
//                 <p
//                     style={{
//                         fontSize: "14px",
//                         fontWeight: "400",
//                         color: "#3B3C4E",
//                         marginBottom: "10px",
//                     }}
//                 >
//                     {language === "en"
//                         ? "Productivity Focused"
//                         : "يركز على الإنتاجية"}
//                 </p>

//                 {/* Title */}
//                 <h1
//                     className="responsive-heading"
//                     style={{
//                         fontWeight: "700",
//                         color: "#3B3C4E",
//                         lineHeight: "1.2",
//                         marginBottom: "20px",
//                     }}
//                 >
//                     {language === "en"
//                         ? "Achieve more Productivity"
//                         : "حقق المزيد من الإنتاجية"}{" "}
//                     <br /> {language === "en" ? "with" : "مع"}{" "}
//                     <span style={{ color: "#7ACB59" }}>
//                         SSTrack.io
//                     </span>
//                 </h1>

//                 {/* Description */}
//                 <p className="responsive-text"
//                     style={{
//                         fontSize: "14px",
//                         fontWeight: "400",
//                         color: "#555555",
//                         marginBottom: "30px",
//                     }}
//                 >
//                     {language === "en"
//                         ? "Start your journey toward optimized productivity today!"
//                         : "ابدأ رحلتك نحو تحسين الإنتاجية اليوم!"}
//                 </p>

//                 {/* Features List */}
//                 <ul
//                     style={{
//                         listStyleType: "disc",
//                         paddingLeft: "20px",
//                         marginBottom: "30px",
//                         width: '80%',
//                         color: "#555555",
//                     }}
//                 >
//                     <li
//                         style={{
//                             marginBottom: "25px",
//                             fontSize: "16px",
//                             fontWeight: "400",

//                         }}
//                     >
//                         <strong style={{ color: "black" }}>
//                             {language === "en"
//                                 ? "Timesheet Reports:"
//                                 : "تقارير الجداول الزمنية:"}
//                         </strong>{" "}
//                         {language === "en"
//                             ? "Easily track and analyze employee work hours for streamlined payroll and project cost management."
//                             : "تتبع وحلل ساعات عمل الموظفين بسهولة لإدارة الرواتب وتكاليف المشاريع بسلاسة."}
//                     </li>
//                     <li
//                         style={{
//                             marginBottom: "25px",
//                             fontSize: "16px",
//                             fontWeight: "400",
//                         }}
//                     >
//                         <strong style={{ color: "black" }}>
//                             {language === "en"
//                                 ? "Real-Time Reports:"
//                                 : "تقارير الوقت الفعلي:"}
//                         </strong>{" "}
//                         {language === "en"
//                             ? "Access live data and updates on ongoing tasks to ensure your team stays aligned and focused."
//                             : "الوصول إلى البيانات الحية والتحديثات حول المهام الجارية لضمان بقاء فريقك متوافقًا ومركّزًا."}
//                     </li>
//                     <li
//                         style={{
//                             fontSize: "16px",
//                             fontWeight: "400",
//                         }}
//                     >
//                         <strong style={{ color: "black" }}>
//                             {language === "en"
//                                 ? "Productivity Reports:"
//                                 : "تقارير الإنتاجية:"}
//                         </strong>{" "}
//                         {language === "en"
//                             ? "Understand key productivity trends and identify areas for improvement with advanced reporting tools."
//                             : "فهم اتجاهات الإنتاجية الرئيسية وتحديد مجالات التحسين باستخدام أدوات تقارير متقدمة."}

//                     </li>
//                 </ul>

//                 {/* CTA Button */}
//                 <button
//                     style={{
//                         backgroundColor: "#7ACB59",
//                         color: "#FFFFFF",
//                         fontSize: "16px",
//                         fontWeight: "500",
//                         padding: "10px 20px",
//                         borderRadius: "8px",
//                         border: "none",
//                         cursor: "pointer",
//                     }}
//                     onClick={() => navigate("/signup")}
//                 >
//                     {language === "en" ? "Get Started →" : "ابدأ الآن →"}
//                 </button>
//             </div>

//             {/* Right Column (Image) */}
//             <div className="productivity-image"
//                 style={{
//                     flex: "1",
//                     textAlign: "center",
//                     width: "50%",
//                     minWidth: "350px",
//                     marginTop: "0",
//                 }}
//             >
//                 <img
//                     src={productivityImage}
//                     alt="Productivity Illustration"
//                     className="responsive-image"
//                     style={{
//                         width: "100%",
//                         maxWidth: "500px",
//                         borderRadius: "10px",
//                     }}
//                 />
//             </div>
//         </div>
//     );
// }

// /* Responsive Styles */
// const styles = `
//     @media (max-width: 992px) { /* Tablets */
//         .productivity-container {
//             flex-direction: column;
//             text-align: center !important;
//         }
//         .productivity-text, .productivity-image {
//             width: 100% !important;
//         }
//         .productivity-image {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             text-align: center;
//             margin-top: 2rem;
//         }
//     }

//     @media (max-width: 768px) { /* Mobile */
//         .responsive-heading {
//             font-size: 2rem !important;
//         }
//         .responsive-text {
//             font-size: 1.2rem !important;
//         }
//         .productivity-image {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             text-align: center;
//             margin-top: 2rem;
//         }
//         .productivity-image img {
//             max-width: 90% !important;
//         }
//     }

//     @media (max-width: 576px) { /* Small Mobile */
//         .responsive-heading {
//             font-size: 2.2rem !important;
//         }
//         .responsive-text {
//             font-size: 1.3rem !important;
//         }
//         .productivity-image {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             text-align: center;
//         }
//         .productivity-image img {
//             max-width: 100% !important;
//         }
//     }
// `;

// /* Inject styles into the document */
// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = styles;
// document.head.appendChild(styleSheet);

// export default ProductivitySection;


import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import productivityImage from "../../../images/break.svg"; // Replace with your image path
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ProductivitySection({ language }) {
    const navigate = useNavigate();

    return (
        <div
            className="productivity-container"
            style={{
                display: "flex",
                flexDirection: language === "ar" ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "3rem",
                backgroundColor: "#F9FAFB",
                flexWrap: "wrap", // Ensures wrapping for responsiveness
            }}
        >

            <Container fluid className="bg-light py-5">
                <Row className="align-items-center justify-content-center">
                    {/* Left Column (Text Section) */}

                    <Col xs={12} md={6} className="text-md-start text-center mb-4">
                        {/* Subtitle */}
                        <p className="text-muted small mb-2 card-title-responsive">
                            {language === "en" ? "Productivity Focused" : "يركز على الإنتاجية"}
                        </p>

                        {/* Title */}
                        <h1 className="fw-bold text-dark card-title-responsive">
                            {language === "en" ? "Achieve more Productivity" : "حقق المزيد من الإنتاجية"}{" "}
                            <br />
                            {language === "en" ? "with" : "مع"}{" "}
                            <span className="text-success">SSTrack.io</span>
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
                        <Button
                            variant="success"
                            className="mt-3 card-title-responsive"
                            size="lg"
                            onClick={() => navigate("/signup")}
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
                    </Col>

                    {/* Right Column (Image Section) */}
                    <Col xs={12} md={6} className="text-center">
                        <img
                            src={productivityImage}
                            alt="Productivity Illustration"
                            className="img-fluid rounded responsive-image"
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
const styles = `
    @media (max-width: 992px) { /* Tablets */
        .productivity-container {
            flex-direction: column;
            text-align: center !important;
        }
        .productivity-text, .productivity-image {
            width: 100% !important;
        }
        .productivity-image {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            margin-top: 2rem;
        }
    }

    @media (max-width: 768px) { /* Mobile */
        .responsive-heading {
            font-size: 2rem !important;
        }
        .responsive-text {
            font-size: 1.2rem !important;
        }
        .productivity-image {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            margin-top: 2rem;
        }
        .productivity-image img {
            max-width: 90% !important;
        }
    }

    @media (max-width: 576px) { /* Small Mobile */
        .responsive-heading {
            font-size: 2.2rem !important;
        }
        .responsive-text {
            font-size: 1.3rem !important;
        }
        .productivity-image {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        .productivity-image img {
            max-width: 100% !important;
        }
    }
`;

/* Inject styles into the document */
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ProductivitySection;
