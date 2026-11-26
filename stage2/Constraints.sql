-- =====================================================================
-- Constraints.sql : אילוצים חדשים (ALTER TABLE)
-- לכל אילוץ: הרצת ה-ALTER, ואז ניסיון הכנסה/עדכון שמפר אותו וצילום השגיאה.
-- אם ה-ALTER נכשל, יש בנתונים הקיימים שורות שמפרות אותו: יש לתקן אותן קודם.
-- בדיקה מקדימה לכל אילוץ מופיעה בהערה "בדיקה".
-- =====================================================================

-- ---------------------------------------------------------------------
-- אילוץ 1: ההגעה חייבת להיות אחרי ההמראה (CHECK על כמה עמודות)
-- בדיקה: SELECT * FROM Flight WHERE (arrival_date + arrival_time) <= (departure_date + departure_time);
-- ---------------------------------------------------------------------
ALTER TABLE Flight
  ADD CONSTRAINT chk_flight_times CHECK (
      arrival_date > departure_date
      OR (arrival_date = departure_date AND arrival_time > departure_time));

-- ניסיון הפרה (צפויה שגיאה):
-- INSERT INTO Flight VALUES (9001,'TEST','Scheduled','TLV','LHR',
--        '2026-06-10','10:00','2026-06-10','08:00');

-- ---------------------------------------------------------------------
-- אילוץ 2: מוצא ויעד חייבים להיות שונים
-- בדיקה: SELECT * FROM Flight WHERE origin = destination;
-- ---------------------------------------------------------------------
ALTER TABLE Flight
  ADD CONSTRAINT chk_flight_origin_dest CHECK (origin <> destination);

-- ניסיון הפרה (צפויה שגיאה):
-- INSERT INTO Flight VALUES (9002,'TEST2','Scheduled','TLV','TLV',
--        '2026-06-10','10:00','2026-06-10','14:00');

-- ---------------------------------------------------------------------
-- אילוץ 3: סטטוס כרטיס מתוך קבוצה מוגדרת (להתאים לערכים שבנתונים!)
-- בדיקה: SELECT DISTINCT ticket_status FROM Ticket;
-- ---------------------------------------------------------------------
/*ALTER TABLE Ticket
  ADD CONSTRAINT chk_ticket_status
  CHECK (ticket_status IN ('Confirmed', 'Checked-In', 'Boarded', 'Cancelled'));*/

-- ניסיון הפרה (צפויה שגיאה):
-- UPDATE Ticket SET ticket_status = 'Unknown' WHERE ticket_id = (SELECT MIN(ticket_id) FROM Ticket);

-- ---------------------------------------------------------------------
-- אילוץ 4: תאריך הזמנה לא בעתיד
-- בדיקה: SELECT * FROM Ticket WHERE booking_date > CURRENT_DATE;
-- ---------------------------------------------------------------------
ALTER TABLE Ticket
  ADD CONSTRAINT chk_ticket_booking_date CHECK (booking_date <= CURRENT_DATE);

-- ניסיון הפרה (צפויה שגיאה):
-- UPDATE Ticket SET booking_date = DATE '2099-01-01' WHERE ticket_id = (SELECT MIN(ticket_id) FROM Ticket);

-- ---------------------------------------------------------------------
-- אילוץ 5: תאריך לידה לא בעתיד
-- בדיקה: SELECT * FROM Passenger WHERE birth_date > CURRENT_DATE;
-- ---------------------------------------------------------------------
ALTER TABLE Passenger
  ADD CONSTRAINT chk_passenger_birth CHECK (birth_date <= CURRENT_DATE);

-- ניסיון הפרה (צפויה שגיאה):
-- INSERT INTO Passenger (passport_number, first_name, last_name, nationality, birth_date)
-- VALUES ('TEST999', 'Test', 'User', 'IL', '2099-01-01');








/*-- ---------------------------------------------------------------------
-- אילוץ 6: תג כבודה ייחודי (UNIQUE)
-- בדיקה: SELECT tag_number, COUNT(*) FROM Baggage GROUP BY tag_number HAVING COUNT(*) > 1;
-- ---------------------------------------------------------------------
/*ALTER TABLE Baggage
  ADD CONSTRAINT uq_baggage_tag UNIQUE (tag_number);

-- ניסיון הפרה (צפויה שגיאה): הכנסת כבודה עם תג שכבר קיים
-- INSERT INTO Baggage (baggage_id, checkin_id, tag_number, weight_kg, status)
-- SELECT 'BAG-TEST', checkin_id, tag_number, 10, 'Checked' FROM Baggage LIMIT 1;