package com.example.demo.controller;

import com.example.demo.model.Chapter;
import com.example.demo.model.Topic;
import com.example.demo.repository.ChapterRepository;
import com.example.demo.repository.TopicRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class ChapterController {

    private final ChapterRepository chapterRepository;
    private final TopicRepository topicRepository;

    public ChapterController(ChapterRepository chapterRepository, TopicRepository topicRepository) {
        this.chapterRepository = chapterRepository;
        this.topicRepository = topicRepository;
    }

    // Get all chapters
    @GetMapping("/chapters")
    public List<Chapter> getAllChapters() {
        return chapterRepository.findAll();
    }

    // Get chapters by topic
    @GetMapping("/topics/{topicId}/chapters")
    public List<Chapter> getChaptersByTopic(@PathVariable Long topicId) {
        return chapterRepository.findByTopicId(topicId);
    }

    // Get a specific chapter by ID
    @GetMapping("/chapters/{id}")
    public Chapter getChapter(@PathVariable Long id) {
        return chapterRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Chapter not found"));
    }

    // Create a new chapter for a topic
    @PostMapping("/topics/{topicId}/chapters")
    public ResponseEntity<Chapter> createChapter(@PathVariable Long topicId, @RequestBody Chapter chapter) {
        Topic topic = topicRepository.findById(topicId)
            .orElseThrow(() -> new RuntimeException("Topic not found"));

        chapter.setTopic(topic);
        Chapter savedChapter = chapterRepository.save(chapter);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedChapter);
    }

    // Update an existing chapter
    @PutMapping("/chapters/{id}")
    public ResponseEntity<Chapter> updateChapter(@PathVariable Long id, @RequestBody Chapter chapterDetails) {
        Chapter chapter = chapterRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Chapter not found"));

        chapter.setTitle(chapterDetails.getTitle());
        chapter.setContent(chapterDetails.getContent());

        Chapter updatedChapter = chapterRepository.save(chapter);
        return ResponseEntity.ok(updatedChapter);
    }

    // Delete a chapter
    @DeleteMapping("/chapters/{id}")
    public ResponseEntity<Void> deleteChapter(@PathVariable Long id) {
        chapterRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}