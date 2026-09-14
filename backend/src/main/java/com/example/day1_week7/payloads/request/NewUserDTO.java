package com.example.day1_week7.payloads.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class NewUserDTO {

	@NotBlank(message = "Il nome è obbligatorio")
	private String nome;

	@NotBlank(message = "Il cognome è obbligatorio")
	private String cognome;

	@NotBlank(message = "Lo username è obbligatorio")
	private String username;

	@NotBlank(message = "L'email è obbligatoria")
	@Email(message = "L'email non è valida")
	private String email;

	@NotBlank(message = "La password è obbligatoria")
	@Size(min = 8, message = "La password deve avere almeno 8 caratteri")
	private String password;

	@NotNull(message = "Il saldo iniziale è obbligatorio")
	@DecimalMin(value = "0.0", message = "Il saldo iniziale non può essere negativo")
	private BigDecimal balance;

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getCognome() {
		return cognome;
	}

	public void setCognome(String cognome) {
		this.cognome = cognome;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}

}
