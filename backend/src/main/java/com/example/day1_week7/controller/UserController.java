package com.example.day1_week7.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.day1_week7.entities.User;
import com.example.day1_week7.exceptions.UnauthorizedException;
import com.example.day1_week7.payloads.request.NewUserDTO;
import com.example.day1_week7.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	public List<User> getAll() {
		return userService.findAll();
	}

	@GetMapping("/me")
	public User getMe(Authentication authentication) {
		if (authentication == null) {
			throw new UnauthorizedException("Non autenticato");
		}
		return userService.findByUsername(authentication.getName());
	}

	@GetMapping("/{id}")
	public User getById(@PathVariable UUID id) {
		return userService.findById(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public User register(@RequestBody @Valid NewUserDTO dto) {
		return userService.register(dto);
	}

	@PostMapping("/confirm")
	public void confirmRegistration(@RequestParam String token) {
		userService.confirmRegistration(token);
	}

	@PutMapping("/{id}")
	public User update(@PathVariable UUID id, @RequestBody @Valid NewUserDTO dto) {
		return userService.update(id, dto);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable UUID id) {
		userService.delete(id);
	}

}
