// import React from "react";
// import tabletMockup from "../../../images/tablet.png"; // Replace with your image path

// function FeaturesSection({ language }) {
//     return (
//         <div
//             className="features-container"
//             style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 backgroundColor: "#FFFFFF",
//                 width: '100%',
//                 direction: language === 'ar' ? 'rtl' : 'ltr',
//                 textAlign: language === 'ar' ? 'right' : 'left',
//                 padding: "3rem",
//                 flexWrap: "wrap", // Ensure wrapping on smaller screens
//             }}
//         >
//             {/* Left Column (Features) */}
//             <div className="features-text"
//                 style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     flex: "1",
//                     position: "relative",
//                     width: "50%",
//                     minWidth: "350px"
//                 }}
//             >
//                 {/* Vertical Line */}
//                 <div
//                     style={{
//                         position: "absolute",
//                         left: language === 'ar' ? "auto" : "14%",
//                         right: language === 'ar' ? "14%" : "auto",
//                         top: "40px",
//                         height: "calc(100% - 80px)",
//                         width: "2px",
//                         backgroundColor: "#E4E4E4",
//                         zIndex: "0",
//                     }}
//                 ></div>

//                 {[
//                     {
//                         number: "1",
//                         titleEn: "Simple, Secure & Intuitive",
//                         titleAr: "بسيط وآمن وبديهي",
//                         descEn: "Effortlessly manage your team's productivity with a platform that is easy to use, secure, and designed with an intuitive interface to streamline your workday.",
//                         descAr: "قم بإدارة إنتاجية فريقك بسهولة من خلال منصة سهلة الاستخدام وآمنة ومصممة بواجهة بديهية لتبسيط يوم عملك."
//                     },
//                     {
//                         number: "2",
//                         titleEn: "Web & App Tracking",
//                         titleAr: "تتبع الويب والتطبيقات",
//                         descEn: "Monitor your team's activity across websites and applications in real time, ensuring transparency and accountability for all tasks performed.",
//                         descAr: "راقب نشاط فريقك عبر مواقع الويب والتطبيقات في الوقت الفعلي، مما يضمن الشفافية والمساءلة لجميع المهام المنجزة."
//                     },
//                     {
//                         number: "3",
//                         titleEn: "Work Reports",
//                         titleAr: "تقارير العمل",
//                         descEn: "Generate detailed work reports that provide insights into employee productivity and project performance, enabling better decision-making and planning.",
//                         descAr: "قم بإنشاء تقارير عمل مفصلة توفر رؤى حول إنتاجية الموظفين وأداء المشاريع، مما يساعد في اتخاذ قرارات وخطط أفضل."
//                     }
//                 ].map((feature, index) => (
//                     <div
//                         key={index}
//                         className="feature-box"
//                         style={{
//                             display: "flex",
//                             alignItems: "flex-start",
//                             marginBottom: "1rem",
//                             justifyContent: "center",
//                         }}
//                     >
//                         <div
//                             className="feature-number"
//                             style={{
//                                 width: "50px",
//                                 height: "50px",
//                                 backgroundColor: "#7ACB59",
//                                 color: "#FFFFFF",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 alignItems: "center",
//                                 borderRadius: "50%",
//                                 fontSize: "18px",
//                                 fontWeight: "700",
//                                 marginRight: language === 'ar' ? "0" : "1rem",
//                                 marginLeft: language === 'ar' ? "1rem" : "0",
//                                 zIndex: "1",
//                             }}
//                         >
//                             {feature.number}
//                         </div>
//                         <div className="feature-content card-title-responsive " style={{ width: '70%' }}>
//                             <h3 className=" card-title-responsive"
//                                 style={{
//                                     fontWeight: "700",
//                                     color: "#3B3C4E",
//                                     marginBottom: "5px",
//                                 }}
//                             >
//                                 {language === 'en' ? feature.titleEn : feature.titleAr}
//                             </h3>
//                             <p className=" card-subtitle-responsive"
//                                 style={{
//                                     fontWeight: "400",
//                                     padding: '10px',
//                                     color: "#3B3C4E",
//                                     lineHeight: "1.5",
//                                 }}
//                             >
//                                 {language === 'en' ? feature.descEn : feature.descAr}
//                             </p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Right Column (Image) */}
//             <div className="features-image"
//                 style={{
//                     flex: "1",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center", // Center image properly
//                     width: "50%",
//                     minWidth: "350px",
//                     marginTop: "0", // Ensure spacing is adjusted
//                 }}
//             >
//                 <img
//                     src={tabletMockup}
//                     alt="Tablet Mockup"
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
//         .features-container {
//             flex-direction: column;
//             text-align: center !important;
//         }
//         .features-text, .features-image {
//             width: 100% !important;
//         }
//         .features-image {
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
//         .features-image {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             text-align: center;
//             margin-top: 2rem;
//         }
//         .features-image img {
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
//         .features-image {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             text-align: center;
//         }
//         .features-image img {
//             max-width: 100% !important;
//         }
//     }
// `;

