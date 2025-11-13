package com.example.demo.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    @JsonIgnore
    private Chapter chapter;

    @ManyToOne
    @JoinColumn(name = "batch_id")
    @JsonIgnore
    private QuizBatch batch; // NEW: Link to the batch

    private int score; // Points earned

    private int totalQuestions; // Total questions attempted

    private int totalPoints; // Total points possible

    private LocalDateTime attemptDate;

    private int pointsAwarded; // Points added/subtracted based on gamification rules

    // Constructors
    public QuizAttempt() {}

    public QuizAttempt(User user, Chapter chapter, int score, int totalQuestions, int totalPoints) {
        this.user = user;
        this.chapter = chapter;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.totalPoints = totalPoints;
        this.attemptDate = LocalDateTime.now();
    }

    public QuizAttempt(User user, Chapter chapter, QuizBatch batch, int score, int totalQuestions, int totalPoints) {
        this.user = user;
        this.chapter = chapter;
        this.batch = batch;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.totalPoints = totalPoints;
        this.attemptDate = LocalDateTime.now();
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

    public Chapter getChapter() {
        return chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }

    public QuizBatch getBatch() {
        return batch;
    }

    public void setBatch(QuizBatch batch) {
        this.batch = batch;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(int totalPoints) {
        this.totalPoints = totalPoints;
    }

    public LocalDateTime getAttemptDate() {
        return attemptDate;
    }

    public void setAttemptDate(LocalDateTime attemptDate) {
        this.attemptDate = attemptDate;
    }

    public int getPointsAwarded() {
        return pointsAwarded;
    }

    public void setPointsAwarded(int pointsAwarded) {
        this.pointsAwarded = pointsAwarded;
    }
}