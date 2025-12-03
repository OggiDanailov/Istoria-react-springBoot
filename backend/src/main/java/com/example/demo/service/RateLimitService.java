package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class RateLimitService {

    private final Map<String, List<Long>> loginAttempts = new HashMap<>();
    private final int MAX_ATTEMPTS = 5;
    private final long TIME_WINDOW = 15 * 60 * 1000; // 15 minutes in milliseconds

    public boolean isRateLimited(String email) {
        long now = System.currentTimeMillis();

        // Get attempts for this email
        List<Long> attempts = loginAttempts.getOrDefault(email, new ArrayList<>());

        // Remove old attempts outside the time window
        attempts.removeIf(timestamp -> now - timestamp > TIME_WINDOW);

        // Check if exceeded limit
        if (attempts.size() >= MAX_ATTEMPTS) {
            return true; // Rate limited
        }

        // Add current attempt
        attempts.add(now);
        loginAttempts.put(email, attempts);

        return false; // Not rate limited
    }

    public void resetAttempts(String email) {
        loginAttempts.remove(email);
    }
}