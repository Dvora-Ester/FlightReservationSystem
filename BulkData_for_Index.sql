-- =====================================================================
-- BulkData_for_Index.sql : נתוני בדיקה גדולים להדגמת אינדקסים (אופציונלי)
-- להריץ לפני Index.sql, ולמחוק אחרי (ראו בסוף).
-- כל המזהים מתחילים ב-BULK/90000 כדי שיהיה קל למחוק.
-- =====================================================================
INSERT INTO Passenger (passport_number, first_name, last_name, nationality, birth_date)
SELECT 'BULK' || g, 'Name' || g, 'Last' || g, 'IL', DATE '1970-01-01' + (g % 10000)
FROM generate_series(1, 20000) g;

INSERT INTO Flight
SELECT 90000 + g, 'BK' || g, 'Scheduled', 'TLV', 'LHR',
       DATE '2026-01-01' + (g % 365), TIME '08:00', DATE '2026-01-01' + (g % 365), TIME '14:00'
FROM generate_series(1, 500) g;

INSERT INTO Seat
SELECT 90000 + f, s || 'A', 'Economy', 'Window'
FROM generate_series(1, 500) f, generate_series(1, 100) s;

INSERT INTO Ticket
SELECT 'BKT' || (f * 100 + s), 'BULK' || (1 + ((f * 100 + s) % 20000)), 90000 + f, s || 'A',
       DATE '2026-01-01' + (s % 300), 'Economy Regular', 300 + (s * 7 % 900), 'Confirmed'
FROM generate_series(1, 500) f, generate_series(1, 100) s;

INSERT INTO CheckIn
SELECT 'BKC' || ticket_id, ticket_id, DATE '2026-06-01', TIME '10:00', 'Group 1', 'Online'
FROM Ticket WHERE ticket_id LIKE 'BKT%' AND random() < 0.6;

INSERT INTO Baggage
SELECT 'BKB' || checkin_id, checkin_id, 'TAG' || checkin_id, 15 + random() * 15, 'Checked', NULL
FROM CheckIn WHERE checkin_id LIKE 'BKC%';

ANALYZE;

-- ניקוי אחרי הבדיקה:
-- DELETE FROM Ticket    WHERE ticket_id LIKE 'BKT%';   -- CASCADE מוחק CheckIn ו-Baggage
-- DELETE FROM Flight    WHERE flight_id >= 90000;      -- CASCADE מוחק Seat
-- DELETE FROM Passenger WHERE passport_number LIKE 'BULK%';
