import React, { useEffect, useRef, useState } from "react";
import logo from "../images/logo.webp";
import banner from '../images/ss-track-banner.svg';
import start from "../images/button.webp";
import line from '../images/greenline.webp';
// import banners from './images/banner.png';
import logo1 from '../images/adit-logo.png.webp';
import logo2 from '../images/liveglam-logo.png.webp';
import logo3 from '../images/route4me-logo.png.webp';
import logo4 from '../images/wozu-logo.png.webp';
import logo5 from '../images/howsy-logo.png.webp';
import logo6 from '../images/kinetic-logo.png.webp';
import logo7 from '../images/callnovo-logo.png.webp';
import logo8 from '../images/plumbworld-logo.png.webp';
import hand from '../images/hand.webp';
import web from '../images/web.webp';
import insight from '../images/insight.webp';
import arrow from '../images/arrow.webp';
import Header from "./component/header";
import olivia from "../images/olivia.webp";
import pheonix from "../images/pheonix.webp";
import lana from "../images/lana.webp";
import candice from "../images/candice.webp";
import natali from "../images/natali.webp";
import drew from "../images/drew.webp";
import leftArrow from "../images/Leftarrow.webp";
import rightArrow from "../images/Rightarrow.webp";
import dean from "../images/manage.svg";
import reportImage from "../images/reports.webp";
import wifi from "../images/wifi.webp";
import innerSetting from "../images/innersetting.webp";
import userProfile from "../images/userProfile.webp";
import Footer from "./component/footer";
import lines from "../images/line.webp";
import greenBanner from "../images/greenBanner.png";
import employeeMonitor from '../images/Employee-Time-Tracking-1400-removebg-preview.png';
import { BsQuestionLg, BsTelephonePlusFill } from 'react-icons/bs'
import { IoMdMail, IoMdLocate } from 'react-icons/io'
import { FaQuestion } from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md';

