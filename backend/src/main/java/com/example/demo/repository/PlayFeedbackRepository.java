package com.example.demo.repository;

import com.example.demo.model.PlayFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlayFeedbackRepository extends JpaRepository<PlayFeedback, Long> {
    List<PlayFeedback> findAllByOrderByCreatedAtDesc();
}
