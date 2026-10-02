# AI-Integrated Healthcare Chatbot with Voice Assistant

A two-module (Patient / Admin) healthcare chatbot web app: Spring Boot + MySQL/JPA backend, plain multi-page HTML/CSS/JS frontend with a fixed navigation bar, browser-based speech-to-text/text-to-speech, symptom severity guidance, hospital/doctor search, appointment booking, and a full admin management dashboard.

## Tech stack

Java 17 · Spring Boot 3.5.5 · Spring MVC · Spring Data JPA/Hibernate · MySQL · REST APIs · HTML5/CSS3/JavaScript · Web Speech API (SpeechRecognition + SpeechSynthesis) · BCrypt · Maven.

## Pages

**Patient module:** `register.html` (landing page) → `login.html` → `home.html` → `chatbot.html`, `hospitals.html`, `doctors.html`, `appointments.html`, `my-appointments.html`, `history.html`, `profile.html`.

**Admin module:** `admin.html` (dashboard), `admin-patients.html`, `admin-doctors.html`, `admin-hospitals.html`, `admin-appointments.html`.

The chatbot provides general health information and preliminary symptom guidance only — it does not diagnose conditions or prescribe medication.

## Step-by-step setup

### 1. Import into Eclipse
File → Import → Maven → Existing Maven Projects → select this folder → Finish. Eclipse/m2e will resolve dependencies from `pom.xml` automatically (requires internet access on first import).

### 2. Create the MySQL database
Using the MySQL client or Workbench:
```sql
CREATE DATABASE IF NOT EXISTS healthcare_chatbot;
```
(see `database.sql`)

### 3. Configure `application.properties`
Edit `src/main/resources/application.properties` and set your own MySQL username/password:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/healthcare_chatbot?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```
`spring.jpa.hibernate.ddl-auto=update` will create/update all tables automatically on first run — no manual schema needed.

### 4. Run the application
In Eclipse: right-click the project → Run As → Spring Boot App (or Java Application, running `HealthcareChatbotApplication`). From the command line with Maven installed: `mvn spring-boot:run`. The app starts on **http://localhost:8080**.

### 5. Open the registration page
Navigate to `http://localhost:8080/` — it redirects automatically to `register.html`.

### 6. Register a patient
Fill in Full Name, Email, Phone, Password, Confirm Password → Register. You're redirected to `login.html`.

### 7. Log in
Log in with the account you just created. Patients land on `home.html`; the seed admin account lands on `admin.html`.

### 8. Test the chatbot
Open **💬 Chatbot** from the navbar. Try a greeting ("hello"), a symptom ("I have a headache"), and answer the Minor/Mild or Major/Severe prompt to see the general self-care/OTC guidance or the escalation message. Try an emergency phrase (e.g. "severe chest pain") to see the emergency warning.

### 9. Test voice input
Click the 🎤 microphone button, allow microphone access when prompted, and speak a question — the live transcript appears as you talk and is sent automatically once you stop. Use **Stop Speaking** to interrupt the bot's spoken reply at any time.

### 10. Test appointments
Go to **🏥 Hospitals** / **👨‍⚕️ Doctors** to search, then **📅 Appointments** to pick a doctor, date, and an open time slot, and confirm a booking. Check **📋 My Appointments** to see and cancel it.

### 11. Test admin login
Log out, then log in with the seed admin account:
```
Email: admin@healthcare.com
Password: Admin@123
```

### 12. Test the admin dashboard
On `admin.html` you'll see live Patients/Doctors/Hospitals/Appointments counts pulled from the database. Use **👥 Patients** to view registrations, **👨‍⚕️ Doctors** / **🏥 Hospitals** to add/edit/delete records, and **📅 Appointments** to view all bookings and change their status.

## Notes

- Accounts created before this version (including the seeded admin) will show a blank registration date in the admin Patients list, since that field didn't exist yet when they were created.
- The two extra demo symptoms (Cold, Sore Throat) are seeded only into a fresh/empty `symptoms` table — if you already had data seeded, insert them manually or clear that table to pick them up.
- In a real deployment, keep database credentials in environment variables/secrets rather than committed to `application.properties`.
