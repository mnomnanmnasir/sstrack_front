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
import { IoMdMail } from 'react-icons/io'
import { FaQuestion } from 'react-icons/fa'
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


const SOCKET_SERVER_URL = 'https://myuniversallanguages.com:9093';
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
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);

    // Socket.io event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Save socket instance in state
    setSocket(newSocket);

    // Cleanup function
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessageToServer = () => {
    if (socket) {
      socket.emit('sendMessage', 'Hello, server!'); // Example: Emit a message to the server
    }
  };


  const [feedback, setFeedback] = useState([

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
          username: "Drew Cano",
          designation: "Engineering Manager",
          feedback: "“Great tool for tracking remote work. The random screenshots feature helps us ensure employees stay on task.”",
          img: olivia,
        },
        {
          username: "David L",
          designation: "Product Manager",
          feedback: "“While SS Track offers comprehensive monitoring, it sometimes feels invasive. Transparency with employees is key.”",
          img: pheonix,
        },
        {
          username: "Alex P",
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
          username: "Marie M",
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




  return (

    <div className="homeSection">
      <SnackbarProvider />
      <div>

        <section className='firstSection'>
          {/* <Header scrollToSection1={scrollToSection1} scrollToSection2={scrollToSection2} /> */}

          <div className='secondPart container'>
            <div>
              <p className='trackFont'>Track time, screenshots & productivity</p>
              <p className='trackPera'>Employee monitoring software for remote, office and freelance teams</p>
              <button className="downloadButton" onClick={() => navigate("/download")}>Download</button>

            </div>
            <div className="bannerDiv d-flex">
              <img className="banner" src={banner} />
            </div>
          </div>
        </section>

        <section className='secondSection' id="section1" ref={section1Ref}>
          <div className="container">

            <div>
              <p className='ethical' id="section1" ref={section1Ref}>Monitor employee hours and screen captures online.</p>
              <p className='employee'>Discover how much time and money your remote or office team dedicates to each task.</p>
            </div>
            <div className='cardSection'>
              <div className='box'>
                <img src={ss1} alt="" style={{ width: "200px", height: "200px", borderRadius: "100%", objectFit: "cover", border: "10px solid #7ACB59" }} />
                <p className='trackEffort'>Manage employee time logs and screen captures digitally.</p>
                <p className='trackEffortPera'>Employees independently manage the start and stop of their tracking using a streamlined desktop app.</p>
                {/* <img className='arrow' src={arrow} /> */}
              </div>
              <div className='box'>
                <img src={ss2} alt="" style={{ width: "200px", height: "200px", borderRadius: "100%", objectFit: "cover", border: "10px solid #7ACB59" }} />
                <p className='trackEffort'>Access it online</p>
                <p className='trackEffortPera'>The tracked time, screenshots and activity are all sent to the web for the employee. </p>
                {/* <img className='arrow' src={arrow} /> */}
              </div>
              <div className='box'>
                <img src={ss3} alt="" style={{ width: "200px", height: "200px", borderRadius: "100%", objectFit: "cover", border: "10px solid #7ACB59" }} />
                <p className='trackEffort'>Get insights</p>
                <p className='trackEffortPera'>Get a clear picture of time and money spent on each task, project or client. best option.</p>
                {/* <img className='arrow' src={arrow} /> */}
              </div>
            </div>
            <div style={{
              textAlign: "center"
            }}>
              <button onClick={() => navigate('/signup')} className="btn signUpButton" type="submit">Sign up Now!</button>
            </div>
          </div>
        </section>

      </div>

      <section className="thirdSection" >
        <div className="container">
          <p className="millionHours">
            Over million hours tracked each month <br />
            15M+ screenshots monthly
          </p>
          {/* <button className="joinButton">Join them now</button> */}

          <div className="feedbackDiv">

            {feedback?.map((feed, index) => feed.page === page ? feed.data.map((data) => {
              return (
                <div className="feedbackBox">
                  <div>
                    <img className="olivia" src={data.img} />
                  </div>
                  <div className="oliviaDiv">
                    <p className="oliviafont">{data.username}</p>
                    <p className="oliviaGreen">{data.designation}</p>
                    <p className="oliviaPera">{data.feedback}</p>
                  </div>
                </div>
              )
            }) : null)}

            {/* <div className="feedbackBox" style={{ marginLeft: "20px", marginRight: "20px" }}>
              <div>
                <img className="olivia" src={pheonix} />
              </div>
              <div className="oliviaDiv">
                <p className="oliviafont">Phoenix Baker</p>
                <p className="oliviaGreen">Engineering Manager</p>
                <p className="oliviaPera">“sstrack.io makes it easy for us to manage the staff at different branch offices of Visas Avenue. The different locations of work is not a hurdle anymore. Thank you sstrack.io!”</p>
              </div>
            </div>

            <div className="feedbackBox">
              <div>
                <img className="olivia" src={lana} />
              </div>
              <div className="oliviaDiv">
                <p className="oliviafont">Lana Steiner</p>
                <p className="oliviaGreen">Product Manager</p>
                <p className="oliviaPera">“The best way to follow your team overseas is to actually see what they're doing...”</p>
              </div>
            </div>

            <div className="feedbackBox">
              <div>
                <img className="olivia" src={candice} />
              </div>
              <div className="oliviaDiv">
                <p className="oliviafont">Candice Wu</p>
                <p className="oliviaGreen">Backend Developer</p>
                <p className="oliviaPera">“sstrack.io is the most efficient way to track hours, manage projects, and most importantly your people! With one scroll through the home page, you'll know what everyone is working on.”</p>
              </div>
            </div>

            <div className="feedbackBox" style={{ marginLeft: "20px", marginRight: "20px" }}>
              <div>
                <img className="olivia" src={natali} />
              </div>
              <div className="oliviaDiv">
                <p className="oliviafont">Natali Craig</p>
                <p className="oliviaGreen">Product Designer</p>
                <p className="oliviaPera">“I've been using sstrack.io for several years and it has been a great tool. As my company grows, it’s easy to add people and get reports sent to me every week.”</p>
              </div>
            </div>

            <div className="feedbackBox">
              <div>
                <img className="olivia" src={drew} />
              </div>
              <div className="oliviaDiv">
                <p className="oliviafont">Drew Cano</p>
                <p className="oliviaGreen">UX Researcher</p>
                <p className="oliviaPera">“sstrack.io is price competitive and the most reliable tool on the market. It tracks screens, prevents cheating, and doesn’t provide unnecessary features.”</p>
              </div>
            </div> */}

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

          {/* <div className="trialDiv">
            <div className="freeTrialDiv">
              <div>
                <p className="startedFont">Start your 30-day free trial</p>
                <p className="unitedFont">Become part of the 4,000+ startups thriving with Untitled.</p>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      <section className="deanDiv container">
        <div>
          <img className="deanBanner" src={banner} />
        </div>
        <div>
          <p className="employetime">Employees track time</p>
          <p className="managerFont">
            A manager invites employees to sstrack.io, where they download a streamlined desktop application, choose a project to work on, and hit the Start button. This initiates tracking, sending data to the web instantly until they press the Stop button.
          </p>
        </div>
      </section>
      <section className="deanDiv container">
        <div>
          <p className="employetime">Managers view it on the web</p>
          <p className="managerFont">Within their sstrack.io dashboards, both the employee and manager have access to insights on the employee's working periods, task duration, screen captures taken at random moments, activity metrics, applications operated, along with the websites visited and their respective browsing times.</p>
          {/* <button className="startedButton">Explore</button> */}
        </div>
        <div>
          <img className="deanBanner" src={dean} />
        </div>
      </section>
      <section className="fourSection">
        <div className="container">
          <div className="employeesDiv">
            <p className='ethical'>Get reports you need, at a glance</p>
            <p className='employees'>Generate reports and charts on employees, clients and projects. Download in Excel for further analysis or to create invoices. Share with your clients. Set up automated emails. All in a few clicks.</p>
          </div>

          <div className="trialDiv">
            <div className="freeTrialDiv">
              <div>
                <p className="startedFont">Start your 30-day free trial</p>
                <p className="unitedFont">Join over 4,000+ startups already growing with Untitled.</p>
              </div>
              {/* <div className="startedButtonDiv">
                <button className="learnMoreButton">Learn More</button>
                <button className="startedButton">Get Started</button>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <section className="fiveSection" style={{ backgroundColor: "whitesmoke" }}>
        <div>
          <img className="wifi" src={wifi} />
          <p className="internetFont">Track without Internet</p>
          <p className="internetPera">The app will continue time tracking and screenshot capture even without an Internet connection and will sync when the connection is restored.</p>
        </div>
        <div>
          <img className="wifi" src={userProfile} />
          <p className="internetFont">As simple as it gets</p>
          <p className="internetPera">Our uncluttered, polished and fast interface will make it more satisfying to use than anything else on the market.</p>
        </div>
        <div>
          <img className="wifi" src={innerSetting} />
          <p className="internetFont">Integrate using Web API</p>
          <p className="internetPera">Connect your existing software to sstrack.io via API to retrieve tracked time and notes.</p>
        </div>
      </section>






      {/*------------------ How Works It -------------------- */}


      <div className="container" style={{ margin: '5%' }}>
        <p className="how-it-works-title text-center">How It Works ?</p>
        <p className="text-center">Follow These 3 Sample Steps</p>

        <div className="row justify-content-center" style={{ marginLeft: "5px" }}>
          <div className="col-md-5 col-sm-12 col-lg-4 mb-3">
            <div className="card mx-auto" style={{ width: "18rem", width: '100%' }}>
              <img
                src={card1}
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
                  Invite your team members after signing up as a company owner or admin. Employees just need to install the sstrack.io app and log in to start tracking time and capturing screenshots.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-12 d-flex justify-content-center position-relative">
            <div style={{ width: "18rem", textAlign: 'center' }}>
              <p className="text-start" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                1st
              </p>
              <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                Setting Up SSTrack
              </p>
            </div>
            {/* <div className="vertical-line"></div>
            <div className="circle" style={{ top: '5%' }}></div>
            <div className="circle" style={{ top: '40%' }}></div>
            <div className="circle" style={{ top: '80%' }}></div> */}
          </div>
        </div>

        <div className="row justify-content-center" style={{ marginLeft: "55px" }}>
          <div className="col-md-4 col-sm-12 d-flex justify-content-center position-relative">
            <div style={{ width: "18rem", textAlign: 'center' }}>
              <p className="text-end" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                2nd
              </p>
              <p className="text-end" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                Real-Time Tracking & Monitoring
              </p>
            </div>
            {/* <div className="vertical-line"></div>
            <div className="circle" style={{ top: '5%' }}></div>
            <div className="circle" style={{ top: '40%' }}></div>
            <div className="circle" style={{ top: '80%' }}></div> */}
          </div>
          <div className="col-md-5 col-sm-12 col-lg-4 mb-3">
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
                  Employees click "Start" to track time and take random screenshots, automatically sent to sstrack.io. Admins can access all real-time data and latest screenshots directly on the website without additional installations.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center" style={{ marginLeft: "5px" }}>
          <div className="col-md-5 col-sm-12 col-lg-4 mb-3">
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
                    Comprehensive Dashboard -
                    <span style={{ color: "#7ACB59" }}>sstrack.io</span>
                  </p>
                </span>
                <p className="text-start" style={{ fontSize: "20px", color: "#0E4772", fontWeight: 500, marginTop: '4%' }}>
                  View detailed timelines showing time and money spent on tasks, app usage, visited websites, and up to 30 random screenshots per hour, giving a complete picture of the employee's activity.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-12 d-flex justify-content-center position-relative">
            <div style={{ width: "18rem", textAlign: 'center' }}>
              <p className="text-start" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                3rd
              </p>
              <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                Get Detailed Dashboard
              </p>
            </div>
            {/* <div className="vertical-line"></div>
            <div className="circle" style={{ top: '5%' }}></div>
            <div className="circle" style={{ top: '40%' }}></div>
            <div className="circle" style={{ top: '80%' }}></div> */}
          </div>
        </div>
        <div className="vertical-line"></div>
        <div className="circle" style={{ top: '20%' }}></div>
        <div className="circle" style={{ top: '50%' }}></div>
        <div className="circle" style={{ top: '70%' }}></div>

      </div>



      {/* --------------------- pricing section-------------------- */}

      {/* ------------------------------ pricing card 1 ------------------------- */}
      <div className='how-it-works-container'>
        <div id="section3" style={{
          padding: "40px",
        }}>



          <div className='container jusitfy-content-center'>

            <p className="how-it-works-title text-center">Company Plans & Pricing</p>
            <p className="text-center">These monthly plans are for Companies to track their employees or for freelancers to track their own time.
              If you track your own time for other companies — you do not need a plan and do not have to pay — your company pays for you. Just ask your manager to send you an invitation email to their SSTrack team to start tracking your time and screenshots for them.</p>

            <div className="container">
              <div className="container justify-content-center align-items-center">
                <div className="row align-items-center justify-content-center" style={{
                  marginLeft: '15px', marginTop: '40px'
                }}>

                  <div className="row justify-content-center align-items-center" style={{ marginLeft: "20px" }}>
                    <div className="col-md-5 col-sm-12 col-lg-4 mb-3">
                      <div class="card" style={{ width: "18rem", height: "44.5rem", backgroundColor: '#f2f5f5', border: "8px solid grey", borderRadius: "1rem" }}>
                        {/* <img src="..." class="card-img-top" alt="..."> */}
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
                          <p className="card-text text-center" style={{ marginTop: "40%" }}>
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

                          <button type="button" className="pricingButton" style={{ width: '150px', alignItems: 'center', color: 'grey', backgroundColor: "#e4eced", marginTop: '20px' }}>
                            Current Plan
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-5 col-sm-12 col-lg-4 mb-3">
                      <div class="card" style={{ width: "18rem", height: '44.5rem', border: "8px solid  #7ACB59", backgroundColor: "#f2faf6", borderRadius: "1rem" }}>
                        {/* <img src="..." class="card-img-top" alt="..."> */}
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
                            screenshots stored for <b>2 months</b>
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
                            <button type="button" className="pricingButton" style={{ color: 'white', width: '150px', backgroundColor: "#7ACB59", marginTop: '20px' }}>Upgrade</button>
                          </div>

                          <p className="text-center fw-bold" style={{ fontSize: "15px", color: '#7a8f91' }}>Switch to Free Plan any time</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5 col-sm-12 col-lg-4 mb-3">
                      <div class="card" style={{ width: "18rem", height: '44.5rem', border: "8px solid  #0E4772", backgroundColor: "#f2faf6", borderRadius: "1rem" }}>
                        {/* <img src="..." class="card-img-top" alt="..."> */}
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
                            <button type="button" className="pricingButton" style={{ color: 'white', width: '150px', backgroundColor: "#0E4772", marginTop: '20px' }}>Upgrade</button>
                          </div>

                          <p className="text-center fw-bold" style={{ fontSize: "15px", color: '#7a8f91' }}>Switch to Free Plan any time</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ----------- PRICING CARD 2 -------------------- */}


                  {/* hello nim  */}
                  {/* ----------- PRICING CARD 3 -------------------- */}

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* contact form */}
      <section ref={section1Ref} id="section1" className="contact-us-container">
        <div className="lightGreen">
          <div className="formFullDiv">
            <div className="firstFormPart">
              <h3 className="contactUs">Contact us</h3>
              <p className="query">For any questions or feedback please feel free to contact us using
                the form below, or email us at <span style={{ color: "#7ACB59" }}>info@sstrack.io</span></p>
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
                <p><textarea value={message} style={{
                  width: "225%",
                  backgroundColor: "whitesmoke",
                  padding: "15px",
                  border: "#EAFAF3",
                  borderRadius: "10px",
                  outline: "none",
                  resize: "none", // Prevent resizing
                  overflow: 'hidden'
                }} rows="4" cols="80" type="text" placeholder="Enter Your Message" onChange={(t) => setmessage(t.target.value)} /></p>
              </div>
            </div>
            <div>
              <button
                onClick={handleSubmit}
                disabled={loading} type="submit" className={loading ? "disabledAccountButton" : "accountButton1"}>{loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Send"}</button>
              {/* <button className="btn formButton btn-success" onClick={handleSubmit}>Send</button> */}
            </div>
          </div>
        </div>
        {/* contact form */}

        <div className="publicRelation">
          <div className="halfPart">
            <div style={{ display: "flex", alignItems: "center", margin: "0 0 10px 0" }}>
              {/* <div style={{
                backgroundColor: "white",
                width: "40px",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "100%",
                margin: "0 20px 0 0"
              }}>
                <FaQuestion color="#09A144" size={20} />
              </div> */}
              <h2 style={{ margin: "0" }}>For Help & Support</h2>
            </div>
            {/* <div style={{ display: "flex", alignItems: "center", margin: "0 0 10px 0" }}>
              <div style={{
                backgroundColor: "white",
                width: "40px",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "100%",
                margin: "0 20px 0 0"
              }}>
                <BsTelephonePlusFill color="#09A144" size={20} />
              </div>
              <p style={{ margin: "0", fontWeight: '600' }}>+1 647-699-4687</p>
            </div> */}
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
                <IoMdMail color="#09A144" size={20} />
              </div>
              <p style={{ margin: "10px 20px 0px 0px", fontWeight: '600', fontSize: "18px" }}>info@sstrack.io</p>
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
              <p style={{ margin: "10px 20px 0px 0px", fontWeight: '600', fontSize: "18px" }}>+1 647-930-0988
              </p>
            </div>
          </div>
          <div>
            <img width="100%" src={employeeMonitor} alt="" />
          </div>
        </div>
      </section>






      <section className="eightSection">
        <div className="container">
          {/* <p className="employeeTracking">Start employee time tracking!</p> */}
          <button className="startnowButton" onClick={() => navigate("/download")}>Start employee time tracking!</button>
          <p className="creditCancel text-grey">No obligation, no credit card required.</p>
        </div>
        <div>
          <img src={lines} className="homeLine" />
        </div>
        {/* <Footer /> */}
      </section>
      <div>
        <h1>Socket.io Integration Example</h1>
        <button onClick={sendMessageToServer}>Send Message</button>
      </div>

    </div >

  )

}

export default Home;