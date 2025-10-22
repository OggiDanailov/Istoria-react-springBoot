package com.example.demo.controller;

import com.example.demo.model.Question;
import com.example.demo.model.Chapter;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.repository.ChapterRepository;
import com.example.demo.dto.QuizAttemptRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;
import jakarta.servlet.http.HttpServletRequest;

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
        question.setDifficulty(questionDetails.getDifficulty());
        question.setTextReference(questionDetails.getTextReference());

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


    // Save quiz attempt (requires authentication)
    @PostMapping("/quiz-attempts")
        public ResponseEntity<?> saveQuizAttempt(HttpServletRequest request, @RequestBody QuizAttemptRequest attemptRequest) {        // Get user info from request attributes (set by JWT filter)
        String userId = (String) request.getAttribute("userId");
        String email = (String) request.getAttribute("email");

        // If userId is null, the filter would have blocked this request
        // But this is a safety check
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        // For now, just return success
        return ResponseEntity.ok("Quiz attempt saved for user: " + email);
    }


    @GetMapping("/topics/{topicId}/questions/random")
    public List<Question> getRandomQuestionsByTopic(@PathVariable Long topicId) {
        List<Question> allQuestions = questionRepository.findByChapterTopicId(topicId);
        // Shuffle and limit to 10
        Collections.shuffle(allQuestions);
        return allQuestions.stream().limit(10).collect(Collectors.toList());
    }

    @GetMapping("/chapters/{chapterId}/questions/random")
    public List<Question> getRandomQuestionsByChapter(@PathVariable Long chapterId) {
        List<Question> allQuestions = questionRepository.findByChapterId(chapterId);
        Collections.shuffle(allQuestions);
        return allQuestions.stream().limit(10).collect(Collectors.toList());
    }
}