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
    <Container fluid className="text-center bg-white py-5">
      {/* Title */}
      <p
        className="mb-4 stats-title"
        style={{
          fontFamily: "'Sinkin Sans', sans-serif",
          fontSize: '50px', // Desktop Font Size
          fontWeight: '500',
          color: '#253053',
          letterSpacing: '0.5px',
        }}
      >
        {currentStats.title}
      </p>

      {/* Stats Section */}
      <Row className="gy-4">
        {currentStats.stats.map((stat, index) => (

          <Col
            key={index}
            xs={12}  // 1 card per row on extra small screens
            sm={6}   // 2 cards per row on small screens
            md={4}   // 3 cards per row on medium screens
            lg={3}   // 4 cards per row on large screens
            className={`d-flex flex-column align-items-center ${index < 3 ? 'border-end border-md-end' : ''
              }`}
            style={{ borderColor: '#E0E0E0' }}
          >
            <p
              className="mb-1 stats-value"
              style={{
                color: '#7ACB59',
                fontSize: '50px', // Desktop Font Size
                fontFamily: "'Sinkin Sans', sans-serif",
                fontWeight: '600',
              }}
            >
              {stat.value}
            </p>
            <p
              className="text-muted stats-label"
              style={{
                fontSize: '25px', // Desktop Font Size
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
  );
};

export default StatsSection;
