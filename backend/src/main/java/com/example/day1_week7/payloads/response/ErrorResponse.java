package com.example.day1_week7.payloads.response;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class ErrorResponse {

	private final String message;
	private final LocalDateTime timestamp;

	public ErrorResponse(String message) {
		this.message = message;
		this.timestamp = LocalDateTime.now();
	}

}
