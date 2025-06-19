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
import axios from 'axios';

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

  // const [user, setUser] = useState(() => {
  //   try {
  //     return token ? jwtDecode(token) : null;
  //   } catch {
  //     return null;
  //   }
  // });

  const [language, setLanguage] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // const [token, setToken] = useState(localStorage.getItem('token') || null);

  const [user, setUser] = useState(() => {
    try {
      return token ? jwtDecode(token) : null;
    } catch {
      return null;
    }
  });

  const [userType, setUserType] = useState(() => {
    try {
      return token ? jwtDecode(token)?.userType : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!socket) return;

    const handleRoleUpdate = (data) => {
      const oldToken = localStorage.getItem("token");
      if (!oldToken) return;

      const oldDecoded = jwtDecode(oldToken);
      if (data.user_id === oldDecoded._id) {
        localStorage.setItem("token", data.new_token);   // ✅ Save new token

        const newDecoded = jwtDecode(data.new_token);
        setToken(data.new_token);                        // ✅ Force rerender
        setUserType(newDecoded.userType);                // ✅ Update userType state
      }
    };

    socket.on('role_update', handleRoleUpdate);
    return () => socket.off('role_update', handleRoleUpdate);
  }, [socket]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setUserType(decoded.userType);  // ✅ make sure this runs
      } catch {
        setUser(null);
        setUserType(null);
      }
    }
  }, [token]);

  return (
    location.pathname === "/capture-screen" ? (
      // Fullscreen clean outlet for modal/screenshot mode
      <Outlet />
    ) : (
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
            location.pathname === "/contact" ||
            location.pathname === "/product" ||
            location.pathname === "/splash" ||
            location.pathname === "/Training" ||
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
            token && (
              <div className="d-flex" style={{ overflow: 'hidden' }}>
                <Sidebar
                  open={sidebarOpen}
                  key={userType}
                  onClose={() => setSidebarOpen(false)}
                  userType={userType}
                />
                <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: 'hidden', overflowY: 'auto', maxHeight: '100vh' }}>
                  <UserHeader
                    userType={userType}
                    setUserType={setUserType}
                    setSidebarOpen={setSidebarOpen}
                    sidebarOpen={sidebarOpen}
                  />
                  <div className="flex-grow-1">
                    <Outlet />
                    <Footer
                      onContactButtonClick={scrollToContactSection}
                      language={language}
                      handleToggleLanguage={handleToggleLanguage}
                      scrollToSection={scrollToSection}
                    />
                  </div>
                </div>
              </div>
            )
          )
        }
      </div>
    )
  );

}

export default Layout;