import React, { useState } from 'react';
import { FlightAppProvider, useFlightApp } from './context/FlightAppContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Breadcrumbs } from './components/Breadcrumbs';

// Views
import { DashboardView } from './views/DashboardView';
import { FlightsModule } from './views/FlightsModule';
import { PassengersModule } from './views/PassengersModule';
import { TicketsModule } from './views/TicketsModule';
import { SeatsModule } from './views/SeatsModule';
import { CheckInModule } from './views/CheckInModule';
import { BaggageModule } from './views/BaggageModule';
import { BookingWizardView } from './views/BookingWizardView';

const MainLayout: React.FC = () => {
  const { nav, toast, clearToast } = useFlightApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Render view router based on hierarchical state
  const renderView = () => {
    switch (nav.module) {
      case 'dashboard':
        return <DashboardView />;
      case 'flights':
        return <FlightsModule />;
      case 'passengers':
        return <PassengersModule />;
      case 'tickets':
        return <TicketsModule />;
      case 'seats':
      case 'seatmap':
        return <SeatsModule />;
      case 'checkin':
        return <CheckInModule />;
      case 'baggage':
      case 'baggagescans':
        return <BaggageModule />;
      case 'bookingwizard':
        return <BookingWizardView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* Sidebar (Fixed on right for RTL) */}
      <Sidebar 
        isOpenMobile={isMobileMenuOpen} 
        onCloseMobile={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main Content Area (With right margin on large screens to accommodate fixed 72-width sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 lg:mr-72">
        {/* Top Header */}
        <TopBar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Breadcrumb Trail */}
        <Breadcrumbs />

        {/* Viewport Content */}
        <main className="flex-1 pb-16">
          {renderView()}
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <span className={`w-2 h-2 rounded-full ${
            toast.type === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
          }`} />
          <span>{toast.message}</span>
          <button 
            onClick={clearToast}
            className="text-slate-400 hover:text-white mr-2 text-sm leading-none"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <FlightAppProvider>
      <MainLayout />
    </FlightAppProvider>
  );
}
