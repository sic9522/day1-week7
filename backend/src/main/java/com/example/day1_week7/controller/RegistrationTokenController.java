package com.example.day1_week7.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.day1_week7.entities.RegistrationToken;
import com.example.day1_week7.exceptions.NotFoundException;
import com.example.day1_week7.repository.RegistrationTokenRepository;

@RestController
@RequestMapping("/api/registration-tokens")
public class RegistrationTokenController {

	private final RegistrationTokenRepository registrationTokenRepository;

	public RegistrationTokenController(RegistrationTokenRepository registrationTokenRepository) {
		this.registrationTokenRepository = registrationTokenRepository;
	}

	@GetMapping
	public List<RegistrationToken> getAll() {
		return registrationTokenRepository.findAll();
	}

	@GetMapping("/{id}")
	public RegistrationToken getById(@PathVariable UUID id) {
		return registrationTokenRepository.findById(id)
			.orElseThrow(() -> new NotFoundException("RegistrationToken con id " + id + " non trovato"));
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable UUID id) {
		registrationTokenRepository.delete(getById(id));
	}

}
