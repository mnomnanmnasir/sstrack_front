import React, { useEffect, useRef, useState } from "react";
import { TbSquareRoundedArrowRightFilled } from 'react-icons/tb'


import NewHeader from "./component/Header/NewHeader";

function PrivacyPolicy() {
  return (
    <section>

      <NewHeader language={'en'} show={true} />

      <div className="container" id="section4">

        <div className="trialDiv">
          <div className="employeesDiv" style={{ marginBottom: 50 }}>
            <p className='ethical'>Privacy Policy</p>
            <p className='employees'>This Privacy Policy outlines the manner in which SSTrack collects, uses, maintains, and discloses information collected from users.</p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
              <button
                style={{
                  backgroundColor: "#28659C",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() =>
                  window.open("https://i8is.io/wp-content/uploads/2025/03/Mastering-Privacy-with-SS-Track_-Your-Control-Your-Choice-1.mp4", "_blank")
                }
              >
                Click Here
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
            <div>
              <p className="features-title"> 1. Information Collection <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
              <p className="unitedFont">The Application may collect personal identification information from Users in various ways, including but not limited to, when Users visit our app, register on the app, fill out a form, respond to a survey, and in connection with other activities, services, features, or resources we make available in our app. Users may be asked for, as appropriate, name, email address, mailing address, phone number. Users may, however, visit our app anonymously. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain app-related activities.</p>
            </div>
            <div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
            <div>
              <p className="features-title"> 2. Non-personal Identification Information <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
              <p className="unitedFont">The Application may collect non-personal identification information about Users whenever they interact with our app. Non-personal identification information may include the browser name, the type of computer, and technical information about Users' means of connection to our app, such as the operating system and the Internet service providers utilized and other similar information.</p>
            </div>
            <div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
            <div>
              <p className="features-title"> 3. How We Use Collected Information <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
              <p className="unitedFont">The Application may collect and use Users' personal information for the following purposes.</p>
              <p className="unitedFont">- To improve customer service</p>
              <p className="unitedFont">- To personalize user experience</p>
              <p className="unitedFont">- To improve our app</p>
              <p className="unitedFont">- To send periodic emails</p>
              <p className="unitedFont">- We may use the email address to respond to their inquiries, questions, and/or other requests.</p>
              <p className="unitedFont">- To enhance location-based services and operational efficiency for outdoor activities.</p>

            </div>
            <div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
            <div>
              <p className="features-title"> 4. How We Protect Your Information <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
              <p className="unitedFont">We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, username, password, transaction information, and data stored in our app.</p>
            </div>
            <div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
            <div>
              <p className="features-title"> 5. Sharing Your Personal Information <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
              <p className="unitedFont">We do not sell, trade, or rent Users' personal identification information to others.</p>
              <p className="unitedFont"> Location data will not be sold, traded, or rented to others. It is shared only with the User’s employer as necessary for monitoring outdoor work activities, as permitted by applicable law.
              </p>
            </div>
            <div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
            <div>
              <p className="features-title">6. Changes to This Privacy Policy <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
              <p className="unitedFont">The Application has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.</p>
              <p className="unitedFont">   This Privacy Policy may be updated to reflect changes in location tracking practices or other features of the app. Users will be notified of significant changes, particularly those related to location tracking.
              </p>
            </div>
            <div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
            <div>
              <p className="features-title">7. Your Acceptance of These Terms <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
              <p className="unitedFont">By using this app, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our app. Your continued use of the app following the posting of changes to this policy will be deemed your acceptance of those changes</p>
            </div>
            <div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
            <div>
              <p className="features-title">8. Contacting Us <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
              <p className="unitedFont">If you have any questions about this Privacy Policy, the practices of this app, or your dealings with this app, please contact us at info@SSTRACK.IO.</p>
            </div>
            <div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
            <div>
              <p className="features-title">9. Location Tracking <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
              <ul>
                <li>
                  <p className="unitedFont">Purpose of Location Tracking: <br />
                    The SSTrack mobile application includes a location tracking feature designed for employees who work outdoors. This feature is used to monitor outdoor activities, enhance location-based services, and improve operational efficiency for employers. Location tracking is integral to the app’s functionality, especially in a work environment where outdoor tracking is necessary.</p>
                </li>
                <br />
                <li>
                  <p className="unitedFont">User Consent:
                    <br />
                    Location tracking begins only after the User consents by pressing the "Start Tracking" button within the app. Users have the ability to stop tracking at any time by pressing the "Stop Tracking" button. The app will notify the User when location tracking is active.</p>
                </li>
                <br />
                <li>
                  <p className="unitedFont">Background Location Tracking:
                    <br />
                    To provide continuous monitoring services essential for outdoor work activities, the app may continue to track the User's location even when the app is running in the background. This ensures that the tracking is uninterrupted, supporting the app's primary function in outdoor work environments.</p>
                </li>
                <br />
                <li>
                  <p className="unitedFont">Data Usage and Retention:
                    <br />
                    The location data collected is used exclusively for the purposes outlined above and is retained only as long as necessary to fulfill these purposes. The data will be handled in compliance with our data protection policies and applicable laws.</p>
                </li>
              </ul>
            </div>
            <div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )

}

export default PrivacyPolicy;