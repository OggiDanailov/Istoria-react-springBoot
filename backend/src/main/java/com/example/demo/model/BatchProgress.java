package com.example.demo.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "batch_progress")
public class BatchProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "batch_id")
    private QuizBatch batch;

    private int bestScore; // Best score achieved on this batch

    private int totalPoints; // Total possible points for this batch

    private double accuracy; // Percentage (0-100)

    private boolean mastered; // true if accuracy >= 80%

    private int attemptCount; // How many times user attempted this batch

    private LocalDateTime completedDate; // When batch was mastered

    private LocalDateTime lastAttemptDate; // When last attempted

    // Constructors
    public BatchProgress() {}

    public BatchProgress(User user, QuizBatch batch) {
        this.user = user;
        this.batch = batch;
        this.bestScore = 0;
        this.totalPoints = 0;
        this.accuracy = 0.0;
        this.mastered = false;
        this.attemptCount = 0;
        this.lastAttemptDate = LocalDateTime.now();
    }

    // Helper method to check if mastered
    public void updateMastery() {
        this.accuracy = this.totalPoints > 0 ? (double) this.bestScore / this.totalPoints * 100 : 0;
        this.mastered = this.accuracy >= 80.0;
        if (this.mastered && this.completedDate == null) {
            this.completedDate = LocalDateTime.now();
        }
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

    public QuizBatch getBatch() {
        return batch;
    }

    public void setBatch(QuizBatch batch) {
        this.batch = batch;
    }

    public int getBestScore() {
        return bestScore;
    }

    public void setBestScore(int bestScore) {
        this.bestScore = bestScore;
    }

    public int getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(int totalPoints) {
        this.totalPoints = totalPoints;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public boolean isMastered() {
        return mastered;
    }

    public void setMastered(boolean mastered) {
        this.mastered = mastered;
    }

    public int getAttemptCount() {
        return attemptCount;
    }

    public void setAttemptCount(int attemptCount) {
        this.attemptCount = attemptCount;
    }

    public LocalDateTime getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(LocalDateTime completedDate) {
        this.completedDate = completedDate;
    }

    public LocalDateTime getLastAttemptDate() {
        return lastAttemptDate;
    }

    public void setLastAttemptDate(LocalDateTime lastAttemptDate) {
        this.lastAttemptDate = lastAttemptDate;
    }
}