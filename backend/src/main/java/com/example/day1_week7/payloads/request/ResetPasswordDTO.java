package com.example.day1_week7.payloads.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordDTO {

	@NotBlank(message = "L'email è obbligatoria")
	@Email(message = "L'email non è valida")
	private String email;

	@NotBlank(message = "Il codice è obbligatorio")
	private String code;

	@NotBlank(message = "La nuova password è obbligatoria")
	@Size(min = 8, message = "La password deve avere almeno 8 caratteri")
	private String newPassword;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

}
