
import React, { useEffect, useState } from "react";
import card1 from '../images/card1.gif'
import card2 from '../images/card2.gif'
import card3 from '../images/card3.gif'
import screenShot from '../images/screenshot2.jpg'
import screenShot4 from '../images/screenShot4.JPG'
import screenshot5 from '../images/screenshot5.jpg'
import screenShot1 from '../images/screenShot1.jpg'
import screenShot3 from '../images/screenShot3.jpg'
import screenShot6 from '../images/screenShot6.jpg'



const workCards = () => {
    return (
        <>
            <div className='container mt-5 mb-4' id="section4">

                <div className='how-it-works-container mb-5' id='section4' style={{ marginTop: '4%' }}>
                    <div className='container jusitfy-content-center'>
                        <p className="how-it-works-title text-center text-white">How It Works ?</p>
                        <p className="text-center text-white">Follow These 3 Sample Steps</p>


                        <div className="row justify-content-center">
                            <div className="col-md-5 col-sm-12 col-lg-6" style={{ borderRight: '2px solid #bfb4b4' }}>
                                <div className="card mx-auto" style={{ width: "18rem", width: '100%' }}>
                                    <img
                                        src={card3}
                                        className="card-img-top"
                                        alt=""
                                        style={{ width: '80px', height: '70px', marginLeft: 'auto', display: 'block' }}
                                    />
                                    <div className="card-body">
                                        <span className="text-end">
                                            <p className="card-text fw-bold text-end" style={{ textAlign: 'left', fontSize: "20px", color: "#0E4772" }}>
                                                <span style={{ color: "#7ACB59" }}>sstrack.io</span>
                                                - Connecting & Setup
                                            </p>
                                        </span>
                                        <p className="text-end" style={{ fontSize: "20px", color: "#0E4772", fontWeight: 500, marginTop: '4%' }}>
                                            After selecting a plan, a company manager invites employees to the SS Track team. When employees accept the invitation, they can start tracking time and submitting their screenshots for that company.
                                        </p>
                                        <img
                                            src={screenShot1}
                                            className="card-img-bottom flex-end insideCardSS"
                                            alt=""
                                            style={{
                                                width: '300px', height: '150px',
                                                float: 'right',  // Add float property to move image to the right
                                                marginLeft: '1%', // Adjust margin if needed
                                                borderRadius: '5%',
                                                border: '5px solid #d3dbd5'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5 col-sm-12 col-lg-6 mb-3" >
                                <div style={{ width: "18rem", textAlign: 'center' }}>
                                    <p className="text-start" style={{ fontSize: "35px", color: "#FFF", fontWeight: 700, marginTop: '4%' }}>
                                        1st
                                    </p>
                                    <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                                        Setting Up SSTrack
                                    </p>
                                </div>
                            </div>
                        </div>


                        <div className="row justify-content-center">
                            {/* <div className="col-md-5 col-sm-12 col-lg-4 mb-3">
          <div style={{ width: "18rem", textAlign: 'center' }}>
              <p className="text-end" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                1st
              </p>
              <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                Setting Up SSTrack
              </p>
            </div>
          </div> */}
                            <div className="col-md-5 col-sm-12 col-lg-6" style={{ borderRight: '2px solid #bfb4b4' }}>
                                <div className=" mx-auto" style={{ width: "18rem", width: '100%', marginRight: '2px solid #bfb4b4' }}>
                                    <p className="text-end" style={{ fontSize: "35px", color: "#FFF", fontWeight: 700, marginTop: '4%' }}>
                                        2nd
                                    </p>
                                    <p className="text-end" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-5%' }}>
                                        Real-Time Tracking & Monitoring
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-5 col-sm-12 col-lg-6 mb-3" style={{ marginLeft: '1px solid #FFF' }}>
                                <div className="card mx-auto" style={{ width: "18rem", width: '100%' }}>
                                    <img
                                        src={card2}
                                        className="card-img-top flex-start"
                                        alt=""
                                        style={{ width: '80px', height: '70px', marginLeft: '7%', display: 'block' }}
                                    />
                                    <div className="card-body">
                                        <span className="text-start">
                                            <p className="card-text fw-bold text-start" style={{ textAlign: 'left', fontSize: "20px", color: "#0E4772" }}>
                                                Real-Time Tracking & Monitoring -
                                                <span style={{ color: "#7ACB59" }}>sstrack.io</span>
                                            </p>
                                        </span>
                                        <p className="text-start" style={{ fontSize: "20px", color: "#0E4772", fontWeight: 500, marginTop: '4%' }}>
                                            Employees install the SS Track desktop application, log in, select a project, and press the Start button to begin tracking time and taking screenshots. The application functions offline, and data is uploaded to the web once the internet connection is restored.
                                        </p>
                                        <img
                                            src={screenShot}
                                            className="card-img-top flex-start insideCardSS"
                                            alt=""
                                            style={{ width: '300px', height: '150px', marginLeft: '1%', display: 'block', borderRadius: '5%', border: '5px solid #d3dbd5' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-md-5 col-sm-12 col-lg-6" style={{ borderRight: '2px solid #bfb4b4' }}>
                                <div className="card mx-auto" style={{ width: "18rem", width: '100%' }}>
                                    <img
                                        src={card3}
                                        className="card-img-top"
                                        alt=""
                                        style={{ width: '80px', height: '70px', marginLeft: 'auto', display: 'block' }}
                                    />
                                    <div className="card-body">
                                        <span className="text-end">
                                            <p className="card-text fw-bold text-end" style={{ textAlign: 'left', fontSize: "20px", color: "#0E4772" }}>
                                                <span style={{ color: "#7ACB59" }}>sstrack.io</span>
                                                - Connecting & Setup
                                            </p>
                                        </span>
                                        <p className="text-end" style={{ fontSize: "20px", color: "#0E4772", fontWeight: 500, marginTop: '4%' }}>
                                            The SS Track application tracks employee time and takes screenshots at random intervals until the Stop button is pressed. With the Autostart option, the program starts with computer use and stops if inactive, ideal for in-office tracking. Employees are always aware SS Track is running, as it cannot operate in stealth mode.
                                        </p>
                                        <img
                                            src={screenShot3}
                                            className="card-img-bottom flex-end insideCardSS"
                                            alt=""
                                            style={{
                                                width: '300px', height: '150px',
                                                float: 'right',  // Add float property to move image to the right
                                                marginLeft: '1%', // Adjust margin if needed
                                                borderRadius: '5%',
                                                border: '5px solid #d3dbd5'
                                            }}
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5 col-sm-12 col-lg-6 mb-3" >
                                <div style={{ width: "18rem", textAlign: 'center' }}>
                                    <p className="text-start" style={{ fontSize: "35px", color: "#FFF", fontWeight: 700, marginTop: '4%' }}>
                                        3rd
                                    </p>
                                    <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                                        Setting Up SSTrack
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            {/* <div className="col-md-5 col-sm-12 col-lg-4 mb-3">
          <div style={{ width: "18rem", textAlign: 'center' }}>
              <p className="text-end" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                1st
              </p>
              <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                Setting Up SSTrack
              </p>
            </div>
          </div> */}
                            <div className="col-md-5 col-sm-12 col-lg-6" style={{ borderRight: '2px solid #bfb4b4' }}>
                                <div className=" mx-auto" style={{ width: "18rem", width: '100%', marginRight: '2px solid #bfb4b4' }}>
                                    <p className="text-end" style={{ fontSize: "35px", color: "#FFF", fontWeight: 700, marginTop: '4%' }}>
                                        4th
                                    </p>
                                    <p className="text-end" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-5%' }}>
                                        Real-Time Tracking & Monitoring
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-5 col-sm-12 col-lg-6 mb-3" style={{ marginLeft: '1px solid #FFF' }}>
                                <div className="card mx-auto" style={{ width: "18rem", width: '100%' }}>
                                    {/* <img
                  src={card2}
                  className="card-img-top flex-start"
                  alt=""
                  style={{ width: '80px', height: '70px', marginLeft: '7%', display: 'block' }}
                /> */}
                                    <div className="card-body">
                                        <img
                                            src={card1}
                                            className="card-img-top flex-start"
                                            alt=""
                                            style={{ width: '80px', height: '70px', marginLeft: '7%', display: 'block' }}
                                        />
                                        <br />
                                        <span className="text-start">
                                            <p className="card-text fw-bold text-start" style={{ textAlign: 'left', fontSize: "20px", color: "#0E4772" }}>
                                                Real-Time Tracking & Monitoring -
                                                <span style={{ color: "#7ACB59" }}>sstrack.io</span>
                                            </p>
                                        </span>
                                        <p className="text-start" style={{ fontSize: "20px", color: "#0E4772", fontWeight: 500, marginTop: '4%' }}>
                                            The SS Track app sends time tracking data and screenshots to the web, allowing real-time monitoring by managers. Managers can view all information online without installation. The dashboard displays work times, current activity, and recent screenshots.
                                        </p>
                                        <img
                                            src={screenShot4}
                                            className="card-img-top flex-start insideCardSS"
                                            alt=""
                                            style={{ width: '300px', height: '150px', marginLeft: '1%', display: 'block', borderRadius: '5%', border: '5px solid #d3dbd5' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-md-5 col-sm-12 col-lg-6" style={{ borderRight: '2px solid #bfb4b4' }}>
                                <div className="card mx-auto" style={{ width: "18rem", width: '100%' }}>
                                    {/* <img
                  src={card1}
                  className="card-img-top"
                  alt=""
                  style={{ width: '80px', height: '70px', marginLeft: 'auto', display: 'block' }}
                /> */}
                                    <div className="card-body">
                                        <img
                                            src={card2}
                                            className="card-img-top"
                                            alt=""
                                            style={{ width: '80px', height: '70px', marginLeft: 'auto', display: 'block' }}
                                        />
                                        <span className="text-end">
                                            <p className="card-text fw-bold text-end" style={{ textAlign: 'left', fontSize: "20px", color: "#0E4772" }}>
                                                <span style={{ color: "#7ACB59" }}>sstrack.io</span>
                                                - Connecting & Setup
                                            </p>
                                        </span>
                                        <p className="text-end" style={{ fontSize: "20px", color: "#0E4772", fontWeight: 500, marginTop: '4%' }}>
                                            SSTrack provides detailed insights into employee productivity, including time and cost tracking for projects and tasks, user activity levels, application usage, website visits, and random screenshots captured up to 30 times per hour. Employees can also manually log offline time for accurate work hour monitoring.
                                        </p>
                                        <img
                                            src={screenshot5}
                                            className="card-img-bottom flex-end insideCardSS"
                                            alt=""
                                            style={{
                                                width: '300px', height: '150px',
                                                float: 'right',  // Add float property to move image to the right
                                                marginLeft: '1%', // Adjust margin if needed
                                                borderRadius: '5%',
                                                border: '5px solid #d3dbd5'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5 col-sm-12 col-lg-6 mb-3" >
                                <div style={{ width: "18rem", textAlign: 'center' }}>
                                    <p className="text-start" style={{ fontSize: "35px", color: "#FFF", fontWeight: 700, marginTop: '4%' }}>
                                        5th
                                    </p>
                                    <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                                        Setting Up SSTrack
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            {/* <div className="col-md-5 col-sm-12 col-lg-4 mb-3">
          <div style={{ width: "18rem", textAlign: 'center' }}>
              <p className="text-end" style={{ fontSize: "35px", color: "#0E4772", fontWeight: 700, marginTop: '4%' }}>
                1st
              </p>
              <p className="text-start" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-8%', marginLeft: '3px' }}>
                Setting Up SSTrack
              </p>
            </div>
          </div> */}
                            <div className="col-md-5 col-sm-12 col-lg-6" style={{ borderRight: '2px solid #bfb4b4' }}>
                                <div className=" mx-auto" style={{ width: "18rem", width: '100%', marginRight: '2px solid #bfb4b4' }}>

                                    <p className="text-end" style={{ fontSize: "35px", color: "#FFF", fontWeight: 700, marginTop: '4%' }}>
                                        6th
                                    </p>
                                    <p className="text-end" style={{ fontSize: "12px", color: "#7ACB59", fontWeight: 500, marginTop: '-5%' }}>
                                        Real-Time Tracking & Monitoring
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-5 col-sm-12 col-lg-6 mb-3" style={{ marginLeft: '1px solid #FFF' }}>
                                <div className="card mx-auto" style={{ width: "18rem", width: '100%' }}>
                                    <img
                                        src={card3}
                                        className="card-img-top flex-start"
                                        alt=""
                                        style={{ width: '80px', height: '70px', marginLeft: '7%', display: 'block' }}
                                    />
                                    <div className="card-body">

                                        <span className="text-start">

                                            <p className="card-text fw-bold text-start" style={{ textAlign: 'left', fontSize: "20px", color: "#0E4772" }}>
                                                Real-Time Tracking & Monitoring -
                                                <span style={{ color: "#7ACB59" }}>sstrack.io</span>
                                            </p>
                                        </span>
                                        <p className="text-start" style={{ fontSize: "20px", color: "#0E4772", fontWeight: 500, marginTop: '4%' }}>
                                            SSTrack provides detailed insights into team task management and expenses. Easily select employees, use date ranges, view summaries or detailed time-sheets, and export data to Excel. Employees can access their reports for invoicing with ease.
                                        </p>
                                        <img
                                            src={screenShot6}
                                            className="card-img-top flex-start insideCardSS"
                                            alt=""
                                            style={{ width: '300px', height: '150px', marginLeft: '1%', display: 'block', borderRadius: '5%', border: '5px solid #d3dbd5' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default workCards;