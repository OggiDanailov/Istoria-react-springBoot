package com.example.demo.filter;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Date;
import java.util.ArrayList;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class JwtAuthenticationFilter implements Filter {

    @Value("${jwt.secret}")
    private String jwtSecretString;

    @Value("${jwt.expiration}")
    private long tokenExpiration;

    private SecretKey JWT_SECRET;

    @PostConstruct
    public void init() {
        this.JWT_SECRET = Keys.hmacShaKeyFor(jwtSecretString.getBytes(StandardCharsets.UTF_8));
        System.out.println("JWT_SECRET initialized with length: " + jwtSecretString.length());
        System.out.println("JWT_SECRET value: " + jwtSecretString);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Add CORS headers - allows frontend to communicate with backend
        // httpResponse.setHeader("Access-Control-Allow-Origin", "http://localhost");
        // httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        // httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        // httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
        // httpResponse.setHeader("Access-Control-Max-Age", "3600");

        // Allow CORS preflight requests
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String requestPath = httpRequest.getRequestURI();
        String authHeader = httpRequest.getHeader("Authorization");

        // If Authorization header exists, validate it
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                var claims = Jwts.parser()
                    .verifyWith(JWT_SECRET)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

                Date expiration = claims.getExpiration();
                if (expiration != null && expiration.before(new Date())) {
                    httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    httpResponse.getWriter().write("Token has expired");
                    return;
                }

                String userId = claims.getSubject();
                String email = (String) claims.get("email");
                String accountType = (String) claims.get("accountType");

                httpRequest.setAttribute("userId", userId);
                httpRequest.setAttribute("email", email);
                httpRequest.setAttribute("accountType", accountType);

                // Set Spring Security authentication
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (Exception e) {
                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                httpResponse.getWriter().write("Invalid or expired token");
                return;
            }
        }

        // Allow public endpoints (no auth required)
        if (requestPath.contains("/api/auth/register") ||
            requestPath.contains("/api/auth/login") ||
            requestPath.contains("/api/periods") ||
            requestPath.contains("/api/chapters") ||
            requestPath.contains("/api/topics") ||
            requestPath.contains("/api/questions") ||
            requestPath.contains("/api/batches") ||
            requestPath.contains("/api/quiz-attempts") ||
            requestPath.contains("/h2-console")) {
            chain.doFilter(request, response);
            return;
        }

        // Non-public endpoints REQUIRE auth
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        // Token is valid (already validated above), allow through
        chain.doFilter(request, response);
    }
}