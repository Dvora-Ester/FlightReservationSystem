-- 1. טבלת נוסעים (Passenger)
CREATE TABLE Passenger (
    passport_number VARCHAR(50) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nationality VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    phone VARCHAR(30), -- Optional
    preferences JSON   -- שדה JSON ראשון (Optional)
);

-- 2. טבלת טיסות (Flight) - מזהה מספרי מסוג INT
CREATE TABLE Flight (
    flight_id INT PRIMARY KEY,
    flight_name VARCHAR(50) NOT NULL,
    flight_status VARCHAR(30) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_date DATE NOT NULL,
    arrival_time TIME NOT NULL
);

-- 3. טבלת מקומות ישיבה (Seat) - ישות חלשה של Flight
CREATE TABLE Seat (
    flight_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    seat_class VARCHAR(30) NOT NULL,
    seat_position VARCHAR(30) NOT NULL,
    PRIMARY KEY (flight_id, seat_number),
    CONSTRAINT fk_seat_flight FOREIGN KEY (flight_id) 
        REFERENCES Flight(flight_id) ON DELETE CASCADE
);

-- 4. טבלת כרטיסים (Ticket) - שריון מושב חובה
CREATE TABLE Ticket (
    ticket_id VARCHAR(50) PRIMARY KEY,
    passport_number VARCHAR(50) NOT NULL,
    flight_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    booking_date DATE NOT NULL,
    fare_class VARCHAR(30) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    ticket_status VARCHAR(30) NOT NULL,
    CONSTRAINT fk_ticket_passenger FOREIGN KEY (passport_number) 
        REFERENCES Passenger(passport_number) ON DELETE RESTRICT,
    CONSTRAINT fk_ticket_seat FOREIGN KEY (flight_id, seat_number) 
        REFERENCES Seat(flight_id, seat_number) ON DELETE RESTRICT,
    CONSTRAINT uq_ticket_seat UNIQUE (flight_id, seat_number)
);

-- 5. טבלת צ'ק-אין (CheckIn) - קשר 1:1 מול כרטיס
CREATE TABLE CheckIn (
    checkin_id VARCHAR(50) PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL UNIQUE,
    checkin_date DATE NOT NULL,
    checkin_time TIME NOT NULL,
    boarding_group VARCHAR(10) NOT NULL,
    checkin_channel VARCHAR(30) NOT NULL,
    CONSTRAINT fk_checkin_ticket FOREIGN KEY (ticket_id) 
        REFERENCES Ticket(ticket_id) ON DELETE CASCADE
);

-- 6. טבלת כבודה (Baggage)
CREATE TABLE Baggage (
    baggage_id VARCHAR(50) PRIMARY KEY,
    checkin_id VARCHAR(50) NOT NULL,
    tag_number VARCHAR(50) NOT NULL,
    weight_kg NUMERIC(6, 2) NOT NULL CHECK (weight_kg > 0),
    status VARCHAR(30) NOT NULL,
    special_handling JSON, -- שדה JSON שני (Optional)
    CONSTRAINT fk_baggage_checkin FOREIGN KEY (checkin_id) 
        REFERENCES CheckIn(checkin_id) ON DELETE CASCADE
);

-- 7. טבלת סריקות כבודה (BaggageScan) - ישות חלשה של Baggage
CREATE TABLE BaggageScan (
    baggage_id VARCHAR(50) NOT NULL,
    scan_seq INT NOT NULL,
    scan_date DATE NOT NULL,
    scan_time TIME NOT NULL,
    location VARCHAR(100) NOT NULL,
    scan_status VARCHAR(30) NOT NULL,
    PRIMARY KEY (baggage_id, scan_seq),
    CONSTRAINT fk_scan_baggage FOREIGN KEY (baggage_id) 
        REFERENCES Baggage(baggage_id) ON DELETE CASCADE
);