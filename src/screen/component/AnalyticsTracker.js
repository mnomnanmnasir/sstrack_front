// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import ReactGA from "react-ga4";

// // ✅ Use env variable
// const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
// ReactGA.initialize(measurementId); // From .env

// const AnalyticsTracker = () => {
//   const location = useLocation();

//   useEffect(() => {
//     const path = location.pathname + location.search;
//     console.log("📊 Sending GA pageview for:", path);
//     ReactGA.send({ hitType: "pageview", page: path });
//   }, [location]);

//   return null;
// };

// export default AnalyticsTracker;


import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import { Helmet } from "react-helmet";

// ✅ Google Analytics Init
const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
ReactGA.initialize(measurementId);

// ✅ Route-to-Title Map
const routeTitles = {
  "/": {
    title: "Employee Time Tracking, Payroll & Monitoring Software | SSTrack",
    description: " All-in-one workforce management tool with time tracking, screenshot monitoring, GPS attendance, and payroll automation. Built for hybrid and remote teams."
  },
  "/signup": {
    title: "SSTrack | Sign Up",
    description: "Create your free SSTrack account to start monitoring your team's productivity."
  },
  "/signin": {
    title: "SSTrack | Sign In",
    description: "Access your SSTrack account and manage your team’s performance."
  },
  "/dashboard": {
    title: "SSTrack | Dashboard",
    description: "Your centralized dashboard for real-time activity monitoring and time tracking."
  },
  "/account": {
    title: "SSTrack | Account",
    description: "View and manage your SSTrack account settings."
  },
  "/contact": {
    title: " Contact Us – Get Support or Schedule a Demo | SSTrack",
    description: " Have questions or need a demo? Reach out to the SSTrack team for support, partnership inquiries, or to learn how our employee tracking and payroll solution can help your business."
  },
  "/download": {
    title: "SSTrack | Downloads",
    description: "Download SSTrack for Windows, macOS, and mobile platforms."
  },
  "/aboutus": {
    title: " About SSTrack – Global Time Tracking & Employee Monitoring Solution",
    description: " Discover how SSTrack helps businesses manage remote and hybrid teams with real-time tracking, screenshot monitoring, GPS logs, and secure payroll integration."
  },
  "/pricing": {
    title: " SSTrack Product Features – Time, GPS & Screenshot-Based Tracking",
    description: " Explore SSTrack’s powerful features including automated time tracking, desktop and mobile monitoring, screenshot capture, GPS attendance, and payroll export."
  },
  "/profile": {
    title: "SSTrack | Profile",
    description: "Manage your profile and personal settings within SSTrack."
  },
  "/product": {
    title: " SSTrack Product Features – Time, GPS & Screenshot-Based Tracking",
    description: " Explore SSTrack’s powerful features including automated time tracking, desktop and mobile monitoring, screenshot capture, GPS attendance, and payroll export."
  },
  "/training": {
    title: "SSTrack Training Center – Guide to Setup, Tracking & Reporting",
    description: "Step-by-step training on how to use SSTrack for time logging, GPS attendance, screenshot monitoring, and generating payroll-ready productivity reports."
  },
  "/workcards": {
    title: " How SSTrack Works – Simple Time & Attendance Tracking Workflow",
    description: " Learn how SSTrack simplifies employee tracking with desktop and mobile apps, screenshot monitoring, and real-time dashboards for managers and admins."
  },
  "/privacy-policy": {
    title: "SSTrack | Privacy Policy",
    description: "Read our privacy policy to understand how we handle your data securely."
  },
  "/pay_stub_managment": {
    title: "SSTrack | Paystub Manager",
    description: "Create and manage employee pay stubs efficiently with SSTrack."
  },
  "/team": {
    title: "SSTrack | Team Overview",
    description: "View your company team structure and employee activity summaries."
  },
  "/locationtracking": {
    title: "SSTrack | Location Tracking",
    description: "Track and monitor employee locations for field-based teams."
  },
  "/notification": {
    title: "SSTrack | Notification History",
    description: "View recent system notifications and activity alerts."
  },
  "/chrome": {
    title: "SSTrack | Chrome Extension",
    description: "Install our Chrome extension to enhance browser activity tracking."
  },
  "/macos": {
    title: "SSTrack | macOS App",
    description: "Download the macOS desktop application to enable smart tracking features."
  },
  "/windows": {
    title: "SSTrack | Windows App",
    description: "Get SSTrack for Windows and begin monitoring in seconds."
  },
  "/play_store": {
    title: "SSTrack | Android App",
    description: "Download SSTrack from Google Play to track time on the go."
  },
  "/app_store": {
    title: "SSTrack | iOS App",
    description: "Track time and manage tasks with SSTrack’s iOS app."
  },
  "/salogin": {
    title: "SSTrack | Super Admin Login",
    description: "Login to access super admin features and analytics tools."
  },
  "/sadashboard": {
    title: "SSTrack | Super Admin Dashboard",
    description: "Control system-wide settings and access global analytics for SSTrack."
  }
};


const AnalyticsTracker = () => {
  const location = useLocation();
  const [title, setTitle] = useState("SSTrack");
  const [meta, setMeta] = useState({
    title: "SSTrack",
    description: "SSTrack helps you monitor your employees and boost productivity across remote teams."
  });

  useEffect(() => {
    const path = location.pathname + location.search;

    // GA Page View
    console.log("📊 Sending GA pageview for:", path);
    ReactGA.send({ hitType: "pageview", page: path });

    // Title Update
    const pathname = location.pathname.toLowerCase();

    // Handle dynamic paths like /timeline/:id
    let dynamicTitle = routeTitles[pathname];
    if (!dynamicTitle) {
      if (pathname.startsWith("/timeline")) {
        dynamicTitle = "SSTrack | User Timeline";
      } else {
        dynamicTitle = "";
      }
    }

    setMeta(dynamicTitle);
  }, [location]);

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href="https://www.sstrack.io/" />

    </Helmet>
  )
};

export default AnalyticsTracker;
