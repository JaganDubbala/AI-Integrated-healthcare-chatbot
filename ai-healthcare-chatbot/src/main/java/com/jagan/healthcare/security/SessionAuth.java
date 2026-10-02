package com.jagan.healthcare.security;
import jakarta.servlet.http.HttpSession;
public class SessionAuth {
    public static String requireLogin(HttpSession session) {
        Object v = session.getAttribute("userEmail");
        if (v == null || v.toString().isBlank()) throw new IllegalArgumentException("Login required.");
        return v.toString();
    }
    public static void requireAdmin(HttpSession session) {
        if (!"ADMIN".equals(session.getAttribute("role"))) throw new IllegalArgumentException("Admin access required.");
    }
}
