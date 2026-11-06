import { 
  Flight, 
  Passenger, 
  Seat, 
  Ticket, 
  CheckIn, 
  Baggage, 
  BaggageScan 
} from '../types';

export const INITIAL_PASSENGERS: Passenger[] = [
  {
    passport_number: 'IL9823412',
    first_name: 'דניאל',
    last_name: 'כהן',
    birth_date: '1988-04-12',
    nationality: 'ישראל (IL)',
    phone: '054-9123456',
    preferences: 'ארוחת גלאט כשר, מושב מעבר קדמי',
    email: 'daniel.cohen@example.com'
  },
  {
    passport_number: 'IL7712390',
    first_name: 'שרה',
    last_name: 'לוי',
    birth_date: '1992-09-24',
    nationality: 'ישראל (IL)',
    phone: '052-8877112',
    preferences: 'צמחוני, מושב חלון',
    email: 'sara.levi@example.com'
  },
  {
    passport_number: 'US4409128',
    first_name: 'אלכסנדר',
    last_name: 'גולדשטיין',
    birth_date: '1975-11-03',
    nationality: 'ארה"ב (US)',
    phone: '+1-212-555-0199',
    preferences: 'נוסע מתמיד Elite, שירות VIP בטרקלין',
    email: 'alex.goldstein@globalny.com'
  },
  {
    passport_number: 'IL6621943',
    first_name: 'מיכל',
    last_name: 'אברהם',
    birth_date: '1984-02-18',
    nationality: 'ישראל (IL)',
    phone: '050-3344556',
    preferences: 'ללא גלוטן, עריסה לתינוק',
    email: 'michal.avraham@techisrael.org'
  },
  {
    passport_number: 'GB8830192',
    first_name: 'ג׳יימס',
    last_name: 'ווילסון',
    birth_date: '1981-07-30',
    nationality: 'בריטניה (GB)',
    phone: '+44-20-7946-0912',
    preferences: 'ללא חלב',
    email: 'j.wilson@londoncorp.co.uk'
  },
  {
    passport_number: 'IL5518293',
    first_name: 'יונתן',
    last_name: 'שפירא',
    birth_date: '1995-12-05',
    nationality: 'ישראל (IL)',
    phone: '053-7722119',
    preferences: 'מקום מרווח לרגליים (Exit Row)',
    email: 'yonatan.sh@studio.design'
  },
  {
    passport_number: 'IL4491028',
    first_name: 'נועה',
    last_name: 'ברק',
    birth_date: '1999-06-14',
    nationality: 'ישראל (IL)',
    phone: '058-6622881',
    preferences: 'סיוע כבודה כבדה',
    email: 'noa.barak@university.ac.il'
  },
  {
    passport_number: 'FR9012384',
    first_name: 'קלייר',
    last_name: 'דובואה',
    birth_date: '1990-03-22',
    nationality: 'צרפת (FR)',
    phone: '+33-6-1234-5678',
    preferences: 'ארוחת דגים דלת נתרן',
    email: 'claire.dubois@paris-art.fr'
  }
];

