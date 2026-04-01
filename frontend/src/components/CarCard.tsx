"use client";

import { Car } from "@/lib/api";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const title = [car.brand, car.model].filter(Boolean).join(" ") || "Unknown Vehicle";

  return (
    <article
      className="car-card group relative bg-surface border border-border rounded-2xl overflow-hidden 
                 opacity-0 animate-fade-up hover:border-accent/40 transition-all duration-400
                 hover:shadow-[0_0_40px_rgba(201,168,76,0.08)] hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-52 bg-carbon overflow-hidden">
        {car.image ? (
          <img
            src={car.image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted">
            <CarPlaceholder />
          </div>
        )}

        {/* Year badge */}
        <div className="absolute top-3 left-3 bg-obsidian/80 backdrop-blur-sm border border-border 
                        text-xs font-semibold text-accent px-2.5 py-1 rounded-full">
          {car.year}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg leading-tight text-white group-hover:text-accent 
                       transition-colors duration-200 line-clamp-1 mb-3">
          {title}
        </h3>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm text-muted mb-5">
          <span className="flex items-center gap-1.5">
            <OdometerIcon />
            {car.mileage}
          </span>
          <span className="w-px h-3 bg-border" />
          <span className="flex items-center gap-1.5">
            <CalendarIcon />
            {car.year}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted uppercase tracking-widest mb-0.5">Price</p>
            <p className="text-accent font-display text-xl font-semibold">{car.price}</p>
          </div>

          <a
            href={car.detail_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-accent hover:bg-accent/90 text-obsidian text-sm font-bold 
                       px-4 py-2.5 rounded-xl transition-all duration-200 
                       hover:shadow-[0_0_20px_rgba(201,168,76,0.35)] active:scale-95"
          >
            View Details
          </a>
        </div>
      </div>
    </article>
  );
}

export function CarCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="skeleton h-52 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-1/2 rounded-lg" />
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-7 w-1/3 rounded-lg" />
          <div className="skeleton h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function OdometerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
      <path d="m12 12 4-4"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  );
}

function CarPlaceholder() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M5 17H3a2 2 0 0 1-2-2v-4l2-5h14l2 5v4a2 2 0 0 1-2 2h-2"/>
      <circle cx="7.5" cy="17.5" r="2.5"/>
      <circle cx="16.5" cy="17.5" r="2.5"/>
    </svg>
  );
}