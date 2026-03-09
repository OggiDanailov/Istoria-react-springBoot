package com.example.demo.controller;

import com.example.demo.model.Section;
import com.example.demo.repository.SectionRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/api/sections")
public class SectionController {

    private final SectionRepository sectionRepository;

    public SectionController(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    @GetMapping
    public List<Section> getAllSections() {
        return sectionRepository.findAll();
    }

    @GetMapping("/{id}")
    public Section getSection(@PathVariable Long id) {
        return sectionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Section not found"));
    }

    @PostMapping
    public ResponseEntity<Section> createSection(@RequestBody Section section) {
        Section savedSection = sectionRepository.save(section);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedSection);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Section> updateSection(@PathVariable Long id, @RequestBody Section sectionDetails) {
        Section section = sectionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Section not found"));

        section.setTitle(sectionDetails.getTitle());
        section.setDescription(sectionDetails.getDescription());
        section.setDiscipline(sectionDetails.getDiscipline());

        Section updatedSection = sectionRepository.save(section);
        return ResponseEntity.ok(updatedSection);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        sectionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}