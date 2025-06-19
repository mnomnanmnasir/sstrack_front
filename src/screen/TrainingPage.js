import React, { useState } from "react";
import groupCompany from "../images/Group.webp";
import jwtDecode from "jwt-decode";

const videos_Employers = [
  {
    title: "Sign Up as an Employer",
    description:
      "To get started, simply sign up by entering your name, company name, and email.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Create your employer account by entering your name, company name, and email. This step ensures you have a personalized experience while managing your workforce. Once signed up, you can access the full range of features to streamline your operations.",
  },
  {
    title: "Confirm Email & Set Password",
    description:
      "Check your inbox for a confirmation email, click verify, and set up your password.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "After signing up, check your email for a verification link. Click on it to confirm your email address and set up a secure password. This ensures your account is protected and ready to use without any security concerns.",
  },
  {
    title: "Access the Employer Dashboard",
    description:
      "Your dashboard gives you an overview of all employees, their work hours, and activity timeline in real-time.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Your dashboard serves as the control center for your workforce. View employee activity, work hours, and productivity insights in real-time. The intuitive interface makes it easy to manage your team, track attendance, and gain performance reports at a glance.",
  },

  {
    title: "Download SSTrack for Desktop",
    description:
      "SSTrack is available on Windows, Mac, and as a Chrome Extension—perfect for tracking yourself or your team!",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "SSTrack is available on Windows, Mac, and as a Chrome Extension. This flexibility allows you to track employees on different devices while ensuring seamless time tracking, productivity monitoring, and real-time reporting from the convenience of your desktop.",
  },
  {
    title: "Add Team Members via Email Invitation",
    description:
      "Easily add team members by sending invitations. They will receive an email to join your team.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Invite your employees by sending an email invitation. Once they accept, they will be automatically added to your workforce management system, enabling you to track their work hours, project involvement, and overall productivity.",
  },
  {
    title: "Manage Employee Roles & Permissions",
    description: "Assign roles, archive inactive users, or remove employees when necessary.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script: "Customize access levels by assigning roles such as Owner, Admin, Manager, or Employee.\n\nOwners and admins have full control over permissions, while managers can oversee assigned teams.\n\n- Archive inactive users\n- Update access levels\n- Remove employees when needed\n\nThis ensures a structured and efficient team hierarchy.\n\n**Pay Rate Management (Owner & Admin)**\n\nOwners and admins can set pay rates for employees based on different time periods:\n\n- **Hourly Rate** – Ideal for tracking real-time work hours.\n- **Weekly Salary** – A fixed amount paid every week.\n- **Monthly Salary** – A consistent pay structure for long-term employees.\n\nPay rates can be adjusted anytime, and changes will be recorded in the **History Logs** for transparency."
  },

  {
    title: "View Summary Reports & Productivity Insights",
    description:
      "Monitor employee performance through detailed reports, including work hours, pay rates, and active projects.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Gain valuable insights into employee work patterns with detailed reports. Monitor active work hours, assigned projects, pay rates, and productivity levels. These insights help optimize performance and ensure efficient workforce management by aligning employee efforts with company goals.",
  },
  {
    title: "Create & Assign Projects to Employees",
    description:
      "Assign projects to employees, ensuring they track their tasks directly from the desktop app.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Before assigning employees to tasks, owners and admins must first create a project within the system. Once a project is set up, it can be assigned to specific employees, ensuring proper task distribution and tracking.Employees can then use the SSTrack desktop app to log their work hours, track progress, and maintain accountability. This structured approach ensures smooth project execution, clear task management, and efficient workforce coordination.",
  },
  {
    title: "Manage Employee Leaves",
    description:
      "Easily approve or reject employee leave requests from the dashboard",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Before employees can request leave, owners or admins must first set leave policies for the team. Once configured, employees can submit leave requests through SSTrack, which can then be reviewed, approved, or rejected from the employer dashboard.\n\nIf an employee is on leave but fails to apply for it in SSTrack, owners or admins can manually add leave to ensure accurate records and maintain proper attendance tracking. This helps streamline HR processes, track employee availability, and prevent workflow disruptions.",
  },
  {
    title: "Track Employee Location (Mobile Users Only).",
    description:
      "Monitor your field employees with GPS location tracking for better workforce management.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Monitor field employees in real time using GPS tracking, available only on mobile devices. This feature helps businesses manage remote teams, verify job site visits, and improve overall workforce coordination.",
  },
  {
    title: "Attendance & Break Time Management",
    description:
      "Track daily attendance, monitor active workstations, and manage employee break times.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "To maintain productivity and ensure compliance with company policies, owners and admins must first set standard break times for all employees. This allows for structured work schedules while ensuring employees take necessary rest periods.\n\nIf certain employees require additional breaks due to workload or specific roles, owners or admins can assign extra break time as needed. The system will track attendance, monitor active workstations, and log break durations, ensuring transparency and efficiency in workforce management.",
  },
  {
    title: "Punctuality & Screenshot Capture Settings",
    description:
      "Set random screenshot intervals to ensure accountability and maintain workplace transparency.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Enhance workplace transparency by setting automated screenshot intervals. This feature ensures accountability, prevents distractions, and provides insights into employee workstation activity without intrusive micromanagement.",
  },
  {
    title: "Access Employee History Logs",
    description:
      "Review detailed logs to track every action, ensuring full transparency in work records.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Owners and admins can view the complete history log, including changes made by each other and all updates across the system. Regular employees can only see logs related to their own settings, such as role changes, pay rate updates, and leave approvals. This ensures transparency while maintaining appropriate access control.",
  },

];

