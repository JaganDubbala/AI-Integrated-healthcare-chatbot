# MediCare - Pharmacy Management System

A full-stack pharmacy management web application with separate **Admin** and **Customer** modules: medicine catalog management, cart, checkout, order lifecycle tracking, and customer management.

## Tech stack

Java 17+ - Spring Boot 3.5.5 - Spring MVC - Spring Data JPA/Hibernate - Spring Security (token-based) - MySQL - REST APIs - HTML5/CSS3/vanilla JavaScript - Maven.

## Project structure

```
MediCare-Pharmacy-Management-System/
├── pom.xml
├── database.sql                     # Standalone schema + sample data (optional, see below)
├── mvnw / mvnw.cmd, .mvn/            # Maven Wrapper - no local Maven install required
└── src/main/
    ├── java/com/medicare/
    │   ├── MediCareApplication.java
    │   ├── config/                  # SecurityConfig, DataInitializer (seeds sample data)
    │   ├── controller/               # REST controllers
    │   ├── service/                  # Business logic
    │   ├── repository/               # Spring Data JPA repositories
    │   ├── entity/                   # JPA entities
    │   ├── dto/                      # Request/response DTOs
    │   ├── exception/                # Custom exceptions + @RestControllerAdvice
    │   └── security/                 # Token auth filter, token store, security helpers
    └── resources/
        ├── application.properties
        └── static/                   # Frontend (served directly by Spring Boot)
            ├── index.html, login.html, register.html
            ├── css/style.css
            ├── js/                    # api.js, ui.js, navbar.js, page scripts
            ├── customer/              # Customer-facing pages
            └── admin/                 # Admin-facing pages
```

## Database design

| Table         | Purpose                                              |
|---------------|-------------------------------------------------------|
| `admin`       | Admin accounts                                        |
| `customer`    | Customer accounts                                      |
| `drug`        | Medicine catalog (name, category, price, stock, expiry)|
| `cart`        | Per-customer cart line items                           |
| `orders`      | Placed orders (header: date, total, status)            |
| `order_items` | Line items snapshot for each order                      |

Foreign keys: `cart.customer_id → customer.id`, `cart.drug_id → drug.id`, `orders.customer_id → customer.id`, `order_items.order_id → orders.id`, `order_items.drug_id → drug.id`. See [`database.sql`](database.sql) for the full DDL.

The application uses `spring.jpa.hibernate.ddl-auto=update`, so **the schema is created automatically on first run** — running `database.sql` by hand is optional and only useful if you want to inspect/pre-create the schema yourself in MySQL Workbench.

## Setup instructions

### 1. Prerequisites
- JDK 17 or newer
- MySQL Server running locally (or update the URL in `application.properties` to point elsewhere)
- No local Maven install needed — this project ships a **Maven Wrapper** (`mvnw` / `mvnw.cmd`)

### 2. Configure the database
Edit `src/main/resources/application.properties` and set your MySQL username/password:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/medicare_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

The database `medicare_db` is created automatically if it doesn't exist (`createDatabaseIfNotExist=true`).

### 3. Run the application

```bash
./mvnw spring-boot:run
```

(On Windows PowerShell: `.\mvnw.cmd spring-boot:run`)

The app starts on **http://localhost:8080**. On first startup, `DataInitializer` automatically seeds:
- 1 sample admin account
- 1 sample customer account
- 12 sample medicines across multiple categories (including one out-of-stock and one already-expired, to demonstrate those business rules)

### 4. Open the app
Navigate to **http://localhost:8080** in your browser. Use the sample logins below, or register a new customer account.

### 5. Import into an IDE (optional)
**Eclipse:** File → Import → Maven → Existing Maven Projects → select this folder.
**IntelliJ IDEA:** File → Open → select this folder (auto-detected as a Maven project).

## Sample logins

| Role     | Username / Email             | Password      |
|----------|-------------------------------|---------------|
| Admin    | `admin`                       | `Admin@123`   |
| Customer | `customer@medicare.com`       | `Customer@123`|

You can also register a brand-new customer account from the Register page.

## How the frontend talks to the backend

The frontend is plain HTML/CSS/JavaScript served directly from Spring Boot's `src/main/resources/static` folder (same origin as the API, so no CORS issues in practice). All API calls go through `js/api.js`:

1. On login/register, the backend returns a bearer **token** (`LoginResponse.token`) plus the user's id/name/role. This is stored in `localStorage` (`medicare_token`, `medicare_user`) — there is no server-side session; the token is a simple in-memory bearer token (see `TokenStore`), similar in spirit to a JWT but intentionally simplified for readability.
2. Every subsequent request adds `Authorization: Bearer <token>` via `api.js`'s `apiRequest()` helper.
3. `TokenAuthenticationFilter` (a `OncePerRequestFilter`) reads that header on the backend, resolves the token to a principal, and populates Spring Security's context — so `@PreAuthorize`-style role checks and manual checks (`SecurityUtil.isAdmin()`, `isSelfOrAdmin()`) work normally.
4. Pages call `requireRole("ADMIN")` / `requireRole("CUSTOMER")` on load to redirect unauthenticated users to the login page.
5. Every response follows the same envelope: `{ success, message, data }` (see `ApiResponse<T>`), which the frontend uses uniformly for success/error toasts and validation messages.

