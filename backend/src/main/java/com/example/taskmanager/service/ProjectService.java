package com.example.taskmanager.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.taskmanager.model.Project;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.ProjectRepository;
import com.example.taskmanager.repository.UserRepository;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public Project createProject(Project project, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        project.setUser(user);
        return projectRepository.save(project);
    }

    public Page<Project> getProjectsByEmail(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return projectRepository.findByUser(user, pageable);
    }

    public Page<Project> getProjectsByEmailAndTitle(String email, String title, Pageable pageable) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return projectRepository.findByUserAndTitleContainingIgnoreCase(user, title, pageable);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public void deleteProject(Project project) {
        projectRepository.delete(project);
    }
}
