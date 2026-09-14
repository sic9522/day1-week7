package com.example.day1_week7.payloads.request;

import jakarta.validation.constraints.NotBlank;

public class ConfirmCodeDTO {

	@NotBlank(message = "Il codice è obbligatorio")
	private String code;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

}