const videos_Employees = [
  {
    title: "Receive an Invitation Email",
    description:
      "Employees will receive an email invitation to join SSTrack.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Employees will receive an email invitation from their employer to join SSTrack. This invitation includes a link to set up their account and start tracking their work.",
  },
  {
    title: "Sign Up Through the Invitation Link",
    description:
      "Click the invitation link, sign up, and create a password to access your account.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Click on the invitation link, sign up by entering your details, and create a secure password to access your SSTrack account.",
  },
  {
    title: "Download & Install the SSTrack Desktop App",
    description:
      "Download and install SSTrack to start tracking your work hours.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "To start tracking work hours, download and install the SSTrack desktop app on Windows, Mac, or as a Chrome Extension.",
  },
  {
    title: "Log in Using the Same Credentials",
    description:
      "Log in to the SSTrack desktop app using your registered email and password.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Use your registered email and password to log in to the SSTrack desktop app and begin monitoring your tasks.",
  },
  {
    title: " View Work Timeline on the Dashboard",
    description:
      "Once logged in, view your work timeline, assigned tasks, and project details.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "After logging in, access your dashboard to check your daily work timeline, assigned tasks, and project details for better task management.",
  },
  {
    title: "Access Reports & Work Hours Summary",
    description:
      "Employees can check their work hours, completed tasks, and performance reports anytime.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Employees can view detailed reports of their work hours, productivity levels, and completed tasks. This allows for better performance tracking and time management.",
  },
  {
    title: "Enable Location Tracking (For Field Employees Only)",
    description:
      "For field employees, location tracking helps ensure accurate monitoring and reporting.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "For field employees, GPS location tracking is enabled to ensure accurate monitoring while working remotely or on the move. This feature is only applicable to mobile users.",
  },
  {
    title: "Apply for Leave from the Dashboard",
    description:
      "Employees can submit leave requests directly from their dashboard for quick approval.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Employees can submit leave requests directly from their dashboard for quick approval by the employer. If an employee forgets to apply for leave but was absent, the employer can manually add the leave record to maintain accurate attendance.",
  },
  {
    title: "Assign & Track Projects",
    description:
      "Projects must be created before employees can be assigned and tracked.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Employees can only work on assigned projects, which are set up by the employer beforehand. The SSTrack app ensures proper task tracking, helping employees stay organized and accountable.",
  },
  {
    title: "Manage Attendance & Breaks",
    description:
      "Set break time limits and assign extra breaks when required.",
    videoUrl: "https://www.youtube.com/watch?v=qGjzXQ_SLH4",
    script:
      "Employees can view their attendance records, assigned break durations, and extra breaks (if applicable) from the dashboard. The system automatically logs break times and ensures adherence to company policies.",
  },
];
const extractVideoId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
};

