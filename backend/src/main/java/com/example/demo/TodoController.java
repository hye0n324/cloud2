package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend to access
public class TodoController {
    private final List<Todo> todos = new ArrayList<>();
    private final AtomicLong counter = new AtomicLong();

    public TodoController() {
        // Initial sample data
        todos.add(new Todo(counter.incrementAndGet(), "Learn Spring Boot", false));
        todos.add(new Todo(counter.incrementAndGet(), "Build Fullstack App", true));
    }

    @GetMapping
    public List<Todo> getAllTodos() {
        return todos;
    }

    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        todo.setId(counter.incrementAndGet());
        todos.add(todo);
        return todo;
    }

    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        for (Todo todo : todos) {
            if (todo.getId().equals(id)) {
                todo.setText(todoDetails.getText());
                todo.setCompleted(todoDetails.isCompleted());
                return todo;
            }
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todos.removeIf(todo -> todo.getId().equals(id));
    }
}
