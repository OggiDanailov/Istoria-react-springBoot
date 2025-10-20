package com.example.demo.filter;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter implements Filter {

    private final SecretKey JWT_SECRET;

    public JwtAuthenticationFilter() {
        String secret = "aVeryLongSecretKeyThatIsAtLeast64BytesLongForHS512AlgorithmSecurityPurposesOnlyForDevelopment1234567890";
        this.JWT_SECRET = Keys.hmacShaKeyFor(secret.getBytes());
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Skip filter for public endpoints (register, login)
        String requestPath = httpRequest.getRequestURI();

        // Get the Authorization header
        String authHeader = httpRequest.getHeader("Authorization");
        System.out.println("Auth Header: " + authHeader);
        System.out.println("Request Path: " + requestPath);


        // Allow public access to these endpoints
        if (requestPath.contains("/api/auth/register") ||
            requestPath.contains("/api/auth/login") ||
            requestPath.contains("/api/chapters") ||
            requestPath.contains("/api/topics") ||
            requestPath.contains("/api/questions")) {
            chain.doFilter(request, response);
            return;
        }

        // Check if Authorization header exists and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        try {
            // Extract token (remove "Bearer " prefix)
            String token = authHeader.substring(7);

            // Verify and parse token
            var claims = Jwts.parser()
                .verifyWith(JWT_SECRET)
                .build()
                .parseSignedClaims(token)
                .getPayload();

            // Extract user info from token
            String userId = claims.getSubject();
            String email = (String) claims.get("email");
            String accountType = (String) claims.get("accountType");

            // Store user info in request attributes so controllers can access it
            httpRequest.setAttribute("userId", userId);
            httpRequest.setAttribute("email", email);
            httpRequest.setAttribute("accountType", accountType);

            // Continue to next filter/controller
            chain.doFilter(request, response);

        } catch (Exception e) {
            // Token is invalid or expired
            e.printStackTrace();
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("Invalid or expired token: " + e.getMessage());
        }
    }
}
