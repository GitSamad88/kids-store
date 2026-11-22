import Link from "next/link";

export default function CategoryCard({
  name,
  href
}: {
  name: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center py-6 px-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
    >
      <h4 className="text-lg font-semibold text-slate-900">{name}</h4>
      <span className="mt-2 text-sm text-slate-600">Catégorie</span>
    </Link>
  );
}