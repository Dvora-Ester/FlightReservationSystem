import React, { useState } from 'react';
import { 
  Plane, 
  User, 
  Armchair, 
  Luggage, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Calendar, 
  DollarSign, 
  Sparkles,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { useFlightApp } from '../context/FlightAppContext';
import { Flight, Passenger, Seat, FareClass, SpecialHandling, Ticket, Baggage } from '../types';

export const BookingWizardView: React.FC = () => {
  const { 
    flights, 
    passengers, 
    seats, 
    addPassenger, 
    addTicket, 
    addBaggage, 
    navigateTo 
  } = useFlightApp();

  // Wizard Step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Flight Selection
  const [selectedFlightId, setSelectedFlightId] = useState<string>(flights[0]?.flight_id || 'LY001');

  // Step 2: Passenger Details
  const [isExistingPassenger, setIsExistingPassenger] = useState<boolean>(true);
  const [selectedPassport, setSelectedPassport] = useState<string>(passengers[0]?.passport_number || '');
  const [newPassenger, setNewPassenger] = useState<Passenger>({
    passport_number: '',
    first_name: '',
    last_name: '',
    birth_date: '1992-05-15',
    nationality: 'ישראל (IL)',
    phone: '054-1122334',
    preferences: 'מושב חלון, ארוחה רגילה',
    email: 'traveler@gmail.com'
  });

  // Step 3: Seat Selection
  const [selectedSeatNumber, setSelectedSeatNumber] = useState<string>('20A');

  // Step 4: Fare Class & Baggage
  const [selectedFareClass, setSelectedFareClass] = useState<FareClass>('Economy Regular');
  const [includeBaggage, setIncludeBaggage] = useState<boolean>(true);
  const [baggageWeight, setBaggageWeight] = useState<number>(23);
  const [specialHandling, setSpecialHandling] = useState<SpecialHandling>('None');

  // Step 5: Confirmation State
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  // Derived state
  const currentFlight = flights.find(f => f.flight_id === selectedFlightId) || flights[0];
  const flightSeats = seats.filter(s => s.flight_id === selectedFlightId);

  // Base pricing
  const basePrices: Record<FareClass, number> = {
    'Economy Regular': 650,
    'Economy Flexible': 890,
    'Premium Economy': 1350,
    'Business Standard': 2150,
    'First Suite': 3800
  };
  const baggageCost = includeBaggage ? (baggageWeight > 23 ? 120 : 60) : 0;
  const totalPrice = (basePrices[selectedFareClass] || 650) + baggageCost;

  // Active passenger for display
  const activePassenger: Passenger = isExistingPassenger 
    ? (passengers.find(p => p.passport_number === selectedPassport) || passengers[0])
    : newPassenger;

  // Step validation
  const canProceed = () => {
    if (currentStep === 1) return !!selectedFlightId;
    if (currentStep === 2) {
      if (isExistingPassenger) return !!selectedPassport;
      return !!newPassenger.passport_number && !!newPassenger.first_name && !!newPassenger.last_name;
    }
    if (currentStep === 3) return !!selectedSeatNumber;
    if (currentStep === 4) return !!selectedFareClass;
    return true;
  };

  const handleNext = () => {
    if (currentStep < 5 && canProceed()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Final Submission
  const handleFinalSubmit = () => {
    // 1. If new passenger, save passenger
    if (!isExistingPassenger) {
      if (!passengers.some(p => p.passport_number === newPassenger.passport_number)) {
        addPassenger(newPassenger);
      }
    }

    // 2. Create Ticket
    const newTicketId = `TKT-${Math.floor(2000 + Math.random() * 8000)}`;
    const newTicket: Ticket = {
      ticket_id: newTicketId,
      booking_date: new Date().toISOString().slice(0, 10),
      fare_class: selectedFareClass,
      price: totalPrice,
      ticket_status: 'Confirmed',
      passport_number: activePassenger.passport_number,
      flight_id: selectedFlightId,
      seat_number: selectedSeatNumber
    };
    addTicket(newTicket);

    // 3. Create Baggage if included
    if (includeBaggage) {
      const newBaggageId = `BAG-${Math.floor(7000 + Math.random() * 2000)}`;
      const newBaggage: Baggage = {
        baggage_id: newBaggageId,
        tag_number: `TLV-${Math.floor(100000 + Math.random() * 900000)}`,
        weight_kg: baggageWeight,
        status: 'Checked',
        special_handling: specialHandling,
        flight_id: selectedFlightId,
        passport_number: activePassenger.passport_number
      };
      addBaggage(newBaggage);
    }

    setCreatedTicketId(newTicketId);
    setCurrentStep(5);
  };

  const stepsHeader = [
    { num: 1, title: 'בחירת טיסה', tech: 'FLIGHT' },
    { num: 2, title: 'פרטי נוסע', tech: 'PASSENGER' },
    { num: 3, title: 'בחירת מושב', tech: 'SEAT' },
    { num: 4, title: 'כבודה ותעריף', tech: 'FARE & BAGGAGE' },
    { num: 5, title: 'אישור והנפקה', tech: 'CONFIRMATION' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">
            תהליך הזמנה מלא שלב-אחר-שלב (Booking Wizard)
          </h1>
          <span className="text-xs font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
            רמה 3 · תהליך עומק
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          יצירת הזמנה מקושרת עם עדכון ישיר של ישויות FLIGHT, PASSENGER, SEAT, TICKET ו-BAGGAGE
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {stepsHeader.map(step => {
            const isDone = currentStep > step.num || (currentStep === 5 && createdTicketId !== null);
            const isCurrent = currentStep === step.num;
            return (
              <div 
                key={step.num}
                className={`p-2.5 rounded-lg border text-xs transition-all ${
                  isCurrent 
                    ? 'border-sky-500 bg-sky-50 text-sky-900 font-semibold' 
                    : isDone 
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800' 
                      : 'border-slate-100 bg-slate-50 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    isCurrent ? 'bg-sky-600 text-white' : isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isDone ? '✓' : step.num}
                  </div>
                  <div>
                    <div className="font-bold truncate">{step.title}</div>
                    <div className="text-[10px] font-mono text-slate-400">{step.tech}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: FLIGHT SELECTION */}
      {currentStep === 1 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              שלב 1: בחירת טיסה מלוח הטיסות (FLIGHT)
            </h2>
            <p className="text-xs text-slate-500">
              בחר טיסה פעילה להזמנה
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flights.map(flight => {
              const isSelected = selectedFlightId === flight.flight_id;
              const fSeats = seats.filter(s => s.flight_id === flight.flight_id);
              const freeSeats = fSeats.filter(s => !s.is_occupied).length;

              return (
                <div
                  key={flight.flight_id}
                  onClick={() => setSelectedFlightId(flight.flight_id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-sky-500 bg-sky-50/70 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-sky-800 bg-sky-100/60 px-2 py-0.5 rounded">
                      {flight.flight_id}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {flight.flight_status}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-sm font-bold text-slate-900">{flight.flight_name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-mono">
                      {flight.origin} ← {flight.destination} · שער {flight.gate || 'TBD'}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div>
                      <span>המראה: </span>
                      <span className="font-mono font-bold">{flight.departure_time}</span>
                      <span className="text-[11px] text-slate-400 mr-1">({flight.departure_date})</span>
                    </div>
                    <div className="text-emerald-700 font-medium">
                      {freeSeats} מושבים פנויים
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: PASSENGER DETAILS */}
      {currentStep === 2 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                שלב 2: פרטי הנוסע (PASSENGER)
              </h2>
              <p className="text-xs text-slate-500">
                שיוך הנוסע להזמנה לפי מספר דרכון (passport_number)
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setIsExistingPassenger(true)}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${
                  isExistingPassenger ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                נוסע רשום במערכת
              </button>
              <button
                type="button"
                onClick={() => setIsExistingPassenger(false)}
                className={`px-3 py-1 text-xs font-semibold rounded-md ${
                  !isExistingPassenger ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                רישום נוסע חדש
              </button>
            </div>
          </div>

          {isExistingPassenger ? (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700">
                בחר נוסע קיים מתוך מאגר הנוסעים:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {passengers.map(p => {
                  const isSelected = selectedPassport === p.passport_number;
                  return (
                    <div
                      key={p.passport_number}
                      onClick={() => setSelectedPassport(p.passport_number)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-sky-500 bg-sky-50 shadow-2xs' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">
                          {p.first_name} {p.last_name}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-sky-800">
                          {p.passport_number}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        אזרחות: {p.nationality} · טלפון: {p.phone || '—'}
                      </div>
                      {p.preferences && (
                        <div className="text-[10px] text-slate-400 mt-1 truncate">
                          העדפה: {p.preferences}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  מספר דרכון (passport_number - PK) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="IL..."
                  value={newPassenger.passport_number}
                  onChange={e => setNewPassenger({ ...newPassenger, passport_number: e.target.value.toUpperCase() })}
                  className="w-full font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  אזרחות (nationality) *
                </label>
                <input
                  type="text"
                  required
                  value={newPassenger.nationality}
                  onChange={e => setNewPassenger({ ...newPassenger, nationality: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  שם פרטי (first_name) *
                </label>
                <input
                  type="text"
                  required
                  value={newPassenger.first_name}
                  onChange={e => setNewPassenger({ ...newPassenger, first_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  שם משפחה (last_name) *
                </label>
                <input
                  type="text"
                  required
                  value={newPassenger.last_name}
                  onChange={e => setNewPassenger({ ...newPassenger, last_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  תאריך לידה (birth_date)
                </label>
                <input
                  type="date"
                  value={newPassenger.birth_date}
                  onChange={e => setNewPassenger({ ...newPassenger, birth_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  טלפון (phone)
                </label>
                <input
                  type="tel"
                  value={newPassenger.phone || ''}
                  onChange={e => setNewPassenger({ ...newPassenger, phone: e.target.value })}
                  className="w-full font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: SEAT SELECTION */}
      {currentStep === 3 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                שלב 3: בחירת מושב במטוס (SEAT)
              </h2>
              <p className="text-xs text-slate-500">
                טיסה {currentFlight.flight_id} · מושב נבחר: <span className="font-mono font-bold text-sky-800">{selectedSeatNumber}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>פנוי</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500" />
                <span>תפוס</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-sky-500 ring-2 ring-sky-300" />
                <span>בחירה נוכחית</span>
              </span>
            </div>
          </div>

          {/* Airplane Seat Picker Grid */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl max-w-md mx-auto">
            <div className="text-center text-xs font-mono text-slate-400 mb-4 pb-2 border-b border-slate-800">
              חרטום המטוס (NOSE) ↑
            </div>

            <div className="space-y-4">
              {/* Premium rows */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-amber-400 text-center font-mono">מחלקה ראשונה ועסקים</div>
                {[1, 2, 3].map(row => (
                  <div key={row} className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-500 w-4">{row}</span>
                    {['A', 'D', 'G', 'K'].map(col => {
                      const seatNum = `${row}${col}`;
                      const seatObj = flightSeats.find(s => s.seat_number === seatNum);
                      const isOccupied = seatObj?.is_occupied;
                      const isSelected = selectedSeatNumber === seatNum;
                      return (
                        <button
                          key={seatNum}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => setSelectedSeatNumber(seatNum)}
                          className={`w-8 h-8 rounded text-xs font-mono font-bold transition-all ${
                            isSelected 
                              ? 'bg-sky-500 text-white ring-2 ring-sky-300 scale-110 shadow-sm' 
                              : isOccupied 
                                ? 'bg-rose-950 text-rose-400 border border-rose-800 cursor-not-allowed opacity-60' 
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-800'
                          }`}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Economy rows */}
              <div className="space-y-1.5 pt-3 border-t border-slate-800">
                <div className="text-[10px] text-slate-400 text-center font-mono">מחלקת תיירים</div>
                {[20, 21, 22, 23, 24].map(row => (
                  <div key={row} className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono text-slate-500 w-5">{row}</span>
                    {['A', 'B', 'C', 'D', 'E', 'F'].map(col => {
                      const seatNum = `${row}${col}`;
                      const seatObj = flightSeats.find(s => s.seat_number === seatNum);
                      const isOccupied = seatObj?.is_occupied;
                      const isSelected = selectedSeatNumber === seatNum;
                      return (
                        <button
                          key={seatNum}
                          type="button"
                          disabled={isOccupied}
                          onClick={() => setSelectedSeatNumber(seatNum)}
                          className={`w-7 h-7 rounded text-[11px] font-mono font-bold transition-all ${
                            isSelected 
                              ? 'bg-sky-500 text-white ring-2 ring-sky-300 scale-110 shadow-sm' 
                              : isOccupied 
                                ? 'bg-rose-950 text-rose-400 border border-rose-800 cursor-not-allowed opacity-60' 
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-800'
                          }`}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: FARE CLASS & BAGGAGE */}
      {currentStep === 4 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              שלב 4: בחירת מחלקת תעריף וכבודה (TICKET & BAGGAGE)
            </h2>
            <p className="text-xs text-slate-500">
              הגדרת מחלקת הכרטיס והוספת מזוודות לבטן המטוס
            </p>
          </div>

          {/* Fare Classes */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">בחר מחלקת תעריף (fare_class):</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(['Economy Regular', 'Economy Flexible', 'Business Standard', 'First Suite'] as FareClass[]).map(fc => {
                const isSelected = selectedFareClass === fc;
                const price = basePrices[fc];
                return (
                  <div
                    key={fc}
                    onClick={() => setSelectedFareClass(fc)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900">{fc}</div>
                    <div className="text-lg font-mono font-bold text-sky-800 mt-2">${price}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {fc.includes('First') ? 'כולל 3 מזוודות + שירות מלא' :
                       fc.includes('Business') ? 'כולל 2 מזוודות + גישה לטרקלין' :
                       fc.includes('Flexible') ? 'שינוי ללא דמי ביטול' : 'כרטיס בסיסי'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Baggage Options */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Luggage className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-slate-900">הוספת כבודה לבטן המטוס (BAGGAGE)</span>
              </div>
              <input
                type="checkbox"
                checked={includeBaggage}
                onChange={e => setIncludeBaggage(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded"
              />
            </div>

            {includeBaggage && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    משקל משוער בק״ג (weight_kg)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="40"
                    value={baggageWeight}
                    onChange={e => setBaggageWeight(Number(e.target.value))}
                    className="w-full font-mono px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    עד 23 ק״ג תעריף רגיל ($60). מעל 23 ק״ג תעריף משקל חריג ($120).
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    טיפול מיוחד (special_handling)
                  </label>
                  <select
                    value={specialHandling}
                    onChange={e => setSpecialHandling(e.target.value as SpecialHandling)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="None">None (כבודה רגילה)</option>
                    <option value="Fragile">Fragile (שביר)</option>
                    <option value="Oversized">Oversized (חריג מידות)</option>
                    <option value="Priority">Priority (עדיפות פריקה)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm">
            <span className="font-semibold text-slate-700">סה״כ לתשלום מחושב:</span>
            <span className="font-mono font-bold text-xl text-emerald-700">${totalPrice}</span>
          </div>
        </div>
      )}

      {/* STEP 5: CONFIRMATION & BOARDING PASS */}
      {currentStep === 5 && (
        <div className="space-y-6">
          {createdTicketId ? (
            /* Success State */
            <div className="bg-white border border-emerald-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-emerald-700">
                <CheckCircle className="w-8 h-8 shrink-0 text-emerald-600" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    ההזמנה הושלמה והכרטיס הונפק בהצלחה!
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    TICKET ID: {createdTicketId} · הנתונים נשמרו בישויות המערכת
                  </p>
                </div>
              </div>

              {/* Boarding Pass Preview */}
              <div className="bg-gradient-to-r from-sky-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono text-sky-300">BOARDING PASS · כרטיס עלייה למטוס</span>
                    <div className="text-2xl font-mono font-bold">{currentFlight.flight_id}</div>
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-xs text-slate-400 block">כרטיס</span>
                    <span className="text-sky-400 font-bold">{createdTicketId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">נוסע</span>
                    <span className="font-bold text-white text-sm block mt-0.5">
                      {activePassenger.first_name} {activePassenger.last_name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{activePassenger.passport_number}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">מסלול</span>
                    <span className="font-bold text-white text-sm block mt-0.5 font-mono">
                      {currentFlight.origin} → {currentFlight.destination}
                    </span>
                    <span className="text-[10px] text-slate-400">{currentFlight.departure_date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">מושב</span>
                    <span className="text-2xl font-black text-amber-300 block font-mono">
                      {selectedSeatNumber}
                    </span>
                    <span className="text-[10px] text-slate-300">{selectedFareClass}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">המראה & שער</span>
                    <span className="text-base font-bold text-white block font-mono">
                      {currentFlight.departure_time} · שער {currentFlight.gate || 'TBD'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">מחיר: ${totalPrice}</span>
                  </div>
                </div>

                {includeBaggage && (
                  <div className="pt-3 border-t border-white/10 text-xs text-slate-300 font-mono flex items-center justify-between">
                    <span>כבודה רשומה: {baggageWeight} ק״ג ({specialHandling})</span>
                    <span className="text-amber-400">הופק תג מזוודה ונרשמה סריקת קליטה (Intake)</span>
                  </div>
                )}
              </div>

              {/* Next Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigateTo('tickets', 'details', createdTicketId)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs"
                >
                  הצג כרטיס במסך TICKET
                </button>
                <button
                  onClick={() => navigateTo('baggage', 'list')}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  צפה בכבודה ובסריקות
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setCreatedTicketId(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  בצע הזמנה נוספת
                </button>
              </div>
            </div>
          ) : (
            /* Review State before submit */
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">
                  שלב 5: סיכום ואישור הזמנה לפני כרטוס
                </h2>
                <p className="text-xs text-slate-500">
                  בדוק את הפרטים בטרם יצירת הרשומות במסד הנתונים
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-sky-600" />
                    <span>פרטי טיסה</span>
                  </div>
                  <div>קו: <span className="font-semibold">{currentFlight.flight_name}</span></div>
                  <div>מזהה (flight_id): <span className="font-mono font-bold">{currentFlight.flight_id}</span></div>
                  <div>מוצא ויעד: <span className="font-mono">{currentFlight.origin} → {currentFlight.destination}</span></div>
                  <div>מועד: {currentFlight.departure_date} ב-{currentFlight.departure_time}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>פרטי נוסע</span>
                  </div>
                  <div>שם: <span className="font-semibold">{activePassenger.first_name} {activePassenger.last_name}</span></div>
                  <div>דרכון (passport_number): <span className="font-mono font-bold">{activePassenger.passport_number}</span></div>
                  <div>אזרחות: {activePassenger.nationality}</div>
                  <div>טלפון: {activePassenger.phone || '—'}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-sky-600" />
                    <span>מושב ותעריף</span>
                  </div>
                  <div>מושב שנבחר (seat_number): <span className="font-mono font-bold text-indigo-700">{selectedSeatNumber}</span></div>
                  <div>מחלקת כרטיס (fare_class): <span className="font-semibold">{selectedFareClass}</span></div>
                  <div>מחיר סופי (price): <span className="font-mono font-bold text-emerald-700 text-sm">${totalPrice}</span></div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Luggage className="w-4 h-4 text-amber-600" />
                    <span>כבודה (Baggage)</span>
                  </div>
                  <div>הוספת כבודה: <span className="font-semibold">{includeBaggage ? 'כן' : 'לא'}</span></div>
                  {includeBaggage && (
                    <>
                      <div>משקל (weight_kg): <span className="font-mono">{baggageWeight} ק״ג</span></div>
                      <div>טיפול מיוחד: {specialHandling}</div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>חזור לשלב הקודם</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>אשר והנפק כרטיס כעת (${totalPrice})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons for Steps 1 to 4 */}
      {currentStep < 5 && (
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={handlePrev}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg disabled:opacity-40 flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>הקודם</span>
          </button>

          <button
            type="button"
            disabled={!canProceed()}
            onClick={handleNext}
            className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs disabled:opacity-40 flex items-center gap-1.5"
          >
            <span>המשך לשלב {currentStep + 1}</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
