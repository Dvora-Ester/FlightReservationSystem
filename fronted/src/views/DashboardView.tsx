import React from 'react';
import { 
  Plane, 
  Users, 
  Ticket as TicketIcon, 
  Armchair, 
  CheckCircle2, 
  Luggage, 
  ArrowLeft, 
  Clock, 
  Layers, 
  Plus, 
  Search,
  Activity,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useFlightApp } from '../context/FlightAppContext';

export const DashboardView: React.FC = () => {
  const { 
    flights, 
    passengers, 
    tickets, 
    checkins, 
    baggages, 
    baggageScans,
    navigateTo 
  } = useFlightApp();

  // Metrics
  const upcomingFlights = flights.filter(f => f.flight_status !== 'Landed' && f.flight_status !== 'Cancelled');
  const activeTickets = tickets.filter(t => t.ticket_status !== 'Cancelled' && t.ticket_status !== 'Refunded');
  const checkedInCount = tickets.filter(t => t.ticket_status === 'Checked-In' || t.ticket_status === 'Boarded').length;
  const transitBaggage = baggages.filter(b => b.status === 'Loaded' || b.status === 'In Transit' || b.status === 'Checked');

  const statCards = [
    {
      title: 'טיסות קרובות ופעילות',
      techName: 'FLIGHT',
      value: upcomingFlights.length,
      subtext: `${flights.length} טיסות מתוזמנות בסך הכל`,
      icon: Plane,
      color: 'sky',
      onClick: () => navigateTo('flights', 'list')
    },
    {
      title: 'כרטיסים והזמנות פעילות',
      techName: 'TICKET',
      value: activeTickets.length,
      subtext: `${tickets.filter(t => t.fare_class.includes('Business') || t.fare_class.includes('First')).length} במחלקת פרימיום`,
      icon: TicketIcon,
      color: 'indigo',
      onClick: () => navigateTo('tickets', 'list')
    },
    {
      title: 'רישומי צ׳ק-אין שבוצעו',
      techName: 'CHECKIN',
      value: checkins.length,
      subtext: `${checkedInCount} כרטיסים סומנו כעלו/נרשמו`,
      icon: CheckCircle2,
      color: 'emerald',
      onClick: () => navigateTo('checkin', 'list')
    },
    {
      title: 'כבודה ומזוודות בתנועה',
      techName: 'BAGGAGE',
      value: transitBaggage.length,
      subtext: `${baggageScans.length} אירועי סריקה מתועדים`,
      icon: Luggage,
      color: 'amber',
      onClick: () => navigateTo('baggage', 'list')
    }
  ];

  const modules = [
    {
      id: 'flights',
      title: 'ניהול טיסות',
      tech: 'FLIGHT',
      desc: 'לוח זמני המראות ונחיתות, מסלולים, דגמי מטוסים ושערים',
      icon: Plane,
      count: flights.length,
      unit: 'טיסות'
    },
    {
      id: 'passengers',
      title: 'נוסעים ופרופילים',
      tech: 'PASSENGER',
      desc: 'מספרי דרכונים, פרטים אישיים, העדפות מזון וסיוע',
      icon: Users,
      count: passengers.length,
      unit: 'נוסעים'
    },
    {
      id: 'tickets',
      title: 'כרטיסים והזמנות',
      tech: 'TICKET',
      desc: 'תמחור, מחלקות כרטוס, שיוך נוסע-מושב וסטטוס',
      icon: TicketIcon,
      count: tickets.length,
      unit: 'כרטיסים'
    },
    {
      id: 'seats',
      title: 'מושבים ותצורת מטוס',
      tech: 'SEAT',
      desc: 'מיקומי מושבים (חלון/מעבר), מחלקות שירות ותפוסה',
      icon: Armchair,
      count: 'תצוגה חיה',
      unit: 'מפה גרפית'
    },
    {
      id: 'checkin',
      title: 'צ׳ק-אין ועלייה למטוס',
      tech: 'CHECKIN',
      desc: 'ערוצי קבלה (אונליין, קיוסק, דלפק), קבוצות עלייה ושעות',
      icon: CheckCircle2,
      count: checkins.length,
      unit: 'רישומים'
    },
    {
      id: 'baggage',
      title: 'כבודה וסריקות',
      tech: 'BAGGAGE / BAGGAGESCAN',
      desc: 'תגיות ברקוד, משקלים, טיפול מיוחד והיסטוריית תחנות סריקה',
      icon: Luggage,
      count: baggages.length,
      unit: 'מזוודות'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            מסך ראשי · מבט על (Dashboard)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            סקיצה היררכית לניהול מערך הטיסות, ההזמנות, תפוסת המושבים ובקרת הכבודה
          </p>
        </div>

        {/* Quick Deep Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('bookingwizard')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>הזמנה מלאה (Wizard)</span>
          </button>
          <button
            onClick={() => navigateTo('seatmap', 'list', undefined, 'view', { flightIdForSeatMap: 'LY001' })}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>מפת מושבים</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.onClick}
              className="p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-500">{card.title}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">{card.techName}</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                  {card.value}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                <span>{card.subtext}</span>
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 6 Main Modules Navigation Grid (Level 1 Portals) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              מודולים ראשיים (Level 1 Modules)
            </h2>
            <p className="text-xs text-slate-500">
              מעבר מהיר אל ישויות הליבה במערכת לניהול וצפייה
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => navigateTo(m.id as any, 'list')}
                className="p-5 bg-white border border-slate-200 rounded-xl hover:border-sky-300 hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition-colors">
                        {m.title}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {m.tech}
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-800 tabular-nums">
                      {m.count}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {m.unit}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {m.desc}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-medium">
                  <span>כניסה לרשימה וניהול</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Upcoming Flights & Live Baggage Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Flights Preview */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">טיסות קרובות להמראה/נחיתה</h3>
              <span className="text-xs text-slate-400">FLIGHT · נתונים בזמן אמת</span>
            </div>
            <button
              onClick={() => navigateTo('flights', 'list')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              לכל הטיסות ({flights.length})
            </button>
          </div>

          <div className="space-y-3">
            {flights.slice(0, 4).map(flight => (
              <div 
                key={flight.flight_id}
                onClick={() => navigateTo('flights', 'details', flight.flight_id)}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2 py-1 rounded">
                    {flight.flight_id}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{flight.flight_name}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{flight.origin} ← {flight.destination}</span>
                      <span>·</span>
                      <span className="tabular-nums">{flight.departure_time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    flight.flight_status === 'Boarding' ? 'bg-amber-100 text-amber-800' :
                    flight.flight_status === 'In Flight' ? 'bg-sky-100 text-sky-800' :
                    flight.flight_status === 'Departed' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-slate-200/80 text-slate-700'
                  }`}>
                    {flight.flight_status}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('seatmap', 'list', undefined, 'view', { flightIdForSeatMap: flight.flight_id });
                    }}
                    title="מפת מושבים לטיסה זו"
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Baggage Scans Feed */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">אירועי סריקת כבודה אחרונים</h3>
              <span className="text-xs text-slate-400">BAGGAGESCAN · מעקב שרשרת אספקה</span>
            </div>
            <button
              onClick={() => navigateTo('baggagescans')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              צפה בכל הסריקות ({baggageScans.length})
            </button>
          </div>

          <div className="space-y-3">
            {baggageScans.slice(0, 4).map(scan => (
              <div 
                key={scan.scan_id}
                onClick={() => navigateTo('baggagescans', 'list', undefined, 'view', { baggageIdForScans: scan.baggage_id })}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg flex items-start justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {scan.baggage_id}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {scan.scan_type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    {scan.scan_location}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    מפעיל: {scan.operator_id} · {scan.scan_timestamp}
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  {scan.scan_id}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
