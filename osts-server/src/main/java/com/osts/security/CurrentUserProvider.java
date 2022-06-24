package com.osts.security;

import com.osts.exception.InvalidUserException;
import com.osts.security.services.UserDetailsImpl;
import org.springframework.security.core.context.SecurityContextHolder;

public final class CurrentUserProvider {
    private CurrentUserProvider() {

    }

    public static UserDetailsImpl getUser() {
        try {
            return (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            throw new InvalidUserException();
        }

    }

    public static Long getUserId() {
        return CurrentUserProvider.getUser().getId();
    }
}
