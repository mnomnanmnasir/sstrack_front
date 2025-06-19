
import React from "react";

const videos = [
  {
    title: "Employees – Desktop Application Usage",
    description:
      "How to use the desktop app for time tracking, task management, and privacy-focused workday control.",
    script:
      "SSTrack empowers you to manage your workday easily. Using our desktop application, simply press 'Play' to begin tracking your time. Rest assured, SSTrack only tracks when active and automatically stops after 20 minutes of inactivity—unless otherwise specified by your employer. Your privacy is important to us, and transparency is key. Use SSTrack to effortlessly manage your daily tasks, breaks, schedules, and training updates.",
  },
  {
    title: "Addressing Misconceptions – Privacy and Tracking",
    description:
      "Understand how SSTrack respects your privacy and what’s actually being tracked—only when you choose to.",
    script:
      "We know privacy matters. SSTrack respects your boundaries by only tracking when you actively choose to start recording your workday. Tracking automatically stops after 20 minutes of inactivity to ensure your privacy, unless specific permissions have been set by your employer. Clear, transparent, and trustworthy—that’s the SSTrack promise.",
  },
  {
    title: "Mobile App Usage",
    description:
      "Track time, request leave, check your schedule, and more — all from the SSTrack mobile app.",
    script:
      "Stay connected with the SSTrack mobile app. Easily start and stop your tracking while on the move, access your schedule, request vacation or leave, and view updates in real-time. Our mobile app ensures you’re always informed and organized, wherever work takes you.",
  },
];

const EmployeeTrainingPage = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto bg-white min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#7AFF00] mb-2">Employee Training Center</h1>
        <p className="text-gray-700">
          Learn how to use SSTrack as an employee. These short guides help you track your time, understand privacy, and manage your tasks on desktop or mobile.
        </p>
      </div>
      <div className="space-y-6">
        {videos.map((video, index) => (
          <div
            key={index}
            className="bg-[#F8F9FA] border border-[#003366]/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-2xl font-semibold text-[#003366] mb-2">
              {video.title}
            </h2>
            <p className="text-gray-800 mb-2">{video.description}</p>
            <details className="cursor-pointer text-[#003366]">
              <summary className="font-medium">View Script</summary>
              <p className="text-gray-900 mt-2 whitespace-pre-line">{video.script}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTrainingPage;
