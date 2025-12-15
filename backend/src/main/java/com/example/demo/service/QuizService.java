package com.example.demo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuizService {

    private final QuizAttemptRepository quizAttemptRepository;
    private final UserRepository userRepository;
    private final ChapterRepository chapterRepository;
    private final QuizBatchRepository quizBatchRepository;
    private final BatchProgressRepository batchProgressRepository;
    private final UserProgressRepository userProgressRepository;
    private final ObjectMapper objectMapper;

    public QuizService(QuizAttemptRepository quizAttemptRepository,
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

    // ===== ANSWER VERIFICATION =====

    /**
     * Verify answers against correct answers from database
     */
    public int verifyAnswersAndCalculateScore(QuizBatch batch, List<List<Integer>> userAnswers) {
        if (batch == null || batch.getQuestions() == null || userAnswers == null) {
            return 0;
        }

        int score = 0;
        List<Question> questions = batch.getQuestions();

        for (int i = 0; i < userAnswers.size() && i < questions.size(); i++) {
            List<Integer> userAnswerArray = userAnswers.get(i);
            Question question = questions.get(i);

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

    /**
     * Calculate total possible points for a batch
     */
    public int calculateTotalPoints(QuizBatch batch) {
        if (batch == null || batch.getQuestions() == null) {
            return 0;
        }

        return batch.getQuestions().stream()
                .mapToInt(Question::getDifficulty)
                .sum();
    }

    // ===== POINTS CALCULATION =====

    /**
     * Calculate points to award based on accuracy and gamification rules:
     * - 80%+ accuracy: Full points
     * - 50-79% accuracy: 0 points
     * - <50% accuracy: Deduct half of total possible
     */
    public int calculatePointsToAward(int verifiedScore, int totalPoints, Long userId, Long batchId) {
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

    // ===== BATCH PROGRESS UPDATES =====

    /**
     * Update batch progress with verified score and increment attempt count
     */
    public void updateBatchProgress(Long userId, Long batchId, int verifiedScore, int totalPoints) {
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
            progress.setLastAttemptDate(LocalDateTime.now());

            progress.updateMastery();
            batchProgressRepository.save(progress);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ===== USER PROGRESS UPDATES =====

    /**
     * Update user progress for the topic based on all quiz attempts
     * Recalculates from all attempts to ensure accuracy
     */
    public void updateUserProgressForTopic(Long userId, Long chapterId) {
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
            UserProgress progress = userProgressRepository
                    .findByUserIdAndTopicId(userId, topicId)
                    .orElse(new UserProgress(user, chapter.getTopic()));

            // Recalculate progress based on ALL attempts for this topic
            List<QuizAttempt> topicAttempts = quizAttemptRepository.findByUserIdAndChapterIdOrderByAttemptDateDesc(userId, chapterId);

            int totalQuestionsAnswered = 0;
            int totalQuestionsCorrect = 0;
            int totalPointsAwarded = 0;

            for (QuizAttempt attempt : topicAttempts) {
                totalQuestionsAnswered += attempt.getTotalQuestions();
                totalQuestionsCorrect += countCorrectAnswersFromAttempt(attempt);
                totalPointsAwarded += attempt.getPointsAwarded();
            }

            // Update progress
            progress.setQuestionsAnswered(totalQuestionsAnswered);
            progress.setQuestionsCorrect(totalQuestionsCorrect);
            progress.setTotalPoints(totalPointsAwarded);
            progress.setLastStudied(LocalDateTime.now());

            userProgressRepository.save(progress);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Count how many questions were answered correctly by parsing stored answers
     */
    public int countCorrectAnswersFromAttempt(QuizAttempt attempt) {
        try {
            if (attempt.getUserAnswers() == null) {
                return 0;
            }

            List<List<Integer>> userAnswers = objectMapper.readValue(attempt.getUserAnswers(),
                new TypeReference<List<List<Integer>>>() {});

            QuizBatch batch = attempt.getBatch();
            if (batch == null || batch.getQuestions() == null) {
                return 0;
            }

            int correctCount = 0;
            List<Question> questions = batch.getQuestions();

            for (int i = 0; i < userAnswers.size() && i < questions.size(); i++) {
                List<Integer> userAnswerArray = userAnswers.get(i);
                Question question = questions.get(i);

                if (userAnswerArray != null &&
                    question.getCorrectAnswers() != null &&
                    userAnswerArray.size() == question.getCorrectAnswers().size() &&
                    userAnswerArray.stream().allMatch(answer -> question.getCorrectAnswers().contains(answer))) {
                    correctCount++;
                }
            }

            return correctCount;

        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
}