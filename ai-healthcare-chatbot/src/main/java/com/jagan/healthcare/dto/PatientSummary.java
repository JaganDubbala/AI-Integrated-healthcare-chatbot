package com.jagan.healthcare.dto;
import com.jagan.healthcare.model.UserAccount; import java.time.LocalDateTime;
public class PatientSummary { private final Long id; private final String name; private final String email; private final String phone; private final String role; private final LocalDateTime createdAt;
 public PatientSummary(Long id,String name,String email,String phone,String role,LocalDateTime createdAt){this.id=id;this.name=name;this.email=email;this.phone=phone;this.role=role;this.createdAt=createdAt;}
 public Long getId(){return id;} public String getName(){return name;} public String getEmail(){return email;} public String getPhone(){return phone;} public String getRole(){return role;} public LocalDateTime getCreatedAt(){return createdAt;}
 public static PatientSummary from(UserAccount u){return new PatientSummary(u.getId(),u.getName(),u.getEmail(),u.getPhone(),u.getRole(),u.getCreatedAt());}
}
