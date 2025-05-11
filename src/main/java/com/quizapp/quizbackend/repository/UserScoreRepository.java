package com.quizapp.quizbackend.repository;

import com.quizapp.quizbackend.model.UserScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserScoreRepository extends JpaRepository<UserScore, Long> {
    List<UserScore> findByUserId(Long userId);
    List<UserScore> findByUserIdAndGenre(Long userId, String genre); // Method to fetch scores by user and genre
}