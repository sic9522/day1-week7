package com.example.day1_week7.controller;

import org.springframework.web.bind.annotation.*;

import com.example.day1_week7.payloads.request.EmailDTO;
import com.example.day1_week7.payloads.request.LoginDTO;
import com.example.day1_week7.payloads.request.ResetPasswordDTO;
import com.example.day1_week7.payloads.response.TokenResponse;
import com.example.day1_week7.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/login")
	public TokenResponse login(@RequestBody @Valid LoginDTO dto) {
		return new TokenResponse(authService.login(dto.getUsername(), dto.getPassword()));
	}

	@PostMapping("/resend-code")
	public void resendCode(@RequestBody @Valid EmailDTO dto) {
		authService.resendCode(dto.getEmail());
	}

	@PostMapping("/forgot-password")
	public void forgotPassword(@RequestBody @Valid EmailDTO dto) {
		authService.forgotPassword(dto.getEmail());
	}

	@PostMapping("/reset-password")
	public void resetPassword(@RequestBody @Valid ResetPasswordDTO dto) {
		authService.resetPassword(dto.getEmail(), dto.getCode(), dto.getNewPassword());
	}

}