export const INITIAL_FLIGHTS: Flight[] = [
  {
    flight_id: 'LY001',
    flight_name: 'תל אביב - ניו יורק (JFK)',
    origin: 'TLV',
    destination: 'JFK',
    departure_date: '2026-11-06',
    departure_time: '00:45',
    arrival_date: '2026-11-06',
    arrival_time: '06:15',
    flight_status: 'Boarding',
    aircraft_model: 'Boeing 787-9 Dreamliner',
    gate: 'D04',
    terminal: 'טרמינל 3'
  },
  {
    flight_id: 'LY315',
    flight_name: 'תל אביב - לונדון (LHR)',
    origin: 'TLV',
    destination: 'LHR',
    departure_date: '2026-11-06',
    departure_time: '10:15',
    arrival_date: '2026-11-06',
    arrival_time: '14:30',
    flight_status: 'Scheduled',
    aircraft_model: 'Boeing 787-8 Dreamliner',
    gate: 'B06',
    terminal: 'טרמינל 3'
  },
  {
    flight_id: 'UA085',
    flight_name: 'תל אביב - ניוארק (EWR)',
    origin: 'TLV',
    destination: 'EWR',
    departure_date: '2026-11-06',
    departure_time: '11:55',
    arrival_date: '2026-11-06',
    arrival_time: '17:20',
    flight_status: 'Scheduled',
    aircraft_model: 'Boeing 777-300ER',
    gate: 'C02',
    terminal: 'טרמינל 3'
  },
  {
    flight_id: 'BA162',
    flight_name: 'תל אביב - לונדון (LHR)',
    origin: 'TLV',
    destination: 'LHR',
    departure_date: '2026-11-05',
    departure_time: '16:40',
    arrival_date: '2026-11-05',
    arrival_time: '20:50',
    flight_status: 'In Flight',
    aircraft_model: 'Airbus A350-1000',
    gate: 'B02',
    terminal: 'טרמינל 3'
  },
  {
    flight_id: 'LY543',
    flight_name: 'תל אביב - אתונה (ATH)',
    origin: 'TLV',
    destination: 'ATH',
    departure_date: '2026-11-06',
    departure_time: '07:30',
    arrival_date: '2026-11-06',
    arrival_time: '09:45',
    flight_status: 'Scheduled',
    aircraft_model: 'Boeing 737-800',
    gate: 'B09',
    terminal: 'טרמינל 3'
  },
  {
    flight_id: 'EK932',
    flight_name: 'תל אביב - דובאי (DXB)',
    origin: 'TLV',
    destination: 'DXB',
    departure_date: '2026-11-05',
    departure_time: '18:50',
    arrival_date: '2026-11-05',
    arrival_time: '23:40',
    flight_status: 'Departed',
    aircraft_model: 'Boeing 777-300ER',
    gate: 'D08',
    terminal: 'טרמינל 3'
  }
];

// Helper to generate a realistic seat layout for flights
export function generateDefaultSeatsForFlight(flight_id: string): Seat[] {
  const seats: Seat[] = [];

  // Rows 1-2: First / Business (1-2-1 layout: A, D, G, K)
  const premiumRows = [1, 2, 3];
  const premiumCols = [
    { col: 'A', pos: 'Window' as const },
    { col: 'D', pos: 'Aisle' as const },
    { col: 'G', pos: 'Aisle' as const },
    { col: 'K', pos: 'Window' as const }
  ];

  premiumRows.forEach(r => {
    premiumCols.forEach(c => {
      seats.push({
        flight_id,
        seat_number: `${r}${c.col}`,
        seat_class: r === 1 ? 'First' : 'Business',
        seat_position: c.pos,
        is_occupied: false
      });
    });
  });

  // Rows 10-12: Premium Economy (2-3-2: A, C, D, E, F, H, K)
  const premEcoRows = [10, 11];
  const premEcoCols = [
    { col: 'A', pos: 'Window' as const },
    { col: 'C', pos: 'Aisle' as const },
    { col: 'D', pos: 'Aisle' as const },
    { col: 'E', pos: 'Middle' as const },
    { col: 'F', pos: 'Aisle' as const },
    { col: 'H', pos: 'Aisle' as const },
    { col: 'K', pos: 'Window' as const }
  ];

  premEcoRows.forEach(r => {
    premEcoCols.forEach(c => {
      seats.push({
        flight_id,
        seat_number: `${r}${c.col}`,
        seat_class: 'Premium Economy',
        seat_position: c.pos,
        is_occupied: false
      });
    });
  });

  // Rows 20-25: Economy (3-3-3: A, B, C, D, E, F, H, J, K)
  const ecoRows = [20, 21, 22, 23, 24];
  const ecoCols = [
    { col: 'A', pos: 'Window' as const },
    { col: 'B', pos: 'Middle' as const },
    { col: 'C', pos: 'Aisle' as const },
    { col: 'D', pos: 'Aisle' as const },
    { col: 'E', pos: 'Middle' as const },
    { col: 'F', pos: 'Aisle' as const },
    { col: 'H', pos: 'Aisle' as const },
    { col: 'J', pos: 'Middle' as const },
    { col: 'K', pos: 'Window' as const }
  ];

  ecoRows.forEach(r => {
    ecoCols.forEach(c => {
      seats.push({
        flight_id,
        seat_number: `${r}${c.col}`,
        seat_class: 'Economy',
        seat_position: c.pos,
        is_occupied: false
      });
    });
  });

  return seats;
}

