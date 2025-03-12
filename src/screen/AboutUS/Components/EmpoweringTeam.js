import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaClock, FaCamera, FaDesktop, FaFileInvoice, FaChartBar, FaTasks } from "react-icons/fa";
import empoweringImage from "../../../images/empoweringTeam-image.png";

const EmpoweringTeamsSection = ({ language }) => {
  // Translations for English and Arabic
  const translations = {
    en: {
      sectionTitle: "WHO WE SERVE",
      mainTitle: "Empowering Teams",
      subTitle: " With Tailored Solutions",
      description:
        "We connect our clients with cutting-edge tools and expertise to streamline their workflows and enhance productivity. Our platform is designed to ensure transparency, accountability, and efficiency at every level of your organization.",
      timeTracking: "Time Tracking",
      timeTrackingDesc: "Accurately track employee hours and activities, ensuring you have complete visibility into your team's productivity.",
      screenshots: "Screenshots",
      screenshotsDesc: "Monitor progress with automated screenshots, offering valuable insights into project timelines and performance.",
      appsWebsites: "Apps and Website",
      appsWebsitesDesc: "Gain detailed insights into app and website usage, helping you optimize workflows and improve time management.",
      invoice: "Invoice",
      invoiceDesc: "Streamline billing with automated invoices generated based on accurate time tracking.",
      reports: "Reports",
      reportsDesc: "Access comprehensive reports that highlight key performance metrics and offer actionable insights for growth.",
      activityLevel: "Activity Level",
      activityLevelDesc: "Analyze real-time activity levels to understand productivity trends and make informed decisions.",
    },
    ar: {
      sectionTitle: "من نخدم",
      mainTitle: "تمكين الفرق",
      subTitle: "بحلول مخصصة",
      description:
        "نحن نربط عملائنا بأحدث الأدوات والخبرات لتبسيط سير العمل وتحسين الإنتاجية. تم تصميم منصتنا لضمان الشفافية والمساءلة والكفاءة على جميع المستويات في مؤسستك.",
      timeTracking: "تتبع الوقت",
      timeTrackingDesc: "تتبع ساعات العمل والأنشطة بدقة، مما يضمن لك رؤية كاملة لإنتاجية فريقك.",
      screenshots: "لقطات الشاشة",
      screenshotsDesc: "راقب التقدم باستخدام لقطات الشاشة التلقائية، التي تقدم رؤى قيمة حول جداول المشاريع والأداء.",
      appsWebsites: "التطبيقات والمواقع الإلكترونية",
      appsWebsitesDesc: "احصل على رؤى مفصلة حول استخدام التطبيقات والمواقع الإلكترونية، مما يساعدك على تحسين سير العمل وإدارة الوقت.",
      invoice: "الفواتير",
      invoiceDesc: "تبسيط الفوترة باستخدام الفواتير التلقائية المستندة إلى بيانات دقيقة لتتبع الوقت والمشاريع.",
      reports: "التقارير",
      reportsDesc: "الوصول إلى تقارير شاملة تسلط الضوء على مؤشرات الأداء الرئيسية وتوفر رؤى قابلة للتنفيذ للنمو.",
      activityLevel: "مستوى النشاط",
      activityLevelDesc: "تحليل مستويات النشاط في الوقت الفعلي لفهم اتجاهات الإنتاجية واتخاذ قرارات مستنيرة.",
    },
  };

  const t = translations[language || "en"]; // Default to English if no language is provided

  return (
    <div
      style={{
        paddingBottom: "9rem",
        paddingTop: "1rem",
        backgroundColor: "#FFFFFF",
        direction: language === "ar" ? "rtl" : "ltr", // RTL support for Arabic
      }}
    >
      <Container>
        <Row className="align-items-center">
          {/* Left Text Content */}
          <Col md={6}>
            <h5 style={{ color: "#7ACB59", fontWeight: "bold" }}>{t.sectionTitle}</h5>
            <h2 style={{ fontWeight: "bold", color: "#0D4873" }}>
              {t.mainTitle}
              <span style={{ color: "#7ACB59" }}>{t.subTitle}</span>
            </h2>
            <p style={{ color: "#6C757D", lineHeight: "1.8" }}>{t.description}</p>

            {/* Left Side Points */}
            <div>
              <h6 className="fs-4" style={{ fontWeight: "bold", color: "#0D4873" }}>
                <FaClock size={30} style={{ color: "#7ACB59", marginRight: "10px" }} />
                {t.timeTracking}
              </h6>
              <p style={{ fontSize: "14px", color: "#6C757D" }}>{t.timeTrackingDesc}</p>

              <h6 className="fs-4" style={{ fontWeight: "bold", color: "#0D4873" }}>
                <FaCamera size={30} style={{ color: "#7ACB59", marginRight: "10px" }} />
                {t.screenshots}
              </h6>
              <p style={{ fontSize: "14px", color: "#6C757D" }}>{t.screenshotsDesc}</p>

              <h6 className="fs-4" style={{ fontWeight: "bold", color: "#0D4873" }}>
                <FaDesktop size={30} style={{ color: "#7ACB59", marginRight: "10px" }} />
                {t.appsWebsites}
              </h6>
              <p style={{ fontSize: "14px", color: "#6C757D" }}>{t.appsWebsitesDesc}</p>
            </div>
          </Col>

          {/* Right Image and Content */}
          <Col md={6} style={{ position: "relative" }}>
            {/* Image */}
            <img
              src={empoweringImage}
              alt="Team"
              className="responsive-image"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "500px",
                borderRadius: "10px",
                objectFit: "cover",
                margin: "0 auto",
                display: "block",
              }}
            />
            {/* Overlayed Points */}
            <div
              className="overlay-content"
              style={{
                marginTop: "-15.5rem",
                padding: "2rem",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                position: "relative",
                zIndex: 1,
              }}
            >
              <h6 className="fs-4" style={{ fontWeight: "bold", color: "#0D4873" }}>
                <FaFileInvoice size={30} style={{ color: "#7ACB59", marginRight: "10px" }} />
                {t.invoice}
              </h6>
              <p style={{ fontSize: "14px", color: "#6C757D" }}>{t.invoiceDesc}</p>

              <h6 className="fs-4" style={{ fontWeight: "bold", color: "#0D4873" }}>
                <FaChartBar size={30} style={{ color: "#7ACB59", marginRight: "10px" }} />
                {t.reports}
              </h6>
              <p style={{ fontSize: "14px", color: "#6C757D" }}>{t.reportsDesc}</p>

              <h6 className="fs-4" style={{ fontWeight: "bold", color: "#0D4873" }}>
                <FaTasks size={30} style={{ color: "#7ACB59", marginRight: "10px" }} />
                {t.activityLevel}
              </h6>
              <p style={{ fontSize: "14px", color: "#6C757D" }}>{t.activityLevelDesc}</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EmpoweringTeamsSection;




