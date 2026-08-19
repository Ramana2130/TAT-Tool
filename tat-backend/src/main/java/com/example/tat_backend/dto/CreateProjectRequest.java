package com.example.tat_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateProjectRequest {

    private String projectName;

    private String technologyName;

    private String projectPath;
}
