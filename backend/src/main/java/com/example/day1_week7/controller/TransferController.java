package com.example.day1_week7.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.day1_week7.entities.Transfer;
import com.example.day1_week7.exceptions.UnauthorizedException;
import com.example.day1_week7.payloads.request.ConfirmCodeDTO;
import com.example.day1_week7.payloads.request.NewTransferDTO;
import com.example.day1_week7.service.TransferService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

	private final TransferService transferService;

	public TransferController(TransferService transferService) {
		this.transferService = transferService;
	}

	@GetMapping
	public List<Transfer> getAll(Authentication authentication) {
		if (authentication == null) {
			throw new UnauthorizedException("Non autenticato");
		}
		return transferService.findAllForUsername(authentication.getName());
	}

	@GetMapping("/{id}")
	public Transfer getById(@PathVariable UUID id) {
		return transferService.findById(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Transfer create(@RequestBody @Valid NewTransferDTO dto) {
		return transferService.create(dto);
	}

	@PostMapping("/{id}/confirm")
	public Transfer confirm(@PathVariable UUID id, @RequestBody @Valid ConfirmCodeDTO dto) {
		return transferService.confirm(id, dto.getCode());
	}

	@PostMapping("/{id}/reject")
	public Transfer reject(@PathVariable UUID id) {
		return transferService.reject(id);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable UUID id) {
		transferService.delete(id);
	}

}
