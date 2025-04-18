CREATE TABLE Manager (
    ssn INT,
    name VARCHAR(100),
    email VARCHAR(100),
    PRIMARY KEY(ssn)
);

-- needs relationships to rent, review, address, and model
CREATE TABLE Driver(
    name VARCHAR(100),
    PRIMARY KEY (name)
);

-- needs relationships to credit card, review, rent, and address
CREATE TABLE Client(
    name VARCHAR(100),
    email VARCHAR(100)
);

-- needs relationship to model
CREATE TABLE Car(
    brand VARCHAR(100),
    carid VARCHAR(100),
    PRIMARY KEY (brand, carid)
);

-- needs relationships to driver, client, and model
CREATE TABLE Rent(
    date DATE,
    rentid INT,
    PRIMARY KEY (rentid)
);

-- needs relationships to driver, client, and credit card
CREATE TABLE Address(
    road_name VARCHAR(100),
    number INT,
    city VARCHAR,
    PRIMARY KEY (road_name, number, city)
);

-- needs relationships to client, and address
CREATE TABLE CreditCard(
    card_number INT,
    PRIMARY KEY (card_number)
);

-- (Weak Entity) needs relationship to client (not sure if relationship to driver is right)
CREATE TABLE Review(
    drivername VARCHAR(100),
    rating INT,
    message TEXT,
    reviewid INT,
    PRIMARY KEY (drivername, reviewid),
    FOREIGN KEY (drivername) REFERENCES Driver(name)
);

-- (Weak Entity) needs relationships to rent, and driver (not sure if relationship to car is right)
CREATE TABLE Model(
    carid INT,
    color VARCHAR(100),
    construction_year VARCHAR(100),
    transmission_type VARCHAR(100),
    modelid INT,
    PRIMARY KEY (carid, modelid),
    FOREIGN KEY (carid) REFERENCES Car(carid)
);