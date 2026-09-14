package com.example.day1_week7.service;

import java.security.SecureRandom;
import java.time.Instant;

import org.springframework.stereotype.Service;

import com.example.day1_week7.entities.PasswordResetToken;
import com.example.day1_week7.entities.User;
import com.example.day1_week7.exceptions.BadRequestException;
import com.example.day1_week7.repository.PasswordResetTokenRepository;

@Service
public class PasswordResetTokenService {

	private static final SecureRandom RANDOM = new SecureRandom();

	private final PasswordResetTokenRepository passwordResetTokenRepository;
	private final EmailService emailService;

	public PasswordResetTokenService(PasswordResetTokenRepository passwordResetTokenRepository,
			EmailService emailService) {
		this.passwordResetTokenRepository = passwordResetTokenRepository;
		this.emailService = emailService;
	}

	public PasswordResetToken generateFor(User user) {
		PasswordResetToken token = new PasswordResetToken();
		token.setValue(String.format("%06d", RANDOM.nextInt(1_000_000)));
		token.setUser(user);
		token = passwordResetTokenRepository.save(token);

		emailService.send(user.getEmail(), "Codice per reimpostare la password",
			"Usa questo codice per reimpostare la password del tuo account SicBank: " + token.getValue());
		return token;
	}

	public void validate(User user, String code) {
		PasswordResetToken token = passwordResetTokenRepository
			.findFirstByUserAndIsUsedFalseOrderByCreatedAtDesc(user)
			.orElseThrow(() -> new BadRequestException("Codice non valido"));

		if (token.getExpireAt().isBefore(Instant.now())) {
			throw new BadRequestException("Codice scaduto");
		}
		if (!token.getValue().equals(code.trim())) {
			throw new BadRequestException("Codice non valido");
		}

		token.setUsed(true);
		passwordResetTokenRepository.save(token);
	}

}
