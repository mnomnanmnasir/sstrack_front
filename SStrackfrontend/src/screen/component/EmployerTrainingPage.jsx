
import React, { useState } from "react";


const videos_Employers = [
  {
    title: "SS Track System Overview",
    description:
      "Learn how to navigate your dashboard, manage employees, set schedules, and control all core features in one place.",
    script:
      "Managing your workforce has never been easier. With SS Track, you can seamlessly monitor attendance, set and adjust employee schedules, manage vacations and leave requests, and oversee training sessions directly through your dashboard. Effortlessly issue pay stubs and use powerful reporting tools for clear insights. SS Track puts employee management at your fingertips—anywhere, anytime.",
  },
  {
    title: "Employers – How to Use SS Track",
    description:
      "A complete walkthrough for business owners and HR managers to control schedules, approvals, reports, and more.",
    script:
      "Managing your workforce has never been easier. With SS Track, you can seamlessly monitor attendance, set and adjust employee schedules, manage vacations and leave requests, and oversee training sessions directly through your dashboard. Effortlessly issue pay stubs and use powerful reporting tools for clear insights. SS Track puts employee management at your fingertips—anywhere, anytime.",
  },
  {
    title: "Using the Mobile Punch System",
    description:
      "Track employee punctuality, manage break time rules, and stay compliant through our intuitive mobile punch interface.",
    script:
      "SS Track's mobile punch system makes clocking in and out effortless. Monitor punctuality, manage break times, and maintain accuracy through intuitive interfaces. Our HR-focused tools ensure compliance and streamline management of breaks, schedules, training, and vacation time. SS Track—the ultimate solution to enhance your team's productivity and punctuality.",
  },
  {
    title: "Employees – Desktop Application",
    description:
      "A simple how-to for employees using the desktop app to track work, manage breaks, and stay up to date.",
    script:
      "SS Track empowers you to manage your workday easily. Using our desktop application, simply press 'Play' to begin tracking your time. Rest assured, SS Track only tracks when active and automatically stops after 20 minutes of inactivity—unless otherwise specified by your employer. Your privacy is important to us, and transparency is key. Use SS Track to effortlessly manage your daily tasks, breaks, schedules, and training updates.",
  },
  {
    title: "Your Privacy & Tracking",
    description:
      "Understand how SS Track protects your privacy and what gets tracked—only with your action and approval.",
    script:
      "We know privacy matters. SS Track respects your boundaries by only tracking when you actively choose to start recording your workday. Tracking automatically stops after 20 minutes of inactivity to ensure your privacy, unless specific permissions have been set by your employer. Clear, transparent, and trustworthy—that’s the SS Track promise.",
  },
  {
    title: "Mobile App – On-the-Go Access",
    description:
      "Stay connected, request leaves, check schedules, and track time – all from your mobile phone.",
    script:
      "Stay connected with the SS Track mobile app. Easily start and stop your tracking while on the move, access your schedule, request vacation or leave, and view updates in real-time. Our mobile app ensures you’re always informed and organized, wherever work takes you.",
  },
  {
    title: "How to Use the Reports Section",
    description:
      "Dive into performance reports, leave summaries, attendance insights, and more—clearly presented and easy to export.",
    script: "(Script to be added)",
  },
];

const EmployerTrainingPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
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
          SS Track Training Center
        </h1>
        <p style={{ color: "#6C757D", fontSize: "1rem" }}>
          Your complete guide to mastering SS Track. Watch video tutorials, explore features, and get the best out of your team.
        </p>
      </div>

      <div style={{ display: "grid", gap: "24px" }}>
        {videos_Employers.map((video, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #E0E0E0",
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              transition: "0.3s",
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
                <span style={{ fontSize: "1.5rem", color: "#7ACB59" }}>
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>
            </button>

            {openIndex === index && (
              <div style={{ padding: "0 24px 24px" }}>
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
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerTrainingPage;
