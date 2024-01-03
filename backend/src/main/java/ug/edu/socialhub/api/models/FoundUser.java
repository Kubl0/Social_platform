package ug.edu.socialhub.api.models;

import java.util.ArrayList;

public class FoundUser {

    private String id = null;
    private String email = null;
    private String username = null;
    private String profilePicture = null;

    private ArrayList<String> friends = null;

    public String getEmail() {
        return email;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    String description = null;

    public FoundUser(String email, String username, String profilePicture, String description, String id, ArrayList<String> friends){
        this.email = email;
        this.username = username;
        this.profilePicture = profilePicture;
        this.description = description;
        this.id = id;
        this.friends = friends;
    }

    public FoundUser() {
        this.friends = new ArrayList<>();
    }

    @Override
    public String toString() {
        return "{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", profilePicture='" + profilePicture + '\'' +
                ", description='" + description + '\'' +
                '}';
    }

    public ArrayList<String> getFriends() {
        return friends;
    }

    public void setFriends(ArrayList<String> friends) {
        this.friends = friends;
    }
}
