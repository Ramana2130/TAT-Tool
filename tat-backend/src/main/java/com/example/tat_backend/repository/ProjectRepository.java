package com.example.tat_backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.tat_backend.model.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    boolean existsByProjectNameAndIdNot(String projectName,Long id );
}