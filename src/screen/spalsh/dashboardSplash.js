import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewHeader from '../component/Header/NewHeader';
import step1 from '../../images/Container.png';
import step2 from '../../images/sp.png';
import appStore from '../../images/SplashM.svg';
import playStore from '../../images/SplashP.svg';
import chrome from '../../images/SplashC.svg';
import { useNavigate } from 'react-router-dom';

function DashboardSplash() {
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const navigate = useNavigate();

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
                <div className="row justify-content-center">
                    {/* Download App Section */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm d-flex flex-column" style={{ height: '100%', cursor: 'pointer' }}>
                            <img src={step2} alt="Step 3" className="card-img-top" />
                            <div className="card-body d-flex flex-column justify-content-between" style={{ flex: 1 }}>
                                <p className="h4" style={{ color: "#7ACB59" }}>Download The App</p>
                                <p className="text-muted">To Track Your Own Time & See How It Works</p>
                                <div>
                                    <style>
                                        {`
    @media (max-width: 768px) {
        .responsive-container {
        
            flex-direction: column !important; /* Stack items vertically on mobile */
            align-items: center !important; /* Center items in the container */
            gap: 16px !important; /* Add spacing between items */
            width: 100%; /* Ensure the container spans the full width */
        }
        .responsive-link {
        
            width: 100%; /* Ensure the link spans the full width */
        }
        .responsive-image {
            width: 100% !important; /* Full width on mobile */
            max-width: none !important; /* Remove max-width restriction */
            height: 46px !important; /* Increase height for mobile */
            background-color: black !important; /* Black background for images */
            border-radius: 8px; /* Add slight rounding for aesthetics */
            padding: 4px; /* Add padding to the image */
            display: block; /* Ensure the image takes the full width inside the link */
        }
    }
    `}
    
                                    </style>


                                    <div
                                        className="d-flex justify-content-center gap-2 responsive-container"
                                        style={{
                                            flexWrap: "wrap", // Ensures wrapping for larger screens
                                            alignItems: "center", // Center items horizontally on larger screens
                                        }}
                                    >
                                        <a
                                            href="#!"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDownload("WIN");
                                            }}
                                            style={{ display: "inline-block" }}
                                        >
                                            <img
                                                src={appStore}
                                                alt="App Store"
                                                style={{
                                                    width: "auto",
                                                    maxWidth: "170px",
                                                    height: "40px",
                                                }}
                                                className="img-fluid responsive-image"
                                            />
                                        </a>
                                        <a
                                            href="https://play.google.com/store/apps/details?id=com.SSTRACK&pcampaignid=web_share"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ display: "inline-block" }}
                                        >
                                            <img
                                                src={playStore}
                                                alt="Google Play"
                                                style={{
                                                    width: "auto",
                                                    maxWidth: "170px",
                                                    height: "40px",
                                                }}
                                                className="img-fluid responsive-image"
                                            />
                                        </a>
                                    </div>
                                    <div
                                        className="d-flex justify-content-center gap-2 mt-2 responsive-container"
                                        style={{
                                            flexWrap: "wrap", // Ensures wrapping for larger screens
                                            alignItems: "center", // Center items horizontally on larger screens
                                        }}
                                    >
                                        <a
                                            href="https://chromewebstore.google.com/detail/sstrack/gkmllhjndmaaapegaopkpapaamfaeckg?hl=en-US"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ display: "inline-block" }}
                                        >
                                            <img
                                                src={chrome}
                                                alt="Chrome Play"
                                                style={{
                                                    width: "auto",
                                                    maxWidth: "170px",
                                                    height: "40px",
                                                }}
                                                className="img-fluid responsive-image"
                                            />
                                        </a>
                                    </div>
                                </div>



                            </div>

                        </div>
                    </div>
                    {/* Invite Employees Section */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm d-flex flex-column" style={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate("/team")}>
                            <img src={step1} alt="Step 1" className="card-img-top" />
                            <div className="card-body d-flex flex-column justify-content-between" style={{ flex: 1 }}>
                                <p className="h4" style={{ color: '#7ACB59' }}>Invite Employees</p>
                                <p className="text-muted">After choosing a plan, managers can invite employees to join the team, enabling time tracking and screenshot submissions seamlessly.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center">
                    <button
                        className="btn "
                        style={{ padding: '0.75rem 1.5rem', backgroundColor: '#7ACB59', color: 'white' }}
                        onClick={goToDashboard}
                    >
                        Dashboard→
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DashboardSplash;
