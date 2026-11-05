import React, { useState } from 'react';
import { 
  Ticket as TicketIcon, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Plane, 
  User, 
  Armchair, 
  DollarSign, 
  Printer, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { useFlightApp } from '../context/FlightAppContext';
import { Ticket, TicketStatus, FareClass } from '../types';

export const TicketsModule: React.FC = () => {
  const { 
    tickets, 
    flights, 
    passengers, 
    seats, 
    checkins, 
    nav, 
    navigateTo, 
    addTicket, 
    updateTicket, 
    deleteTicket,
    addCheckIn
  } = useFlightApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const selectedTicket = tickets.find(t => t.ticket_id === nav.selectedId);

  // Form state
  const [formData, setFormData] = useState<Ticket>(() => {
    if (nav.action === 'edit' && selectedTicket) {
      return { ...selectedTicket };
    }
    const defaultFlight = flights[0]?.flight_id || 'LY001';
    const defaultPassenger = passengers[0]?.passport_number || '';
    return {
      ticket_id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      booking_date: new Date().toISOString().slice(0, 10),
      fare_class: 'Economy Regular',
      price: 750,
      ticket_status: 'Confirmed',
      passport_number: defaultPassenger,
      flight_id: defaultFlight,
      seat_number: '20A'
    };
  });

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.passport_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.flight_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.seat_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.ticket_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ticket_id || !formData.passport_number || !formData.flight_id || !formData.seat_number) {
      alert('נא למלא את כל שדות החובה של הכרטיס (מזהה, נוסע, טיסה, מושב)');
      return;
    }

    if (nav.action === 'create') {
      if (tickets.some(t => t.ticket_id === formData.ticket_id)) {
        alert('מזהה כרטיס זה כבר קיים');
        return;
      }
      addTicket(formData);
    } else {
      updateTicket(formData);
    }
    navigateTo('tickets', 'list');
  };

  const handleQuickCheckin = (ticket: Ticket) => {
    const newCheckInId = `CHK-${Math.floor(1000 + Math.random() * 9000)}`;
    addCheckIn({
      checkin_id: newCheckInId,
      checkin_date: new Date().toISOString().slice(0, 10),
      checkin_time: new Date().toTimeString().slice(0, 5),
      boarding_group: ticket.fare_class.includes('First') ? 'Group 1' : ticket.fare_class.includes('Business') ? 'Group 2' : 'Group 3',
      checkin_channel: 'Counter Agent',
      ticket_id: ticket.ticket_id
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`האם אתה בטוח שברצונך לבטל ולמחוק את כרטיס ${id}? המושב ישוחרר.`)) {
      deleteTicket(id);
      if (nav.subView === 'details') {
        navigateTo('tickets', 'list');
      }
    }
  };

  // --- SUBVIEW: FORM (ADD / EDIT) ---
  if (nav.subView === 'form') {
    // Get seats for currently selected flight in form
    const flightSeats = seats.filter(s => s.flight_id === formData.flight_id);

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {nav.action === 'create' ? 'כרטוס הזמנה חדשה (TICKET)' : `עריכת כרטיס: ${formData.ticket_id}`}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              הזנת מפתחות זרים: passport_number, flight_id, seat_number
            </p>
          </div>
          <button
            onClick={() => navigateTo('tickets', 'list')}
            className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
          >
            ביטול וחזרה
          </button>
        </div>

        <form onSubmit={handleSaveForm} className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ticket_id */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                מזהה כרטיס (ticket_id - PK) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={nav.action === 'edit'}
                value={formData.ticket_id}
                onChange={e => setFormData({ ...formData, ticket_id: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 disabled:bg-slate-100"
              />
            </div>

            {/* booking_date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                תאריך ביצוע ההזמנה (booking_date) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.booking_date}
                onChange={e => setFormData({ ...formData, booking_date: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* passport_number (FK) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                נוסע / מספר דרכון (passport_number - FK) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.passport_number}
                onChange={e => setFormData({ ...formData, passport_number: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
              >
                {passengers.map(p => (
                  <option key={p.passport_number} value={p.passport_number}>
                    {p.passport_number} — {p.first_name} {p.last_name} ({p.nationality})
                  </option>
                ))}
              </select>
            </div>

            {/* flight_id (FK) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                טיסה (flight_id - FK) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.flight_id}
                onChange={e => setFormData({ ...formData, flight_id: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
              >
                {flights.map(f => (
                  <option key={f.flight_id} value={f.flight_id}>
                    {f.flight_id} — {f.flight_name} ({f.origin} → {f.destination})
                  </option>
                ))}
              </select>
            </div>

            {/* seat_number (Composite FK part 2) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                מספר מושב בטיסה (seat_number - FK) <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="למשל 1A, 2D, 20C"
                  value={formData.seat_number}
                  onChange={e => setFormData({ ...formData, seat_number: e.target.value.toUpperCase() })}
                  className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => navigateTo('seatmap', 'list', undefined, 'view', { flightIdForSeatMap: formData.flight_id })}
                  className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg shrink-0"
                >
                  בחר במפה
                </button>
              </div>
            </div>

            {/* fare_class */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                מחלקת כרטיס (fare_class) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.fare_class}
                onChange={e => setFormData({ ...formData, fare_class: e.target.value as FareClass })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
              >
                <option value="Economy Regular">Economy Regular (תיירים רגיל)</option>
                <option value="Economy Flexible">Economy Flexible (תיירים גמיש)</option>
                <option value="Business Standard">Business Standard (עסקים סטנדרט)</option>
                <option value="First Suite">First Suite (מחלקה ראשונה)</option>
              </select>
            </div>

            {/* price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                מחיר בדולר (price - USD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="10"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* ticket_status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                סטטוס כרטיס (ticket_status) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.ticket_status}
                onChange={e => setFormData({ ...formData, ticket_status: e.target.value as TicketStatus })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
              >
                <option value="Confirmed">Confirmed (מאושר)</option>
                <option value="Checked-In">Checked-In (בוצע צ׳ק-אין)</option>
                <option value="Boarded">Boarded (עלה למטוס)</option>
                <option value="Cancelled">Cancelled (מבוטל)</option>
                <option value="Refunded">Refunded (זוכה)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigateTo('tickets', 'list')}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs"
            >
              {nav.action === 'create' ? 'הנפק כרטיס' : 'שמור שינויים'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- SUBVIEW: DETAILS & BOARDING PASS ---
  if (nav.subView === 'details' && selectedTicket) {
    const linkedPassenger = passengers.find(p => p.passport_number === selectedTicket.passport_number);
    const linkedFlight = flights.find(f => f.flight_id === selectedTicket.flight_id);
    const linkedCheckin = checkins.find(c => c.checkin_id === selectedTicket.checkin_id);

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-sm font-mono">
              {selectedTicket.ticket_id}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                כרטיס טיסה {selectedTicket.ticket_id}
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                {selectedTicket.fare_class} · {selectedTicket.ticket_status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedTicket.ticket_status === 'Confirmed' && !selectedTicket.checkin_id && (
              <button
                onClick={() => handleQuickCheckin(selectedTicket)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>בצע צ׳ק-אין כעת</span>
              </button>
            )}

            <button
              onClick={() => navigateTo('tickets', 'form', selectedTicket.ticket_id, 'edit')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>ערוך</span>
            </button>
            <button
              onClick={() => handleDelete(selectedTicket.ticket_id)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>בטל/מחק</span>
            </button>
            <button
              onClick={() => navigateTo('tickets', 'list')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>חזרה לרשימה</span>
            </button>
          </div>
        </div>

        {/* Boarding Pass Mockup Simulation Card */}
        <div className="bg-gradient-to-r from-sky-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 gap-4">
            <div>
              <span className="text-xs tracking-widest text-sky-300 font-mono uppercase">כרטיס עלייה למטוס · BOARDING PASS</span>
              <div className="text-2xl font-bold font-mono tracking-tight mt-1">
                {selectedTicket.flight_id}
              </div>
            </div>
            <div className="text-left">
              <span className="text-xs text-slate-400 block font-mono">TICKET ID</span>
              <span className="font-mono text-lg font-bold text-sky-400">{selectedTicket.ticket_id}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 my-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">שם הנוסע / PASSENGER</span>
              <span className="text-base font-semibold text-white block mt-0.5">
                {linkedPassenger ? `${linkedPassenger.first_name} ${linkedPassenger.last_name}` : selectedTicket.passport_number}
              </span>
              <span className="font-mono text-[10px] text-slate-400">{selectedTicket.passport_number}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">מסלול טיסה / ROUTE</span>
              <span className="text-base font-bold text-white block mt-0.5 font-mono">
                {linkedFlight ? `${linkedFlight.origin} → ${linkedFlight.destination}` : 'TLV → ???'}
              </span>
              <span className="text-[10px] text-slate-400">{linkedFlight?.flight_name}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">מושב / SEAT</span>
              <span className="text-2xl font-black text-amber-300 block font-mono">
                {selectedTicket.seat_number}
              </span>
              <span className="text-[10px] text-slate-300">{selectedTicket.fare_class}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">שער / GATE & TIME</span>
              <span className="text-lg font-bold text-white block font-mono">
                {linkedFlight?.gate || 'TBD'} · {linkedFlight?.departure_time}
              </span>
              <span className="text-[10px] text-slate-300">{linkedFlight?.departure_date}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2 font-mono">
            <div>
              צ׳ק-אין (checkin_id): {selectedTicket.checkin_id || 'טרם בוצע צ׳ק-אין'} · קבוצת עלייה: {linkedCheckin?.boarding_group || 'Group 3'}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded">
                סטטוס: {selectedTicket.ticket_status}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Relational Fields */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            פירוט שדות טכניים ומפתחות זרים (TICKET RELATIONS)
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">מזהה כרטיס (ticket_id - PK)</span>
              <span className="font-mono font-bold text-slate-900">{selectedTicket.ticket_id}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">תאריך הזמנה (booking_date)</span>
              <span className="font-mono text-slate-800">{selectedTicket.booking_date}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">מחלקת תעריף (fare_class)</span>
              <span className="font-medium text-slate-900">{selectedTicket.fare_class}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">מחיר (price)</span>
              <span className="font-mono font-bold text-emerald-700 tabular-nums">${selectedTicket.price}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">דרכון מקושר (passport_number - FK)</span>
              <span className="font-mono text-sky-700 font-semibold">{selectedTicket.passport_number}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">טיסה מקושרת (flight_id - FK)</span>
              <span className="font-mono text-sky-700 font-semibold">{selectedTicket.flight_id}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">מושב מקושר (seat_number - FK)</span>
              <span className="font-mono font-bold text-slate-900">{selectedTicket.seat_number}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">מזהה צ׳ק-אין (checkin_id - FK)</span>
              <span className="font-mono text-slate-700">{selectedTicket.checkin_id || 'null'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- SUBVIEW: LIST (DEFAULT) ---
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              כרטיסים והזמנות (Ticket)
            </h1>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              ישות TICKET
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            רמה 1 ו-2: ניהול כרטוס, שיוך מושב לנוסע, בדיקת סטטוס והפקת כרטיסים
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('bookingwizard')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200"
          >
            <span>אשף הזמנה מלא (Wizard)</span>
          </button>
          <button
            onClick={() => navigateTo('tickets', 'form', undefined, 'create')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>הנפק כרטיס ידני</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="חיפוש לפי ticket_id, מספר דרכון, מזהה טיסה או מושב..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pr-9 pl-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white w-full sm:w-44"
          >
            <option value="ALL">כל הסטטוסים (All)</option>
            <option value="Confirmed">Confirmed (מאושר)</option>
            <option value="Checked-In">Checked-In (צ׳ק אין)</option>
            <option value="Boarded">Boarded (עלה למטוס)</option>
            <option value="Cancelled">Cancelled (מבוטל)</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">ticket_id (PK)</th>
                <th className="py-3 px-4">טיסה (flight_id)</th>
                <th className="py-3 px-4">מושב (seat_number)</th>
                <th className="py-3 px-4">נוסע (passport_number)</th>
                <th className="py-3 px-4">מחלקת תעריף (fare_class)</th>
                <th className="py-3 px-4">מחיר (price)</th>
                <th className="py-3 px-4">סטטוס (ticket_status)</th>
                <th className="py-3 px-4 text-left">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    לא נמצאו כרטיסים התואמים את החיפוש
                  </td>
                </tr>
              ) : (
                filteredTickets.map(ticket => (
                  <tr key={ticket.ticket_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-800">
                      {ticket.ticket_id}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {ticket.flight_id}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                      {ticket.seat_number}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {ticket.passport_number}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {ticket.fare_class}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums font-bold text-slate-900">
                      ${ticket.price}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        ticket.ticket_status === 'Confirmed' ? 'bg-sky-50 text-sky-800 border border-sky-200' :
                        ticket.ticket_status === 'Checked-In' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        ticket.ticket_status === 'Boarded' ? 'bg-indigo-100 text-indigo-900' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {ticket.ticket_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateTo('tickets', 'details', ticket.ticket_id)}
                          title="הצג כרטיס ופרטי עלייה"
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigateTo('tickets', 'form', ticket.ticket_id, 'edit')}
                          title="ערוך כרטיס"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(ticket.ticket_id)}
                          title="מחק כרטיס"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>סה״כ {filteredTickets.length} כרטיסים</span>
          <span className="font-mono text-[11px]">TICKET TABLE SCHEMA</span>
        </div>
      </div>
    </div>
  );
};
