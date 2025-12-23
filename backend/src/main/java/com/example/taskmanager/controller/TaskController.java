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

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private ProjectService projectService;

    @PostMapping("/project/{projectId}")
    public Task createTask(@PathVariable Long projectId, @RequestBody Task task, java.security.Principal principal) {
        Project project = projectService.getProjectById(projectId);
        if (!project.getUser().getEmail().equals(principal.getName())) {
            throw new RuntimeException("Unauthorized access to project");
        }
        task.setProject(project);
        return taskService.createTask(task);
    }

    @GetMapping("/project/{projectId}")
    public Page<Task> getTasksByProject(
            @PathVariable Long projectId, 
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            java.security.Principal principal) {
        
        Project project = projectService.getProjectById(projectId);
        if (!project.getUser().getEmail().equals(principal.getName())) {
            throw new RuntimeException("Unauthorized access to project");
        }
        
        Pageable pageable = PageRequest.of(page, size);
        
        if ("completed".equals(status)) {
            return taskService.getTasksByProjectAndStatus(project, true, pageable);
        } else if ("active".equals(status)) {
            return taskService.getTasksByProjectAndStatus(project, false, pageable);
        }
        
        return taskService.getTasksByProject(project, pageable);
    }

    @PutMapping("/{taskId}/complete")
    public Task markTaskAsCompleted(@PathVariable Long taskId, java.security.Principal principal) {
        Task task = taskService.getTaskById(taskId);
        if (!task.getProject().getUser().getEmail().equals(principal.getName())) {
            throw new RuntimeException("Unauthorized access to task");
        }
        task.setCompleted(true);
        return taskService.updateTask(task);
    }

    @DeleteMapping("/{taskId}")
    public void deleteTask(@PathVariable Long taskId, java.security.Principal principal) {
        Task task = taskService.getTaskById(taskId);
        if (!task.getProject().getUser().getEmail().equals(principal.getName())) {
            throw new RuntimeException("Unauthorized access to task");
        }
        taskService.deleteTask(task);
    }

    @PutMapping("/{taskId}")
    public Task updateTask(@PathVariable Long taskId, @RequestBody Task taskDetails, java.security.Principal principal) {
        Task task = taskService.getTaskById(taskId);
        if (!task.getProject().getUser().getEmail().equals(principal.getName())) {
            throw new RuntimeException("Unauthorized access to task");
        }
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setDueDate(taskDetails.getDueDate());
        task.setCompleted(taskDetails.isCompleted());
        return taskService.updateTask(task);
    }
}
