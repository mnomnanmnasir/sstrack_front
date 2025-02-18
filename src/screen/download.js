// import React, { useEffect, useState } from 'react';
// import DownloadProduct from '../images/ss-track-banner.svg';
// import { BsWindows, BsApple, BsGoogle } from 'react-icons/bs'
// import axios from 'axios'
// import Header from '../screen/component/header';
// import jwtDecode from "jwt-decode"; // ✅ Import jwtDecode

// const Download = () => {

//     const [downloadOS, setDownloadOS] = useState("mac")
//     const [loading1, setLoading1] = useState(false)
//     const [loading2, setLoading2] = useState(false)
//     const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

//     // const handleDownload = async (type) => {
//     //     console.log(type);
//     //     setLoading1(type === "WIN" ? true : false)
//     //     setLoading2(type === "MAC" ? true : false)
//     //     try {
//     //         const res = await axios.get(`${apiUrl}/timetrack/updatedFile`)
//     //         if (res.status === 200) {
//     //             var url = res.data.data.url;
//     //             var anchor = document.createElement('a');
//     //             anchor.href = url;
//     //             anchor.download = 'screenshot-time.exe';
//     //             setTimeout(() => {
//     //                 setLoading1(false)
//     //                 setLoading2(false)
//     //             }, 1000)
//     //             document.body.appendChild(anchor);
//     //             anchor.click();
//     //             document.body.removeChild(anchor);
//     //         }
//     //         else {
//     //             setLoading1(false)
//     //             setLoading2(false)
//     //             console.log("download link error 1 =====>", res);
//     //         }
//     //     } catch (error) {
//     //         setLoading1(false)
//     //         setLoading2(false)
//     //         console.log("download link error 2 =====>", error);
//     //     }
//     // }

//     // const handleDownload = async (type) => {
//     //     console.log("Download Type:", type);
//     //     setLoading1(type === "WIN" ? true : false);
//     //     setLoading2(type === "MAC" ? true : false);

//     //     try {
//     //         // Get userId from localStorage
//     //         const userId = localStorage.getItem('userId'); // Ensure userId is stored after login

//     //         console.log("UserId to be sent:", userId);

//     //         // Set headers exactly like token is sent
//     //         const headers = {
//     //             Authorization: userId ? `Bearer ${userId}` : null, // Sending in the same way token is sent
//     //         };
//     //         console.log("Header UserId download History", headers)
//     //         // Hit the API for download history (Sending userId in headers)
//     //         const historyResponse = await axios.post(
//     //             `${apiUrl}/timetrack/downloadHistory`,
//     //             {}, // Empty body
//     //             { headers } // Headers with userId as Authorization
//     //         );

//     //         console.log("Download History API Response:", historyResponse);

//     //         if (historyResponse.status === 200) {
//     //             console.log("Download history updated successfully.");
//     //         } else {
//     //             console.log("Failed to update download history", historyResponse);
//     //         }

//     //         // Fetch the file download URL
//     //         const res = await axios.get(`${apiUrl}/timetrack/updatedFile`);

//     //         if (res.status === 200) {
//     //             const url = res.data.data.url;
//     //             const anchor = document.createElement('a');
//     //             anchor.href = url;
//     //             anchor.download = 'screenshot-time.exe';

//     //             setTimeout(() => {
//     //                 setLoading1(false);
//     //                 setLoading2(false);
//     //             }, 1000);

//     //             document.body.appendChild(anchor);
//     //             anchor.click();
//     //             document.body.removeChild(anchor);
//     //         } else {
//     //             setLoading1(false);
//     //             setLoading2(false);
//     //             console.log("Download link error 1 =====>", res);
//     //         }
//     //     } catch (error) {
//     //         setLoading1(false);
//     //         setLoading2(false);
//     //         console.error("Download link error 2 =====>", error);
//     //     }
//     // };


//     const handleDownload = async (type) => {
//         console.log("Download Type:", type);
//         setLoading1(type === "WIN");
//         setLoading2(type === "MAC");

//         try {
//             // Retrieve token from localStorage
//             let token = localStorage.getItem("token");
//             let userId = null;

//             // Decode the token safely
//             if (token) {
//                 try {
//                     const decoded = jwtDecode(token); // ✅ Decode token
//                     userId = decoded?._id || decoded?.userId || null; // Extract userId
//                     console.log("🔹 Extracted userId from token:", userId);
//                 } catch (decodeError) {
//                     console.error("❌ Error decoding token:", decodeError);
//                     userId = null;
//                 }
//             }

//             // Validate userId retrieval
//             if (!userId || userId === "null" || userId === "undefined") {
//                 console.log("⚠️ userId is invalid or not set.");
//                 setLoading1(false);
//                 setLoading2(false);
//                 userId = null;
//             }

