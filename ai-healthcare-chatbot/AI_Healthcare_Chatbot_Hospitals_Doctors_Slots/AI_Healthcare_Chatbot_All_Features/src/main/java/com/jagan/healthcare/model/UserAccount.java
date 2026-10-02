package com.jagan.healthcare.model;
import jakarta.persistence.*;
@Entity @Table(name="user_accounts")
public class UserAccount {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true) private String email; @Column(nullable=false) private String name; @Column(nullable=false) private String password; private String phone; @Column(nullable=false) private String role;
 public UserAccount(){} public UserAccount(String name,String email,String password,String phone,String role){this.name=name;this.email=email;this.password=password;this.phone=phone;this.role=role;}
 public Long getId(){return id;} public String getEmail(){return email;} public String getName(){return name;} public String getPassword(){return password;} public String getPhone(){return phone;} public String getRole(){return role;}
 public void setId(Long v){id=v;} public void setEmail(String v){email=v;} public void setName(String v){name=v;} public void setPassword(String v){password=v;} public void setPhone(String v){phone=v;} public void setRole(String v){role=v;}
}
