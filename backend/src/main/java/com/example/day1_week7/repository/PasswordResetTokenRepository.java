package com.example.day1_week7.repository;

import com.example.day1_week7.entities.PasswordResetToken;
import com.example.day1_week7.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

	Optional<PasswordResetToken> findFirstByUserAndIsUsedFalseOrderByCreatedAtDesc(User user);

}
