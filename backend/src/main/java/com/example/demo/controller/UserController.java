package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Date;

import javax.crypto.SecretKey;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final SecretKey JWT_SECRET;
    private final long JWT_EXPIRATION = 86400000; // 24 hours

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        String secret = "aVeryLongSecretKeyThatIsAtLeast64BytesLongForHS512AlgorithmSecurityPurposesOnlyForDevelopment1234567890";
        this.JWT_SECRET = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        // Hash the password
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // Create new user
        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setPasswordHash(hashedPassword);
        newUser.setAccountType("FREE");
        newUser.setRole(UserRole.PLAYER);
        newUser.setCreatedAt(java.time.LocalDateTime.now());

        // Save to database
        User savedUser = userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(new RegisterResponse(
            savedUser.getId(),
            savedUser.getEmail(),
            savedUser.getAccountType()
        ));
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }

        // Find user by email
        var user = userRepository.findByEmail(request.getEmail());
        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        User foundUser = user.get();

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), foundUser.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        // Generate JWT token
        String token = Jwts.builder()
            .setSubject(foundUser.getId().toString())
            .claim("email", foundUser.getEmail())
            .claim("accountType", foundUser.getAccountType())
            .claim("role", foundUser.getRole().toString())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
            .signWith(JWT_SECRET)
            .compact();

        return ResponseEntity.ok(new LoginResponse(
            token,
            foundUser.getId(),
            foundUser.getEmail(),
            foundUser.getAccountType(),
            foundUser.getRole().toString()
        ));
    }
}

// Request DTOs
class RegisterRequest {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

class LoginRequest {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

// Response DTOs
class RegisterResponse {
    private Long id;
    private String email;
    private String accountType;

    public RegisterResponse(Long id, String email, String accountType) {
        this.id = id;
        this.email = email;
        this.accountType = accountType;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getAccountType() {
        return accountType;
    }
}

class LoginResponse {
    private String token;
    private Long id;
    private String email;
    private String accountType;
    private String role;

    public LoginResponse(String token, Long id, String email, String accountType, String role) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.accountType = accountType;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getAccountType() {
        return accountType;
    }

     public String getRole() {
        return role;
    }
}