import ss1 from '../images/capture-1.png';
import ss2 from '../images/capture-2.png';
import ss3 from '../images/capture-3.png';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DownloadProduct from '../images/download-product.svg'
import { AiFillWindows, AiFillApple } from 'react-icons/ai'
import { BsWindows, BsApple } from 'react-icons/bs'
import { ImArrowUpRight2 } from 'react-icons/im'
import { TbSquareRoundedArrowRightFilled } from 'react-icons/tb'
import detailedTimeline from '../images/connecting-employess-with-manager.png'
import connectingemployees from '../images/connecting-employess-with-manager2.avif'
import simpleAccess from '../images/simple-access.jpg'
import effortlessTimeTrack from '../images/effortless-time-track.jpg'
import screenshot from '../images/screenshot.jpg'
import jwtDecode from "jwt-decode";
import axios from "axios";
import privacyPolicy from '../images/privacy-policy.svg'
import privacyPolicy2 from '../images/privacy-2.jpg'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import { FerrisWheelSpinner } from "react-spinner-overlay";
import card1 from '../images/card1.gif'
import card2 from '../images/card2.gif'
import card3 from '../images/card3.gif'
import screenShot from '../images/screenshot2.jpg'
import screenShot4 from '../images/screenShot4.JPG'
import screenshot5 from '../images/screenshot5.jpg'
import screenShot1 from '../images/screenShot1.jpg'
import screenShot3 from '../images/screenShot3.jpg'
import screenShot6 from '../images/screenShot6.jpg'


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
  const [plans, setPlans] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const [feedbacks, setFeedback] = useState([
    {
      page: 1,
      data: [
        {
          username: "John M.",
          designation: "Expect Best",
          feedback: "“SS Track has revolutionized how we monitor employee productivity. The detailed timelines and app usage reports are incredibly insightful.”",
          img: "https://images.unsplash.com/photo-1636624498155-d87727494812?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          username: "Drew Cano.",
          designation: "Engineering Manager",
          feedback: "“Great tool for tracking remote work. The random screenshots feature helps us ensure employees stay on task.”",
          img: olivia,
        },
        {
          username: "David L.",
          designation: "Product Manager",
          feedback: "“While SS Track offers comprehensive monitoring, it sometimes feels invasive. Transparency with employees is key.”",
          img: pheonix,
        },
        {
          username: "Candice Wu",
          designation: "Backend Developer",
          feedback: "“SS Track has significantly improved our team's productivity. The detailed reports and real-time monitoring features are excellent. It's easy to use and integrates well with our existing systems.”",
          img: lana,
        },
        {
          username: "Sarah K.",
          designation: "Product Designer",
          feedback: "“The user interface is intuitive, and the screen capture feature ensures our employees stay focused on their tasks. We've seen a notable increase in efficiency since implementing SS Track.”",
          img: candice,
        },
        {
          username: "Drew Cano",
          designation: "UX Researcher",
          feedback: "“SS Track's ability to monitor application usage and website visits has been crucial for identifying areas where we can improve productivity. The real-time alerts help us address issues promptly.”",
          img: "https://plus.unsplash.com/premium_photo-1689266188052-704d33673e69?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ]
    },
    {
      page: 2,
      data: [
        {
          username: "Lana Steiner",
          designation: "Product Manager",
          feedback: "“The best way to follow your team overseas is to actually see what they're doing...”",
          img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          username: "Michael T.",
          designation: "Engineering Manager",
          feedback: "“SS Track's employee monitoring capabilities have helped us enhance security and compliance within our organization. The setup was straightforward, and customer support has been responsive and helpful.”",
          img: natali,
        },
        {
          username: "Olivia Rhye",
          designation: "Expect Best",
          feedback: "“sstrack.io allows us to look over completed work by remote staff, shows when my staff is working and keeps a backup of work produced. Highly recommend!”",
          img: drew,
        },
        {
          username: "Phoenix Baker",
          designation: "Product Designer",
          feedback: "“sstrack.io makes it easy for us to manage the staff at different branch offices of Visas Avenue. The different locations of work is not a hurdle anymore. Thank you sstrack.io!”",
          img: "https://images.unsplash.com/photo-1543871595-e11129e271cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          username: "Emily R.",
          designation: "UX Researcher",
          feedback: "“ SS Track's ability to monitor application usage and website visits has been crucial for identifying areas where we can improve productivity. The real-time alerts help us address issues promptly.”",
          img: "https://images.unsplash.com/photo-1664575600850-c4b712e6e2bf?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          username: "Candice Wu",
          designation: "Backend Developer",
          feedback: "“The software's robust reporting and analysis tools provide deep insights into employee activities. It's an indispensable tool for managing remote teams effectively.”",
          img: "https://images.unsplash.com/photo-1664575602554-2087b04935a5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ]
    },
  ])


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const paginatedFeedbacks = feedbacks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



  const apiUrl = process.env.REACT_APP_API_URL;

  const scrollToSection1 = () => {
    section1Ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection2 = () => {
    section2Ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  console.log(location);
  console.log(token);

  async function signin() {
    const decoded = jwtDecode(token);
    localStorage.setItem("items", JSON.stringify(decoded));
    localStorage.setItem("token", token);
    navigate("/dashboard")
  }

  useEffect(() => {
    signin()
  }, [])

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
  const planapiUrl = "https://myuniversallanguages.com:9093/api/v1";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${planapiUrl}/owner/getPlans`);
        const plans = response.data.data;
        setPlans(plans);
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

  const handleUpgradeClick = (defaultPlanIndex) => {
    navigate('/payment', {
      state: {
        plans,
        fetchError,
        loading: false,
        defaultPlanIndex
      }
    });
  };


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
                <h5 className="card-title fw-bold fs-1">Track time, screenshots & productivity</h5>
                <br />
                <p className="card-text fs-4">Employee monitoring software for remote, office and freelance teams.</p>
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
        <p className='ethical' id="section1" ref={section1Ref}>Monitor employee hours and screen captures online.</p>
        <p className='employee'>Discover how much time and money your remote or office team dedicates to each task.</p>

        <div clasName="container" style={{ padding: '20px 20px' }}>
          <div className="row justify-content-center align-items-center">

            <div className="card m-3" style={{ width: '22rem', height: "35rem", backgroundColor: '#0E4772', borderRadius: "1rem" }}>
              <div className="d-flex justify-content-center">
                <img
                  src={ss1}
                  alt=""
                  style={{
                    width: "180px",
                    height: "170px",
                    borderRadius: "100%",
                    objectFit: "cover",
                    border: "10px solid #7ACB59",
                    marginTop: '8%'
                  }}
                />
              </div>
              <br />
              <div className="card-body">
                <h5 className="card-title text-center fw-bold fs-4" style={{ color: '#FFF' }}>Manage employee time logs and screen captures digitally.</h5>
                <br />
                <br />
                <p className="card-text text-center" style={{ color: '#FFF' }}>Employees independently manage the start and stop of their tracking using a streamlined desktop app.</p>
              </div>
            </div>


            {/* ------------------------------ pricing card 2 ------------------------- */}

            <div className="card m-3" style={{ width: '22rem', height: "35rem", backgroundColor: '#0E4772', borderRadius: "1rem" }}>
              <div className="d-flex justify-content-center">
                <img
                  src={ss2}
                  alt=""
                  style={{
                    width: "180px",
                    height: "170px",
                    borderRadius: "100%",
                    objectFit: "cover",
                    border: "10px solid #7ACB59",
                    marginTop: '8%'
                  }}
                />
              </div>
              <br />
              <div className="card-body">

                <h5 className="card-title text-center fw-bold fs-4" style={{ color: '#FFF' }}>Access it online</h5>
                <br />
                <br />
                <p className="card-text text-center" style={{ color: '#FFF', paddingTop: '20%' }}>The tracked time, screenshots and activity are all sent to the web for the employee.</p>

              </div>
            </div>

            {/* ------------------------------ pricing card 3 ------------------------- */}

            <div className="card m-3" style={{ width: '22rem', height: "35rem", backgroundColor: '#0E4772', borderRadius: "1rem" }}>
              <div className="d-flex justify-content-center">
                <img
                  src={ss3}
                  alt=""
                  style={{
                    width: "180px",
                    height: "170px",
                    borderRadius: "100%",
                    objectFit: "cover",
                    border: "10px solid #7ACB59",
                    marginTop: '8%'
                  }}
                />
              </div>
              <br />
              <div className="card-body">

                <h5 className="card-title text-center fw-bold fs-4" style={{ color: '#FFF' }}>Get insights</h5>
                <br />
                <br />
                <p className="card-text text-center" style={{ color: '#FFF', paddingTop: '20%' }}>Get a clear picture of time and money spent on each task, project or client. best option</p>

              </div>
            </div>

          </div>
        </div>

        <br />
        <div style={{
          textAlign: "center"
        }}>
          <button onClick={() => navigate('/signup')} className="btn signUpButton1" type="submit">Sign up Now</button>
        </div>
        {/* <button onClick={() => navigate('/signup')} className="btn signUpButton1 align-items-center text-center" type="submit">Sign up Now</button> */}
        <br />
        <br />
        <section className="thirdSection d-flex" id="section1" ref={section1Ref}>
          <div className="container mt-3">
            <p className="millionHours">
              Over million hours tracked each month <br />
              15M+ screenshots monthly
            </p>

            <div className="row d-flex">
              {feedbacks.map((feed, index) =>
                feed.page === page ? feed.data.map((data, dataIndex) => (
                  <div className="col-md-4 mb-4 d-flex" key={`${index}-${dataIndex}`}>
                    <div className="feedbackBox h-100 d-flex flex-column">
                      <div className="d-flex">
                        <img className="olivia" src={data.img} alt={data.username} />
                      </div>
                      <div className="oliviaDiv flex-grow-1">
                        <p className="oliviafont">{data.username}</p>
                        <p className="oliviaGreen">{data.designation}</p>
                        <p className="oliviaPera">{data.feedback}</p>
                      </div>
                    </div>
                  </div>
                )) : null
              )}
            </div>


            <div className="leftRightArrow">
              <div onClick={() => setPage(page > 1 ? page - 1 : page)} style={{ cursor: "pointer" }}>
                <img src={leftArrow} />
              </div>
              <p>{page}</p>
              <div onClick={() => setPage(page < 2 ? page + 1 : page)} style={{ cursor: "pointer" }}>
                <img src={rightArrow} />
              </div>
            </div>
          </div>
        </section>
        <br />
        <br />
        <div className='container mt-3 align-items-center justify-content-center'>
          <div className="row justify-content-between align-items-center">
            {/* Pricing Card 1 */}
            <div className="col-md-6 mb-3">
              <div className="" style={{ borderRadius: '1rem', height: '100%', marginRight: '50px' }}>
                <img className="card-img-top" src={banner} alt="Banner" style={{ borderRadius: '1rem' }} />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="" style={{ color: '#0E4772', borderRadius: '1rem', height: '100%' }}>
                <div className="card-body">
                  <h5 className="card-title fw-bold fs-1">Employees track time</h5>
                  <br />
                  <p className="card-text fs-4">     A manager invites employees to sstrack.io, where they download a streamlined desktop application, choose a project to work on, and hit the Start button. This initiates tracking, sending data to the web instantly until they press the Stop button.
                  </p>
                </div>
              </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            {/* Image Card */}

          </div>
        </div>


        <br />
        <br />
        <div className='container mt-3 align-items-center justify-content-center'>
          <div className="row justify-content-between align-items-center">
            {/* Pricing Card 1 */}

            <div className="col-md-6 mb-3">
              <div className="" style={{ color: '#0E4772', borderRadius: '1rem', height: '100%' }}>
                <div className="card-body">
                  <h5 className="card-title fw-bold fs-1">Managers view it on the web</h5>
                  <br />
                  <p className="card-text fs-4">Within their sstrack.io dashboards, both the employee and manager have access to insights on the employee's working periods, task duration, screen captures taken at random moments, activity metrics, applications operated, along with the websites visited and their respective browsing times.
                  </p>
                </div>
              </div>
            </div>

            <br />
            <br />
            <br />
            <br />
            {/* Image Card */}
            <div className="col-md-6 mb-3">
              <div className="" style={{ borderRadius: '1rem', height: '100%', marginRight: '50px' }}>
                <img className="card-img-top" src={dean} alt="Banner" style={{ borderRadius: '1rem' }} />
              </div>
            </div>
          </div>
        </div>

        <section className="fourSection">
          <div className="container">
            <p className='ethical'>Get reports you need, at a glance</p>
            <p className='employees'>Generate reports and charts on employees, clients and projects. Download in Excel for further analysis or to create invoices. Share with your clients. Set up automated emails. All in a few clicks.</p>


            <div className="trialDiv">

              <p className="startedFont">Start your 30-day free trial</p>
              <p className="unitedFont">Join over 4,000+ startups already growing with Untitled.</p>
              {/* <div className="startedButtonDiv">
                <button className="learnMoreButton">Learn More</button>
                <button className="startedButton">Get Started</button>
              </div> */}
            </div>
          </div>
        </section>







        {/*------------------ How Works It -------------------- */}


        <div className='how-it-works-container' style={{ marginTop: '4%' }}>
          <div className='container jusitfy-content-center'>
            <p className="how-it-works-title text-center">How It Works ?</p>
            <p className="text-center">Follow These 3 Sample Steps</p>


            <div className="row justify-content-center">
              <div className="col-md-5 col-sm-12 col-lg-6" style={{ borderRight: '2px solid #bfb4b4' }}>
                <div className="card mx-auto" style={{ width: "18rem", width: '100%' }}>
                  <img
                    src={card3}
                    className="card-img-top"
                    alt=""
                    style={{ width: '80px', height: '70px', marginLeft: 'auto', display: 'block' }}
                  />
                  <div className="card-body">
                    <span className="text-end">
                      <p className="card-text fw-bold text-end" style={{ textAlign: 'left', fontSize: "20px", color: "#0E4772" }}>
                        <span style={{ color: "#7ACB59" }}>sstrack.io</span>
                        - Connecting & Setup
                      </p>
                    </span>
                    <p className="text-end" style={{ fontSize: "20px", color: "#0E4772", fontWeight: 500, marginTop: '4%' }}>
                      After selecting a plan, a company manager invites employees to the SS Track team. When employees accept the invitation, they can start tracking time and submitting their screenshots for that company.
                    </p>
                    <img
                      src={screenShot1}
                      className="card-img-bottom flex-end insideCardSS"
                      alt=""
                      style={{
                        width: '300px', height: '150px',
                        float: 'right',  // Add float property to move image to the right
                        marginLeft: '1%', // Adjust margin if needed
                        borderRadius: '5%',
                        border: '5px solid #d3dbd5'
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-5 col-sm-12 col-lg-6 mb-3" >
                <div style={{ width: "18rem", textAlign: 'center' }}>
                  <p className="text-start" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                    1st
                  </p>
                  <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                    Setting Up SSTrack
                  </p>
                </div>
              </div>
            </div>


            <div className="row justify-content-center">
              {/* <div className="col-md-5 col-sm-12 col-lg-4 mb-3">
          <div style={{ width: "18rem", textAlign: 'center' }}>
              <p className="text-end" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                1st
              </p>
              <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                Setting Up SSTrack
              </p>
            </div>
          </div> */}
              <div className="col-md-5 col-sm-12 col-lg-6" style={{ borderRight: '2px solid #bfb4b4' }}>
                <div className=" mx-auto" style={{ width: "18rem", width: '100%', marginRight: '2px solid #bfb4b4' }}>
                  <p className="text-end" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                    2nd
                  </p>
                  <p className="text-end" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-5%' }}>
                    Real-Time Tracking & Monitoring
                  </p>
                </div>
              </div>
              <div className="col-md-5 col-sm-12 col-lg-6 mb-3" style={{ marginLeft: '1px solid #FFF' }}>
                <div className="card mx-auto" style={{ width: "18rem", width: '100%' }}>
                  <img
                    src={card2}
                    className="card-img-top flex-start"
                    alt=""
                    style={{ width: '80px', height: '70px', marginLeft: '7%', display: 'block' }}
                  />
                  <div className="card-body">
                    <span className="text-start">
                      <p className="card-text fw-bold text-start" style={{ textAlign: 'left', fontSize: "20px", color: "#0E4772" }}>
                        Real-Time Tracking & Monitoring -
                        <span style={{ color: "#7ACB59" }}>sstrack.io</span>
                      </p>
                    </span>
                    <p className="text-start" style={{ fontSize: "20px", color: "#0E4772", fontWeight: 500, marginTop: '4%' }}>
                      Employees install the SS Track desktop application, log in, select a project, and press the Start button to begin tracking time and taking screenshots. The application functions offline, and data is uploaded to the web once the internet connection is restored.
                    </p>
                    <img
                      src={screenShot}
                      className="card-img-top flex-start insideCardSS"
                      alt=""
                      style={{ width: '300px', height: '150px', marginLeft: '1%', display: 'block', borderRadius: '5%', border: '5px solid #d3dbd5' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-5 col-sm-12 col-lg-6" style={{ borderRight: '2px solid #bfb4b4' }}>
                <div className="card mx-auto" style={{ width: "18rem", width: '100%' }}>
                  <img
                    src={card3}
                    className="card-img-top"
                    alt=""
                    style={{ width: '80px', height: '70px', marginLeft: 'auto', display: 'block' }}
                  />
                  <div className="card-body">
                    <span className="text-end">
                      <p className="card-text fw-bold text-end" style={{ textAlign: 'left', fontSize: "20px", color: "#0E4772" }}>
                        <span style={{ color: "#7ACB59" }}>sstrack.io</span>
                        - Connecting & Setup
                      </p>
                    </span>
                    <p className="text-end" style={{ fontSize: "20px", color: "#0E4772", fontWeight: 500, marginTop: '4%' }}>
                      The SS Track application tracks employee time and takes screenshots at random intervals until the Stop button is pressed. With the Autostart option, the program starts with computer use and stops if inactive, ideal for in-office tracking. Employees are always aware SS Track is running, as it cannot operate in stealth mode.
                    </p>
                    <img
                      src={screenShot3}
                      className="card-img-bottom flex-end insideCardSS"
                      alt=""
                      style={{
                        width: '300px', height: '150px',
                        float: 'right',  // Add float property to move image to the right
                        marginLeft: '1%', // Adjust margin if needed
                        borderRadius: '5%',
                        border: '5px solid #d3dbd5'
                      }}
                    />

                  </div>
                </div>
              </div>
              <div className="col-md-5 col-sm-12 col-lg-6 mb-3" >
                <div style={{ width: "18rem", textAlign: 'center' }}>
                  <p className="text-start" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                    3rd
                  </p>
                  <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                    Setting Up SSTrack
                  </p>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              {/* <div className="col-md-5 col-sm-12 col-lg-4 mb-3">
          <div style={{ width: "18rem", textAlign: 'center' }}>
              <p className="text-end" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                1st
              </p>
              <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                Setting Up SSTrack
              </p>
            </div>
          </div> */}
              <div className="col-md-5 col-sm-12 col-lg-6" style={{ borderRight: '2px solid #bfb4b4' }}>
                <div className=" mx-auto" style={{ width: "18rem", width: '100%', marginRight: '2px solid #bfb4b4' }}>
                  <p className="text-end" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                    4th
                  </p>
                  <p className="text-end" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-5%' }}>
                    Real-Time Tracking & Monitoring
                  </p>
                </div>
              </div>
              <div className="col-md-5 col-sm-12 col-lg-6 mb-3" style={{ marginLeft: '1px solid #FFF' }}>
                <div className="card mx-auto" style={{ width: "18rem", width: '100%' }}>
                  {/* <img
                  src={card2}
                  className="card-img-top flex-start"
                  alt=""
                  style={{ width: '80px', height: '70px', marginLeft: '7%', display: 'block' }}
                /> */}
                  <div className="card-body">
                    <img
                      src={card1}
                      className="card-img-top flex-start"
                      alt=""
                      style={{ width: '80px', height: '70px', marginLeft: '7%', display: 'block' }}
                    />
                    <br />
                    <span className="text-start">
                      <p className="card-text fw-bold text-start" style={{ textAlign: 'left', fontSize: "20px", color: "#0E4772" }}>
                        Real-Time Tracking & Monitoring -
                        <span style={{ color: "#7ACB59" }}>sstrack.io</span>
                      </p>
                    </span>
                    <p className="text-start" style={{ fontSize: "20px", color: "#0E4772", fontWeight: 500, marginTop: '4%' }}>
                      The SS Track app sends time tracking data and screenshots to the web, allowing real-time monitoring by managers. Managers can view all information online without installation. The dashboard displays work times, current activity, and recent screenshots.
                    </p>
                    <img
                      src={screenShot4}
                      className="card-img-top flex-start insideCardSS"
                      alt=""
                      style={{ width: '300px', height: '150px', marginLeft: '1%', display: 'block', borderRadius: '5%', border: '5px solid #d3dbd5' }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-5 col-sm-12 col-lg-6" style={{ borderRight: '2px solid #bfb4b4' }}>
                <div className="card mx-auto" style={{ width: "18rem", width: '100%' }}>
                  {/* <img
                  src={card1}
                  className="card-img-top"
                  alt=""
                  style={{ width: '80px', height: '70px', marginLeft: 'auto', display: 'block' }}
                /> */}
                  <div className="card-body">
                    <img
                      src={card2}
                      className="card-img-top"
                      alt=""
                      style={{ width: '80px', height: '70px', marginLeft: 'auto', display: 'block' }}
                    />
                    <span className="text-end">
                      <p className="card-text fw-bold text-end" style={{ textAlign: 'left', fontSize: "20px", color: "#0E4772" }}>
                        <span style={{ color: "#7ACB59" }}>sstrack.io</span>
                        - Connecting & Setup
                      </p>
                    </span>
                    <p className="text-end" style={{ fontSize: "20px", color: "#0E4772", fontWeight: 500, marginTop: '4%' }}>
                      SSTrack provides detailed insights into employee productivity, including time and cost tracking for projects and tasks, user activity levels, application usage, website visits, and random screenshots captured up to 30 times per hour. Employees can also manually log offline time for accurate work hour monitoring.
                    </p>
                    <img
                      src={screenshot5}
                      className="card-img-bottom flex-end insideCardSS"
                      alt=""
                      style={{
                        width: '300px', height: '150px',
                        float: 'right',  // Add float property to move image to the right
                        marginLeft: '1%', // Adjust margin if needed
                        borderRadius: '5%',
                        border: '5px solid #d3dbd5'
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-5 col-sm-12 col-lg-6 mb-3" >

                <div style={{ width: "18rem", textAlign: 'center' }}>

                  <p className="text-start" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                    5th
                  </p>
                  <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                    Setting Up SSTrack
                  </p>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              {/* <div className="col-md-5 col-sm-12 col-lg-4 mb-3">
          <div style={{ width: "18rem", textAlign: 'center' }}>
              <p className="text-end" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                1st
              </p>
              <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                Setting Up SSTrack
              </p>
            </div>
          </div> */}
              <div className="col-md-5 col-sm-12 col-lg-6" style={{ borderRight: '2px solid #bfb4b4' }}>
                <div className=" mx-auto" style={{ width: "18rem", width: '100%', marginRight: '2px solid #bfb4b4' }}>

                  <p className="text-end" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                    6th
                  </p>
                  <p className="text-end" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-5%' }}>
                    Real-Time Tracking & Monitoring
                  </p>
                </div>
              </div>
              <div className="col-md-5 col-sm-12 col-lg-6 mb-3" style={{ marginLeft: '1px solid #FFF' }}>
                <div className="card mx-auto" style={{ width: "18rem", width: '100%' }}>
                  <img
                    src={card3}
                    className="card-img-top flex-start"
                    alt=""
                    style={{ width: '80px', height: '70px', marginLeft: '7%', display: 'block' }}
                  />
                  <div className="card-body">

                    <span className="text-start">

                      <p className="card-text fw-bold text-start" style={{ textAlign: 'left', fontSize: "20px", color: "#0E4772" }}>
                        Real-Time Tracking & Monitoring -
                        <span style={{ color: "#7ACB59" }}>sstrack.io</span>
                      </p>
                    </span>
                    <p className="text-start" style={{ fontSize: "20px", color: "#0E4772", fontWeight: 500, marginTop: '4%' }}>
                      SSTrack provides detailed insights into team task management and expenses. Easily select employees, use date ranges, view summaries or detailed time-sheets, and export data to Excel. Employees can access their reports for invoicing with ease.
                    </p>
                    <img
                      src={screenShot6}
                      className="card-img-top flex-start insideCardSS"
                      alt=""
                      style={{ width: '300px', height: '150px', marginLeft: '1%', display: 'block', borderRadius: '5%', border: '5px solid #d3dbd5' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />

        {/* --------------------- pricing section ------------------------------- */}


        <div className='container' id="section3">
          <p className="how-it-works-title text-center">Company Plans & Pricing</p>
          <p className="text-center">These monthly plans are for Companies to track their employees or for freelancers to track their own time.
            If you track your own time for other companies — you do not need a plan and do not have to pay — your company pays for you. Just ask your manager to send you an invitation email to their SSTrack team to start tracking your time and screenshots for them.</p>

          <div className="row justify-content-center align-items-center">

            {/* ------------------------------ pricing card 1 ------------------------- */}

            <div className="card m-3" style={{ width: "18rem", height: "44.5rem", backgroundColor: '#f2f5f5', border: "8px solid grey", borderRadius: "1rem" }}>
              <div className="card-body">
                <h5 className="card-title text-center fw-bold fs-2" style={{ color: "grey" }}>Free Trial</h5>
                <div class="price-container">
                  {/* <span class="old-price align-items-center">$50.00</span> */}
                  <span class="old-price align-items-center" style={{ fontSize: '3rem' }}>
                    <small class="small-dollar"></small>
                  </span>
                </div>
                <div class="price-container new-price">
                  {/* <span class="old-price align-items-center">$50.00</span> */}
                  <span class="free-price align-items-center" style={{ color: "grey", fontSize: '3.5rem', marginTop: "23%" }}>
                    <small class="small-dollar text-center">$</small>0
                  </span>
                </div>
                <p className="text-center text-red">
                  Limited Time Offer
                </p>
                <p className="card-text text-center" style={{ marginTop: "37%" }}>
                  Time Tracking
                  SSTrack
                  up to <b>3</b> screenshots per hour
                  screenshots stored for <b>15 days</b>
                </p>
                <p className="activtiyUrl text-center" style={{ marginTop: '18%' }} >Individual settings
                </p>
                <p className="activtiyUrl text-center" > Activity Level Tracking</p>
                <p className="activtiyUrl text-center" >
                  App & URL Tracking
                </p>
                <br />
                <div className="mt-auto">
                  <button type="button" className="pricingButton2" style={{ width: '150px', alignItems: 'center', color: 'grey', backgroundColor: "#e4eced", marginTop: '20px' }}

                    onClick={() => handleUpgradeClick(1)}>Current Plan</button>
                </div>

                {/* <button type="button" className="pricingButton2" style={{ width: '150px', alignItems: 'center', color: 'grey', backgroundColor: "#e4eced", marginTop: '20px' }}>
                  Current Plan
                </button> */}
                <br />
              </div>
            </div>


            {/* ------------------------------ pricing card 2 ------------------------- */}

            <div className="card m-3" style={{ width: "18rem", height: '44.5rem', border: "8px solid  #7ACB59", backgroundColor: "#f2faf6", borderRadius: "1rem" }}>
              <div className="card-body px-3">
                <h5 className="card-title text-center fw-bold fs-2" style={{ color: " #7ACB59" }}>Standard</h5>
                <div class="price-container new-price">
                  {/* <span class="old-price align-items-center">$50.00</span> */}
                  <span class="old-price align-items-center" style={{ color: "grey", fontSize: '3.5rem' }}>
                    <small class="small-dollar">$</small>6
                  </span>
                </div>
                <p className="text-center"> per user per month</p>
                <div class="price-container new-price">
                  {/* <span class="new-price">$35.00</span> */}
                  <span style={{ fontSize: "3rem" }}>
                    <small class="small-dollar">$</small>3<sup class="small-number">99</sup>
                  </span>
                </div>
                <p className="text-center text-red">
                  per user per month
                  if you start now!
                </p>
                <p className="card-text text-center">
                  Time Tracking
                  SSTrack
                  up to <b>10</b> screenshots per hour
                  screenshots stored for <b>2 <br /> months</b>
                </p>
                <p className="activtiyUrl text-center">    Individual settings
                </p>
                <p className="text-center"> Activity Level Tracking</p>
                <p className="activtiyUrl text-center">
                  App & URL Tracking
                </p>
                <p className="activtiyUrl text-center">
                </p>
                <br />

                <div className="mt-auto">
                  <button type="button" className="pricingButton" style={{ color: 'white', width: '150px', backgroundColor: "#7ACB59", marginTop: '20px' }}

                    onClick={() => handleUpgradeClick(1)}>Upgrade</button>
                </div>

                <p className="text-center fw-bold" style={{ fontSize: "15px", color: '#7a8f91' }}>Switch to Free Plan any time</p>

              </div>
            </div>

            {/* ------------------------------ pricing card 3 ------------------------- */}

            <div className="card m-3" style={{ width: "18rem", height: '44.5rem', border: "8px solid  #0E4772", backgroundColor: "#f2faf6", borderRadius: "1rem" }}>

              <div className="card-body px-3">
                <h5 className="card-title text-center fw-bold fs-2" style={{ color: " #0E4772" }}>Premium</h5>
                <div class="price-container new-price">
                  {/* <span class="old-price align-items-center">$50.00</span> */}
                  <span class="old-price align-items-center" style={{ color: "grey", fontSize: '3.5rem' }}>
                    <small class="small-dollar">$</small>10
                  </span>
                </div>
                <p className="text-center"> per user per month</p>
                <div class="price-container new-price">
                  {/* <span class="new-price">$35.00</span> */}
                  <span style={{ fontSize: "3rem" }}>
                    <small class="small-dollar">$</small>4<sup class="small-number">99</sup>
                  </span>
                </div>
                <p className="text-center text-red">
                  per user per month
                  if you start now!
                </p>
                <p className="card-text text-center">
                  Time Tracking
                  SSTrack
                  up to <b>30</b> screenshots per hour
                  screenshots stored for <b>1 <br /> year</b>
                </p>
                <p className="activtiyUrl text-center">    Individual settings
                </p>
                <p className="text-center"> Activity Level Tracking</p>
                <p className="activtiyUrl text-center">
                  App & URL Tracking
                </p>
                <p className="activtiyUrl text-center">
                  Mobile Application
                </p>
                <p className="activtiyUrl text-center">
                </p>
                <div className="mt-auto">
                  <button type="button" className="pricingButton1" style={{ color: 'white', width: '150px', backgroundColor: "#0E4772", marginTop: '20px' }} onClick={() => handleUpgradeClick(2)}>Upgrade</button>
                </div>
                <p className="text-center fw-bold" style={{ fontSize: "15px", color: '#7a8f91' }}>Switch to Free Plan any time</p>
              </div>
            </div>

          </div>
        </div>
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
                <img width="100%" style={{ padding: '0px' }} src={employeeMonitor} alt="" />
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
          {/* <div>
          <img src={lines} className="homeLine" />
        </div> */}
          {/* <Footer /> */}
        </section>

      </div >
    </>

  )

}

export default Home;