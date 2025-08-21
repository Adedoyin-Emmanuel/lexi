"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

interface CircularConfidenceProps {
  score: number;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const CircularConfidence = ({
  score,
  size = 40,
  strokeWidth = 4,
  className = "",
}: CircularConfidenceProps) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const getColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#eab308";
    return "#ef4444";
  };

  useEffect(() => {
    if (circleRef.current) {
      const circle = circleRef.current;

      gsap.set(circle, {
        strokeDasharray: circumference,
        strokeDashoffset: circumference,
      });

      gsap.to(circle, {
        strokeDashoffset: circumference - (score / 100) * circumference,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.3,
      });
    }
  }, [score, circumference]);

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          className="transition-colors duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-semibold">{score}%</span>
      </div>
    </div>
  );
};
