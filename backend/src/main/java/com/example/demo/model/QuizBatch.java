package com.example.demo.model;
import jakarta.persistence.FetchType;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "quiz_batches")
public class QuizBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    @JsonIgnore
    private Chapter chapter;

    private int difficulty; // 1=easy, 2=medium, 3=hard

    private int batchOrder; // 1st, 2nd, 3rd batch in sequence

    private String description; // Optional: "Easy Questions", "Medium Questions", etc.

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "batch_questions",
        joinColumns = @JoinColumn(name = "batch_id"),
        inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questions;

    // Constructors
    public QuizBatch() {}

    public QuizBatch(Chapter chapter, int difficulty, int batchOrder, String description) {
        this.chapter = chapter;
        this.difficulty = difficulty;
        this.batchOrder = batchOrder;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Chapter getChapter() {
        return chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }

    public int getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(int difficulty) {
        this.difficulty = difficulty;
    }

    public int getBatchOrder() {
        return batchOrder;
    }

    public void setBatchOrder(int batchOrder) {
        this.batchOrder = batchOrder;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}