package ug.edu.socialhub.api.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
public class User {

    @Id
    private String id;
    private String email;
    private String password;
    private String username;

    private String profilePicture;
    private String description;

    public void setId(String id) {
        this.id = id;
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

    public User() {
    }

    public User(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.username = name;
    }

    public String getEmail() {
        return this.email;
    }

    public String getPassword() {
        return this.password;
    }

    public String getUsername() {
        return this.username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String toString() {
        String str = "";
        str += "Email: " + this.email + "\n";
        str += "Password: " + this.password + "\n";
        str += "Name: " + this.username + "\n";
        return str;
    }

    public String getId() {
        return this.id;
    }
}