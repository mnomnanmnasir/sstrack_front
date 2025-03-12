import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaClock } from "react-icons/fa";
import trackingImage from "../../../images/product-smartImage.png"; // Replace with your image path
import { useNavigate,Link } from 'react-router-dom';

const BenefitsSection = ({ language }) => {
  // Translations object for English and Arabic
  const translations = {
    en: {
      title: "Benefits of a smarter time tracking tool",
      description1:
        "At SSTRACK.IO, we believe that productivity thrives on transparency. Our platform was created to revolutionize how teams track their progress, ensuring accountability and fostering collaboration.",
      description2:
        "Our solutions are designed to provide real-time insights, streamline workflows, and empower organizations to achieve their goals with confidence. Whether you're managing a remote team or optimizing in-office operations, SSTRACK.IO is your trusted partner in building a transparent and efficient workplace.",
      buttonText: "Get Started →",
      linkText: "SSTRACK.IO",
    },
    ar: {
      title: "فوائد أداة تتبع الوقت الذكية",
      description1:
        "في SSTRACK.IO، نؤمن أن الإنتاجية تزدهر بالشفافية. تم إنشاء منصتنا لإحداث ثورة في كيفية تتبع الفرق لتقدمها، مما يضمن المساءلة ويعزز التعاون.",
      description2:
        "تم تصميم حلولنا لتوفير رؤى فورية، وتبسيط سير العمل، وتمكين المؤسسات من تحقيق أهدافها بثقة. سواء كنت تدير فريقًا عن بُعد أو تحسين العمليات المكتبية، فإن SSTRACK.IO هو شريكك الموثوق في بناء مكان عمل شفاف وفعال.",
      buttonText: "ابدأ الآن →",
      linkText: "SSTRACK.IO",
    },
  };

  const t = translations[language || "en"]; // Default to English if no language is provided

  const navigate = useNavigate();

  return (
    <div style={{ padding: "4rem 0", backgroundColor: "#FFFFFF" }}>
      <Container>
        <Row className="align-items-center">
          {/* Left Content */}
          <Col lg={6} className="text-start">
            <h1 style={{ fontWeight: "700", color: "#0D4873" }}>
              {t.title}
            </h1>
            <p
              style={{
                color: "#6C757D",
                fontSize: "18px",
                marginBottom: "1.5rem",
              }}
            >
              {t.description1}
            </p>
            <p
              style={{
                color: "#6C757D",
                fontSize: "18px",
                marginBottom: "1.5rem",
              }}
            >
              {t.description2}
            </p>
            <a href='/signup' className="td-none">
            <Button
              style={{
                backgroundColor: "#7ACB59",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                padding: "10px 20px",
              }}
              // onClick={() => navigate("/signup")}
              >
              {t.buttonText}
            </Button>
              </a>
          </Col>

          {/* Right Image */}
          <Col lg={6} className="text-center mt-4 mt-lg-0">
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* Main Image */}
              <img
                src={trackingImage} // Replace with the actual image path
                alt="Tracking Tool"
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "auto",
                  borderRadius: "10px",
                  // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BenefitsSection;
