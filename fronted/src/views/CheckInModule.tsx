import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Plus, 
  Search, 
  Trash2, 
  Eye, 
  Smartphone, 
  Monitor, 
  Building, 
  Ticket as TicketIcon, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { useFlightApp } from '../context/FlightAppContext';
import { CheckIn, BoardingGroup, CheckinChannel } from '../types';

export const CheckInModule: React.FC = () => {
  const { 
    checkins, 
    tickets, 
    passengers, 
    flights, 
    nav, 
    navigateTo, 
    addCheckIn, 
    deleteCheckIn 
  } = useFlightApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');

  const selectedCheckin = checkins.find(c => c.checkin_id === nav.selectedId);

  // Eligible tickets for new check-in (Confirmed tickets without checkin_id)
  const uncheckinTickets = tickets.filter(t => !t.checkin_id);

  // Form State
  const [formData, setFormData] = useState<CheckIn>(() => {
    return {
      checkin_id: `CHK-${Math.floor(1000 + Math.random() * 9000)}`,
      checkin_date: new Date().toISOString().slice(0, 10),
      checkin_time: new Date().toTimeString().slice(0, 5),
      boarding_group: 'Group 2',
      checkin_channel: 'Online',
      ticket_id: uncheckinTickets[0]?.ticket_id || tickets[0]?.ticket_id || ''
    };
  });

  const filteredCheckins = checkins.filter(c => {
    const matchesSearch = 
      c.checkin_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.ticket_id && c.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesChannel = channelFilter === 'ALL' || c.checkin_channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.checkin_id || !formData.ticket_id) {
      alert('נא למלא מזהה צ׳ק-אין ולבחור כרטיס');
      return;
    }
    if (checkins.some(c => c.checkin_id === formData.checkin_id)) {
      alert('מזהה צ׳ק-אין זה כבר קיים');
      return;
    }
    addCheckIn(formData);
    navigateTo('checkin', 'list');
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`האם אתה בטוח שברצונך לבטל את רישום הצ׳ק-אין ${id}?`)) {
      deleteCheckIn(id);
      if (nav.subView === 'details') {
        navigateTo('checkin', 'list');
      }
    }
  };

  // --- SUBVIEW: FORM (NEW CHECK-IN) ---
  if (nav.subView === 'form') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              רישום צ׳ק-אין חדש (CHECKIN)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              ביצוע Check-In לכרטיס מאושר והקצאת קבוצת עלייה
            </p>
          </div>
          <button
            onClick={() => navigateTo('checkin', 'list')}
            className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
          >
            ביטול וחזרה
          </button>
        </div>

        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-2xs">
          <div className="space-y-4">
            {/* checkin_id */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                מזהה צ׳ק-אין (checkin_id - PK) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.checkin_id}
                onChange={e => setFormData({ ...formData, checkin_id: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* ticket_id */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                בחר כרטיס לביצוע צ׳ק-אין (ticket_id) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.ticket_id}
                onChange={e => setFormData({ ...formData, ticket_id: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
              >
                {uncheckinTickets.map(t => (
                  <option key={t.ticket_id} value={t.ticket_id}>
                    {t.ticket_id} — טיסה {t.flight_id} (מושב {t.seat_number}, דרכון {t.passport_number})
                  </option>
                ))}
                {uncheckinTickets.length === 0 && (
                  <option value="">אין כרטיסים הממתינים לצ׳ק אין (בחר כרטיס קיים מטה)</option>
                )}
                {tickets.filter(t => !!t.checkin_id).map(t => (
                  <option key={t.ticket_id} value={t.ticket_id}>
                    [כבר רשום] {t.ticket_id} — {t.flight_id} (מושב {t.seat_number})
                  </option>
                ))}
              </select>
            </div>

            {/* checkin_channel */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ערוץ ביצוע הצ׳ק-אין (checkin_channel) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.checkin_channel}
                onChange={e => setFormData({ ...formData, checkin_channel: e.target.value as CheckinChannel })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
              >
                <option value="Online">Online (אתר אינטרנט)</option>
                <option value="Mobile App">Mobile App (אפליקציה)</option>
                <option value="Airport Kiosk">Airport Kiosk (קיוסק בשדה)</option>
                <option value="Counter Agent">Counter Agent (דלפק שירות)</option>
              </select>
            </div>

            {/* boarding_group */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                קבוצת עלייה למטוס (boarding_group) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.boarding_group}
                onChange={e => setFormData({ ...formData, boarding_group: e.target.value as BoardingGroup })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
              >
                <option value="Group 1">Group 1 (מחלקה ראשונה ונוסעים מתמידים)</option>
                <option value="Group 2">Group 2 (מחלקת עסקים ופרימיום)</option>
                <option value="Group 3">Group 3 (תיירים שורות קדמיות)</option>
                <option value="Group 4">Group 4 (תיירים שורות אחוריות)</option>
                <option value="Group 5">Group 5 (עדיפות כללית)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  תאריך (checkin_date)
                </label>
                <input
                  type="date"
                  value={formData.checkin_date}
                  onChange={e => setFormData({ ...formData, checkin_date: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  שעה (checkin_time)
                </label>
                <input
                  type="time"
                  value={formData.checkin_time}
                  onChange={e => setFormData({ ...formData, checkin_time: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigateTo('checkin', 'list')}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs"
            >
              השלם צ׳ק-אין
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- SUBVIEW: DETAILS ---
  if (nav.subView === 'details' && selectedCheckin) {
    const linkedTicket = tickets.find(t => t.checkin_id === selectedCheckin.checkin_id || t.ticket_id === selectedCheckin.ticket_id);
    const linkedPassenger = linkedTicket ? passengers.find(p => p.passport_number === linkedTicket.passport_number) : null;
    const linkedFlight = linkedTicket ? flights.find(f => f.flight_id === linkedTicket.flight_id) : null;

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm font-mono">
              {selectedCheckin.checkin_id}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                רישום צ׳ק-אין {selectedCheckin.checkin_id}
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                {selectedCheckin.boarding_group} · {selectedCheckin.checkin_channel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDelete(selectedCheckin.checkin_id)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>בטל צ׳ק-אין</span>
            </button>
            <button
              onClick={() => navigateTo('checkin', 'list')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>חזרה לרשימה</span>
            </button>
          </div>
        </div>

        {/* Technical Attributes */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            שדות הישות (CHECKIN ATTRIBUTES)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">מזהה צ׳ק-אין (checkin_id - PK)</span>
              <span className="font-mono font-bold text-slate-900">{selectedCheckin.checkin_id}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">תאריך (checkin_date)</span>
              <span className="font-mono text-slate-800">{selectedCheckin.checkin_date}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">שעה (checkin_time)</span>
              <span className="font-mono font-bold text-sky-800">{selectedCheckin.checkin_time}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">קבוצת עלייה (boarding_group)</span>
              <span className="font-bold text-slate-900">{selectedCheckin.boarding_group}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">ערוץ רישום (checkin_channel)</span>
              <span className="font-semibold text-emerald-800">{selectedCheckin.checkin_channel}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">כרטיס מקושר (ticket_id)</span>
              <span className="font-mono font-bold text-sky-700">{selectedCheckin.ticket_id || '—'}</span>
            </div>
          </div>
        </div>

        {/* Linked Ticket & Passenger Card */}
        {linkedTicket && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">פרטי כרטיס ונוסע מקושרים</h3>
              <button
                onClick={() => navigateTo('tickets', 'details', linkedTicket.ticket_id)}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800"
              >
                צפה בכרטיס המלא ←
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">נוסע</span>
                <span className="font-bold text-slate-900">
                  {linkedPassenger ? `${linkedPassenger.first_name} ${linkedPassenger.last_name}` : linkedTicket.passport_number}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">טיסה</span>
                <span className="font-mono font-bold text-slate-900">{linkedTicket.flight_id} ({linkedFlight?.origin} → {linkedFlight?.destination})</span>
              </div>
              <div>
                <span className="text-slate-400 block">מושב</span>
                <span className="font-mono font-black text-sky-800 text-base">{linkedTicket.seat_number}</span>
              </div>
              <div>
                <span className="text-slate-400 block">שער המראה</span>
                <span className="font-mono font-bold text-slate-900">{linkedFlight?.gate || '—'}</span>
              </div>
            </div>
          </div>
        )}
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
              צ׳ק-אין ועלייה למטוס (CheckIn)
            </h1>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              ישות CHECKIN
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            רמה 1 ו-2: ניהול ערוצי רישום (Online, App, Kiosk, Counter), שיוך כרטיס והקצאת קבוצות עלייה
          </p>
        </div>

        <button
          onClick={() => navigateTo('checkin', 'form', undefined, 'create')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>בצע צ׳ק-אין חדש</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="חיפוש לפי checkin_id או ticket_id..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pr-9 pl-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={channelFilter}
            onChange={e => setChannelFilter(e.target.value)}
            className="text-xs py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white w-full sm:w-48"
          >
            <option value="ALL">כל הערוצים (All Channels)</option>
            <option value="Online">Online</option>
            <option value="Mobile App">Mobile App</option>
            <option value="Airport Kiosk">Airport Kiosk</option>
            <option value="Counter Agent">Counter Agent</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">checkin_id (PK)</th>
                <th className="py-3 px-4">כרטיס מקושר (ticket_id)</th>
                <th className="py-3 px-4">ערוץ רישום (checkin_channel)</th>
                <th className="py-3 px-4">קבוצת עלייה (boarding_group)</th>
                <th className="py-3 px-4">תאריך ושעה (date & time)</th>
                <th className="py-3 px-4 text-left">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCheckins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    לא נמצאו רישומי צ׳ק-אין
                  </td>
                </tr>
              ) : (
                filteredCheckins.map(chk => (
                  <tr key={chk.checkin_id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-sky-800">
                      {chk.checkin_id}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                      {chk.ticket_id || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800">{chk.checkin_channel}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {chk.boarding_group}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {chk.checkin_date} · {chk.checkin_time}
                    </td>
                    <td className="py-3 px-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateTo('checkin', 'details', chk.checkin_id)}
                          title="פרטים"
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(chk.checkin_id)}
                          title="מחק רישום"
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
          <span>סה״כ {filteredCheckins.length} רישומים</span>
          <span className="font-mono text-[11px]">CHECKIN TABLE SCHEMA</span>
        </div>
      </div>
    </div>
  );
};
