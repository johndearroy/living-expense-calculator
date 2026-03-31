import * as React from "react";
const EmptyStateSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={320}
    height={260}
    viewBox="0 0 320 260"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx={160} cy={110} r={80} fill="#fef3c7" />
    <rect x={120} y={60} width={80} height={100} rx={8} fill="#f59e0b" />
    <rect x={128} y={68} width={64} height={22} rx={4} fill="#fffbeb" />
    <rect x={134} y={74} width={40} height={4} rx={2} fill="#d97706" />
    <rect x={134} y={81} width={28} height={3} rx={1.5} fill="#fcd34d" />
    <rect x={130} y={98} width={12} height={10} rx={3} fill="#fef3c7" />
    <rect x={146} y={98} width={12} height={10} rx={3} fill="#fef3c7" />
    <rect x={162} y={98} width={12} height={10} rx={3} fill="#fef3c7" />
    <rect
      x={178}
      y={98}
      width={12}
      height={10}
      rx={3}
      fill="#92400e"
      opacity={0.6}
    />
    <rect x={130} y={112} width={12} height={10} rx={3} fill="#fef3c7" />
    <rect x={146} y={112} width={12} height={10} rx={3} fill="#fef3c7" />
    <rect x={162} y={112} width={12} height={10} rx={3} fill="#fef3c7" />
    <rect x={178} y={112} width={12} height={10} rx={3} fill="#fef3c7" />
    <rect x={130} y={126} width={12} height={10} rx={3} fill="#fef3c7" />
    <rect x={146} y={126} width={12} height={10} rx={3} fill="#fef3c7" />
    <rect x={162} y={126} width={12} height={10} rx={3} fill="#fef3c7" />
    <rect x={178} y={126} width={12} height={10} rx={3} fill="#fef3c7" />
    <rect x={130} y={140} width={28} height={10} rx={3} fill="#fef3c7" />
    <rect x={178} y={140} width={12} height={10} rx={3} fill="#fef3c7" />
    <circle cx={218} cy={72} r={4} fill="#fbbf24" />
    <circle cx={228} cy={60} r={2.5} fill="#fcd34d" />
    <circle cx={210} cy={58} r={2} fill="#f59e0b" />
    <circle cx={102} cy={80} r={3} fill="#fbbf24" />
    <circle cx={94} cy={68} r={2} fill="#fcd34d" />
    <text
      x={240}
      y={105}
      fontFamily="-apple-system, sans-serif"
      fontSize={22}
      fontWeight={700}
      fill="#f59e0b"
      opacity={0.5}
    >
      {"\xA3"}
    </text>
    <text
      x={82}
      y={120}
      fontFamily="-apple-system, sans-serif"
      fontSize={16}
      fontWeight={700}
      fill="#fbbf24"
      opacity={0.5}
    >
      {"\xA3"}
    </text>
    <text
      x={160}
      y={208}
      textAnchor="middle"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      fontSize={15}
      fontWeight={600}
      fill="#1e293b"
    >
      {"\n    Ready to calculate\n  "}
    </text>
    <text
      x={160}
      y={228}
      textAnchor="middle"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      fontSize={12}
      fill="#94a3b8"
    >
      {"\n    Fill in your details and click\n  "}
    </text>
    <text
      x={160}
      y={246}
      textAnchor="middle"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      fontSize={12}
      fill="#94a3b8"
    >
      {"\n    the Calculate button to see results.\n  "}
    </text>
  </svg>
);
export default EmptyStateSvg;
