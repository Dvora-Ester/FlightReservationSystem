import React from 'react';
import { Menu, Plus, Plane, Search, ShieldCheck } from 'lucide-react';
import { useFlightApp } from '../context/FlightAppContext';

interface TopBarProps {
  onOpenMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileMenu }) => {
  const { navigateTo } = useFlightApp();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Zone 1: Mobile toggle & Brand label */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="פתח תפריט"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 text-lg tracking-tight">
            FlightReservationSystem
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60">
            <ShieldCheck className="w-3 h-3 text-sky-600" />
            <span>סקיצה אינטראקטיבית</span>
          </span>
        </div>
      </div>

      {/* Zone 2: Informative Context & Quick Search indicator */}
      <div className="hidden md:flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
          <Plane className="w-3.5 h-3.5 text-sky-600" />
          <span>TLV Hub · נמל התעופה בן גוריון</span>
        </div>
      </div>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => navigateTo('bookingwizard')}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>הזמנת כרטיס חדשה (Wizard)</span>
        </button>
      </div>
    </header>
  );
};
