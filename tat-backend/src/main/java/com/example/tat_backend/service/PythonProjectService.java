package com.example.tat_backend.service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.springframework.stereotype.Service;

@Service
public class PythonProjectService {
    
    private final CommandExecutionService commandExecutionService;
    private final ProjectLogService projectLogService;

    public PythonProjectService(
            CommandExecutionService commandExecutionService,
            ProjectLogService projectLogService
    ) {
        this.commandExecutionService = commandExecutionService;
        this.projectLogService = projectLogService;
    }

    public void createPythonProject(
            Long projectId,
            String projectName,
            String projectPath
    ) {

        /*
         * Final project directory
         *
         * Example:
         *
         * T:\tat-demo\hello-python
         */
        File projectDirectory = new File(
                projectPath,
                projectName
        );

        try {

            /*
             * Create project directory
             */
            if (!projectDirectory.exists()) {

                boolean created =
                        projectDirectory.mkdirs();

                if (!created) {

                    throw new IOException(
                            "Unable to create project directory: "
                                    + projectDirectory.getAbsolutePath()
                    );
                }
            }

            String finalPath =
                    projectDirectory.getAbsolutePath();

            projectLogService.send(
                    projectId,
                    "Project directory created:"
            );

            projectLogService.send(
                    projectId,
                    finalPath
            );

            projectLogService.send(
                    projectId,
                    ""
            );


            /*
             * STEP 1
             * Check Python
             */
            projectLogService.send(
                    projectId,
                    "Checking Python installation..."
            );

            commandExecutionService.execute(
                    projectId,
                    finalPath,
                    "python --version"
            );


            /*
             * STEP 2
             * Create virtual environment
             */
            projectLogService.send(
                    projectId,
                    ""
            );

            projectLogService.send(
                    projectId,
                    "Creating Python virtual environment..."
            );

            commandExecutionService.execute(
                    projectId,
                    finalPath,
                    "python -m venv .venv"
            );


            /*
             * STEP 3
             * Create main.py
             */
            projectLogService.send(
                    projectId,
                    ""
            );

            projectLogService.send(
                    projectId,
                    "Creating main.py..."
            );

            createMainFile(
                    projectId,
                    projectDirectory
            );


            /*
             * STEP 4
             * Create requirements.txt
             */
            projectLogService.send(
                    projectId,
                    ""
            );

            projectLogService.send(
                    projectId,
                    "Creating requirements.txt..."
            );

            createRequirementsFile(
                    projectId,
                    projectDirectory
            );


            /*
             * STEP 5
             * Create .gitignore
             */
            projectLogService.send(
                    projectId,
                    ""
            );

            projectLogService.send(
                    projectId,
                    "Creating .gitignore..."
            );

            createGitIgnoreFile(
                    projectId,
                    projectDirectory
            );


            /*
             * Final success
             */
            projectLogService.send(
                    projectId,
                    ""
            );

            projectLogService.send(
                    projectId,
                    "✓ Python project created"
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Python project creation failed: "
                            + e.getMessage(),
                    e
            );
        }
    }


    /*
     * Create main.py
     */
    private void createMainFile(
            Long projectId,
            File projectDirectory
    ) throws IOException {

        File file =
                new File(
                        projectDirectory,
                        "main.py"
                );

        try (FileWriter writer =
                     new FileWriter(file)) {

            writer.write(
                    "def main():\n"
                    + "    print(\"Hello from TAT Python project!\")\n"
                    + "\n"
                    + "\n"
                    + "if __name__ == \"__main__\":\n"
                    + "    main()\n"
            );
        }

        projectLogService.send(
                projectId,
                "✓ main.py created"
        );
    }


    /*
     * Create requirements.txt
     */
    private void createRequirementsFile(
            Long projectId,
            File projectDirectory
    ) throws IOException {

        File file =
                new File(
                        projectDirectory,
                        "requirements.txt"
                );

        try (FileWriter writer =
                     new FileWriter(file)) {

            writer.write(
                    "# Add Python dependencies here\n"
            );
        }

        projectLogService.send(
                projectId,
                "✓ requirements.txt created"
        );
    }


    /*
     * Create .gitignore
     */
    private void createGitIgnoreFile(
            Long projectId,
            File projectDirectory
    ) throws IOException {

        File file =
                new File(
                        projectDirectory,
                        ".gitignore"
                );

        try (FileWriter writer =
                     new FileWriter(file)) {

            writer.write(
                    ".venv/\n"
                    + "__pycache__/\n"
                    + "*.pyc\n"
                    + ".env\n"
            );
        }

        projectLogService.send(
                projectId,
                "✓ .gitignore created"
        );
    }
}
