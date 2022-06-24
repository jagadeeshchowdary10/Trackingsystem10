package com.osts.repository;

import com.osts.models.TrackingSystem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackingSystemRepository extends JpaRepository<TrackingSystem, Long> {
	List<TrackingSystem> findByStateContaining(String title);
}
