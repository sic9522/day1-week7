package com.example.day1_week7.service;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.day1_week7.entities.User;
import com.example.day1_week7.exceptions.BadRequestException;
import com.example.day1_week7.exceptions.NotFoundException;
import com.example.day1_week7.payloads.request.NewUserDTO;
import com.example.day1_week7.repository.UserRepository;

@Service
public class UserService {

	private static final SecureRandom RANDOM = new SecureRandom();

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final RegistrationTokenService registrationTokenService;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
			RegistrationTokenService registrationTokenService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.registrationTokenService = registrationTokenService;
	}

	public List<User> findAll() {
		return userRepository.findAll();
	}

	public User findById(UUID id) {
		return userRepository.findById(id)
			.orElseThrow(() -> new NotFoundException("Utente con id " + id + " non trovato"));
	}

	public User findByUsername(String username) {
		return userRepository.findByUsername(username)
			.orElseThrow(() -> new NotFoundException("Utente non trovato"));
	}

	public User register(NewUserDTO dto) {
		if (userRepository.existsByEmail(dto.getEmail())) {
			throw new BadRequestException("Email già in uso");
		}
		if (userRepository.existsByUsername(dto.getUsername())) {
			throw new BadRequestException("Username già in uso");
		}

		User user = new User();
		user.setNome(dto.getNome());
		user.setCognome(dto.getCognome());
		user.setUsername(dto.getUsername());
		user.setEmail(dto.getEmail());
		user.setPassword(passwordEncoder.encode(dto.getPassword()));
		user.setBalance(dto.getBalance());
		user.setIban(generateIban());
		user.setVerification(false);
		user = userRepository.save(user);

		registrationTokenService.generateFor(user);
		return user;
	}

	public User update(UUID id, NewUserDTO dto) {
		User user = findById(id);
		user.setNome(dto.getNome());
		user.setCognome(dto.getCognome());
		user.setUsername(dto.getUsername());
		user.setEmail(dto.getEmail());
		user.setPassword(passwordEncoder.encode(dto.getPassword()));
		user.setBalance(dto.getBalance());
		return userRepository.save(user);
	}

	public void delete(UUID id) {
		userRepository.delete(findById(id));
	}

	public void confirmRegistration(String token) {
		registrationTokenService.confirm(token);
	}

	private String generateIban() {
		String iban;
		do {
			StringBuilder digits = new StringBuilder();
			for (int i = 0; i < 24; i++) {
				digits.append(RANDOM.nextInt(10));
			}
			iban = "IT" + digits;
		} while (userRepository.existsByIban(iban));
		return iban;
	}

}
