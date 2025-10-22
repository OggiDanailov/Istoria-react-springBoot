package com.example.demo.repository;

import com.example.demo.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByChapterId(Long chapterId);
    List<Question> findByChapterTopicId(Long topicId);

     // NEW: Get random questions for a topic
    @Query("SELECT q FROM Question q WHERE q.chapter.topic.id = :topicId ORDER BY FUNCTION('RAND')")
    List<Question> findRandomByTopicId(@Param("topicId") Long topicId);

    // NEW: Get random questions for a chapter
    @Query("SELECT q FROM Question q WHERE q.chapter.id = :chapterId ORDER BY FUNCTION('RAND')")
    List<Question> findRandomByChapterId(@Param("chapterId") Long chapterId);
}