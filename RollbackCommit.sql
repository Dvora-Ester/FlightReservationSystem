-- =====================================================================
-- RollbackCommit.sql
-- בכל שלב: להריץ את ה-SELECT ולצלם את מצב בסיס הנתונים.
-- =====================================================================

-- ---------- דוגמה 8: עדכון + ROLLBACK ----------
SELECT ticket_status, COUNT(*) AS cnt, SUM(price) AS total_price
FROM Ticket GROUP BY ticket_status ORDER BY ticket_status;      -- (1) לפני

BEGIN;
UPDATE Ticket SET price = ROUND(price * 1.10, 2)
WHERE ticket_status = 'Confirmed';

SELECT ticket_status, COUNT(*) AS cnt, SUM(price) AS total_price
FROM Ticket GROUP BY ticket_status ORDER BY ticket_status;      -- (2) אחרי העדכון (בתוך הטרנזקציה)

ROLLBACK;

SELECT ticket_status, COUNT(*) AS cnt, SUM(price) AS total_price
FROM Ticket GROUP BY ticket_status ORDER BY ticket_status;      -- (3) אחרי ROLLBACK: זהה ל-(1)


-- ---------- דוגמה 9: עדכון + COMMIT ----------
SELECT flight_status, COUNT(*) AS cnt
FROM Flight GROUP BY flight_status ORDER BY flight_status;      -- (1) לפני

BEGIN;
UPDATE Flight SET flight_status = 'Delayed'
WHERE flight_id IN (SELECT MIN(flight_id) FROM Flight);

SELECT flight_status, COUNT(*) AS cnt
FROM Flight GROUP BY flight_status ORDER BY flight_status;      -- (2) אחרי העדכון

COMMIT;

SELECT flight_status, COUNT(*) AS cnt
FROM Flight GROUP BY flight_status ORDER BY flight_status;      -- (3) אחרי COMMIT: השינוי נשמר
