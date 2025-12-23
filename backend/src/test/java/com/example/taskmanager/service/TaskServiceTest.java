package com.example.taskmanager.service;

import com.example.taskmanager.model.Project;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTask_ShouldReturnSavedTask() {
        Task task = new Task();
        task.setTitle("Test Task");

        when(taskRepository.save(task)).thenReturn(task);

        Task created = taskService.createTask(task);

        assertNotNull(created);
        assertEquals("Test Task", created.getTitle());
        verify(taskRepository, times(1)).save(task);
    }

    @Test
    void getTasksByProject_ShouldReturnPage() {
        Project project = new Project();
        Task t1 = new Task();
        Task t2 = new Task();
        Pageable pageable = PageRequest.of(0, 6);
        Page<Task> page = new PageImpl<>(Arrays.asList(t1, t2));

        when(taskRepository.findByProject(project, pageable)).thenReturn(page);

        Page<Task> tasks = taskService.getTasksByProject(project, pageable);

        assertEquals(2, tasks.getContent().size());
    }

    @Test
    void getTaskById_ShouldReturnTask() {
        Long id = 1L;
        Task task = new Task();
        task.setId(id);

        when(taskRepository.findById(id)).thenReturn(Optional.of(task));

        Task found = taskService.getTaskById(id);

        assertEquals(id, found.getId());
    }
}