// second option

// import React from "react";
// import { Container, Row, Col } from "react-bootstrap";
// import { FaClock, FaCamera, FaDesktop, FaFileInvoice, FaChartBar, FaTasks } from "react-icons/fa";
// import empoweringImage from "../../../images/empoweringTeam-image.png";

// const EmpoweringTeamsSection = () => {
//   return (
//     <div style={{ paddingBottom: "9rem", paddingTop: "1rem", backgroundColor: "#FFFFFF" }}>
//       <Container className="py-5">
//         <Row className="align-items-center">
//           {/* Left Text Content */}
//           <Col md={6}>
//             <h5 style={{ color: "#7ACB59", fontWeight: "bold" }}>WHO WE SERVE</h5>
//             <h2 style={{ fontWeight: "bold", color: "#0D4873" }}>
//               Empowering Teams <br />
//               <span style={{ color: "#7ACB59" }}>With Tailored Solutions</span>
//             </h2>
//             <p style={{ color: "#6C757D", lineHeight: "1.8" }}>
//               We connect our clients with cutting-edge tools and expertise to streamline their workflows and enhance productivity.
//               Our platform is designed to ensure transparency, accountability, and efficiency at every level of your organization.
//             </p>

//             {/* Two-Column Points */}
//             <Row>
//               {/* Column 1 */}
//               <Col md={6}>
//                 <h6 className="fs-5" style={{ fontWeight: "bold", color: "#0D4873" }}>
//                   <FaClock size={24} style={{ color: "#7ACB59", marginRight: "10px" }} />
//                   Time Tracking
//                 </h6>
//                 <p style={{ fontSize: "14px", color: "#6C757D" }}>
//                   Accurately track employee hours and activities, ensuring you have complete visibility into your team's productivity.
//                 </p>

//                 <h6 className="fs-5" style={{ fontWeight: "bold", color: "#0D4873" }}>
//                   <FaCamera size={24} style={{ color: "#7ACB59", marginRight: "10px" }} />
//                   Screenshots
//                 </h6>
//                 <p style={{ fontSize: "14px", color: "#6C757D" }}>
//                   Monitor progress with automated screenshots, offering valuable insights into project timelines and performance.
//                 </p>

//                 <h6 className="fs-5" style={{ fontWeight: "bold", color: "#0D4873" }}>
//                   <FaDesktop size={24} style={{ color: "#7ACB59", marginRight: "10px" }} />
//                   Apps and Website
//                 </h6>
//                 <p style={{ fontSize: "14px", color: "#6C757D" }}>
//                   Gain detailed insights into app and website usage, helping you optimize workflows and improve time management.
//                 </p>
//               </Col>

//               {/* Column 2 */}
//               <Col md={6}>
//                 <h6 className="fs-5" style={{ fontWeight: "bold", color: "#0D4873" }}>
//                   <FaFileInvoice size={24} style={{ color: "#7ACB59", marginRight: "10px" }} />
//                   Invoice
//                 </h6>
//                 <p style={{ fontSize: "14px", color: "#6C757D" }}>
//                   Streamline billing with automated invoices generated based on accurate time tracking and project data.
//                 </p>

//                 <h6 className="fs-5" style={{ fontWeight: "bold", color: "#0D4873" }}>
//                   <FaChartBar size={24} style={{ color: "#7ACB59", marginRight: "10px" }} />
//                   Reports
//                 </h6>
//                 <p style={{ fontSize: "14px", color: "#6C757D" }}>
//                   Access comprehensive reports that highlight key performance metrics and offer actionable insights for growth.
//                 </p>

//                 <h6 className="fs-5" style={{ fontWeight: "bold", color: "#0D4873" }}>
//                   <FaTasks size={24} style={{ color: "#7ACB59", marginRight: "10px" }} />
//                   Activity Level
//                 </h6>
//                 <p style={{ fontSize: "14px", color: "#6C757D" }}>
//                   Analyze real-time activity levels to understand productivity trends and make informed decisions.
//                 </p>
//               </Col>
//             </Row>
//           </Col>

//           {/* Right Image */}
//           <Col md={6} style={{ position: "relative" }}>
//             <img
//               src={empoweringImage}
//               alt="Team"
//               className="responsive-image"
//               style={{
//                 width: "100%",
//                 height: "auto",
//                 maxWidth: "500px",
//                 borderRadius: "10px",
//                 objectFit: "cover",
//                 margin: "0 auto",
//                 display: "block",
//               }}
//             />
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default EmpoweringTeamsSection;
