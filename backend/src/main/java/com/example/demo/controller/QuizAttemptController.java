package com.example.demo.controller;

import com.example.demo.model.UserProgress;
import com.example.demo.repository.UserProgressRepository;
import com.example.demo.repository.TopicRepository;
import com.example.demo.model.QuizAttempt;
import com.example.demo.model.User;
import com.example.demo.model.Chapter;
import com.example.demo.repository.QuizAttemptRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ChapterRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.time.LocalDateTime;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/quiz-attempts")
public class QuizAttemptController {

    private final QuizAttemptRepository quizAttemptRepository;
    private final UserRepository userRepository;
    private final ChapterRepository chapterRepository;
    private final UserProgressRepository userProgressRepository;
    private final TopicRepository topicRepository;

    public QuizAttemptController(QuizAttemptRepository quizAttemptRepository,
                                UserRepository userRepository,
                                ChapterRepository chapterRepository,
                                UserProgressRepository userProgressRepository,
                                TopicRepository topicRepository) {
        this.quizAttemptRepository = quizAttemptRepository;
        this.userRepository = userRepository;
        this.chapterRepository = chapterRepository;
        this.userProgressRepository = userProgressRepository;
        this.topicRepository = topicRepository;
    }


    @PostMapping
    public ResponseEntity<?> saveQuizAttempt(@RequestBody QuizAttemptRequest request, HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            Long userId = Long.parseLong(userIdStr);
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

            Chapter chapter = chapterRepository.findById(request.getChapterId())
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

            // Calculate points based on new gamification rules
            int pointsToAward = calculatePointsToAward(user, chapter, request);
            System.out.println("DEBUG: Points to award: " + pointsToAward);

            // Save quiz attempt with calculated points
            QuizAttempt attempt = new QuizAttempt(
                user,
                chapter,
                pointsToAward,  // Use calculated points, not raw score
                request.getTotalQuestions(),
                request.getTotalPoints()
            );

            QuizAttempt saved = quizAttemptRepository.save(attempt);
            System.out.println("DEBUG: Quiz attempt saved! ID = " + saved.getId());

            // Update user progress
            updateUserProgress(user, chapter, request, pointsToAward);

            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to save quiz attempt: " + e.getMessage());
        }
    }

    // New method to calculate points based on rules
    private int calculatePointsToAward(User user, Chapter chapter, QuizAttemptRequest request) {
        double accuracy = (double) request.getScore() / request.getTotalPoints() * 100;
        System.out.println("DEBUG: Accuracy: " + accuracy + "%");

        // Check if user already has a passing attempt on THIS CHAPTER
        List<QuizAttempt> chapAttempts = quizAttemptRepository.findByUserIdAndChapterId(user.getId(), chapter.getId());

        boolean hasPassedThisChapter = chapAttempts.stream()
            .anyMatch(attempt -> {
                double attemptAccuracy = (double) attempt.getScore() / attempt.getTotalPoints() * 100;
                return attemptAccuracy >= 70;
            });

        if (hasPassedThisChapter && accuracy >= 70) {
            System.out.println("DEBUG: Already passed this chapter - no bonus points on retake");
            return 0;
        }

        if (accuracy >= 70) {
            System.out.println("DEBUG: PASS - Award full points");
            return request.getScore();
        } else if (accuracy >= 50) {
            System.out.println("DEBUG: FAIL (50-69%) - No points");
            return 0;
        } else {
            System.out.println("DEBUG: FAIL (<50%) - Deduct points");
            return -(request.getScore() / 2);
        }
    }

    // Get all quiz attempts for a user
    @GetMapping("/user")
    public ResponseEntity<List<QuizAttempt>> getUserAttempts(HttpServletRequest httpRequest) {
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
    @GetMapping("/user/chapter/{chapterId}")
    public ResponseEntity<List<QuizAttempt>> getChapterAttempts(@PathVariable Long chapterId, HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);
            List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdAndChapterId(userId, chapterId);
            return ResponseEntity.ok(attempts);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get a specific quiz attempt
    @GetMapping("/{id}")
    public ResponseEntity<QuizAttempt> getAttempt(@PathVariable Long id, HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            QuizAttempt attempt = quizAttemptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz attempt not found"));

            if (!attempt.getUser().getId().equals(Long.parseLong(userIdStr))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.ok(attempt);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Helper method to update user progress
    private void updateUserProgress(User user, Chapter chapter, QuizAttemptRequest request, int pointsToAward) {
        try {
            Long topicId = chapter.getTopic().getId();
            System.out.println("DEBUG: Updating progress for topic " + topicId);
            System.out.println("DEBUG: Points to add: " + pointsToAward);

            UserProgress progress = userProgressRepository.findByUserIdAndTopicId(user.getId(), topicId)
                .orElse(new UserProgress(user, chapter.getTopic()));

            double avgPointsPerQuestion = (double) request.getTotalPoints() / request.getTotalQuestions();
            int questionsCorrect = (int) Math.round(request.getScore() / avgPointsPerQuestion);

            // Calculate accuracy to determine if passed
            double accuracy = (double) request.getScore() / request.getTotalPoints() * 100;

            // Update progress with calculated points
            progress.setTotalPoints(progress.getTotalPoints() + pointsToAward);
            progress.setQuestionsAnswered(progress.getQuestionsAnswered() + request.getTotalQuestions());
            progress.setQuestionsCorrect(progress.getQuestionsCorrect() + questionsCorrect);
            progress.setLastStudied(LocalDateTime.now());

            userProgressRepository.save(progress);
            System.out.println("DEBUG: User progress updated! Total points now: " + progress.getTotalPoints());

        } catch (Exception e) {
            System.out.println("DEBUG: Failed to update user progress: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

// DTO for saving quiz attempts
class QuizAttemptRequest {
    private Long chapterId;
    private int score;
    private int totalQuestions;
    private int totalPoints;

    public Long getChapterId() {
        return chapterId;
    }

    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
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