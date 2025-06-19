import axios from 'axios';
import jwtDecode from "jwt-decode";
import { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { BsApple } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import step1 from '../../images/Container.png';
import step2 from '../../images/sp.png';
import chrome from '../../images/SplashC.svg';
import appStore from '../../images/SplashM.svg';
import playStore from '../../images/SplashP.svg';
import NewHeader from '../component/Header/NewHeader';


function DashboardSplash() {
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    let token = localStorage.getItem('token');
    const items = jwtDecode(JSON.stringify(token));
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [userType, setUserType] = useState(items?.userType || 'user');

    const [isOpen, setIsOpen] = useState(false); // ✅ Dropdown open/close state

    useEffect(() => {
        const dropdownBtn = document.getElementById("dropdownMenuButton");

        const handleShow = () => setIsOpen(true);
        const handleHide = () => setIsOpen(false);

        if (dropdownBtn) {
            dropdownBtn.addEventListener("show.bs.dropdown", handleShow);
            dropdownBtn.addEventListener("hide.bs.dropdown", handleHide);
        }

        return () => {
            if (dropdownBtn) {
                dropdownBtn.removeEventListener("show.bs.dropdown", handleShow);
                dropdownBtn.removeEventListener("hide.bs.dropdown", handleHide);
            }
        };
    }, []);

    const handleDownloadMac = async (type) => {
        console.log(type);
        setLoading1(type === "Intel" ? true : false);
        setLoading2(type === "Silicon" ? true : false);

        // ✅ API endpoints based on type
        let apiEndpoint = type === "Intel"
            ? `${apiUrl}/timetrack/getIntelFile`  // ✅ For Mac Apple Chip
            : `${apiUrl}/timetrack/getSiliconFile`; // ✅ For Intel Chip

        try {
            const res = await axios.get(apiEndpoint);
            if (res.status === 200) {
                var url = res.data.data.url;
                var anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = type === "Intel" ? 'screenshot-time-intel.dmg' : 'screenshot-time-silicon.dmg'; // ✅ Different filenames
                setTimeout(() => {
                    setLoading1(false);
                    setLoading2(false);
                }, 1000);
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            } else {
                setLoading1(false);
                setLoading2(false);
                console.log("Download link error 1 =====>", res);
            }
        } catch (error) {
            setLoading1(false);
            setLoading2(false);
            console.log("Download link error 2 =====>", error);
        }
    };

    const handleDownload = async (type) => {
        console.log(type);
        setLoading1(type === "WIN" ? true : false);
        setLoading2(type === "MAC" ? true : false);
        try {
            const res = await axios.get(`${apiUrl}/timetrack/updatedFile`);
            if (res.status === 200) {
                var url = res.data.data.url;
                var anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'screenshot-time.exe';
                setTimeout(() => {
                    setLoading1(false);
                    setLoading2(false);
                }, 1000);
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            } else {
                setLoading1(false);
                setLoading2(false);
                console.log("download link error 1 =====>", res);
            }
        } catch (error) {
            setLoading1(false);
            setLoading2(false);
            console.log("download link error 2 =====>", error);
        }
    };
    useEffect(() => {
        const updateUserSplash = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return; // Exit if token is not available

                // Send PATCH request to update user splash status
                const response = await axios.patch(`${apiUrl}/timetrack/updateUserSplash`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Extract new token from response
                const newToken = response.data.token;
                if (newToken) {
                    localStorage.setItem("token", newToken); // Update token
                }

                // localStorage.setItem("hasSeenSplash", "true"); // Mark splash as seen

            } catch (error) {
                console.error("Error updating user splash status:", error);
            }
        };

        updateUserSplash();
    }, []);

    function goToDashboard() {
        navigate("/dashboard");
        window.location.reload();
    }

    function goToTeam() {
        navigate("/team");
        window.location.reload();
    }

    function goToTraingCenter() {
        navigate("/training");
        window.location.reload();
    }

    const scrollToTeamSection = () => {
        const teamSection = document.getElementById("team");
        if (teamSection) {
            teamSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 50, // Adjust scroll position
                behavior: "smooth",
            });
        }
    }



    return (
        <>

            {/* Owner Side */}
            {
                userType === "owner" && (

                    <div style={{ backgroundColor: 'white' }}>

                        <NewHeader language={'en'} show={true} />

                        {/* <Container fluid className="px-3 px-md-5"> */}

                        <Container fluid className="bg-white text-center py-5">
                            {/* <div className="container py-5"> */}

                            {/* <h2 className="fw-bold" style={{ fontSize: '45px' }}>
                                Owner
                                <span style={{ color: "#7ACB59", marginLeft: "10px" }}>
                                    Dashboard
                                </span>
                            </h2> */}

                            <p className="text-center fs-2" >Welcome to SSTrack – Monitor, Manage, and Optimize</p>
                            <p className="text-center fs-4" style={{ marginTop: '-0.5%' }}>Gain full visibility into your team's productivity with real-time screenshot monitoring.</p>

                            {/* <div style={{ width: '100%', position: 'relative', paddingBottom: '40.25%', marginTop: '-4%', height: 0 }}>
                                <iframe
                                    src="https://www.youtube.com/embed/9jxJfVXtlDc?si=fVZgJsXmek6EE4lz"
                                    title="SSTrack Overview"
                                    style={{
                                        position: 'absolute',
                                        top: '20%',
                                        left: '50%',
                                        transform: 'translate(-50%, -10%)',
                                        width: '82.5%',
                                        height: '95%',
                                        border: '0',
                                    }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div> */}

                            <>
                                <Row className="justify-content-center g-0 gx-0 mx-0 my-0">
                                    {/* LEFT CARD */}
                                    <Col xs={12} md={6} lg={5} className="p-2 d-flex">
                                        <Card className="shadow-sm w-100 h-100">
                                            <Card.Body className="h-100 d-flex flex-column justify-content-between text-start px-3 pt-3 pb-2">
                                                <div>
                                                    <h3 className="mb-2" style={{ color: "#7ACB59", lineHeight: window.innerWidth < 1400 ? '1.8' : '3' }}>
                                                        Optimize Your Team’s Productivity
                                                    </h3>
                                                    <h4 className="text-muted" style={{ color: "#7ACB59", lineHeight: window.innerWidth < 1400 ? '1.8' : '3.5' }}>
                                                        Enhance Efficiency with Smart Time Tracking & Insights
                                                    </h4>
                                                </div>

                                                <div style={{ lineHeight: window.innerWidth < 1400 ? '1.8' : '3.5' }}>
                                                    <p className="mb-1">
                                                        <strong className="" style={{ color: "#7ACB59" }}>1 Live Screenshot Monitoring</strong> – Track activities with automated screenshots.
                                                    </p>
                                                    <p className="mb-1">
                                                        <strong className="" style={{ color: "#7ACB59" }}>2 Detailed Productivity Reports</strong> – Get insights into work hours and efficiency.
                                                    </p>
                                                    <p className="mb-1">
                                                        <strong className="" style={{ color: "#7ACB59" }}>3 Time Tracking & Logs</strong> – Monitor active and idle times accurately.
                                                    </p>
                                                    <p className="mb-1">
                                                        <strong className="" style={{ color: "#7ACB59" }}>4 App & Website Usage</strong> – See which apps and websites your team is using.
                                                    </p>
                                                    <p className="mb-0">
                                                        <strong className="" style={{ color: "#7ACB59" }}>5 Data Security & Compliance</strong> – Ensure secure and ethical monitoring.
                                                    </p>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    {/* RIGHT CARD */}
                                    <Col xs={12} md={6} lg={5} className="p-2 d-flex">
                                        <Card className="shadow-sm w-100 h-100" style={{ cursor: 'pointer' }} onClick={() => navigate("/team")}>
                                            <Card.Img
                                                variant="top"
                                                src={step1}
                                                className="img-fluid"
                                                style={{ maxHeight: '420px', objectFit: 'contain', width: '75%', margin: 'auto', paddingTop: '1rem' }}
                                            />
                                            <Card.Body className="text-start d-flex flex-column justify-content-between px-3">
                                                {/* <h3
                                                    onClick={scrollToTeamSection}
                                                    style={{ color: "#7ACB59", textDecoration: 'underline', cursor: 'pointer' }}
                                                >
                                                    Invite Employees
                                                </h3> */}
                                                <h3
                                                    className="invite-heading"
                                                    onClick={goToTeam}
                                                >
                                                    Invite Employees
                                                </h3>

                                                <p className="text-muted">
                                                    Owners can invite employees to join the team and assign them specific roles as Admin, Manager, or User. This enables seamless time tracking, productivity monitoring, and screenshot submissions.
                                                </p>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                </Row>
                            </>
                            <div className="d-flex justify-content-center container p-0 py-3">
                                {/* <button className="btn btn-success" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#7ACB59' }} onClick={goToDashboard}>
                                    Dashboard →
                                </button> */}
                                <div className="d-flex justify-content-center flex-wrap gap-3 container p-0 py-3">
                                    <button
                                        className="btn btn-success"
                                        style={{ padding: '0.75rem 1.5rem', backgroundColor: '#7ACB59' }}
                                        onClick={goToTraingCenter}
                                    >
                                        Training Center →
                                    </button>

                                    <button
                                        className="btn btn-success"
                                        style={{ padding: '0.75rem 1.5rem', backgroundColor: '#7ACB59' }}
                                        onClick={goToDashboard}
                                    >
                                        Dashboard →
                                    </button>

                                    <button
                                        className="btn btn-success"
                                        style={{ padding: '0.75rem 1.5rem', backgroundColor: '#7ACB59' }}
                                        onClick={goToTeam}
                                    >
                                        Invite Employees →
                                    </button>
                                </div>

                            </div>
                        </Container>

                        {/* </div> */}
                    </div >
                )}

            {/* User Side */}
            {
                userType === "user" && (
                    <>
                        <div style={{ backgroundColor: 'white' }}>
                            <NewHeader language={'en'} show={true} />

                            <Container fluid className="bg-white text-center py-5">
                                {/* <div className="container py-5"> */}
                                <h2 className="fw-bold" style={{ fontSize: '45px' }}>
                                    Employee
                                    <span style={{ color: "#7ACB59", marginLeft: "10px" }}>
                                        Dashboard
                                    </span>
                                </h2>
                                <p className="text-center mb-1 fs-2">Welcome to SSTrack – Work Smarter, Not Harder!</p>
                                <p className="text-center mb-1 fs-4" >SSTrack helps you stay productive and transparent while working.</p>
                                <div className="d-flex justify-content-center" style={{ marginTop: '-2%' }}>
                                    {/* <div style={{ width: '100%', maxWidth: '800px', aspectRatio: '16/9' }}>
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            // src="https://youtu.be/qGjzXQ_SLH4"
                                            src="https://www.youtube.com/embed/qGjzXQ_SLH4"
                                            title="SSTrack Overview"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div> */}
                                </div>
                                <>
                                    <Row className="justify-content-center g-0 gx-0 mx-0 my-0">
                                        <Col xs={12} md={6} lg={4} className="p-3 mt-lg-5 d-flex justify-content-center">
                                            <div className="card shadow-sm p-3 d-flex flex-column" style={{ minHeight: '100%' }}>
                                                <img src={step2} alt="Step 3" className="card-img-top" />
                                                <div className="card-body d-flex text-start flex-column justify-content-between">
                                                    <p className="h4" style={{ color: "#7ACB59" }}>Optimize Your Team’s Productivity
                                                    </p>
                                                    <p className="text-muted">Enhance Efficiency with Smart Time Tracking & Insights
                                                    </p>
                                                    {/* ✅ Download Buttons - All in One Row */}
                                                    <div className="d-flex justify-content-start align-items-center flex-wrap gap-3">
                                                        {/* <Col xs={6} sm={6} md={5} lg={5}>
                                            <a onClick={(e) => { e.preventDefault(); handleDownload("WIN"); }} className="btn w-100 p-0" style={{ background: 'black', height: '50px' }}>
                                                <img src={appStore} alt="Windows" className="img-fluid h-100 w-100" />
                                            </a>
                                        </Col>
                                        <Col xs={6} sm={6} md={5} lg={5}>
                                            <a href="https://play.google.com/store/apps/details?id=com.SSTRACK&pcampaignid=web_share"
                                                target="_blank" rel="noopener noreferrer" className="btn w-100 p-0" style={{ background: 'black', height: '50px' }}>
                                                <img src={playStore} alt="Google Play" className="img-fluid h-100 w-100" />
                                            </a>
                                        </Col>
                                        <Col xs={6} sm={6} md={5} lg={5}>
                                            <a href="https://chromewebstore.google.com/detail/sstrack/gkmllhjndmaaapegaopkpapaamfaeckg?hl=en-US"
                                                target="_blank" rel="noopener noreferrer" className="btn w-100 p-0" style={{ background: 'black', height: '50px' }}>
                                                <img src={chrome} alt="Chrome" className="img-fluid h-100 w-100" />
                                            </a>
                                        </Col> */}
                                                        {/* <div className="d-flex justify-content-start align-items-center flex-wrap"> */}
                                                        <Row className="g-2">
                                                            <Col xs={6} sm={6} md={6} lg={6}>
                                                                <a onClick={(e) => { e.preventDefault(); handleDownload("WIN"); }}
                                                                    className="btn w-100 p-0" style={{ background: 'black', height: '50px' }}>
                                                                    <img src={appStore} alt="Windows" className="img-fluid h-100" />
                                                                </a>
                                                            </Col>
                                                            <Col xs={6} sm={6} md={6} lg={6}>
                                                                <a href="https://play.google.com/store/apps/details?id=com.SSTRACK&pcampaignid=web_share"
                                                                    target="_blank" rel="noopener noreferrer"
                                                                    className="btn w-100 p-0" style={{ background: 'black', height: '50px' }}>
                                                                    <img src={playStore} alt="Google Play" className="img-fluid h-100 " />
                                                                </a>
                                                            </Col>
                                                            <Col xs={6} sm={6} md={6} lg={6}>
                                                                <a href="https://chromewebstore.google.com/detail/sstrack/gkmllhjndmaaapegaopkpapaamfaeckg?hl=en-US"
                                                                    target="_blank" rel="noopener noreferrer"
                                                                    className="btn w-100 p-0" style={{ background: 'black', height: '50px' }}>
                                                                    <img src={chrome} alt="Chrome" className="img-fluid h-100 w-100" />
                                                                </a>
                                                            </Col>
                                                            <Col xs={12} sm={6} md={8} lg={6}>
                                                                <div className="w-100">
                                                                    <button
                                                                        className="btn btn-dark dropdown-toggle w-100 no-caret"
                                                                        type="button"
                                                                        id="dropdownMenuButton"
                                                                        data-bs-toggle="dropdown"
                                                                        aria-expanded={isOpen}
                                                                        onClick={() => setIsOpen(!isOpen)}
                                                                        style={{
                                                                            height: "50px",
                                                                            borderRadius: "6px",
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            justifyContent: "center",
                                                                            fontWeight: "bold",
                                                                            fontSize: "14px",
                                                                            minWidth: 0,
                                                                            flexShrink: 1,
                                                                            padding: "0 10px",
                                                                            textAlign: "center",
                                                                            whiteSpace: window.innerWidth < 1300 ? "normal" : "nowrap",
                                                                        }}
                                                                    >
                                                                        <BsApple color="#fff" size={20} style={{ marginRight: "8px" }} />
                                                                        Download for Mac
                                                                        <span style={{ marginLeft: "8px" }}>
                                                                            {isOpen ? "▲" : "▼"}
                                                                        </span>
                                                                    </button>

                                                                    <ul className="dropdown-menu custom-dropdown" aria-labelledby="dropdownMenuButton">
                                                                        <li>
                                                                            <a
                                                                                className="dropdown-item custom-dropdown-item"
                                                                                href="#"
                                                                                onClick={() => handleDownloadMac("Silicon")}
                                                                                style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                                                            >
                                                                                <BsApple size={18} /> For Mac Apple Chip
                                                                            </a>
                                                                        </li>
                                                                        <li>
                                                                            <a
                                                                                className="dropdown-item custom-dropdown-item"
                                                                                href="#"
                                                                                onClick={() => handleDownloadMac("Intel")}
                                                                                style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                                                            >
                                                                                <BsApple size={18} /> For Intel Chip
                                                                            </a>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </Col>

                                                        </Row>
                                                        {/* </div> */}

                                                    </div>
                                                    {/* <div style={{ textAlign: "left" }}> */}


                                                    {/* </div> */}
                                                </div>
                                            </div>
                                        </Col>

                                        {/* <Col xs={12} md={6} lg={4} className="p-1 d-flex justify-content-center"> */}
                                        <Col xs={12} md={6} lg={4} className="p-3 mt-lg-5 d-flex">
                                            <div className="card shadow-sm p-3 w-100 h-100 d-flex flex-column" style={{ cursor: 'pointer' }}>
                                                {/* <div className="card shadow-sm d-flex flex-column p-3 h-100" onClick={() => navigate("/team")} style={{ cursor: 'pointer' }}> */}
                                                {/* <img src={step1} alt="Step 1" /> */}
                                                {/* <div className="card-body d-flex flex-column justify-content-between"> */}
                                                <div className="card-body text-start">
                                                    {/* <div style={{ width: '100%', maxWidth: '800px', aspectRatio: '16/9' }}> */}
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        // src="https://youtu.be/qGjzXQ_SLH4"
                                                        src="https://www.youtube.com/embed/qGjzXQ_SLH4"
                                                        title="SSTrack Overview"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                                <div style={{ textAlign: 'left', lineHeight: window.innerWidth < 768 ? '1.5' : '1.6' }}>

                                                    <p> <strong style={{ color: "#7ACB59" }}>
                                                        1 Automatic Time Tracking</strong> – Keep track of work hours effortlessly.</p>
                                                    <p> <strong style={{ color: "#7ACB59" }}>
                                                        2 Transparent Monitoring</strong> – Screenshots capture progress, ensuring fairness.</p>
                                                    <p> <strong style={{ color: "#7ACB59" }}>
                                                        3 Performance Insights</strong> – Understand your work habits & boost productivity.</p>
                                                    <p> <strong style={{ color: "#7ACB59" }}>
                                                        4 Secure & Private</strong> –  Data is protected, and only work-related activity is tracked.</p>
                                                    {/* <p className="text-muted">To Track Your Own Time & See How It Works</p>
                                                    <p className="text-muted">To Track Your Own Time & See How It Works</p> */}
                                                    <p> <strong style={{ color: "#7ACB59" }}>
                                                        5 Seamless Workflow</strong> – Works in the background without interruptions.</p>
                                                </div>
                                                {/* </div> */}
                                                {/* </div> */}
                                            </div>
                                        </Col>
                                    </Row>
                                </>

                                <div className="d-flex justify-content-center container p-0 py-3">
                                    <button className="btn btn-success" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#7ACB59' }} onClick={goToDashboard}>
                                        Dashboard →
                                    </button>
                                </div>
                            </Container>


                            {/* </div> */}
                        </div >
                    </>
                )
            }
        </>

    );
}

export default DashboardSplash;
