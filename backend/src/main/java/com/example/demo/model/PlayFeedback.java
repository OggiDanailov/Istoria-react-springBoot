package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// Feedback from the test version of the game (/play): one rated round
@Entity
@Table(name = "play_feedback")
public class PlayFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 40)
    private String tester;

    @Column(length = 80)
    private String chapter;

    @Column(length = 120)
    private String game;

    @Column(name = "set_name", length = 200)
    private String setName;

    private Integer stars;

    private Integer mistakes;

    @Column(name = "in_test")
    private Boolean inTest;

    @Column(length = 300)
    private String tags;

    @Column(length = 2000)
    private String comment;

    @Column(length = 5)
    private String lang;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public String getTester() { return tester; }
    public void setTester(String tester) { this.tester = tester; }
    public String getChapter() { return chapter; }
    public void setChapter(String chapter) { this.chapter = chapter; }
    public String getGame() { return game; }
    public void setGame(String game) { this.game = game; }
    public String getSetName() { return setName; }
    public void setSetName(String setName) { this.setName = setName; }
    public Integer getStars() { return stars; }
    public void setStars(Integer stars) { this.stars = stars; }
    public Integer getMistakes() { return mistakes; }
    public void setMistakes(Integer mistakes) { this.mistakes = mistakes; }
    public Boolean getInTest() { return inTest; }
    public void setInTest(Boolean inTest) { this.inTest = inTest; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getLang() { return lang; }
    public void setLang(String lang) { this.lang = lang; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
