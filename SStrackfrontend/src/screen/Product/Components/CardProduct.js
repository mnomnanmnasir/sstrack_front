






import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaDesktop, FaFileAlt, FaSearch } from "react-icons/fa";

const ThreeCardsSection = ({ language }) => {
  // 🔹 English & Arabic translations
  const translations = {
    en: [
      {
        id: 1,
        icon: <FaDesktop size={35} style={{ color: "#6BBE5D" }} />,
        title: "Track Employee Hours Without Busy Work",
        text: " Automate time tracking with our Clock-In & Clock-Out System, Idle Time Detection, and Work Hours Calculation. Save time, reduce errors, and get an accurate overview of each employee’s daily totals.",
        link: "Track hours easily →",
      },
      {
        id: 2,
        icon: <FaFileAlt size={35} style={{ color: "#6BBE5D" }} />,
        title: "Automated Productivity Tracking for Accurate Timesheets",
        text: "Leverage Screen Capture & Activity Monitoring, plus Keyboard & Mouse Tracking, to ensure precise timesheets. Identify daily workflows and optimize team performance.",
        link: "Learn more about timesheets →",
      },
      {
        id: 3,
        icon: <FaSearch size={35} style={{ color: "#6BBE5D" }} />,
        title: "Intuitive Mobile, Desktop, and Web-Based Apps",
        text: "Stay connected and track on the go. Our cross-platform solutions offer Real-Time Monitoring, Location Tracking, and Customizable Report Generation—all accessible from any device.",
        link: "Download apps →",
      },
    ],
    ar: [
      {
        id: 1,
        icon: <FaDesktop size={35} style={{ color: "#6BBE5D" }} />,
        title: "تتبع ساعات عمل الموظفين بسهولة",
        text: "قم بأتمتة تتبع الوقت باستخدام نظام تسجيل الدخول والخروج، واكتشاف وقت الخمول، وحساب ساعات العمل. وفر الوقت، قلل الأخطاء، واحصل على رؤية دقيقة لساعات عمل كل موظف.",
        link: "تتبع الساعات بسهولة →",
      },
      {
        id: 2,
        icon: <FaFileAlt size={35} style={{ color: "#6BBE5D" }} />,
        title: "تتبع الإنتاجية التلقائي = جداول زمنية دقيقة",
        text: "استخدم التقاط الشاشة ومراقبة النشاط، وتتبع لوحة المفاتيح والماوس، وتحليل الإنتاجية لضمان جداول زمنية دقيقة. احصل على رؤى حول سير العمل اليومي وقم بتحسين أداء الفريق.",
        link: "تعرف على المزيد عن الجداول الزمنية →",
      },
      {
        id: 3,
        icon: <FaSearch size={35} style={{ color: "#6BBE5D" }} />,
        title: "تطبيقات تتبع الوقت سهلة الاستخدام على الجوال والويب",
        text: "ابقَ متصلاً وتتبع أثناء التنقل. توفر حلولنا عبر الأنظمة الأساسية المراقبة في الوقت الفعلي، وتتبع الموقع، وإنشاء التقارير المخصصة—كل ذلك متاح من أي جهاز لتجربة سلسة.",
        link: "تحميل التطبيقات →",
      },
    ],
  };

  // 🔹 Get translated content
  const cards = translations[language] || translations.en;

  return (
    <div style={{ backgroundColor: "#F9FCFF", padding: "3rem 0" }}>
      <Container>
        <Row className="gx-4 gy-4 justify-content-center align-items-center">
          {cards.map((card) => (
            <Col xs={12} md={6} lg={4} key={card.id} className="d-flex justify-content-center"> {/* 🔥 Fully Centered */}
              <Card
                className="h-100 d-flex flex-column align-items-start mx-auto"
                style={{
                  border: "1px solid #E0E0E0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                  backgroundColor: "#FFFFFF",
                  padding: "30px",
                  textAlign: "left",
                  transition: "transform 0.2s ease-in-out",
                  minHeight: "350px", // Adjusted for better responsiveness
                  display: "flex",
                  width: "90%", // 🔥 Cards will always stay properly centered
                }}
              >
                <div style={{ marginBottom: "15px", width:'50px' }}>{card.icon}</div>
                <Card.Title
                  style={{
                    fontWeight: "700",
                    color: "#0D4873",
                    fontSize: "18px",
                    lineHeight: "1.5",
                    marginTop: '8px',
                    marginBottom: "12px",
                  }}
                >
                  {card.title}
                </Card.Title>
                <Card.Text
                  style={{
                    color: "#6C757D",
                    fontSize: "14px",
                    lineHeight: "1.9",
                    marginTop: '8px',
                    flex: "1",
                  }}
                >
                  {card.text}
                </Card.Text>
                  {/* 🔥 Ensures link is left-aligned */}
                {/* <div className="w-100 text-left">
                  <a
                    href="#"
                    style={{
                      color: "#6BBE5D",
                      fontWeight: "600",
                      fontSize: "14px",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {card.link}
                  </a>
                </div> */}
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ThreeCardsSection;


