package com.example.demo.repository;

import com.example.demo.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    // Find all attempts by user, ordered by date descending
    List<QuizAttempt> findByUserIdOrderByAttemptDateDesc(Long userId);

    // Find all attempts by user for a specific chapter
    List<QuizAttempt> findByUserIdAndChapterIdOrderByAttemptDateDesc(Long userId, Long chapterId);

    // NEW: Find all attempts by user for a specific batch
    List<QuizAttempt> findByUserIdAndBatchIdOrderByAttemptDateDesc(Long userId, Long batchId);

    // Find attempts by user and chapter (for checking retakes)
    List<QuizAttempt> findByUserIdAndChapterId(Long userId, Long chapterId);

    // NEW: Find attempts by user and batch (for checking retakes on batch)
    List<QuizAttempt> findByUserIdAndBatchId(Long userId, Long batchId);
}