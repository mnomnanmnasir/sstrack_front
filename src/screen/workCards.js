
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
import Image1 from '../images/howItWork-Image1 (1).png'
import Image2 from '../images/howItWork-Image2 (1).png'
import Image3 from '../images/howItWork-Image3 (1).png'


const workCards = () => {
    return (
        <>
            <div className='container mt-5 mb-4' id="section4">

                <div className='how-it-works-container mb-5' id='section4' style={{ marginTop: '4%' }}>
                    <div className='container jusitfy-content-center'>
                        <p className="how-it-works-title text-center text-white">How It Works ?</p>
                        <p className="text-center text-white">Follow These 3 Sample Steps</p>


                   

          {/* <div className="container my-5 position-relative" style={{ overflow: "hidden" }}> */}
          {/* Dotted Line SVG */}
          <svg
            className="dotted-line"
            width="100%"
            height="300px"
            style={{
              position: "absolute",
              top: "50%",
              left: "0",
              zIndex: 0,
              transform: "translateY(-50%)",
            }}
          >
            <path
              d="M150 150 Q400 50 650 150 T1150 150"
              stroke="#ccc"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
          </svg>

          <div className="row text-center align-items-center position-relative" style={{ marginTop: '-5%', zIndex: 1 }}>
            {/* Step 1 */}
            <div className="col-12 col-md-6 col-lg-4 mb-4">
              <div style={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <div className="card-body p-0">
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      borderRadius: "50%",
                      padding: "20px",
                    }}
                  >
                    <img
                      className="card-img-top mb-3 mt-2"
                      src={Image1}
                      alt="Step 1"
                      style={{ borderRadius: "1rem" }}
                    />
                  </div>
                  <h5 className="card-title" style={{color: '#7ACB59', marginTop: '-7%', fontSize: '25px', fontWeight: 'bold' }}>Step 1: Sign Up</h5>
                  <p className="card-text text-white">Get started in minutes—email verification is all it takes.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-12 col-md-6 col-lg-4 mb-4 mt-3">
              <div style={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <div className="card-body p-0">
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      borderRadius: "50%",
                      padding: "20px",
                    }}
                  >
                    <img
                      className="card-img-top mb-3 mt-2"
                      src={Image2}
                      alt="Step 2"
                      style={{ borderRadius: "1rem" }}
                    />
                  </div>
                  <h5 className="card-title" style={{ marginTop: '5px', fontSize: '25px', fontWeight: 'bold', color: '#7ACB59' }}>Step 2: Precision Tools</h5>
                  <p className="card-text text-white">
                  From real-time tracking to screenshot management, ssTrack.io delivers unmatched control.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-12 col-md-6 col-lg-4 mb-4">
              <div style={{ backgroundColor: "transparent", boxShadow: "none" }}>
                <div className="card-body p-0">
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      borderRadius: "50%",
                      padding: "20px",
                    }}
                  >
                    <img
                      className="card-img-top mb-3 mt-2"
                      src={Image3}
                      alt="Step 3"
                      style={{ borderRadius: "1rem" }}
                    />
                  </div>
                  <h5 className="card-title" style={{ marginTop: '-5%', fontSize: '25px', fontWeight: 'bold', color: '#7ACB59' }}>Step 3: Analyze & Optimize</h5>
                  <p className="card-text text-white">
                    Add multiple cards and track your daily expense with a quality interface.
                  </p>
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