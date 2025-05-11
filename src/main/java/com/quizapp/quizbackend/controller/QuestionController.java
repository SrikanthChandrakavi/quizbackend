package com.quizapp.quizbackend.controller;

import com.quizapp.quizbackend.model.Question;
import com.quizapp.quizbackend.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionController {
    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping("/genres")
    public List<String> getGenres() {
        return questionRepository.findDistinctGenres();
    }

    @GetMapping("/genre/{genre}")
    public List<Question> getQuestionsByGenre(@PathVariable String genre) {
        return questionRepository.findByGenre(genre);
    }

    @PostMapping
    public Question createQuestion(@RequestBody Question question) {
        validateQuestion(question);
        return questionRepository.save(question);
    }

    @PutMapping("/{id}")
    public Question updateQuestion(@PathVariable Long id, @RequestBody Question updatedQuestion) {
        Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // Update the fields
        existingQuestion.setQuestionText(updatedQuestion.getQuestionText());
        existingQuestion.setOption1(updatedQuestion.getOption1());
        existingQuestion.setOption2(updatedQuestion.getOption2());
        existingQuestion.setOption3(updatedQuestion.getOption3());
        existingQuestion.setOption4(updatedQuestion.getOption4());
        existingQuestion.setCorrectAnswer(updatedQuestion.getCorrectAnswer());
        existingQuestion.setGenre(updatedQuestion.getGenre());

        validateQuestion(existingQuestion);
        return questionRepository.save(existingQuestion);
    }

    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionRepository.deleteById(id);
    }

    private void validateQuestion(Question question) {
        // Count non-empty options
        long nonEmptyOptions = Stream.of(
                question.getOption1(),
                question.getOption2(),
                question.getOption3(),
                question.getOption4()
        )
                .filter(option -> option != null && !option.isEmpty())
                .count();

        // Ensure at least 2 options are non-empty
        if (nonEmptyOptions < 2) {
            throw new IllegalArgumentException("A question must have at least 2 non-empty options.");
        }

        // Ensure correctAnswer matches one of the non-empty options
        String correctAnswer = question.getCorrectAnswer();
        if (correctAnswer == null || correctAnswer.isEmpty()) {
            throw new IllegalArgumentException("Correct answer cannot be empty.");
        }

        boolean isCorrectAnswerValid = Stream.of(
                question.getOption1(),
                question.getOption2(),
                question.getOption3(),
                question.getOption4()
        )
                .filter(option -> option != null && !option.isEmpty())
                .anyMatch(option -> option.equals(correctAnswer));

        if (!isCorrectAnswerValid) {
            throw new IllegalArgumentException("Correct answer must match one of the non-empty options.");
        }
    }
}