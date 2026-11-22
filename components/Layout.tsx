import { PropsWithChildren } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-full bg-background text-foreground">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
