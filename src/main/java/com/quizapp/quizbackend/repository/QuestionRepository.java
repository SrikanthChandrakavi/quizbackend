package com.quizapp.quizbackend.repository;

import com.quizapp.quizbackend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByAdminId(Long adminId);
    List<Question> findByAdminIdAndGenre(Long adminId, String genre);
    
    @Query("SELECT DISTINCT q.genre FROM Question q")
    List<String> findDistinctGenres();

    List<Question> findByGenre(String genre);

    @Query("SELECT DISTINCT q.genre FROM Question q WHERE q.adminId = :adminId")
    List<String> findDistinctGenreByAdminId(Long adminId);
}