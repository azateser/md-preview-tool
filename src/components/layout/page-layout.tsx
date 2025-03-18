"use client";

import { Header } from "./header";
import { Footer } from "./footer";

type PageLayoutProps = {
  children: React.ReactNode;
  activePage?: "home" | "changelog" | "feedback" | "docs";
};

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {children}
      </main>

    <Footer />
    </div>
  );
} 