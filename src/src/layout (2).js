import React, { useEffect, useState } from 'react';
import Header from './screen/component/header';
import Footer from './screen/component/footer';
import { Outlet, useLocation } from 'react-router-dom';
import UserHeader from './screen/component/userHeader';

const Layout = () => {

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>
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
          location.pathname.startsWith("/update-password") ||
          location.pathname.startsWith("/create-account") ||
          location.pathname === "/download" ? (
          <Header />
        ) : (
          location.pathname !== "/capture-screen" && <UserHeader />
        )
      }
      <div>
        <Outlet />
      </div>
      <div style={{ padding: "30px" }}>
        {location.pathname !== "/capture-screen" && <Footer scrollToSection={scrollToSection} />}
      </div>
    </div>
  );
}

export default Layout;