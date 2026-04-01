"use client";

import { useState } from "react";

const socials = [
  {
    name: "Instagram",
    href: "https://instagram.com/millionmil.es?igshid=YTQwZjQ0NmI0OA%3D%3D&utm_source=qr",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4.5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/Million_Miles_1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.8 2.2L1.4 10c-.8.3-.8 1.1 0 1.4l5.1 1.7 1.9 5.8c.2.7 1 .9 1.5.4l2.8-2.6 5.4 4c.6.4 1.4.1 1.6-.6l3.1-16.5c.2-.9-.6-1.7-1.5-1.4zM9 14.5l-.8 3.2-1.5-4.6L18 6.3 9 14.5z"/>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://chatapp.online/utm-redirect?channel=WhatsApp&directionTo=79260777711&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%2C+%D0%BD%D0%BE%D0%BC%D0%B5%D1%80+%D0%BC%D0%BE%D0%B5%D0%B9+%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8+SI8NGkaOBzU.+%D0%A0%D0%B0%D1%81%D1%81%D0%BC%D0%B0%D1%82%D1%80%D0%B8%D0%B2%D0%B0%D1%8E+%D0%BF%D1%80%D0%B8%D0%BE%D0%B1%D1%80%D0%B5%D1%82%D0%B5%D0%BD%D0%B8%D0%B5+%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%BE%D0%B1%D0%B8%D0%BB%D1%8F+%D1%81+%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%BE%D0%B9+%D0%B8%D0%B7-%D0%B7%D0%B0+%D1%80%D1%83%D0%B1%D0%B5%D0%B6%D0%B0.+%D0%9F%D1%80%D0%BE%D1%88%D1%83+%D1%81%D0%B2%D1%8F%D0%B7%D0%B0%D1%82%D1%8C%D1%81%D1%8F+%D0%B4%D0%BB%D1%8F+%D1%83%D1%82%D0%BE%D1%87%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F+%D0%B4%D0%B5%D1%82%D0%B0%D0%BB%D0%B5%D0%B9.&clientId=SI8NGkaOBzU",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4C7.6 7.8 7 8.7 7 10.3s1.1 3.1 1.2 3.3c.1.2 2.1 3.3 5.2 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.6.2-1.2.1-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 1 8.7 14.9L22 22l-5.2-1.3A10 10 0 1 1 12 2z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@millionmil-es?si=-FlC5l56-Wfu1_GY",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.6 7.2s-.2-1.5-.9-2.1c-.8-.9-1.8-.9-2.2-.9C15.6 4 12 4 12 4s-3.6 0-6.5.2c-.4 0-1.4.1-2.2.9-.7.7-.9 2.1-.9 2.1S2 8.9 2 10.5v1.5c0 1.6.2 3.3.2 3.3s.2 1.5.9 2.1c.8.9 1.9.8 2.4.9C7 18.4 12 18.5 12 18.5s3.6 0 6.5-.2c.4 0 1.4-.1 2.2-.9.7-.7.9-2.1.9-2.1S22 13.6 22 12v-1.5c0-1.6-.2-3.3-.2-3.3zM10 14.5v-5l5.5 2.5-5.5 2.5z"/>
      </svg>
    ),
  },
  {
    name: "VKontakte",
    href: "https://vk.com/million.miles",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.7 17.3h1.4s.4 0 .6-.3c.2-.2.2-.6.2-.6s0-1.8.8-2.1c.8-.2 1.9 1.8 3 2.5.8.6 1.5.5 1.5.5l3-.1s1.6-.1.8-1.3c-.1-.2-.5-.9-2.2-2.5-1.8-1.7-1.6-1.4.6-4.3 1.4-1.8 1.9-2.9 1.7-3.4-.2-.5-1.2-.3-1.2-.3l-3.4.1s-.3 0-.4.1c-.2.1-.3.4-.3.4s-.5 1.4-1.2 2.5c-1.4 2.4-2 2.5-2.2 2.4-.5-.3-.4-1.4-.4-2.1 0-2.3.3-3.2-.7-3.5-.3-.1-.6-.1-1.4-.1-1.1 0-2 0-2.5.3-.3.2-.6.6-.4.6.2 0 .7.1 1 .5.4.5.4 1.5.4 1.5s.2 2.7-.5 3c-.5.2-1.2-.2-2.6-2.5C5.6 7.2 5.1 6 5.1 6s-.1-.3-.3-.4c-.2-.1-.6-.2-.6-.2L.9 5.5S.3 5.5.1 5.8C0 6-.1 6.4.3 7.4c1.7 3.9 5 8 8.3 8z"/>
      </svg>
    ),
  },
];

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {open ? (
        <>
          <line x1="4" y1="4" x2="18" y2="18" />
          <line x1="18" y1="4" x2="4" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="7" x2="19" y2="7" />
          <line x1="3" y1="11" x2="19" y2="11" />
          <line x1="3" y1="15" x2="19" y2="15" />
        </>
      )}
    </svg>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="border-b border-border bg-carbon/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          <a href="/" className="z-20 cursor-pointer shrink-0">
            <img
              src="/MillionMiles.svg"
              alt="Million Miles Logo"
              className="w-[140px] sm:w-[176px] h-[34px] object-contain"
            />
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
            <a href="#" className="hover:text-white transition-colors">Browse</a>
            <a href="#" className="hover:text-white transition-colors">Sell</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-1.5">

            <div className="hidden md:flex items-center gap-0.5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex size-9 items-center justify-center rounded-md 
                             text-muted hover:text-white hover:bg-surface
                             transition-colors duration-200"
                >
                  {s.icon}
                  <span className="sr-only">{s.name}</span>
                </a>
              ))}
            </div>

            <div className="hidden md:block w-px h-5 bg-border mx-1" />

            <div className="flex md:hidden items-center gap-0.5">
              {socials.slice(0, 2).map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex size-9 items-center justify-center rounded-md
                             text-muted hover:text-white hover:bg-surface
                             transition-colors duration-200"
                >
                  {s.icon}
                  <span className="sr-only">{s.name}</span>
                </a>
              ))}
            </div>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex size-9 items-center justify-center rounded-md
                         text-muted hover:text-white hover:bg-surface transition-colors"
              aria-label="Toggle menu"
            >
              <BurgerIcon open={menuOpen} />
            </button>

          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 z-40 bg-obsidian/95 backdrop-blur-md
                     flex flex-col px-6 pt-8 pb-10 gap-6"
          onClick={() => setMenuOpen(false)}
        >
          <nav className="flex flex-col gap-1">
            {["Browse", "Sell", "About"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-lg font-medium text-white/80 hover:text-white 
                           py-3 border-b border-border transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div>
            <p className="text-xs text-muted uppercase tracking-widest mb-3">Follow us</p>
            <div className="flex items-center gap-2 flex-wrap">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex size-11 items-center justify-center rounded-xl
                             bg-surface border border-border text-muted 
                             hover:text-white hover:border-accent/40
                             transition-colors duration-200"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  {s.icon}
                  <span className="sr-only">{s.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}