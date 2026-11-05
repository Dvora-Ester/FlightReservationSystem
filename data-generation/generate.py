import datetime
import random
import psycopg2
import os
from dotenv import load_dotenv

# טעינת המשתנים מקובץ ה-.env שנמצא בתיקייה
load_dotenv()

# הגדרת פרטי ההתחברות באמצעות משתני הסביבה
DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": int(os.getenv("DB_PORT", 5432)),
    "database": os.getenv("DB_NAME_SECRET", "Fligh12345"),
    "user": os.getenv("DB_USER_SECRET"),
    "password": os.getenv("DB_PASSWORD_SECRET"),  # שולף ישירות את הסיסמה מה-.env
}

CITIES = [
    "Tel Aviv",
    "New York",
    "London",
    "Paris",
    "Rome",
    "Tokyo",
    "Dubai",
    "Frankfurt",
    "Madrid",
]
STATUSES = ["Scheduled", "On Time", "Delayed", "Departed"]
SEAT_LETTERS = ["A", "B", "C", "D", "E", "F"]
FARE_CLASSES = ["Economy", "Business", "First"]


def main():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    try:
        # 1. שליפת רשימת הדרכונים של הנוסעים הקיימים
        cur.execute("SELECT passport_number FROM Passenger;")
        passengers = [row[0] for row in cur.fetchall()]

        if not passengers:
            print("שגיאה: טבלת Passenger ריקה. יש לטעון נוסעים תחילה.")
            return

        print(f"נמצאו {len(passengers)} נוסעים קיימים בטבלה.")

        # 2. יצירת טיסות (Flight)
        print("יוצר 20 טיסות...")
        flight_ids = []
        base_date = datetime.date.today()

        for i in range(1, 21):
            origin, dest = random.sample(CITIES, 2)
            dep_date = base_date + datetime.timedelta(days=random.randint(1, 30))
            dep_hour = random.randint(0, 20)
            dep_time = datetime.time(dep_hour, random.choice([0, 15, 30, 45]))

            # הגדרת נחיתה כמה שעות לאחר מכן
            arr_date = dep_date
            arr_time = datetime.time(
                (dep_hour + random.randint(2, 6)) % 24, dep_time.minute
            )

            cur.execute(
                """
                INSERT INTO Flight (flight_id, flight_name, flight_status, origin, destination, 
                                    departure_date, departure_time, arrival_date, arrival_time)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (flight_id) DO NOTHING;
            """,
                (
                    i,
                    f"FL-{100 + i}",
                    random.choice(STATUSES),
                    origin,
                    dest,
                    dep_date,
                    dep_time,
                    arr_date,
                    arr_time,
                ),
            )
            flight_ids.append(i)

        # 3. יצירת מושבים (Seat) לכל טיסה
        print("יוצר מושבים עבור כל טיסה (10 שורות בכל מטוס)...")
        seats_by_flight = {}
        for f_id in flight_ids:
            seats_by_flight[f_id] = []
            for row in range(1, 11):  # 10 שורות
                seat_class = "Business" if row <= 2 else "Economy"
                for letter in SEAT_LETTERS:
                    seat_num = f"{row}{letter}"
                    position = (
                        "Window"
                        if letter in ["A", "F"]
                        else ("Aisle" if letter in ["C", "D"] else "Middle")
                    )

                    cur.execute(
                        """
                        INSERT INTO Seat (flight_id, seat_number, seat_class, seat_position)
                        VALUES (%s, %s, %s, %s)
                        ON CONFLICT (flight_id, seat_number) DO NOTHING;
                    """,
                        (f_id, seat_num, seat_class, position),
                    )
                    seats_by_flight[f_id].append(seat_num)

        # 4. יצירת כרטיסים (Ticket)
        print("יוצר כרטיסים ומקשר נוסעים למושבים פנויים...")
        ticket_count = 0
        used_seats = set()

        for idx, passport in enumerate(passengers):
            # כל נוסע מקבל כרטיס לטיסה אקראית
            f_id = random.choice(flight_ids)
            available_seats = [
                s for s in seats_by_flight[f_id] if (f_id, s) not in used_seats
            ]

            if not available_seats:
                continue

            chosen_seat = random.choice(available_seats)
            used_seats.add((f_id, chosen_seat))

            fare_class = random.choice(FARE_CLASSES)
            price = round(
                random.uniform(150, 1200)
                if fare_class == "Economy"
                else random.uniform(1200, 3500),
                2,
            )
            booking_date = base_date - datetime.timedelta(
                days=random.randint(1, 20)
            )

            cur.execute(
                """
                INSERT INTO Ticket (ticket_id, passport_number, flight_id, seat_number, 
                                    booking_date, fare_class, price, ticket_status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (ticket_id) DO NOTHING;
            """,
                (
                    f"TKT-{1000 + idx}",
                    passport,
                    f_id,
                    chosen_seat,
                    booking_date,
                    fare_class,
                    price,
                    "Confirmed",
                ),
            )
            ticket_count += 1

        conn.commit()
        print(f"הסתיים בהצלחה! נוצרו {ticket_count} כרטיסים ומקומות ישיבה.")

    except Exception as e:
        conn.rollback()
        print(f"שגיאה בהרצה: {e}")
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    main()