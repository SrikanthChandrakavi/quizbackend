package com.quizapp.quizbackend.controller;

import com.quizapp.quizbackend.model.User;
import com.quizapp.quizbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    // Password validation pattern
    private static final String PASSWORD_PATTERN = 
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=\\[\\]{}|;:,.<>?])[A-Za-z\\d!@#$%^&*()_\\-+=\\[\\]{}|;:,.<>?]{8,}$";

    private boolean isValidPassword(String password) {
        return Pattern.matches(PASSWORD_PATTERN, password);
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body(null);
        }
        if (!isValidPassword(user.getPassword())) {
            return ResponseEntity.status(400).body(null);
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody User loginUser) {
        User user = userRepository.findByEmail(loginUser.getEmail());
        if (user == null || !user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.status(401).body(null);
        }
        if (!user.getRole().equals(loginUser.getRole())) {
            return ResponseEntity.status(403).body(null);
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    @GetMapping("/leaderboard")
    public List<User> getLeaderboard() {
        return userRepository.findAllByOrderByScoreDesc();
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setScore(updatedUser.getScore());
        return userRepository.save(user);
    }
}