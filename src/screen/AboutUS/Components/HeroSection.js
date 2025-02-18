import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const HeroSection = ({ language }) => {
  // Translations for English and Arabic
  const translations = {
    en: {
      aboutTitle: "ABOUT SS TRACK.IO",
      mainHeading: "Seamless Presence Tracking for Smarter Businesses",
      description:
        "Track presence, manage seamlessly, and collaborate smarter with SS Track.io— built for efficiency across all major platforms.",
      buttonText: "Get Started →",
    },
    ar: {
      aboutTitle: "حول SS TRACK.IO",
      mainHeading: "تتبع الحضور بسلاسة للشركات الذكية",
      description:
        "تتبع الحضور، قم بالإدارة بسلاسة، وتعاون بذكاء مع SS Track.io - مصمم لتحقيق الكفاءة عبر جميع المنصات الرئيسية.",
      buttonText: "ابدأ الآن →",
    },
  };

  const t = translations[language || "en"]; // Default to English if no language is provided

  return (
    <div
      style={{
        backgroundImage: `url(${require('../../../images/aboutUShero.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        textAlign: 'center',
        color: 'white',
      }}
      className="hero-section"
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      ></div>

      <Container>
        <Row className="justify-content-center">
          <Col
            md={10}
            lg={8}
            style={{
              position: 'relative',
              zIndex: 1,
              margin: '0 auto',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '10px',
                fontFamily: "'Sinkin Sans', sans-serif",
              }}
            >
              {t.aboutTitle}
            </h3>
            <h1
              style={{
                fontSize: '34px',
                fontWeight: '700',
                margin: '0px 0',
                width: '100%',
                fontFamily: "'Sinkin Sans', sans-serif",
              }}
            >
              {t.mainHeading}
            </h1>
            <p
              style={{
                fontSize: '18px',
                fontWeight: '400',
                lineHeight: '1.6',
                marginBottom: '30px',
                fontFamily: "'Sinkin Sans', sans-serif",
              }}
            >
              {t.description}
            </p>
            <Button
              style={{
                backgroundColor: '#28a745',
                border: 'none',
                padding: '15px 30px',
                fontSize: '18px',
                fontWeight: '500',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {t.buttonText}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
