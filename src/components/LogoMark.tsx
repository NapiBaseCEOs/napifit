export default function LogoMark({
  className = "h-9 w-9",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="napifit-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      {/* Rounded square background */}
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="16"
        fill="url(#napifit-gradient)"
      />
      {/* Bold uppercase N */}
      <path
        d="M21 44V20h4.4l17.2 17.9V20h4.4v24h-4.4L25.4 26.1V44z"
        fill="#0f172a"
        opacity="0.95"
      />
      {/* Four-pointed star in bottom right corner */}
      <g transform="translate(50, 50)">
        <path
          d="M0 -2.5 L0.8 0 L0 2.5 L-0.8 0 Z M-2.5 0 L0 -0.8 L2.5 0 L0 0.8 Z"
          fill="#9ca3af"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}

