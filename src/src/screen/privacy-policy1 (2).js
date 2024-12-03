import React, { useEffect, useRef, useState } from "react";
import { TbSquareRoundedArrowRightFilled } from 'react-icons/tb'
import privacyPolicy from '../images/privacy-policy.svg'
import privacyPolicy2 from '../images/privacy-2.jpg'

function PrivacyPolicy() {
  return (
      <section>
          <div className="trialDiv">
          <div className="employeesDiv" style={{marginBottom:100}}>
            <p className='ethical'>Privacy Policy</p>
            <p className='employees'>This Privacy Policy outlines the manner in which SS Track collects, uses, maintains, and discloses information collected from users.</p>
          </div>

            <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
              <div>
                <p className="features-title"> 1. Information Collection <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                <p className="unitedFont">We collect information to improve our services, excluding sensitive personal data such as race, political views, religious beliefs, genetic, biometric, health, or sexual orientation. Information is gathered in two ways</p>
              </div>
              <div>
                <img style={{ display: "block", margin: "auto" }} src={privacyPolicy} width={300} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
              <div>
                <p className="features-title"> 2. Information you provide <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                <p className="unitedFont">When signing up for an account, we may request personal details like name, email, company information, address, phone, VAT, and credit card information. Additional information may be provided through communication channels like email or phone calls, as well as through feedback and website forms.</p>
              </div>
              <div>
                <img style={{ display: "block", margin: "auto" }} src={privacyPolicy2} width={300} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
              <div>
                <p className="features-title"> 3. Information from service usage <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                <p className="unitedFont">We may collect data on the services used and how they are utilized, including device information, log details, location information, unique application numbers, and local storage data.</p>
              </div>
              <div>
                <img style={{ display: "block", margin: "auto" }} src={privacyPolicy2} width={300} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
              <div>
                <p className="features-title"> 4. Usage of Collected Information <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                <p className="unitedFont">We utilize collected information to deliver, improve, and protect our Services, develop new offerings, and safeguard both our users and our platform. We do not share personal information with external organizations, except in the following cases.</p>
              </div>
              <div>
                <img style={{ display: "block", margin: "auto" }} src={privacyPolicy2} width={300} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
              <div>
                <p className="features-title"> 5. With service providers <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                <p className="unitedFont">We engage other companies to process payments, provide hosting, storage, and other services as needed, ensuring they adhere to our Privacy Policy and security measures.</p>
              </div>
              <div>
                <img style={{ display: "block", margin: "auto" }} src={privacyPolicy2} width={300} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
              <div>
                <p className="features-title">6. For legal compliance <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                <p className="unitedFont">We may disclose personal information to comply with laws, enforce our Terms of Service, or protect the rights and safety of our users and the public.</p>
              </div>
              <div>
                <img style={{ display: "block", margin: "auto" }} src={privacyPolicy2} width={300} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
              <div>
                <p className="features-title">7. Email Communications <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                <p className="unitedFont">Emails related to service functions, notifications, or support issues are integral to our Services and cannot be opted out of. Optional emails, such as new feature announcements or promotions, may be unsubscribed from using the provided links or settings within the service.</p>
              </div>
              <div>
                <img style={{ display: "block", margin: "auto" }} src={privacyPolicy2} width={300} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
              <div>
                <p className="features-title">8. Information Security <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                <p className="unitedFont">We employ industry-standard measures to protect against unauthorized access, alteration, disclosure, or destruction of data. Sensitive information is encrypted during transmission and storage, and access is restricted to authorized personnel only.</p>
              </div>
              <div>
                <img style={{ display: "block", margin: "auto" }} src={privacyPolicy2} width={300} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
              <div>
                <p className="features-title">9. Accessing and Updating Information <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                <p className="unitedFont">Users can update or delete their data through the “My Account” section of the service or by contacting support. Upon account cancellation, all related information is deleted, though some data may remain in backups temporarily.</p>
              </div>
              <div>
                <img style={{ display: "block", margin: "auto" }} src={privacyPolicy2} width={300} />
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: 'center', justifyContent: "space-between" }} className="how-it-work-container">
              <div>
                <p className="features-title">10. Compliance and Changes <TbSquareRoundedArrowRightFilled size={50} color="#7ACB59" /> </p>
                <p className="unitedFont">We regularly review and ensure compliance with our Privacy Policy, including adherence to GDPR regulations. Any changes to the policy will be communicated through email notifications and updates on our website.</p>
              </div>
              <div>
                <img style={{ display: "block", margin: "auto" }} src={privacyPolicy2} width={300} />
              </div>
            </div>
            
          </div>
      </section>
  )

}

export default PrivacyPolicy;