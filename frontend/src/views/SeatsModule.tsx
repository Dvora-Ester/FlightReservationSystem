import React, { useState } from 'react';
import { 
  Armchair, 
  Plane, 
  Search, 
  Check, 
  User, 
  Layers, 
  Ticket as TicketIcon, 
  Filter, 
  Info,
  Lock,
  Unlock,
  Plus
} from 'lucide-react';
import { useFlightApp } from '../context/FlightAppContext';
import { Seat, SeatClass, SeatPosition } from '../types';

export const SeatsModule: React.FC = () => {
  const { 
    flights, 
    seats, 
    tickets, 
    passengers, 
    nav, 
    navigateTo, 
    updateSeatOccupancy 
  } = useFlightApp();

  const [selectedFlightId, setSelectedFlightId] = useState<string>(
    nav.flightIdForSeatMap || flights[0]?.flight_id || 'LY001'
  );
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [classFilter, setClassFilter] = useState<string>('ALL');

  const currentFlight = flights.find(f => f.flight_id === selectedFlightId);
  const flightSeats = seats.filter(s => s.flight_id === selectedFlightId);

  const filteredSeats = flightSeats.filter(s => {
    return classFilter === 'ALL' || s.seat_class === classFilter;
  });

  // Calculate statistics
  const totalSeats = flightSeats.length;
  const occupiedSeats = flightSeats.filter(s => s.is_occupied).length;
  const availableSeats = totalSeats - occupiedSeats;
  const occupancyRate = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  // Separate seats into cabins
  const firstSeats = flightSeats.filter(s => s.seat_class === 'First');
  const businessSeats = flightSeats.filter(s => s.seat_class === 'Business');
  const premEcoSeats = flightSeats.filter(s => s.seat_class === 'Premium Economy');
  const ecoSeats = flightSeats.filter(s => s.seat_class === 'Economy');

  // Find linked ticket & passenger for selected seat
  const seatTicket = selectedSeat?.ticket_id ? tickets.find(t => t.ticket_id === selectedSeat.ticket_id) : null;
  const seatPassenger = seatTicket ? passengers.find(p => p.passport_number === seatTicket.passport_number) : null;

  const handleToggleOccupancy = (seat: Seat) => {
    const newOccupiedState = !seat.is_occupied;
    updateSeatOccupancy(seat.flight_id, seat.seat_number, newOccupiedState, undefined);
    setSelectedSeat({ ...seat, is_occupied: newOccupiedState, ticket_id: undefined });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Title & Flight Selector Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              מושבים ותצורת מטוס (Seat)
            </h1>
            <span className="text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
              ישות חלשה (flight_id + seat_number)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            רמה 1 ורמה 3: מפת מושבים אינטראקטיבית של טיסה, בקרת תפוסה ושיוך כרטיסים
          </p>
        </div>

        {/* Flight Picker & View Mode */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
            <span className="text-xs font-semibold text-slate-500 pr-2">בחר טיסה:</span>
            <select
              value={selectedFlightId}
              onChange={e => {
                setSelectedFlightId(e.target.value);
                setSelectedSeat(null);
              }}
              className="text-xs font-mono font-bold py-1 px-2 border-0 focus:ring-0 bg-transparent text-sky-800"
            >
              {flights.map(f => (
                <option key={f.flight_id} value={f.flight_id}>
                  {f.flight_id} ({f.origin} → {f.destination})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              מפת תא נוסעים
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              טבלת שדות
            </button>
          </div>
        </div>
      </div>

      {/* Flight Banner Stats */}
      {currentFlight && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">
                {currentFlight.flight_id} · {currentFlight.aircraft_model || 'Boeing 787'}
              </div>
              <div className="text-sm font-bold text-slate-900">
                {currentFlight.flight_name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">סה״כ מושבים</span>
              <span className="font-bold text-slate-900 tabular-nums">{totalSeats}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">מושבים תפוסים</span>
              <span className="font-bold text-rose-600 tabular-nums">{occupiedSeats}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">מושבים פנויים</span>
              <span className="font-bold text-emerald-600 tabular-nums">{availableSeats}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">תפוסה</span>
              <span className="font-bold text-sky-700 tabular-nums">{occupancyRate}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content: Seat Map OR Table */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fuselage / Airplane Seat Map Container (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400 mb-6">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-500/80 inline-block" />
                  <span>פנוי (Available)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-rose-500/80 inline-block" />
                  <span>תפוס (Occupied)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded ring-2 ring-sky-400 bg-sky-500 inline-block" />
                  <span>נבחר (Selected)</span>
                </span>
              </div>
              <span className="font-mono text-slate-500 text-[11px]">חרטום המטוס (NOSE) ↑</span>
            </div>

            {/* Fuselage Outline */}
            <div className="max-w-md mx-auto bg-slate-800/80 rounded-t-3xl border border-slate-700 p-4 sm:p-6 space-y-6">
              {/* Cockpit / Nose visual */}
              <div className="h-6 w-24 mx-auto rounded-t-full bg-slate-700/80 border-t border-slate-600 flex items-center justify-center text-[9px] text-slate-400 font-mono tracking-widest">
                קוקפיט
              </div>

              {/* First & Business Section */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-amber-400 font-mono text-center tracking-wider pb-1 border-b border-slate-700">
                  מחלקה ראשונה ועסקים (1-2-1)
                </div>
                {[1, 2, 3].map(row => {
                  const rowSeats = flightSeats.filter(s => s.seat_number.startsWith(`${row}`));
                  return (
                    <div key={row} className="flex items-center justify-between gap-2 py-1">
                      <span className="text-[10px] font-mono text-slate-500 w-4">{row}</span>
                      
                      {/* Left Window (A) */}
                      {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}A`))}
                      
                      {/* Aisle */}
                      <div className="w-4 border-r border-dashed border-slate-700 h-6" />
                      
                      {/* Center Aisle Seats (D, G) */}
                      <div className="flex gap-2">
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}D`))}
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}G`))}
                      </div>

                      {/* Aisle */}
                      <div className="w-4 border-l border-dashed border-slate-700 h-6" />

                      {/* Right Window (K) */}
                      {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}K`))}
                    </div>
                  );
                })}
              </div>

              {/* Galley / Divider */}
              <div className="py-1 text-center text-[9px] text-slate-500 border-y border-slate-700 font-mono">
                דלתות יציאה ומטבח קדמי (GALLEY / EXIT)
              </div>

              {/* Premium Economy Section */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-sky-400 font-mono text-center tracking-wider pb-1 border-b border-slate-700">
                  פרימיום אקונומי (2-3-2)
                </div>
                {[10, 11].map(row => {
                  const rowSeats = flightSeats.filter(s => s.seat_number.startsWith(`${row}`));
                  return (
                    <div key={row} className="flex items-center justify-between gap-1.5 py-1">
                      <span className="text-[10px] font-mono text-slate-500 w-5">{row}</span>
                      
                      <div className="flex gap-1">
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}A`))}
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}C`))}
                      </div>

                      <div className="w-3" />

                      <div className="flex gap-1">
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}D`))}
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}E`))}
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}F`))}
                      </div>

                      <div className="w-3" />

                      <div className="flex gap-1">
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}H`))}
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}K`))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Economy Section */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-400 font-mono text-center tracking-wider pb-1 border-b border-slate-700">
                  מחלקת תיירים (3-3-3)
                </div>
                {[20, 21, 22, 23, 24].map(row => {
                  const rowSeats = flightSeats.filter(s => s.seat_number.startsWith(`${row}`));
                  return (
                    <div key={row} className="flex items-center justify-between gap-1 py-1">
                      <span className="text-[10px] font-mono text-slate-500 w-5">{row}</span>

                      <div className="flex gap-1">
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}A`))}
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}B`))}
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}C`))}
                      </div>

                      <div className="w-2" />

                      <div className="flex gap-1">
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}D`))}
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}E`))}
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}F`))}
                      </div>

                      <div className="w-2" />

                      <div className="flex gap-1">
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}H`))}
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}J`))}
                        {renderSeatButton(rowSeats.find(s => s.seat_number === `${row}K`))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Seat Inspector Side Panel (1 Col) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xs h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-sm">
                מפקח מושב (Seat Inspector)
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                SEAT ATTRIBUTES
              </span>
            </div>

            {selectedSeat ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-lg font-mono">
                      {selectedSeat.seat_number}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {selectedSeat.seat_class}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        מיקום: {selectedSeat.seat_position === 'Window' ? 'חלון' : selectedSeat.seat_position === 'Aisle' ? 'מעבר' : 'אמצע'}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    selectedSeat.is_occupied ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedSeat.is_occupied ? 'תפוס' : 'פנוי'}
                  </span>
                </div>

                {/* Technical Composite Key Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400 font-mono">flight_id (PK part 1)</span>
                    <span className="font-mono font-bold text-slate-800">{selectedSeat.flight_id}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400 font-mono">seat_number (PK part 2)</span>
                    <span className="font-mono font-bold text-slate-800">{selectedSeat.seat_number}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400 font-mono">seat_class</span>
                    <span className="font-semibold text-slate-800">{selectedSeat.seat_class}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400 font-mono">seat_position</span>
                    <span className="font-semibold text-slate-800">{selectedSeat.seat_position}</span>
                  </div>
                </div>

                {/* Occupant Details if occupied */}
                {selectedSeat.is_occupied && (
                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-2 border border-slate-200">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-600" />
                      <span>שיוך כרטיס ונוסע</span>
                    </div>
                    {seatTicket ? (
                      <div className="space-y-1 text-slate-600">
                        <div>כרטיס: <span className="font-mono font-bold text-sky-700">{seatTicket.ticket_id}</span></div>
                        <div>נוסע: <span className="font-semibold">{seatPassenger ? `${seatPassenger.first_name} ${seatPassenger.last_name}` : seatTicket.passport_number}</span></div>
                        <div>דרכון: <span className="font-mono">{seatTicket.passport_number}</span></div>
                        <button
                          onClick={() => navigateTo('tickets', 'details', seatTicket.ticket_id)}
                          className="mt-2 text-sky-600 hover:text-sky-800 text-xs font-semibold block"
                        >
                          הצג פרטי כרטיס מלאים ←
                        </button>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-[11px]">
                        המושב מסומן כתפוס ידנית (ללא שיוך כרטיס פעיל)
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleToggleOccupancy(selectedSeat)}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      selectedSeat.is_occupied 
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    {selectedSeat.is_occupied ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{selectedSeat.is_occupied ? 'שחרר מושב (הפוך לפנוי)' : 'סמן מושב כתפוס'}</span>
                  </button>

                  {!selectedSeat.is_occupied && (
                    <button
                      onClick={() => navigateTo('bookingwizard')}
                      className="w-full py-2 px-3 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-2xs"
                    >
                      הזמן כרטיס למושב זה
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Armchair className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">בחר מושב במפה כדי להציג את פרטי הישות, השיוך לנוסע ובקרת תפוסה</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TABLE VIEW OF SEATS */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">סינון לפי מחלקה:</span>
              <select
                value={classFilter}
                onChange={e => setClassFilter(e.target.value)}
                className="text-xs py-1 px-2 border border-slate-200 rounded-md bg-white"
              >
                <option value="ALL">כל המחלקות</option>
                <option value="First">First</option>
                <option value="Business">Business</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Economy">Economy</option>
              </select>
            </div>
            <span className="text-xs text-slate-400 font-mono">SEAT TABLE VIEW</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-2.5 px-4 font-mono">flight_id (PK part 1)</th>
                  <th className="py-2.5 px-4 font-mono">seat_number (PK part 2)</th>
                  <th className="py-2.5 px-4">מחלקה (seat_class)</th>
                  <th className="py-2.5 px-4">מיקום (seat_position)</th>
                  <th className="py-2.5 px-4">תפוסה (is_occupied)</th>
                  <th className="py-2.5 px-4">מזהה כרטיס מקושר</th>
                  <th className="py-2.5 px-4 text-left">פעולה</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSeats.map(seat => (
                  <tr key={`${seat.flight_id}-${seat.seat_number}`} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-mono text-slate-700">{seat.flight_id}</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-sky-800">{seat.seat_number}</td>
                    <td className="py-2.5 px-4">{seat.seat_class}</td>
                    <td className="py-2.5 px-4 text-slate-600">{seat.seat_position}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        seat.is_occupied ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {seat.is_occupied ? 'תפוס' : 'פנוי'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">
                      {seat.ticket_id || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-left">
                      <button
                        onClick={() => handleToggleOccupancy(seat)}
                        className="text-xs font-medium text-sky-600 hover:text-sky-800"
                      >
                        {seat.is_occupied ? 'שחרר' : 'תפוס'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  function renderSeatButton(seat?: Seat) {
    if (!seat) return <div className="w-8 h-8" />;
    
    const isSelected = selectedSeat?.flight_id === seat.flight_id && selectedSeat?.seat_number === seat.seat_number;
    
    return (
      <button
        key={seat.seat_number}
        onClick={() => setSelectedSeat(seat)}
        title={`${seat.seat_number} (${seat.seat_class}, ${seat.seat_position}) - ${seat.is_occupied ? 'תפוס' : 'פנוי'}`}
        className={`
          w-7 h-7 sm:w-8 sm:h-8 rounded text-[11px] font-mono font-bold flex items-center justify-center transition-all
          ${isSelected 
            ? 'ring-2 ring-sky-400 bg-sky-500 text-white shadow-xs scale-105' 
            : seat.is_occupied 
              ? 'bg-rose-950/70 text-rose-300 border border-rose-800 hover:bg-rose-900' 
              : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 hover:border-emerald-600'
          }
        `}
      >
        {seat.seat_number}
      </button>
    );
  }
};
