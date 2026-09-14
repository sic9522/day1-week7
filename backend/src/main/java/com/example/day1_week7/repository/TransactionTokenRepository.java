package com.example.day1_week7.repository;

import com.example.day1_week7.entities.TransactionToken;
import com.example.day1_week7.entities.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TransactionTokenRepository extends JpaRepository<TransactionToken, UUID> {

	Optional<TransactionToken> findFirstByTransferAndIsUsedFalseOrderByCreatedAtDesc(Transfer transfer);

}
