export function ProgressDonut({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const percentage = (current / total) * 100;

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      {/* Simple SVG Circle */}
      <svg className="h-full w-full -rotate-90 transform">
        <circle
          cx="72"
          cy="72"
          r="60"
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-slate-100"
        />
        <circle
          cx="72"
          cy="72"
          r="60"
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={377}
          strokeDashoffset={377 - (377 * percentage) / 100}
          className="text-slate-300 transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-sm font-bold text-slate-700">
          <span className="text-lg">{current}</span>/{total}
        </span>
        <span className="text-[10px] font-bold text-slate-500 uppercase">
          Checklist
        </span>
      </div>
    </div>
  );
}
