package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress", uniqueConstraints = {
  @UniqueConstraint(columnNames = {"user_id", "topic_id"})
})
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    private int totalPoints; // Sum of all quiz attempt scores for this topic
    private int questionsAnswered; // Total questions answered
    private int questionsCorrect; // Total questions answered correctly
    private LocalDateTime lastStudied;

    // Constructors
    public UserProgress() {}

    public UserProgress(User user, Topic topic) {
        this.user = user;
        this.topic = topic;
        this.totalPoints = 0;
        this.questionsAnswered = 0;
        this.questionsCorrect = 0;
        this.lastStudied = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }

    public int getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(int totalPoints) {
        this.totalPoints = totalPoints;
    }

    public int getQuestionsAnswered() {
        return questionsAnswered;
    }

    public void setQuestionsAnswered(int questionsAnswered) {
        this.questionsAnswered = questionsAnswered;
    }

    public int getQuestionsCorrect() {
        return questionsCorrect;
    }

    public void setQuestionsCorrect(int questionsCorrect) {
        this.questionsCorrect = questionsCorrect;
    }

    public LocalDateTime getLastStudied() {
        return lastStudied;
    }

    public void setLastStudied(LocalDateTime lastStudied) {
        this.lastStudied = lastStudied;
    }

    // Calculate accuracy percentage
    public double getAccuracyPercentage() {
        if (questionsAnswered == 0) return 0;
        return (double) questionsCorrect / questionsAnswered * 100;
    }

    // Check if user has mastered this topic (80%+ accuracy)
    public boolean isMastered() {
        return getAccuracyPercentage() >= 80;
    }
}