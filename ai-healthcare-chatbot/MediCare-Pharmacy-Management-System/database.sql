-- =====================================================================
-- MediCare Pharmacy Management System - Database Schema & Sample Data
-- =====================================================================
-- This script is provided for reference / manual setup in MySQL Workbench.
-- NOTE: The Spring Boot application will also auto-create/update this
-- schema on startup (spring.jpa.hibernate.ddl-auto=update) and will seed
-- the sample admin, customer and medicines automatically via
-- com.medicare.config.DataInitializer. Running this script manually is
-- OPTIONAL and mainly useful for inspecting the schema up front.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS medicare_db;
USE medicare_db;

-- ================= admin =================
CREATE TABLE IF NOT EXISTS admin (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(100) NOT NULL UNIQUE,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'ADMIN'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================= customer =================
CREATE TABLE IF NOT EXISTS customer (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(15)  NOT NULL,
    address     VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'CUSTOMER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================= drug =================
CREATE TABLE IF NOT EXISTS drug (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150)  NOT NULL,
    description     VARCHAR(1000),
    category        VARCHAR(100)  NOT NULL,
    manufacturer    VARCHAR(150)  NOT NULL,
    price           DECIMAL(10,2) NOT NULL,
    stock_quantity  INT           NOT NULL,
    expiry_date     DATE          NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================= cart =================
CREATE TABLE IF NOT EXISTS cart (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id  BIGINT NOT NULL,
    drug_id      BIGINT NOT NULL,
    quantity     INT NOT NULL,
    total_price  DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_cart_customer FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_drug FOREIGN KEY (drug_id) REFERENCES drug(id) ON DELETE CASCADE,
    CONSTRAINT uq_cart_customer_drug UNIQUE (customer_id, drug_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================= orders =================
CREATE TABLE IF NOT EXISTS orders (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id   BIGINT NOT NULL,
    order_date    DATETIME NOT NULL,
    total_amount  DECIMAL(10,2) NOT NULL,
    status        VARCHAR(20) NOT NULL DEFAULT 'PLACED',
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customer(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================= order_items =================
CREATE TABLE IF NOT EXISTS order_items (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id  BIGINT NOT NULL,
    drug_id   BIGINT NOT NULL,
    quantity  INT NOT NULL,
    price     DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_drug FOREIGN KEY (drug_id) REFERENCES drug(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
-- Sample data
-- =====================================================================

-- Sample admin login: username = admin, password = Admin@123 (BCrypt hashed)
INSERT INTO admin (username, email, password, role) VALUES
('admin', 'admin@medicare.com', '$2a$10$MrUNVfX2gMe1QEIttbXalOB.yHyKtp1do..MR72q6yDA3Eccyynt.', 'ADMIN');

-- Sample customer login: email = customer@medicare.com, password = Customer@123 (BCrypt hashed)
INSERT INTO customer (name, email, password, phone, address, role) VALUES
('Test Customer', 'customer@medicare.com', '$2a$10$bpPWaIWvX2HVUXis12ir0u9.BJqcsgImeG6LoBv76x6Eu9QI/IE8O', '9876543210', '12, MG Road, Bengaluru, Karnataka', 'CUSTOMER');

-- Sample medicines
INSERT INTO drug (name, description, category, manufacturer, price, stock_quantity, expiry_date) VALUES
('Paracetamol 500mg', 'Relieves mild to moderate pain and fever.', 'Painkiller', 'Cipla Ltd.', 25.00, 200, DATE_ADD(CURDATE(), INTERVAL 2 YEAR)),
('Amoxicillin 250mg', 'Broad-spectrum antibiotic capsule.', 'Antibiotic', 'Sun Pharma', 85.50, 120, DATE_ADD(CURDATE(), INTERVAL 2 YEAR)),
('Cetirizine 10mg', 'Antihistamine for allergy relief.', 'Antiallergic', "Dr. Reddy's Labs", 18.00, 300, DATE_ADD(CURDATE(), INTERVAL 2 YEAR)),
('Pantoprazole 40mg', 'Reduces stomach acid production.', 'Antacid', 'Sun Pharma', 45.00, 150, DATE_ADD(CURDATE(), INTERVAL 2 YEAR)),
('Vitamin C 500mg', 'Immunity-boosting daily supplement.', 'Vitamin', 'Himalaya Wellness', 120.00, 250, DATE_ADD(CURDATE(), INTERVAL 2 YEAR)),
('Metformin 500mg', 'Controls blood sugar levels in type 2 diabetes.', 'Diabetes', 'USV Pvt. Ltd.', 32.00, 180, DATE_ADD(CURDATE(), INTERVAL 2 YEAR)),
('Atorvastatin 10mg', 'Lowers cholesterol and reduces cardiac risk.', 'Cardiac', 'Cipla Ltd.', 95.00, 90, DATE_ADD(CURDATE(), INTERVAL 2 YEAR)),
('Cough Syrup 100ml', 'Relieves dry and wet cough.', 'Cough & Cold', 'Himalaya Wellness', 65.00, 100, DATE_ADD(CURDATE(), INTERVAL 2 MONTH)),
('Povidone Iodine Ointment', 'Antiseptic for minor cuts and wounds.', 'Antiseptic', 'Win-Medicare', 40.00, 140, DATE_ADD(CURDATE(), INTERVAL 2 YEAR)),
('Ibuprofen 400mg', 'Anti-inflammatory pain reliever.', 'Painkiller', 'Abbott India', 30.00, 5, DATE_ADD(CURDATE(), INTERVAL 2 YEAR)),
('ORS Sachet', 'Oral rehydration salts for dehydration.', 'General', 'GSK Pharma', 15.00, 0, DATE_ADD(CURDATE(), INTERVAL 2 YEAR)),
('Azithromycin 500mg', 'Antibiotic used for bacterial infections.', 'Antibiotic', 'Alkem Labs', 110.00, 60, DATE_SUB(CURDATE(), INTERVAL 1 MONTH));
