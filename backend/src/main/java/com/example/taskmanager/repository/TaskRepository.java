package com.example.taskmanager.repository;

import com.example.taskmanager.model.Project;
import com.example.taskmanager.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByProject(Project project, Pageable pageable);
    Page<Task> findByProjectAndCompleted(Project project, boolean completed, Pageable pageable);
}
