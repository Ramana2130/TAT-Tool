package com.example.tat_backend.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.tat_backend.model.Project;
import com.example.tat_backend.repository.ProjectRepository;

@Service
public class ProjectCreationWorkerService {
       private final ProjectRepository projectRepository;

    private final ReactProjectService reactProjectService;

    private final PythonProjectService pythonProjectService;

    private final ProjectLogService projectLogService;


    public ProjectCreationWorkerService(
            ProjectRepository projectRepository,
            ReactProjectService reactProjectService,
            PythonProjectService pythonProjectService,
            ProjectLogService projectLogService
    ) {

        this.projectRepository =
                projectRepository;

        this.reactProjectService =
                reactProjectService;

        this.pythonProjectService =
                pythonProjectService;

        this.projectLogService =
                projectLogService;
    }


    @Async("projectTaskExecutor")
    public void createProject(
            Project project
    ) {

        Long projectId =
                project.getId();

        String projectName =
                project.getProjectName();

        String technologyName =
                project.getTechnologyName();

        String projectPath =
                project.getProjectPath();


        try {

            /*
             * Terminal header
             */
            projectLogService.send(
                    projectId,
                    ""
            );

            projectLogService.send(
                    projectId,
                    "TAT Project Creation"
            );

            projectLogService.send(
                    projectId,
                    "========================"
            );

            projectLogService.send(
                    projectId,
                    ""
            );

            projectLogService.send(
                    projectId,
                    "Technology: " + technologyName
            );

            projectLogService.send(
                    projectId,
                    "Project: " + projectName
            );

            projectLogService.send(
                    projectId,
                    "Location: " + projectPath
            );

            projectLogService.send(
                    projectId,
                    ""
            );


            /*
             * React
             */
            if (technologyName.equalsIgnoreCase("React JS")) {

                projectLogService.send(
                        projectId,
                        "Creating React project..."
                );

                reactProjectService.createReactProject(
                        projectId,
                        projectName,
                        getParentPath(projectPath)
                );

                projectLogService.send(
                        projectId,
                        ""
                );

                projectLogService.send(
                        projectId,
                        "✓ React project created"
                );

                projectLogService.send(
                        projectId,
                        ""
                );

                projectLogService.send(
                        projectId,
                        "Installing dependencies..."
                );

                reactProjectService.installDependencies(
                        projectId,
                        projectName,
                        getParentPath(projectPath)
                );

                projectLogService.send(
                        projectId,
                        ""
                );

                projectLogService.send(
                        projectId,
                        "✓ Dependencies installed"
                );
            }


            /*
             * Python
             */
            else if (technologyName.equalsIgnoreCase("Python")) {

                projectLogService.send(
                        projectId,
                        "Creating Python project..."
                );

                pythonProjectService.createPythonProject(
                        projectId,
                        projectName,
                        getParentPath(projectPath)
                );
            }


            /*
             * Unsupported
             */
            else {

                throw new IllegalArgumentException(
                        "Unsupported technology: "
                                + technologyName
                );
            }


            /*
             * SUCCESS
             */
            project.setStatus(
                    "CREATED"
            );

            projectRepository.save(
                    project
            );


            projectLogService.send(
                    projectId,
                    ""
            );

            projectLogService.send(
                    projectId,
                    "================================"
            );

            projectLogService.send(
                    projectId,
                    "✓ PROJECT CREATED SUCCESSFULLY"
            );

            projectLogService.send(
                    projectId,
                    "================================"
            );

            projectLogService.send(
                    projectId,
                    ""
            );

            projectLogService.send(
                    projectId,
                    "Location:"
            );

            projectLogService.send(
                    projectId,
                    projectPath
            );


        } catch (Exception e) {

            project.setStatus(
                    "FAILED"
            );

            projectRepository.save(
                    project
            );


            projectLogService.send(
                    projectId,
                    ""
            );

            projectLogService.send(
                    projectId,
                    "✗ PROJECT CREATION FAILED"
            );

            projectLogService.send(
                    projectId,
                    ""
            );

            projectLogService.send(
                    projectId,
                    e.getMessage()
            );
        }
    }


    /*
     * ProjectService stores the final project path.
     *
     * Example:
     *
     * T:\tat-demo\hello
     *
     * For the React/Python services we need:
     *
     * T:\tat-demo
     */
    private String getParentPath(
            String projectPath
    ) {

        java.io.File projectDirectory =
                new java.io.File(projectPath);

        java.io.File parent =
                projectDirectory.getParentFile();

        if (parent == null) {

            throw new IllegalArgumentException(
                    "Invalid project path: "
                            + projectPath
            );
        }

        return parent.getAbsolutePath();
    }
}