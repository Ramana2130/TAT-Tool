package com.example.tat_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.tat_backend.dto.CreateProjectRequest;
import com.example.tat_backend.dto.ProjectResponse;
import com.example.tat_backend.service.ProjectService;
import com.example.tat_backend.service.UpdateProjectRequest;



@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
        private final ProjectService projectService;

    public ProjectController(
            ProjectService projectService
    ) {
        this.projectService =
                projectService;
    }


    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody CreateProjectRequest request
    ) {

        ProjectResponse response =
                projectService.createProject(
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {

        return ResponseEntity.ok(
                projectService.getAllProjects()
        );
    }

     @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable Long projectId
    ) {

        return ResponseEntity.ok(
                projectService.getProject(projectId)
        );
    }

    @PutMapping("/{projectId}")
        public ResponseEntity<ProjectResponse> updateProjectName(
        @PathVariable Long projectId,
        @RequestBody UpdateProjectRequest request
        ) {

        ProjectResponse response =
            projectService.updateProjectName(
                    projectId,
                    request.getProjectName()
            );

                return ResponseEntity.ok(response);
        }

        @DeleteMapping("/{projectId}")
public ResponseEntity<Void> deleteProject(
        @PathVariable Long projectId
) {

    projectService.deleteProject(projectId);

    return ResponseEntity.noContent().build();
}
}

       
