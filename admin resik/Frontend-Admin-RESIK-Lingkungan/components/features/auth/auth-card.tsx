import Image from "next/image";

export const inputClass =
  "w-full rounded-lg border border-transparent bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-forest";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-sm rounded-2xl bg-sand p-8 shadow-lg">
      <Image
        src="/Overlay.png"
        alt="Logo RESIK"
        width={40}
        height={40}
        priority
        className="mx-auto mb-4"
      />
      <h1 className="text-center text-lg font-bold text-forest">{title}</h1>
      <p className="mb-6 mt-1 text-center text-xs text-forest/70">{subtitle}</p>
      {children}
    </div>
  );
}