export const INITIAL_SEATS: Seat[] = [
  ...generateDefaultSeatsForFlight('LY001'),
  ...generateDefaultSeatsForFlight('LY315'),
  ...generateDefaultSeatsForFlight('UA085'),
  ...generateDefaultSeatsForFlight('BA162'),
  ...generateDefaultSeatsForFlight('LY543'),
  ...generateDefaultSeatsForFlight('EK932')
];

export const INITIAL_CHECKINS: CheckIn[] = [
  {
    checkin_id: 'CHK-901',
    checkin_date: '2026-11-05',
    checkin_time: '21:30',
    boarding_group: 'Group 1',
    checkin_channel: 'Mobile App',
    ticket_id: 'TKT-1001'
  },
  {
    checkin_id: 'CHK-902',
    checkin_date: '2026-11-05',
    checkin_time: '22:10',
    boarding_group: 'Group 2',
    checkin_channel: 'Online',
    ticket_id: 'TKT-1002'
  },
  {
    checkin_id: 'CHK-903',
    checkin_date: '2026-11-05',
    checkin_time: '22:45',
    boarding_group: 'Group 1',
    checkin_channel: 'Counter Agent',
    ticket_id: 'TKT-1003'
  },
  {
    checkin_id: 'CHK-904',
    checkin_date: '2026-11-05',
    checkin_time: '14:20',
    boarding_group: 'Group 3',
    checkin_channel: 'Airport Kiosk',
    ticket_id: 'TKT-1004'
  },
  {
    checkin_id: 'CHK-905',
    checkin_date: '2026-11-05',
    checkin_time: '16:00',
    boarding_group: 'Group 2',
    checkin_channel: 'Mobile App',
    ticket_id: 'TKT-1005'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    ticket_id: 'TKT-1001',
    booking_date: '2026-10-15',
    fare_class: 'First Suite',
    price: 3450,
    ticket_status: 'Boarded',
    passport_number: 'US4409128',
    flight_id: 'LY001',
    seat_number: '1A',
    checkin_id: 'CHK-901'
  },
  {
    ticket_id: 'TKT-1002',
    booking_date: '2026-10-22',
    fare_class: 'Business Standard',
    price: 2180,
    ticket_status: 'Checked-In',
    passport_number: 'IL9823412',
    flight_id: 'LY001',
    seat_number: '2D',
    checkin_id: 'CHK-902'
  },
  {
    ticket_id: 'TKT-1003',
    booking_date: '2026-10-29',
    fare_class: 'Business Standard',
    price: 2250,
    ticket_status: 'Checked-In',
    passport_number: 'IL7712390',
    flight_id: 'LY001',
    seat_number: '2K',
    checkin_id: 'CHK-903'
  },
  {
    ticket_id: 'TKT-1004',
    booking_date: '2026-11-01',
    fare_class: 'Economy Flexible',
    price: 890,
    ticket_status: 'Boarded',
    passport_number: 'GB8830192',
    flight_id: 'BA162',
    seat_number: '20C',
    checkin_id: 'CHK-904'
  },
  {
    ticket_id: 'TKT-1005',
    booking_date: '2026-11-02',
    fare_class: 'Economy Regular',
    price: 740,
    ticket_status: 'Boarded',
    passport_number: 'FR9012384',
    flight_id: 'EK932',
    seat_number: '21A',
    checkin_id: 'CHK-905'
  },
  {
    ticket_id: 'TKT-1006',
    booking_date: '2026-11-03',
    fare_class: 'Economy Flexible',
    price: 1120,
    ticket_status: 'Confirmed',
    passport_number: 'IL6621943',
    flight_id: 'LY315',
    seat_number: '10A'
  },
  {
    ticket_id: 'TKT-1007',
    booking_date: '2026-11-04',
    fare_class: 'Economy Regular',
    price: 680,
    ticket_status: 'Confirmed',
    passport_number: 'IL5518293',
    flight_id: 'LY315',
    seat_number: '20D'
  },
  {
    ticket_id: 'TKT-1008',
    booking_date: '2026-11-04',
    fare_class: 'Premium Economy',
    price: 1450,
    ticket_status: 'Confirmed',
    passport_number: 'IL4491028',
    flight_id: 'UA085',
    seat_number: '10K'
  }
];

