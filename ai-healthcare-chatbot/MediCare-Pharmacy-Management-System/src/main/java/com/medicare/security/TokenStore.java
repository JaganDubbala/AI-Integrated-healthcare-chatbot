package com.medicare.security;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory bearer-token store used instead of JWT for a lightweight,
 * easy-to-follow session mechanism suitable for a teaching/demo project.
 */
@Component
public class TokenStore {

    private final Map<String, AuthPrincipal> tokens = new ConcurrentHashMap<>();

    public String createToken(AuthPrincipal principal) {
        String token = UUID.randomUUID().toString();
        tokens.put(token, principal);
        return token;
    }

    public AuthPrincipal getPrincipal(String token) {
        return tokens.get(token);
    }

    public void invalidate(String token) {
        tokens.remove(token);
    }
}
