package com.example.demo.repository;

import com.example.demo.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findBySection_Id(Long sectionId); // Find all topics for a section ("_" = section.id, not the sectionId JSON property)
}