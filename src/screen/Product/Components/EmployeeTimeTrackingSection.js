import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import EmployeeTimeTracking from "../../../images/prduct-timetracking-image.png";
import { FaUserCircle } from "react-icons/fa";

const EmployeeTimeTrackingSection = ({ language }) => {
  // Content translations
  const translations = {
    en: {
      title: "Employee time tracking software for in-office employees",
      description:
        "Save hours each week using our user-friendly time tracking, automated payroll, and invoicing solution.",
      placeholder: "Enter your work email",
      buttonText: "Start tracking time",
      testimonial:
        "We use SS Track for international teams for Time Tracking purposes because we can make sure that people are not unproductive or wasting our time.",
      testimonialAuthor: "Kamran.T / CTO",
    },
    ar: {
      title: "برنامج تتبع وقت الموظف لموظفي المكتب",
      description:
        "وفر ساعات كل أسبوع باستخدام برنامج تتبع الوقت السهل الاستخدام، وكشوف المرتبات الآلية، وحل الفواتير.",
      placeholder: "أدخل بريدك الإلكتروني الوظيفي",
      buttonText: "ابدأ تتبع الوقت",
      testimonial:
        "نحن نستخدم SS Track للفرق الدولية لأغراض تتبع الوقت لأنه يمكننا التأكد من أن الناس لا يضيعون وقتنا أو غير منتجين.",
      testimonialAuthor: "كامران.ت / المدير الفني",
    },
  };

  const t = translations[language || "en"]; // Default to English if no language is specified

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
              {t.description}
            </p>

            {/* Email Input and Button */}
            <Form className="d-flex" style={{ marginBottom: "2rem" }}>
              <Form.Control
                type="email"
                placeholder={t.placeholder}
                style={{
                  borderRadius: "5px 0 0 5px",
                  border: "1px solid #ddd",
                }}
              />
              <Button
                style={{
                  backgroundColor: "#7ACB59",
                  border: "none",
                  borderRadius: "0 5px 5px 0",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                {t.buttonText}
              </Button>
            </Form>

            {/* Testimonial */}
            <div
              style={{
                padding: "30px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                backgroundColor: "#F9FCFF",
              }}
            >
              <Row className="align-items-center">
                {/* Icon */}
                <Col
                  xs="auto"
                  className="d-flex align-items-center justify-content-center p-0"
                  style={{ marginRight: "10px" }}
                >
                  <FaUserCircle
                    size={40}
                    style={{
                      color: "#0D4873",
                    }}
                  />
                </Col>
                {/* Text Content */}
                <Col>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#6C757D",
                      margin: "0",
                    }}
                  >
                    {t.testimonial}
                  </p>
                  <strong
                    style={{
                      color: "#0D4873",
                      fontSize: "16px",
                    }}
                  >
                    {t.testimonialAuthor}
                  </strong>
                </Col>
              </Row>
            </div>
          </Col>

          {/* Right Image */}
          <Col lg={6} className="text-center mt-4 mt-lg-0">
            <img
              src={EmployeeTimeTracking} // Replace with the actual image path
              alt="Employee Tracking Software"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "500px", // Adjust maxWidth for scaling
                borderRadius: "10px",
                objectFit: "cover",
                // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EmployeeTimeTrackingSection;
