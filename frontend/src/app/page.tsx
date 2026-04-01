import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CarsGrid } from "@/components/CarsGrid";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { fetchCars } from "@/lib/api";

export const revalidate = 3600; // ISR: revalidate every hour

async function CarsSection() {
  let data;
  try {
    data = await fetchCars();
  } catch {
    return (
      <div className="text-center py-20 text-muted">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-display text-xl text-white/70 mb-2">Backend Unavailable</p>
        <p className="text-sm">Make sure the FastAPI server is running on port 8000.</p>
        <code className="mt-3 block text-xs bg-surface border border-border rounded-lg px-4 py-2 inline-block">
          cd backend && uvicorn main:app --reload
        </code>
      </div>
    );
  }

  return (
    <>
      <AnnouncementBanner />
      <Hero />
      <CarsGrid cars={data.cars} />
    </>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Suspense fallback={<HeroSkeleton />}>
          <CarsSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="pt-20 pb-16 text-center">
      <div className="skeleton h-4 w-40 rounded-full mx-auto mb-6" />
      <div className="skeleton h-14 w-80 rounded-xl mx-auto mb-3" />
      <div className="skeleton h-14 w-56 rounded-xl mx-auto mb-5" />
      <div className="skeleton h-5 w-96 rounded-lg mx-auto" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4 text-center text-muted text-sm">
      <p>
        Data sourced from{" "}
        <a href="https://www.encar.com" className="text-accent hover:underline" target="_blank" rel="noreferrer">
          Encar.com
        </a>
        {" · "}MVP built with Next.js + FastAPI
      </p>
    </footer>
  );
}
