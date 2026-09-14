package com.example.day1_week7.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Entity
@Table(name = "transaction_tokens")
@Getter
@Setter
@NoArgsConstructor
public class TransactionToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false, precision = 6, scale = 0)
    private BigDecimal value;
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @Column(nullable = false, updatable = false)
    private Instant expireAt;
    @Column(nullable = false)
    private boolean isUsed = false;
    @ManyToOne
    @JoinColumn(name = "transfer_id", nullable = false)
    private Transfer transfer;

    @PrePersist
    private void onCreate() {
        createdAt = Instant.now();
        expireAt = createdAt.plus(10, ChronoUnit.MINUTES);
    }
}
