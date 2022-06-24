package com.osts.controllers;

import com.osts.models.TrackingSystem;
import com.osts.repository.TrackingSystemRepository;
import com.osts.service.TrackingSystemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class TrackingSystemController {

	@Autowired
	TrackingSystemRepository trackingSystemRepository;
	@Autowired
	TrackingSystemService trackingSystemService;

	@GetMapping("/ots")
	public ResponseEntity<List<TrackingSystem>> getAllTrackingSystems(@RequestParam(required = false) String state) {
		try {
			List<TrackingSystem> trackingsystems = new ArrayList<TrackingSystem>();

			if (state == null)
				trackingSystemRepository.findAll().forEach(trackingsystems::add);
			else
				trackingSystemRepository.findByStateContaining(state).forEach(trackingsystems::add);

			if (trackingsystems.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}

			return new ResponseEntity<>(trackingsystems, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/ots/{id}")
	public ResponseEntity<TrackingSystem> getTrackingSystemById(@PathVariable("id") long id) {
		Optional<TrackingSystem> trackingsystemData = trackingSystemRepository.findById(id);

		if (trackingsystemData.isPresent()) {
			return new ResponseEntity<>(trackingsystemData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	
	@PostMapping("/ots")
	public ResponseEntity<TrackingSystem> create(@RequestBody TrackingSystem trackingSystem) {
		try {
			TrackingSystem trackingsystem = trackingSystemService.create(trackingSystem);
			return new ResponseEntity<>(trackingsystem, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/ots/state/{state}")
	public ResponseEntity<TrackingSystem> updateStatus(@RequestBody TrackingSystem trackingSystem, @PathVariable("state") String state) {
		try {
			TrackingSystem trackingsystem = trackingSystemService.updateStatus(trackingSystem, state);
			return new ResponseEntity<>(trackingsystem, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	 
	@PutMapping("/ots/{id}")
	public ResponseEntity<TrackingSystem> updateTrackingSystem(@PathVariable("id") long id, @RequestBody TrackingSystem tutorial) {
		Optional<TrackingSystem> trackingsystemData = trackingSystemRepository.findById(id);

		if (trackingsystemData.isPresent()) {
			TrackingSystem trackingsystem = trackingsystemData.get();

			trackingsystem.setState(tutorial.getState());
			trackingsystem.setLicense(tutorial.getLicense());
			trackingsystem.setUrl(tutorial.getUrl());
			trackingsystem.setDescription(tutorial.getDescription());
			trackingsystem.setDate(tutorial.getDate());
			return new ResponseEntity<>(trackingSystemRepository.save(trackingsystem), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/ots/{id}")
	public ResponseEntity<HttpStatus> deleteTrackingSystem(@PathVariable("id") long id) {
		try {
			trackingSystemRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
