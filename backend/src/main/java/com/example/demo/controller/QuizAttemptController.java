package com.example.demo.controller;

import com.example.demo.model.QuizAttempt;
import com.example.demo.model.User;
import com.example.demo.model.Chapter;
import com.example.demo.model.QuizBatch;
import com.example.demo.model.BatchProgress;
import com.example.demo.repository.QuizAttemptRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ChapterRepository;
import com.example.demo.repository.QuizBatchRepository;
import com.example.demo.repository.BatchProgressRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/quiz-attempts")
public class QuizAttemptController {

    private final QuizAttemptRepository quizAttemptRepository;
    private final UserRepository userRepository;
    private final ChapterRepository chapterRepository;
    private final QuizBatchRepository quizBatchRepository;
    private final BatchProgressRepository batchProgressRepository;

    public QuizAttemptController(QuizAttemptRepository quizAttemptRepository,
                               UserRepository userRepository,
                               ChapterRepository chapterRepository,
                               QuizBatchRepository quizBatchRepository,
                               BatchProgressRepository batchProgressRepository) {
        this.quizAttemptRepository = quizAttemptRepository;
        this.userRepository = userRepository;
        this.chapterRepository = chapterRepository;
        this.quizBatchRepository = quizBatchRepository;
        this.batchProgressRepository = batchProgressRepository;
    }

    // Save a quiz attempt
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

            // Create quiz attempt
            QuizAttempt attempt = new QuizAttempt(user, chapter, batch,
                    request.getScore(), request.getTotalQuestions(), request.getTotalPoints());

            // Calculate points to award based on gamification rules
            int pointsToAward = calculatePointsToAward(request);
            attempt.setPointsAwarded(pointsToAward);

            // Save the attempt
            QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

            // If this is a batch attempt, update batch progress
            if (batch != null) {
                updateBatchProgress(userId, batch.getId(), request);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(savedAttempt);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // Calculate points to award based on accuracy and gamification rules
    private int calculatePointsToAward(QuizAttemptRequest request) {
        double accuracy = (double) request.getScore() / request.getTotalPoints() * 100;

        if (accuracy >= 70) {
            // Pass: award full points
            return request.getScore();
        } else if (accuracy >= 50) {
            // Fail (50-69%): award 0 points
            return 0;
        } else {
            // Fail badly (<50%): deduct half of total points
            return -(request.getTotalPoints() / 2);
        }
    }

    // Update batch progress after an attempt
    private void updateBatchProgress(Long userId, Long batchId, QuizAttemptRequest request) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            QuizBatch batch = quizBatchRepository.findById(batchId).orElse(null);

            if (user == null || batch == null) {
                return;
            }

            // Get or create batch progress
            BatchProgress progress = batchProgressRepository.findByUserIdAndBatchId(userId, batchId)
                    .orElse(new BatchProgress(user, batch));

            // Update with new attempt (keep best score)
            if (request.getScore() > progress.getBestScore()) {
                progress.setBestScore(request.getScore());
            }
            progress.setTotalPoints(request.getTotalPoints());
            progress.setAttemptCount(progress.getAttemptCount() + 1);
            progress.setLastAttemptDate(java.time.LocalDateTime.now());

            // Recalculate mastery (80%+)
            progress.updateMastery();

            // Save updated progress
            batchProgressRepository.save(progress);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Get all quiz attempts for a user
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

    // Get quiz attempts for a specific chapter
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

    // Get quiz attempts for a specific batch
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

    // Get a single quiz attempt by ID
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

// DTO for quiz attempt requests
class QuizAttemptRequest {
    private Long chapterId;
    private Long batchId; // NEW: Optional batch ID
    private int score;
    private int totalQuestions;
    private int totalPoints;

    public Long getChapterId() {
        return chapterId;
    }

    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
    }

    public Long getBatchId() {
        return batchId;
    }

    public void setBatchId(Long batchId) {
        this.batchId = batchId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(int totalPoints) {
        this.totalPoints = totalPoints;
    }
}