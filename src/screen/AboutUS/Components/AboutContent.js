import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import aboutImage from '../../../images/about-us.png';

const AboutSection = ({ language }) => {
  // Translations for English and Arabic  
  const translations = {
    en: {
      aboutUs: "About Us",
      heading: "Empowering Productivity with ",
      transparency: "Transparency and Real-Time Insights",
      description1:
        "At SSTRACK.IO, we believe that productivity thrives on transparency. Our platform was created to revolutionize how teams track their progress, ensuring accountability and fostering collaboration.",
      description2:
        "Our solutions are designed to provide real-time insights, streamline workflows, and empower organizations to achieve their goals with confidence. Whether you're managing a remote team or optimizing in-office operations, SSTRACK.IO is your trusted partner in building a transparent and efficient workplace.",
      readMore: "Get Started →",
    },
    ar: {
      aboutUs: "من نحن",
      heading: "تمكين الإنتاجية من خلال ",
      transparency: "الشفافية",
      description1:
        "في SSTRACK.IO، نؤمن أن الإنتاجية تزدهر بالشفافية. تم إنشاء منصتنا لإحداث ثورة في كيفية تتبع الفرق لتقدمها، مما يضمن المساءلة ويعزز التعاون.",
      description2:
        "تم تصميم حلولنا لتوفير رؤى فورية، وتبسيط سير العمل، وتمكين المؤسسات من تحقيق أهدافها بثقة. سواء كنت تدير فريقًا عن بُعد أو تحسّن العمليات داخل المكتب، فإن SSTRACK.IO هو شريكك الموثوق به في بناء بيئة عمل شفافة وفعالة.",
      readMore: "اقرأ المزيد →",
    },
  };

  const t = translations[language || "en"]; // Default to English if no language is provided

  return (
    <section className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <Container>
        <Row className="align-items-center">
          {/* Text Content */}
          <Col xs={12} md={6} className="mb-4 mb-md-0">
            <h6
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#7ACB59",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {t.aboutUs}
            </h6>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "700",
                margin: "10px 0",
                color: "#1A1A1A",
              }}
            >
              {t.heading}
              <span style={{ color: "#7ACB59" }}>{t.transparency}</span>
            </h2>
            <p style={{ fontSize: "16px", color: "#6c757d", lineHeight: "1.8" }}>
              {t.description1}
            </p>
            <p style={{ fontSize: "16px", color: "#6c757d", lineHeight: "1.8" }}>
              {t.description2}
            </p>
            {/* <Button
              style={{
                backgroundColor: "#7ACB59",
                border: "none",
                fontSize: "16px",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
            >
              {t.readMore}
            </Button> */}
          </Col>

          {/* Image Section */}
          <Col xs={12} md={6}>
            <Row>
              <Col xs={12} md={12} sm={12}>
                <img
                  src={aboutImage}
                  alt="Team discussion"
                  className="img-fluid rounded"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;

