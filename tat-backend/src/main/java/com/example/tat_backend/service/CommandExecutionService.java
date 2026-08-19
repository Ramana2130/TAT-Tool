package com.example.tat_backend.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Service;

@Service
public class CommandExecutionService {
        private final ProjectLogService projectLogService;

    public CommandExecutionService(
            ProjectLogService projectLogService
    ) {
        this.projectLogService =
                projectLogService;
    }

    public void execute(
            Long projectId,
            String workingDirectory,
            String command
    ) {

        try {

            File directory =
                    new File(workingDirectory);

            /*
             * Check working directory.
             */
            if (!directory.exists()) {

                throw new IllegalArgumentException(
                        "Working directory does not exist: "
                                + workingDirectory
                );
            }

            if (!directory.isDirectory()) {

                throw new IllegalArgumentException(
                        "Working directory is not a directory: "
                                + workingDirectory
                );
            }

            /*
             * Show command.
             */
            projectLogService.send(
                    projectId,
                    "$ " + command
            );

            /*
             * Windows CMD.
             */
            ProcessBuilder processBuilder =
                    new ProcessBuilder(
                            "cmd.exe",
                            "/c",
                            command
                    );

            /*
             * IMPORTANT:
             *
             * Command runs from this folder.
             */
            processBuilder.directory(
                    directory
            );

            /*
             * Combine stdout + stderr.
             */
            processBuilder.redirectErrorStream(
                    true
            );

            /*
             * Start process.
             */
            Process process =
                    processBuilder.start();

            /*
             * Read live output.
             */
            try (
                    BufferedReader reader =
                            new BufferedReader(
                                    new InputStreamReader(
                                            process.getInputStream(),
                                            StandardCharsets.UTF_8
                                    )
                            )
            ) {

                String line;

                while (
                        (line = reader.readLine())
                                != null
                ) {

                    projectLogService.send(
                            projectId,
                            line
                    );
                }
            }

            /*
             * Wait for completion.
             */
            int exitCode =
                    process.waitFor();

            /*
             * Failed.
             */
            if (exitCode != 0) {

                throw new RuntimeException(
                        "Command failed with exit code: "
                                + exitCode
                );
            }

            /*
             * Success.
             */
            projectLogService.send(
                    projectId,
                    "✓ Command completed successfully"
            );

        } catch (Exception e) {

            projectLogService.send(
                    projectId,
                    "✗ " + e.getMessage()
            );

            throw new RuntimeException(
                    "Command execution failed: "
                            + e.getMessage(),
                    e
            );
        }
    }
}