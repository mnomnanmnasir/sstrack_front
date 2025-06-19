import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import easyImage from "../../../images/Group.png";

const EasyStartSection = ({ language }) => {
  // Translations for English and Arabic
  const translations = {
    en: {
      title: "Starting with SSTRACK.IO is easy, fast and free",
      button: "Get started - It's free",
    },
    ar: {
      title: "البدء مع SSTrack.io سهل وسريع ومجاني",
      button: "ابدأ الآن - مجاناً",
    },
  };

  const t = translations[language || "en"]; // Default to English if no language is provided

  return (
    <div style={{ paddingBottom: "9rem", paddingTop: '5rem', backgroundColor: "#FFFFFF", textAlign: "center" }}>
      <div
        style={{
          position: "relative",
          background: "linear-gradient(90deg, #0D4873, #113D5A)",
          borderRadius: "15px",
          textAlign: "center",
          padding: "50px 20px",
          margin: "30px auto",
          width: "90%",
          maxWidth: "1500px",
          overflow: "hidden",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          height: "325px",
        }}
      >
        {/* Background Image */}
        <img
          src={easyImage}
          alt="SSTrack Icon"
          style={{
            position: "absolute",
            top: "50%",
            left: "20%",
            transform: "translate(-50%, -50%)",
            width: "23%",
            height: "75%",
            opacity: 0.3,
          }}
          className="responsive-image"
        />

        {/* Text Content */}
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row className="mt-4 align-items-center justify-content-center">
            <Col xs={12}>
              <h2
                style={{
                  fontSize: "35px",
                  fontWeight: "700",
                  lineHeight: "1.5",
                  marginBottom: "20px",
                  color: "#FFFFFF",
                }}
              >
                {t.title}
              </h2>
              <Button
                className="mt-3"
                href="/signup"
                style={{
                  backgroundColor: "#FFF",
                  color: "#7ACB59",
                  border: "none",
                  padding: "12px 30px",
                  fontSize: "16px",
                  fontWeight: "600",
                  borderRadius: "30px",
                  textTransform: "uppercase",
                }}
              >
                {t.button}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default EasyStartSection;
