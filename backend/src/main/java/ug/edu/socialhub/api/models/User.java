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
    private ArrayList<String> posts;
    private ArrayList<String> friendsList;
    private ArrayList<FriendRequest> friendRequests;


    public ArrayList<String> getPosts() {
        return posts;
    }

    public void setPosts(ArrayList<String> postsId) {
        this.posts = postsId;
    }

    public void addPost(String postId) {
        this.posts.add(postId);
    }

    public String setID(String id) {
        return this.id = id;
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
        this.friendsList = new ArrayList<>();
        this.friendRequests = new ArrayList<>();
    }

    public User(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.username = name;
        this.posts = new ArrayList<>();
        this.friendsList = new ArrayList<>();
        this.friendRequests = new ArrayList<>();
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

    public ArrayList<String> getFriendsList() {
        return friendsList;
    }

    public void setFriendsList(ArrayList<String> friendsList) {
        this.friendsList = friendsList;
    }

    public void addFriend(String friendId) {
        this.friendsList.add(friendId);
    }

    public void removeFriend(String friendId) {
        this.friendsList.remove(friendId);
    }

    public ArrayList<FriendRequest> getFriendRequests() {
        return friendRequests;
    }

    public void setFriendRequests(ArrayList<FriendRequest> friendRequests) {
        this.friendRequests = friendRequests;
    }

    public void addFriendRequest(FriendRequest friendRequest) {
        this.friendRequests.add(friendRequest);
    }


    public void removeFriendRequest(String friendRequestId) {
        for (FriendRequest friendRequest : this.friendRequests) {
            if (friendRequest.getId().equals(friendRequestId)) {
                this.friendRequests.remove(friendRequest);
                break;
            }
        }
    }

    public String getIdFromFriendRequest(String friendRequestId, String id) {
        for (FriendRequest friendRequest : this.friendRequests) {
            if (friendRequest.getId().equals(friendRequestId)) {
                if (friendRequest.getSenderId().equals(id)) {
                    return friendRequest.getReceiverId();
                } else {
                    return friendRequest.getSenderId();
                }
            }
        }
        return null;
    }
}