package com.example.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.demo.model.QuizAttempt;
import com.example.demo.model.User;
import com.example.demo.model.Chapter;
import com.example.demo.model.QuizBatch;
import com.example.demo.repository.QuizAttemptRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ChapterRepository;
import com.example.demo.repository.QuizBatchRepository;
import com.example.demo.service.QuizService;
import com.example.demo.dto.QuizAttemptRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;


@CrossOrigin(origins = {"http://localhost", "http://localhost:5173", "http://localhost:80"})
@RestController
@RequestMapping("/api/quiz-attempts")
public class QuizAttemptController {

    private final QuizAttemptRepository quizAttemptRepository;
    private final UserRepository userRepository;
    private final ChapterRepository chapterRepository;
    private final QuizBatchRepository quizBatchRepository;
    private final QuizService quizService;
    private final ObjectMapper objectMapper;

    public QuizAttemptController(QuizAttemptRepository quizAttemptRepository,
                               UserRepository userRepository,
                               ChapterRepository chapterRepository,
                               QuizBatchRepository quizBatchRepository,
                               QuizService quizService,
                               ObjectMapper objectMapper) {
        this.quizAttemptRepository = quizAttemptRepository;
        this.userRepository = userRepository;
        this.chapterRepository = chapterRepository;
        this.quizBatchRepository = quizBatchRepository;
        this.quizService = quizService;
        this.objectMapper = objectMapper;
    }

    /**
     * Save a quiz attempt with SERVER-SIDE answer verification
     * Delegates business logic to QuizService
     */
    @PostMapping
    public ResponseEntity<QuizAttempt> saveQuizAttempt(
            @RequestBody QuizAttemptRequest request,
            HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");

            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Chapter chapter = chapterRepository.findById(request.getChapterId())
                    .orElseThrow(() -> new RuntimeException("Chapter not found"));

            QuizBatch batch = null;
            if (request.getBatchId() != null) {
                batch = quizBatchRepository.findById(request.getBatchId())
                        .orElse(null);
            }

            // ===== DELEGATE TO SERVICE =====
            // Verify answers and calculate score
            int verifiedScore = quizService.verifyAnswersAndCalculateScore(batch, request.getUserAnswers());
            int totalPoints = quizService.calculateTotalPoints(batch);
            // ================================

            // Create quiz attempt with VERIFIED score (not frontend's claimed score)
            QuizAttempt attempt = new QuizAttempt(user, chapter, batch,
                    verifiedScore, request.getUserAnswers().size(), totalPoints);

            String userAnswersJson = objectMapper.writeValueAsString(request.getUserAnswers());
            attempt.setUserAnswers(userAnswersJson);

            // ===== DELEGATE TO SERVICE =====
            // Calculate points to award based on gamification rules
            int pointsToAward = quizService.calculatePointsToAward(verifiedScore, totalPoints, userId, request.getBatchId());
            // ================================
            attempt.setPointsAwarded(pointsToAward);

            // Save the attempt
            QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

            // ===== DELEGATE TO SERVICE =====
            // If this is a batch attempt, update batch progress
            if (batch != null) {
                quizService.updateBatchProgress(userId, batch.getId(), verifiedScore, totalPoints);
            }

            // Update user progress for the topic
            quizService.updateUserProgressForTopic(userId, request.getChapterId());
            // ================================

            return ResponseEntity.status(HttpStatus.CREATED).body(savedAttempt);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get all quiz attempts for a user
     */
    @GetMapping("/user")
    public ResponseEntity<List<QuizAttempt>> getUserQuizAttempts(HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);
            List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdOrderByAttemptDateDesc(userId);
            return ResponseEntity.ok(attempts);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get quiz attempts for a specific chapter
     */
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<QuizAttempt>> getChapterAttempts(
            @PathVariable Long chapterId,
            HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);
            List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdAndChapterIdOrderByAttemptDateDesc(userId, chapterId);
            return ResponseEntity.ok(attempts);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get quiz attempts for a specific batch
     */
    @GetMapping("/batch/{batchId}")
    public ResponseEntity<List<QuizAttempt>> getBatchAttempts(
            @PathVariable Long batchId,
            HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);
            List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdAndBatchIdOrderByAttemptDateDesc(userId, batchId);
            return ResponseEntity.ok(attempts);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get a single quiz attempt by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<QuizAttempt> getQuizAttempt(@PathVariable Long id) {
        try {
            QuizAttempt attempt = quizAttemptRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Quiz attempt not found"));
            return ResponseEntity.ok(attempt);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}