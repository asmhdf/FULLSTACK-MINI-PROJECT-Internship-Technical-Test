package com.example.taskmanager.repository;

import com.example.taskmanager.model.Project;
import com.example.taskmanager.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findByUser(User user, Pageable pageable);
    Page<Project> findByUserAndTitleContainingIgnoreCase(User user, String title, Pageable pageable);
}
