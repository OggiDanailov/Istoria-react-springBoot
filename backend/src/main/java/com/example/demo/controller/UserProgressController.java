package com.example.demo.controller;

import com.example.demo.model.UserProgress;
import com.example.demo.model.User;
import com.example.demo.model.Topic;
import com.example.demo.model.Chapter;
import com.example.demo.model.QuizAttempt;
import com.example.demo.repository.QuizAttemptRepository;
import com.example.demo.repository.UserProgressRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.TopicRepository;
import com.example.demo.repository.ChapterRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.time.LocalDateTime;

@CrossOrigin(origins = {"http://localhost", "http://localhost:5173", "http://localhost:80"})
@RestController
@RequestMapping("/api/user-progress")
public class UserProgressController {

    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final ChapterRepository chapterRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public UserProgressController(UserProgressRepository userProgressRepository,
                                 UserRepository userRepository,
                                 TopicRepository topicRepository,
                                 ChapterRepository chapterRepository,
                                 QuizAttemptRepository quizAttemptRepository) {
        this.userProgressRepository = userProgressRepository;
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
        this.chapterRepository = chapterRepository;
        this.quizAttemptRepository = quizAttemptRepository;
    }

    // Get all progress for a user
    @GetMapping
    public ResponseEntity<List<UserProgress>> getUserProgress(HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);
            List<UserProgress> progress = userProgressRepository.findByUserIdOrderByLastStudiedDesc(userId);
            return ResponseEntity.ok(progress);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get progress for a specific topic
    @GetMapping("/topic/{topicId}")
    public ResponseEntity<UserProgress> getTopicProgress(@PathVariable Long topicId, HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);
            UserProgress progress = userProgressRepository.findByUserIdAndTopicId(userId, topicId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElse(null);
                    Topic topic = topicRepository.findById(topicId).orElse(null);
                    if (user == null || topic == null) {
                        return null;
                    }
                    return new UserProgress(user, topic);
                });

            return ResponseEntity.ok(progress);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update progress for a topic
    @PutMapping("/topic/{topicId}")
    public ResponseEntity<?> updateTopicProgress(@PathVariable Long topicId,
                                                 @RequestBody UserProgressUpdateRequest request,
                                                 HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

            UserProgress progress = userProgressRepository.findByUserIdAndTopicId(userId, topicId)
                .orElse(new UserProgress(user, topic));

            progress.setTotalPoints(progress.getTotalPoints() + request.getPointsEarned());
            progress.setQuestionsAnswered(progress.getQuestionsAnswered() + request.getQuestionsAnswered());
            progress.setQuestionsCorrect(progress.getQuestionsCorrect() + request.getQuestionsCorrect());
            progress.setLastStudied(LocalDateTime.now());

            UserProgress updated = userProgressRepository.save(progress);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update progress: " + e.getMessage());
        }
    }

    // Get mastered topics (80%+ accuracy)
    @GetMapping("/mastered")
    public ResponseEntity<List<UserProgress>> getMasteredTopics(HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);
            List<UserProgress> allProgress = userProgressRepository.findByUserId(userId);
            List<UserProgress> mastered = allProgress.stream()
                .filter(UserProgress::isMastered)
                .toList();

            return ResponseEntity.ok(mastered);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Check if user has passed a specific chapter
    @GetMapping("/chapter/{chapterId}/passed")
    public ResponseEntity<Boolean> hasPassedChapter(@PathVariable Long chapterId, HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);

            // Get the chapter to find its topic
            Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

            // Check if user has any passing attempt on this chapter
            List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdAndChapterId(userId, chapterId);

            boolean hasPassed = attempts.stream()
                .anyMatch(attempt -> {
                    double accuracy = (double) attempt.getScore() / attempt.getTotalPoints() * 100;
                    return accuracy >= 70;
                });

            return ResponseEntity.ok(hasPassed);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

// DTO for updating progress
class UserProgressUpdateRequest {
    private int pointsEarned;
    private int questionsAnswered;
    private int questionsCorrect;

    public int getPointsEarned() {
        return pointsEarned;
    }

    public void setPointsEarned(int pointsEarned) {
        this.pointsEarned = pointsEarned;
    }

    public int getQuestionsAnswered() {
        return questionsAnswered;
    }

    public void setQuestionsAnswered(int questionsAnswered) {
        this.questionsAnswered = questionsAnswered;
    }

    public int getQuestionsCorrect() {
        return questionsCorrect;
    }

    public void setQuestionsCorrect(int questionsCorrect) {
        this.questionsCorrect = questionsCorrect;
    }
}