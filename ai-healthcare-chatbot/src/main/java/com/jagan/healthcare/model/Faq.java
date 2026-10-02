package com.jagan.healthcare.model;

import jakarta.persistence.*;

@Entity
@Table(name = "faqs")
public class Faq {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    private String keywords;

    public Faq() {}

    public Faq(String question, String answer, String keywords) {
        this.question = question;
        this.answer = answer;
        this.keywords = keywords;
    }

    public Long getId() { return id; }
    public String getQuestion() { return question; }
    public String getAnswer() { return answer; }
    public String getKeywords() { return keywords; }

    public void setId(Long id) { this.id = id; }
    public void setQuestion(String question) { this.question = question; }
    public void setAnswer(String answer) { this.answer = answer; }
    public void setKeywords(String keywords) { this.keywords = keywords; }
}
