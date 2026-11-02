import type { LucideIcon } from "lucide-react";
type Props = {
  icon: LucideIcon;
  iconClass: string;
  label: string;
  value: string;
  unit?: string;
  caption?: string;
  progress?: number;
};

export default function StatCard({ icon: Icon, iconClass, label, value, unit, caption, progress }: Props) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <div className={`rounded-lg p-2 ${iconClass}`}>
          <Icon size={16} />
        </div>
        {caption && (
          <span className="max-w-[55%] text-right text-[10px] font-semibold text-emerald-600">
            {caption}
          </span>
        )}
      </div>
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="text-xl font-bold text-forest">
        {value}
        {unit && <span className="ml-1 text-xs font-normal text-gray-500">{unit}</span>}
      </p>
      {progress !== undefined && (
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
          role="progressbar"
          aria-label={`${label}: ${progress}%`}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full rounded-full bg-emerald-600" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}