// Mark occupied seats in INITIAL_SEATS based on INITIAL_TICKETS
INITIAL_TICKETS.forEach(ticket => {
  const targetSeat = INITIAL_SEATS.find(
    s => s.flight_id === ticket.flight_id && s.seat_number === ticket.seat_number
  );
  if (targetSeat) {
    targetSeat.is_occupied = true;
    targetSeat.ticket_id = ticket.ticket_id;
  }
});

export const INITIAL_BAGGAGE: Baggage[] = [
  {
    baggage_id: 'BAG-7001',
    tag_number: 'TLV-990128',
    weight_kg: 23.4,
    status: 'Loaded',
    special_handling: 'Priority',
    checkin_id: 'CHK-901',
    flight_id: 'LY001',
    passport_number: 'US4409128'
  },
  {
    baggage_id: 'BAG-7002',
    tag_number: 'TLV-990129',
    weight_kg: 18.2,
    status: 'Loaded',
    special_handling: 'Fragile',
    checkin_id: 'CHK-901',
    flight_id: 'LY001',
    passport_number: 'US4409128'
  },
  {
    baggage_id: 'BAG-7003',
    tag_number: 'TLV-884120',
    weight_kg: 22.0,
    status: 'Loaded',
    special_handling: 'None',
    checkin_id: 'CHK-902',
    flight_id: 'LY001',
    passport_number: 'IL9823412'
  },
  {
    baggage_id: 'BAG-7004',
    tag_number: 'TLV-884121',
    weight_kg: 21.6,
    status: 'Loaded',
    special_handling: 'None',
    checkin_id: 'CHK-903',
    flight_id: 'LY001',
    passport_number: 'IL7712390'
  },
  {
    baggage_id: 'BAG-7005',
    tag_number: 'TLV-554190',
    weight_kg: 24.8,
    status: 'In Transit',
    special_handling: 'None',
    checkin_id: 'CHK-904',
    flight_id: 'BA162',
    passport_number: 'GB8830192'
  },
  {
    baggage_id: 'BAG-7006',
    tag_number: 'TLV-771920',
    weight_kg: 15.3,
    status: 'Delivered',
    special_handling: 'Fragile',
    checkin_id: 'CHK-905',
    flight_id: 'EK932',
    passport_number: 'FR9012384'
  },
  {
    baggage_id: 'BAG-7007',
    tag_number: 'TLV-331002',
    weight_kg: 29.5,
    status: 'Checked',
    special_handling: 'Oversized',
    flight_id: 'LY315',
    passport_number: 'IL4491028'
  }
];

