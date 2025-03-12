import React from "react";
import InviteEmployees from '../images/howitWorkImg1.PNG'
import DesktopApp from '../images/howItWorkSignUp.PNG'
import AppTimeTrack from '../images/howItWorkApptrack.PNG'
import ManagersWebDesktop from '../images/ManagersWebDashboard.PNG'
import DetailsTimeline from '../images/DetailsTimeline.PNG'
import ShowReports from '../images/showReports.PNG'
import NewHeader from './component/Header/NewHeader'
const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Manager invites employees",
      description:
        "After selecting a plan, a company manager invites employees to the company team. When employees accept the invitation, they can start tracking time and submitting their screenshots for that company.",
      image: InviteEmployees,
    },
    {
      id: 2,
      title: "Employee runs desktop application",
      description:
        "Employees install the SSTRACK.IO desktop application, log in, select a project, and press the Start button to begin tracking time and screenshots. The application works even when offline, syncing data when the connection is restored.",
      image: DesktopApp
    },
    {
      id: 3,
      title: "Application tracks time and screenshots",
      description:
        "The application records work time and takes screenshots at random intervals until the Stop button is pressed. If Autostart is enabled, tracking begins when employees start working and stops automatically if no activity is detected.",
      image: AppTimeTrack
    },
    {
      id: 4,
      title: "Managers see it all on the web",
      description:
        "The desktop application continuously sends time tracking data and screenshots to the web so managers can monitor employees in real-time via the online dashboard.",
      image: ManagersWebDesktop
    },
    {
      id: 5,
      title: "Full details on the timeline",
      description:
        "Managers can view detailed timelines, track time spent on projects, monitor application usage, and see screenshots taken throughout the day. Employees can also add offline time manually.",
      image: DetailsTimeline
    },
    {
      id: 6,
      title: "Get reports you need, at a glance",
      description:
        "View time and cost reports, filter by employees or date range, and export detailed timesheets to Excel. Employees can also generate invoices based on their tracked time.",
      image: ShowReports
    },
  ];

  return (

    <>
    <NewHeader language={'en'} show={true}/>
      <div className="mobhayat" id='section5'>
        <div className="container">
          <div className="userHeader d-flex justify-content-between align-items-center">
            <h5>How it Works</h5>
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
