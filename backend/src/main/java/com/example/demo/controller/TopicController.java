package com.example.demo.controller;

import com.example.demo.model.Topic;
import com.example.demo.model.Section;
import com.example.demo.repository.TopicRepository;
import com.example.demo.repository.SectionRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TopicController {

    private final TopicRepository topicRepository;
    private final SectionRepository sectionRepository;

    public TopicController(TopicRepository topicRepository, SectionRepository sectionRepository) {
        this.topicRepository = topicRepository;
        this.sectionRepository = sectionRepository;
    }

    @GetMapping("/topics")
    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    @GetMapping("/sections/{sectionId}/topics")
    public List<Topic> getTopicsBySection(@PathVariable Long sectionId) {
        return topicRepository.findBySectionId(sectionId);
    }

    @GetMapping("/topics/{id}")
    public Topic getTopic(@PathVariable Long id) {
        return topicRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    @PostMapping("/sections/{sectionId}/topics")
    public ResponseEntity<Topic> createTopic(@PathVariable Long sectionId, @RequestBody Topic topic) {
        Section section = sectionRepository.findById(sectionId)
            .orElseThrow(() -> new RuntimeException("Section not found"));
        topic.setSection(section);
        Topic savedTopic = topicRepository.save(topic);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTopic);
    }

    @PutMapping("/topics/{id}")
    public ResponseEntity<Topic> updateTopic(@PathVariable Long id, @RequestBody Topic topicDetails) {
        Topic topic = topicRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Topic not found"));
        topic.setTitle(topicDetails.getTitle());
        topic.setDescription(topicDetails.getDescription());
        Topic updatedTopic = topicRepository.save(topic);
        return ResponseEntity.ok(updatedTopic);
    }

    @DeleteMapping("/topics/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long id) {
        topicRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}