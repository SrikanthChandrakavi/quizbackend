package com.quizapp.quizbackend.controller;

import com.quizapp.quizbackend.model.UserScore;
import com.quizapp.quizbackend.repository.QuestionRepository;
import com.quizapp.quizbackend.repository.UserScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = "http://localhost:5173")
public class UserScoreController {
    @Autowired
    private UserScoreRepository userScoreRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping("/user/{userId}")
    public List<UserScore> getScoresByUser(@PathVariable Long userId) {
        return userScoreRepository.findByUserId(userId);
    }

    @GetMapping("/user/{userId}/genre/{genre}")
    public List<UserScore> getScoresByUserAndGenre(@PathVariable Long userId, @PathVariable String genre) {
        return userScoreRepository.findByUserIdAndGenre(userId, genre);
    }

    @PostMapping
    public UserScore saveScore(@RequestBody UserScore userScore) {
        // Fetch the question to get its genre
        var question = questionRepository.findById(userScore.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));
        userScore.setGenre(question.getGenre());
        return userScoreRepository.save(userScore);
    }
}