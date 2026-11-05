import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Flight, 
  Passenger, 
  Seat, 
  Ticket, 
  CheckIn, 
  Baggage, 
  BaggageScan, 
  NavigationState, 
  ActiveModule 
} from '../types';
import { 
  INITIAL_FLIGHTS, 
  INITIAL_PASSENGERS, 
  INITIAL_SEATS, 
  INITIAL_TICKETS, 
  INITIAL_CHECKINS, 
  INITIAL_BAGGAGE, 
  INITIAL_BAGGAGESCANS,
  generateDefaultSeatsForFlight
} from '../data/mockData';

interface FlightAppContextType {
  flights: Flight[];
  passengers: Passenger[];
  seats: Seat[];
  tickets: Ticket[];
  checkins: CheckIn[];
  baggages: Baggage[];
  baggageScans: BaggageScan[];
  
  nav: NavigationState;
  navHistory: NavigationState[];
  navigateTo: (
    module: ActiveModule, 
    subView?: 'list' | 'details' | 'form', 
    selectedId?: string, 
    action?: 'view' | 'edit' | 'create',
    extra?: { flightIdForSeatMap?: string; baggageIdForScans?: string }
  ) => void;
  goBack: () => void;
  
  // Flights CRUD
  addFlight: (flight: Flight) => void;
  updateFlight: (flight: Flight) => void;
  deleteFlight: (flight_id: string) => void;

  // Passengers CRUD
  addPassenger: (passenger: Passenger) => void;
  updatePassenger: (passenger: Passenger) => void;
  deletePassenger: (passport_number: string) => void;

  // Tickets CRUD
  addTicket: (ticket: Ticket) => void;
  updateTicket: (ticket: Ticket) => void;
  deleteTicket: (ticket_id: string) => void;

  // Seats
  updateSeatOccupancy: (flight_id: string, seat_number: string, is_occupied: boolean, ticket_id?: string) => void;
  getSeatsForFlight: (flight_id: string) => Seat[];

  // CheckIn CRUD
  addCheckIn: (checkin: CheckIn) => void;
  updateCheckIn: (checkin: CheckIn) => void;
  deleteCheckIn: (checkin_id: string) => void;

  // Baggage CRUD
  addBaggage: (baggage: Baggage) => void;
  updateBaggage: (baggage: Baggage) => void;
  deleteBaggage: (baggage_id: string) => void;

  // BaggageScan
  addBaggageScan: (scan: BaggageScan) => void;
  deleteBaggageScan: (scan_id: string) => void;

  // Reset
  resetToMockData: () => void;

  // Toast notifications
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  clearToast: () => void;
}

const STORAGE_KEY = 'FRS_PROTOTYPE_DATA_V1';

const FlightAppContext = createContext<FlightAppContextType | undefined>(undefined);

