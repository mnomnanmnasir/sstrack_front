// import React, { useEffect, useState } from 'react';
import React, { useRef, useEffect, useState } from 'react';
import Header from './screen/component/header';
import Footer from './screen/component/footer';
import { Outlet, useLocation } from 'react-router-dom';
import UserHeader from './screen/component/userHeader';
import NewHeader from './screen/component/Header/NewHeader';
import Sidebar from './userSidebar/Sidebar';
import { useSocket } from './io'; // Correct import
import jwtDecode from "jwt-decode";
import axios from "axios";

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

  const socket = useSocket();

  // const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userType, setUserType] = useState(() => {
    try {
      return token ? jwtDecode(token)?.userType : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!socket) return;

    const handleRoleUpdate = async () => {
      try {
        const response = await axios.patch("https://myuniversallanguages.com:9093/api/v1/signin/users/Update", {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        });

        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
          setToken(response.data.token); // also update main token
          const newUserType = jwtDecode(response.data.token).userType;
          setUserType(newUserType);
          console.log("Layout received role_update, userType set to:", newUserType);
        }
      } catch (error) {
        console.error("Failed to update userType after role_update", error);
      }
    };

    socket.on("role_update", handleRoleUpdate);
    return () => {
      socket.off("role_update", handleRoleUpdate);
    };
  }, [socket]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
          location.pathname === "/workCards" ||
          location.pathname === "/aboutUs" ||
          location.pathname === "/product" ||
          location.pathname === "/splash" ||
          location.pathname.startsWith("/update-password") ||
          location.pathname.startsWith("/create-account") ? (
          <>
            <Outlet />
            <Footer
              onContactButtonClick={scrollToContactSection}
              language={language}
              handleToggleLanguage={handleToggleLanguage}
              scrollToSection={scrollToSection}
            />
          </>
        ) : (
          location.pathname !== "/capture-screen" && token && (
            <>
              <div className="d-flex" style={{ minHeight: '100vh', overflow: 'hidden' }}>

                <Sidebar userType={userType} />
                {/* <Sidebar /> */}

                <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: 'hidden', overflowY: 'auto', maxHeight: '100vh' }}>
                  <UserHeader />
                  <div className="flex-grow-1">
                    <Outlet />
                  </div>
                  <Footer
                    onContactButtonClick={scrollToContactSection}
                    language={language}
                    handleToggleLanguage={handleToggleLanguage}
                    scrollToSection={scrollToSection}
                  />
                </div>
              </div>
            </>
          )
        )
      }
    </div>
  );

}

export default Layout;