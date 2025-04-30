
-- this is the database which the app runs off, you need to put the schema into your PGAdmin with the psql shell
-- i created a new database by right clicking databases and named it proj


-- MANAGER Table
CREATE TABLE Manager (
    ssn INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY(ssn)
);

-- ADDRESS Table
CREATE TABLE Address (
    address_id SERIAL,
    road_name VARCHAR(100) NOT NULL,
    number INT NOT NULL,
    city VARCHAR(100) NOT NULL,
    PRIMARY KEY (address_id)
);

-- DRIVER TABLE
CREATE TABLE Driver (
    driver_id SERIAL,
    name VARCHAR(100) NOT NULL UNIQUE,
    address_id INT NOT NULL,
    PRIMARY KEY (driver_id),
    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);

-- CLIENT Table
CREATE TABLE Client (
    client_id SERIAL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (client_id)
);

-- Many-to-many: Client to Address
CREATE TABLE Client_Address (
    client_id INT,
    address_id INT,
    PRIMARY KEY (client_id, address_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id),
    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);

-- Credit Card Table
CREATE TABLE CreditCard (
    card_number VARCHAR(20),
    client_id INT NOT NULL,
    payment_address_id INT NOT NULL,
    PRIMARY KEY (card_number),
    FOREIGN KEY (client_id) REFERENCES Client(client_id),
    FOREIGN KEY (payment_address_id) REFERENCES Address(address_id)
);

-- Car Table
CREATE TABLE Car (
    car_id SERIAL,
    brand VARCHAR(100) NOT NULL,
    PRIMARY KEY (car_id)
);

-- Model Table
CREATE TABLE Model (
    model_id SERIAL,
    car_id INT NOT NULL,
    color VARCHAR(100) NOT NULL,
    construction_year INT NOT NULL,
    transmission_type VARCHAR(100) NOT NULL CHECK (transmission_type IN ('manual', 'automatic')),
    PRIMARY KEY (model_id, car_id),
    FOREIGN KEY (car_id) REFERENCES Car(car_id)
);

-- Many-to-many: Driver to Model
CREATE TABLE Driver_Model (
    driver_id INT,
    model_id INT,
    PRIMARY KEY (driver_id, model_id),
    FOREIGN KEY (driver_id) REFERENCES Driver(driver_id),
    FOREIGN KEY (model_id) REFERENCES Model(model_id)
);

-- Rent Table
CREATE TABLE Rent (
    rent_id SERIAL,
    date DATE NOT NULL,
    client_id INT NOT NULL,
    driver_id INT NOT NULL,
    model_id INT NOT NULL,
    PRIMARY KEY (rent_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id),
    FOREIGN KEY (driver_id) REFERENCES Driver(driver_id),
    FOREIGN KEY (model_id) REFERENCES Model(model_id)
);

-- Review Table
CREATE TABLE Review (
    review_id SERIAL,
    driver_id INT NOT NULL,
    client_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 0 AND 5),
    message TEXT,
    PRIMARY KEY (review_id, driver_id, client_id),
    FOREIGN KEY (driver_id) REFERENCES Driver(driver_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id)
); 