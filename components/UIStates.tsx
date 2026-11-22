import Link from "next/link";
import { Shield, Package } from "lucide-react";

export function LoadingState({ message = "Chargement en cours..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-600 font-medium">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = "Aucun résultat trouvé",
  description = "Nous n'avons trouvé aucun article correspondant à votre recherche.",
  actionLabel = "Retour à l'accueil",
  actionHref = "/"
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
      <div className="bg-slate-50 text-primary p-4 rounded-full mb-4">
        <Package className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-6">{description}</p>
      <Link
        href={actionHref}
        className="bg-primary hover:bg-primary-700 text-white font-medium px-6 py-2.5 rounded-full text-sm transition-colors shadow-sm"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

export function ErrorState({
  title = "Une erreur est survenue",
  description = "Impossible de charger les données pour le moment. Veuillez réessayer.",
  onRetry
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
      <div className="bg-slate-50 text-red-500 p-4 rounded-full mb-4">
        <Shield className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-6">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-2.5 rounded-full text-sm transition-colors shadow-sm"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
