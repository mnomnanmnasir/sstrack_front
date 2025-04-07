import React from "react";
import InviteEmployees from '../images/howitWorkImg1.PNG';
import DesktopApp from '../images/howItWorkSignUp.PNG';
import AppTimeTrack from '../images/howItWorkApptrack.PNG';
import ManagersWebDesktop from '../images/ManagersWebDashboard.PNG';
import DetailsTimeline from '../images/DetailsTimeline.PNG';
import ShowReports from '../images/showReports.PNG';
import NewHeader from './component/Header/NewHeader';
import { useNavigate, Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Owner/Admin Invites Employees",
      description: (
        <>
          <p>
            After selecting a plan, the owner or admin invites employees to the company team.
            Once assigned, managers can track the timeline of their designated employees,
            but they cannot invite new team members.
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
            onClick={() => window.open("https://www.youtube.com/embed/tqR7rCIzgxM", "_blank")}
          >
            User Guide
          </button>
        </>
      ),
      image: InviteEmployees,
    },
    {
      id: 2,
      title: "Employee runs desktop application",
      description: (
        <>
          Employees install the SSTRACK.IO desktop application, log in, select a project, and press the Start button to begin tracking time and screenshots.
          The application works even when offline, syncing data when the connection is restored.{" "}
          <Link to="/download" style={{ color: "#28659C", textDecoration: "underline", fontWeight: "bold" }}>
            Download Desktop Application
          </Link>
        </>
      ),
      image: DesktopApp
    },
    {
      id: 3,
      title: "Desktop Application tracks time and screenshots",
      description: (
        <>
          <p>
            The desktop application records work time and takes screenshots at random intervals until the Stop button is pressed.
            If Autostart is enabled, tracking begins when employees start working and stops automatically if no activity is detected.
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
                "https://www.youtube.com/embed/1fyVTr4T2sI",
                "_blank"
              )
            }
          >
            Desktop App Guide
          </button>
        </>
      ),
      image: AppTimeTrack,
    },
    {
      id: 4,
      title: "Owner, Admin and Manager can see all the users on their dashboard",
      description: (
        <>
          <p>
            "The desktop application continuously sends time tracking data and screenshots to the dashboard so Owner, Admin and Manager can monitor employees in real-time via the online dashboard.",
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
      title: "Full details on the timeline",
      description: (
        <>
          <p>
            "Administrator can view detailed timelines, track time spent on projects, monitor application usage, and see screenshots taken throughout the day. Employees can also add offline time manually.",
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
      image: DetailsTimeline,
    },
    {
      id: 6,
      title: "Get reports you need, at a glance",
      description: (
        <>
          <p>
            "View time and cost reports, filter by employees or date range, and export detailed timesheets to Excel. Employees can also generate invoices based on their tracked time.",
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
                "https://www.youtube.com/embed/6fz2IMH71UM",
                "_blank"
              )
            }
          >
            Reports Guide
          </button>
        </>
      ),
      image: ShowReports
    },
  ];

  return (
    <>
      <NewHeader language={'en'} show={true} />
      <div className="mobhayat" id='section5'>
        <div className="container">
          <div className="userHeader d-flex justify-content-between align-items-center">
            <h5>How it Works</h5>
            <a href="https://youtu.be/9YuYgp7BAzU?feature=shared"
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
                        <h3 className="fw-bold">{step.id}. {step.title}</h3>
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
