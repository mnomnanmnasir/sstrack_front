import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apple from '../../images/apple-Screenshot.png';
import chrome from '../../images/chrome.svg';
import laptopandmob from '../../images/laptopImg.svg';
import microsoftlogo from '../../images/microsoft.svg';
import playstore from '../../images/playStore.svg';
import NavigationBar from '../../screen/component/header'; // Import your NavigationBar component
import NewHIW from '../LandingPage/Components/newHIW';
import ETIOP from '../LandingPage/Components/ETIOP'
import FeaturesSection from '../LandingPage/Components/FeaturesSection';
import ProductivitySection from '../LandingPage/Components/ProductivitySection';
import PricingSection from '../../screen/LandingPage/Components/PricingSection'
import DownaloadApp from '../LandingPage/Components/DownloadApp'
import FAQ from '../LandingPage/Components/FAQ';
import ContactSection from '../LandingPage/Components/ContactSection'
import StatsSection from '../LandingPage/Components/StatsSection';
import StartingSStrack from '../LandingPage/Components/StartingSStrack';
import translations from './Components/translations';
import NewHeader from '../component/Header/NewHeader';
import Footer from '../component/footer';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useSnackbar, SnackbarProvider } from 'notistack'; // ✅ Import Snackbar

function NewHome({ isAuthenticated }) {
  const navigate = useNavigate();
  const contactSectionRef = useRef(null); // Create a ref for ContactSection

  const scrollToContactSection = () => {
    if (contactSectionRef.current) {
      contactSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { enqueueSnackbar } = useSnackbar(); // ✅ Snackbar Hook

  const [language, setLanguage] = useState('en');

  const handleToggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleClick = () => {
    window.location.href = 'https://chromewebstore.google.com/detail/sstrack/gkmllhjndmaaapegaopkpapaamfaeckg?hl=en-US';
  };

  const [email, setEmail] = useState(""); // Store email input
  // Handle Form Submission
  const handleSubmit = (e) => {
    // e.preventDefault();

    if (!email) {
      // enqueueSnackbar("Please enter a valid email.", { variant: "error" }); // ✅ Show error message?
      enqueueSnackbar("Please enter a valid email.", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right"
        }
      })
      return;
    }

    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/signup", { state: { email } });
    }
  };

  // Handle Enter Key Press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission default behavior
      handleSubmit(); // Trigger button click action
    }
  };

  const currentText = translations[language];
  return (
    <>
      {/* Navbar */}

      <NewHeader language={language} handleToggleLanguage={handleToggleLanguage} />
      {/* Main content */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowX: 'hidden',
        overflowY: 'auto',
        backgroundColor: '#ffffff',
        scrollbarWidth: 'none',
        fontFamily: "'Sinkin Sans', sans-serif",
        textAlign: language === 'ar' ? 'right' : 'left',
        // direction: language === 'ar' ? 'rtl' : 'ltr',
      }}>
        <div style={{ position: 'sticky', top: '0', width: '100%', zIndex: '10' }}>

        </div>
        <div
          className="background-container"
          style={{
            position: 'absolute',
            width: '150%',
            height: '190%',
            top: '-115%',
            background: 'linear-gradient(90deg, #0D4873, #0A304B, #071F2D, #0C364F, #0D4873)',
            borderRadius: '40%',
            zIndex: 1,
          }}></div>
        <Container
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            color: '#ffffff',
            padding: '1.5rem',
          }}
        >
          {/* Heading and Description */}
          <Row className="justify-content-center">
            <Col lg={8} md={10} sm={12}>
              <h1
                style={{
                  fontSize: '2.2rem', // Default for desktop
                  fontWeight: '700',
                  marginBottom: '30px',
                  marginTop: '10%',
                  fontFamily: "'Sinkin Sans', sans-serif",
                }}
                className="mobile-heading"
              >
                {currentText.heading}
              </h1>
              <p
                style={{
                  fontSize: '1rem', // Default for desktop
                  fontWeight: '400',
                  marginBottom: '50px',
                  textAlign: 'center',
                  fontFamily: "'Sinkin Sans', sans-serif",
                }}
                className="mobile-paragraph"
              >
                {currentText.description}
              </p>
            </Col>
          </Row>

          {/* Signup Section */}
          <Row className="justify-content-center">
            <Col lg={6} md={8} sm={12} className="d-flex flex-column flex-sm-row align-items-center mb-4">
              <Form.Control
                type="email"
                placeholder={currentText.signUpPlaceholder}
                className=" mobile-input"
                // type="email"
                // placeholder={t.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: '0.86rem 1rem',
                  fontSize: '0.9rem', // Default for desktop
                  fontFamily: "'Sinkin Sans', sans-serif",
                  border: 'none',
                  outline: 'none',
                  borderRadius: '0' // ✅ Removes border-radius
                }}
                onKeyDown={handleKeyDown} // Listen for Enter key press
                required
              />
              <Button
                style={{
                  padding: '0.9rem 2.7rem',
                  fontSize: '0.9rem', // Default for desktop
                  fontFamily: "'Sinkin Sans', sans-serif",
                  backgroundColor: '#7ACB59',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  borderRadius: '0' // ✅ Removes border-radius
                }}
                className="mobile-button"
                onClick={handleSubmit}
              // onClick={() => navigate("/signup")}
              >
                {currentText.signUpButton}
              </Button>
            </Col>
          </Row>

          {/* Available Platforms Text */}
          <Row className="justify-content-center">
            <Col lg={8} md={10} sm={12}>
              <p
                style={{
                  fontSize: '1rem', // Default for desktop
                  fontWeight: '400',
                  marginTop: '1rem',
                  fontFamily: "'Sinkin Sans', sans-serif",
                }}
                className="mobile-available-platforms"
              >
                {currentText.availablePlatforms}
              </p>
            </Col>
          </Row>

          {/* Platforms Logos */}
          <Row className="justify-content-center text-center">
            {/* <Col xs={6} sm={4} md={3} className="mb-3 d-flex align-items-center justify-content-center">
              <Link to='/download'>
                <img src={microsoftlogo} alt="Microsoft" className="img-fluid platform-icon" style={{ height: "auto" }} />
              </Link>
            </Col> */}
            <Col xs={6} sm={4} md={3} className="mb-3 d-flex align-items-center justify-content-center">
              <Link to="https://apps.microsoft.com/detail/9N0C5QDB1LM7?hl=en-us&gl=PK&ocid=pdpshare" target="_blank" rel="noopener noreferrer">
                <img
                  src={microsoftlogo}
                  alt="Microsoft"
                  className="img-fluid platform-icon"
                  style={{ height: "auto" }}
                />
              </Link>
            </Col>
            <Col xs={6} sm={4} md={3} className="mb-3 d-flex align-items-center justify-content-center">
              <Link to='/download'>
                <img src={apple} alt="Apple" className="img-fluid platform-icon" style={{ height: "auto" }} />
              </Link>
            </Col>
            <Col xs={6} sm={4} md={3} className="mb-3 d-flex align-items-center justify-content-center">
              <a href="https://play.google.com/store/apps/details?id=com.SSTRACK&pcampaignid=web_share" target="_blank">
                <img src={playstore} alt="Google Play" className="img-fluid platform-icon" style={{ height: "auto" }} />
              </a>
            </Col>
            <Col xs={6} sm={4} md={3} className="mb-3 d-flex align-items-center justify-content-center">
              <img src={chrome} alt="Chrome Web Store" className="img-fluid platform-icon" style={{ height: "auto", cursor: 'pointer' }}
                onClick={handleClick} // Directly calls handleClick without checking loading state
              />
            </Col>
          </Row>

        </Container>
        <img
          src={laptopandmob}
          alt="Laptop and Mobile Mockup for Employee Monitoring Software"
          style={{
            position: 'relative',
            top: '60%',
            width: '81%',
            zIndex: 2,
          }}
        />
      </div >
      {/* <StatsSection language={language} /> */}
      <div id="section1">
        <NewHIW language={language} />
      </div>
      <ETIOP language={language} />
      <FeaturesSection language={language} />
      <ProductivitySection language={language} />
      <div id="pricing">
        <PricingSection onContactButtonClick={scrollToContactSection} language={language} />
      </div>
      <DownaloadApp language={language} />
      <div id="faq">
        <FAQ onContactButtonClick={scrollToContactSection} language={language} />
      </div>
      <div ref={contactSectionRef} id="section3">
        <ContactSection language={language} />
      </div>
      <StartingSStrack language={language} />
      {/* <Footer language={language} /> */}
    </>
  );
}

export default NewHome;

