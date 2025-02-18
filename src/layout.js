// import React, { useEffect, useState } from 'react';
import React, { useRef, useState } from 'react';
import Header from './screen/component/header';
import Footer from './screen/component/footer';
import { Outlet, useLocation } from 'react-router-dom';
import UserHeader from './screen/component/userHeader';
import NewHeader from './screen/component/Header/NewHeader';

const Layout = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const location = useLocation()

  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const [language, setLanguage] = useState('en');

  const handleToggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };
  const contactSectionRef = useRef(null); // Create a ref for ContactSection

  const scrollToContactSection = () => {
    if (contactSectionRef.current) {
      contactSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between', marginTop: '-10px' }}>
      {
        location.pathname === "/" ||
          location.pathname === "/signin" ||
          location.pathname === "/signup" ||
          location.pathname === "/forgetpassword" ||
          location.pathname === "/download" ||
          location.pathname === "/systemAdminLogin" ||
          location.pathname === "/forget-password" ||
          location.pathname === "/file-upload" ||
          location.pathname === "/verification-code" ||
          location.pathname === "/privacy-policy" ||
          location.pathname === "/privacy-policy1" ||
          location.pathname === "/privacy-policy2" ||
          location.pathname === "/aboutUs" ||
          location.pathname === "/product" ||
          location.pathname === "/splash" ||
          location.pathname.startsWith("/update-password") ||
          location.pathname.startsWith("/create-account") ||
          location.pathname === "/download" ? (
          <></>
        ) : (
          location.pathname !== "/capture-screen" && token && <UserHeader />

        )
      }
      <div>
        <Outlet />
      </div>
      <div style={{ marginBottom: '0px' }}>
        {location.pathname !== "/capture-screen" && <Footer onContactButtonClick={scrollToContactSection} language={language} handleToggleLanguage={handleToggleLanguage} scrollToSection={scrollToSection} />}
      </div>
    </div>
  )
}

export default Layout;