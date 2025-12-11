package com.example.demo.controller;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import com.example.demo.repository.UserProgressRepository;
import com.example.demo.dto.QuizAttemptRequest;
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
    private final UserProgressRepository userProgressRepository;
    private final ObjectMapper objectMapper;

    public QuizAttemptController(QuizAttemptRepository quizAttemptRepository,
                               UserRepository userRepository,
                               ChapterRepository chapterRepository,
                               QuizBatchRepository quizBatchRepository,
                               BatchProgressRepository batchProgressRepository,
                               UserProgressRepository userProgressRepository,
                               ObjectMapper objectMapper) {
        this.quizAttemptRepository = quizAttemptRepository;
        this.userRepository = userRepository;
        this.chapterRepository = chapterRepository;
        this.quizBatchRepository = quizBatchRepository;
        this.batchProgressRepository = batchProgressRepository;
        this.userProgressRepository = userProgressRepository;
        this.objectMapper = objectMapper;
    }

    // Save a quiz attempt with SERVER-SIDE answer verification
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

            // ===== VERIFY ANSWERS SERVER-SIDE =====
            int verifiedScore = verifyAnswersAndCalculateScore(batch, request.getUserAnswers());
            int totalPoints = calculateTotalPoints(batch);
            // ========================================

            // Create quiz attempt with VERIFIED score (not frontend's claimed score)
            QuizAttempt attempt = new QuizAttempt(user, chapter, batch,
                    verifiedScore, request.getUserAnswers().size(), totalPoints);

            String userAnswersJson = objectMapper.writeValueAsString(request.getUserAnswers());
                attempt.setUserAnswers(userAnswersJson);

            // Calculate points to award based on gamification rules
            int pointsToAward = calculatePointsToAward(verifiedScore, totalPoints, userId, request.getBatchId());
            attempt.setPointsAwarded(pointsToAward);

            // Save the attempt
            QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

            // If this is a batch attempt, update batch progress
            if (batch != null) {
                updateBatchProgressWithVerifiedScore(userId, batch.getId(), verifiedScore, totalPoints);
            }

            // Update user progress for the topic
            updateUserProgressForTopic(userId, request.getChapterId(),
                                    request.getUserAnswers().size(), verifiedScore);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedAttempt);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // Calculate points to award based on accuracy and gamification rules
    private int calculatePointsToAward(int verifiedScore, int totalPoints, Long userId, Long batchId) {
        // Check if batch already mastered (80%+)
        if (batchId != null) {
            var existingProgress = batchProgressRepository.findByUserIdAndBatchId(userId, batchId);
            if (existingProgress.isPresent() && existingProgress.get().isMastered()) {
                return 0;  // Already mastered, no more points
            }
        }

        // Calculate accuracy from verified score
        double accuracy = totalPoints > 0 ? (double) verifiedScore / totalPoints * 100 : 0;

        if (accuracy >= 80) {
            return verifiedScore;  // Full points
        } else if (accuracy >= 50) {
            return 0;  // No points
        } else {
            return -(totalPoints / 2);  // Deduct half
        }
    }

    // Update batch progress with verified score
    private void updateBatchProgressWithVerifiedScore(Long userId, Long batchId, int verifiedScore, int totalPoints) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            QuizBatch batch = quizBatchRepository.findById(batchId).orElse(null);

            if (user == null || batch == null) {
                return;
            }

            BatchProgress progress = batchProgressRepository.findByUserIdAndBatchId(userId, batchId)
                    .orElse(new BatchProgress(user, batch));

            // Update with verified score
            if (verifiedScore > progress.getBestScore()) {
                progress.setBestScore(verifiedScore);
            }
            progress.setTotalPoints(totalPoints);
            progress.setAttemptCount(progress.getAttemptCount() + 1);
            progress.setLastAttemptDate(java.time.LocalDateTime.now());

            progress.updateMastery();
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

    // ===== HELPER METHODS FOR ANSWER VERIFICATION =====

    // Verify answers against correct answers from database
    private int verifyAnswersAndCalculateScore(QuizBatch batch, List<List<Integer>> userAnswers) {
        if (batch == null || batch.getQuestions() == null || userAnswers == null) {
            return 0;
        }

        int score = 0;
        List<com.example.demo.model.Question> questions = batch.getQuestions();

        for (int i = 0; i < userAnswers.size() && i < questions.size(); i++) {
            List<Integer> userAnswerArray = userAnswers.get(i);
            com.example.demo.model.Question question = questions.get(i);

            // Check if user selected ALL correct answers and ONLY correct answers
            if (userAnswerArray != null &&
                question.getCorrectAnswers() != null &&
                userAnswerArray.size() == question.getCorrectAnswers().size() &&
                userAnswerArray.stream().allMatch(answer -> question.getCorrectAnswers().contains(answer))) {
                score += question.getDifficulty();
            }
        }

        return score;
    }

    // Calculate total possible points for a batch
    private int calculateTotalPoints(QuizBatch batch) {
        if (batch == null || batch.getQuestions() == null) {
            return 0;
        }

        return batch.getQuestions().stream()
                .mapToInt(com.example.demo.model.Question::getDifficulty)
                .sum();
    }
    // ===================================================

    // Update user progress for the topic when a quiz is attempted
        private void updateUserProgressForTopic(Long userId, Long chapterId, int questionCount, int correctCount) {
        try {

            Chapter chapter = chapterRepository.findById(chapterId).orElse(null);

            if (chapter == null || chapter.getTopic() == null) {
                return;
            }

            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return;
            }

            Long topicId = chapter.getTopic().getId();

            // Get or create user progress for this topic
            com.example.demo.model.UserProgress progress = userProgressRepository
                    .findByUserIdAndTopicId(userId, topicId)
                    .orElse(new com.example.demo.model.UserProgress(user, chapter.getTopic()));


            // Recalculate progress based on ALL attempts for this topic
            List<QuizAttempt> topicAttempts = quizAttemptRepository.findByUserIdAndChapterIdOrderByAttemptDateDesc(userId, chapterId);

            int totalQuestionsAnswered = 0;
            int totalQuestionsCorrect = 0;
            int totalPointsAwarded = 0;

            for (QuizAttempt attempt : topicAttempts) {
                totalQuestionsAnswered += attempt.getTotalQuestions();
                totalQuestionsCorrect += attempt.getScore();
                totalPointsAwarded += attempt.getPointsAwarded();
            }


            // Update progress
            progress.setQuestionsAnswered(totalQuestionsAnswered);
            progress.setQuestionsCorrect(totalQuestionsCorrect);
            progress.setTotalPoints(totalPointsAwarded);
            progress.setLastStudied(java.time.LocalDateTime.now());

            userProgressRepository.save(progress);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}