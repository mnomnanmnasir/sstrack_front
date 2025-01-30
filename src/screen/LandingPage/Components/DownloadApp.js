// import React from "react";
// import appStore from "../../../images/appstored.svg"; // Replace with your App Store logo path
// import playStore from "../../../images/playstored.svg"; // Replace with your Google Play logo path
// import phoneMockup from "../../../images/downlaod.svg"; // Replace with your phone mockup path


// function DownloadApp({ language }) {
//   const isArabic = language === "ar";
//   return (
// <div
//   style={{
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     minHeight: '100vh',
//     padding: "3rem",
//     backgroundColor: "#FFFFFF",
//   }}
// >
//       {/* Left Section */}
//       <div
//         style={{
//           flex: "1",
//           textAlign: "left",
//         }}
//       >
//         <h2
//           style={{
//             fontSize: "41.5px",
//             fontWeight: "700",
//             color: "#7ACB59",
//             marginBottom: "1rem",
//             textAlign: isArabic ? "right" : "left",
//           }}
//         >
//           {isArabic ? "قم بتحميل تطبيقنا" : "Download Our App"}
//         </h2>
//         <p
//           style={{
//             fontSize: "16px",
//             fontWeight: "400",
//             color: "#3B3C4E",
//             marginBottom: "2rem",
//             textAlign: isArabic ? "right" : "left",
//           }}
//         >
//           {isArabic ? "قم بتحميل تطبيقنا لتتبع جهود موظفيك بكل سهولة!" : "Download Our App To Track Your Employees Effortlessly!"}
//         </p>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             // backgroundColor:'red',
//             gap: "1rem",
//           }}
//         >
//           {/* <a href="/#" target="_blank" rel="noopener noreferrer"> */}
//             <img
//               src={appStore}
//               alt="App Store"
//               style={{
//                 width: "125px",
//                 height: "auto",
//               }}
//             />
//           {/* </a> */}
//           <a href="https://play.google.com/store/apps/details?id=com.SSTRACK&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
//             <img
//               src={playStore}
//               alt="Google Play"
//               style={{
//                 width: "125px",
//                 height: "auto",
//               }}
//             />
//           </a>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div
//         style={{
//           flex: "1.5",
//           position: "relative",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <img
//           src={phoneMockup}
//           alt="Phone Mockup"
//           style={{
//             width: "49rem",
//             zIndex: "2",
//             // marginLeft:'-25%'
//           }}
//         />

//       </div>
//     </div>
//   );
// }

// export default DownloadApp;


import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import appStore from "../../../images/appstored.svg";
import playStore from "../../../images/playstored.svg";
import phoneMockup from "../../../images/downlaod.svg";
import "bootstrap/dist/css/bootstrap.min.css";

function DownloadApp({ language }) {
  const isArabic = language === "ar";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: '100vh',
        padding: "3rem",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Container fluid className="py-5">
        <Row className="align-items-center justify-content-center">
          {/* Left Section (Text & Store Buttons) */}
          <Col xs={12} md={6} className="text-md-start text-center mb-4">
            <h2 className="fw-bold text-success display-5 card-title-responsive">
              {isArabic ? "قم بتحميل تطبيقنا" : "Download Our App"}
            </h2>
            <p className="text-muted lead card-subtitle-responsive">
              {isArabic
                ? "قم بتحميل تطبيقنا لتتبع جهود موظفيك بكل سهولة!"
                : "Download Our App To Track Your Employees Effortlessly!"}
            </p>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <img src={appStore} alt="App Store" className="img-fluid" style={{ maxWidth: "150px" }} />
              <a href="https://play.google.com/store/apps/details?id=com.SSTRACK&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
                <img src={playStore} alt="Google Play" className="img-fluid" style={{ maxWidth: "150px" }} />
              </a>
            </div>
          </Col>

          {/* Right Section (Image) */}
          <Col xs={12} md={6} className="text-center">
            {/* className="responsive-image" */}
            <img src={phoneMockup} alt="Phone Mockup" className="img-fluid responsive-image" />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DownloadApp;
