package com.example.taskmanager.service;

import com.example.taskmanager.model.Project;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.ProjectRepository;
import com.example.taskmanager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.List;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectService projectService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createProject_ShouldReturnSavedProject() {
        String email = "test@example.com";
        User user = new User();
        user.setEmail(email);

        Project project = new Project();
        project.setTitle("New Project");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        Project created = projectService.createProject(project, email);

        assertNotNull(created);
        assertEquals("New Project", created.getTitle());
        verify(userRepository, times(1)).findByEmail(email);
        verify(projectRepository, times(1)).save(project);
    }

    @Test
    void getProjectsByEmail_ShouldReturnPage() {
        String email = "test@example.com";
        User user = new User();
        Project p1 = new Project();
        Project p2 = new Project();
        Pageable pageable = PageRequest.of(0, 6);
        Page<Project> page = new PageImpl<>(Arrays.asList(p1, p2));

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(projectRepository.findByUser(user, pageable)).thenReturn(page);

        Page<Project> projects = projectService.getProjectsByEmail(email, pageable);

        assertEquals(2, projects.getContent().size());
    }
}
