import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from "react-bootstrap";
import { BsWindows, BsApple, BsGoogle } from 'react-icons/bs'
import appScreenshot from "../images/downloadImage.png"; // Replace with your actual image path
import Header from '../screen/component/Header/NewHeader';
// import appStore from '../../images/SplashM.svg';
import appStore from '../images/SplashM.svg'
import jwtDecode from "jwt-decode"; // ✅ Import jwtDecode
import axios from 'axios'
import playStore from '../images/SplashP.svg';
import chrome from '../images/SplashC.svg';
import { AiFillWindows } from 'react-icons/ai';
import chromeImg from '../images/Mic Logo 2 2.png'
import { useNavigate } from 'react-router-dom';

const DownloadSection = () => {

    const [language, setLanguage] = useState('en');
    const [isOpen, setIsOpen] = useState(false); // ✅ Dropdown open/close state

    const handleToggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };
    const navigate = useNavigate();

    const [downloadOS, setDownloadOS] = useState("mac")
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    // const [loading, setLoading2] = useState(false)

    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";


    const handleDownloadMac = async (type) => {
        console.log(type);
        // setLoading1(type === "Intel" ? true : false);
        // setLoading2(type === "Silicon" ? true : false);

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
                // setTimeout(() => {
                //     setLoading1(false);
                //     setLoading2(false);
                // }, 1000);
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            } else {
                // setLoading1(false);
                // setLoading2(false);
                console.log("Download link error 1 =====>", res);
            }
        } catch (error) {
            // setLoading1(false);
            // setLoading2(false);
            console.log("Download link error 2 =====>", error);
        }
    };

    const handleDownload = async (type) => {
        console.log("Download Type:", type);
        setLoading1(type === "WIN");
        setLoading2(type === "MAC");

        try {
            // Retrieve token from localStorage
            let token = localStorage.getItem("token");
            let userId = null;

            // Decode the token safely
            if (token) {
                try {
                    const decoded = jwtDecode(token); // ✅ Decode token
                    userId = decoded?._id || decoded?.userId || null; // Extract userId
                    console.log("🔹 Extracted userId from token:", userId);
                } catch (decodeError) {
                    console.error("❌ Error decoding token:", decodeError);
                    userId = null;
                }
            }

            // Validate userId retrieval
            if (!userId || userId === "null" || userId === "undefined") {
                console.log("⚠️ userId is invalid or not set.");
                setLoading1(false);
                setLoading2(false);
                userId = null;
            }

            // Convert userId to a valid string (if needed)
            userId = userId ? userId.toString().trim() : null;

            // Log request payload
            const requestData = { userId };
            console.log("📌 Request Payload for Download History API:", requestData);

            // Step 1: Send userId to `/timetrack/downloadHistory`
            const historyResponse = await axios.post(
                `${apiUrl}/timetrack/downloadHistory`,
                requestData, // Send userId in body
                { headers: { "Content-Type": "application/json" } }
            );

            // Log API response
            console.log("📌 Download History API Response:", historyResponse);

            if (historyResponse.status !== 200) {
                console.error("❌ Failed to update download history", historyResponse);
                setLoading1(false);
                setLoading2(false);
                return;
            }

            console.log("✅ Download history updated successfully.");

            // Step 2: Fetch the file download URL
            console.log("⏳ Fetching download file URL...");
            const res = await axios.get(`${apiUrl}/timetrack/updatedFile`);

            // Log file API response
            console.log("📌 File API Response:", res);

            if (res.status === 200 && res.data.data?.url) {
                const url = res.data.data.url;
                console.log("✅ File URL received:", url);

                // Trigger file download
                const anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = "screenshot-time.exe";

                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);

                console.log("🚀 File Download Triggered!");
            } else {
                console.error("❌ Download link error:", res);
            }
        } catch (error) {
            console.error("❌ Error in download process:", error);
        } finally {
            setTimeout(() => {
                setLoading1(false); // ✅ Re-enable the button after download completes
                setLoading2(false); // ✅ Re-enable the button after download completes

            }, 2000); // Adjust the timeout as needed
        }
    };

    const handleClick = () => {
        window.location.href = 'https://chromewebstore.google.com/detail/sstrack/gkmllhjndmaaapegaopkpapaamfaeckg?hl=en-US';
    };
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }, [])

    console.log(loading1);

    function goToDashboard() {
        navigate("/signup");
        // window.location.reload();
    }

    const isArabic = language === "ar"; // ✅ Check if Arabic

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <>
            <Header language={language} handleToggleLanguage={handleToggleLanguage} />

            <div style={{ padding: "4rem 0", backgroundColor: "#F9FCFF" }}>
                <Container>
                    <Row className="align-items-center">
                        {/* Left Content */}
                        <Col md={6}>
                            <h1 style={{ fontWeight: "700", color: "#0D4873" }}>
                                {isArabic ? "احصل على تطبيق سطح المكتب لـ" : "Get the Desktop App for"}
                                <span style={{ color: "#7ACB59" }}>
                                    {isArabic ? "ويندوز، ماك، وكروم أو إس" : " Windows, macOS, and ChromeOS"}
                                </span>
                            </h1>
                            <p style={{ color: "#6C757D", fontSize: "16px", marginTop: "1rem" }}>
                                {isArabic
                                    ? "يمكن لمسؤولي الشركة مراجعة الساعات المسجلة ولقطات الشاشة من خلال هذا الموقع."
                                    : "Company administrators can review the tracked hours and screenshots on this website."}
                            </p>
                            <div
                                className="d-flex justify-content-start gap-3 flex-wrap"
                                style={{
                                    width: "100%",
                                    alignItems: "center", // Items vertically center hon
                                }}
                            >
                                {/* Chrome Extension Button */}
                                <button
                                    style={{
                                        backgroundColor: 'black', // Loading state removed
                                        padding: '2%',
                                        width: '30%',
                                        fontSize: '75%',
                                        marginLeft: '0%',
                                    }}
                                    className="download-button" // Loading class removed
                                    onClick={handleClick} // Directly calls handleClick without checking loading state
                                >
                                    <>
                                        <img
                                            src={chromeImg}
                                            alt="Chrome Icon"
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                margin: "-5px 10px 0 0",
                                            }}
                                        />
                                        <span style={{ color: 'white', fontSize: '-15%' }}>
                                            {isArabic ? "تحميل الإضافة" : "Download Extension"}
                                        </span>
                                    </>
                                </button>


                                {/* Windows Download Button 1 */}
                                <button
                                    style={{
                                        backgroundColor: loading1 ? '#6c757d' : 'black',
                                        padding: '2%',
                                        width: '32%',
                                        fontSize: '75%',
                                        cursor: loading1 ? 'not-allowed' : 'pointer',
                                    }}
                                    className={loading1 ? "disable-download-button" : "download-button"}
                                    disabled={loading1}
                                    onClick={() => handleDownload("WIN")}
                                >
                                    {loading1 ? "Downloading..." : (
                                        <>
                                            <BsWindows color="#00ACEE" size={18} style={{ margin: "-5px 10px 0 0" }} />
                                            <span style={{ color: 'white' }}>
                                                {isArabic ? "تحميل لنظام ويندوز" : "Download for Windows"}
                                            </span>
                                        </>
                                    )}
                                </button>

                                {/* Mac Download Button 3 */}
                                {/* <button
                                    style={{
                                        backgroundColor: loading2 ? '#6c757d' : 'black',
                                        padding: '2%',
                                        width: '30%',
                                        fontSize: '75%',
                                        cursor: loading2 ? 'not-allowed' : 'pointer',
                                    }}
                                    className={loading2 ? "disable-download-button" : "download-button"}
                                    disabled={loading2}
                                    onClick={() => handleDownloadMAC("MAC")}
                                >
                                    {loading2 ? "Downloading..." : (
                                        <>
                                            <BsApple color="#fff" size={18} style={{ margin: "-5px 10px 0 0" }} />
                                            <span style={{ color: 'white' }}>
                                                {isArabic ? "تحميل لنظام ويندوز" : "Download for Mac OS"}
                                            </span>
                                        </>
                                    )}
                                </button> */}

                                {/* Mac OS Dropdown */}
                                <div style={{ width: "185px", height: "42px" }}>
                                    <button
                                        className="btn btn-dark dropdown-toggle no-caret"
                                        type="button"
                                        id="dropdownMenuButton"
                                        data-bs-toggle="dropdown"
                                        aria-expanded={isOpen}
                                        onClick={() => setIsOpen(!isOpen)}
                                        style={{
                                            width: "110%",
                                            height: "100%",
                                            backgroundColor: "black",
                                            borderRadius: "6px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            marginLeft: '-4%'
                                        }}
                                    >
                                        <BsApple color="#fff" size={20} style={{ marginRight: "10px" }} />
                                        {isArabic ? "تحميل لنظام ماك" : "Download for Mac"}
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
                                                {isArabic ? "لنظام ماك بشريحة Apple" : "For Mac Apple Chip"}
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
                                                {isArabic ? "لنظام ماك بشريحة Intel" : "For Intel Chip"}
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                            </div>


                            <h4 style={{ marginTop: "2rem", color: "#0D4873" }}></h4>
                            <p style={{ color: "#6C757D", fontSize: "16px", lineHeight: "1.8" }}>
                                {/* This is a Windows desktop application designed for employees. It
                                allows an employee to start and stop tracking their work time and
                                captures screenshots of their computer during work hours. */}
                                {isArabic
                                    ? "هذا تطبيق سطح مكتب لنظام ويندوز مصمم للموظفين. يتيح للموظف بدء وإيقاف تتبع وقت عمله ويلتقط لقطات شاشة لجهاز الكمبيوتر الخاص به أثناء ساعات العمل."
                                    : "This is a Windows desktop application designed for employees. It allows an employee to start and stop tracking their work time and captures screenshots of their computer during work hours."
                                }
                                <br />
                                <br />
                                {isArabic
                                    ? "بمجرد تنشيط زر الإيقاف، يتوقف عن التقاط لقطات الشاشة. يمكن مراجعة وقت عملك ولقطات الشاشة في \"صفحتي الرئيسية\"، حيث لديك أيضًا خيار حذف أي لقطات شاشة."
                                    : "Once the stop button is activated, it ceases to take screenshots. Your work time and screenshots can be reviewed in My Home, where you also have the option to delete any screenshots."
                                }
                            </p>

                            <h4 style={{ marginTop: "1.5rem", color: "#0D4873" }}>
                                {isArabic ? "بعد التثبيت" : "Post-installation"}
                            </h4>

                            <p style={{ color: "#6C757D", fontSize: "16px", lineHeight: "1.8" }}>
                                {isArabic
                                    ? "بمجرد تثبيت التطبيق، قم بتشغيله وانقر على \"ابدأ\" لبدء مراقبة وقتك والتقاط لقطات الشاشة."
                                    : "Once the application is installed, launch it and click 'Start' to begin monitoring your time and capturing screenshots."
                                }
                            </p>

                        </Col>

                        {/* Right Content */}
                        <Col md={6} className="text-center">
                            <img
                                src={appScreenshot} // Replace with the actual image path
                                alt={isArabic ? "لقطة شاشة لتطبيق SS Track.io" : "SS Track.io Application Screenshot"}
                                style={{
                                    width: "90%",
                                    maxWidth: "500px",
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                                }}
                            />
                            <Button
                                // href="#"
                                style={{
                                    backgroundColor: "#7ACB59",
                                    color: "#FFFFFF",
                                    border: "none",
                                    padding: "12px 30px",
                                    borderRadius: "30px",
                                    fontWeight: "600",
                                    fontSize: "18px",
                                    marginTop: "2rem",
                                }}
                                onClick={goToDashboard}
                            >
                                {isArabic ? "لوحة التحكم →" : "Dashboard →"}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default DownloadSection;
