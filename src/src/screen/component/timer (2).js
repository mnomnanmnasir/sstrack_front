import React, { useEffect, useState } from 'react';

const Timer = () => {

    const [sec, setSec] = useState(59)
    const [minutes, setMinutes] = useState(0)
    const [hour, setHour] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setSec(prevSec => prevSec - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (sec === 0) {
            setSec(59)
        }
    }, [sec])

    // useEffect(() => {
    //     if (minutes >= 59) {
    //         setMinutes(0)
    //         setHour(hour + 1)
    //     }
    // }, [minutes])

    console.log("seconds", sec);

    return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                width: "60px",
                height: "60px",
                borderRadius: "100%",
                backgroundColor: "#0E4772"
            }}>
                <p style={{ fontWeight: "500", fontSize: "32px", margin: 0, color: "white" }}>{sec < 10 ? "0" + sec : sec}</p>
                {/* <p style={{ marginLeft: "5px", marginRight: "5px", fontWeight: "600", fontSize: "22px" }}>:</p> */}
                {/* <p style={{ fontWeight: "600", fontSize: "22px" }}>{minutes < 10 ? "0" + minutes : minutes}</p>
                <p style={{ marginLeft: "5px", marginRight: "5px", fontWeight: "600", fontSize: "22px" }}>:</p>
                <p style={{ fontWeight: "600", fontSize: "22px" }}>{hour < 10 ? "0" + hour : hour}</p> */}
            </div>
        </div>
    );
}

export default Timer;
