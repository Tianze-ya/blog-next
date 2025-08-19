import React from "react";

interface LoadingAnimationProps {
  isVisible: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="loader">
        {/* 渐变定义 - 将旋转动画从8秒改为9秒 */}
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

        {/* 各字母SVG保持不变... */}

      </div>

      {/* 将CSS动画从2秒改为3秒 */}
      <style jsx>{`
        .loader {
          display: flex;
          margin: 0.25em 0;
          gap: 0.2em;
        }
        .dash {
          animation: 
            dashArray 3s ease-in-out infinite, {/* 从2秒改为3秒 */}
            dashOffset 3s linear infinite;     {/* 从2秒改为3秒 */}
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