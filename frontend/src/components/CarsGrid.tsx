import { Car } from "@/lib/api";
import { CarCard, CarCardSkeleton } from "./CarCard";

interface CarsGridProps {
  cars: Car[];
}

export function CarsGrid({ cars }: CarsGridProps) {
  if (!cars || cars.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🚗</p>
        <p className="font-display text-xl text-white/70 mb-2">No cars found</p>
        <p className="text-muted text-sm">Run the parser to populate data.</p>
        <code className="mt-3 block text-xs bg-surface border border-border rounded-lg px-4 py-2 inline-block">
          cd backend && python parser.py
        </code>
      </div>
    );
  }

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-bold">
          Available{" "}
          <span className="text-accent">Listings</span>
        </h2>
        <span className="text-muted text-sm">{cars.length} vehicles</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cars.map((car, i) => (
          <CarCard key={`${car.brand}-${car.model}-${i}`} car={car} />
        ))}
      </div>
    </section>
  );
}

export function CarsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}
