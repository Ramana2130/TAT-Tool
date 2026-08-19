package com.example.tat_backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor


public class ProjectResponse {
     
    private Long id;

    private String projectName;

    private String technologyName;

    private String projectPath;

    private String status;

    private LocalDateTime createdAt;
}
