package com.example.demo.model;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
import jakarta.persistence.FetchType;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chapter_id") // Changed from topic_id
    @JsonIgnore
    private Chapter chapter; // Changed from Topic to Chapter

    private String question;

    @ElementCollection
    @CollectionTable(name = "question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option")
    private List<String> options;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "question_correct_answers",
        joinColumns = @JoinColumn(name = "question_id")
    )
    @Column(name = "answer_index")
    private List<Integer> correctAnswers;

    private int difficulty;

    private String textReference;

    // Default constructor
    public Question() {}

    // Constructor
    public Question(String question, List<String> options, List<Integer> correctAnswers) {
        this.question = question;
        this.options = options;
        this.correctAnswers = correctAnswers;
        this.difficulty = 1; // Default to Easy
    }

    public String getTextReference() {
        return textReference;
    }

    public void setTextReference(String textReference) {
        this.textReference = textReference;
    }

    // Add getter and setter
    public int getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(int difficulty) {
        this.difficulty = difficulty;
    }

    // Getters
    public Long getId() { return id; }
    public Chapter getChapter() { return chapter; } // Changed
    public String getQuestion() { return question; }
    public List<String> getOptions() { return options; }
    public List<Integer> getCorrectAnswers() { return correctAnswers; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setChapter(Chapter chapter) { this.chapter = chapter; } // Changed
    public void setQuestion(String question) { this.question = question; }
    public void setOptions(List<String> options) { this.options = options; }
    public void setCorrectAnswers(List<Integer> correctAnswers) { this.correctAnswers = correctAnswers; }
}