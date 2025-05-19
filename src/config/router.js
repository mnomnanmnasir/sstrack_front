import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, } from "react-router-dom";
import Signup from "../screen/signup";
import SignIn from "../screen/signin";
import UserDashboard from "../screen/userDashboard";
import UserDetails from "../screen/userDetails";
import Account from "../screen/account";
import Profile from "../screen/profile";
import ForgetPassword from "../screen/forgetpassword";
import Setting from "../adminScreens/setting";
import SystemAdminLogin from "../systemAdmin/systemAdminLogin";
import OwnerUserSignup from "../companyOwner/ownerUser";
import OwnerTeam from "../companyOwner/ownerTeam";
import Download from "../screen/download";
import CreateAccount from "../screen/createAccount";
import Layout from "../layout";
import UpdatePassword from "../screen/updatePassword";
import VerificationCode from "../screen/verificationCode";
import CaptureScreen from "../screen/captureScreen";
import OwnerReport from "../screen/owner-reports";
import OwnerUserTimeline from "../companyOwner/ownerUsersTimeline";
import PrivacyPolicy from "../screen/privacy-policy";
import PrivacyPolicy1 from '../screen/privacy-policy1'
import PrivacyPolicy2 from '../screen/privacy-policy2'
import Attendence from "../screen/AttendenceManagement/Attendence";
import Payment from "../screen/payment";
import axios from "axios";
import Pricing from '../screen/pricing'
import WorkCards from "../screen/howitwork";
// import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import OwnerLeaveManagement from '../companyOwner/owner-setting-components/ownerLeaveManagement'
import SaLogin from '../SuperAdmin/SuperAdmin/saLogin'
import PrivateRoute from './PrivateRoutes'
import SaMain from '../SuperAdmin/SuperAdmin/saMain'
import UserSettings from '../companyOwner/owner-setting-components/userSetting'
import ApplyForLeave from '../companyOwner/owner-setting-components/ApplyForLeave'
import LocaitonTracking from "../Tracking/Locationtracking";
import NewHome from "../screen/LandingPage/newHome";
import AboutUs from "../screen/AboutUS/aboutUs";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import DashboardSplash from "../screen/spalsh/dashboardSplash";
import Project from "../screen/Project/Project";
import Home from "../screen/home";
import Product from '../screen/Product/Product'
import BreakTime from '../adminScreens/settingScreenComponent/breakTime'
import Punctuality from '../adminScreens/settingScreenComponent/punctuality'
import ActivityLevel from "../adminScreens/settingScreenComponent/activitylevel";
import UrlTracking from "../adminScreens/settingScreenComponent/url";
import History from '../screen/historyLogs'
import Notification from '../screen/Notification/notificationHistory'

import OwnerManualLeave from '../companyOwner/owner-setting-components/ownerManualLeave'
import TrainingPage from "../screen/Training/TrainingPage";
import PunctualityReports from '../screen/PunctualityReport/PunctualityMainComp'
import Chrome from "../screen/Chrome";
import Appstore from "../screen/Appstore";
import PlayStore from "../screen/playStore";
import Windows from "../screen/Windows";
import Macos from "../screen/Macos";
import AnalyticsTracker from "../screen/component/AnalyticsTracker"; // ✅ Add this at top
import Contact from "../screen/ContactUS/Contact"; // ✅ Add this at top
import NotFound from '../screen/NotFound'; // Adjust the import path as necessary
import PayStubs from "../screen/PayStub/PayStubs";
// import PayStubGenerator from "../screen/PayStubGenerator";
import CreateBlogs from "../screen/component/Blogs/CreateBlogs";
import PayrollHistory from "../screen/PayStub/PayrollHistory";
import PayStubGenerator from "../screen/PayStub/PayStubGenerator";
import AssignUsers from "../screen/component/BlogsUsers/blogsAccess";
// import PayrollTable from "../screen/PayStub/PayrollTable";
import GeoFance from '../screen/component/GeoFancing/geoFance'
import GeoFanceAdd from '../screen/component/GeoFancing/AddGeoFence'
import AddEmployee from "../screen/PayStub/AddEmployee";
import PayroleUser from "../screen/PayStub/PayroleUser";
import AddEmployees from "../screen/component/GeoFancing/AddEmployees";


