import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const statsTranslations = {
  en: {
    title: "Each month",
    stats: [
      { value: '5K+', label: 'Active users' },
      { value: '1M+', label: 'Total hours tracked' },
      { value: '4M+', label: 'Tasks completed' },
      { value: '300K+', label: 'Payments' },
    ],
  },
  ar: {
    title: "كل شهر",
    stats: [
      { value: '5K+', label: 'المستخدمين النشطين' },
      { value: '1M+', label: 'إجمالي الساعات المتعقبة' },
      { value: '4M+', label: 'المهام المكتملة' },
      { value: '300K+', label: 'المدفوعات' },
    ],
  },
};

const StatsSection = ({ language }) => {
  const currentStats = statsTranslations[language];

  return (
    <div className=" px-0" style={{ backgroundColor: "#FFFFFF" }}> {/* ✅ Full Width White Background */}
      <Container fluid className="text-center py-5">
        {/* Title */}
        <p className="mb-4 stats-title text-center"
          style={{
            fontFamily: "'Sinkin Sans', sans-serif",
            fontSize: '50px',
            fontWeight: '500',
            color: '#253053',
            letterSpacing: '0.5px',
          }}
        >
          {currentStats.title}
        </p>

        {/* Stats Section */}
        <Row className="justify-content-center text-center align-items-center d-flex">
          {currentStats.stats.map((stat, index) => (
            <Col
              key={index}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex flex-column align-items-center stats-column"
            >
              <p className="mb-1 stats-value"
                style={{
                  color: '#7ACB59',
                  fontSize: '50px',
                  fontFamily: "'Sinkin Sans', sans-serif",
                  fontWeight: '600',
                }}
              >
                {stat.value}
              </p>
              <p className="text-muted stats-label"
                style={{
                  fontSize: '25px',
                  fontFamily: "'Sinkin Sans', sans-serif",
                  fontWeight: '400',
                }}
              >
                {stat.label}
              </p>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );

};

export default StatsSection;
