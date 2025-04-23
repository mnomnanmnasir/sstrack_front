import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import appStore from "../../../images/appstored.svg";
import playStore from "../../../images/playstored.svg";
import phoneMockup from "../../../images/downlaod.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function DownloadApp({ language }) {
  const isArabic = language === "ar";

  return (
    <div className="download-section">
      <Container fluid className="bg-white">
        <Row className="align-items-center justify-content-center">
          {/* Left Section (Text & Store Buttons) */}
          <Col xs={12} sm={10} md={6} lg={4} className="text-md-start text-center mb-4">
            <h2 className="fw-bold display-5 title-responsive" style={{color:'#7ACB59'}}>
              {isArabic ? "قم بتحميل تطبيقنا" : "Download Our App"}
            </h2>
            <p className="text-muted lead subtitle-responsive">
              {isArabic
                ? "قم بتحميل تطبيقنا لتتبع جهود موظفيك بكل سهولة!"
                : "Download Our App To Track Your Employees Effortlessly!"}
            </p>

            <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
              <Link to="/download">
                <img src={appStore} alt="App Store" className="store-icon" />
              </Link>
              <a
                href="https://play.google.com/store/apps/details?id=com.SSTRACK&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={playStore} alt="Google Play" className="store-icon" />
              </a>
            </div>
          </Col>

          {/* Right Section (Image) */}
          <Col xs={12} sm={10} md={6} lg={6} className="text-center">
            <img src={phoneMockup} alt="Phone Mockup" className="mockup-image img-fluid" />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DownloadApp;
