import React, { useCallback, useRef } from "react";
import { useEffect, useState } from "react";
import logo from '../images/FooterLogo.png'
import { useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";

function CaptureScreen() {

    const [videoStream, setVideoStream] = useState(null);
    const [captureInterval, setCaptureInterval] = useState(null);
    const [type, setType] = useState("");
    const [totalInterval, setTotalInterval] = useState("");
    const [imgFile, setImgFile] = useState(null);
    const [modal, setModal] = useState({});
    const location = useLocation();
    const API_URL = "https://myuniversallanguages.com:9093/api/v1";
    // const API_URL = "https://zany-sneakers-hare.cyclic.cloud/api/v1";
    const user = JSON.parse(localStorage.getItem("items"))

    let token = localStorage.getItem('token');
    let headers = {
        Authorization: "Bearer " + token,
    }

    function getQueryParam(param) {
        const query = new URLSearchParams(location.search);
        return query.get(param);
    }

    const screenshotCapture = JSON.parse(getQueryParam('object'));
    // const sendScreenshotIntervalRef = useRef(null);

    useEffect(() => {
        const updateLocalStorageValue = () => {
            setType(localStorage.getItem("type"))
        };
        const intervalId = setInterval(updateLocalStorageValue, 1000);
        return () => clearInterval(intervalId);
    }, [type]);

    // const [percentage, setPercentage] = useState(localStorage.getItem('percentage') || '');

    // const updatePercentage = (newPercentage) => {
    //     setPercentage(newPercentage);
    //     localStorage.setItem('percentage', newPercentage);
    // };

    // const sendScreenshot = useCallback(async () => {
    //     console.log({
    //         activityPercentage: percentage,
    //         description: localStorage.getItem('activeTab'),
    //         description2: "Google chrome",
    //         startTime: new Date(),
    //         createdAt: new Date(),
    //         file: imgFile
    //     });
    //     try {
    //         const model = {
    //             activityPercentage: percentage,
    //             description: localStorage.getItem('activeTab'),
    //             description2: "Google chrome",
    //             startTime: new Date(),
    //             createdAt: new Date(),
    //             file: imgFile
    //         };
    //         const response = await fetch(`${API_URL}/timetrack/capture-screenshot/${screenshotCapture?.timeEntryId}/screenshots`, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 ...headers
    //             },
    //             method: "PATCH",
    //             mode: 'cors',
    //             body: JSON.stringify(model)
    //         });
    //         console.log("capture ss response", response);
    //     } catch (error) {
    //         console.error("Error in captureScreenshot:", error);
    //     }
    // }, [percentage, screenshotCapture?.timeEntryId, headers]);

    // const [lastScreenshotTime, setLastScreenshotTime] = useState(new Date());

    // useEffect(() => {
    //     let intervalId;
    //     console.log("Effect triggered. Type:", type);
    //     if (type === "startTimer") {
    //         intervalId = setInterval(() => {
    //             updatePercentage(localStorage.getItem('percentage'));
    //             // Check if 1 minute has passed and call sendScreenshot
    //             if (new Date() - lastScreenshotTime >= 120000) {
    //                 console.log("Sending screenshot...");
    //                 sendScreenshot();
    //                 setLastScreenshotTime(new Date()); // Update lastScreenshotTime
    //             }
    //         }, 5000);
    //     }
    //     // Cleanup function that runs when the component unmounts or when `type` changes
    //     return () => {
    //         console.log("Clearing interval...");
    //         clearInterval(intervalId);
    //     };
    // }, [sendScreenshot, type, lastScreenshotTime]);

    useEffect(() => {
        const token = screenshotCapture?.token;
        const decoded = jwtDecode(token);
        localStorage.setItem("items", JSON.stringify(decoded));
        localStorage.setItem("token", token);
        if (type === "startTimer") {
            const startScreenCapture = () => {
                if (videoStream) {
                    setCaptureInterval(
                        captureFrame(videoStream)
                            .then((base64Image) => {
                                const base64 = base64Image.split(',')[1];
                                localStorage.setItem("imgFile", base64)
                                const base64String = localStorage.getItem("imgFile");
                                const byteCharacters = atob(base64String);
                                const byteNumbers = new Array(byteCharacters.length);
                                for (let i = 0; i < byteCharacters.length; i++) {
                                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                                }
                                const byteArray = new Uint8Array(byteNumbers);
                                const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Adjust the MIME type if necessary
                                const imageUrl = URL.createObjectURL(blob);
                                setImgFile(imageUrl)
                                console.log({ imageUrl });
                            })
                            .catch((error) => console.error('Error capturing frame:', error))
                    );
                } else {
                    navigator.mediaDevices
                        .getDisplayMedia({ video: true })
                        .then((stream) => {
                            window.open(
                                user?.userType === "owner" ? "https://www.sstrack.io/company-owner" :
                                    user?.userType === "admin" ? "https://www.sstrack.io/admindashboard" :
                                        user?.userType === "user" ? "https://www.sstrack.io/userdashboard" : ""
                            )
                            setVideoStream(stream);
                            setCaptureInterval(
                                setInterval(() => {
                                    captureFrame(stream)
                                        .then((base64Image) => {
                                            const base64 = base64Image.split(',')[1];
                                            localStorage.setItem("imgFile", base64)
                                            const base64String = localStorage.getItem("imgFile");
                                            const byteCharacters = atob(base64String);
                                            const byteNumbers = new Array(byteCharacters.length);
                                            for (let i = 0; i < byteCharacters.length; i++) {
                                                byteNumbers[i] = byteCharacters.charCodeAt(i);
                                            }
                                            const byteArray = new Uint8Array(byteNumbers);
                                            const blob = new Blob([byteArray], { type: 'image/jpeg' }); // Adjust the MIME type if necessary
                                            const imageUrl = URL.createObjectURL(blob);
                                            console.log({ imageUrl });
                                            setImgFile(imageUrl)
                                        })
                                        .catch((error) => console.error('Error capturing frame:', error));
                                }, 10000)
                            );
                        })
                        .catch((error) => console.error('Error capturing screen:', error));
                }
            };
            const captureFrame = (stream, fileName) => {
                return new Promise((resolve, reject) => {
                    let video = document.createElement('video');
                    video.srcObject = stream;
                    video.play();
                    video.onloadedmetadata = () => {
                        let canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        let ctx = canvas.getContext('2d');
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        canvas.toBlob((blob) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                resolve(reader.result);
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        }, 'image/jpeg');
                    };
                });
            };
            startScreenCapture()
        }
        else if (type === "stopTimer") {
            const stopScreenCapture = () => {
                clearInterval(captureInterval);
                if (videoStream) {
                    let tracks = videoStream.getTracks();
                    tracks.forEach((track) => track.stop());
                    setVideoStream(null);
                }
            };
            stopScreenCapture()
        }
    }, [type])

    useEffect(() => {
        const updateTotalInterval = () => setTotalInterval(localStorage.getItem("totalInterval"));
        const intervalId = setInterval(updateTotalInterval, 1000);
        return () => clearInterval(intervalId);
    }, [type]);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100vh"
        }}>
            <div style={{ margin: "0 0 20px 0" }}>
                <img src={logo} />
            </div>
            <div>
                <p style={{ color: "white", fontSize: "35px", fontWeight: "700", margin: 0 }}>Please keep this tab open while capture screenshot</p>
            </div>
            <div>
                <p style={{ color: "white", fontSize: "28px", fontWeight: "500", margin: 0 }}>Please keep this tab open while capture screenshot</p>
            </div>
        </div>
    )
}

export default CaptureScreen;


