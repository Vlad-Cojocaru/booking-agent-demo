import React from 'react';

interface CurateFlowLogoProps {
  className?: string;
  size?: number;
}

export const CurateFlowLogo: React.FC<CurateFlowLogoProps> = ({ 
  className = "", 
  size = 24 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main flowing shape */}
      <path
        d="M20 60 Q15 50 25 40 Q35 30 45 35 Q55 40 60 30 Q70 20 80 25 Q85 30 80 40 Q75 50 65 55 Q55 60 45 65 Q35 70 25 65 Q20 60 20 60 Z"
        fill="#0f7969"
        stroke="white"
        strokeWidth="1"
      />
      
      {/* Internal wavy line */}
      <path
        d="M25 55 Q30 50 35 45 Q40 40 45 42 Q50 44 55 38 Q60 32 65 35 Q70 38 65 45 Q60 52 55 55 Q50 58 45 60 Q40 62 35 60 Q30 58 25 55 Z"
        fill="none"
        stroke="black"
        strokeWidth="1.5"
        opacity="0.3"
      />
      
      {/* Upper-right fragmented segments */}
      <circle cx="75" cy="30" r="3" fill="#0f7969" stroke="white" strokeWidth="0.5" />
      <circle cx="80" cy="25" r="2" fill="#0f7969" stroke="white" strokeWidth="0.5" />
      <circle cx="85" cy="35" r="2.5" fill="#0f7969" stroke="white" strokeWidth="0.5" />
      
      {/* Small diamond shape */}
      <path
        d="M70 15 L75 10 L80 15 L75 20 Z"
        fill="#0f7969"
        stroke="white"
        strokeWidth="1"
      />
    </svg>
  );
};
