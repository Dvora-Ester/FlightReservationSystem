import React, { useState } from 'react';
import { 
  Luggage, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Compass, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  ArrowRight,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { useFlightApp } from '../context/FlightAppContext';
import { Baggage, BaggageScan, BaggageStatus, SpecialHandling, ScanType } from '../types';

export const BaggageModule: React.FC = () => {
  const { 
    baggages, 
    baggageScans, 
    flights, 
    passengers, 
    nav, 
    navigateTo, 
    addBaggage, 
    updateBaggage, 
    deleteBaggage,
    addBaggageScan,
    deleteBaggageScan
  } = useFlightApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected Baggage (from nav or defaults)
  const targetBaggageId = nav.selectedId || nav.baggageIdForScans;
  const selectedBaggage = baggages.find(b => b.baggage_id === targetBaggageId);

  // New Baggage Form State
  const [formData, setFormData] = useState<Baggage>(() => {
    if (nav.action === 'edit' && selectedBaggage) {
      return { ...selectedBaggage };
    }
    return {
      baggage_id: `BAG-${Math.floor(7000 + Math.random() * 2000)}`,
      tag_number: `TLV-${Math.floor(100000 + Math.random() * 900000)}`,
      weight_kg: 21.5,
      status: 'Checked',
      special_handling: 'None',
      flight_id: flights[0]?.flight_id || 'LY001',
      passport_number: passengers[0]?.passport_number || 'IL9823412'
    };
  });

  // New Scan modal/form state
  const [newScanModal, setNewScanModal] = useState(false);
  const [scanForm, setScanForm] = useState<BaggageScan>({
    baggage_id: targetBaggageId || baggages[0]?.baggage_id || 'BAG-7001',
    scan_id: `SCN-${Math.floor(100 + Math.random() * 900)}`,
    scan_timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    scan_location: 'TLV רחבת מטוס D04 - תא כבודה',
    scan_type: 'Aircraft Loading',
    operator_id: 'RAMP_SUPERVISOR_12',
    notes: 'הועבר ואושר ע״י צוות קרקע'
  });

  const filteredBaggages = baggages.filter(b => {
    const matchesSearch = 
      b.baggage_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tag_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.passport_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.flight_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveBaggage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.baggage_id || !formData.tag_number || !formData.weight_kg) {
      alert('נא למלא את כל שדות החובה של הכבודה');
      return;
    }
    if (nav.action === 'create') {
      if (baggages.some(b => b.baggage_id === formData.baggage_id)) {
        alert('מזהה כבודה זה כבר קיים');
        return;
      }
      addBaggage(formData);
    } else {
      updateBaggage(formData);
    }
    navigateTo('baggage', 'list');
  };

  const handleAddScan = (e: React.FormEvent) => {
    e.preventDefault();
    addBaggageScan(scanForm);
    setNewScanModal(false);
  };

  const handleDeleteBaggage = (id: string) => {
    if (window.confirm(`האם למחוק את פריט הכבודה ${id} ואת כל היסטוריית הסריקות שלו?`)) {
      deleteBaggage(id);
      if (nav.subView === 'details') {
        navigateTo('baggage', 'list');
      }
    }
  };

  // --- SUBVIEW: FORM (ADD / EDIT BAGGAGE) ---
  if (nav.subView === 'form') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {nav.action === 'create' ? 'קליטת כבודה חדשה (BAGGAGE)' : `עריכת כבודה: ${formData.tag_number}`}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              שדות ישות BAGGAGE והנפקת תגית ברקוד
            </p>
          </div>
          <button
            onClick={() => navigateTo('baggage', 'list')}
            className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 border border-slate-200 rounded-lg bg-white"
          >
            ביטול וחזרה
          </button>
        </div>

        <form onSubmit={handleSaveBaggage} className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* baggage_id */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                מזהה כבודה (baggage_id - PK) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={nav.action === 'edit'}
                value={formData.baggage_id}
                onChange={e => setFormData({ ...formData, baggage_id: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 disabled:bg-slate-100"
              />
            </div>

            {/* tag_number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                מספר תג ברקוד (tag_number) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.tag_number}
                onChange={e => setFormData({ ...formData, tag_number: e.target.value })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* weight_kg */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                משקל בק״ג (weight_kg) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="50"
                required
                value={formData.weight_kg}
                onChange={e => setFormData({ ...formData, weight_kg: Number(e.target.value) })}
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                סטטוס כבודה (status) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as BaggageStatus })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
              >
                <option value="Checked">Checked (נמסרה לדלפק)</option>
                <option value="Security Cleared">Security Cleared (נבדקה ביטחונית)</option>
                <option value="Loaded">Loaded (הועמסה למטוס)</option>
                <option value="In Transit">In Transit (במעבר / בטיסה)</option>
                <option value="Unloaded">Unloaded (נפרקה מהמטוס)</option>
                <option value="Delivered">Delivered (נמסרה לנוסע)</option>
                <option value="Delayed">Delayed (מעוכבת)</option>
              </select>
            </div>

            {/* special_handling */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                טיפול מיוחד (special_handling - optional)
              </label>
              <select
                value={formData.special_handling || 'None'}
                onChange={e => setFormData({ ...formData, special_handling: e.target.value as SpecialHandling })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
              >
                <option value="None">None (רגיל)</option>
                <option value="Fragile">Fragile (שביר)</option>
                <option value="Oversized">Oversized (חריג / גדול)</option>
                <option value="Priority">Priority (עדיפות)</option>
                <option value="Valuable">Valuable (יקר ערך)</option>
              </select>
            </div>

            {/* flight_id */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                טיסה (flight_id) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.flight_id}
                onChange={e => setFormData({ ...formData, flight_id: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
              >
                {flights.map(f => (
                  <option key={f.flight_id} value={f.flight_id}>
                    {f.flight_id} — {f.flight_name}
                  </option>
                ))}
              </select>
            </div>

            {/* passport_number */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                נוסע משויך (passport_number) <span className="text-rose-500">*</span>
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
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigateTo('baggage', 'list')}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs"
            >
              {nav.action === 'create' ? 'קלוט כבודה' : 'שמור שינויים'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- SUBVIEW: DETAILS & LEVEL 3 BAGGAGE SCANS TIMELINE ---
  if ((nav.subView === 'details' || nav.module === 'baggagescans') && selectedBaggage) {
    const scansForBag = baggageScans.filter(s => s.baggage_id === selectedBaggage.baggage_id);
    const linkedPassenger = passengers.find(p => p.passport_number === selectedBaggage.passport_number);
    const linkedFlight = flights.find(f => f.flight_id === selectedBaggage.flight_id);

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm font-mono">
              {selectedBaggage.baggage_id}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                מעקב והיסטוריית סריקות כבודה (BaggageScan)
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                תג ברקוד: {selectedBaggage.tag_number} · משקל: {selectedBaggage.weight_kg} ק״ג · סטטוס: {selectedBaggage.status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setScanForm({
                  baggage_id: selectedBaggage.baggage_id,
                  scan_id: `SCN-${Math.floor(100 + Math.random() * 900)}`,
                  scan_timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                  scan_location: 'TLV רחבת מטוס עמדה D04',
                  scan_type: 'Aircraft Loading',
                  operator_id: 'AGENT_LOG_01',
                  notes: 'סריקה חיה חדשה'
                });
                setNewScanModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>הוסף אירוע סריקה (BaggageScan)</span>
            </button>
            <button
              onClick={() => navigateTo('baggage', 'form', selectedBaggage.baggage_id, 'edit')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>ערוך כבודה</span>
            </button>
            <button
              onClick={() => handleDeleteBaggage(selectedBaggage.baggage_id)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>מחק</span>
            </button>
            <button
              onClick={() => navigateTo('baggage', 'list')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>חזרה לרשימה</span>
            </button>
          </div>
        </div>

        {/* Technical Attributes Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            שדות הישות (BAGGAGE ATTRIBUTES)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">מזהה כבודה (baggage_id - PK)</span>
              <span className="font-mono font-bold text-slate-900">{selectedBaggage.baggage_id}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">תג ברקוד (tag_number)</span>
              <span className="font-mono font-bold text-amber-800">{selectedBaggage.tag_number}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">משקל (weight_kg)</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">{selectedBaggage.weight_kg} ק״ג</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">סטטוס נוכחי (status)</span>
              <span className="font-semibold text-slate-900">{selectedBaggage.status}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">טיפול מיוחד (special_handling)</span>
              <span className="font-medium text-slate-800">{selectedBaggage.special_handling || 'ללא'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">טיסה משויכת (flight_id)</span>
              <span className="font-mono font-bold text-sky-700">{selectedBaggage.flight_id}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">נוסע (passport_number)</span>
              <span className="font-mono text-slate-800">{selectedBaggage.passport_number}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[11px]">מזהה צ׳ק-אין (checkin_id)</span>
              <span className="font-mono text-slate-700">{selectedBaggage.checkin_id || '—'}</span>
            </div>
          </div>
        </div>

        {/* Level 3: Visual Timeline & Scans Table (BaggageScan) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                ציר זמן ותחנות סריקה (Audit Trail · BAGGAGESCAN)
              </h2>
              <p className="text-xs text-slate-500">
                ישות חלשה: מפתח מורכב (baggage_id + scan_id)
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">{scansForBag.length} סריקות מתועדות</span>
          </div>

          {/* Interactive Timeline */}
          {scansForBag.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
              טרם נרשמו אירועי סריקה עבור מזוודה זו. לחץ על "הוסף אירוע סריקה" כדי להזין סריקה ראשונה.
            </div>
          ) : (
            <div className="relative border-r-2 border-slate-200 mr-4 space-y-6 pr-6">
              {scansForBag.map((scan, idx) => (
                <div key={scan.scan_id} className="relative group">
                  {/* Timeline point icon */}
                  <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-amber-600 group-hover:scale-125 transition-transform" />

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          {scan.scan_type}
                        </span>
                        <span className="text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                          {scan.scan_id}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-mono tabular-nums">{scan.scan_timestamp}</span>
                        <button
                          onClick={() => deleteBaggageScan(scan.scan_id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="מחק סריקה זו"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{scan.scan_location}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>הערות: {scan.notes || '—'}</span>
                      <span className="font-mono text-slate-400">מפעיל: {scan.operator_id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Add New BaggageScan */}
        {newScanModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  הוספת סריקת כבודה (BaggageScan Event)
                </h3>
                <button
                  onClick={() => setNewScanModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddScan} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    מזהה סריקה (scan_id - PK part 2)
                  </label>
                  <input
                    type="text"
                    required
                    value={scanForm.scan_id}
                    onChange={e => setScanForm({ ...scanForm, scan_id: e.target.value })}
                    className="w-full font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    סוג סריקה (scan_type)
                  </label>
                  <select
                    value={scanForm.scan_type}
                    onChange={e => setScanForm({ ...scanForm, scan_type: e.target.value as ScanType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white"
                  >
                    <option value="Intake">Intake (קליטה בדלפק)</option>
                    <option value="Security Screening">Security Screening (שיקוף ביטחוני)</option>
                    <option value="Sortation">Sortation (מיון למסוע ועגלה)</option>
                    <option value="Aircraft Loading">Aircraft Loading (העמסה לבטן המטוס)</option>
                    <option value="Unloading">Unloading (פריקה ביעד)</option>
                    <option value="Baggage Claim">Baggage Claim (מסירת כבודה)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    מיקום סריקה (scan_location)
                  </label>
                  <input
                    type="text"
                    required
                    value={scanForm.scan_location}
                    onChange={e => setScanForm({ ...scanForm, scan_location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    מזהה מפעיל / סורק (operator_id)
                  </label>
                  <input
                    type="text"
                    required
                    value={scanForm.operator_id}
                    onChange={e => setScanForm({ ...scanForm, operator_id: e.target.value })}
                    className="w-full font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    הערות תפעוליות (notes)
                  </label>
                  <input
                    type="text"
                    value={scanForm.notes || ''}
                    onChange={e => setScanForm({ ...scanForm, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewScanModal(false)}
                    className="px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-white bg-amber-600 hover:bg-amber-700 font-semibold rounded-lg shadow-2xs"
                  >
                    רשום סריקה
                  </button>
                </div>
              </form>
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
              מזוודות וכבודה (Baggage)
            </h1>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              ישות BAGGAGE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            רמה 1 ו-2: ניהול משקלים, תגיות ברקוד, מעקב סטטוס והיסטוריית סריקות (BaggageScan)
          </p>
        </div>

        <button
          onClick={() => navigateTo('baggage', 'form', undefined, 'create')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>קלוט כבודה חדשה</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="חיפוש לפי baggage_id, tag_number, דרכון או טיסה..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pr-9 pl-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 bg-white w-full sm:w-48"
          >
            <option value="ALL">כל הסטטוסים (All Statuses)</option>
            <option value="Checked">Checked</option>
            <option value="Security Cleared">Security Cleared</option>
            <option value="Loaded">Loaded</option>
            <option value="In Transit">In Transit</option>
            <option value="Unloaded">Unloaded</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>
      </div>

      {/* Baggage Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">baggage_id (PK)</th>
                <th className="py-3 px-4">תג ברקוד (tag_number)</th>
                <th className="py-3 px-4">משקל (weight_kg)</th>
                <th className="py-3 px-4">טיפול מיוחד</th>
                <th className="py-3 px-4">טיסה (flight_id)</th>
                <th className="py-3 px-4">סטטוס כבודה (status)</th>
                <th className="py-3 px-4 text-left">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBaggages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    לא נמצאו פריטי כבודה
                  </td>
                </tr>
              ) : (
                filteredBaggages.map(bag => (
                  <tr key={bag.baggage_id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-amber-800">
                      {bag.baggage_id}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {bag.tag_number}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums font-semibold">
                      {bag.weight_kg} ק״ג
                    </td>
                    <td className="py-3 px-4">
                      {bag.special_handling && bag.special_handling !== 'None' ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {bag.special_handling}
                        </span>
                      ) : (
                        <span className="text-slate-400">סטנדרטי</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                      {bag.flight_id}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        bag.status === 'Delivered' ? 'bg-emerald-100 text-emerald-900' :
                        bag.status === 'Loaded' ? 'bg-sky-100 text-sky-900' :
                        bag.status === 'In Transit' ? 'bg-indigo-100 text-indigo-900' :
                        bag.status === 'Delayed' ? 'bg-rose-100 text-rose-900' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {bag.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigateTo('baggage', 'details', bag.baggage_id)}
                          title="צפה בהיסטוריית סריקות ופרטים"
                          className="flex items-center gap-1 p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-semibold">סריקות</span>
                        </button>
                        <button
                          onClick={() => navigateTo('baggage', 'form', bag.baggage_id, 'edit')}
                          title="ערוך"
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBaggage(bag.baggage_id)}
                          title="מחק"
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
          <span>סה״כ {filteredBaggages.length} פריטי כבודה רשומים</span>
          <span className="font-mono text-[11px]">BAGGAGE & BAGGAGESCAN SCHEMA</span>
        </div>
      </div>
    </div>
  );
};
