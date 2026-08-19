package com.example.tat_backend.controller;

import java.io.IOException;
import java.util.List;
import java.util.function.Consumer;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.tat_backend.service.ProjectLogService;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectLogController {
    private final ProjectLogService projectLogService;

    public ProjectLogController(
            ProjectLogService projectLogService
    ) {
        this.projectLogService = projectLogService;
    }

    @GetMapping(
            value = "/{projectId}/logs",
            produces = MediaType.TEXT_EVENT_STREAM_VALUE
    )
    public SseEmitter streamLogs(
            @PathVariable Long projectId
    ) {

        SseEmitter emitter = new SseEmitter(0L);

        /*
         * 1. Send previous logs
         */
        List<String> history =
                projectLogService.getHistory(projectId);

        try {

            for (String message : history) {

                emitter.send(
                        SseEmitter.event()
                                .data(message)
                );
            }

        } catch (IOException e) {

            emitter.completeWithError(e);

            return emitter;
        }

        /*
         * 2. Create live log listener
         */
        Consumer<String> listener =
                (String message) -> {

                    try {

                        emitter.send(
                                SseEmitter.event()
                                        .data(message)
                        );

                    } catch (IOException e) {

                        emitter.completeWithError(e);
                    }
                };

        /*
         * 3. Subscribe to live logs
         */
        projectLogService.subscribe(
                projectId,
                listener
        );

        /*
         * 4. Remove listener when connection completes
         */
        emitter.onCompletion(() -> {

            projectLogService.unsubscribe(
                    projectId,
                    listener
            );
        });

        /*
         * 5. Remove listener when timeout occurs
         */
        emitter.onTimeout(() -> {

            projectLogService.unsubscribe(
                    projectId,
                    listener
            );

            emitter.complete();
        });

        /*
         * 6. Remove listener when error occurs
         */
        emitter.onError(
                throwable -> {

                    projectLogService.unsubscribe(
                            projectId,
                            listener
                    );
                }
        );

        return emitter;
    }
}
