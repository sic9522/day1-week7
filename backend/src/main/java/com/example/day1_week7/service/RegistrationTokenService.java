package com.example.day1_week7.service;

import java.security.SecureRandom;
import java.time.Instant;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.day1_week7.entities.RegistrationToken;
import com.example.day1_week7.entities.User;
import com.example.day1_week7.exceptions.BadRequestException;
import com.example.day1_week7.repository.RegistrationTokenRepository;
import com.example.day1_week7.repository.UserRepository;

@Service
public class RegistrationTokenService {

	private static final SecureRandom RANDOM = new SecureRandom();

	private final RegistrationTokenRepository registrationTokenRepository;
	private final UserRepository userRepository;
	private final EmailService emailService;

	public RegistrationTokenService(RegistrationTokenRepository registrationTokenRepository,
			UserRepository userRepository, EmailService emailService) {
		this.registrationTokenRepository = registrationTokenRepository;
		this.userRepository = userRepository;
		this.emailService = emailService;
	}

	public RegistrationToken generateFor(User user) {
		RegistrationToken token = new RegistrationToken();
		token.setValue(String.format("%06d", RANDOM.nextInt(1_000_000)));
		token.setUser(user);
		token = registrationTokenRepository.save(token);

		emailService.send(user.getEmail(), "Conferma la tua registrazione",
			"Usa questo codice per confermare la registrazione: " + token.getValue());
		return token;
	}

	@Transactional
	public void confirm(String value) {
		RegistrationToken token = registrationTokenRepository.findByValueAndIsUsedFalse(value)
			.orElseThrow(() -> new BadRequestException("Token di registrazione non valido"));

		if (token.getExpireAt().isBefore(Instant.now())) {
			throw new BadRequestException("Token di registrazione scaduto");
		}

		User user = token.getUser();
		user.setVerification(true);
		userRepository.save(user);

		token.setUsed(true);
		registrationTokenRepository.save(token);
	}

}
