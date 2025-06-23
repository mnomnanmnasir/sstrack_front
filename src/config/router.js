import React, { lazy, Suspense, useState, useEffect } from 'react';
import { RingSpinnerOverlay } from 'react-spinner-overlay';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
const Signup = lazy(() => import("../screen/signup"));
const SignIn = lazy(() => import("../screen/signin"));
const UserDashboard = lazy(() => import("../screen/userDashboard"));
const UserDetails = lazy(() => import("../screen/userDetails"));
const Account = lazy(() => import("../screen/account"));
const Profile = lazy(() => import("../screen/profile"));
const ForgetPassword = lazy(() => import("../screen/forgetpassword"));
const Setting = lazy(() => import("../adminScreens/setting"));
const OwnerUserSignup = lazy(() => import("../companyOwner/ownerUser"));
const OwnerTeam = lazy(() => import("../companyOwner/ownerTeam"));
const Download = lazy(() => import("../screen/download"));
const CreateAccount = lazy(() => import("../screen/createAccount"));
const Layout = lazy(() => import("../layout"));
const UpdatePassword = lazy(() => import("../screen/updatePassword"));
const VerificationCode = lazy(() => import("../screen/verificationCode"));
const CaptureScreen = lazy(() => import("../screen/captureScreen"));
const OwnerReport = lazy(() => import("../screen/owner-reports"));
const PrivacyPolicy = lazy(() => import("../screen/privacy-policy"));
const Attendence = lazy(() => import("../screen/AttendenceManagement/Attendence"));
const Pricing = lazy(() => import('../screen/pricing'));
const WorkCards = lazy(() => import("../screen/howitwork"));
const OwnerLeaveManagement = lazy(() => import('../companyOwner/owner-setting-components/ownerLeaveManagement'));
const SaLogin = lazy(() => import('../SuperAdmin/SuperAdmin/saLogin'));
const SaMain = lazy(() => import('../SuperAdmin/SuperAdmin/saMain'));
const UserSettings = lazy(() => import('../companyOwner/owner-setting-components/userSetting'));
const ApplyForLeave = lazy(() => import('../companyOwner/owner-setting-components/ApplyForLeave'));
const LocaitonTracking = lazy(() => import("../Tracking/Locationtracking"));
const NewHome = lazy(() => import("../screen/LandingPage/newHome"));
const AboutUs = lazy(() => import("../screen/AboutUS/aboutUs"));
const DashboardSplash = lazy(() => import("../screen/spalsh/dashboardSplash"));
const Project = lazy(() => import("../screen/Project/Project"));
const Home = lazy(() => import("../screen/home"));
const Product = lazy(() => import('../screen/Product/Product'));
const BreakTime = lazy(() => import('../adminScreens/settingScreenComponent/breakTime'));
const Punctuality = lazy(() => import('../adminScreens/settingScreenComponent/punctuality'));
const History = lazy(() => import('../screen/historyLogs'));
const Notification = lazy(() => import('../screen/Notification/notificationHistory'));
const OwnerManualLeave = lazy(() => import('../companyOwner/owner-setting-components/ownerManualLeave'));
const TrainingPage = lazy(() => import("../screen/Training/TrainingPage"));
const PunctualityReports = lazy(() => import('../screen/PunctualityReport/PunctualityMainComp'));
const Chrome = lazy(() => import("../screen/Chrome"));
const Appstore = lazy(() => import("../screen/Appstore"));
const PlayStore = lazy(() => import("../screen/playStore"));
const Windows = lazy(() => import("../screen/Windows"));
const Macos = lazy(() => import("../screen/Macos"));
const AnalyticsTracker = lazy(() => import("../screen/component/AnalyticsTracker"));
const Contact = lazy(() => import("../screen/ContactUS/Contact"));
const NotFound = lazy(() => import('../screen/NotFound'));
const PayStubs = lazy(() => import("../screen/PayStub/PayStubs"));
const CreateBlogs = lazy(() => import("../screen/component/Blogs/CreateBlogs"));
const PayrollHistory = lazy(() => import("../screen/PayStub/PayrollHistory"));
const PayStubGenerator = lazy(() => import("../screen/PayStub/PayStubGenerator"));
const AssignUsers = lazy(() => import("../screen/component/BlogsUsers/blogsAccess"));
const AddEmployee = lazy(() => import("../screen/PayStub/AddEmployee"));
const PayroleUser = lazy(() => import("../screen/PayStub/PayroleUser"));
const GeoFance = lazy(() => import("../screen/component/GeoFancing/geoFance"));
const GeoFanceAdd = lazy(() => import("../screen/component/GeoFancing/AddGeoFence"));
const AddEmployees = lazy(() => import("../screen/component/GeoFancing/AddEmployees"));
const AlertComp = lazy(() => import("../screen/component/GeoFancing/AlertComp"));
const Reports = lazy(() => import("../screen/component/GeoFancing/Reports"));
const Incident = lazy(() => import("../screen/component/GeoFancing/Incident"));

