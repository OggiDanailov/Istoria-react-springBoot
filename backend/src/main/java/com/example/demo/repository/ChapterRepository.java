package com.example.demo.repository;

import com.example.demo.model.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByTopicId(Long topicId); // Find all chapters for a topic
}