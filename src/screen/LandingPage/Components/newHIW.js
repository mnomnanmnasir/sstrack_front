


import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import step1 from '../../../images/step1.png';
import step2 from '../../../images/step2.png';
import step3 from '../../../images/step3.png';
import step4 from '../../../images/step4.png';
import 'bootstrap/dist/css/bootstrap.min.css';

function NewHIW({ language }) {
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
                        image={step1}
                        title={language === 'en' ? 'Sign Up' : 'اشترك'}
                        description={language === 'en' ? 'Get started in minutes—email verification is all it takes.' : 'ابدأ في دقائق - كل ما تحتاجه هو التحقق من البريد الإلكتروني.'}
                        language={language}
                    />
                </Col>
                <Col xs={12} md={6} lg={4} className="p-1 d-flex justify-content-center second-card">
                    <StepCard
                        stepNumber="02"
                        image={step2}
                        title={language === 'en' ? 'Precision Tools' : 'أدوات دقيقة'}
                        description={language === 'en' ? 'Real-time tracking, flawless logins, and screenshot control deliver unmatched oversight.' : 'التتبع في الوقت الفعلي، تسجيل الدخول السلس، والتحكم في لقطات الشاشة يوفر لك إشرافًا لا مثيل له.'}
                        language={language}
                    />
                </Col>
            </Row>

            <Row className="justify-content-center gx-0 mx-0">

            <Col xs={12} md={6} lg={4} className="p-0 mt-lg-5 d-flex justify-content-center">
            <StepCard
                        stepNumber="03"
                        image={step3}
                        title={language === 'en' ? 'Analyze & Optimize' : 'التحليل والتحسين'}
                        description={language === 'en' ? 'Use advanced analytics and insights to improve productivity across remote, in-office, and on-site teams.' : 'استخدم التحليلات المتقدمة لتحسين الإنتاجية في الفرق المختلفة.'}
                        language={language}
                    />
                </Col>
                <Col xs={12} md={6} lg={4} className="p-1 d-flex justify-content-center second-card">
                    <StepCard
                        stepNumber="04"
                        image={step4}
                        title={language === 'en' ? 'Get the Tools' : 'احصل على الأدوات'}
                        description={language === 'en' ? 'Download the app or extension to track work hours and manage activities effortlessly.' : 'قم بتنزيل التطبيق أو الإضافة لتتبع ساعات العمل وإدارة الأنشطة بسهولة.'}
                        language={language}
                    />
                </Col>
            </Row>
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
