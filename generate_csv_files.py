import csv
import random
from datetime import date, time, timedelta

# הגדרת נתוני בסיס
START_DATE = date(2026, 11, 4)
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

# 1. יצירת checkin_data.csv (500 שורות)
with open("checkin_data.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow([
        "checkin_id",
        "ticket_id",
        "checkin_date",
        "checkin_time",
        "boarding_group",
        "checkin_channel",
    ])
    for i in range(1, 501):
        checkin_id = f"CHK-{1000 + i}"
        ticket_id = f"TKT-{1000 + i - 1}"
        chk_date = START_DATE + timedelta(days=random.randint(0, 15))
        chk_time = f"{random.randint(5, 22):02d}:{random.choice([0, 15, 30, 45]):02d}:00"
        writer.writerow([
            checkin_id,
            ticket_id,
            chk_date,
            chk_time,
            random.choice(BOARDING_GROUPS),
            random.choice(CHANNELS),
        ])

# 2. יצירת baggage_data.csv (500 שורות)
with open("baggage_data.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow([
        "baggage_id",
        "checkin_id",
        "tag_number",
        "weight_kg",
        "status",
        "special_handling",
    ])
    for i in range(1, 501):
        baggage_id = f"BAG-{5000 + i}"
        checkin_id = f"CHK-{1000 + i}"
        tag_number = f"TAG-{90000 + i}"
        weight = f"{random.uniform(10.0, 32.0):.2f}"
        status = random.choice(BAGGAGE_STATUSES)

        # יצירת מבנה JSON להעדפה/טיפול מיוחד
        opt = random.randint(1, 4)
        if opt == 1:
            handling = '{"priority": true, "fragile": false}'
        elif opt == 2:
            handling = '{"fragile": true}'
        elif opt == 3:
            handling = '{"heavy": true}'
        else:
            handling = ""

        writer.writerow(
            [baggage_id, checkin_id, tag_number, weight, status, handling]
        )

# 3. יצירת baggage_scan_data.csv (500 שורות)
with open("baggage_scan_data.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow([
        "baggage_id",
        "scan_seq",
        "scan_date",
        "scan_time",
        "location",
        "scan_status",
    ])
    for i in range(1, 501):
        baggage_id = f"BAG-{5000 + i}"
        scan_seq = 1
        scan_date = START_DATE + timedelta(days=random.randint(0, 15))
        scan_time = f"{random.randint(5, 23):02d}:{random.choice([0, 15, 30, 45]):02d}:00"
        writer.writerow([
            baggage_id,
            scan_seq,
            scan_date,
            scan_time,
            random.choice(SCAN_LOCATIONS),
            random.choice(SCAN_STATUSES),
        ])

print(
    "נוצרו בהצלחה שלושת הקבצים checkin_data.csv, baggage_data.csv,"
    " baggage_scan_data.csv עם 500 שורות כל אחד."
)
