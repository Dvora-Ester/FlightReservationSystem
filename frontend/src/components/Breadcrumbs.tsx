import React from 'react';
import { ChevronLeft, ArrowRight, Home } from 'lucide-react';
import { useFlightApp } from '../context/FlightAppContext';
import { ActiveModule } from '../types';

export const Breadcrumbs: React.FC = () => {
  const { nav, navigateTo, goBack } = useFlightApp();

  const moduleTitles: Record<ActiveModule, { hebrew: string; tech: string }> = {
    dashboard: { hebrew: 'מסך ראשי', tech: 'Dashboard' },
    flights: { hebrew: 'טיסות', tech: 'FLIGHT' },
    passengers: { hebrew: 'נוסעים', tech: 'PASSENGER' },
    tickets: { hebrew: 'כרטיסים והזמנות', tech: 'TICKET' },
    seats: { hebrew: 'מושבים', tech: 'SEAT' },
    checkin: { hebrew: 'צ׳ק-אין', tech: 'CHECKIN' },
    baggage: { hebrew: 'מזוודות', tech: 'BAGGAGE' },
    seatmap: { hebrew: 'מפת מושבים', tech: 'SeatMap' },
    baggagescans: { hebrew: 'היסטוריית סריקות', tech: 'BAGGAGESCAN' },
    bookingwizard: { hebrew: 'תהליך הזמנה שלב-אחר-שלב', tech: 'BookingWizard' }
  };

  const currentModuleInfo = moduleTitles[nav.module] || { hebrew: nav.module, tech: '' };

  const isAtRoot = nav.module === 'dashboard';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 sm:px-6 bg-white border-b border-slate-200">
      {/* Breadcrumb Trail */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        {/* Level 0: Dashboard */}
        <button
          onClick={() => navigateTo('dashboard', 'list')}
          className={`flex items-center gap-1 hover:text-slate-900 transition-colors ${
            isAtRoot ? 'font-semibold text-slate-900' : ''
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>ראשי</span>
        </button>

        {!isAtRoot && (
          <>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-300 shrink-0" />

            {/* Level 1: Module */}
            <button
              onClick={() => navigateTo(nav.module, 'list')}
              className={`hover:text-slate-900 transition-colors ${
                nav.subView === 'list' && !nav.selectedId ? 'font-semibold text-slate-900' : ''
              }`}
            >
              <span>{currentModuleInfo.hebrew}</span>
              <span className="text-[10px] text-slate-400 mr-1 font-mono">({currentModuleInfo.tech})</span>
            </button>
          </>
        )}

        {/* Level 2: Subview / Item Details / Form */}
        {nav.subView && nav.subView !== 'list' && (
          <>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            
            {nav.subView === 'details' && (
              <span className="font-semibold text-slate-900 flex items-center gap-1">
                <span>פרטי פריט</span>
                {nav.selectedId && (
                  <span className="font-mono text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded text-[11px]">
                    {nav.selectedId}
                  </span>
                )}
              </span>
            )}

            {nav.subView === 'form' && (
              <span className="font-semibold text-slate-900">
                {nav.action === 'create' ? 'הוספת רשומה חדשה' : `עריכת רשומה ${nav.selectedId || ''}`}
              </span>
            )}
          </>
        )}

        {/* Level 3: Contextual nested deep views */}
        {nav.flightIdForSeatMap && (
          <>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="font-mono text-xs text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
              טיסה: {nav.flightIdForSeatMap}
            </span>
          </>
        )}

        {nav.baggageIdForScans && (
          <>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="font-mono text-xs text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
              תג כבודה: {nav.baggageIdForScans}
            </span>
          </>
        )}
      </nav>

      {/* Quick Back Action */}
      {!isAtRoot && (
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>חזור למסך הקודם</span>
        </button>
      )}
    </div>
  );
};