const TrainingPage = () => {
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;

  const initialTab = user?.userType === "manager" || user?.userType === "user" ? "employee" : "employer";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [openIndex, setOpenIndex] = useState(null);
  const [watchedStatus, setWatchedStatus] = useState({});

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
    setWatchedStatus({ ...watchedStatus, [index]: true });
  };

  const downloadScript = (title, script) => {
    const blob = new Blob([script], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, "_")}_Script.txt`;
    link.click();
  };

  const videos = activeTab === "employer" ? videos_Employers : videos_Employees;

  return (
    <div className="container">
      <div className="userHeader">
        <div className="d-flex align-items-center gap-3">
          <div>
            <img src={groupCompany} alt="Group Icon" />
          </div>
          <h5>Training</h5>
        </div>
      </div>

      <div className="mainwrapper">
        <div className="ownerTeamContainer">
          <div
            style={{
              padding: "32px",
              maxWidth: "72rem",
              margin: "0 auto",
              minHeight: "100vh",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#7ACB59",
                  marginBottom: "12px",
                }}
              >
                SSTrack Training Center
              </h1>
              <p style={{ color: "#6C757D", fontSize: "1rem" }}>
                Watch tutorials, explore features, and download scripts to get the most out of SSTrack.
              </p>
              {/* <div style={{ marginTop: "20px" }}>
                <button
                  onClick={() => setActiveTab("employer")}
                  style={{
                    padding: "10px 20px",
                    marginRight: "10px",
                    backgroundColor: activeTab === "employer" ? "#7ACB59" : "#E0E0E0",
                    color: activeTab === "employer" ? "white" : "#333",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Employer View
                </button>
                <button
                  onClick={() => setActiveTab("employee")}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: activeTab === "employee" ? "#7ACB59" : "#E0E0E0",
                    color: activeTab === "employee" ? "white" : "#333",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Employee View
                </button>
              </div> */}
            </div>

            <div style={{ display: "grid", gap: "24px" }}>
              {videos.map((video, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #E0E0E0",
                    borderRadius: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <button
                    onClick={() => handleToggle(index)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "24px",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h2
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: "600",
                            color: "#0E4772",
                            marginBottom: "8px",
                          }}
                        >
                          {video.title}
                        </h2>
                        <p style={{ color: "#555" }}>{video.description}</p>
                      </div>
                      <span style={{ fontSize: "1.5rem", color: watchedStatus[index] ? "#7ACB59" : "#aaa" }}>
                        {watchedStatus[index] ? "✓ Watched" : openIndex === index ? "−" : "+"}
                      </span>
                    </div>
                  </button>

                  {openIndex === index && (
                    <div style={{ padding: "0 24px 24px" }}>
                      <div style={{ marginBottom: "16px" }}>
                        <iframe
                          width="100%"
                          height="315"
                          src={`https://www.youtube.com/embed/${extractVideoId(video.videoUrl)}`}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div
                        style={{
                          backgroundColor: "#F5F9F6",
                          padding: "16px",
                          borderRadius: "12px",
                          borderLeft: "4px solid #7ACB59",
                          color: "#444",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {video.script}
                      </div>
                      <button
                        onClick={() => downloadScript(video.title, video.script)}
                        style={{
                          marginTop: "12px",
                          backgroundColor: "#0E4772",
                          color: "white",
                          padding: "10px 16px",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        Download Script
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;