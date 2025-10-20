package com.example.demo.dto;

public class QuizAttemptRequest {
    private Long topicId;
    private int score;

    public QuizAttemptRequest() {}

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}