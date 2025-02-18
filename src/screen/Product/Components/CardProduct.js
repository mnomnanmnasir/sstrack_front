import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaDesktop, FaFileAlt, FaSearch } from "react-icons/fa";

const ThreeCardsSection = ({ language }) => {
  // Translations object for English and Arabic
  const translations = {
    en: {
      card1: {
        title: "Track employee hours without busy work",
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        button: "Track hours easily →",
      },
      card2: {
        title: "Automated productivity tracking = accurate timesheets",
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        button: "Learn more about timesheets →",
      },
      card3: {
        title: "Intuitive mobile, desktop, and web-based time tracking apps",
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
        button: "Download apps →",
      },
    },
    ar: {
      card1: {
        title: "تتبع ساعات العمل للموظفين بدون أعمال إضافية",
        text: "لوريم إيبسوم هو نص شكلي يُستخدم في صناعة الطباعة والتنضيد. كان لوريم إيبسوم النص الوهمي القياسي لهذه الصناعة منذ القرن الخامس عشر.",
        button: "تتبع الساعات بسهولة →",
      },
      card2: {
        title: "تتبع الإنتاجية الآلي = جداول زمنية دقيقة",
        text: "لوريم إيبسوم هو نص شكلي يُستخدم في صناعة الطباعة والتنضيد. كان لوريم إيبسوم النص الوهمي القياسي لهذه الصناعة منذ القرن الخامس عشر.",
        button: "تعرف على المزيد عن الجداول الزمنية →",
      },
      card3: {
        title: "تطبيقات تتبع الوقت سهلة الاستخدام على الجوال والويب",
        text: "لوريم إيبسوم هو نص شكلي يُستخدم في صناعة الطباعة والتنضيد. كان لوريم إيبسوم النص الوهمي القياسي لهذه الصناعة منذ القرن الخامس عشر.",
        button: "تنزيل التطبيقات →",
      },
    },
  };

  const t = translations[language || "en"]; // Default to English if no language is provided

  return (
    <div style={{ padding: "4rem 0", backgroundColor: "#F9FCFF" }}>
      <Container>
        <Row className="g-4">
          {/* Card 1 */}
          <Col md={4}>
            <Card
              style={{
                border: "none",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#FFFFFF",
              }}
              className="h-100 text-center d-flex flex-column align-items-center justify-content-center"
            >
              <Card.Body>
                <div className="mb-3">
                  <FaDesktop size={40} style={{ color: "#7ACB59" }} />
                </div>
                <Card.Title style={{ fontWeight: "700", color: "#0D4873" }}>
                  {t.card1.title}
                </Card.Title>
                <Card.Text style={{ color: "#6C757D" }}>
                  {t.card1.text}
                </Card.Text>
                <Button
                  variant="link"
                  style={{
                    color: "#7ACB59",
                    fontWeight: "600",
                    textDecoration: "none",
                    padding: 0,
                  }}
                >
                  {t.card1.button}
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 2 */}
          <Col md={4}>
            <Card
              style={{
                border: "none",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#FFFFFF",
              }}
              className="h-100 text-center d-flex flex-column align-items-center justify-content-center"
            >
              <Card.Body>
                <div className="mb-3">
                  <FaFileAlt size={40} style={{ color: "#7ACB59" }} />
                </div>
                <Card.Title style={{ fontWeight: "700", color: "#0D4873" }}>
                  {t.card2.title}
                </Card.Title>
                <Card.Text style={{ color: "#6C757D" }}>
                  {t.card2.text}
                </Card.Text>
                <Button
                  variant="link"
                  style={{
                    color: "#7ACB59",
                    fontWeight: "600",
                    textDecoration: "none",
                    padding: 0,
                  }}
                >
                  {t.card2.button}
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Card 3 */}
          <Col md={4}>
            <Card
              style={{
                border: "none",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#FFFFFF",
              }}
              className="h-100 text-center d-flex flex-column align-items-center justify-content-center"
            >
              <Card.Body>
                <div className="mb-3">
                  <FaSearch size={40} style={{ color: "#7ACB59" }} />
                </div>
                <Card.Title style={{ fontWeight: "700", color: "#0D4873" }}>
                  {t.card3.title}
                </Card.Title>
                <Card.Text style={{ color: "#6C757D" }}>
                  {t.card3.text}
                </Card.Text>
                <Button
                  variant="link"
                  style={{
                    color: "#7ACB59",
                    fontWeight: "600",
                    textDecoration: "none",
                    padding: 0,
                  }}
                >
                  {t.card3.button}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ThreeCardsSection;
