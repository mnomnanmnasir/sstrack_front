import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const HeroSection = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${require('../../../images/aboutUShero.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        textAlign: 'center',
        color: 'white',
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        //   backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
            //   maxWidth: '800px',
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
              }}
            >
              ABOUT SS TRACK.IO
            </h3>
            <h1
              style={{
                fontSize: '34px',
                fontWeight: '700',
                margin: '0px 0',
                width:'100%',
                backgroundColor:'red'
              }}
            >
              Seamless Presence Tracking for Smarter Businesses
            </h1>
            <p
              style={{
                fontSize: '18px',
                fontWeight: '400',
                lineHeight: '1.6',
                marginBottom: '30px',
              }}
            >
              Track presence, manage seamlessly, and collaborate smarter with SS Track.io—
              built for efficiency across all major platforms.
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
              Get Started →
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
