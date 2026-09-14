package com.example.day1_week7.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.day1_week7.entities.Transfer;
import com.example.day1_week7.entities.TransferResult;
import com.example.day1_week7.entities.User;
import com.example.day1_week7.exceptions.BadRequestException;
import com.example.day1_week7.exceptions.NotFoundException;
import com.example.day1_week7.payloads.request.NewTransferDTO;
import com.example.day1_week7.repository.TransferRepository;
import com.example.day1_week7.repository.UserRepository;

@Service
public class TransferService {

	private final TransferRepository transferRepository;
	private final UserRepository userRepository;
	private final TransactionTokenService transactionTokenService;

	public TransferService(TransferRepository transferRepository, UserRepository userRepository,
			TransactionTokenService transactionTokenService) {
		this.transferRepository = transferRepository;
		this.userRepository = userRepository;
		this.transactionTokenService = transactionTokenService;
	}

	public List<Transfer> findAllForUsername(String username) {
		User user = userRepository.findByUsername(username)
			.orElseThrow(() -> new NotFoundException("Utente non trovato"));
		return transferRepository.findBySourceIbanOrDestinationIban(user.getIban(), user.getIban());
	}

	public Transfer findById(UUID id) {
		return transferRepository.findById(id)
			.orElseThrow(() -> new NotFoundException("Transfer con id " + id + " non trovato"));
	}

	public Transfer create(NewTransferDTO dto) {
		User source = userRepository.findByIban(dto.getSourceIban())
			.orElseThrow(() -> new NotFoundException("Iban di partenza non trovato"));
		userRepository.findByIban(dto.getDestinationIban())
			.orElseThrow(() -> new NotFoundException("Iban di destinazione non trovato"));

		if (source.getBalance().compareTo(dto.getAmount()) < 0) {
			throw new BadRequestException("Importo superiore al saldo disponibile");
		}

		Transfer transfer = new Transfer();
		transfer.setAmount(dto.getAmount());
		transfer.setSourceIban(dto.getSourceIban());
		transfer.setDestinationIban(dto.getDestinationIban());
		transfer.setUser(source);
		transfer.setResult(TransferResult.WAITING);
		transfer = transferRepository.save(transfer);

		transactionTokenService.generateFor(transfer);
		return transfer;
	}

	@Transactional
	public Transfer confirm(UUID id, String code) {
		Transfer transfer = findById(id);
		if (transfer.getResult() != TransferResult.WAITING) {
			throw new BadRequestException("Trasferimento già gestito");
		}

		transactionTokenService.validate(transfer, code);

		User source = userRepository.findByIban(transfer.getSourceIban())
			.orElseThrow(() -> new NotFoundException("Iban di partenza non trovato"));
		User destination = userRepository.findByIban(transfer.getDestinationIban())
			.orElseThrow(() -> new NotFoundException("Iban di destinazione non trovato"));

		if (source.getBalance().compareTo(transfer.getAmount()) < 0) {
			transfer.setResult(TransferResult.REJECT);
			return transferRepository.save(transfer);
		}

		source.setBalance(source.getBalance().subtract(transfer.getAmount()));
		destination.setBalance(destination.getBalance().add(transfer.getAmount()));
		userRepository.save(source);
		userRepository.save(destination);

		transfer.setResult(TransferResult.SUCCESS);
		return transferRepository.save(transfer);
	}

	public Transfer reject(UUID id) {
		Transfer transfer = findById(id);
		if (transfer.getResult() != TransferResult.WAITING) {
			throw new BadRequestException("Trasferimento già gestito");
		}
		transfer.setResult(TransferResult.REJECT);
		return transferRepository.save(transfer);
	}

	public void delete(UUID id) {
		transferRepository.delete(findById(id));
	}

}