export const INITIAL_BAGGAGESCANS: BaggageScan[] = [
  // Scans for BAG-7001 (Priority baggage on LY001)
  {
    baggage_id: 'BAG-7001',
    scan_id: 'SCN-101',
    scan_timestamp: '2026-11-05 21:35:12',
    scan_location: 'TLV דלפק צ׳ק אין 42 (טרמינל 3)',
    scan_type: 'Intake',
    operator_id: 'AGENT_TAL_42',
    notes: 'משקל נקלט 23.4 ק״ג, הוצמדה תגית עדיפות Priority'
  },
  {
    baggage_id: 'BAG-7001',
    scan_id: 'SCN-102',
    scan_timestamp: '2026-11-05 21:50:40',
    scan_location: 'TLV מתחם בידוק ביטחוני HBS מרתף 2',
    scan_type: 'Security Screening',
    operator_id: 'SEC_CT_SCAN_04',
    notes: 'בדיקת שיקוף רנטגן תקינה (Cleared)'
  },
  {
    baggage_id: 'BAG-7001',
    scan_id: 'SCN-103',
    scan_timestamp: '2026-11-05 22:18:05',
    scan_location: 'TLV מסוע מיון מרכזי - מסלול D4',
    scan_type: 'Sortation',
    operator_id: 'AUTO_SORT_SYS',
    notes: 'מוין לעגלת העמסה CART_B787_03'
  },
  {
    baggage_id: 'BAG-7001',
    scan_id: 'SCN-104',
    scan_timestamp: '2026-11-05 23:25:30',
    scan_location: 'TLV רחבת מטוס עמדה D04 - בטן המטוס FWD',
    scan_type: 'Aircraft Loading',
    operator_id: 'RAMP_SUPV_AVI',
    notes: 'הוטען למכל AKE-44211 במטוס LY001'
  },

  // Scans for BAG-7002 (Fragile on LY001)
  {
    baggage_id: 'BAG-7002',
    scan_id: 'SCN-201',
    scan_timestamp: '2026-11-05 21:36:00',
    scan_location: 'TLV דלפק צ׳ק אין 42 (טרמינל 3)',
    scan_type: 'Intake',
    operator_id: 'AGENT_TAL_42',
    notes: 'הודבקה מדבקת שביר (Fragile)'
  },
  {
    baggage_id: 'BAG-7002',
    scan_id: 'SCN-202',
    scan_timestamp: '2026-11-05 21:52:10',
    scan_location: 'TLV בידוק ביטחוני ידני לכבודה עדינה',
    scan_type: 'Security Screening',
    operator_id: 'SEC_INSPECT_08',
    notes: 'בדיקה ידנית הושלמה בהצלחה'
  },
  {
    baggage_id: 'BAG-7002',
    scan_id: 'SCN-203',
    scan_timestamp: '2026-11-05 23:28:15',
    scan_location: 'TLV רחבת מטוס D04 - תא כבודה AFT',
    scan_type: 'Aircraft Loading',
    operator_id: 'RAMP_SUPV_AVI',
    notes: 'הנחה עליונה מאובטחת'
  },

  // Scans for BAG-7005 (BA162 In Flight)
  {
    baggage_id: 'BAG-7005',
    scan_id: 'SCN-501',
    scan_timestamp: '2026-11-05 14:25:00',
    scan_location: 'TLV קיוסק שירות עצמי Bag Drop B12',
    scan_type: 'Intake',
    operator_id: 'KIOSK_AUTOBAG_02',
    notes: 'הפקדה עצמית ללא עיכוב'
  },
  {
    baggage_id: 'BAG-7005',
    scan_id: 'SCN-502',
    scan_timestamp: '2026-11-05 14:48:22',
    scan_location: 'TLV מערכת בידוק תת קרקעית HBS',
    scan_type: 'Security Screening',
    operator_id: 'SEC_AUTO_01',
    notes: 'מאושר להעמסה'
  },
  {
    baggage_id: 'BAG-7005',
    scan_id: 'SCN-503',
    scan_timestamp: '2026-11-05 15:55:10',
    scan_location: 'TLV שער B02 - בטן מטוס A350',
    scan_type: 'Aircraft Loading',
    operator_id: 'RAMP_BA_TEAM',
    notes: 'ננעל במכל כבודה LD3'
  },

  // Scans for BAG-7006 (EK932 Delivered)
  {
    baggage_id: 'BAG-7006',
    scan_id: 'SCN-601',
    scan_timestamp: '2026-11-05 16:05:00',
    scan_location: 'TLV דלפק צ׳ק אין 60',
    scan_type: 'Intake',
    operator_id: 'AGENT_YARON',
    notes: 'קבלת כבודה'
  },
  {
    baggage_id: 'BAG-7006',
    scan_id: 'SCN-602',
    scan_timestamp: '2026-11-05 18:10:00',
    scan_location: 'TLV רחפת העמסה D08',
    scan_type: 'Aircraft Loading',
    operator_id: 'RAMP_TEAM_D',
    notes: 'הוטען למטוס EK932'
  },
  {
    baggage_id: 'BAG-7006',
    scan_id: 'SCN-603',
    scan_timestamp: '2026-11-05 23:45:00',
    scan_location: 'DXB פריקת מטוס עמדה F14',
    scan_type: 'Unloading',
    operator_id: 'DNATA_RAMP_12',
    notes: 'נפרק והועבר למסוע חלוקה'
  },
  {
    baggage_id: 'BAG-7006',
    scan_id: 'SCN-604',
    scan_timestamp: '2026-11-06 00:15:30',
    scan_location: 'DXB אולם נוסעים נכנסים - מסוע 7',
    scan_type: 'Baggage Claim',
    operator_id: 'DNATA_CAROUSEL_7',
    notes: 'הונחה על המסוע, נאספה ע״י הנוסע'
  }
];
