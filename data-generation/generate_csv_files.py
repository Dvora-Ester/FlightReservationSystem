import csv
import os
import random
from datetime import datetime, time, timedelta


import psycopg2
from dotenv import load_dotenv


load_dotenv()


# אותה התחברות כמו בסקריפט הראשי
DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": int(os.getenv("DB_PORT", 5432)),
    "database": os.getenv("DB_NAME_SECRET", "Fligh12345"),
    "user": os.getenv("DB_USER_SECRET"),
    "password": os.getenv("DB_PASSWORD_SECRET"),
}


random.seed(42)  # כדי שהקבצים ייווצרו זהים בכל הרצה


# הגדרת נתוני בסיס
NUM_CHECKINS = 500
BOARDING_GROUPS = ["A", "B", "C", "D"]
CHANNELS = ["Online", "Airport Kiosk", "Counter", "Mobile App"]
BAGGAGE_STATUSES = ["Checked", "Screening", "Loaded", "Delivered"]
SCAN_STATUSES = ["Accepted", "Under Inspection", "Cleared", "Loaded"]
SCAN_LOCATIONS = [
    "Check-in Desk 01",
    "Check-in Desk 12",
    "Security Belt A",
    "Security Belt B",
    "Main Sorting Area",
    "Gate Loading Bay",
]


# שליפת הכרטיסים הקיימים יחד עם תאריך ההזמנה ותאריך ההמראה
conn = psycopg2.connect(**DB_CONFIG)
cur = conn.cursor()
cur.execute(
    """
    SELECT t.ticket_id, t.booking_date, f.departure_date
    FROM Ticket t
    JOIN Flight f ON f.flight_id = t.flight_id
    ORDER BY t.ticket_id
    LIMIT %s;
    """,
    (NUM_CHECKINS,),
)
tickets = cur.fetchall()
cur.close()
conn.close()


if not tickets:
    raise SystemExit("טבלת Ticket ריקה. יש להריץ קודם את סקריפט הכרטיסים.")
print(f"נמצאו {len(tickets)} כרטיסים. נוצרים עבורם צ'ק-אין, כבודה וסריקות.")


checkin_rows = []
baggage_rows = []
scan_rows = []


for i, (ticket_id, booking_date, departure_date) in enumerate(tickets, start=1):
    # --- CheckIn ---
    checkin_id = f"CHK-{1000 + i}"
    # צ'ק-אין 0-2 ימים לפני ההמראה, ולא לפני תאריך ההזמנה
    chk_date = max(booking_date, departure_date - timedelta(days=random.randint(0, 2)))
    chk_time = time(random.randint(5, 22), random.choice([0, 15, 30, 45]))
    checkin_rows.append([
        checkin_id,
        ticket_id,
        chk_date,
        chk_time.strftime("%H:%M:%S"),
        random.choice(BOARDING_GROUPS),
        random.choice(CHANNELS),
    ])


    # --- Baggage (מזוודה אחת לכל צ'ק-אין) ---
    baggage_id = f"BAG-{5000 + i}"
    tag_number = f"TAG-{90000 + i}"
    weight = f"{random.uniform(10.0, 32.0):.2f}"
    status = random.choice(BAGGAGE_STATUSES)


    # מבנה JSON לטיפול מיוחד (ריק = NULL)
    opt = random.randint(1, 4)
    if opt == 1:
        handling = '{"priority": true, "fragile": false}'
    elif opt == 2:
        handling = '{"fragile": true}'
    elif opt == 3:
        handling = '{"heavy": true}'
    else:
        handling = ""
    baggage_rows.append([baggage_id, checkin_id, tag_number, weight, status, handling])


    # --- BaggageScan (1-3 סריקות, כולן אחרי הצ'ק-אין) ---
    scan_moment = datetime.combine(chk_date, chk_time)
    for seq in range(1, random.randint(1, 3) + 1):
        scan_moment += timedelta(minutes=random.randint(10, 60))
        scan_rows.append([
            baggage_id,
            seq,
            scan_moment.date(),
            scan_moment.strftime("%H:%M:%S"),
            random.choice(SCAN_LOCATIONS),
            random.choice(SCAN_STATUSES),
        ])




def write_csv(filename, header, rows):
    with open(filename, "w", newline="", encoding="utf-8") as f:
        # CSV סטנדרטי: מרכאות בתוך שדה (ב-JSON) נכתבות בכפל ("").
        # בחלון הייבוא של pgAdmin יש להגדיר Quote = " וגם Escape = "
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)
    print(f"{filename}: {len(rows)} שורות")




write_csv(
    "checkin_data.csv",
    ["checkin_id", "ticket_id", "checkin_date", "checkin_time", "boarding_group", "checkin_channel"],
    checkin_rows,
)
write_csv(
    "baggage_data.csv",
    ["baggage_id", "checkin_id", "tag_number", "weight_kg", "status", "special_handling"],
    baggage_rows,
)
write_csv(
    "baggage_scan_data.csv",
    ["baggage_id", "scan_seq", "scan_date", "scan_time", "location", "scan_status"],
    scan_rows,
)
print("נוצרו בהצלחה שלושת קבצי ה-CSV.")