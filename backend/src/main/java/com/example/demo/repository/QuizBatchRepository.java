package com.example.demo.repository;

import com.example.demo.model.QuizBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizBatchRepository extends JpaRepository<QuizBatch, Long> {

    // Find all batches for a specific chapter, ordered by batch order
    List<QuizBatch> findByChapterIdOrderByBatchOrderAsc(Long chapterId);

    // Find a specific batch by chapter and difficulty
    QuizBatch findByChapterIdAndDifficulty(Long chapterId, int difficulty);

    // Find all batches for a chapter with specific difficulty
    List<QuizBatch> findByChapterIdAndDifficultyOrderByBatchOrderAsc(Long chapterId, int difficulty);
}