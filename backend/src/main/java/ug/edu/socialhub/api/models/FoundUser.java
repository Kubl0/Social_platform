package ug.edu.socialhub.api.models;

import java.util.ArrayList;
import java.util.List;

public class FoundUser {

    private String id;
    private String email;
    private String username;
    private String profilePicture;
    private String description;
    private List<String> friends;

    public FoundUser(String email, String username, String profilePicture, String description, String id, List<String> friends) {
        this.email = email;
        this.username = username;
        this.profilePicture = profilePicture;
        this.description = description;
        this.id = id;
        this.friends = friends != null ? friends : new ArrayList<>();
    }

    public FoundUser() {
        this.friends = new ArrayList<>();
    }

    // Getters

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getFriends() {
        return friends;
    }

    // Setters

    public void setId(String id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setFriends(List<String> friends) {
        this.friends = friends != null ? friends : new ArrayList<>();
    }

    @Override
    public String toString() {
        return "FoundUser{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", profilePicture='" + profilePicture + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
