import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFileAlt, FaThumbsUp, FaMedal, FaTrophy } from 'react-icons/fa';

const StatisticsSection = ({ language }) => {
  // Translations for English and Arabic
  const translations = {
    en: [
      { id: 1, icon: <FaFileAlt size={40} style={{ color: '#7ACB59' }} />, value: '172+', label: 'Writer Services' },
      { id: 2, icon: <FaThumbsUp size={40} style={{ color: '#7ACB59' }} />, value: '97%', label: 'Recommended' },
      { id: 3, icon: <FaMedal size={40} style={{ color: '#7ACB59' }} />, value: '100%', label: 'Satisfaction' },
      { id: 4, icon: <FaTrophy size={40} style={{ color: '#7ACB59' }} />, value: '46', label: 'International Awards' },
    ],
    ar: [
      { id: 1, icon: <FaFileAlt size={40} style={{ color: '#7ACB59' }} />, value: '172+', label: 'خدمات الكتابة' },
      { id: 2, icon: <FaThumbsUp size={40} style={{ color: '#7ACB59' }} />, value: '97%', label: 'موصى به' },
      { id: 3, icon: <FaMedal size={40} style={{ color: '#7ACB59' }} />, value: '100%', label: 'الرضا' },
      { id: 4, icon: <FaTrophy size={40} style={{ color: '#7ACB59' }} />, value: '46', label: 'جوائز دولية' },
    ],
  };

  const stats = translations[language || 'en']; // Default to English if no language is provided

  return (
    <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <Row className="justify-content-center">
          {stats.map((stat) => (
            <Col key={stat.id} xs={12} sm={6} md={3} className="mb-4 d-flex flex-column align-items-center">
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#ECF9ED',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }}
              >
                {stat.icon}
              </div>
              <h4 style={{ fontSize: '30px', fontWeight: '700', color: '#7ACB59', margin: 0 }}>
                {stat.value}
              </h4>
              <p style={{ fontSize: '20px', fontWeight: '400', color: '#333', marginTop: '5px' }}>
                {stat.label}
              </p>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default StatisticsSection;

