
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
      <div className="mobhayat">
        <div className="container">
          <div className="userHeader">
            <div>
              <h5>How it Works</h5>
            </div>
            <div className="headerTop">
              {/* <h6>All times are UTC {formattedOffset}</h6> */}
              {/* <img src={setting} alt="setting.png" style={{ cursor: "pointer" }} onClick={() => navigate("/account")} /> */}
            </div>
          </div>
          <div className="userDashboardContainer d-flex gap-3 text-center align-items-center justify-content-center">

            <div className='how-it-works-container mb-5' id='section4' style={{ marginTop: '4%' }}>
              <div className='container jusitfy-content-center'>
                {/* <p className="how-it-works-title text-center text-white">How It Works ?</p>
                <p className="text-center text-white">Follow These 3 Sample Steps</p>
 */}
                {/* <div className="container my-5 position-relative" style={{ overflow: "hidden" }}> */}
                {/* Dotted Line SVG */}
                {/* <svg
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
                </svg> */}

                  <div className="row align-items-center">
                    {/* Left Side - Text Content */}
                    <div className="col-12 col-md-6 text-md-start mb-4 mb-md-0">
                      <h5 className="fw-bold text-success">Step 1: Manager Invites Employees</h5>
                      <p className="text-muted">
                        After selecting a plan, a company manager invites employees to join the company team.
                      </p>
                    </div>

                    {/* Right Side - Invite Box */}
                    <div className="col-12 col-md-6 text-center text-md-start mb-4 mb-md-0">
                    <img src={Image3} alt="Invite Employees" className="img-fluid rounded shadow" />
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div > */}
      {/* </div > */}
    </>
  )
}

export default workCards;