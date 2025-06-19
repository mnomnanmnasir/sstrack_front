import React, { useEffect, useRef, useState } from "react";
import banner from '../images/ss-track-banner.svg';
import { BsTelephonePlusFill } from 'react-icons/bs'
import { IoMdMail } from 'react-icons/io'
import { MdLocationOn } from 'react-icons/md';
import PricingCards from './containers/pricingCards'
import { useLocation, useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import { FerrisWheelSpinner } from "react-spinner-overlay";


function Home() {

  const { token } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [downloadOS, setDownloadOS] = useState("mac")
  const [accessToken, setAccessToken] = useState('');
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fullName, setfullName] = useState('')
  const [email, setemail] = useState('')
  const [phoneNumber, setphoneNumber] = useState('')
  const [companyName, setcompanyName] = useState('')
  const [message, setmessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // or 'error'
  const [text, setText] = useState("");
  // const [plans, setPlans] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const token = localStorage.getItem('token');
  const [fetchError, setFetchError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState();

  const handleChange = (event) => {
    setText(event.target.value);
  };





  // const totalPages = Math.ceil(feedbacks.length / itemsPerPage);



  const plans = [
    { id: 1, name: 'Free' },
    { id: 2, name: 'Standard' },
    { id: 3, name: 'Premium' }
  ];


  // const storedPlanId = JSON.parse(localStorage.getItem('planId'));
  // Retrieve the stored plan from localStorage and set the selected package
  useEffect(() => {
    const storedPlanId = JSON.parse(localStorage.getItem('planIdforHome'));
    console.log('=====>>>>>>>', selectedPackage)
    // Check the stored plan type to set the selected package
    if (!storedPlanId?.planType || storedPlanId?.planType === 'free') {
      setSelectedPackage(1); // Free plan
    } else if (storedPlanId?.planType === 'standard') {
      setSelectedPackage(2); // Standard plan
    } else if (storedPlanId?.planType === 'premium') {
      setSelectedPackage(3); // Premium plan
    }
  }, []); // Empty dependency array to run only once on component mount


  const getButtonDisabled = (planId) => {

    // If token is not available, return false
    if (!token) {
      return false;
    }
    // If token is available, show relevant disabled state based on the selected plan
    if (planId === selectedPackage) {
      return 'Current'; // The user is already on this plan
    } else {
      return false;
    }
  };

  const isButtonDisabled = (planId) => {
    const buttonText = getButtonText(planId);
    // return getButtonText(planId) === 'Downgrade'; // Disable if "Downgrade" text is shown
    return buttonText === 'Downgrade' || buttonText === 'Current'; // Disable if "Downgrade" or "Current" text is shown
  };

  const handleUpgradeClicks = (selectedPlan) => {
    // Navigate to the payment page, passing along the relevant data
    navigate('/account', {
      state: {
        defaultPlanIndex: selectedPlan
      }
    });
  };

  // Function to return the appropriate button text
  const getButtonText = (planId) => {
    // Check if token is available
    if (!token) {
      // If token is not available, show the plan names (Free, Standard, Premium)
      if (planId === 1) return 'Free';
      if (planId === 2) return 'Standard';
      if (planId === 3) return 'Premium';
    }

    // If token is available, show relevant text based on the selected plan
    if (planId === selectedPackage) {
      return 'Current'; // The user is already on this plan
    } else if (planId > selectedPackage) {
      return 'Upgrade'; // The plan is higher than the current one
    } else {
      return 'Downgrade'; // The plan is lower than the current one
    }
  };

  const apiUrl = process.env.REACT_APP_API_URL;

  const scrollToSection1 = () => {
    section1Ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection2 = () => {
    section2Ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  console.log("localtion", location);
  console.log("localtion ka path name", location.pathname);

  console.log("Token agya",token);


  const signin = () => {
    if (token && token.startsWith("auth=")) {
      try {
        const extractedToken = token.substring(5); // Extract text after "auth="
        console.log('Valid token detected, proceeding to authentication');

        localStorage.removeItem('token');
        localStorage.setItem('token', extractedToken); // Store the new token

        navigate("/dashboard");
        window.location.reload(); // Reload the page to apply changes
        console.log("Dashboard", extractedToken);
      } catch (error) {
        console.error("Token processing failed:", error);
        navigate("/dashboard");
        window.location.reload();
      }
    } else {
      // If no valid token, redirect to sign-in
      console.log('Invalid or missing token, redirecting to sign-in');
      navigate("/dashboard");
      window.location.reload();
    }
  };






  useEffect(() => {
    if (token) {
      signin();
    }
  }, [token]); // Run the effect whenever the token changes

  console.log(page);

  //  contactus api
  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/;

    if (
      fullName === '' ||
      message === '' ||
      email === '' ||
      phoneNumber === "" ||
      companyName === ""
    ) {
      enqueueSnackbar("All Fields are required", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right"
        }
      })
      return null
    } else if (!emailRegex.test(email)) {
      // Check if email format is incorrect
      enqueueSnackbar('Please enter a valid email address', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      return;
    } else if (!phoneRegex.test(phoneNumber)) {
      // Check if phone number format is incorrect
      enqueueSnackbar('Please enter a valid phone number', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      return;
    }


    else {
      setLoading(true)
      try {
        const response = await axios.post(`${apiUrl}/event/contactForm`, {
          fullName,
          email,
          companyName,
          phoneNumber,
          message
        })
        console.log('data******', response.data);
        console.log('message******', response.data.message);
        if (response.status === 200) {
          setLoading(false)
          enqueueSnackbar(response.data.message, {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right"
            }
          })
          setfullName("")
          setcompanyName("")
          setemail("")
          setphoneNumber("")
          setmessage("")
        }
      }
      catch {
        setLoading(false)
        alert('something went wrong')
      }
    }

  }


  //this api is for pricing plan who's data is to send to payment page
  const planapiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${planapiUrl}/owner/getPlans`);
        const plans = response.data.data;
        // setPlans(plans);
        // Store plans in localStorage
        localStorage.setItem('plans', JSON.stringify(plans));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setFetchError('Error fetching plans');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // const handleUpgradeClick = (defaultPlanIndex) => {
  //   navigate('/payment', {
  //     state: {
  //       plans,
  //       fetchError,
  //       loading: false,
  //       defaultPlanIndex
  //     }
  //   });
  // };


  return (
    <>
      <SnackbarProvider />
      <br />
      <br />
      <div className='container mt-3 align-items-center justify-content-center'>
        <div className="row justify-content-between align-items-center">
          {/* Pricing Card 1 */}
          <div className="col-md-6 mb-3">
            <div className="text-white" style={{ backgroundColor: '#0E4772', borderRadius: '1rem', height: '100%' }}>
              <div className="card-body">
                <h5 className="card-title fw-bold fs-1">End-to-End Employee Presence Tracking System.</h5>
                <br />
                <p className="card-text fs-4">From work from home to office, onsite, in the field, or any specific job site, SSTrack.io offers precision tracking, seamless management, and smarter team solutions. Track across Windows, Mac, Android, iOS, and Chrome platforms with unmatched efficiency.</p>
                <button className="downloadButton" onClick={() => navigate("/download")} > Download</button>
              </div>
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          {/* Image Card */}
          <div className="col-md-6 mb-3">
            <div className="" style={{ backgroundColor: '#0E4772', borderRadius: '1rem', height: '100%' }}>
              <img className="card-img-top" src={banner} alt="Banner" style={{ borderRadius: '1rem' }} />
            </div>
          </div>
        </div>
      </div >
      <br />
      <br />
      <br />
      <br />
      <div className="homeSection">
        <br />
        <br />
        {/* Call the MonitorSection.js file */}
        {/* <Monitor /> */}
        <br />
        <div style={{
          textAlign: "center"
        }}>
          <button onClick={() => navigate('/signup')} className="btn signUpButton1" type="submit">Sign up Now</button>
        </div>
        {/* <button onClick={() => navigate('/signup')} className="btn signUpButton1 align-items-center text-center" type="submit">Sign up Now</button> */}
        <br />
        <br />
        {/* Call the MonitorScreenshot.js file */}


        <section className="fourSection">
          <div className="container">
            <p className='ethical'>Get reports you need, at a glance</p>
            <p className='employees'>Generate reports and charts on employees, clients and projects. Download in Excel for further analysis or to create invoices. Share with your clients. Set up automated emails. All in a few clicks.</p>


            <div className="trialDiv">

              <p className="startedFont">Start your 14-day free trial</p>
              <p className="unitedFont">Join over 4,000+ startups already growing with Untitled.</p>
              {/* <div className="startedButtonDiv">
                <button className="learnMoreButton">Learn More</button>
                <button className="startedButton">Get Started</button>
              </div> */}
            </div>
          </div>
        </section>

        {/*------------------ How Works It -------------------- */}
        {/* <HowItWork /> */}
        <br />
        <br />

        {/* --------------------- pricing section ------------------------------- */}


        <PricingCards />
        <br />
        <br />

        {/* ------------------- END PRICING SECTION ------------------------- */}

        {/* ------------------- CONTACT FORM SECTION -------------- */}

        <div className="container justify-content-center align-items-center" id="section2">
          <div className='row hayat'>
            <div className="card d-flex pt-3" style={{ padding: '20px' }}>
              <div className="firstFormPart">
                <h3 className="contactUs">Contact us</h3>
                <p className="query">For any questions or feedback please feel free to contact us using
                  the form below, or email us at <span>
                    <a href="mailto:info@sstrack.io" style={{ color: "#7ACB59", margin: "17px 20px 0px 0px", fontWeight: '600', textDecoration: "none", fontSize: "18px" }}>info@sstrack.io</a></span></p>
              </div>
              <div className="fullForm">
                <div>
                  <p className="firstNameHead">Full Name</p>
                  <p><input value={fullName} type="text" className="firstName" placeholder="Enter Your Full Name" onChange={(t) => setfullName(t.target.value)} /></p>
                </div>
                <div>
                  <p className="firstNameHead">Email Address</p>
                  <p><input value={email} type="text" className="firstName" placeholder="Enter Your Email Address" onChange={(t) => setemail(t.target.value)} /></p>
                </div>
                <div>
                  <p className="firstNameHead">Phone Number</p>
                  <p><input value={phoneNumber} type="email" className="firstName" placeholder="Enter Your Phone Number" onChange={(t) => setphoneNumber(t.target.value)} /></p>
                </div>
                <div>
                  <p className="firstNameHead">Company Name</p>
                  <p><input value={companyName} type="text" className="firstName" placeholder="Enter Your Company Name" onChange={(t) => setcompanyName(t.target.value)} /></p>
                </div>
                <div>
                  <p className="firstNameHead">Message</p>
                  {/* <textarea
                  id="exampleTextarea"
                  className="form-control"
                  rows="5"
                  col='50'
                  value={text}
                  onChange={handleChange}
                  placeholder="Type your text here..."
                /> */}
                  <p><textarea value={message} style={{
                    width: "205%",
                    backgroundColor: "whitesmoke",
                    padding: "15px",
                    border: "#EAFAF3",
                    borderRadius: "10px",
                    outline: "none",
                    resize: "none", // Prevent resizing
                    overflow: 'hidden'
                  }} rows="4" cols="10" type="text" placeholder="Enter Your Message" onChange={(t) => setmessage(t.target.value)} /></p>
                </div>
              </div>
              <div>
                <button
                  onClick={handleSubmit}
                  disabled={loading} type="submit" className={loading ? "disabledAccountButton" : "accountButton1"}>{loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Send"}</button>
                {/* <button className="btn formButton btn-success" onClick={handleSubmit}>Send</button> */}
              </div>
            </div>

            <div className="card d-flex" style={{ backgroundColor: '#0E4772' }}>
              <div className="card-body">
                {/* <div className="firstFormPart"> */}
                <h3 className="contactUs text-white fs-2 py-2">For Help & support</h3>
                {/* </div> */}

                <div style={{ display: "flex", alignItems: 'center' }}>
                  <div style={{
                    backgroundColor: "white",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "100%",
                    margin: "10px 20px 0 0"
                  }}>
                    <br />
                    <IoMdMail color="#09A144" size={20} />
                  </div>
                  <p style={{ margin: "10px 20px 0px 0px", fontWeight: '600', fontSize: "18px" }}>
                    <a href="mailto:info@sstrack.io" className="text-white" style={{ margin: "10px 20px 0px 0px", fontWeight: '600', textDecoration: "none", fontSize: "18px" }}>info@sstrack.io</a>
                  </p>
                  <br />
                </div>
                <br />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    backgroundColor: "white",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "100%",
                    margin: "10px 20px 0 0"
                  }}>
                    <BsTelephonePlusFill color="#09A144" size={20} />
                  </div>
                  <p className="text-white" style={{ margin: "10px 20px 0px 0px", fontWeight: '600', fontSize: "18px" }}>+1 647-930-0988
                  </p>
                </div>
                <br />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    backgroundColor: "white",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "100%",
                    margin: "10px 20px 0 0"
                  }}>
                    <MdLocationOn color="#09A144" size={20} />
                  </div>
                  <div>
                    <p className="text-white" style={{ margin: "10px 20px 0px 0px", fontWeight: '600', fontSize: "18px" }}>
                      4370 Steels Ave W #204 Woodbridge, <br /> ON L4L 4Y4, Canada.
                    </p>
                  </div>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                {/* <img width="100%" style={{ padding: '0px' }} src={employeeMonitor} alt="" /> */}
              </div>
            </div>
          </div>




        </div>
        <section className="eightSection" style={{ marginTop: '4%' }}>
          <div className="container">
            {/* <p className="employeeTracking">Start employee time tracking!</p> */}
            <button className="startnowButton" onClick={() => navigate("/download")}>Start employee time tracking!</button>
            <p className="creditCancel text-grey">No obligation, no credit card required.</p>
          </div>
        </section>

      </div >





    </>

  )

}

export default Home;