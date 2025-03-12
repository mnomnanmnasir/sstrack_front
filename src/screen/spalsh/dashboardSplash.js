import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewHeader from '../component/Header/NewHeader';
import step1 from '../../images/Container.png';
import { BsWindows, BsApple, BsGoogle } from 'react-icons/bs'
import step2 from '../../images/sp.png';
import appStore from '../../images/SplashM.svg';
import playStore from '../../images/SplashP.svg';
import chrome from '../../images/SplashC.svg';
import { useNavigate } from 'react-router-dom';
import apple from '../../images/apple-Screenshot.png';
import { Dropdown } from "react-bootstrap";


function DashboardSplash() {
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false); // ✅ Dropdown open/close state

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
                const response = await axios.patch("https://myuniversallanguages.com:9093/api/v1/timetrack/updateUserSplash", {}, {
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
    return (
        <div style={{ backgroundColor: 'white', minWidth: '100vw' }}>
            <NewHeader language={'en'} show={true} />
            <div className="container py-5">
                <p className="text-center mb-4">Here is where you can track your activities and manage your team.</p>

                {/* ✅ Bootstrap Grid for Two Cards in a Row */}
                <div className="row justify-content-center">
                    {/* ✅ First Card - Download App */}
                    <div className="col-lg-6 col-md-8 col-sm-12 mb-4">
                        <div className="card shadow-sm d-flex flex-column p-3" style={{ cursor: 'pointer' }}>
                            <img src={step2} alt="Step 3" className="card-img-top" />
                            <div className="card-body d-flex flex-column justify-content-between">
                                <p className="h4" style={{ color: "#7ACB59" }}>Download The App</p>
                                <p className="text-muted">To Track Your Own Time & See How It Works</p>

                                {/* ✅ Download Buttons - All in One Row */}
                                <div className="d-flex justify-content-start align-items-center flex-wrap gap-3">
                                    <a href="#!" onClick={(e) => { e.preventDefault(); handleDownload("WIN"); }}
                                        className="btn" style={{background:'black', width: "230px", height: "50px" }}>
                                        <img src={appStore} alt="Windows" className="img-fluid" style={{ width: "490px", height: "119%" }} />
                                    </a>

                                    <a href="https://play.google.com/store/apps/details?id=com.SSTRACK&pcampaignid=web_share"
                                        target="_blank" rel="noopener noreferrer"
                                        className="btn btn-outline-dark" style={{background:'black', width: "230px", height: "50px" }}>
                                        <img src={playStore} alt="Google Play" className="img-fluid" style={{ width: "490px", height: "119%" }}  />
                                    </a>

                                    <a href="https://chromewebstore.google.com/detail/sstrack/gkmllhjndmaaapegaopkpapaamfaeckg?hl=en-US"
                                        target="_blank" rel="noopener noreferrer"
                                        className="btn btn-dark" style={{ background:'black',width: "230px", height: "50px" }}>
                                        <img src={chrome} alt="Chrome Play" className="img-fluid"  style={{ width: "490px", height: "119%" }}  />
                                    </a>

                                    {/* Mac OS Dropdown */}
                                    <div style={{ width: "250px", height: "52px" }}>
                                        <button
                                            className="btn btn-dark dropdown-toggle no-caret"
                                            type="button"
                                            id="dropdownMenuButton"
                                            data-bs-toggle="dropdown"
                                            aria-expanded={isOpen}
                                            onClick={() => setIsOpen(!isOpen)}
                                            style={{
                                                width: "92%",
                                                height: "100%",
                                                backgroundColor: "black",
                                                borderRadius: "6px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <BsApple color="#fff" size={20} style={{ marginRight: "10px" }} />
                                            Download for Mac
                                            <span style={{ marginLeft: "10px", transition: "transform 0.3s ease" }}>
                                                {isOpen ? "▲" : "▼"}
                                            </span>
                                        </button>

                                        {/* Dropdown Menu */}
                                        <ul className="dropdown-menu custom-dropdown" aria-labelledby="dropdownMenuButton">
                                            <li>
                                                <a
                                                    className="dropdown-item custom-dropdown-item"
                                                    href="#"
                                                    onClick={() => handleDownloadMac("Silicon")}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        color: "white",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    <BsApple color="#fff" size={18} />
                                                    For Mac Apple Chip
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    className="dropdown-item custom-dropdown-item"
                                                    href="#"
                                                    onClick={() => handleDownloadMac("Intel")}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        color: "white",
                                                        gap: "8px",
                                                    }}
                                                >
                                                    <BsApple color="#fff" size={18} />
                                                    For Intel Chip
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ✅ Second Card - Invite Employees */}
                    <div className="col-lg-6 col-md-8 col-sm-12 mb-4">
                        <div className="card shadow-sm d-flex flex-column p-3 h-100" onClick={() => navigate("/team")} style={{ cursor: 'pointer' }}>
                            <img src={step1} alt="Step 1" className="card-img-top" />
                            <div className="card-body d-flex flex-column justify-content-between">
                                <p className="h4" style={{ color: '#7ACB59' }}>Invite Employees</p>
                                <p className="text-muted">
                                    After choosing a plan, managers can invite employees to join the team, enabling time tracking and screenshot submissions seamlessly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ Dashboard Button */}
                <div className="d-flex justify-content-center">
                    <button className="btn btn-success" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#7ACB59' }} onClick={goToDashboard}>
                        Dashboard →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DashboardSplash;
