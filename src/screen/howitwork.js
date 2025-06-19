import React from "react";
import Invite_employees from '../images/Invite_employees.PNG';
import desktop_app from '../images/how_It_Work_SignUp.PNG';
import app_time_track from '../images/how_It_Work_Apptrack.png';
import ManagersWebDesktop from '../images/User_Dashboard.png';
import details_timeline from '../images/detail_timeline.png';
import show_reports from '../images/show_Reports.png';
import NewHeader from './component/Header/NewHeader';
import {Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Owner/Admin Invites Employees",
      description: (
        <>
          <p>
            Invite employees to the company team and define access controls. Ideal for hybrid workforce coordination.
          </p>
          <button
            style={{
              backgroundColor: "#28659C",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              marginTop: "10px"
            }}
            onClick={() => window.open("https://youtu.be/pesUBUnT0iA?feature=shared", "_blank")}
          >
            User Guide
          </button>
        </>
      ),
      image: Invite_employees,
    },
    {
      id: 2,
      title: "Employee Runs Desktop Application",
      description: (
        <>
          Employees log in, select a project, and begin tracking with our lightweight desktop application that supports offline syncing.{" "}
          <Link to="/download" style={{ color: "#28659C", textDecoration: "underline", fontWeight: "bold" }}>
            Download Desktop Application
          </Link>
        </>
      ),
      image: desktop_app
    },
    {
      id: 3,
      title: "Desktop Application Tracks Time and Screenshots",
      description: (
        <>
          <p>
            Real-time activity monitoring and screenshot tracking help maintain accountability and task proof.
          </p>
          <button
            style={{
              backgroundColor: "#28659C",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              marginTop: "10px",
            }}
            onClick={() =>
              window.open(
                "https://youtu.be/W1Xbvu-i_qI?feature=shared",
                "_blank"
              )
            }
          >
            Desktop App Guide
          </button>
        </>
      ),
      image: app_time_track,
    },
    {
      id: 4,
      title: "Owner, Admin and Manager View Dashboards",
      description: (
        <>
          <p>
            Track team productivity, attendance, and project timelines via real-time dashboards and reports.
          </p>
          <button
            style={{
              backgroundColor: "#28659C",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              marginTop: "10px",
            }}
            onClick={() =>
              window.open(
                "https://www.youtube.com/embed/tqR7rCIzgxM",
                "_blank"
              )
            }
          >
            Owner Guide
          </button>
        </>
      ),
      image: ManagersWebDesktop,
    },
    {
      id: 5,
      title: "Full Details on the Timeline",
      description: (
        <>
          <p>
            View detailed employee logs, screenshots, and manually entered time across projects.
          </p>
          <button
            style={{
              backgroundColor: "#28659C",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              marginTop: "10px",
            }}
            onClick={() =>
              window.open(
                "https://www.youtube.com/embed/tqR7rCIzgxM",
                "_blank"
              )
            }
          >
            Timeline Guide
          </button>
        </>
      ),
      image: details_timeline,
    },
    {
      id: 6,
      title: "Reports at a Glance",
      description: (
        <>
          <p>
            Export filtered timesheets, download project reports, or generate payroll-ready summaries in one click.
          </p>
          <button
            style={{
              backgroundColor: "#28659C",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              marginTop: "10px",
            }}
            onClick={() =>
              window.open(
                "https://youtu.be/aBz6tGF_Dg4?feature=shared",
                "_blank"
              )
            }
          >
            Reports Guide
          </button>
        </>
      ),
      image: show_reports
    },
  ];

  return (
    <>
      <NewHeader language={'en'} show={true} />
      <div className="mobhayat" id='section5'>
        <div className="container">
          <div className="userHeader d-flex justify-content-between align-items-center">
            <h5>How it Works</h5>
            <a href="https://youtu.be/85UxhEv90BU?feature=shared"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#7ACB59" }}>
              Here is the demo video Link
            </a>
          </div>

          <div className="howItWorksSection bg-light py-5">
            <div className="container">
              <div className="row">
                {steps.map((step, index) => (
                  <div key={step.id} className="col-12">
                    <div className="row d-flex flex-column flex-md-row align-items-center mb-4">
                      <div className="col-md-6 text-start" style={{ color: '#0E4772' }}>
                        <h2 className="fw-bold">{step.id}. {step.title}</h2>
                        <p className="text-muted">{step.description}</p>
                      </div>
                      <div className="col-md-6 px-4 text-center">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="img-fluid rounded shadow-lg"
                        />
                      </div>
                    </div>
                    {index !== steps.length - 1 && (
                      <div className="row">
                        <div className="col-12">
                          <hr className="dotted-line my-4 d-block" style={{ borderTop: "3px dotted grey", width: "100%" }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;