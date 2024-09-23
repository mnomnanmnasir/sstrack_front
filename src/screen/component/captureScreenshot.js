import React, { useEffect, useState } from 'react';

export const CaptureScreenshot = () => {

    const [isCapturing, setIsCapturing] = useState(false);
    const [screenshotCount, setScreenshotCount] = useState(0);
    const [videoStream, setVideoStream] = useState(null);
    const [captureInterval, setCaptureInterval] = useState(null);

    const startScreenCapture = () => {
        if (videoStream) {
            setCaptureInterval(
                setInterval(() => {
                    captureFrame(videoStream)
                        .then((base64Image) => {
                            const base64 = base64Image.split(',')[1];
                            // Do something with the base64 image data
                        })
                        .catch((error) => console.error('Error capturing frame:', error));
                }, 60000)
            );
        } else {
            navigator.mediaDevices
                .getDisplayMedia({ video: true })
                .then((stream) => {
                    setVideoStream(stream);
                    setCaptureInterval(
                        setInterval(() => {
                            captureFrame(stream)
                                .then((base64Image) => {
                                    const base64 = base64Image.split(',')[1];
                                    // Do something with the base64 image data
                                })
                                .catch((error) => console.error('Error capturing frame:', error));
                        }, 60000)
                    );
                })
                .catch((error) => console.error('Error capturing screen:', error));
        }
    };
    const stopScreenCapture = () => {
        clearInterval(captureInterval);
        if (videoStream) {
            let tracks = videoStream.getTracks();
            tracks.forEach((track) => track.stop());
            setVideoStream(null);
        }
    };
    const captureFrame = (stream) => {
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
                canvas.toBlob(
                    (blob) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    },
                    'image/jpeg'
                );
            };
        });
    };
    const downloadBlob = (blob) => {
        setScreenshotCount((prevCount) => prevCount + 1);
        const filename = `screenshot_${screenshotCount}.png`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };
}