//             // Convert userId to a valid string (if needed)
//             userId = userId ? userId.toString().trim() : null;

//             // Log request payload
//             const requestData = { userId };
//             console.log("📌 Request Payload for Download History API:", requestData);

//             // Step 1: Send userId to `/timetrack/downloadHistory`
//             const historyResponse = await axios.post(
//                 `${apiUrl}/timetrack/downloadHistory`,
//                 requestData, // Send userId in body
//                 { headers: { "Content-Type": "application/json" } }
//             );

//             // Log API response
//             console.log("📌 Download History API Response:", historyResponse);

//             if (historyResponse.status !== 200) {
//                 console.error("❌ Failed to update download history", historyResponse);
//                 setLoading1(false);
//                 setLoading2(false);
//                 return;
//             }

//             console.log("✅ Download history updated successfully.");

//             // Step 2: Fetch the file download URL
//             console.log("⏳ Fetching download file URL...");
//             const res = await axios.get(`${apiUrl}/timetrack/updatedFile`);

//             // Log file API response
//             console.log("📌 File API Response:", res);

//             if (res.status === 200 && res.data.data?.url) {
//                 const url = res.data.data.url;
//                 console.log("✅ File URL received:", url);

//                 // Trigger file download
//                 const anchor = document.createElement("a");
//                 anchor.href = url;
//                 anchor.download = "screenshot-time.exe";

//                 document.body.appendChild(anchor);
//                 anchor.click();
//                 document.body.removeChild(anchor);

//                 console.log("🚀 File Download Triggered!");
//             } else {
//                 console.error("❌ Download link error:", res);
//             }
//         } catch (error) {
//             console.error("❌ Error in download process:", error);
//         } finally {
//             setLoading1(false);
//             setLoading2(false);
//         }
//     };



//     const handleClick = () => {
//         window.location.href = 'https://chromewebstore.google.com/detail/sstrack/gkmllhjndmaaapegaopkpapaamfaeckg?hl=en-US';
//     };
//     useEffect(() => {
//         window.scrollTo({
//             top: 0,
//             behavior: "smooth"
//         })
//     }, [])

//     console.log(loading1);

//     return (
//         <>
//             <Header />
//             <div className="container" style={{ borderRadius: '5%', marginTop: '5%', marginBottom: '5%' }}>
//                 <div className="card justify-content-between" style={{ width: '100%' }}>
//                     <div className='download-card-header'>
//                         <p>Download application</p>
//                     </div>
//                     <div className="card-body" style={{ padding: '3%' }}>
//                         <div className="row">
//                             <div className="col-lg-6">
//                                 <h4>Download employee desktop application for windows</h4>
//                                 <p>This application is <span style={{ fontWeight: "700", color: "#7ACB59" }}>for employees, managers</span></p>
//                                 <p>Company administrators can review the tracked hours and screenshots on this website.</p>
//                                 <img width={300} src={DownloadProduct} alt="" />
//                                 <br />
//                                 <br />
//                                 <h4>Description</h4>
//                                 <p>This is a Windows desktop application designed for employees. It allows an employee to start and stop tracking their work time and captures screenshots of their computer during work hours.</p>
//                                 <p>Once the stop button is activated, it ceases to take screenshots. Your work time and screenshots can be reviewed in My Home, where you also have the option to delete any screenshots.</p>
//                                 <br />
//                                 <h4>Post-installation</h4>
//                                 <p>Once the application is installed, launch it and click "Start" to begin monitoring your time and capturing screenshots.</p>
//                             </div>

//                             <div className="col-lg-6">
//                                 <div className="card w-100" style={{ width: '20rem', background: '#E1E1E1' }}>
//                                     <div className="card-body">
//                                         <p style={{ marginLeft: "-8px", color: 'black' }} className=' px-2 py-2 fs-5'>Need Windows Version ?</p>
//                                         <button style={{ backgroundColor: '#0e4772', padding: '2%', width: '50%', marginLeft: '0%' }} className={loading1 ? "disable-download-button" : "download-button"} disabled={loading1 ? true : false} onClick={() => handleDownload("WIN")}>
//                                             {loading1 ? "Downloading..." : (
//                                                 <>
//                                                     <BsWindows color="white" size={18} style={{ margin: "-5px 10px 0 0", color: 'white' }} />
//                                                     <span style={{ color: 'white' }}>Download for Windows</span>
//                                                 </>
//                                             )}
//                                         </button>
//                                         <p style={{ marginLeft: "-8px" }} className='px-2 py-2 fs-5'>Need Chrome Extension ?</p>
// <button style={{ backgroundColor: '#0e4772', padding: '2%', width: '50%', marginLeft: '0%' }}
//     className={loading2 ? "disable-download-button" : "download-button"}
//     disabled={loading2 ? true : false}
// onClick={handleClick}
// >
//     {loading2 ? "Downloading..." : (
//         <>
//             <BsGoogle color="white" size={18} style={{ margin: "-5px 10px 0 0" }} />
//             <span style={{ color: 'white' }}>Download Extension</span>
//         </>
//     )}
// </button>
//                                         <br />
//                                     </div>
//                                 </div>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </div>


