package com.example.demo.controller;

import com.example.demo.model.BatchProgress;
import com.example.demo.model.Chapter;
import com.example.demo.model.QuizBatch;
import com.example.demo.model.User;
import com.example.demo.model.Question;
import com.example.demo.repository.BatchProgressRepository;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.repository.QuizBatchRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/batches")
public class BatchController {

    private final QuizBatchRepository quizBatchRepository;
    private final BatchProgressRepository batchProgressRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    public BatchController(QuizBatchRepository quizBatchRepository,
                         BatchProgressRepository batchProgressRepository,
                         UserRepository userRepository,
                         QuestionRepository questionRepository) {
        this.quizBatchRepository = quizBatchRepository;
        this.batchProgressRepository = batchProgressRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
    }

    // ==================== POST METHODS ====================

    // Create a new batch for a chapter
    @PostMapping
    public ResponseEntity<QuizBatch> createBatch(
            @RequestBody CreateBatchRequest request) {
        try {
            Chapter chapter = new Chapter();
            chapter.setId(request.getChapterId());

            QuizBatch batch = new QuizBatch(
                    chapter,
                    request.getDifficulty(),
                    request.getBatchOrder(),
                    request.getDescription()
            );

            QuizBatch savedBatch = quizBatchRepository.save(batch);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBatch);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // Add questions to a batch
    @PostMapping("/{batchId}/questions")
    public ResponseEntity<QuizBatch> addQuestionsToBatch(
            @PathVariable Long batchId,
            @RequestBody AddQuestionsRequest request) {
        try {
            QuizBatch batch = quizBatchRepository.findById(batchId)
                    .orElseThrow(() -> new RuntimeException("Batch not found"));

            // Fetch questions from DB and add them to batch
            List<Question> questions = new java.util.ArrayList<>();
            for (Long questionId : request.getQuestionIds()) {
                Question question = questionRepository.findById(questionId)
                        .orElseThrow(() -> new RuntimeException("Question not found: " + questionId));
                questions.add(question);
            }

            batch.setQuestions(questions);
            QuizBatch savedBatch = quizBatchRepository.save(batch);
            return ResponseEntity.ok(savedBatch);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // ==================== GET METHODS ====================

    // Get all batches for a chapter
    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<QuizBatch>> getBatchesForChapter(@PathVariable Long chapterId) {
        try {
            List<QuizBatch> batches = quizBatchRepository.findByChapterIdOrderByBatchOrderAsc(chapterId);
            return ResponseEntity.ok(batches);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get user's progress for all batches in a chapter
    @GetMapping("/chapter/{chapterId}/progress")
    public ResponseEntity<List<BatchProgress>> getUserProgressForChapter(
            @PathVariable Long chapterId,
            HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);
            List<BatchProgress> progress = batchProgressRepository.findByUserIdAndChapterId(userId, chapterId);
            return ResponseEntity.ok(progress);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get a single batch by ID with its questions
    @GetMapping("/{batchId}")
    public ResponseEntity<QuizBatch> getBatchById(@PathVariable Long batchId) {
        try {
            QuizBatch batch = quizBatchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
            return ResponseEntity.ok(batch);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get user's progress on a specific batch
    @GetMapping("/{batchId}/progress")
    public ResponseEntity<BatchProgress> getUserBatchProgress(
            @PathVariable Long batchId,
            HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);
            BatchProgress progress = batchProgressRepository.findByUserIdAndBatchId(userId, batchId)
                    .orElse(null);
            return ResponseEntity.ok(progress);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Check if user has mastered a batch
    @GetMapping("/{batchId}/mastered")
    public ResponseEntity<Boolean> isBatchMastered(
            @PathVariable Long batchId,
            HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);
            boolean mastered = batchProgressRepository.hasUserMasteredBatch(userId, batchId);
            return ResponseEntity.ok(mastered);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get the next batch user should work on for a chapter
    @GetMapping("/chapter/{chapterId}/next")
    public ResponseEntity<QuizBatch> getNextBatch(
            @PathVariable Long chapterId,
            HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);

            // Find first non-mastered batch
            var nextProgress = batchProgressRepository.findFirstNonMasteredBatchForChapter(userId, chapterId);

            if (nextProgress.isPresent()) {
                return ResponseEntity.ok(nextProgress.get().getBatch());
            } else {
                // All batches mastered, return first batch (or null)
                List<QuizBatch> batches = quizBatchRepository.findByChapterIdOrderByBatchOrderAsc(chapterId);
                if (!batches.isEmpty()) {
                    return ResponseEntity.ok(batches.get(0));
                }
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get all batches for a chapter with user progress
    @GetMapping("/chapter/{chapterId}/full")
    public ResponseEntity<List<BatchWithProgressDTO>> getBatchesWithProgress(
            @PathVariable Long chapterId,
            HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);
            List<QuizBatch> batches = quizBatchRepository.findByChapterIdOrderByBatchOrderAsc(chapterId);

            List<BatchWithProgressDTO> result = batches.stream()
                    .map(batch -> {
                        var progress = batchProgressRepository.findByUserIdAndBatchId(userId, batch.getId())
                                .orElse(new BatchProgress(userRepository.findById(userId).orElse(null), batch));
                        return new BatchWithProgressDTO(batch, progress);
                    })
                    .toList();

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ==================== PUT METHODS ====================

    // Update batch progress (save attempt result)
    @PutMapping("/{batchId}/progress")
    public ResponseEntity<BatchProgress> updateBatchProgress(
            @PathVariable Long batchId,
            @RequestBody BatchProgressUpdateRequest request,
            HttpServletRequest httpRequest) {
        try {
            String userIdStr = (String) httpRequest.getAttribute("userId");
            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = Long.parseLong(userIdStr);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            QuizBatch batch = quizBatchRepository.findById(batchId)
                    .orElseThrow(() -> new RuntimeException("Batch not found"));

            // Get or create batch progress
            BatchProgress progress = batchProgressRepository.findByUserIdAndBatchId(userId, batchId)
                    .orElse(new BatchProgress(user, batch));

            // Update with new attempt
            if (request.getScore() > progress.getBestScore()) {
                progress.setBestScore(request.getScore());
            }
            progress.setTotalPoints(request.getTotalPoints());
            progress.setAttemptCount(progress.getAttemptCount() + 1);
            progress.setLastAttemptDate(java.time.LocalDateTime.now());

            // Recalculate mastery
            progress.updateMastery();

            BatchProgress updated = batchProgressRepository.save(progress);
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

}

// ==================== DTOs ====================

// DTO for creating a batch
class CreateBatchRequest {
    private Long chapterId;
    private int difficulty; // 1=easy, 2=medium, 3=hard
    private int batchOrder; // 1, 2, 3...
    private String description;

    public Long getChapterId() {
        return chapterId;
    }

    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
    }

    public int getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(int difficulty) {
        this.difficulty = difficulty;
    }

    public int getBatchOrder() {
        return batchOrder;
    }

    public void setBatchOrder(int batchOrder) {
        this.batchOrder = batchOrder;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

// DTO for adding questions to a batch
class AddQuestionsRequest {
    private List<Long> questionIds;

    public List<Long> getQuestionIds() {
        return questionIds;
    }

    public void setQuestionIds(List<Long> questionIds) {
        this.questionIds = questionIds;
    }
}

// DTO for updating batch progress
class BatchProgressUpdateRequest {
    private int score;
    private int totalPoints;

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(int totalPoints) {
        this.totalPoints = totalPoints;
    }
}

// DTO for returning batch with progress
class BatchWithProgressDTO {
    private QuizBatch batch;
    private BatchProgress progress;

    public BatchWithProgressDTO(QuizBatch batch, BatchProgress progress) {
        this.batch = batch;
        this.progress = progress;
    }

    public QuizBatch getBatch() {
        return batch;
    }

    public void setBatch(QuizBatch batch) {
        this.batch = batch;
    }

    public BatchProgress getProgress() {
        return progress;
    }

    public void setProgress(BatchProgress progress) {
        this.progress = progress;
    }
}