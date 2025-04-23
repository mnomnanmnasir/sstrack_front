


import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import step_1 from '../../../images/step1.png';
import step_2 from '../../../images/step_2.png';
import step_3 from '../../../images/step_3.png';
import step_4 from '../../../images/step_4.png';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate } from 'react-router-dom';
import { useLocation, useNavigate, Link } from "react-router-dom";


function NewHIW({ language }) {

    const navigate = useNavigate();

    // function scrollToSection(sectionId) {
    //     const section = document.getElementById(sectionId);
    //     if (section) {
    //         window.scrollTo({
    //             top: section.offsetTop,
    //             behavior: 'smooth',
    //         });
    //     }
    // };

    // const handleReadMoreClick = (e) => {
    //     e.preventDefault();
    //     if (window.location.pathname !== "/") {
    //         navigate("/workCards", { state: { scrollTo: "workCards" } });
    //     } else {
    //         scrollToSection("workCards"); // Call the scroll function if already on homepage
    //     }
    // };

    return (
        <Container fluid className="bg-white text-center py-5">
            {/* Heading */}
            <h2
                className="mb-3 heading-responsive"
                style={{ fontFamily: "'Sinkin Sans', sans-serif", fontWeight: '700', color: '#3B3C4E' }}
            >
                {language === 'en' ? 'How It' : 'كيف'}{' '}
                <span style={{ color: '#7ACB59' }}>{language === 'en' ? 'Works' : 'يعمل'}</span>
            </h2>

            {/* Subtext */}
            <p
                className="mb-4 text-responsive"
                style={{ fontFamily: "'Sinkin Sans', sans-serif", fontWeight: '400', color: '#212529' }}
            >
                {language === 'en' ? 'A Smarter Way to Track and Manage.' : 'طريقة أكثر ذكاءً لتتبع وإدارة العمل.'}
            </p>

            {/* Steps Section */}
            <Row className="justify-content-center g-0 gx-0 mx-0 my-0">
                <Col xs={12} md={6} lg={4} className="p-0 mt-lg-5 d-flex justify-content-center">
                    <StepCard
                        stepNumber="01"
                        image={step_1}
                        title={language === 'en' ? 'Sign Up' : 'اشترك'}
                        description={language === 'en'
                            ? 'Create your SSTRACK.IO account. It’s quick and easy—just enter your details, and you’re in.'
                            : 'أنشئ حسابك على SS Track.io. الأمر سريع وسهل—فقط أدخل بياناتك، وستكون جاهزًا للانطلاق.'}
                        language={language}
                    />
                </Col>
                <Col xs={12} md={6} lg={4} className="p-1 d-flex justify-content-center second-card">
                    <StepCard
                        stepNumber="02"
                        image={step_2}
                        title={language === 'en' ? 'Go to Your Dashboard' : 'انتقل إلى لوحة التحكم'}
                        description={language === 'en'
                            ? 'Add team members, define user roles, and set up your projects. This central hub gives you full control and visibility.'
                            : 'أضف أعضاء الفريق، وحدد أدوار المستخدمين، وقم بإعداد مشاريعك. يمنحك هذا المركز الرئيسي تحكمًا كاملاً ورؤية شاملة.'}
                        language={language}
                    />
                </Col>
            </Row>

            <Row className="justify-content-center gx-0 mx-0">
                <Col xs={12} md={6} lg={4} className="p-0 mt-lg-5 d-flex justify-content-center">
                    <StepCard
                        stepNumber="03"
                        image={step_3}
                        title={language === 'en' ? 'Download the App & Start Tracking' : 'قم بتنزيل التطبيق وابدأ التتبع'}
                        description={language === 'en'
                            ? 'Have each team member install the SSTRACK.IO application on their device. Once they begin working, their time and activity data syncs to your dashboard in real time.'
                            : 'يجب على كل عضو في الفريق تثبيت تطبيق SS Track.io على جهازه. بمجرد بدء العمل، تتم مزامنة بيانات الوقت والنشاط مع لوحة التحكم في الوقت الفعلي.'}
                        language={language}
                    />
                </Col>
                <Col xs={12} md={6} lg={4} className="p-1 d-flex justify-content-center second-card">
                    <StepCard
                        stepNumber="04"
                        image={step_4}
                        title={language === 'en' ? 'Analyze & Optimize' : 'حلل وحسّن الأداء'}
                        description={language === 'en'
                            ? 'Use built-in reports and analytics to review performance, spot trends, and optimize workflows. Make data-driven decisions to boost productivity.'
                            : 'استخدم التقارير والتحليلات المدمجة لمراجعة الأداء، واكتشاف الاتجاهات، وتحسين سير العمل. اتخذ قرارات تستند إلى البيانات لزيادة الإنتاجية.'}
                        language={language}
                    />
                </Col>
            </Row>
            {/* <Button
                className="mt-3"
                style={{
                    backgroundColor: '#7ACB59',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    fontSize: '16px',
                }}
                onClick={() => navigate("/signup")}
            >
                {language === 'en' ? 'Start Free Trial →' : 'ابدأ النسخة التجريبية المجانية →'}
            </Button> */}
            <div>
                <Link
                    to="/workCards"
                    state={{ scrollTo: "section5" }}
                    style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}
                >
                    <Button
                        // id="section5" // ✅ Add ID Here
                        className="mt-3"
                        style={{
                            backgroundColor: "#7ACB59",
                            border: "none",
                            padding: "0.75rem 1.5rem",
                            fontSize: "16px",
                        }}
                        // onClick={() => navigate("/workCards")}
                    >
                        {language === "en" ? "Read More →" : "اقرأ المزيد"}
                    </Button>
                </Link>
            </div>
        </Container>
    );
}

function StepCard({ stepNumber, image, title, description, language }) {
    return (
        <Card className="border shadow-sm rounded p-3 text-start card-responsive"
            style={{ borderColor: '#D3D3D3', margin: 'auto', width: '75%' }}>
            {/* Image */}
            <Card.Img variant="top" src={image} className="rounded" />

            {/* Step Content */}
            <Card.Body
                className="d-flex flex-column align-items-center align-items-md-start text-center text-md-start"
                style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>

                <Card.Title className="fw-bold card-title-responsive" style={{ fontSize: '44px', color: '#7ACB59' }}>{stepNumber}</Card.Title>
                <Card.Subtitle className="fw-semibold mb-2 card-subtitle-responsive" style={{ fontSize: '23px', color: '#0D4873' }}>{title}</Card.Subtitle>
                <Card.Text className="text-muted card-text-responsive" style={{ fontSize: '16px' }}>{description}</Card.Text>
            </Card.Body>
        </Card>
    );
}

export default NewHIW;
