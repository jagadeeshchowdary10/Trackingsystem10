package com.osts.service;

import com.osts.constants.TrackingState;
import com.osts.models.TrackingSystem;
import com.osts.models.User;
import com.osts.repository.TrackingSystemRepository;
import com.osts.security.CurrentUserProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TrackingSystemService {
    @Autowired
    private TrackingSystemRepository trackingSystemRepository;

    public TrackingSystem create(TrackingSystem trackingSystem) {
        User userEntity = new User();

        userEntity.setId(CurrentUserProvider.getUserId());
        trackingSystem.setCreatedUser(userEntity);
        trackingSystem.setState(TrackingState.CREATED);
        trackingSystem.setDate(new Date());

        return trackingSystemRepository.save(trackingSystem);
    }

    public TrackingSystem updateStatus(TrackingSystem trackingSystem, String state) {
        User userEntity = new User();

        userEntity.setId(CurrentUserProvider.getUserId());
        trackingSystem.setUpdatedUser(userEntity);
        trackingSystem.setUpdatedDate(new Date());

        trackingSystem.setState(state);

        return trackingSystemRepository.save(trackingSystem);
    }
}
