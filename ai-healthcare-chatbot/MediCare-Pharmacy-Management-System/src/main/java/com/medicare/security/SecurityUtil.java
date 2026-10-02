package com.medicare.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtil {

    public AuthPrincipal getCurrentPrincipal() {
        Object principal = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getPrincipal()
                : null;
        if (principal instanceof AuthPrincipal authPrincipal) {
            return authPrincipal;
        }
        return null;
    }

    public boolean isAdmin() {
        AuthPrincipal principal = getCurrentPrincipal();
        return principal != null && "ADMIN".equals(principal.getRole());
    }

    public boolean isSelfOrAdmin(Long customerId) {
        AuthPrincipal principal = getCurrentPrincipal();
        if (principal == null) {
            return false;
        }
        if ("ADMIN".equals(principal.getRole())) {
            return true;
        }
        return "CUSTOMER".equals(principal.getRole()) && principal.getId().equals(customerId);
    }
}
