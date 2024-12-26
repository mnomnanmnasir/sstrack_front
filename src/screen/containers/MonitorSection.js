import React, { useEffect, useRef, useState } from "react";
import ss1 from '../../images/capture-1.png';
import ss2 from '../../images/capture-2.png';
import ss3 from '../../images/capture-3.png';
import ss4 from '../../images/ZKTeco-G3-Multi-Biometric-Time-Attendance.png';


const Monitor = () => {
  const section1Ref = useRef(null);

    return (
        <>
            <p className='ethical' id="section1" ref={section1Ref}>Monitor employee hours and screen captures online.</p>
            <p className='employee'>Discover how much time and money your remote or office team dedicates to each task.</p>
            <div clasName="container" style={{ padding: '20px 20px' }}>
                <div className="row justify-content-center align-items-center">
                    <div className="card m-3" style={{ width: '22rem', height: "35rem", backgroundColor: '#0E4772', borderRadius: "1rem" }}>
                        <div className="d-flex justify-content-center">
                            <img
                                src={ss1}
                                alt=""
                                style={{
                                    width: "180px",
                                    height: "170px",
                                    borderRadius: "100%",
                                    objectFit: "cover",
                                    border: "10px solid #7ACB59",
                                    marginTop: '8%'
                                }}
                            />
                        </div>
                        <br />
                        <div className="card-body">
                            <h5 className="card-title text-center fw-bold fs-4" style={{ color: '#FFF' }}>Manage employee time logs and screen captures digitally.</h5>
                            <br />
                            <br />
                            <p className="card-text text-center" style={{ color: '#FFF' }}>Employees independently manage the start and stop of their tracking using a streamlined desktop app.</p>
                        </div>
                    </div>


                    {/* ------------------------------ pricing card 2 ------------------------- */}

                    <div className="card m-3" style={{ width: '22rem', height: "35rem", backgroundColor: '#0E4772', borderRadius: "1rem" }}>
                        <div className="d-flex justify-content-center">
                            <img
                                src={ss4}
                                alt=""
                                style={{
                                    width: "180px",
                                    height: "170px",
                                    borderRadius: "100%",
                                    objectFit: "cover",
                                    border: "10px solid #7ACB59",
                                    marginTop: '8%'
                                }}
                            />
                        </div>
                        <br />
                        <div className="card-body">

                            <h5 className="card-title text-center fw-bold fs-4" style={{ color: '#FFF' }}>Integrate with punch and entry systems</h5>
                            <br />
                            <br />
                            <p className="card-text text-center" style={{ color: '#FFF', paddingTop: '10%' }}>Seamlessly integrate with punch systems and entry/exit control mechanisms for a streamlined workflow.</p>

                        </div>
                    </div>

                    {/* ------------------------------ pricing card 3 ------------------------- */}

                    <div className="card m-3" style={{ width: '22rem', height: "35rem", backgroundColor: '#0E4772', borderRadius: "1rem" }}>
                        <div className="d-flex justify-content-center">
                            <img
                                src={ss2}
                                alt=""
                                style={{
                                    width: "180px",
                                    height: "170px",
                                    borderRadius: "100%",
                                    objectFit: "cover",
                                    border: "10px solid #7ACB59",
                                    marginTop: '8%'
                                }}
                            />
                        </div>
                        <br />
                        <div className="card-body">

                            <h5 className="card-title text-center fw-bold fs-4" style={{ color: '#FFF' }}>Access it online</h5>
                            <br />
                            <br />
                            <p className="card-text text-center" style={{ color: '#FFF', paddingTop: '20%' }}>Access tools for real-time tracking across devices and gain insights to improve efficiency.</p>

                        </div>
                    </div>
                   
                   
                    <div className="card m-3" style={{ width: '22rem', height: "35rem", backgroundColor: '#0E4772', borderRadius: "1rem" }}>
                        <div className="d-flex justify-content-center">
                            <img
                                src={ss3}
                                alt=""
                                style={{
                                    width: "180px",
                                    height: "170px",
                                    borderRadius: "100%",
                                    objectFit: "cover",
                                    border: "10px solid #7ACB59",
                                    marginTop: '8%'
                                }}
                            />
                        </div>
                        <br />
                        <div className="card-body">

                            <h5 className="card-title text-center fw-bold fs-4" style={{ color: '#FFF' }}>Get insights</h5>
                            <br />
                            <br />
                            <p className="card-text text-center" style={{ color: '#FFF', paddingTop: '20%' }}>Track outdoor sales teams or use the app as a punch system that starts and stops clocks based on location while ensuring pay begins only when work starts.</p>

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}



export default Monitor;