//         </>
//     );
// }

// export default Download;
















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

    const handleToggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };
    const navigate = useNavigate();

    const [downloadOS, setDownloadOS] = useState("mac")
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

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
        navigate("/dashboard");
        window.location.reload();
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
                                {isArabic ? "تحميل " : "Download "}
                                <span style={{ color: "#7ACB59" }}>                                    {isArabic ? "تطبيق سطح المكتب" : "Desktop Application"}
                                </span> For{" "}
                                <span style={{ color: "#7ACB59" }}>Windows</span>
                            </h1>
                            <p style={{ color: "#6C757D", fontSize: "16px", marginTop: "1rem" }}>
                                {isArabic
                                    ? "يمكن لمسؤولي الشركة مراجعة الساعات المسجلة ولقطات الشاشة من خلال هذا الموقع."
                                    : "Company administrators can review the tracked hours and screenshots on this website."}

                            </p>
                            <div
                                className="d-flex gap-3"
                                style={{
                                    flexWrap: "wrap", // Ensures wrapping for smaller screens
                                    alignItems: "center", // Center items vertically
                                    justifyContent: "flex-start", // Align buttons to the left
                                }}
                            >
                                {/* Chrome Extension Button */}
                                <button
                                    style={{
                                        backgroundColor: loading2 ? '#6c757d' : 'black', // Grey when disabled
                                        padding: '2%',
                                        width: '30%',
                                        fontSize: '75%',
                                        marginLeft: '0%',
                                    }}
                                    className={loading2 ? "disable-download-button" : "download-button"}
                                    disabled={loading2 ? true : false}
                                    onClick={handleClick}
                                >
                                    {loading2 ? (
                                        "Downloading..."
                                    ) : (
                                        <>
                                            <img
                                                src={chromeImg} // Replace with the actual path to your downloaded Chrome icon
                                                alt="Chrome Icon"
                                                style={{
                                                    width: "20px", // Adjust the size of the icon
                                                    height: "20px", // Adjust the size of the icon
                                                    margin: "-5px 10px 0 0", // Match the previous margin style
                                                }}
                                            />
                                            <span style={{ color: 'white', fontSize: '-15%' }}>    {isArabic ? "تحميل الإضافة" : "Download Extension"}
                                            </span>

                                        </>
                                    )}
                                </button>

                                {/* Windows Button */}
                                <button
                                    style={{
                                        backgroundColor: loading1 ? '#6c757d' : 'black', // Grey when disabled
                                        padding: '2%',
                                        width: '40%',
                                        fontSize: '75%',
                                        cursor: loading1 ? 'not-allowed' : 'pointer', // No pointer when disabled
                                    }}
                                    className={loading1 ? "disable-download-button" : "download-button"}
                                    disabled={loading1} // Disable button when loading1 is true
                                    onClick={() => handleDownload("WIN")}
                                >
                                    {loading1 ? "Downloading..." : (
                                        <>
                                            <BsWindows color="#00ACEE" size={18} style={{ margin: "-5px 10px 0 0" }} />
                                            <span style={{ color: 'white' }}> {isArabic ? "تحميل لنظام ويندوز" : "Download for Windows"}
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <h4 style={{ marginTop: "2rem", color: "#0D4873" }}>Description</h4>
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
                                href="#"
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












// import React, { useEffect, useState } from 'react';
// import DownloadProduct from '../images/ss-track-banner.svg';
// import { BsWindows, BsApple, BsGoogle } from 'react-icons/bs'
// import axios from 'axios'

// const Download = () => {

//     const [downloadOS, setDownloadOS] = useState("mac")
//     const [loading1, setLoading1] = useState(false)
//     const [loading2, setLoading2] = useState(false)
//     const apiUrl = "https://myuniversallanguages.com:9093/api/v1";

//     const handleDownload = async (type) => {
//         console.log(type);
//         setLoading1(type === "WIN")
//         setLoading2(type === "MAC" || type === 'chrome')

//         try {
//             const res = await axios.get(`${apiUrl}/timetrack/updatedFile`)
//             if (res.status === 200) {
//                 var url = res.data.data.url;
//                 var anchor = document.createElement('a');
//                 anchor.href = url;
//                 anchor.download = 'screenshot-time.exe';
//                 setTimeout(() => {
//                     setLoading1(false)
//                     setLoading2(false)
//                 }, 1000)
//                 document.body.appendChild(anchor);
//                 anchor.click();
//                 document.body.removeChild(anchor);
//             }
//             else {
//                 setLoading1(false)
//                 setLoading2(false)
//                 console.log("download link error 1 =====>", res);
//             }
//         } catch (error) {
//             setLoading1(false)
//             setLoading2(false)
//             console.log("download link error 2 =====>", error);
//         }
//     }

//     useEffect(() => {
//         window.scrollTo({
//             top: 0,
//             behavior: "smooth"
//         })
//     }, [])

//     console.log(loading1);

//     return (
//         <>
//             <div className='download-container'>
//                 {/* <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                     <p className='download-title'>Download <span style={{ color: "#7ACB59" }}>sstrack.io</span></p>
//                     <p className='download-title'>Select Your Operating System</p>
//                     <div style={{ display: "flex", alignItems: "center" }}>
//                         <BsWindows color="white" size={70} />
//                         <BsApple color="white" size={70} style={{ marginLeft: 30 }} />
//                     </div>
//                 </div> */}
//                 <div className='download-main-section'>
//                     <div className='download-card-header'>
//                         <p>Download application</p>
//                     </div>
//                     <div className='download-card'>
//                         <div>
//                             {/* <h4>Download employee deskstop application for {downloadOS === "mac" ? "mac OS" : "windows"}</h4> */}
//                             <h4>Download employee desktop application for windows</h4>
//                             <p>This application is <span style={{ fontWeight: "700", color: "#7ACB59" }}>for employees, managers</span></p>
//                             <p>Company administrators can review the tracked hours and screenshots on this website.</p>
//                             <img width={300} src={DownloadProduct} alt="" />
//                             <div style={{ margin: "30px 0" }}>
//                                 <h4>Description</h4>
//                                 {/* <p>This is a {downloadOS === "mac" ? "mac OS" : "Windows"} desktop application for employess. it is started and stopped by an employee to track time and take their computer screenshot during work.</p> */}
//                                 <p>This is a Windows desktop application designed for employees. It allows an employee to start and stop tracking their work time and captures screenshots of their computer during work hours.</p>
//                                 <p>Once the stop button is activated, it ceases to take screenshots. Your work time and screenshots can be reviewed in My Home, where you also have the option to delete any screenshots.</p>
//                             </div>
//                             {/* <div style={{ margin: "30px 0" }}>
//                                 <h4>Installation Steps</h4>
//                                 <p>This is a Windows desktop application designed for employees. It allows an employee to start and stop tracking their work time and captures screenshots of their computer during work hours.</p>
//                                 <p>Once the stop button is activated, it ceases to take screenshots. Your work time and screenshots can be reviewed in My Home, where you also have the option to delete any screenshots.</p>
//                             </div> */}
//                             <div>
//                                 <h4>Post-installation</h4>
//                                 <p>Once the application is installed, launch it and click "Start" to begin monitoring your time and capturing screenshots.</p>
//                             </div>
//                         </div>
//                         <div className='download-action-container'>
//                             {/* {downloadOS === "windows" ? (
//                                 <div>
//                                     <p>Need mac version ?</p>
//                                     <button onClick={() => setDownloadOS("mac")}> <AiFillApple color="white" size={20} /> Download for mac </button>
//                                 </div>
//                             ) : ( */}
//                             <div>
//                                 <p>Need Windows Version ?</p>
//                                 <a className={loading1 ? "disable-download-button" : "download-button"} disabled={loading1 ? true : false} onClick={() => handleDownload("WIN")}>
//                                     Download for windows
//                                 </a>
//                                 <br />
//                                 <br />
//                                 <p>Need Linux Version ?</p>
//                                 <a className={loading2 ? "disable-download-button" : "download-button"} disabled={loading2 ? true : false} onClick={() => handleDownload("MAC")}>
//                                     Download Linux Application
//                                 </a>
//                                 <br />
//                                 <br />
//                                 <p>Need browser extension ?</p>
//                                 <a href="https://chromewebstore.google.com/detail/sstrack/gkmllhjndmaaapegaopkpapaamfaeckg?hl=en-US" className={loading2 ? "disable-download-button" : "download-button"} disabled={loading2 ? true : false} onClick={() => handleDownload("chrome")}>
//                                     Download extension
//                                 </a>
//                             </div>
//                             {/* )} */}
//                             {/* <div style={{ margin: "20px 0" }}>
//                                 <p>Need linux version ?</p>
//                                 <button> <FaUbuntu color="white" size={20} /> Download for linux </button>
//                             </div>
//                             <div>
//                                 <p>Need browser extension ?</p>
//                                 <button>Download extension</button>
//                             </div> */}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default Download;