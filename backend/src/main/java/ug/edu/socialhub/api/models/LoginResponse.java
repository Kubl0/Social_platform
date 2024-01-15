package ug.edu.socialhub.api.models;

public class LoginResponse {
    private String message;
    private User user;
    private String accessToken;
    private boolean success;
    private final String userId;

    public LoginResponse(String message, User user, String accessToken, boolean success, String userId) {
        this.message = message;
        this.user = user;
        this.accessToken = accessToken;
        this.success = success;
        this.userId = userId;
    }

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

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getUserId() {
        return userId;
    }

    @Override
    public String toString() {
        return "LoginResponse{" +
                "message='" + message + '\'' +
                ", user=" + user +
                ", accessToken='" + accessToken + '\'' +
                ", success=" + success +
                ", userId='" + userId + '\'' +
                '}';
    }
}
