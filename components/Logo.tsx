// components/Logo.tsx
"use client";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Hexagonal Logo with A */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B020F0" stopOpacity="1" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Hexagon */}
          <polygon
            points="50,5 90,25 90,75 50,95 10,75 10,25"
            fill="none"
            stroke="url(#neonGradient)"
            strokeWidth="3"
            filter="url(#glow)"
          />
          
          {/* Letter A */}
          <path
            d="M 30 75 L 50 25 L 70 75 M 40 60 L 60 60"
            fill="none"
            stroke="url(#neonGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <span
          className={`font-bold ${textSizes[size]} bg-gradient-to-r from-[#B020F0] to-[#3B82F6] bg-clip-text text-transparent`}
          style={{
            textShadow: "0 0 20px rgba(176, 32, 240, 0.5)",
          }}
        >
          ARTYUGA
        </span>
      )}
    </div>
  );
}

