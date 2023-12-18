package ug.edu.socialhub.api.service;

import ug.edu.socialhub.api.models.User;

public class LoginResponse {
    private final String userId;
    private String message;
    private User user;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    private String accessToken;

    private boolean success;

    public LoginResponse(String message, User user, String accessToken, boolean success, String userId) {
        this.message = message;
        this.user = user;
        this.accessToken = accessToken;
        this.success = success;
        this.userId = user.getId();
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
