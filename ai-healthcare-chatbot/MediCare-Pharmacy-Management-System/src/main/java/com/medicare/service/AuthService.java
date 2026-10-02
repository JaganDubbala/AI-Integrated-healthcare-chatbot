package com.medicare.service;

import com.medicare.dto.LoginRequest;
import com.medicare.dto.LoginResponse;
import com.medicare.dto.RegisterRequest;
import com.medicare.entity.Admin;
import com.medicare.entity.Customer;
import com.medicare.exception.DuplicateEmailException;
import com.medicare.exception.InvalidCredentialsException;
import com.medicare.repository.AdminRepository;
import com.medicare.repository.CustomerRepository;
import com.medicare.security.AuthPrincipal;
import com.medicare.security.TokenStore;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenStore tokenStore;

    public AuthService(CustomerRepository customerRepository, AdminRepository adminRepository,
                        PasswordEncoder passwordEncoder, TokenStore tokenStore) {
        this.customerRepository = customerRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenStore = tokenStore;
    }

    public LoginResponse register(RegisterRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("An account with this email already exists");
        }
        Customer customer = new Customer(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhone(),
                request.getAddress()
        );
        customer = customerRepository.save(customer);

        AuthPrincipal principal = new AuthPrincipal(customer.getId(), customer.getName(), customer.getEmail(), "CUSTOMER");
        String token = tokenStore.createToken(principal);
        return new LoginResponse(token, customer.getId(), customer.getName(), customer.getEmail(), "CUSTOMER");
    }

    public LoginResponse login(LoginRequest request) {
        Optional<Customer> customerOpt = customerRepository.findByEmail(request.getIdentifier());
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            if (passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
                AuthPrincipal principal = new AuthPrincipal(customer.getId(), customer.getName(), customer.getEmail(), "CUSTOMER");
                String token = tokenStore.createToken(principal);
                return new LoginResponse(token, customer.getId(), customer.getName(), customer.getEmail(), "CUSTOMER");
            }
            throw new InvalidCredentialsException("Invalid email or password");
        }

        Optional<Admin> adminOpt = adminRepository.findByUsername(request.getIdentifier())
                .or(() -> adminRepository.findByEmail(request.getIdentifier()));
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
                AuthPrincipal principal = new AuthPrincipal(admin.getId(), admin.getUsername(), admin.getEmail(), "ADMIN");
                String token = tokenStore.createToken(principal);
                return new LoginResponse(token, admin.getId(), admin.getUsername(), admin.getEmail(), "ADMIN");
            }
            throw new InvalidCredentialsException("Invalid username or password");
        }

        throw new InvalidCredentialsException("No account found with the given email/username");
    }
}
