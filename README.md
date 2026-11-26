# Flight Reservation System

A PostgreSQL project for managing passengers, flights, seats, tickets, check-ins, baggage, and baggage scans. The repository includes a React frontend prototype, database scripts, and sample data. The frontend is a prototype and is not connected to a production backend.

## Stage 2 - הסבר לצילומי המסך

בתמונות ההשוואה של האינדקסים, **A מציג את השאילתה לפני יצירת האינדקס** ו-**B מציג אותה אחרי יצירת האינדקס**:

- [אינדקס בכרטיסים - A](./stage2/picture/a-index-ticket.jpg) / [B](./stage2/picture/b-index-ticket.jpg): חיפוש כרטיסים לפי מספר דרכון.
- [אינדקס בכבודה - A](./stage2/picture/a-index-baggage.jpg) / [B](./stage2/picture/b-index-baggage.jpg): חיפוש כבודה לפי מזהה הצ'ק-אין.
- [אינדקס בטיסות - A](./stage2/picture/a-index-flight.jpg) / [B](./stage2/picture/b-index-flight.jpg): חיפוש טיסות לפי טווח תאריכים.

בתיקיית [צילומי השאילתות](./stage2/picture/queries/) מופיעות שתי גרסאות לכל שאילתה (first ו-second):

- [שאילתה 1 - גרסה ראשונה](./stage2/picture/queries/query%201-first.jpg) ו-[שנייה](./stage2/picture/queries/query%201-second.jpg): חישוב אחוז התפוסה בכל טיסה. הראשונה מחברת מושבים וכרטיסים לפני הסיכום; השנייה מסכמת כל טבלה בנפרד ואז מחברת את התוצאות.
- [שאילתה 2 - גרסה ראשונה](./stage2/picture/queries/query%202-first.jpg) ו-[שנייה](./stage2/picture/queries/query%202-second.jpg): מציאת הכרטיס היקר ביותר בכל טיסה. הראשונה משתמשת בתת-שאילתה עם MAX, והשנייה בדירוג RANK.
- [שאילתה 3 - גרסה ראשונה](./stage2/picture/queries/query%203-first.jpg) ו-[שנייה](./stage2/picture/queries/query%203-second.jpg): איתור נוסעים ללא צ'ק-אין. הראשונה משתמשת ב-NOT IN, והשנייה ב-NOT EXISTS.
- [שאילתה 4 - גרסה ראשונה](./stage2/picture/queries/query%204-first.jpg) ו-[שנייה](./stage2/picture/queries/query%204-second.jpg): הצגת הסריקה האחרונה של כל מזוודה. הראשונה משתמשת ב-MAX, והשנייה ב-ROW_NUMBER.
- [צילום UPDATE](./stage2/picture/queries/update-first%20query.jpg): העלאת מחיר ב-10% לכרטיסים מאושרים לטיסות בדצמבר ובינואר.

צילומי [סיכום המחיר המקורי](./stage2/picture/sum-price%20ticket%20acoording%20to%20status.jpg), [אחרי העדכון בתוך הטרנזקציה](./stage2/picture/sum-price%20ticket%20acoording%20to%20status%20after-b.jpg) ו-[אחרי ROLLBACK](./stage2/picture/sum-price%20ticket%20acoording%20to%20status%20after-r.jpg) מדגימים שהעדכון משנה את הסכום בתוך הטרנזקציה, ואילו ROLLBACK מחזיר את הנתונים למצב המקורי.

## System structure

- **PostgreSQL** stores the data and enforces relationships.
- **Docker Compose** runs PostgreSQL and pgAdmin.
- **`init-db/`** creates the tables and inserts passenger data on the first database startup.
- **`data-generation/`** contains Python scripts for generating and loading data.
- **`data-files/`** contains sample CSV files.
- **`frontend/`** contains the user-interface prototype.

The database schema is defined in [`init-db/01-create-tables.sql`](./init-db/01-create-tables.sql). A passenger can have tickets; flights contain seats; tickets may have one check-in; check-ins can have baggage; and each bag can have multiple scans. The foreign keys and unique constraints enforce these relationships.

### Data Structure Diagram (DSD)

![Data Structure Diagram](./pictures/ERD-DSD.png)

### Entity Relationship Diagram (ERD)

![Entity Relationship Diagram](./pictures/ERD.jpg)

## Setup

1. Configure the required database and pgAdmin environment variables locally. Do not share passwords or commit secrets.
2. From the project root, start the services:

   ```console
   docker compose up -d
   ```

3. Open pgAdmin at `http://localhost:8080`. Register the database using the credentials configured for PostgreSQL.

The initialization SQL runs only when PostgreSQL starts with a new, empty data volume.

## Data population

The project uses SQL, Python, and CSV files to populate the database:

1. **SQL:** On first startup, `init-db/02-Passenger.sql` inserts 500 passengers.
2. **Python:** Run `python data-generation\generate.py` from the project root to generate flights, seats, and tickets for existing passengers.
3. **CSV:** Run `python data-generation\load_csv.py` from the project root to load check-in, baggage, and baggage-scan data from `data-files/`. Load parent records first. The loader appends rows, so do not import the same files twice.

The CSV files contain 500 check-ins, 500 baggage records, and 1,000 scans. Optional baggage-handling values include blanks, which are loaded as `NULL`. The Python script `generate_csv_files.py` can create new CSV files from existing tickets.

The screenshots below show the prototype and example records. They are not screenshots of the SQL or CSV import operations.
![Dashboard records](./pictures/DASHBOARD.png)

![Reservation workflow](./pictures/PROCESS.png)

![Passenger records](./pictures/PASSENGERS.png)

![Tickets records](./pictures/TICKEY.png)

![Baggege records](./pictures/BAGGEGE.png)

![BaggegeScan records](./pictures/SCAN.png)

![Flight records](./pictures/FLIGHT.png)

![Seat records](./pictures/SEAT.png)

![Checkin records](./pictures/CHECKIN.png)

## Normalization

Each table is in BCNF: the determinants listed below are candidate keys or superkeys.

| Table | Functional dependency |
| --- | --- |
| Passenger | `passport_number` → passenger details |
| Flight | `flight_id` → flight details |
| Seat | `(flight_id, seat_number)` → seat class, position |
| Ticket | `ticket_id` and `(flight_id, seat_number)` → ticket details |
| CheckIn | `checkin_id` and `ticket_id` → check-in details |
| Baggage | `baggage_id` → baggage details |
| BaggageScan | `(baggage_id, scan_seq)` → scan details |

`Passenger.preferences` and `Baggage.special_handling` are treated as single JSON values.

## Backup and restore

PostgreSQL data persists in a Docker volume, but a volume is not a separate backup. The project includes a PostgreSQL custom-format backup at [`backup/flight_reservation.backup`](./backup/flight_reservation.backup). This format includes the database structure and data.

To create a backup in pgAdmin, right-click the database, select **Backup**, choose **Custom**, and save the file. To restore, create an empty database, select **Restore**, choose the backup file, and verify the restored tables and records.

The screenshot shows pgAdmin query results used to verify restored tables and record counts. It does not show the Restore dialog or completion message.

![Post-restore verification](./pictures/תהליך%20שחזור.jpg)


