package com.example.day1_week7.repository;

import com.example.day1_week7.entities.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TransferRepository extends JpaRepository<Transfer, UUID> {

	List<Transfer> findBySourceIbanOrDestinationIban(String sourceIban, String destinationIban);

}
