package com.example.demo.repository;

import com.example.demo.model.BatchProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BatchProgressRepository extends JpaRepository<BatchProgress, Long> {

    // Find user's progress on a specific batch
    Optional<BatchProgress> findByUserIdAndBatchId(Long userId, Long batchId);

    // Find all batch progress for a user
    List<BatchProgress> findByUserIdOrderByBatchId(Long userId);

    // Find all mastered batches for a user
    List<BatchProgress> findByUserIdAndMasteredTrueOrderByCompletedDateDesc(Long userId);

    // Find all batch progress for a specific chapter for a user
    @Query("SELECT bp FROM BatchProgress bp WHERE bp.user.id = :userId AND bp.batch.chapter.id = :chapterId ORDER BY bp.batch.batchOrder ASC")
    List<BatchProgress> findByUserIdAndChapterId(@Param("userId") Long userId, @Param("chapterId") Long chapterId);

    // Check if user has mastered a batch
    @Query("SELECT CASE WHEN COUNT(bp) > 0 THEN true ELSE false END FROM BatchProgress bp WHERE bp.user.id = :userId AND bp.batch.id = :batchId AND bp.mastered = true")
    boolean hasUserMasteredBatch(@Param("userId") Long userId, @Param("batchId") Long batchId);

    // Find the first non-mastered batch for a chapter (what user should work on next)
    @Query("SELECT bp FROM BatchProgress bp WHERE bp.user.id = :userId AND bp.batch.chapter.id = :chapterId AND bp.mastered = false ORDER BY bp.batch.batchOrder ASC LIMIT 1")
    Optional<BatchProgress> findFirstNonMasteredBatchForChapter(@Param("userId") Long userId, @Param("chapterId") Long chapterId);
}