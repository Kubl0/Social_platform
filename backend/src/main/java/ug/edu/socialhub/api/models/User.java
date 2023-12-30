package ug.edu.socialhub.api.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Document("users")
public class User {

    @Id
    private String id;
    private String email;
    private String password;
    private String username;

    private String profilePicture;
    private String description;

    private ArrayList<Post> posts;



    public ArrayList<Post> getPosts() {
        return posts;
    }

    public void setPosts(ArrayList<Post> posts) {
        this.posts = posts;
    }

    public void addPost(Post post) {
        this.posts.add(post);
        System.out.println("Added post to user");
        System.out.println(posts);
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
        this.posts = new ArrayList<>();
    }

    public User(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.username = name;
        this.posts = new ArrayList<>();
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