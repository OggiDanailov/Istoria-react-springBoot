package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/periods/**").permitAll()
                .requestMatchers("/api/chapters/**").permitAll()
                .requestMatchers("/api/topics/**").permitAll()
                .requestMatchers("/api/questions/**").permitAll()
                .requestMatchers("/api/batches/**").permitAll()
                .requestMatchers("/api/user-progress/**").permitAll()  // ← ADD THIS
                .requestMatchers("/api/quiz-attempts/**").permitAll()  // ← ADD THIS
                .requestMatchers("/h2-console/**").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(basic -> {});

        return http.build();
    }
}