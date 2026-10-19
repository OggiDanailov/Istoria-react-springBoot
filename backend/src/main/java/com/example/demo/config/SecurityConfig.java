package com.example.demo.config;

import com.example.demo.filter.JwtAuthenticationFilter;
import jakarta.servlet.DispatcherType;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Content endpoints: anyone can read, only admins can write
    private static final String[] CONTENT_PATHS = {
        "/api/sections/**",
        "/api/topics/**",
        "/api/chapters/**",
        "/api/questions/**",
        "/api/batches/**"
    };

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin())  // for H2 console (dev only)
            )
            .authorizeHttpRequests(authz -> authz
                .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()  // keep real 403/404 instead of 401
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()

                // Per-user progress on batches (any logged-in user)
                .requestMatchers(HttpMethod.PUT, "/api/batches/*/progress").authenticated()

                .requestMatchers(HttpMethod.GET, CONTENT_PATHS).permitAll()
                .requestMatchers(HttpMethod.POST, CONTENT_PATHS).hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, CONTENT_PATHS).hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, CONTENT_PATHS).hasRole("ADMIN")

                .requestMatchers("/api/user-progress/**").authenticated()
                .requestMatchers("/api/quiz-attempts/**").authenticated()
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Stop Spring Boot from also registering the JWT filter as a plain servlet filter
    // (it already runs inside the security chain above)
    @Bean
    public FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterRegistration(JwtAuthenticationFilter filter) {
        FilterRegistrationBean<JwtAuthenticationFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false);
        return registration;
    }
}
