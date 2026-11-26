
-- ---------------------------------------------------------------------
-- שאילתה 1: אחוז תפוסה לכל טיסה (מסך: לוח טיסות / דשבורד מנהל)
-- ---------------------------------------------------------------------
-- צורה א: JOIN של Flight-Seat-Ticket ואז GROUP BY (מכפלה בין מושבים לכרטיסים)
SELECT f.flight_name, f.origin, f.destination,
       COUNT(s.seat_number) AS total_seats,
       COUNT(t.ticket_id)   AS sold_seats,
       ROUND(100.0 * COUNT(t.ticket_id) / COUNT(s.seat_number), 1) AS occupancy_pct
FROM Flight f
JOIN Seat s        ON s.flight_id = f.flight_id
LEFT JOIN Ticket t ON t.flight_id = s.flight_id AND t.seat_number = s.seat_number
GROUP BY f.flight_id, f.flight_name, f.origin, f.destination
ORDER BY occupancy_pct;

-- צורה ב: אגרגציה נפרדת לכל טבלה לפני ה-JOIN (JOIN על שורה אחת לטיסה)
SELECT f.flight_name, f.origin, f.destination,
       sc.total_seats,
       COALESCE(tc.sold_seats, 0) AS sold_seats,
       ROUND(100.0 * COALESCE(tc.sold_seats, 0) / sc.total_seats, 1) AS occupancy_pct
FROM Flight f
JOIN (SELECT flight_id, COUNT(*) AS total_seats FROM Seat   GROUP BY flight_id) sc
     ON sc.flight_id = f.flight_id
LEFT JOIN (SELECT flight_id, COUNT(*) AS sold_seats FROM Ticket GROUP BY flight_id) tc
     ON tc.flight_id = f.flight_id
ORDER BY occupancy_pct;

-- ---------------------------------------------------------------------
-- שאילתה 2: הכרטיס היקר ביותר בכל טיסה, בלי LIMIT (מסך: נוסעי VIP)
-- ---------------------------------------------------------------------
-- צורה א: תת-שאילתה מתואמת עם MAX (מורצת לכל שורה)
SELECT f.flight_name,
       p.first_name || ' ' || p.last_name AS passenger_name,
       t.fare_class, t.price, t.booking_date
FROM Ticket t
JOIN Flight f    ON f.flight_id = t.flight_id
JOIN Passenger p ON p.passport_number = t.passport_number
WHERE t.price = (SELECT MAX(t2.price) FROM Ticket t2 WHERE t2.flight_id = t.flight_id)
ORDER BY t.price DESC;

-- צורה ב: פונקציית חלון (מעבר אחד על Ticket)
SELECT f.flight_name,
       p.first_name || ' ' || p.last_name AS passenger_name,
       r.fare_class, r.price, r.booking_date
FROM (SELECT t.*, RANK() OVER (PARTITION BY flight_id ORDER BY price DESC) AS rnk
      FROM Ticket t) r
JOIN Flight f    ON f.flight_id = r.flight_id
JOIN Passenger p ON p.passport_number = r.passport_number
WHERE r.rnk = 1
ORDER BY r.price DESC;

