import React, { useEffect, useRef, useState } from "react";
import { TbSquareRoundedArrowRightFilled } from 'react-icons/tb'
import privacyPolicy from '../images/privacy-policy.svg'
import privacyPolicy2 from '../images/privacy-2.jpg'

function PrivacyPolicy() {
  return (
      <section>
        <div className="container">
          <div className="trialDiv">
          <div className="employeesDiv" style={{marginBottom:100}}>
            <p className='ethical'>Privacy Policy</p>
            <p className='employees'>This Privacy Policy outlines the manner in which SSTRACK collects, uses, maintains, and discloses information collected from users.</p>
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
              </div>
              <div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
              <div>
                <p className="features-title">6. Changes to This Privacy Policy <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                <p className="unitedFont">The Application has the discretion to update this privacy policy at any time. When we do, we will revise the updated date at the bottom of this page. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.</p>
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
            
          </div>
        </div>
      </section>
  )

}

export default PrivacyPolicy;