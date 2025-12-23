package com.example.taskmanager.controller;

import com.example.taskmanager.model.Project;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.service.ProjectService;
import com.example.taskmanager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TaskService taskService;

    @PostMapping
    public Project createProject(@jakarta.validation.Valid @RequestBody Project project, java.security.Principal principal) {
        String email = principal.getName();
        return projectService.createProject(project, email);
    }

    @GetMapping
    public Page<Project> getAllProjects(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            java.security.Principal principal) {
        
        String email = principal.getName();
        Pageable pageable = PageRequest.of(page, size);
        
        if (search != null && !search.isEmpty()) {
            return projectService.getProjectsByEmailAndTitle(email, search, pageable);
        }
        return projectService.getProjectsByEmail(email, pageable);
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id, java.security.Principal principal) {
        Project project = projectService.getProjectById(id);
        if (!project.getUser().getEmail().equals(principal.getName())) {
            throw new RuntimeException("Unauthorized access to project");
        }
        return project;
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id, java.security.Principal principal) {
        Project project = projectService.getProjectById(id);
        if (!project.getUser().getEmail().equals(principal.getName())) {
            throw new RuntimeException("Unauthorized access to project");
        }
        projectService.deleteProject(project);
    }

    @GetMapping("/{id}/progress")
    public Map<String, Object> getProjectProgress(@PathVariable Long id, java.security.Principal principal) {
        Project project = projectService.getProjectById(id);
        if (!project.getUser().getEmail().equals(principal.getName())) {
            throw new RuntimeException("Unauthorized access to project");
        }
        // Use the non-paginated method for progress calculation
        List<Task> tasks = taskService.getAllTasksByProject(project);

        long total = tasks.size();
        long completed = tasks.stream().filter(Task::isCompleted).count();
        double progress = total == 0 ? 0 : (completed * 100.0 / total);

        return Map.of(
                "totalTasks", total,
                "completedTasks", completed,
                "progressPercentage", progress
        );
    }
}
