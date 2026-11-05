import React from 'react';
import { 
  Plane, 
  Users, 
  Ticket as TicketIcon, 
  Armchair, 
  CheckCircle2, 
  Luggage, 
  LayoutDashboard, 
  Compass, 
  PlusCircle, 
  RotateCcw,
  Layers,
  MapPin,
  ChevronLeft
} from 'lucide-react';
import { useFlightApp } from '../context/FlightAppContext';
import { ActiveModule } from '../types';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { 
    nav, 
    navigateTo, 
    flights, 
    passengers, 
    tickets, 
    checkins, 
    baggages,
    resetToMockData
  } = useFlightApp();

  const handleNav = (module: ActiveModule) => {
    navigateTo(module, 'list');
    onCloseMobile();
  };

  const navItems = [
    {
      id: 'dashboard' as ActiveModule,
      label: 'מסך ראשי (Dashboard)',
      tech: 'רמה 0 - מבט על',
      icon: LayoutDashboard,
      count: null
    },
    {
      id: 'flights' as ActiveModule,
      label: 'טיסות (Flight)',
      tech: 'FLIGHT',
      icon: Plane,
      count: flights.length
    },
    {
      id: 'passengers' as ActiveModule,
      label: 'נוסעים (Passenger)',
      tech: 'PASSENGER',
      icon: Users,
      count: passengers.length
    },
    {
      id: 'tickets' as ActiveModule,
      label: 'כרטיסים והזמנות (Ticket)',
      tech: 'TICKET',
      icon: TicketIcon,
      count: tickets.length
    },
    {
      id: 'seats' as ActiveModule,
      label: 'מושבים (Seat)',
      tech: 'SEAT (ישות חלשה)',
      icon: Armchair,
      count: null
    },
    {
      id: 'checkin' as ActiveModule,
      label: 'צ׳ק-אין (CheckIn)',
      tech: 'CHECKIN',
      icon: CheckCircle2,
      count: checkins.length
    },
    {
      id: 'baggage' as ActiveModule,
      label: 'מזוודות (Baggage)',
      tech: 'BAGGAGE',
      icon: Luggage,
      count: baggages.length
    }
  ];

  const deepWorkflows = [
    {
      id: 'bookingwizard' as ActiveModule,
      label: 'תהליך הזמנה מלא',
      sublabel: 'Wizard רב-שלבי',
      icon: PlusCircle,
      accent: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40'
    },
    {
      id: 'seatmap' as ActiveModule,
      label: 'מפת מושבי טיסה',
      sublabel: 'תא נוסעים אינטראקטיבי',
      icon: Layers,
      accent: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
    },
    {
      id: 'baggagescans' as ActiveModule,
      label: 'היסטוריית סריקות כבודה',
      sublabel: 'BaggageScan מעקב',
      icon: Compass,
      accent: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 right-0 z-50 w-72 bg-white border-l border-slate-200 
        flex flex-col transition-transform duration-200 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Lockup */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Plane className="w-5 h-5 rotate-45" />
            </div>
            <div>
              <div className="font-bold text-slate-900 tracking-tight text-base leading-none">
                FlightReservation
              </div>
              <div className="text-xs text-sky-600 font-medium mt-1">
                מערכת לניהול טיסות והזמנות
              </div>
            </div>
          </div>
          <button 
            onClick={onCloseMobile} 
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Modules (Level 1) */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              מודולים ראשיים
            </div>
            <nav className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = nav.module === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-sky-50 text-sky-800 font-semibold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                      <div className="truncate text-right">
                        <div>{item.label}</div>
                      </div>
                    </div>
                    {item.count !== null && (
                      <span className={`text-xs tabular-nums px-2 py-0.5 rounded-full ${isActive ? 'bg-sky-200/70 text-sky-900' : 'bg-slate-100 text-slate-500'}`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Deep Workflows (Level 3) */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              תהליכי עומק ומסכים ייעודיים
            </div>
            <div className="space-y-1.5">
              {deepWorkflows.map(item => {
                const Icon = item.icon;
                const isActive = nav.module === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`
                      w-full flex items-center justify-between p-2.5 rounded-lg text-right text-xs transition-all border
                      ${isActive 
                        ? 'border-sky-500 bg-sky-50/80 shadow-xs' 
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-md ${item.accent}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-xs">{item.label}</div>
                        <div className="text-[11px] text-slate-500">{item.sublabel}</div>
                      </div>
                    </div>
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-300" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Architecture Info Box */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1.5">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>מבנה נתונים יחסי (Relational)</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              הנתונים מקושרים באמצעות מפתחות טכניים (PK/FK). שינויים נשמרים מקומית בזמן אמת.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 flex flex-col gap-2">
          <button
            onClick={() => {
              if (window.confirm('האם לאתחל את כל נתוני המערכת לברירת המחדל?')) {
                resetToMockData();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>איפוס נתוני דוגמה (Reset Mock)</span>
          </button>
          
          <div className="text-center text-[10px] text-slate-400">
            FlightReservationSystem Prototype v0.9 · RTL
          </div>
        </div>
      </aside>
    </>
  );
};
