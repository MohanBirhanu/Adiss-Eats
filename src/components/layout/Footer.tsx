import React from 'react';
import { Link } from '@/src/lib/router';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white text-xl">
                🍲
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Addis Eats
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Addis Ababa&apos;s premier food platform bringing together the finest Ethiopian
              traditional stews, artisan pizzas, gourmet burgers, and fresh specialty coffee.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Halal & Fresh Ingredients
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Explore Menu
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/menu?category=Ethiopian" className="hover:text-amber-400 transition-colors">
                  Traditional Ethiopian Stews & Tibs
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Pizza" className="hover:text-amber-400 transition-colors">
                  Artisan Wood-Fired Pizzas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Burgers" className="hover:text-amber-400 transition-colors">
                  Smash & Gourmet Chicken Burgers
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Drinks" className="hover:text-amber-400 transition-colors">
                  Specialty Yirgacheffe Coffee & Spris
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-amber-400 transition-colors">
                  My Favorite Dishes
                </Link>
              </li>
            </ul>
          </div>

          {/* Delivery Hubs */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Addis Delivery Zones
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Bole & Edna Mall (20–30 min)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Kazanchis & UNECA (25–35 min)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Piassa & Churchill (30–40 min)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>CMC, Ayat & Megenagna (35–45 min)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Sarbet, Mexico & Gerji</span>
              </li>
            </ul>
          </div>

          {/* Kitchen Hours & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Kitchen Hours & Hotline
            </h4>
            <div className="space-y-2 text-sm text-stone-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Daily Service</div>
                  <div>10:00 AM – 11:30 PM (EAT)</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-mono text-white font-semibold">+251 91 123 4567</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>orders@addiseats.et</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-block text-xs text-stone-500 hover:text-stone-300 underline underline-offset-4"
                >
                  Restaurant Partner & Admin Portal
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Addis Eats Delivery PLC. All rights reserved. Addis Ababa, Ethiopia.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for food lovers in Addis Ababa
          </p>
        </div>
      </div>
    </footer>
  );
}
