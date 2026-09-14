package com.example.day1_week7.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.day1_week7.entities.User;
import com.example.day1_week7.exceptions.BadRequestException;
import com.example.day1_week7.exceptions.NotFoundException;
import com.example.day1_week7.exceptions.UnauthorizedException;
import com.example.day1_week7.repository.UserRepository;
import com.example.day1_week7.security.JwtService;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final RegistrationTokenService registrationTokenService;
	private final PasswordResetTokenService passwordResetTokenService;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
			RegistrationTokenService registrationTokenService, PasswordResetTokenService passwordResetTokenService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.registrationTokenService = registrationTokenService;
		this.passwordResetTokenService = passwordResetTokenService;
	}

	// Accetta sia lo username che l'email come identificatore di login.
	public String login(String identifier, String rawPassword) {
		User user = userRepository.findByUsername(identifier)
			.or(() -> userRepository.findByEmail(identifier))
			.orElseThrow(() -> new UnauthorizedException("Credenziali non valide"));

		if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
			throw new UnauthorizedException("Credenziali non valide");
		}
		if (!user.isVerification()) {
			throw new BadRequestException("Devi prima verificare la tua email");
		}

		return jwtService.generateToken(user.getUsername());
	}

	public void resendCode(String email) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new NotFoundException("Utente non trovato"));

		if (user.isVerification()) {
			throw new BadRequestException("Utente già verificato");
		}
		registrationTokenService.generateFor(user);
	}

	// Risponde sempre 200 anche se l'email non esiste, per non rivelarne l'esistenza.
	public void forgotPassword(String email) {
		userRepository.findByEmail(email).ifPresent(passwordResetTokenService::generateFor);
	}

	public void resetPassword(String email, String code, String newPassword) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(() -> new BadRequestException("Codice non valido"));

		passwordResetTokenService.validate(user, code);

		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);
	}

}
