/**
 * Data Model Types for FlightReservationSystem
 * Entities match the user's specification with technical database column names.
 */

export type FlightStatus = 
  | 'Scheduled' 
  | 'Boarding' 
  | 'Departed' 
  | 'In Flight' 
  | 'Landed' 
  | 'Delayed' 
  | 'Cancelled';

export interface Flight {
  flight_id: string; // PK
  flight_name: string;
  origin: string;
  destination: string;
  departure_date: string;
  departure_time: string;
  arrival_date: string;
  arrival_time: string;
  flight_status: FlightStatus;
  aircraft_model?: string;
  gate?: string;
  terminal?: string;
}

export interface Passenger {
  passport_number: string; // PK
  first_name: string;
  last_name: string;
  birth_date: string;
  nationality: string;
  phone?: string; // Optional
  preferences?: string; // Optional (e.g. Kosher meal, Wheelchair, Window seat)
  email?: string;
}

export type SeatClass = 'First' | 'Business' | 'Premium Economy' | 'Economy';
export type SeatPosition = 'Window' | 'Aisle' | 'Middle';

export interface Seat {
  flight_id: string; // Composite PK Part 1 (Weak entity of FLIGHT)
  seat_number: string; // Composite PK Part 2 (e.g., '1A', '12B', '24F')
  seat_class: SeatClass;
  seat_position: SeatPosition;
  is_occupied?: boolean;
  ticket_id?: string;
}

export type TicketStatus = 'Confirmed' | 'Checked-In' | 'Boarded' | 'Cancelled' | 'Refunded';
export type FareClass = 'Economy Regular' | 'Economy Flexible' | 'Premium Economy' | 'Business Standard' | 'First Suite';

export interface Ticket {
  ticket_id: string; // PK
  booking_date: string;
  fare_class: FareClass;
  price: number; // in USD
  ticket_status: TicketStatus;
  passport_number: string; // FK -> PASSENGER
  flight_id: string; // Composite FK part 1 -> SEAT / FLIGHT
  seat_number: string; // Composite FK part 2 -> SEAT
  checkin_id?: string; // FK -> CHECKIN (nullable)
}

export type BoardingGroup = 'Group 1' | 'Group 2' | 'Group 3' | 'Group 4' | 'Group 5';
export type CheckinChannel = 'Online' | 'Mobile App' | 'Airport Kiosk' | 'Counter Agent';

export interface CheckIn {
  checkin_id: string; // PK
  checkin_date: string;
  checkin_time: string;
  boarding_group: BoardingGroup;
  checkin_channel: CheckinChannel;
  ticket_id?: string; // Associated ticket
}

export type BaggageStatus = 
  | 'Checked' 
  | 'Security Cleared' 
  | 'Loaded' 
  | 'In Transit' 
  | 'Unloaded' 
  | 'Delivered' 
  | 'Delayed';

export type SpecialHandling = 'None' | 'Fragile' | 'Oversized' | 'Priority' | 'Valuable';

export interface Baggage {
  baggage_id: string; // PK
  tag_number: string; // e.g., 'TLV-801294'
  weight_kg: number;
  status: BaggageStatus;
  special_handling?: SpecialHandling; // Optional
  checkin_id?: string; // FK -> CHECKIN (optional)
  flight_id: string; // Associated flight
  passport_number: string; // Associated passenger
}

export type ScanType = 'Intake' | 'Security Screening' | 'Sortation' | 'Aircraft Loading' | 'Unloading' | 'Baggage Claim';

export interface BaggageScan {
  baggage_id: string; // Composite PK Part 1 (Weak entity of BAGGAGE)
  scan_id: string; // Composite PK Part 2
  scan_timestamp: string;
  scan_location: string;
  scan_type: ScanType;
  operator_id: string;
  notes?: string;
}

// Navigation View State
export type ActiveModule = 
  | 'dashboard'
  | 'flights'
  | 'passengers'
  | 'tickets'
  | 'seats'
  | 'checkin'
  | 'baggage'
  | 'seatmap'
  | 'baggagescans'
  | 'bookingwizard';

export interface NavigationState {
  module: ActiveModule;
  subView?: 'list' | 'details' | 'form';
  selectedId?: string; // PK of selected item
  action?: 'view' | 'edit' | 'create';
  flightIdForSeatMap?: string;
  baggageIdForScans?: string;
}
