package com.jagan.healthcare.dto;
import jakarta.validation.constraints.*;
public class AppointmentStatusRequest { @NotBlank @Size(max=30) private String status; public AppointmentStatusRequest(){} public String getStatus(){return status;} public void setStatus(String v){status=v;} }
