package com.example.taskmanager.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.taskmanager.model.Project;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Page<Task> getTasksByProject(Project project, Pageable pageable) {
        return taskRepository.findByProject(project, pageable);
    }

    public Page<Task> getTasksByProjectAndStatus(Project project, boolean completed, Pageable pageable) {
        return taskRepository.findByProjectAndCompleted(project, completed, pageable);
    }
    
    // Helper method for progress calculation without pagination
    public java.util.List<Task> getAllTasksByProject(Project project) {
         return taskRepository.findByProject(project, Pageable.unpaged()).getContent();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public void deleteTask(Task task) {
        taskRepository.delete(task);
    }

    public Task updateTask(Task task) {
        return taskRepository.save(task);
    }
}
