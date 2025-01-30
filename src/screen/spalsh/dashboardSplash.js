import React, { useState } from 'react';
import axios from 'axios';
import NewHeader from '../component/Header/NewHeader';
import step1 from '../../images/Container.png';
import step2 from '../../images/sp.png';
import appStore from '../../images/Background.png';
import playStore from '../../images/splashplay.png';
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

    return (
        <div style={{ backgroundColor: 'white', width: '100%' }}>
            <NewHeader language={'en'} show={true} />
            <div className="container py-5">
                <p className="text-center mb-4">Here is where you can track your activities and manage your team.</p>
                <div className="row justify-content-center">
                    {/* Download App Section */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm d-flex flex-column" style={{ height: '100%' }}>
                            <img src={step2} alt="Step 3" className="card-img-top" />
                            <div className="card-body d-flex flex-column justify-content-between" style={{ flex: 1 }}>
                                <p className="h4 " style={{color:'#7ACB59'}}>Download The app</p>
                                <p className="text-muted">To Track Your Own Time & See how It Works</p>
                                <div className="d-flex justify-content-center gap-3">
                                    <a href="#!" onClick={(e) => { e.preventDefault(); handleDownload("WIN"); }}>
                                        <img src={appStore} alt="App Store" style={{ width: "125px" }} />
                                    </a>
                                    <a href="https://play.google.com/store/apps/details?id=com.SSTRACK&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
                                        <img src={playStore} alt="Google Play" style={{ width: "125px" }} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Invite Employees Section */}
                    <div className="col-md-4 mb-4">
                        <div className="card shadow-sm d-flex flex-column" style={{ height: '100%' }} onClick={() => navigate("/team")}>
                            <img src={step1} alt="Step 1" className="card-img-top" />
                            <div className="card-body d-flex flex-column justify-content-between" style={{ flex: 1 }}>
                                <p className="h4" style={{color:'#7ACB59'}}>Invite Employees</p>
                                <p className="text-muted">After choosing a plan, managers can invite employees to join the team, enabling time tracking and screenshot submissions seamlessly.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center">
                    <button
                        className="btn "
                        style={{ padding: '0.75rem 1.5rem', backgroundColor:'#7ACB59', color:'white' }}
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard→
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DashboardSplash;
