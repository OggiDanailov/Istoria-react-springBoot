package com.example.demo.repository;

import com.example.demo.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserId(Long userId);
    List<QuizAttempt> findByUserIdAndChapterId(Long userId, Long chapterId);
    List<QuizAttempt> findByUserIdOrderByAttemptDateDesc(Long userId);
}