## REST API reference

All responses are wrapped as `{ "success": boolean, "message": string, "data": ... }`.

### Auth
| Method | Endpoint             | Access | Description |
|--------|-----------------------|--------|--------------|
| POST   | `/api/auth/register`  | Public | Register a new customer, returns a login token |
| POST   | `/api/auth/login`     | Public | Login as customer or admin (`identifier` = email or admin username) |

### Drugs / Medicines
| Method | Endpoint                              | Access       | Description |
|--------|-----------------------------------------|--------------|--------------|
| GET    | `/api/drugs`                            | Public       | List all medicines |
| GET    | `/api/drugs/{id}`                       | Public       | Get one medicine |
| GET    | `/api/drugs/search?name=&category=`     | Public       | Search by name and/or category |
| POST   | `/api/drugs`                            | Admin only   | Add a medicine |
| PUT    | `/api/drugs/{id}`                       | Admin only   | Update a medicine |
| DELETE | `/api/drugs/{id}`                       | Admin only   | Delete a medicine |

### Customers
| Method | Endpoint                | Access             | Description |
|--------|---------------------------|--------------------|--------------|
| GET    | `/api/customers`          | Admin only         | List all customers |
| GET    | `/api/customers/{id}`     | Self or Admin      | Get a customer profile |
| PUT    | `/api/customers/{id}`     | Self or Admin      | Update name/phone/address |

### Cart
| Method | Endpoint               | Access         | Description |
|--------|--------------------------|----------------|--------------|
| GET    | `/api/cart/{customerId}`  | Self or Admin  | Get a customer's cart |
| POST   | `/api/cart/add`           | Self or Admin  | Add a medicine to cart (merges quantity if already present) |
| PUT    | `/api/cart/{id}`          | Authenticated  | Update a cart line's quantity |
| DELETE | `/api/cart/{id}`          | Authenticated  | Remove a cart line |

### Orders
| Method | Endpoint                         | Access         | Description |
|--------|-------------------------------------|----------------|--------------|
| POST   | `/api/orders`                       | Self or Admin  | Place an order from the customer's current cart |
| GET    | `/api/orders/{id}`                  | Self or Admin  | Get one order with its items |
| GET    | `/api/orders/customer/{customerId}` | Self or Admin  | Get a customer's order history |
| GET    | `/api/orders`                       | Admin only     | Get all orders |
| PUT    | `/api/orders/{id}/status`           | Admin only     | Update order status (`PLACED → PROCESSED → SHIPPED → DELIVERED`) |

## Business rules implemented

- A customer cannot add to cart / place an order for more units than are currently in stock (`InsufficientStockException`).
- Expired medicines cannot be added to cart or ordered, even if still visible in the catalog.
- Stock is decremented automatically, per order line, at the moment an order is placed (`OrderService.placeOrder`, transactional).
- Cart line totals and order totals are always computed server-side from current price × quantity — never trusted from the client.
- Order status can only move forward (`PLACED → PROCESSED → SHIPPED → DELIVERED`), never backward.
- Customers can only view/act on their own cart, profile and orders; admins can view/manage everything. Enforced both by Spring Security URL rules and per-request ownership checks (`SecurityUtil`).
- Passwords are BCrypt-hashed and never included in any API response DTO.

## Frontend pages

**Public:** Home (`index.html`), Register, Login (customer), Admin Login (`admin/login.html`).

**Customer:** Dashboard, Medicine Catalog (also serves as Search Results via the on-page search bar), Medicine Details, Cart, Checkout, Order Confirmation, My Orders, Order Details, Profile.

**Admin:** Dashboard, Manage Medicines, Add Medicine, Edit Medicine, Customers, Orders (inline status update), Order Details.

The navigation bar (`js/navbar.js`) is fixed/stable across all pages and adapts its links based on the logged-in role; the admin section additionally uses a fixed sidebar (`js/admin-sidebar.js`).

## Notes for a Java fresher

- Layering is strict: `Controller → Service → Repository → Database`. Controllers never touch repositories directly.
- All custom exceptions extend `RuntimeException` and are translated to clean JSON error responses in one place: `GlobalExceptionHandler` (`@RestControllerAdvice`).
- There is no JWT library dependency — authentication uses a small, explicit `TokenStore` (an in-memory map) plus a `TokenAuthenticationFilter`, so the whole auth flow can be read start-to-finish in a few files under `com.medicare.security`.
