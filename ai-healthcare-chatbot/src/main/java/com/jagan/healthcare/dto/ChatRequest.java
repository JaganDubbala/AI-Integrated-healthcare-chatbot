package com.jagan.healthcare.dto;
import jakarta.validation.constraints.*;
public class ChatRequest { @NotBlank @Size(max=500) private String message; private String severity; public ChatRequest(){} public String getMessage(){return message;} public void setMessage(String v){message=v;} public String getSeverity(){return severity;} public void setSeverity(String v){severity=v;} }
