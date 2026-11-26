-- =====================================================================
-- Index.sql : 3 אינדקסים. לכל אחד: EXPLAIN ANALYZE לפני ואחרי.
-- הרצה מומלצת על נפח נתונים גדול (אלפי שורות לפחות), אחרת PostgreSQL
-- יבחר סריקה רציפה גם כשיש אינדקס. כדי לראות את ההבדל בנתונים קטנים:
--   SET enable_seqscan = off;   (לצורך ההדגמה בלבד)
-- =====================================================================

-- ---------- אינדקס 1: Ticket(passport_number) ----------
-- מוטיבציה: ב-PostgreSQL מפתח זר לא יוצר אינדקס אוטומטית. שאילתות 7 ומסך "הכרטיסים שלי" מסננות לפי נוסע.
EXPLAIN ANALYZE
SELECT * FROM Ticket WHERE passport_number = (SELECT MIN(passport_number) FROM Ticket);   -- לפני

CREATE INDEX idx_ticket_passport ON Ticket(passport_number);

EXPLAIN ANALYZE
SELECT * FROM Ticket WHERE passport_number = (SELECT MIN(passport_number) FROM Ticket);   -- אחרי

-- ---------- אינדקס 2: Baggage(checkin_id) ----------
-- מוטיבציה: שאילתות 4 ו-6 מחברות כבודה לצ'ק-אין, וב-CASCADE של מחיקה נדרש חיפוש לפי checkin_id.
EXPLAIN ANALYZE
SELECT * FROM Baggage WHERE checkin_id = (SELECT MIN(checkin_id) FROM CheckIn);           -- לפני

CREATE INDEX idx_baggage_checkin ON Baggage(checkin_id);

EXPLAIN ANALYZE
SELECT * FROM Baggage WHERE checkin_id = (SELECT MIN(checkin_id) FROM CheckIn);           -- אחרי

-- ---------- אינדקס 3: Flight(departure_date) ----------
-- מוטיבציה: חיפוש טיסות לפי טווח תאריכים (מסך חיפוש טיסות). שימו לב: האינדקס
-- משרת תנאי טווח (BETWEEN), ולא תנאי על EXTRACT(...) מעל העמודה.
EXPLAIN ANALYZE
SELECT * FROM Flight WHERE departure_date BETWEEN '2026-06-01' AND '2026-06-30';          -- לפני

CREATE INDEX idx_flight_departure_date ON Flight(departure_date);

EXPLAIN ANALYZE
SELECT * FROM Flight WHERE departure_date BETWEEN '2026-06-01' AND '2026-06-30';          -- אחרי
