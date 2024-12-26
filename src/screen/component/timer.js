import React, { useEffect, useState } from "react";

const Timer = ({ timerActive }) => {
    const [sec, setSec] = useState(59);

    useEffect(() => {
        let timer;
        if (timerActive) {
            setSec(59); // Reset timer to 59 seconds
            timer = setInterval(() => {
                setSec((prevSec) => {
                    if (prevSec <= 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prevSec - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [timerActive]); // Restart the timer when `timerActive` changes

    return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    width: "60px",
                    height: "60px",
                    borderRadius: "100%",
                    backgroundColor: "#0E4772",
                }}
            >
                <p
                    style={{
                        fontWeight: "500",
                        fontSize: "32px",
                        margin: 0,
                        color: "white",
                    }}
                >
                    {sec < 10 ? "0" + sec : sec}
                </p>
            </div>
        </div>
    );
};

export default Timer;
