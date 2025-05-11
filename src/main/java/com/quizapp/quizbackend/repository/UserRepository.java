package com.quizapp.quizbackend.repository;

import com.quizapp.quizbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email); // Likely already exists for login

    // Fetch all users, ordered by score descending
    List<User> findAllByOrderByScoreDesc();
}