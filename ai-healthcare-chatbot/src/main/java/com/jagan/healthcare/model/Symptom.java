package com.jagan.healthcare.model;

import jakarta.persistence.*;

@Entity
@Table(name = "symptoms")
public class Symptom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String symptomName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String guidance;

    private String keywords;

    public Symptom() {}

    public Symptom(String symptomName, String guidance, String keywords) {
        this.symptomName = symptomName;
        this.guidance = guidance;
        this.keywords = keywords;
    }

    public Long getId() { return id; }
    public String getSymptomName() { return symptomName; }
    public String getGuidance() { return guidance; }
    public String getKeywords() { return keywords; }

    public void setId(Long id) { this.id = id; }
    public void setSymptomName(String symptomName) { this.symptomName = symptomName; }
    public void setGuidance(String guidance) { this.guidance = guidance; }
    public void setKeywords(String keywords) { this.keywords = keywords; }
}