// Create a loading component
const Loading = () => (
  <div style={{ height: '100vh', width: '100vw' }}>
    <RingSpinnerOverlay
      loading={true}
      overlayColor="rgba(255, 255, 255, 0.8)"
      size={60}
      color="#007bff"
      message="Loading, please wait..."
      messageStyle={{
        fontSize: '16px',
        color: '#333',
        marginTop: '16px',
      }}
    />
  </div>
);

export default function AppRouter() {
  const [suspended, setSuspended] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenAndSuspendedStatus = async () => {
      if (token) {
        // console.log('++++++++++++++++++++', token)
        try {
          const headers = {
            Authorization: `Bearer ${token}`,
          };
          const apiUrl = process.env.REACT_APP_API_URL;
          const response = await axios.get(`${apiUrl}/owner/getCompanyInfo`, { headers });
          setTimeout(() => {
            setSuspended(response?.data.data[0].suspended);
            setLoading(false); // Move this inside the timeout
          }, 2000);
        } catch (err) {
          console.error('Error fetching data%%%%%%%%%%%%%%%%%%%%%%%', err);
        }
      }
      setLoading(false);
    };

    fetchTokenAndSuspendedStatus();

  });
  // console.log('suspended=========', token);



  useEffect(() => {
    if (!token) {
      setToken(localStorage.getItem("token"));
    }
  }, [token]);

  // const userInfo = token ? jwtDecode(token) : null;
  const [userInfo, setUserInfo] = useState(token ? jwtDecode(token) : null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo(decoded);
      } catch {
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  }, [token]);

  return (
    <>
      <Router>
        <AnalyticsTracker />
        {/* <Suspense fallback={<Loading />}> */}
        <Routes>
          <Route path="/" element={
            <Suspense fallback={<Loading />}>
              <Layout />
            </Suspense>
          }>
            {/* Public Routes */}
            <Route path="/download" element={<Download />} />
            <Route path="/aboutUs" element={<AboutUs />} />
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
            {/* <Route path="/systemAdminLogin" element={<SystemAdminLogin />} /> */}
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<NewHome />} />
            <Route path="/capture-screen" element={<CaptureScreen />} />
            {/* <Route path="/:token" element={<NewHome />} /> */}
            <Route path="/create-account/:code/:email" element={<CreateAccount />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/update-password/:id" element={<UpdatePassword />} />
            <Route path="/verification-code" element={<VerificationCode />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/blogs" element={<CreateBlogs />} />
            <Route path="/Training" element={<TrainingPage />} />

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
            <Route path="/PayStub_history" element={token ? (suspended ? <Navigate to="/account" /> : <PayrollHistory />) : <Navigate to="/" />} />
            <Route path="/PayStub_user" element={token ? (suspended ? <Navigate to="/account" /> : <PayroleUser />) : <Navigate to="/" />} />
            <Route path="/geo-fance" element={token ? (suspended ? <Navigate to="/account" /> : <GeoFance />) : <Navigate to="/" />} />
            <Route path="/geo-fance/add" element={token ? (suspended ? <Navigate to="/account" /> : <GeoFanceAdd />) : <Navigate to="/" />} />
            <Route path="/geo-fance/add-employees" element={token ? (suspended ? <Navigate to="/account" /> : <AddEmployees />) : <Navigate to="/" />} />
            <Route path="/geo-fance/alert" element={token ? (suspended ? <Navigate to="/account" /> : <AlertComp />) : <Navigate to="/" />} />
            <Route path="/geo-fance/reports" element={token ? (suspended ? <Navigate to="/account" /> : <Reports />) : <Navigate to="/" />} />
            <Route path="/geo-fance/incident" element={token ? (suspended ? <Navigate to="/account" /> : <Incident />) : <Navigate to="/" />} />

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
            {/* <Route path="/activity/:id" element={token ? (suspended ? <Navigate to="/account" /> : <OwnerUserTimeline />) : <Navigate to="/" />} /> */}
            <Route path="/profile" element={token ? (suspended ? <Navigate to="/account" /> : <Profile />) : <Navigate to="/" />} />
            <Route path="/leave-management" element={token ? (suspended ? <Navigate to="/ac count" /> : <OwnerLeaveManagement />) : <Navigate to="/" />} />
            <Route path="/applyForLeave" element={token ? (suspended ? <Navigate to="/account" /> : <ApplyForLeave />) : <Navigate to="/" />} />
            <Route path="/ownerManualLeave" element={token ? (suspended ? <Navigate to="/account" /> : <OwnerManualLeave />) : <Navigate to="/" />} />
            <Route path="/Locationtracking" element={token ? (suspended ? <Navigate to="/account" /> : <LocaitonTracking />) : <Navigate to="/" />} />
            {/* <Route path="/Locationtracking" element={token ? (suspended ? <Navigate to="/account" /> : <LocaitonTracking />) : <Navigate to="/" />} /> */}
            <Route path="/attendence-management" element={token ? (suspended ? <Navigate to="/account" /> : <Attendence />) : <Navigate to="/" />} />

            <Route path="/add-employee" element={token ? (suspended ? <Navigate to="/account" /> : <AddEmployee />) : <Navigate to="/" />} />
            <Route path="/history" element={token ? (suspended ? <Navigate to="/account" /> : <History />) : <Navigate to="/" />} />
            {/* <Route path="/pay_stub_managment" element={token ? (suspended ? <Navigate to="/account" /> : <PayStubGenerator />) : <Navigate to="/" />} />
            <Route path="/pay_stub_View" element={token ? (suspended ? <Navigate to="/account" /> : <PayStubs />) : <Navigate to="/" />} />
            <Route path="/punctuality-reports" element={token ? (suspended ? <Navigate to="/account" /> : <PunctualityReports />) : <Navigate to="/" />} /> */}

            {/* <Route path="/effective-settings/break-time" element={<BreakTime />} /> */}
            <Route path="/punctuality" element={<Punctuality />} />
            <Route path="/break-time" element={<BreakTime />} />
            <Route path="/settings" element={<Setting />}>

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

          {/* Other routes */}
          <Route path="/sALogin" element={<SaLogin />} />
          <Route path="/sADashboard" element={<SaMain />} />
          <Route path="/chrome" element={<Chrome />} />
          <Route path="/app_store" element={<Appstore />} />
          <Route path="/play_store" element={<PlayStore />} />
          <Route path="/windows" element={<Windows />} />
          <Route path="/macos" element={<Macos />} />

          <Route path="/:token" element={<Home />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
        {/* </Suspense> */}
      </Router>
    </>
  );
}