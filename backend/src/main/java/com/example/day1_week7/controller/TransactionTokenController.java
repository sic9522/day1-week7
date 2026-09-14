package com.example.day1_week7.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.day1_week7.entities.TransactionToken;
import com.example.day1_week7.exceptions.NotFoundException;
import com.example.day1_week7.repository.TransactionTokenRepository;

@RestController
@RequestMapping("/api/transaction-tokens")
public class TransactionTokenController {

	private final TransactionTokenRepository transactionTokenRepository;

	public TransactionTokenController(TransactionTokenRepository transactionTokenRepository) {
		this.transactionTokenRepository = transactionTokenRepository;
	}

	@GetMapping
	public List<TransactionToken> getAll() {
		return transactionTokenRepository.findAll();
	}

	@GetMapping("/{id}")
	public TransactionToken getById(@PathVariable UUID id) {
		return transactionTokenRepository.findById(id)
			.orElseThrow(() -> new NotFoundException("TransactionToken con id " + id + " non trovato"));
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable UUID id) {
		transactionTokenRepository.delete(getById(id));
	}

}
