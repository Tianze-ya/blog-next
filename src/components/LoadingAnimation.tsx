import React from "react";

interface LoadingAnimationProps {
  isVisible: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="loader">
        {/* 渐变定义 */}
        <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
          <defs xmlns="http://www.w3.org/2000/svg">
            <linearGradient id="b" x1="0" y1="62" x2="0" y2="2">
              <stop stopColor="#973BED" />
              <stop stopColor="#007CFF" offset="1" />
            </linearGradient>

            <linearGradient id="c" x1="0" y1="64" x2="0" y2="0">
              <stop stopColor="#FFC800" />
              <stop stopColor="#F0F" offset="1" />
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
                keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                dur="9s"
                repeatCount="indefinite"
              />
            </linearGradient>

            <linearGradient id="d" x1="0" y1="62" x2="0" y2="2">
              <stop stopColor="#00E0ED" />
              <stop stopColor="#00DA72" offset="1" />
            </linearGradient>

            <linearGradient id="e" x1="0" y1="62" x2="0" y2="2">
              <stop stopColor="#FF6B6B" />
              <stop stopColor="#4ECDC4" offset="1" />
            </linearGradient>

            <linearGradient id="f" x1="0" y1="62" x2="0" y2="2">
              <stop stopColor="#A8E6CF" />
              <stop stopColor="#88D8C0" offset="1" />
            </linearGradient>

            <linearGradient id="g" x1="0" y1="62" x2="0" y2="2">
              <stop stopColor="#FFD93D" />
              <stop stopColor="#FF6B6B" offset="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* T - 第一个字母 */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="inline-block">
          <path
            stroke="url(#b)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M 4,8 L 16,48 L 28,12 L 40,48 L 52,8"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* I - 第二个字母 */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="inline-block">
          <path
            stroke="url(#c)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M 20,12 L 44,12 M 32,12 L 32,52 M 20,52 L 44,52"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* A - 第三个字母 */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="inline-block">
          <path
            stroke="url(#d)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M 12,52 L 32,12 L 52,52 M 20,36 L 44,36"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* N - 第四个字母 */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="inline-block">
          <path
            stroke="url(#e)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M 12,52 L 12,12 L 52,52 L 52,12"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* Z - 第五个字母 */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="inline-block">
          <path
            stroke="url(#f)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M 12,12 L 52,12 L 12,52 L 52,52"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* E - 第六个字母 */}
        <svg width="64" height="64" viewBox="0 0 64 64" className="inline-block">
          <path
            stroke="url(#g)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M 12,12 L 52,12 L 12,12 L 12,52 L 52,52 M 12,32 L 40,32"
            className="dash"
            pathLength="360"
          />
        </svg>
      </div>

      <style jsx>{`
        .loader {
          display: flex;
          margin: 0.25em 0;
          gap: 0.2em;
        }
        .dash {
          animation: 
            dashArray 3s ease-in-out infinite,
            dashOffset 3s linear infinite;
        }
        @keyframes dashArray {
          0% { stroke-dasharray: 0 1 359 0; }
          50% { stroke-dasharray: 0 359 1 0; }
          100% { stroke-dasharray: 359 1 0 0; }
        }
        @keyframes dashOffset {
          0% { stroke-dashoffset: 365; }
          100% { stroke-dashoffset: 5; }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;