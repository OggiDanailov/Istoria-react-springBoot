package com.example.demo.dto;

import java.util.List;

public class QuizAttemptRequest {
    private Long chapterId;
    private Long batchId;
    private List<Integer> userAnswers;  // ← Array of selected answer indices [0, 2, 1, 3, ...]

    public QuizAttemptRequest() {}

    // Getters and Setters
    public Long getChapterId() {
        return chapterId;
    }

    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
    }

    public Long getBatchId() {
        return batchId;
    }

    public void setBatchId(Long batchId) {
        this.batchId = batchId;
    }

    public List<Integer> getUserAnswers() {
        return userAnswers;
    }

    public void setUserAnswers(List<Integer> userAnswers) {
        this.userAnswers = userAnswers;
    }
}