export default function AppRouter() {

  // const token = useSelector((state) => state.auth.token);
  // console.log("Token from Redux:", tokenfromRedux); 
  const [suspended, setSuspended] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  // const items = jwtDecode(JSON.stringify(token));
  console.log('decoded data', token)

  useEffect(() => {
    const fetchTokenAndSuspendedStatus = async () => {
      if (token) {
        // console.log('++++++++++++++++++++', token)
        try {
          const headers = {
            Authorization: `Bearer ${token}`,
          };
          const apiUrl = 'https://myuniversallanguages.com:9093/api/v1';
          const response = await axios.get(`${apiUrl}/owner/getCompanyInfo`, { headers });
          // For objects or arrays:
          // const planindex = response?.data.data[0].planId.length - 1;
          // const planId = response?.data.data[0].planId?.slice(-1)[0]?.id || null;
          // const planId = response?.data.data[0].planId[planindex].id;


          // Save to localStorage after converting to a string
          // localStorage.setItem('planId', JSON.stringify(planId));
          // localStorage.setItem('planIdforHome', JSON.stringify(planId));
          // Simulate a delay of 2 seconds
          setTimeout(() => {
            setSuspended(response?.data.data[0].suspended);
            setLoading(false); // Move this inside the timeout
          }, 2000);
        } catch (err) {
          console.error('Error fetching data%%%%%%%%%%%%%%%%%%%%%%%', err);
          let planId = null;
          // localStorage.setItem('planId', JSON.stringify(planId));
          // localStorage.setItem('planIdforHome', JSON.stringify(planId));
        }
      }
      setLoading(false);
    };

    fetchTokenAndSuspendedStatus();

  }, [token]);
  // console.log('suspended=========', token);



  useEffect(() => {
    if (!token) {
      setToken(localStorage.getItem("token"));
    }
  }, [token]);

  const userInfo = token ? jwtDecode(token) : null;

  return (
    <>
      <Router>
        <AnalyticsTracker />  {/* ✅ Track route changes here */}
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}

            <Route path="/download" element={<Download />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/product" element={<Product />} />
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/splash" element={<DashboardSplash />} /> */}
            <Route
              path="/splash"
              element={
                userInfo?.userType === 'admin' || userInfo?.userType === 'manager'
                  ? <Navigate to="/dashboard" />
                  : <DashboardSplash />
              }
            />
            <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/dashboard" />} />
            <Route path="/account" element={token ? <Account suspended={suspended} /> : <Navigate to="/signup" />} />
            <Route path="/signin" element={!token ? <SignIn /> : <Navigate to="/dashboard" />} />
            <Route path="/systemAdminLogin" element={<SystemAdminLogin />} />
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<NewHome />} />
            <Route path="/capture-screen" element={<CaptureScreen />} />
            {/* <Route path="/:token" element={<NewHome />} /> */}


            <Route path="/create-account/:code/:email" element={<CreateAccount />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/update-password/:id" element={<UpdatePassword />} />
            <Route path="/verification-code" element={<VerificationCode />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy1" element={<PrivacyPolicy1 />} />
            <Route path="/privacy-policy2" element={<PrivacyPolicy2 />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/blogs" element={<CreateBlogs />} />
            <Route path="/Training" element={ <TrainingPage />} />

            <Route path="/dashboard" element={token ? (suspended ? <Navigate to="/account" /> : <UserDashboard />) : <Navigate to="/" />} />
            <Route path="/blogs-assign-users" element={token ? (suspended ? <Navigate to="/account" /> : <AssignUsers />) : <Navigate to="/" />} />

            <Route path="/timeline" element={token ? (suspended ? <Navigate to="/account" /> : <UserDetails />) : <Navigate to="/" />} />
            <Route path="/timeline/:id" element={token ? (suspended ? <Navigate to="/account" /> : <UserDetails />) : <Navigate to="/" />} />
            <Route path="/account" element={token ? <Account /> : <Navigate to="/" />} />
            <Route path="/effective-settings" element={token ? (suspended ? <Navigate to="/account" /> : <Setting />) : <Navigate to="/" />} />
            <Route path="/user-setting" element={token ? (suspended ? <Navigate to="/account" /> : <UserSettings />) : <Navigate to="/" />} />
            <Route path="/Training" element={token ? (suspended ? <Navigate to="/account" /> : <TrainingPage />) : <Navigate to="/" />} />
            <Route path="/notification" element={token ? (suspended ? <Navigate to="/account" /> : <Notification />) : <Navigate to="/" />} />
            {/* <Route path="/history" element={token ? (suspended ? <Navigate to="/account" /> : <History />) : <Navigate to="/" />} /> */}
            <Route path="/pay_stub_managment" element={token ? (suspended ? <Navigate to="/account" /> : <PayStubGenerator />) : <Navigate to="/" />} />
            <Route path="/pay_stub_View" element={token ? (suspended ? <Navigate to="/account" /> : <PayStubs />) : <Navigate to="/" />} />
            <Route path="/punctuality-reports" element={token ? (suspended ? <Navigate to="/account" /> : <PunctualityReports />) : <Navigate to="/" />} />
            <Route path="/PayStub_history" element={token ? (suspended ? <Navigate to="/account" /> : <PayrollHistory/>) : <Navigate to="/" />} />
            <Route path="/PayStub_user" element={token ? (suspended ? <Navigate to="/account" /> : <PayroleUser/>) : <Navigate to="/" />} />

            {/* <Route path="/team" element={token ? (suspended ? <Navigate to="/account" /> : <OwnerTeam />) : <Navigate to="/" />} /> */}
            <Route
              path="/team"
              element={
                token
                  ? suspended
                    ? <Navigate to="/account" />
                    : userInfo?.userType === 'user'
                      ? <Navigate to="/dashboard" />
                      : <OwnerTeam />
                  : <Navigate to="/" />
              }
            />

            <Route path="/reports" element={token ? (suspended ? <Navigate to="/account" /> : <OwnerReport />) : <Navigate to="/" />} />
            <Route path="/Projects" element={token ? (suspended ? <Navigate to="/account" /> : <Project />) : <Navigate to="/" />} />
            <Route path="/company-owner-user" element={token ? (suspended ? <Navigate to="/account" /> : <OwnerUserSignup />) : <Navigate to="/" />} />
            <Route path="/activity/:id" element={token ? (suspended ? <Navigate to="/account" /> : <OwnerUserTimeline />) : <Navigate to="/" />} />
            <Route path="/profile" element={token ? (suspended ? <Navigate to="/account" /> : <Profile />) : <Navigate to="/" />} />
            <Route path="/leave-management" element={token ? (suspended ? <Navigate to="/account" /> : <OwnerLeaveManagement />) : <Navigate to="/" />} />
            <Route path="/applyForLeave" element={token ? (suspended ? <Navigate to="/account" /> : <ApplyForLeave />) : <Navigate to="/" />} />
            <Route path="/ownerManualLeave" element={token ? (suspended ? <Navigate to="/account" /> : <OwnerManualLeave />) : <Navigate to="/" />} />
            <Route path="/Locationtracking" element={token ? (suspended ? <Navigate to="/account" /> : <LocaitonTracking />) : <Navigate to="/" />} />
            {/* <Route path="/Locationtracking" element={token ? (suspended ? <Navigate to="/account" /> : <LocaitonTracking />) : <Navigate to="/" />} /> */}
            <Route path="/attendence-management" element={token ? (suspended ? <Navigate to="/account" /> : <Attendence />) : <Navigate to="/" />} />
            <Route path="/geo-fance" element={token ? (suspended ? <Navigate to="/account" /> : <GeoFance />) : <Navigate to="/" />} />
            <Route path="/geo-fance/add" element={token ? (suspended ? <Navigate to="/account" /> : <GeoFanceAdd />) : <Navigate to="/" />} />
            <Route path="/geo-fance/add-employees" element={token ? (suspended ? <Navigate to="/account" /> : <AddEmployees />) : <Navigate to="/" />} />

            <Route path="/add-employee" element={token ? (suspended ? <Navigate to="/account" /> : <AddEmployee />) : <Navigate to="/" />} />
            <Route path="/history" element={token ? (suspended ? <Navigate to="/account" /> : <History />) : <Navigate to="/" />} />
            {/* <Route path="/pay_stub_managment" element={token ? (suspended ? <Navigate to="/account" /> : <PayStubGenerator />) : <Navigate to="/" />} />
            <Route path="/pay_stub_View" element={token ? (suspended ? <Navigate to="/account" /> : <PayStubs />) : <Navigate to="/" />} />
            <Route path="/punctuality-reports" element={token ? (suspended ? <Navigate to="/account" /> : <PunctualityReports />) : <Navigate to="/" />} /> */}

            {/* <Route path="/effective-settings/break-time" element={<BreakTime />} /> */}
            <Route path="/settings" element={<Setting />}>

              <Route path="break-time" element={<BreakTime />} />
              <Route path="punctuality" element={<Punctuality />} />
            
            </Route>
            {/* <Route
                path="/profile"
                element={
                  localStorage.getItem("googleEmail") ? (
                    <Profile />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              /> */}

            {/* <Route path="/profile" element={token ? (suspended ? <Navigate to="/account" /> : <Profile />) : <Navigate to="/" />} /> */}
            <Route path="/pricing" element={token ? (suspended ? <Navigate to="/account" /> : <Pricing />) : <Navigate to="/" />} />
            <Route path="/workCards" element={<WorkCards />} />
            {/* <Route path="/privacy-policy" element={token ? <PrivacyPolicy /> : <Navigate to="/" />} /> */}
            {/* <Route path="/privacy-policy1" element={<PrivacyPolicy1/>} />
              <Route path="/privacy-policy2" element={<PrivacyPolicy2 />} /> */}
          </Route>

          {/* <Route path="*" element={<Navigate to="/signin" />} /> */}
          {/* Catch-all route */}
          <Route path="/sALogin" element={<SaLogin />} />
          <Route path="/sADashboard" element={<SaMain />} />
          <Route path="/chrome" element={<Chrome />} />
          <Route path="/app_store" element={<Appstore />} />
          <Route path="/play_store" element={<PlayStore />} />
          <Route path="/windows" element={<Windows />} />
          <Route path="/macos" element={<Macos />} />

          <Route path="/:token" element={<Home />} />

          <Route path="*" element={<NotFound />} />

          {/* <Route path="/contact-us" element={<Contact />} /> */}

        </Routes>
      </Router>
    </>
  );
}
