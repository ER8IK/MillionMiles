export function AnnouncementBanner() {
  return (
    <a
      href="https://millionmiles.ae"
      target="_blank"
      rel="noopener noreferrer"
      className="group w-full h-9 sm:h-10 bg-[#f5c518] hover:bg-[#ffd84d]
                 text-black font-bold flex items-center justify-center 
                 gap-1.5 transition-colors duration-200 px-4"
    >
      <span className="sm:hidden text-[11px] text-center leading-tight">
        Cars from around the world — prices will surprise you
      </span>

      <span className="hidden sm:inline text-sm whitespace-nowrap">
        Thousands of cars from around the world on order — and the prices will surprise you
      </span>

      <svg
        className="shrink-0 size-3 sm:size-4 transition-transform duration-300
                   group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        viewBox="0 0 24 24" fill="none"
      >
        <path
          d="M7 17L17 7M17 7H8M17 7V16"
          stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}