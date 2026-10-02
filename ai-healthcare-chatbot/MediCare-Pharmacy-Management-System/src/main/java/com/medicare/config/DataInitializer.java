package com.medicare.config;

import com.medicare.entity.Admin;
import com.medicare.entity.Customer;
import com.medicare.entity.Drug;
import com.medicare.repository.AdminRepository;
import com.medicare.repository.CustomerRepository;
import com.medicare.repository.DrugRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;
    private final DrugRepository drugRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminRepository adminRepository, CustomerRepository customerRepository,
                            DrugRepository drugRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.customerRepository = customerRepository;
        this.drugRepository = drugRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCustomer();
        seedDrugs();
    }

    private void seedAdmin() {
        if (!adminRepository.existsByUsername("admin")) {
            Admin admin = new Admin("admin", "admin@medicare.com", passwordEncoder.encode("Admin@123"), "ADMIN");
            adminRepository.save(admin);
        }
    }

    private void seedCustomer() {
        if (!customerRepository.existsByEmail("customer@medicare.com")) {
            Customer customer = new Customer(
                    "Test Customer",
                    "customer@medicare.com",
                    passwordEncoder.encode("Customer@123"),
                    "9876543210",
                    "12, MG Road, Bengaluru, Karnataka"
            );
            customerRepository.save(customer);
        }
    }

    private void seedDrugs() {
        if (drugRepository.count() > 0) {
            return;
        }

        LocalDate future = LocalDate.now().plusYears(2);
        LocalDate soon = LocalDate.now().plusMonths(2);
        LocalDate expired = LocalDate.now().minusMonths(1);

        drugRepository.save(drug("Paracetamol 500mg", "Relieves mild to moderate pain and fever.", "Painkiller", "Cipla Ltd.", new BigDecimal("25.00"), 200, future));
        drugRepository.save(drug("Amoxicillin 250mg", "Broad-spectrum antibiotic capsule.", "Antibiotic", "Sun Pharma", new BigDecimal("85.50"), 120, future));
        drugRepository.save(drug("Cetirizine 10mg", "Antihistamine for allergy relief.", "Antiallergic", "Dr. Reddy's Labs", new BigDecimal("18.00"), 300, future));
        drugRepository.save(drug("Pantoprazole 40mg", "Reduces stomach acid production.", "Antacid", "Sun Pharma", new BigDecimal("45.00"), 150, future));
        drugRepository.save(drug("Vitamin C 500mg", "Immunity-boosting daily supplement.", "Vitamin", "Himalaya Wellness", new BigDecimal("120.00"), 250, future));
        drugRepository.save(drug("Metformin 500mg", "Controls blood sugar levels in type 2 diabetes.", "Diabetes", "USV Pvt. Ltd.", new BigDecimal("32.00"), 180, future));
        drugRepository.save(drug("Atorvastatin 10mg", "Lowers cholesterol and reduces cardiac risk.", "Cardiac", "Cipla Ltd.", new BigDecimal("95.00"), 90, future));
        drugRepository.save(drug("Cough Syrup 100ml", "Relieves dry and wet cough.", "Cough & Cold", "Himalaya Wellness", new BigDecimal("65.00"), 100, soon));
        drugRepository.save(drug("Povidone Iodine Ointment", "Antiseptic for minor cuts and wounds.", "Antiseptic", "Win-Medicare", new BigDecimal("40.00"), 140, future));
        drugRepository.save(drug("Ibuprofen 400mg", "Anti-inflammatory pain reliever.", "Painkiller", "Abbott India", new BigDecimal("30.00"), 5, future));
        drugRepository.save(drug("ORS Sachet", "Oral rehydration salts for dehydration.", "General", "GSK Pharma", new BigDecimal("15.00"), 0, future));
        drugRepository.save(drug("Azithromycin 500mg", "Antibiotic used for bacterial infections.", "Antibiotic", "Alkem Labs", new BigDecimal("110.00"), 60, expired));
    }

    private Drug drug(String name, String description, String category, String manufacturer,
                       BigDecimal price, int stock, LocalDate expiry) {
        Drug d = new Drug();
        d.setName(name);
        d.setDescription(description);
        d.setCategory(category);
        d.setManufacturer(manufacturer);
        d.setPrice(price);
        d.setStockQuantity(stock);
        d.setExpiryDate(expiry);
        return d;
    }
}
