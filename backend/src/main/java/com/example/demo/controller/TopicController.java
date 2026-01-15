package com.example.demo.controller;

import com.example.demo.model.Topic;
import com.example.demo.model.Period;
import com.example.demo.repository.TopicRepository;
import com.example.demo.repository.PeriodRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@CrossOrigin(origins = {"http://localhost", "http://localhost:5173", "http://localhost:80"})
@RestController
@RequestMapping("/api")
public class TopicController {

    private final TopicRepository topicRepository;
    private final PeriodRepository periodRepository;

    public TopicController(TopicRepository topicRepository, PeriodRepository periodRepository) {
        this.topicRepository = topicRepository;
        this.periodRepository = periodRepository;
    }

    // Get all topics
    @GetMapping("/topics")
    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    // Get topics by period
    @GetMapping("/periods/{periodId}/topics")
    public List<Topic> getTopicsByPeriod(@PathVariable Long periodId) {
        return topicRepository.findByPeriodId(periodId);
    }

    // Get a specific topic by ID
    @GetMapping("/topics/{id}")
    public Topic getTopic(@PathVariable Long id) {
        return topicRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Topic not found"));
    }

    // Create a new topic for a period
    @PostMapping("/periods/{periodId}/topics")
    public ResponseEntity<Topic> createTopic(@PathVariable Long periodId, @RequestBody Topic topic) {
        Period period = periodRepository.findById(periodId)
            .orElseThrow(() -> new RuntimeException("Period not found"));

        topic.setPeriod(period);
        Topic savedTopic = topicRepository.save(topic);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTopic);
    }

    // Update an existing topic
    @PutMapping("/topics/{id}")
    public ResponseEntity<Topic> updateTopic(@PathVariable Long id, @RequestBody Topic topicDetails) {
        Topic topic = topicRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Topic not found"));

        topic.setTitle(topicDetails.getTitle());
        topic.setDescription(topicDetails.getDescription());

        Topic updatedTopic = topicRepository.save(topic);
        return ResponseEntity.ok(updatedTopic);
    }

    // Delete a topic
    @DeleteMapping("/topics/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long id) {
        topicRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}