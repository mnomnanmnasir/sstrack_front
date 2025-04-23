import React, { useEffect, useRef, useState } from "react";
import olivia from "../../images/olivia.webp";
import banner from '../../images/ss-track-banner.svg';
import pheonix from "../../images/pheonix.webp";
import lana from "../../images/lana.webp";
import candice from "../../images/candice.webp";
import natali from "../../images/natali.webp";
import drew from "../../images/drew.webp";
import leftArrow from "../../images/Leftarrow.webp";
import rightArrow from "../../images/Rightarrow.webp";
import dean from "../../images/manage.svg";
const Monitor = () => {
  const section1Ref = useRef(null);

  const [page, setPage] = useState(1)

  const [feedbacks, setFeedback] = useState([
    {
      page: 1,
      data: [
        {
          username: "John M.",
          designation: "Expect Best",
          feedback: "“SS Track has revolutionized how we monitor employee productivity. The detailed timelines and app usage reports are incredibly insightful.”",
          img: "https://images.unsplash.com/photo-1636624498155-d87727494812?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          username: "Drew Cano.",
          designation: "Engineering Manager",
          feedback: "“Great tool for tracking remote work. The random screenshots feature helps us ensure employees stay on task.”",
          img: olivia,
        },
        {
          username: "David L.",
          designation: "Product Manager",
          feedback: "“While SS Track offers comprehensive monitoring, it sometimes feels invasive. Transparency with employees is key.”",
          img: pheonix,
        },
        {
          username: "Candice Wu",
          designation: "Backend Developer",
          feedback: "“SS Track has significantly improved our team's productivity. The detailed reports and real-time monitoring features are excellent. It's easy to use and integrates well with our existing systems.”",
          img: lana,
        },
        {
          username: "Sarah K.",
          designation: "Product Designer",
          feedback: "“The user interface is intuitive, and the screen capture feature ensures our employees stay focused on their tasks. We've seen a notable increase in efficiency since implementing SS Track.”",
          img: candice,
        },
        {
          username: "Drew Cano",
          designation: "UX Researcher",
          feedback: "“SS Track's ability to monitor application usage and website visits has been crucial for identifying areas where we can improve productivity. The real-time alerts help us address issues promptly.”",
          img: "https://plus.unsplash.com/premium_photo-1689266188052-704d33673e69?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ]
    },
    {
      page: 2,
      data: [
        {
          username: "Lana Steiner",
          designation: "Product Manager",
          feedback: "“The best way to follow your team overseas is to actually see what they're doing...”",
          img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          username: "Michael T.",
          designation: "Engineering Manager",
          feedback: "“SS Track's employee monitoring capabilities have helped us enhance security and compliance within our organization. The setup was straightforward, and customer support has been responsive and helpful.”",
          img: natali,
        },
        {
          username: "Olivia Rhye",
          designation: "Expect Best",
          feedback: "“sstrack.io allows us to look over completed work by remote staff, shows when my staff is working and keeps a backup of work produced. Highly recommend!”",
          img: drew,
        },
        {
          username: "Phoenix Baker",
          designation: "Product Designer",
          feedback: "“sstrack.io makes it easy for us to manage the staff at different branch offices of Visas Avenue. The different locations of work is not a hurdle anymore. Thank you sstrack.io!”",
          img: "https://images.unsplash.com/photo-1543871595-e11129e271cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          username: "Emily R.",
          designation: "UX Researcher",
          feedback: "“ SS Track's ability to monitor application usage and website visits has been crucial for identifying areas where we can improve productivity. The real-time alerts help us address issues promptly.”",
          img: "https://images.unsplash.com/photo-1664575600850-c4b712e6e2bf?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          username: "Candice Wu",
          designation: "Backend Developer",
          feedback: "“The software's robust reporting and analysis tools provide deep insights into employee activities. It's an indispensable tool for managing remote teams effectively.”",
          img: "https://images.unsplash.com/photo-1664575602554-2087b04935a5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ]
    },
  ])

    return (
        <>
            <section className="thirdSection d-flex" id="section1" ref={section1Ref}>
          <div className="container mt-3">
            <p className="millionHours">
              Over million hours tracked each month <br />
              15M+ screenshots monthly
            </p>

            <div className="row d-flex">
              {feedbacks.map((feed, index) =>
                feed.page === page ? feed.data.map((data, dataIndex) => (
                  <div className="col-md-4 mb-4 d-flex" key={`${index}-${dataIndex}`}>
                    <div className="feedbackBox h-100 d-flex flex-column">
                      <div className="d-flex">
                        <img className="olivia" src={data.img} alt={data.username} />
                      </div>
                      <div className="oliviaDiv flex-grow-1">
                        <p className="oliviafont">{data.username}</p>
                        <p className="oliviaGreen">{data.designation}</p>
                        <p className="oliviaPera">{data.feedback}</p>
                      </div>
                    </div>
                  </div>
                )) : null
              )}
            </div>


            <div className="leftRightArrow">
              <div onClick={() => setPage(page > 1 ? page - 1 : page)} style={{ cursor: "pointer" }}>
                <img src={leftArrow} />
              </div>
              <p>{page}</p>
              <div onClick={() => setPage(page < 2 ? page + 1 : page)} style={{ cursor: "pointer" }}>
                <img src={rightArrow} />
              </div>
            </div>
          </div>
        </section>
        <br />
        <br />
        <div className='container mt-3 align-items-center justify-content-center'>
          <div className="row justify-content-between align-items-center">
            {/* Pricing Card 1 */}
            <div className="col-md-6 mb-3">
              <div className="" style={{ borderRadius: '1rem', height: '100%', marginRight: '50px' }}>
                <img className="card-img-top" src={banner} alt="Banner" style={{ borderRadius: '1rem' }} />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="" style={{ color: '#0E4772', borderRadius: '1rem', height: '100%' }}>
                <div className="card-body">
                  <h5 className="card-title fw-bold fs-1">Employees track time</h5>
                  <br />
                  <p className="card-text fs-4">A manager invites employees to sstrack.io, where they download a streamlined desktop application, choose a project to work on, and hit the Start button. This initiates tracking, sending data to the web instantly until they press the Stop button.
                  </p>
                </div>
              </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            {/* Image Card */}
          </div>
        </div>
        <br />
        <br />
        <div className='container mt-3 align-items-center justify-content-center'>
          <div className="row justify-content-between align-items-center">
            {/* Pricing Card 1 */}
            <div className="col-md-6 mb-3">
              <div className="" style={{ color: '#0E4772', borderRadius: '1rem', height: '100%' }}>
                <div className="card-body">
                  <h5 className="card-title fw-bold fs-1">Managers view it on the web</h5>
                  <br />
                  <p className="card-text fs-4">Within their sstrack.io dashboards, both the employee and manager have access to insights on the employee's working periods, task duration, screen captures taken at random moments, activity metrics, applications operated, along with the websites visited and their respective browsing times.
                  </p>
                </div>
              </div>
            </div>

            <br />
            <br />
            <br />
            <br />
            {/* Image Card */}
            <div className="col-md-6 mb-3">
              <div className="" style={{ borderRadius: '1rem', height: '100%', marginRight: '50px' }}>
                <img className="card-img-top" src={dean} alt="Banner" style={{ borderRadius: '1rem' }} />
              </div>
            </div>
          </div>
        </div>
        </>
    )
}



export default Monitor;