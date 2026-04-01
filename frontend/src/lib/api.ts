export interface Car {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  price: string;
  image: string;
  detail_url: string;
  scraped_at: string;
}

export interface CarsResponse {
  updated_at: string;
  count: number;
  cars: Car[];
}

const API_BASE = "http://localhost:8000";

export async function fetchCars(): Promise<CarsResponse> {
  const res = await fetch(`${API_BASE}/cars`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
