import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Ticket as TicketIcon, 
  Luggage, 
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useFlightApp } from '../context/FlightAppContext';
import { Passenger } from '../types';

export const PassengersModule: React.FC = () => {
  const { 
    passengers, 
    tickets, 
    baggages, 
    nav, 
    navigateTo, 
    addPassenger, 
    updatePassenger, 
    deletePassenger 
  } = useFlightApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('ALL');

  const selectedPassenger = passengers.find(p => p.passport_number === nav.selectedId);

  const [formData, setFormData] = useState<Passenger>(() => {
    if (nav.action === 'edit' && selectedPassenger) {
      return { ...selectedPassenger };
    }
    return {
      passport_number: '',
      first_name: '',
      last_name: '',
      birth_date: '1990-01-01',
      nationality: 'ישראל (IL)',
      phone: '',
      preferences: '',
      email: ''
    };
  });

  const nationalities = Array.from(new Set(passengers.map(p => p.nationality)));

  const filteredPassengers = passengers.filter(p => {
    const matchesSearch = 
      p.passport_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.phone && p.phone.includes(searchQuery));
    const matchesNationality = nationalityFilter === 'ALL' || p.nationality === nationalityFilter;
    return matchesSearch && matchesNationality;
  });

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.passport_number || !formData.first_name || !formData.last_name) {
      alert('נא למלא מספר דרכון, שם פרטי ושם משפחה');
      return;
    }

    if (nav.action === 'create') {
      if (passengers.some(p => p.passport_number.toUpperCase() === formData.passport_number.toUpperCase())) {
        alert('מספר דרכון זה כבר קיים במערכת (PK duplicate)');
        return;
      }
      addPassenger({ ...formData, passport_number: formData.passport_number.toUpperCase() });
    } else {
      updatePassenger(formData);
    }
    navigateTo('passengers', 'list');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את הנוסע בעל דרכון ${id}?`)) {
      deletePassenger(id);
      if (nav.subView === 'details') {
        navigateTo('passengers', 'list');
      }
    }
  };

  // --- SUBVIEW: FORM (ADD / EDIT) ---
  if (nav.subView === 'form') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {nav.action === 'create' ? 'רישום נוסע חדש' : `עריכת פרטי נוסע: ${formData.passport_number}`}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              שדות טכניים של ישות PASSENGER
            </p>
          </div>
          <button
            onClick={() => navigateTo('passengers', 'list')}
            className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
          >
            ביטול וחזרה לרשימה
          </button>
        </div>

        <form onSubmit={handleSaveForm} className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* passport_number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                מספר דרכון (passport_number - PK) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={nav.action === 'edit'}
                placeholder="לדוגמה: IL9823412"
                value={formData.passport_number}
                onChange={e => setFormData({ ...formData, passport_number: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>

            {/* nationality */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                אזרחות (nationality) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ישראל (IL), ארה״ב (US)..."
                value={formData.nationality}
                onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* first_name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                שם פרטי (first_name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="שם פרטי"
                value={formData.first_name}
                onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* last_name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                שם משפחה (last_name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="שם משפחה"
                value={formData.last_name}
                onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* birth_date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                תאריך לידה (birth_date) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.birth_date}
                onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* phone (optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                טלפון (phone - אופציונלי)
              </label>
              <input
                type="tel"
                placeholder="054-0000000"
                value={formData.phone || ''}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* email (optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                דואר אלקטרוני (email)
              </label>
              <input
                type="email"
                placeholder="passenger@example.com"
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* preferences (optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                העדפות וסיוע (preferences - אופציונלי)
              </label>
              <input
                type="text"
                placeholder="ארוחה כשרה, סיוע בכיסא גלגלים, מושב חלון..."
                value={formData.preferences || ''}
                onChange={e => setFormData({ ...formData, preferences: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigateTo('passengers', 'list')}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs"
            >
              {nav.action === 'create' ? 'צור נוסע' : 'עדכן פרטים'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- SUBVIEW: DETAILS ---
  if (nav.subView === 'details' && selectedPassenger) {
    const passengerTickets = tickets.filter(t => t.passport_number === selectedPassenger.passport_number);
    const passengerBaggages = baggages.filter(b => b.passport_number === selectedPassenger.passport_number);

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-lg">
              {selectedPassenger.first_name[0]}{selectedPassenger.last_name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {selectedPassenger.first_name} {selectedPassenger.last_name}
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                דרכון (passport_number): {selectedPassenger.passport_number} · {selectedPassenger.nationality}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('bookingwizard')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200"
            >
              <TicketIcon className="w-3.5 h-3.5" />
              <span>הנפק כרטיס לנוסע זה</span>
            </button>
            <button
              onClick={() => navigateTo('passengers', 'form', selectedPassenger.passport_number, 'edit')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>ערוך</span>
            </button>
            <button
              onClick={() => handleDelete(selectedPassenger.passport_number)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>מחק</span>
            </button>
            <button
              onClick={() => navigateTo('passengers', 'list')}
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
            שדות הישות (Technical Attributes · PASSENGER)
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">מספר דרכון (passport_number - PK)</span>
              <span className="font-mono font-bold text-slate-900">{selectedPassenger.passport_number}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">שם פרטי (first_name)</span>
              <span className="font-semibold text-slate-900">{selectedPassenger.first_name}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">שם משפחה (last_name)</span>
              <span className="font-semibold text-slate-900">{selectedPassenger.last_name}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">אזרחות (nationality)</span>
              <span className="font-medium text-slate-900">{selectedPassenger.nationality}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">תאריך לידה (birth_date)</span>
              <span className="tabular-nums font-mono text-slate-800">{selectedPassenger.birth_date}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">טלפון (phone - optional)</span>
              <span className="font-mono text-slate-800">{selectedPassenger.phone || 'לא הוגדר'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">דוא״ל (email)</span>
              <span className="font-mono text-slate-800">{selectedPassenger.email || 'לא הוגדר'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">העדפות (preferences - optional)</span>
              <span className="text-slate-800">{selectedPassenger.preferences || 'ללא העדפות מיוחדות'}</span>
            </div>
          </div>
        </div>

        {/* Linked Tickets & Baggages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Linked Tickets */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-900 text-sm">כרטיסים משויכים (TICKETS)</h3>
              <span className="text-xs text-slate-400 font-mono">{passengerTickets.length} רשומות</span>
            </div>

            {passengerTickets.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                אין כרטיסים פעילים לנוסע זה
              </div>
            ) : (
              <div className="space-y-2">
                {passengerTickets.map(t => (
                  <div 
                    key={t.ticket_id}
                    onClick={() => navigateTo('tickets', 'details', t.ticket_id)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between cursor-pointer text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-sky-800">{t.ticket_id}</div>
                      <div className="text-slate-600 mt-0.5">טיסה: {t.flight_id} · מושב: {t.seat_number}</div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold tabular-nums">${t.price}</div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {t.ticket_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Linked Baggage */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-900 text-sm">כבודה ומזוודות (BAGGAGE)</h3>
              <span className="text-xs text-slate-400 font-mono">{passengerBaggages.length} פריטים</span>
            </div>

            {passengerBaggages.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                אין כבודה רשומה על שם נוסע זה
              </div>
            ) : (
              <div className="space-y-2">
                {passengerBaggages.map(b => (
                  <div 
                    key={b.baggage_id}
                    onClick={() => navigateTo('baggage', 'details', b.baggage_id)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between cursor-pointer text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-amber-800">{b.tag_number}</div>
                      <div className="text-slate-600 mt-0.5">משקל: {b.weight_kg} ק״ג · טיסה: {b.flight_id}</div>
                    </div>
                    <div className="text-left">
                      <span className="text-[11px] font-medium text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              נוסעים ולקוחות (Passenger)
            </h1>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              ישות PASSENGER
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            רמה 1 ו-2: ניהול פרטי נוסעים, חיפוש לפי דרכון ושיוך היסטוריית כרטיסים וכבודה
          </p>
        </div>

        <button
          onClick={() => navigateTo('passengers', 'form', undefined, 'create')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>רשום נוסע חדש</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="חיפוש לפי מספר דרכון, שם פרטי, שם משפחה או טלפון..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pr-9 pl-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={nationalityFilter}
            onChange={e => setNationalityFilter(e.target.value)}
            className="text-xs py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white w-full sm:w-48"
          >
            <option value="ALL">כל האזרחויות (Nationalities)</option>
            {nationalities.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Passengers Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">passport_number (PK)</th>
                <th className="py-3 px-4">שם מלא (first_name + last_name)</th>
                <th className="py-3 px-4">אזרחות (nationality)</th>
                <th className="py-3 px-4">תאריך לידה (birth_date)</th>
                <th className="py-3 px-4">טלפון (phone)</th>
                <th className="py-3 px-4">העדפות (preferences)</th>
                <th className="py-3 px-4 text-left">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPassengers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    לא נמצאו נוסעים התואמים את החיפוש
                  </td>
                </tr>
              ) : (
                filteredPassengers.map(passenger => (
                  <tr key={passenger.passport_number} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-800">
                      {passenger.passport_number}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {passenger.first_name} {passenger.last_name}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {passenger.nationality}
                    </td>
                    <td className="py-3 px-4 text-slate-600 tabular-nums font-mono">
                      {passenger.birth_date}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {passenger.phone || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                      {passenger.preferences || '—'}
                    </td>
                    <td className="py-3 px-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateTo('passengers', 'details', passenger.passport_number)}
                          title="הצג פרטים וכרטיסים מקושרים"
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigateTo('passengers', 'form', passenger.passport_number, 'edit')}
                          title="ערוך נוסע"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(passenger.passport_number)}
                          title="מחק נוסע"
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
          <span>סה״כ {filteredPassengers.length} נוסעים רשומים</span>
          <span className="font-mono text-[11px]">PASSENGER TABLE SCHEMA</span>
        </div>
      </div>
    </div>
  );
};
