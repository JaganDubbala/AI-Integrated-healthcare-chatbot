# AI Healthcare Chatbot - Full Feature Version

Features:
- Spring Boot + Spring MVC + JPA/Hibernate + MySQL
- FAQ and symptom guidance
- Minor/Mild vs Major/Severe symptom flow
- General OTC medicine information (no diagnosis/prescription/dose)
- Speech-to-Text and Text-to-Speech
- Hospital search
- Doctor search by specialty
- Appointment booking and available slots
- My Appointments and cancellation
- Patient registration/login using session authentication
- BCrypt password hashing
- Patient profile
- Chat history
- Admin dashboard with counts and appointments

## Run
1. Create MySQL database `healthcare_chatbot`.
2. Update `src/main/resources/application.properties` with your own MySQL username/password.
3. Run as Spring Boot App in Eclipse.
4. Open http://localhost:8080

## Demo admin
Email: admin@healthcare.com
Password: Admin@123

Change/remove demo credentials before any real deployment. Hospital and doctor records included by the project are demo data.
