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

  // Ensure score is within bounds (0-100)
  const normalizedScore = Math.max(0, Math.min(100, score));

  const getColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#eab308";
    return "#ef4444";
  };

  useEffect(() => {
    if (circleRef.current) {
      const circle = circleRef.current;

      // Kill any existing animations
      gsap.killTweensOf(circle);

      // Set initial state
      gsap.set(circle, {
        strokeDasharray: circumference,
        strokeDashoffset: circumference,
      });

      // Animate to target value
      gsap.to(circle, {
        strokeDashoffset: circumference - (normalizedScore / 100) * circumference,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.3,
      });
    }

    // Cleanup function
    return () => {
      if (circleRef.current) {
        gsap.killTweensOf(circleRef.current);
      }
    };
  }, [normalizedScore, circumference]);

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
          stroke={getColor(normalizedScore)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          className="transition-colors duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-semibold">{Math.round(normalizedScore)}%</span>
      </div>
    </div>
  );
};
