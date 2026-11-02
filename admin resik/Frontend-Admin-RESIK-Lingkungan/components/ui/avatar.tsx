import { getInitials } from "@/lib/utils";

const COLORS = ["bg-teal-600", "bg-orange-500", "bg-indigo-500", "bg-rose-500", "bg-emerald-600", "bg-sky-600"];

export default function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const color = COLORS[name.length % COLORS.length];
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${color}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {getInitials(name)}
    </div>
  );
}