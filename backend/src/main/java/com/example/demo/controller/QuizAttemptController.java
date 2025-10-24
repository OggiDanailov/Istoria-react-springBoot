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

    // Save a quiz attempt
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

            QuizAttempt attempt = new QuizAttempt(
                user,
                chapter,
                request.getScore(),
                request.getTotalQuestions(),
                request.getTotalPoints()
            );

            QuizAttempt saved = quizAttemptRepository.save(attempt);

            // Update user progress
            updateUserProgress(user, chapter, request);

            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to save quiz attempt: " + e.getMessage());
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
    private void updateUserProgress(User user, Chapter chapter, QuizAttemptRequest request) {
        try {
            Long topicId = chapter.getTopic().getId();

            UserProgress progress = userProgressRepository.findByUserIdAndTopicId(user.getId(), topicId)
                .orElse(new UserProgress(user, chapter.getTopic()));

            double avgPointsPerQuestion = (double) request.getTotalPoints() / request.getTotalQuestions();
            int questionsCorrect = (int) Math.round(request.getScore() / avgPointsPerQuestion);

            progress.setTotalPoints(progress.getTotalPoints() + request.getScore());
            progress.setQuestionsAnswered(progress.getQuestionsAnswered() + request.getTotalQuestions());
            progress.setQuestionsCorrect(progress.getQuestionsCorrect() + questionsCorrect);
            progress.setLastStudied(LocalDateTime.now());

            userProgressRepository.save(progress);

        } catch (Exception e) {
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