-- ---------------------------------------------------------------------
-- שאילתה 3: נוסעים שטרם ביצעו צ'ק-אין, עם פירוט הטיסה והמועד
-- (מסך: תזכורות צ'ק-אין)
-- ---------------------------------------------------------------------
-- צורה א: NOT IN
SELECT p.first_name || ' ' || p.last_name AS passenger_name, p.phone,
       f.flight_name, f.departure_date,
       EXTRACT(DAY   FROM f.departure_date) AS dep_day,
       EXTRACT(MONTH FROM f.departure_date) AS dep_month,
       t.seat_number
FROM Ticket t
JOIN Passenger p ON p.passport_number = t.passport_number
JOIN Flight f    ON f.flight_id = t.flight_id
WHERE t.ticket_id NOT IN (SELECT c.ticket_id FROM CheckIn c)
ORDER BY f.departure_date;

-- צורה ב: NOT EXISTS (עוצר בהתאמה הראשונה, בטוח מול NULL)
SELECT p.first_name || ' ' || p.last_name AS passenger_name, p.phone,
       f.flight_name, f.departure_date,
       EXTRACT(DAY   FROM f.departure_date) AS dep_day,
       EXTRACT(MONTH FROM f.departure_date) AS dep_month,
       t.seat_number
FROM Ticket t
JOIN Passenger p ON p.passport_number = t.passport_number
JOIN Flight f    ON f.flight_id = t.flight_id
WHERE NOT EXISTS (SELECT 1 FROM CheckIn c WHERE c.ticket_id = t.ticket_id)
ORDER BY f.departure_date;

-- ---------------------------------------------------------------------
-- שאילתה 4: מיקום אחרון של כל מזוודה (מסך: מעקב כבודה)
-- ---------------------------------------------------------------------
-- צורה א: MAX(scan_seq) בתת-שאילתה מתואמת
SELECT b.tag_number,
       p.first_name || ' ' || p.last_name AS owner_name,
       s.location, s.scan_status, s.scan_date, s.scan_time
FROM BaggageScan s
JOIN Baggage b   ON b.baggage_id = s.baggage_id
JOIN CheckIn c   ON c.checkin_id = b.checkin_id
JOIN Ticket t    ON t.ticket_id = c.ticket_id
JOIN Passenger p ON p.passport_number = t.passport_number
WHERE s.scan_seq = (SELECT MAX(s2.scan_seq) FROM BaggageScan s2
                    WHERE s2.baggage_id = s.baggage_id)
ORDER BY s.scan_date DESC, s.scan_time DESC;

-- צורה ב: ROW_NUMBER (מעבר אחד על BaggageScan)
SELECT b.tag_number,
       p.first_name || ' ' || p.last_name AS owner_name,
       s.location, s.scan_status, s.scan_date, s.scan_time
FROM (SELECT x.*, ROW_NUMBER() OVER (PARTITION BY baggage_id ORDER BY scan_seq DESC) AS rn
      FROM BaggageScan x) s
JOIN Baggage b   ON b.baggage_id = s.baggage_id
JOIN CheckIn c   ON c.checkin_id = b.checkin_id
JOIN Ticket t    ON t.ticket_id = c.ticket_id
JOIN Passenger p ON p.passport_number = t.passport_number
WHERE s.rn = 1
ORDER BY s.scan_date DESC, s.scan_time DESC;

-- ############ חלק ב: SELECT נוספות (שאילתות 5-8) ############

-- ---------------------------------------------------------------------
-- שאילתה 5: הכנסות לפי שנה וחודש הזמנה (פירוק תאריך) (מסך: דוחות הנהלה)
-- ---------------------------------------------------------------------
SELECT EXTRACT(YEAR  FROM booking_date) AS booking_year,
       EXTRACT(MONTH FROM booking_date) AS booking_month,
       COUNT(*)                         AS tickets_sold,
       SUM(price)                       AS revenue,
       ROUND(AVG(price), 2)             AS avg_price
FROM Ticket
WHERE ticket_status <> 'Cancelled'
GROUP BY EXTRACT(YEAR FROM booking_date), EXTRACT(MONTH FROM booking_date)
ORDER BY booking_year, booking_month;

-- ---------------------------------------------------------------------
-- שאילתה 6: מזוודות כבדות מהממוצע של הטיסה שלהן (קינון + GROUP BY)
-- (מסך: טיפול בכבודה חריגה)
-- ---------------------------------------------------------------------
SELECT f.flight_name,
       p.first_name || ' ' || p.last_name AS owner_name,
       b.tag_number, b.weight_kg,
       ROUND(fa.avg_weight, 2) AS flight_avg_weight
FROM Baggage b
JOIN CheckIn c   ON c.checkin_id = b.checkin_id
JOIN Ticket t    ON t.ticket_id = c.ticket_id
JOIN Flight f    ON f.flight_id = t.flight_id
JOIN Passenger p ON p.passport_number = t.passport_number
JOIN (SELECT t2.flight_id, AVG(b2.weight_kg) AS avg_weight
      FROM Baggage b2
      JOIN CheckIn c2 ON c2.checkin_id = b2.checkin_id
      JOIN Ticket t2  ON t2.ticket_id = c2.ticket_id
      GROUP BY t2.flight_id) fa ON fa.flight_id = t.flight_id
WHERE b.weight_kg > fa.avg_weight
ORDER BY b.weight_kg DESC;

-- ---------------------------------------------------------------------
-- שאילתה 7: נוסעים שהוציאו יותר מההוצאה הממוצעת של נוסע
-- (קינון כפול + GROUP BY + HAVING) (מסך: לקוחות מובילים)
-- ---------------------------------------------------------------------
SELECT p.first_name || ' ' || p.last_name AS passenger_name,
       p.nationality,
       COUNT(t.ticket_id) AS tickets_count,
       SUM(t.price)       AS total_spent
FROM Passenger p
JOIN Ticket t ON t.passport_number = p.passport_number
GROUP BY p.passport_number, p.first_name, p.last_name, p.nationality
HAVING SUM(t.price) > (SELECT AVG(per_passenger.total)
                       FROM (SELECT SUM(price) AS total
                             FROM Ticket GROUP BY passport_number) per_passenger)
ORDER BY total_spent DESC;

-- ---------------------------------------------------------------------
-- שאילתה 8: כמה שעות לפני ההמראה מבצעים צ'ק-אין, לפי ערוץ וחודש טיסה
-- (שימוש בתאריך + שעה) (מסך: ניתוח התנהגות צ'ק-אין)
-- ---------------------------------------------------------------------
SELECT c.checkin_channel,
       EXTRACT(YEAR  FROM f.departure_date) AS dep_year,
       EXTRACT(MONTH FROM f.departure_date) AS dep_month,
       COUNT(*) AS checkins,
       ROUND(AVG(EXTRACT(EPOCH FROM ((f.departure_date + f.departure_time)
                                   - (c.checkin_date  + c.checkin_time))) / 3600)::numeric, 1)
             AS avg_hours_before_departure
FROM CheckIn c
JOIN Ticket t ON t.ticket_id = c.ticket_id
JOIN Flight f ON f.flight_id = t.flight_id
GROUP BY c.checkin_channel, EXTRACT(YEAR FROM f.departure_date), EXTRACT(MONTH FROM f.departure_date)
ORDER BY dep_year, dep_month, c.checkin_channel;


-- ############ חלק ג: DELETE (3) ############
-- לכל אחת: להריץ SELECT COUNT(*) לפני ואחרי, ולצלם. אפשר לעטוף ב-BEGIN/ROLLBACK בזמן ניסוי.

-- DELETE 1 (נדרש להוסיף נתוני בדיקה: כרטיס Cancelled בטיסה משנה קודמת): מחיקת כרטיסים מבוטלים של טיסות משנים קודמות (CASCADE ימחק צ'ק-אין וכבודה)
DELETE FROM Ticket
WHERE ticket_status = 'Cancelled'
  AND flight_id IN (SELECT flight_id FROM Flight
                    WHERE EXTRACT(YEAR FROM departure_date) < EXTRACT(YEAR FROM CURRENT_DATE));

-- DELETE 2: ניקוי היסטוריית סריקות של מזוודות שנמסרו, משאירים רק את הסריקה האחרונה
DELETE FROM BaggageScan s
WHERE s.baggage_id IN (SELECT baggage_id FROM Baggage WHERE status = 'Delivered')
  AND s.scan_seq < (SELECT MAX(s2.scan_seq) FROM BaggageScan s2
                    WHERE s2.baggage_id = s.baggage_id);

-- DELETE 3: מחיקת נוסעים שאין להם אף כרטיס
DELETE FROM Passenger p
WHERE NOT EXISTS (SELECT 1 FROM Ticket t WHERE t.passport_number = p.passport_number);


-- ############ חלק ד: UPDATE (3) ############

-- UPDATE 1: תוספת עונתית של 10% לכרטיסים שהוזמנו לטיסות בדצמבר וינואר
UPDATE Ticket
SET price = ROUND(price * 1.10, 2)
WHERE ticket_status = 'Confirmed'
  AND flight_id IN (SELECT flight_id FROM Flight
                    WHERE EXTRACT(MONTH FROM departure_date) IN (12, 1));

-- UPDATE 2: מזוודה שהסריקה האחרונה שלה היא Aircraft Loading מסומנת כ-Loaded
UPDATE Baggage b
SET status = 'Loaded'
WHERE b.status = 'Checked'
  AND EXISTS (SELECT 1 FROM BaggageScan s
              WHERE s.baggage_id = b.baggage_id
                AND s.scan_status = 'Aircraft Loading'
                AND s.scan_seq = (SELECT MAX(s2.scan_seq) FROM BaggageScan s2
                                  WHERE s2.baggage_id = b.baggage_id));

-- UPDATE 3: נוסעי מחלקה עסקית עולים לקבוצת עלייה A
UPDATE CheckIn
SET boarding_group = 'A'
WHERE ticket_id IN (SELECT ticket_id FROM Ticket WHERE fare_class LIKE 'Business%');