// /* Inject styles into the document */
// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = styles;
// document.head.appendChild(styleSheet);

// export default FeaturesSection;

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import tablet_mockup from "../../../images/tablet_mockup.png"; // Replace with your image path

function FeaturesSection({ language }) {
    return (
        <section
            className="py-5"
            style={{
                backgroundColor: "#FFFFFF",
            }}
        >
            <Container>
                {/* <h2 className="fw-bold text-dark mb-3">
            {language === 'en' ? 'Empower Your Team with' : 'مكن فريقك باستخدام '}
            <span style={{ color: '#7ACB59' }}>
                    {language === 'en' ? ' SSTRACK.IO' : 'مكان واحد'}
                </span>
            </h2> */}
                <Row className="align-items-center">
                    {/* Left Column (Features) */}
                    <Col xs={12} md={6} className="mb-4 mb-md-0" dir={language === "ar" ? "rtl" : "ltr"}>
                        <h2 className="fw-bold text-dark mb-3">
                            {language === 'en' ? 'Empower Your Team with' : 'مكن فريقك باستخدام '}
                            <span style={{ color: '#7ACB59' }}>
                                {language === 'en' ? ' SSTRACK.IO' : 'مكان واحد'}
                            </span>
                        </h2>
                        {/* Vertical Line */}
                        {/* <div
                            style={{
                                position: "absolute",
                                left: "30px",  // Adjust based on number box width
                                top: "5%",
                                height: "90%", // Make it full height
                                width: "2px",
                                backgroundColor: "#E4E4E4",
                                zIndex: "0",
                            }}
                        ></div> */}
                        {/* <div
                            style={{
                                position: "absolute",
                                left: language === 'ar' ? "auto" : "14%",
                                right: language === 'ar' ? "14%" : "auto",
                                top: "40px",
                                height: "calc(100% - 80px)",
                                width: "2px",
                                backgroundColor: "#E4E4E4",
                                zIndex: "0",
                            }}
                        ></div> */}
                        {[{
                            number: "1",
                            titleEn: "Simple, Secure & Intuitive",
                            titleAr: "بسيط وآمن وبديهي",
                            descEn: "Effortlessly manage your team's productivity with a platform that is easy to use, secure, and designed with an intuitive interface to streamline your workday.",
                            descAr: "قم بإدارة إنتاجية فريقك بسهولة من خلال منصة سهلة الاستخدام وآمنة ومصممة بواجهة بديهية لتبسيط يوم عملك."
                        }, {
                            number: "2",
                            titleEn: "Web & App Tracking",
                            titleAr: "تتبع الويب والتطبيقات",
                            descEn: "Monitor your team's activity across websites and applications in real time, ensuring transparency and accountability for all tasks performed.",
                            descAr: "راقب نشاط فريقك عبر مواقع الويب والتطبيقات في الوقت الفعلي، مما يضمن الشفافية والمساءلة لجميع المهام المنجزة."
                        }, {
                            number: "3",
                            titleEn: "Work Reports",
                            titleAr: "تقارير العمل",
                            descEn: "Generate detailed work reports that provide insights into employee productivity and project performance, enabling better decision-making and planning.",
                            descAr: "قم بإنشاء تقارير عمل مفصلة توفر رؤى حول إنتاجية الموظفين وأداء المشاريع، مما يساعد في اتخاذ قرارات وخطط أفضل."
                        }].map((feature, index) => (
                            <div
                                key={index}
                                className="d-flex align-items-start mb-4"
                            >
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        backgroundColor: "#7ACB59",
                                        color: "#FFFFFF",
                                        borderRadius: "50%",
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        flexShrink: 0,
                                    }}
                                >
                                    {feature.number}
                                </div>
                                <div className="ms-3">
                                    <h4 className="fw-bold text-dark">
                                        {language === "en" ? feature.titleEn : feature.titleAr}
                                    </h4>
                                    <p className="text-secondary">
                                        {language === "en" ? feature.descEn : feature.descAr}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </Col>

                    {/* Right Column (Image) */}
                    <Col xs={12} md={6} className="text-center">
                        <img
                            src={tablet_mockup}
                            alt="Tablet Mockup"
                            className="img-fluid"
                            style={{
                                maxWidth: "100%",
                                borderRadius: "10px",
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default FeaturesSection;
