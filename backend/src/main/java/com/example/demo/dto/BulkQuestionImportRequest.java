package com.example.demo.dto;

import java.util.List;

public class BulkQuestionImportRequest {
    private Long topicId;
    private Long chapterId;
    private List<QuestionImportData> questions;

    public BulkQuestionImportRequest() {}

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public Long getChapterId() {
        return chapterId;
    }

    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
    }

    public List<QuestionImportData> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionImportData> questions) {
        this.questions = questions;
    }

    // Inner class for individual question data
    public static class QuestionImportData {
        private String question;
        private List<String> options;
        private int correctAnswer;
        private int difficulty;
        private String textReference;

        public QuestionImportData() {}

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public List<String> getOptions() {
            return options;
        }

        public void setOptions(List<String> options) {
            this.options = options;
        }

        public int getCorrectAnswer() {
            return correctAnswer;
        }

        public void setCorrectAnswer(int correctAnswer) {
            this.correctAnswer = correctAnswer;
        }

        public int getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(int difficulty) {
            this.difficulty = difficulty;
        }

        public String getTextReference() {
            return textReference;
        }

        public void setTextReference(String textReference) {
            this.textReference = textReference;
        }
    }
}