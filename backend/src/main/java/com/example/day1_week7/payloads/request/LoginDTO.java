package com.example.day1_week7.payloads.request;

import jakarta.validation.constraints.NotBlank;

public class LoginDTO {

	@NotBlank(message = "Lo username è obbligatorio")
	private String username;

	@NotBlank(message = "La password è obbligatoria")
	private String password;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
