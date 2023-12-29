package ug.edu.socialhub.api.models;

public class FoundUser {

    private String id = null;
    private String email = null;
    private String username = null;
    private String profilePicture = null;

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

    public FoundUser(String email, String username, String profilePicture, String description, String id) {
        this.email = email;
        this.username = username;
        this.profilePicture = profilePicture;
        this.description = description;
        this.id = id;
    }

    public FoundUser() {
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

}
