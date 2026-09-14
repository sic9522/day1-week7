package com.example.day1_week7.payloads.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class NewTransferDTO {

	@NotBlank(message = "L'iban di partenza è obbligatorio")
	private String sourceIban;

	@NotBlank(message = "L'iban di destinazione è obbligatorio")
	private String destinationIban;

	@NotNull(message = "L'importo è obbligatorio")
	@DecimalMin(value = "0.01", message = "L'importo deve essere maggiore di zero")
	private BigDecimal amount;

	public String getSourceIban() {
		return sourceIban;
	}

	public void setSourceIban(String sourceIban) {
		this.sourceIban = sourceIban;
	}

	public String getDestinationIban() {
		return destinationIban;
	}

	public void setDestinationIban(String destinationIban) {
		this.destinationIban = destinationIban;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

}
