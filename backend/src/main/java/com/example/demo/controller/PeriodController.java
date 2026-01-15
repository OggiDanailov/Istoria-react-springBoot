package com.example.demo.controller;

import com.example.demo.model.Period;
import com.example.demo.repository.PeriodRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@CrossOrigin(origins = {"http://localhost", "http://localhost:5173", "http://localhost:80"})
@RestController
@RequestMapping("/api/periods")
public class PeriodController {

    private final PeriodRepository periodRepository;

    public PeriodController(PeriodRepository periodRepository) {
        this.periodRepository = periodRepository;
    }

    // Get all periods
    @GetMapping
    public List<Period> getAllPeriods() {
        return periodRepository.findAll();
    }

    // Get a specific period by ID
    @GetMapping("/{id}")
    public Period getPeriod(@PathVariable Long id) {
        return periodRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Period not found"));
    }

    // Create a new period
    @PostMapping
    public ResponseEntity<Period> createPeriod(@RequestBody Period period) {
        Period savedPeriod = periodRepository.save(period);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPeriod);
    }

    // Update an existing period
    @PutMapping("/{id}")
    public ResponseEntity<Period> updatePeriod(@PathVariable Long id, @RequestBody Period periodDetails) {
        Period period = periodRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Period not found"));

        period.setTitle(periodDetails.getTitle());
        period.setDescription(periodDetails.getDescription());

        Period updatedPeriod = periodRepository.save(period);
        return ResponseEntity.ok(updatedPeriod);
    }

    // Delete a period
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePeriod(@PathVariable Long id) {
        periodRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}