/* ─── Shimmer keyframe (injected once via a <style> tag) ───── */
const shimmerStyle = `
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
    background-size: 800px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 0.375rem;
  }
`;

const STAT_KEYS = ["stat-1", "stat-2", "stat-3", "stat-4"];
const ROW_KEYS = ["row-1", "row-2", "row-3", "row-4", "row-5", "row-6"];

function SkeletonScreen() {
  return (
    <>
      <style>{shimmerStyle}</style>

      <div className="w-full space-y-5 p-5 animate-pulse">
        {/* Header bar */}
        <div className="skeleton h-10 w-full rounded-xl" />

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STAT_KEYS.map((key) => (
            <div key={key} className="skeleton h-20 rounded-xl" />
          ))}
        </div>

        {/* Table rows */}
        <div className="space-y-3">
          {ROW_KEYS.map((key) => (
            <div key={key} className="flex gap-3 items-center">
              <div className="skeleton h-4 w-8 rounded" />
              <div className="skeleton h-4 flex-1 rounded" />
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-4 w-16 rounded" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

interface LoadingProps {
  skeleton?: boolean;
  fullPage?: boolean;
  message?: string;
  size?: number;
}
export default function Loading({
  skeleton = false,
  fullPage = false,
  message = "Loading…",
  size = 40,
}: LoadingProps) {
  if (skeleton) {
    return <SkeletonScreen />;
  }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <span
        style={{ width: size, height: size }}
        className="inline-block rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin"
      />
      {message && (
        <span className="text-sm text-gray-500 font-medium">{message}</span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full py-12">
      {spinner}
    </div>
  );
}