export const FlightAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state or localStorage
  const [flights, setFlights] = useState<Flight[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_FLIGHTS`);
      return saved ? JSON.parse(saved) : INITIAL_FLIGHTS;
    } catch {
      return INITIAL_FLIGHTS;
    }
  });

  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_PASSENGERS`);
      return saved ? JSON.parse(saved) : INITIAL_PASSENGERS;
    } catch {
      return INITIAL_PASSENGERS;
    }
  });

  const [seats, setSeats] = useState<Seat[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_SEATS`);
      return saved ? JSON.parse(saved) : INITIAL_SEATS;
    } catch {
      return INITIAL_SEATS;
    }
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_TICKETS`);
      return saved ? JSON.parse(saved) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  });

  const [checkins, setCheckins] = useState<CheckIn[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_CHECKINS`);
      return saved ? JSON.parse(saved) : INITIAL_CHECKINS;
    } catch {
      return INITIAL_CHECKINS;
    }
  });

  const [baggages, setBaggages] = useState<Baggage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_BAGGAGE`);
      return saved ? JSON.parse(saved) : INITIAL_BAGGAGE;
    } catch {
      return INITIAL_BAGGAGE;
    }
  });

  const [baggageScans, setBaggageScans] = useState<BaggageScan[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_SCANS`);
      return saved ? JSON.parse(saved) : INITIAL_BAGGAGESCANS;
    } catch {
      return INITIAL_BAGGAGESCANS;
    }
  });

  // Navigation State
  const [nav, setNav] = useState<NavigationState>({
    module: 'dashboard',
    subView: 'list'
  });
  const [navHistory, setNavHistory] = useState<NavigationState[]>([
    { module: 'dashboard', subView: 'list' }
  ]);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const clearToast = () => setToast(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_FLIGHTS`, JSON.stringify(flights));
      localStorage.setItem(`${STORAGE_KEY}_PASSENGERS`, JSON.stringify(passengers));
      localStorage.setItem(`${STORAGE_KEY}_SEATS`, JSON.stringify(seats));
      localStorage.setItem(`${STORAGE_KEY}_TICKETS`, JSON.stringify(tickets));
      localStorage.setItem(`${STORAGE_KEY}_CHECKINS`, JSON.stringify(checkins));
      localStorage.setItem(`${STORAGE_KEY}_BAGGAGE`, JSON.stringify(baggages));
      localStorage.setItem(`${STORAGE_KEY}_SCANS`, JSON.stringify(baggageScans));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [flights, passengers, seats, tickets, checkins, baggages, baggageScans]);

  const navigateTo = (
    module: ActiveModule, 
    subView: 'list' | 'details' | 'form' = 'list', 
    selectedId?: string, 
    action: 'view' | 'edit' | 'create' = 'view',
    extra?: { flightIdForSeatMap?: string; baggageIdForScans?: string }
  ) => {
    const nextState: NavigationState = {
      module,
      subView,
      selectedId,
      action,
      flightIdForSeatMap: extra?.flightIdForSeatMap,
      baggageIdForScans: extra?.baggageIdForScans
    };
    setNavHistory(prev => [...prev, nextState]);
    setNav(nextState);
  };

  const goBack = () => {
    if (navHistory.length > 1) {
      const nextHistory = [...navHistory];
      nextHistory.pop(); // remove current
      const prevState = nextHistory[nextHistory.length - 1];
      setNavHistory(nextHistory);
      setNav(prevState);
    } else {
      // Return to dashboard
      const dashboardState: NavigationState = { module: 'dashboard', subView: 'list' };
      setNav(dashboardState);
      setNavHistory([dashboardState]);
    }
  };

  // CRUD Operations
  const addFlight = (newFlight: Flight) => {
    setFlights(prev => [newFlight, ...prev]);
    // Also create seats for this new flight
    const newSeats = generateDefaultSeatsForFlight(newFlight.flight_id);
    setSeats(prev => [...prev, ...newSeats]);
    showToast(`טיסה חדשה ${newFlight.flight_id} נוצרה בהצלחה`);
  };

  const updateFlight = (updated: Flight) => {
    setFlights(prev => prev.map(f => f.flight_id === updated.flight_id ? updated : f));
    showToast(`פרטי טיסה ${updated.flight_id} עודכנו בהצלחה`);
  };

  const deleteFlight = (flight_id: string) => {
    setFlights(prev => prev.filter(f => f.flight_id !== flight_id));
    setSeats(prev => prev.filter(s => s.flight_id !== flight_id));
    showToast(`טיסה ${flight_id} נמחקה`, 'warning');
  };

  const addPassenger = (newPassenger: Passenger) => {
    setPassengers(prev => [newPassenger, ...prev]);
    showToast(`הנוסע ${newPassenger.first_name} ${newPassenger.last_name} נוסף למערכת`);
  };

  const updatePassenger = (updated: Passenger) => {
    setPassengers(prev => prev.map(p => p.passport_number === updated.passport_number ? updated : p));
    showToast(`פרטי הנוסע ${updated.first_name} ${updated.last_name} עודכנו`);
  };

  const deletePassenger = (passport_number: string) => {
    setPassengers(prev => prev.filter(p => p.passport_number !== passport_number));
    showToast(`הנוסע נמחק מהמערכת`, 'warning');
  };

  const addTicket = (ticket: Ticket) => {
    setTickets(prev => [ticket, ...prev]);
    // Mark seat occupied
    updateSeatOccupancy(ticket.flight_id, ticket.seat_number, true, ticket.ticket_id);
    showToast(`כרטיס ${ticket.ticket_id} הונפק בהצלחה`);
  };

  const updateTicket = (updated: Ticket) => {
    setTickets(prev => prev.map(t => t.ticket_id === updated.ticket_id ? updated : t));
    showToast(`כרטיס ${updated.ticket_id} עודכן`);
  };

  const deleteTicket = (ticket_id: string) => {
    const target = tickets.find(t => t.ticket_id === ticket_id);
    if (target) {
      updateSeatOccupancy(target.flight_id, target.seat_number, false, undefined);
    }
    setTickets(prev => prev.filter(t => t.ticket_id !== ticket_id));
    showToast(`כרטיס ${ticket_id} בוטל`, 'warning');
  };

  const updateSeatOccupancy = (flight_id: string, seat_number: string, is_occupied: boolean, ticket_id?: string) => {
    setSeats(prev => prev.map(seat => {
      if (seat.flight_id === flight_id && seat.seat_number === seat_number) {
        return { ...seat, is_occupied, ticket_id };
      }
      return seat;
    }));
  };

  const getSeatsForFlight = (flight_id: string): Seat[] => {
    const flightSeats = seats.filter(s => s.flight_id === flight_id);
    if (flightSeats.length > 0) return flightSeats;
    // Generate if not existing
    const generated = generateDefaultSeatsForFlight(flight_id);
    setSeats(prev => [...prev, ...generated]);
    return generated;
  };

  const addCheckIn = (checkin: CheckIn) => {
    setCheckins(prev => [checkin, ...prev]);
    // Update linked ticket status if provided
    if (checkin.ticket_id) {
      setTickets(prev => prev.map(t => t.ticket_id === checkin.ticket_id ? { ...t, checkin_id: checkin.checkin_id, ticket_status: 'Checked-In' } : t));
    }
    showToast(`צ'ק-אין ${checkin.checkin_id} הושלם בהצלחה`);
  };

  const updateCheckIn = (updated: CheckIn) => {
    setCheckins(prev => prev.map(c => c.checkin_id === updated.checkin_id ? updated : c));
    showToast(`רישום צ'ק-אין ${updated.checkin_id} עודכן`);
  };

  const deleteCheckIn = (checkin_id: string) => {
    setCheckins(prev => prev.filter(c => c.checkin_id !== checkin_id));
    // Release link in tickets
    setTickets(prev => prev.map(t => t.checkin_id === checkin_id ? { ...t, checkin_id: undefined } : t));
    showToast(`רישום צ'ק-אין ${checkin_id} בוטל`, 'warning');
  };

  const addBaggage = (baggage: Baggage) => {
    setBaggages(prev => [baggage, ...prev]);
    // Also create initial Intake scan
    const initialScan: BaggageScan = {
      baggage_id: baggage.baggage_id,
      scan_id: `SCN-${Date.now().toString().slice(-4)}`,
      scan_timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      scan_location: 'דלפק שירות / קליטה ראשונית',
      scan_type: 'Intake',
      operator_id: 'SYSTEM_AUTO',
      notes: `קליטת פריט כבודה במשקל ${baggage.weight_kg} ק״ג`
    };
    setBaggageScans(prev => [initialScan, ...prev]);
    showToast(`מזוודה ${baggage.tag_number} נוספה למערכת`);
  };

  const updateBaggage = (updated: Baggage) => {
    setBaggages(prev => prev.map(b => b.baggage_id === updated.baggage_id ? updated : b));
    showToast(`פרטי מזוודה ${updated.tag_number} עודכנו`);
  };

  const deleteBaggage = (baggage_id: string) => {
    setBaggages(prev => prev.filter(b => b.baggage_id !== baggage_id));
    setBaggageScans(prev => prev.filter(s => s.baggage_id !== baggage_id));
    showToast(`מזוודה ${baggage_id} הוסרה מהמערכת`, 'warning');
  };

  const addBaggageScan = (scan: BaggageScan) => {
    setBaggageScans(prev => [scan, ...prev]);
    // Automatically update baggage status according to scan type
    const statusMap: Record<string, Baggage['status']> = {
      'Intake': 'Checked',
      'Security Screening': 'Security Cleared',
      'Sortation': 'Security Cleared',
      'Aircraft Loading': 'Loaded',
      'Unloading': 'Unloaded',
      'Baggage Claim': 'Delivered'
    };
    if (statusMap[scan.scan_type]) {
      setBaggages(prev => prev.map(b => b.baggage_id === scan.baggage_id ? { ...b, status: statusMap[scan.scan_type] } : b));
    }
    showToast(`סריקה חדשה נרשמה עבור ${scan.baggage_id}`);
  };

  const deleteBaggageScan = (scan_id: string) => {
    setBaggageScans(prev => prev.filter(s => s.scan_id !== scan_id));
    showToast(`אירוע סריקה נמחק`);
  };

  const resetToMockData = () => {
    setFlights(INITIAL_FLIGHTS);
    setPassengers(INITIAL_PASSENGERS);
    setSeats(INITIAL_SEATS);
    setTickets(INITIAL_TICKETS);
    setCheckins(INITIAL_CHECKINS);
    setBaggages(INITIAL_BAGGAGE);
    setBaggageScans(INITIAL_BAGGAGESCANS);
    showToast('נתוני הדוגמה אותחלו בהצלחה למצב המקורי', 'info');
  };

  return (
    <FlightAppContext.Provider
      value={{
        flights,
        passengers,
        seats,
        tickets,
        checkins,
        baggages,
        baggageScans,
        nav,
        navHistory,
        navigateTo,
        goBack,
        addFlight,
        updateFlight,
        deleteFlight,
        addPassenger,
        updatePassenger,
        deletePassenger,
        addTicket,
        updateTicket,
        deleteTicket,
        updateSeatOccupancy,
        getSeatsForFlight,
        addCheckIn,
        updateCheckIn,
        deleteCheckIn,
        addBaggage,
        updateBaggage,
        deleteBaggage,
        addBaggageScan,
        deleteBaggageScan,
        resetToMockData,
        toast,
        clearToast
      }}
    >
      {children}
    </FlightAppContext.Provider>
  );
};

export const useFlightApp = () => {
  const context = useContext(FlightAppContext);
  if (!context) {
    throw new Error('useFlightApp must be used within a FlightAppProvider');
  }
  return context;
};
