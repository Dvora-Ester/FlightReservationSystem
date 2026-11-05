import React, { useState } from 'react';
import { 
  Plane, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Layers, 
  Calendar, 
  Clock, 
  MapPin, 
  Check, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { useFlightApp } from '../context/FlightAppContext';
import { Flight, FlightStatus } from '../types';

export const FlightsModule: React.FC = () => {
  const { 
    flights, 
    tickets, 
    nav, 
    navigateTo, 
    goBack, 
    addFlight, 
    updateFlight, 
    deleteFlight 
  } = useFlightApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Form state
  const selectedFlight = flights.find(f => f.flight_id === nav.selectedId);
  const [formData, setFormData] = useState<Flight>(() => {
    if (nav.action === 'edit' && selectedFlight) {
      return { ...selectedFlight };
    }
    return {
      flight_id: '',
      flight_name: '',
      origin: 'TLV',
      destination: '',
      departure_date: new Date().toISOString().slice(0, 10),
      departure_time: '12:00',
      arrival_date: new Date().toISOString().slice(0, 10),
      arrival_time: '16:00',
      flight_status: 'Scheduled',
      aircraft_model: 'Boeing 787-9 Dreamliner',
      gate: 'D02',
      terminal: 'טרמינל 3'
    };
  });

  // Filtered flights
  const filteredFlights = flights.filter(f => {
    const matchesSearch = 
      f.flight_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.flight_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || f.flight_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.flight_id || !formData.destination) {
      alert('נא למלא מזהה טיסה ויעד');
      return;
    }
    if (nav.action === 'create') {
      // Check if flight_id already exists
      if (flights.some(f => f.flight_id.toUpperCase() === formData.flight_id.toUpperCase())) {
        alert('מזהה טיסה (flight_id) זה כבר קיים במערכת');
        return;
      }
      addFlight({ ...formData, flight_id: formData.flight_id.toUpperCase() });
    } else {
      updateFlight(formData);
    }
    navigateTo('flights', 'list');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את טיסה ${id}? כל המושבים והכרטיסים המקושרים יושפעו.`)) {
      deleteFlight(id);
      if (nav.subView === 'details') {
        navigateTo('flights', 'list');
      }
    }
  };

  // --- SUBVIEW: FORM (ADD / EDIT) ---
  if (nav.subView === 'form') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {nav.action === 'create' ? 'הוספת טיסה חדשה' : `עריכת טיסה: ${formData.flight_id}`}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              יש להזין את פרטי הטיסה בהתאם למבנה הישות FLIGHT
            </p>
          </div>
          <button
            onClick={() => navigateTo('flights', 'list')}
            className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
          >
            ביטול וחזרה לרשימה
          </button>
        </div>

        <form onSubmit={handleSaveForm} className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* flight_id */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                מזהה טיסה (flight_id - PK) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={nav.action === 'edit'}
                placeholder="לדוגמה: LY007, UA140"
                value={formData.flight_id}
                onChange={e => setFormData({ ...formData, flight_id: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>

            {/* flight_name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                שם מסחרי / קו (flight_name)
              </label>
              <input
                type="text"
                required
                placeholder="לדוגמה: תל אביב - ניו יורק"
                value={formData.flight_name}
                onChange={e => setFormData({ ...formData, flight_name: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* origin */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                קוד מוצא (origin) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="TLV"
                value={formData.origin}
                onChange={e => setFormData({ ...formData, origin: e.target.value.toUpperCase() })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* destination */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                קוד יעד (destination) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="JFK, LHR, CDG"
                value={formData.destination}
                onChange={e => setFormData({ ...formData, destination: e.target.value.toUpperCase() })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* departure_date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                תאריך המראה (departure_date)
              </label>
              <input
                type="date"
                required
                value={formData.departure_date}
                onChange={e => setFormData({ ...formData, departure_date: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* departure_time */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                שעת המראה (departure_time)
              </label>
              <input
                type="time"
                required
                value={formData.departure_time}
                onChange={e => setFormData({ ...formData, departure_time: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* arrival_date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                תאריך נחיתה (arrival_date)
              </label>
              <input
                type="date"
                required
                value={formData.arrival_date}
                onChange={e => setFormData({ ...formData, arrival_date: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* arrival_time */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                שעת נחיתה (arrival_time)
              </label>
              <input
                type="time"
                required
                value={formData.arrival_time}
                onChange={e => setFormData({ ...formData, arrival_time: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* flight_status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                סטטוס טיסה (flight_status)
              </label>
              <select
                value={formData.flight_status}
                onChange={e => setFormData({ ...formData, flight_status: e.target.value as FlightStatus })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
              >
                <option value="Scheduled">Scheduled (מתוכנן)</option>
                <option value="Boarding">Boarding (עלייה למטוס)</option>
                <option value="Departed">Departed (המריא)</option>
                <option value="In Flight">In Flight (באוויר)</option>
                <option value="Landed">Landed (נחת)</option>
                <option value="Delayed">Delayed (מעוכב)</option>
                <option value="Cancelled">Cancelled (מבוטל)</option>
              </select>
            </div>

            {/* aircraft_model */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                דגם מטוס (aircraft_model)
              </label>
              <input
                type="text"
                placeholder="Boeing 787-9 Dreamliner"
                value={formData.aircraft_model || ''}
                onChange={e => setFormData({ ...formData, aircraft_model: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* gate & terminal */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                שער יציאה (gate)
              </label>
              <input
                type="text"
                placeholder="D04"
                value={formData.gate || ''}
                onChange={e => setFormData({ ...formData, gate: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                טרמינל (terminal)
              </label>
              <input
                type="text"
                placeholder="טרמינל 3"
                value={formData.terminal || ''}
                onChange={e => setFormData({ ...formData, terminal: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigateTo('flights', 'list')}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs"
            >
              {nav.action === 'create' ? 'שמור וצור טיסה' : 'שמור שינויים'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- SUBVIEW: DETAILS ---
  if (nav.subView === 'details' && selectedFlight) {
    const flightTickets = tickets.filter(t => t.flight_id === selectedFlight.flight_id);

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header / Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-lg font-mono">
              {selectedFlight.flight_id}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {selectedFlight.flight_name}
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                FLIGHT ID: {selectedFlight.flight_id} · דגם: {selectedFlight.aircraft_model || 'לא צוין'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('seatmap', 'list', undefined, 'view', { flightIdForSeatMap: selectedFlight.flight_id })}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>פתח מפת מושבים</span>
            </button>
            <button
              onClick={() => navigateTo('flights', 'form', selectedFlight.flight_id, 'edit')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>ערוך</span>
            </button>
            <button
              onClick={() => handleDelete(selectedFlight.flight_id)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>מחק</span>
            </button>
            <button
              onClick={() => navigateTo('flights', 'list')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>חזרה לרשימה</span>
            </button>
          </div>
        </div>

        {/* Technical Fields Details Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            שדות הישות (Technical Attributes · FLIGHT)
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">מזהה טיסה (flight_id)</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{selectedFlight.flight_id}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">שם קו (flight_name)</span>
              <span className="font-semibold text-slate-900">{selectedFlight.flight_name}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">מוצא (origin)</span>
              <span className="font-mono font-bold text-slate-900">{selectedFlight.origin}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">יעד (destination)</span>
              <span className="font-mono font-bold text-slate-900">{selectedFlight.destination}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">תאריך המראה (departure_date)</span>
              <span className="tabular-nums font-medium text-slate-800">{selectedFlight.departure_date}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">שעת המראה (departure_time)</span>
              <span className="tabular-nums font-mono font-bold text-sky-800">{selectedFlight.departure_time}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">תאריך נחיתה (arrival_date)</span>
              <span className="tabular-nums font-medium text-slate-800">{selectedFlight.arrival_date}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">שעת נחיתה (arrival_time)</span>
              <span className="tabular-nums font-mono font-bold text-slate-800">{selectedFlight.arrival_time}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">סטטוס (flight_status)</span>
              <span className="font-semibold text-sky-700">{selectedFlight.flight_status}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">דגם מטוס (aircraft_model)</span>
              <span className="text-slate-800">{selectedFlight.aircraft_model || '—'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">שער (gate)</span>
              <span className="font-mono font-bold text-slate-900">{selectedFlight.gate || '—'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">טרמינל (terminal)</span>
              <span className="text-slate-800">{selectedFlight.terminal || '—'}</span>
            </div>
          </div>
        </div>

        {/* Linked Tickets Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">כרטיסים משויכים לטיסה זו (TICKET FK)</h3>
              <p className="text-xs text-slate-500">{flightTickets.length} כרטיסים פעילים</p>
            </div>
            <button
              onClick={() => navigateTo('bookingwizard')}
              className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
            >
              + כרטוס חדש לטיסה זו
            </button>
          </div>

          {flightTickets.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              אין כרטיסים שהונפקו עדיין עבור טיסה זו
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="pb-2">מזהה כרטיס (ticket_id)</th>
                    <th className="pb-2">מושב (seat_number)</th>
                    <th className="pb-2">דרכון נוסע (passport_number)</th>
                    <th className="pb-2">מחלקת תעריף (fare_class)</th>
                    <th className="pb-2">מחיר (price)</th>
                    <th className="pb-2">סטטוס (ticket_status)</th>
                    <th className="pb-2 text-left">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {flightTickets.map(t => (
                    <tr key={t.ticket_id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 font-mono font-bold text-sky-700">{t.ticket_id}</td>
                      <td className="py-2.5 font-mono">{t.seat_number}</td>
                      <td className="py-2.5 font-mono text-slate-600">{t.passport_number}</td>
                      <td className="py-2.5">{t.fare_class}</td>
                      <td className="py-2.5 font-mono tabular-nums">${t.price}</td>
                      <td className="py-2.5 font-medium">{t.ticket_status}</td>
                      <td className="py-2.5 text-left">
                        <button
                          onClick={() => navigateTo('tickets', 'details', t.ticket_id)}
                          className="text-sky-600 hover:text-sky-800 font-medium"
                        >
                          הצג כרטיס
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- SUBVIEW: LIST (DEFAULT) ---
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Module Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              ניהול טיסות (Flight)
            </h1>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              ישות FLIGHT
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            רמה 1 ו-2: חיפוש, סינון, צפייה בפרטים והוספת טיסות למערכת
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('flights', 'form', undefined, 'create')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>הוסף טיסה חדשה</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="חיפוש לפי flight_id, שם קו, מוצא או יעד..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pr-9 pl-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white w-full sm:w-44"
          >
            <option value="ALL">כל הסטטוסים (All)</option>
            <option value="Scheduled">Scheduled (מתוכנן)</option>
            <option value="Boarding">Boarding (עלייה למטוס)</option>
            <option value="Departed">Departed (המריא)</option>
            <option value="In Flight">In Flight (באוויר)</option>
            <option value="Landed">Landed (נחת)</option>
          </select>
        </div>
      </div>

      {/* Flights Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">flight_id (PK)</th>
                <th className="py-3 px-4">שם טיסה (flight_name)</th>
                <th className="py-3 px-4">מסלול (origin → destination)</th>
                <th className="py-3 px-4">המראה (departure)</th>
                <th className="py-3 px-4">נחיתה (arrival)</th>
                <th className="py-3 px-4">סטטוס (flight_status)</th>
                <th className="py-3 px-4">דגם מטוס</th>
                <th className="py-3 px-4 text-left">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFlights.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    לא נמצאו טיסות התואמות לחיפוש
                  </td>
                </tr>
              ) : (
                filteredFlights.map(flight => (
                  <tr key={flight.flight_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-800">
                      {flight.flight_id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {flight.flight_name}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="font-semibold">{flight.origin}</span>
                      <span className="text-slate-400 mx-1.5">←</span>
                      <span className="font-semibold text-slate-800">{flight.destination}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="tabular-nums">{flight.departure_date}</div>
                      <div className="font-mono text-[11px] text-slate-500">{flight.departure_time}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="tabular-nums">{flight.arrival_date}</div>
                      <div className="font-mono text-[11px] text-slate-500">{flight.arrival_time}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        flight.flight_status === 'Boarding' ? 'bg-amber-100 text-amber-900' :
                        flight.flight_status === 'In Flight' ? 'bg-sky-100 text-sky-900' :
                        flight.flight_status === 'Departed' ? 'bg-indigo-100 text-indigo-900' :
                        flight.flight_status === 'Scheduled' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {flight.flight_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {flight.aircraft_model || '—'}
                    </td>
                    <td className="py-3 px-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateTo('flights', 'details', flight.flight_id)}
                          title="הצג פרטים מלאים"
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigateTo('seatmap', 'list', undefined, 'view', { flightIdForSeatMap: flight.flight_id })}
                          title="מפת מושבים לטיסה"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigateTo('flights', 'form', flight.flight_id, 'edit')}
                          title="ערוך טיסה"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(flight.flight_id)}
                          title="מחק טיסה"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
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
          <span>מציג {filteredFlights.length} טיסות</span>
          <span className="font-mono text-[11px]">FLIGHT TABLE SCHEMA</span>
        </div>
      </div>
    </div>
  );
};
