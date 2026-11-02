"use client";

export default function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-lg bg-gray-100 p-0.5 text-xs">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-md px-3 py-1 font-medium transition ${
            value === o ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}