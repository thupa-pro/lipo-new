import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loconomy - Premium Local Services Marketplace",
  description: "Connect with verified local service providers. AI-powered matching for home services, tech support, tutoring, and more.",
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale || "en"} className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-stratosphere via-cirrus to-white dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
          {/* Global Neural Background Pattern */}
          <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--neural-500)) 2px, transparent 0),
                               radial-gradient(circle at 75px 75px, hsl(var(--quantum-500)) 1px, transparent 0)`,
              backgroundSize: '100px 100px'
            }} />
          </div>
          
          <main className="relative z-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
