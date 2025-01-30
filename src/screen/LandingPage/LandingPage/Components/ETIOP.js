import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import projectManagment from '../../../images/Pm.png';
import monitoring from '../../../images/Monitoring.png';
import TrainingAndAssesment from '../../../images/TandA.png';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function ETIOP({ language }) {
    const navigate = useNavigate();

    return (
        <Container fluid className="bg-white text-center py-5">
            {/* Heading */}
            <h2 className="heading-responsive fw-bold text-dark mb-3">
                {language === 'en' ? 'Everything in ' : 'كل شيء في '}
                <span style={{ color: '#7ACB59' }}>
                    {language === 'en' ? 'One Place' : 'مكان واحد'}
                </span>
            </h2>
            <p className="text-responsive text-muted mb-4">
                {language === 'en'
                    ? 'Experience the power of all-in-one management and monitoring with a free trial. Get started today and transform the way you work.'
                    : 'اكتشف قوة الإدارة والمراقبة المتكاملة مع نسخة تجريبية مجانية. ابدأ اليوم وحوّل طريقة عملك.'}
            </p>

            {/* Cards Section */}
            <Row className="justify-content-center">
                <Col xs={12} md={6} lg={4} className="mb-4">
                    <CardComponent
                        image={projectManagment}
                        title={language === 'en' ? 'Project Management' : 'إدارة المشاريع'}
                        description={language === 'en'
                            ? 'Streamline your workflow with cutting-edge tools that bring teams, tasks, and deadlines together seamlessly.'
                            : 'قم بتبسيط سير عملك باستخدام أدوات متطورة تجمع الفرق والمهام والمواعيد النهائية بسلاسة.'}
                    />
                </Col>
                <Col xs={12} md={6} lg={4} className="mb-4">
                    <CardComponent
                        image={monitoring}
                        title={language === 'en' ? 'Monitoring' : 'المراقبة'}
                        description={language === 'en'
                            ? 'Stay on top of your team\'s productivity and progress with real-time insights.'
                            : 'ابقَ على اطلاع على إنتاجية فريقك وتقدمه من خلال الرؤى في الوقت الفعلي.'}
                    />
                </Col>
                <Col xs={12} md={6} lg={4} className="mb-4">
                    <CardComponent
                        image={TrainingAndAssesment}
                        title={language === 'en' ? 'Training and Assessment' : 'التدريب والتقييم'}
                        description={language === 'en'
                            ? 'Empower your team with tailored training solutions and detailed performance assessments.'
                            : 'قم بتمكين فريقك من خلال حلول تدريب مخصصة وتقييمات أداء دقيقة.'}
                    />
                </Col>
            </Row>

            {/* Call-to-Action Button */}
            <Button
                className="mt-3 card-title-responsive"
                style={{
                    backgroundColor: '#7ACB59',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    fontSize: '16px',
                }}
                onClick={() => navigate("/signup")}
            >
                {language === 'en' ? 'Start Free Trial →' : 'ابدأ النسخة التجريبية المجانية →'}
            </Button>
        </Container>
    );
}

/* Bootstrap Card Component */
function CardComponent({ image, title, description }) {
    return (
        <Card className="shadow-sm border-light text-center h-100">
            <Card.Img variant="top" src={image} className="p-3 rounded" />
            <Card.Body>
                <Card.Title className="fw-bold text-dark card-title-responsive">{title}</Card.Title>
                <Card.Text className="text-muted  card-title-responsive">{description}</Card.Text>
            </Card.Body>
        </Card>
    );
}

export default ETIOP;
