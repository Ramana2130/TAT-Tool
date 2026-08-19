package com.example.tat_backend.service;

import org.springframework.stereotype.Service;

@Service
public class ReactProjectService {
     
    private final CommandExecutionService commandExecutionService;

    public ReactProjectService(
            CommandExecutionService commandExecutionService
    ) {
        this.commandExecutionService =
                commandExecutionService;
    }

    /*
     * ----------------------------------------
     * CREATE REACT PROJECT
     * ----------------------------------------
     *
     * projectPath = PARENT directory
     *
     * Example:
     *
     * T:\tat-demo
     */
    public void createReactProject(
            Long projectId,
            String projectName,
            String projectPath
    ) {

        String command =
                "npm create vite@latest "
                        + projectName
                        + " -- --template react";

        commandExecutionService.execute(
                projectId,
                projectPath,
                command
        );
    }


    /*
     * ----------------------------------------
     * INSTALL DEPENDENCIES
     * ----------------------------------------
     *
     * projectPath = FINAL project directory
     *
     * Example:
     *
     * T:\tat-demo\kalan
     */
    public void installDependencies(
            Long projectId,
            String projectName,
            String projectPath
    ) {

        commandExecutionService.execute(
                projectId,
                projectPath,
                "npm install"
        );
    }
}