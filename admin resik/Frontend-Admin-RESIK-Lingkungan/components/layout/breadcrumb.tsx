export default function Breadcrumb({ section, crumb }: { section: string; crumb: string }) {
  return (
    <p className="text-[11px] text-gray-500">
      {section} <span className="mx-1">&gt;</span>
      <span className="font-medium text-forest">{crumb}</span>
    </p>
  );
}