import React from 'react';

function CircularProgressBar({ activityPercentage, size, emptyUrl }) {
  const circumference = 314; // Total circumference of the circle
  const strokeDashoffset = circumference - (activityPercentage / 100) * circumference;
  const color = activityPercentage === 0.00 || emptyUrl === 0 ? 'red' : `hsl(${activityPercentage}, 100%, 50%)`;

  // Calculate the endpoint coordinates of the arc
  const x = Math.cos(((activityPercentage / 100) * Math.PI * 2) - Math.PI / 2) * 7 + 9;
  const y = Math.sin(((activityPercentage / 100) * Math.PI * 2) - Math.PI / 2) * 7 + 9;

  return (
    <svg className="pie-progress" width={35} height={35}>
      {/* Background Circle */}
      <circle
        cx="18"
        cy="18"
        r="14"
        className="pie-progress__background"
        stroke={color}
        fill="transparent"
        strokeWidth="4"
      ></circle>

      {/* Progress Path */}
      {activityPercentage === 100 ? (
        <circle
          cx="18"
          cy="18"
          r="14"
          className="pie-progress__progress"
          fill={color}
        ></circle>
      ) : (
        <path
          d={`M18 18 L18 4 A14 14 -90 ${activityPercentage > 50 ? 1 : 0} 1 ${x * 2} ${y * 2} z`}
          fill={color}
        ></path>
      )}
    </svg>
  );
}

export default CircularProgressBar;
