package com.example.tat_backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.function.Consumer;

import org.springframework.stereotype.Service;

@Service
public class ProjectLogService {
      private static final int MAX_LOG_LINES = 500;

    /*
     * projectId -> previous terminal lines
     */
    private final Map<Long, List<String>> logHistory =
            new ConcurrentHashMap<>();

    /*
     * projectId -> connected frontend listeners
     */
    private final Map<Long, List<Consumer<String>>> listeners =
            new ConcurrentHashMap<>();


    public void send(
            Long projectId,
            String message
    ) {

        // Store temporarily in memory
        List<String> history =
                logHistory.computeIfAbsent(
                        projectId,
                        id -> new CopyOnWriteArrayList<>()
                );

        history.add(message);

        // Prevent unlimited memory usage
        if (history.size() > MAX_LOG_LINES) {
            history.remove(0);
        }

        // Send to connected terminals
        List<Consumer<String>> projectListeners =
                listeners.get(projectId);

        if (projectListeners == null) {
            return;
        }

        for (Consumer<String> listener :
                projectListeners) {

            try {
                listener.accept(message);
            } catch (Exception ignored) {
                // Client may have disconnected
            }
        }
    }


    public List<String> getHistory(
            Long projectId
    ) {

        return new ArrayList<>(
                logHistory.getOrDefault(
                        projectId,
                        List.of()
                )
        );
    }


    public void subscribe(
            Long projectId,
            Consumer<String> listener
    ) {

        listeners
                .computeIfAbsent(
                        projectId,
                        id -> new CopyOnWriteArrayList<>()
                )
                .add(listener);
    }


    public void unsubscribe(
            Long projectId,
            Consumer<String> listener
    ) {

        List<Consumer<String>> projectListeners =
                listeners.get(projectId);

        if (projectListeners == null) {
            return;
        }

        projectListeners.remove(listener);

        if (projectListeners.isEmpty()) {
            listeners.remove(projectId);
        }
    }
}
