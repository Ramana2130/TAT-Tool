package com.example.tat_backend.service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.tat_backend.dto.CreateProjectRequest;
import com.example.tat_backend.dto.ProjectResponse;
import com.example.tat_backend.model.Project;
import com.example.tat_backend.repository.ProjectRepository;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    private final ProjectCreationWorkerService
            projectCreationWorkerService;


    public ProjectService(
            ProjectRepository projectRepository,
            ProjectCreationWorkerService projectCreationWorkerService
    ) {

        this.projectRepository =
                projectRepository;

        this.projectCreationWorkerService =
                projectCreationWorkerService;
    }


    public ProjectResponse createProject(
            CreateProjectRequest request
    ) {

        validateRequest(request);


        String projectName =
                request.getProjectName().trim();

        String technologyName =
                request.getTechnologyName().trim();

        String projectPath =
                request.getProjectPath().trim();


        /*
         * MVP supports React JS only.
         */
      if (!technologyName.equalsIgnoreCase("React JS")
        && !technologyName.equalsIgnoreCase("Python")) {

    throw new IllegalArgumentException(
            "Currently only React JS and Python are supported"
    );
}


        /*
         * Check parent location.
         */
        File baseDirectory =
                new File(projectPath);


        if (!baseDirectory.exists()) {

            throw new IllegalArgumentException(
                    "Project location does not exist: "
                            + baseDirectory
            );
        }


        if (!baseDirectory.isDirectory()) {

            throw new IllegalArgumentException(
                    "Project location is not a directory: "
                            + baseDirectory
            );
        }


        /*
         * Final project folder.
         */
        File projectDirectory =
                new File(
                        baseDirectory,
                        projectName
                );


        if (projectDirectory.exists()) {

            throw new IllegalArgumentException(
                    "Project already exists: "
                            + projectDirectory
            );
        }


        /*
         * Create ONE database record.
         */
        Project project =
                new Project();


        project.setProjectName(
                projectName
        );

        project.setTechnologyName(
                technologyName
        );

        project.setProjectPath(
                projectDirectory.getAbsolutePath()
        );

        project.setStatus(
                "CREATING"
        );

        project.setCreatedAt(
                LocalDateTime.now()
        );


        Project savedProject =
                projectRepository.save(
                        project
                );


        /*
         * Start project creation
         * in background.
         *
         * HTTP does NOT wait for npm.
         */
        projectCreationWorkerService.createProject(
                savedProject
        );


        /*
         * Return immediately.
         */
        return mapToResponse(
                savedProject
        );
    }


    public List<ProjectResponse> getAllProjects() {

        return projectRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    private ProjectResponse mapToResponse(
            Project project
    ) {

        return new ProjectResponse(
                project.getId(),
                project.getProjectName(),
                project.getTechnologyName(),
                project.getProjectPath(),
                project.getStatus(),
                project.getCreatedAt()
        );
    }


    private void validateRequest(
            CreateProjectRequest request
    ) {

        if (request == null) {

            throw new IllegalArgumentException(
                    "Request cannot be empty"
            );
        }


        if (request.getProjectName() == null ||
                request.getProjectName().isBlank()) {

            throw new IllegalArgumentException(
                    "Project name is required"
            );
        }


        if (request.getTechnologyName() == null ||
                request.getTechnologyName().isBlank()) {

            throw new IllegalArgumentException(
                    "Technology name is required"
            );
        }


        if (request.getProjectPath() == null ||
                request.getProjectPath().isBlank()) {

            throw new IllegalArgumentException(
                    "Project path is required"
            );
        }
    }

/*
 * UPDATE PROJECT NAME
 */
public ProjectResponse updateProjectName(
        Long projectId,
        String newProjectName
) {

    if (newProjectName == null ||
            newProjectName.isBlank()) {

        throw new IllegalArgumentException(
                "Project name is required"
        );
    }

    String cleanName =
            newProjectName.trim();

    Project project =
            projectRepository.findById(projectId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Project not found: "
                                            + projectId
                            )
                    );

    /*
     * Don't allow duplicate names.
     */
    boolean exists =
            projectRepository
                    .existsByProjectNameAndIdNot(
                            cleanName,
                            projectId
                    );

    if (exists) {

        throw new IllegalArgumentException(
                "Project name already exists: "
                        + cleanName
        );
    }

    /*
     * IMPORTANT:
     *
     * At this stage this only changes
     * the database project name.
     */
    project.setProjectName(
            cleanName
    );

    Project updated =
            projectRepository.save(project);

    return mapToResponse(updated);
}

/*
 * DELETE PROJECT
 */
public void deleteProject(
        Long projectId
) {

    Project project =
            projectRepository.findById(projectId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Project not found: "
                                            + projectId
                            )
                    );

    /*
     * Don't delete while project is being created.
     */
    if ("CREATING".equalsIgnoreCase(
            project.getStatus()
    )) {

        throw new IllegalStateException(
                "Cannot delete a project while it is being created"
        );
    }

    projectRepository.delete(project);
}
public ProjectResponse getProject(
        Long projectId
) {

    Project project =
            projectRepository.findById(projectId)
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Project not found: "
                                            + projectId
                            )
                    );

    return mapToResponse(project);
}
}
