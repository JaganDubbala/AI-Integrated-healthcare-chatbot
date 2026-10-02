package com.jagan.healthcare.controller;
import com.jagan.healthcare.repository.*; import jakarta.servlet.http.HttpSession; import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import java.util.*;
@RestController @RequestMapping("/api/admin") @CrossOrigin(origins="*") public class AdminController { private final UserAccountRepository users; private final AppointmentRepository appointments; private final DoctorRepository doctors; private final HospitalRepository hospitals; public AdminController(UserAccountRepository u,AppointmentRepository a,DoctorRepository d,HospitalRepository h){users=u;appointments=a;doctors=d;hospitals=h;}
 private void check(HttpSession s){if(!"ADMIN".equals(s.getAttribute("role")))throw new IllegalArgumentException("Admin access required.");}
 @GetMapping("/stats") public Map<String,Object> stats(HttpSession s){check(s);return Map.of("patients",users.countByRole("PATIENT"),"doctors",doctors.count(),"hospitals",hospitals.count(),"appointments",appointments.count());}
 @GetMapping("/appointments") public Object allAppointments(HttpSession s){check(s);return appointments.findAllByOrderByAppointmentDateAscAppointmentTimeAsc();}
}
