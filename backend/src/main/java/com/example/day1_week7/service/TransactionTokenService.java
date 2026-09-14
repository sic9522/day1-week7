package com.example.day1_week7.service;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;

import org.springframework.stereotype.Service;

import com.example.day1_week7.entities.TransactionToken;
import com.example.day1_week7.entities.Transfer;
import com.example.day1_week7.exceptions.BadRequestException;
import com.example.day1_week7.repository.TransactionTokenRepository;

@Service
public class TransactionTokenService {

	private static final SecureRandom RANDOM = new SecureRandom();

	private final TransactionTokenRepository transactionTokenRepository;
	private final EmailService emailService;

	public TransactionTokenService(TransactionTokenRepository transactionTokenRepository, EmailService emailService) {
		this.transactionTokenRepository = transactionTokenRepository;
		this.emailService = emailService;
	}

	public TransactionToken generateFor(Transfer transfer) {
		TransactionToken token = new TransactionToken();
		token.setValue(BigDecimal.valueOf(RANDOM.nextInt(1_000_000)));
		token.setTransfer(transfer);
		token = transactionTokenRepository.save(token);

		emailService.send(transfer.getUser().getEmail(), "Codice di conferma bonifico",
			"Usa questo codice per confermare il bonifico di " + transfer.getAmount() + ": " + formatCode(token));
		return token;
	}

	public TransactionToken validate(Transfer transfer, String code) {
		TransactionToken token = transactionTokenRepository
			.findFirstByTransferAndIsUsedFalseOrderByCreatedAtDesc(transfer)
			.orElseThrow(() -> new BadRequestException("Nessun codice attivo per questo trasferimento"));

		if (token.getExpireAt().isBefore(Instant.now())) {
			throw new BadRequestException("Codice scaduto");
		}
		if (formatCode(token).equals(code.trim())) {
			token.setUsed(true);
			return transactionTokenRepository.save(token);
		}
		throw new BadRequestException("Codice non valido");
	}

	// Il valore è un BigDecimal 0-999999: qui lo formattiamo sempre a 6 cifre con
	// zero iniziali, così l'email e il confronto coincidono con l'input a 6 cifre del FE.
	private String formatCode(TransactionToken token) {
		return String.format("%06d", token.getValue().intValue());
	}

}
