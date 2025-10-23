package com.example.demo.controller;

import com.example.demo.model.Question;
import com.example.demo.model.Chapter;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.repository.ChapterRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class QuestionController {

    private final QuestionRepository questionRepository;
    private final ChapterRepository chapterRepository;

    public QuestionController(QuestionRepository questionRepository, ChapterRepository chapterRepository) {
        this.questionRepository = questionRepository;
        this.chapterRepository = chapterRepository;
    }

    // Get all questions for a specific chapter
    @GetMapping("/chapters/{chapterId}/questions")
    public List<Question> getQuestionsByChapter(@PathVariable Long chapterId) {
        return questionRepository.findByChapterId(chapterId);
    }

    // Get all questions
    @GetMapping("/questions")
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    // Get a single question by ID
    @GetMapping("/questions/{id}")
    public Question getQuestion(@PathVariable Long id) {
        return questionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    // Create a new question for a chapter
    @PostMapping("/chapters/{chapterId}/questions")
    public ResponseEntity<Question> createQuestion(
        @PathVariable Long chapterId,
        @RequestBody Question question
    ) {
        Chapter chapter = chapterRepository.findById(chapterId)
            .orElseThrow(() -> new RuntimeException("Chapter not found"));

        question.setChapter(chapter);
        Question savedQuestion = questionRepository.save(question);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedQuestion);
    }

    // Update a question
    @PutMapping("/questions/{id}")
    public ResponseEntity<Question> updateQuestion(
        @PathVariable Long id,
        @RequestBody Question questionDetails
    ) {
        Question question = questionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setQuestion(questionDetails.getQuestion());
        question.setOptions(questionDetails.getOptions());
        question.setCorrectAnswer(questionDetails.getCorrectAnswer());

        Question updatedQuestion = questionRepository.save(question);
        return ResponseEntity.ok(updatedQuestion);
    }

    // Delete a question
    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    // Get all questions for a specific topic (across all chapters)
    // In QuestionController.java
    @GetMapping("/topics/{topicId}/questions")
    public List<Question> getQuestionsByTopic(@PathVariable Long topicId) {
        return questionRepository.findByChapterTopicId(topicId);
    }

    // Create a new question for a topic
    @PostMapping("/topics/{topicId}/questions")
    public ResponseEntity<Question> createQuestionForTopic(
        @PathVariable Long topicId,
        @RequestBody Question question
    ) {
        // Get the first chapter of the topic to associate the question with
        Chapter chapter = chapterRepository.findByTopicId(topicId).stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("No chapters found for this topic"));

        question.setChapter(chapter);
        Question savedQuestion = questionRepository.save(question);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedQuestion);
    }

    // Get random questions for a topic (for quiz batching)
    @GetMapping("/topics/{topicId}/questions/random")
    public List<Question> getRandomQuestionsByTopic(@PathVariable Long topicId) {
        List<Question> allQuestions = questionRepository.findByChapterTopicId(topicId);
        Collections.shuffle(allQuestions);
        return allQuestions.stream().limit(10).collect(Collectors.toList());
    }

    // Get random questions for a chapter (for quiz batching)
    @GetMapping("/chapters/{chapterId}/questions/random")
    public List<Question> getRandomQuestionsByChapter(@PathVariable Long chapterId) {
        List<Question> allQuestions = questionRepository.findByChapterId(chapterId);
        Collections.shuffle(allQuestions);
        return allQuestions.stream().limit(10).collect(Collectors.toList());
    }

    // Bulk import questions from JSON
    @PostMapping("/questions/bulk-import")
    public ResponseEntity<?> bulkImportQuestions(@RequestBody com.example.demo.dto.BulkQuestionImportRequest importRequest) {
        try {
            Long chapterId = importRequest.getChapterId();
            Long topicId = importRequest.getTopicId();

            // If only topicId provided, use first chapter of topic
            if (chapterId == null && topicId != null) {
                Chapter chapter = chapterRepository.findByTopicId(topicId).stream()
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No chapters found for topic"));
                chapterId = chapter.getId();
            }

            if (chapterId == null) {
                return ResponseEntity.badRequest().body("Either chapterId or topicId must be provided");
            }

            Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

            int importedCount = 0;
            for (com.example.demo.dto.BulkQuestionImportRequest.QuestionImportData qData : importRequest.getQuestions()) {
                Question question = new Question();
                question.setQuestion(qData.getQuestion());
                question.setOptions(qData.getOptions());
                question.setCorrectAnswer(qData.getCorrectAnswer());
                question.setDifficulty(qData.getDifficulty());
                question.setTextReference(qData.getTextReference());
                question.setChapter(chapter);

                questionRepository.save(question);
                importedCount++;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully imported " + importedCount + " questions");
            response.put("count", importedCount);

            return ResponseEntity.ok().body(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new java.util.HashMap<String, Object>() {{
                put("error", e.getMessage());
            }});
        }
    }
}