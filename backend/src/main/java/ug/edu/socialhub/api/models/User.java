package ug.edu.socialhub.api.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document("users")
public class User {

    @Id
    private String id;
    private String email;
    private String password;
    private String username;
    private String profilePicture;
    private String description;
    private List<String> posts;
    private List<String> friendsList;
    private List<FriendRequest> friendRequests;
    private String type;

    public User() {
        generateDefaultValues();
    }

    public User(String email, String password, String name, String type) {
        this.email = email;
        this.password = password;
        this.username = name;
        this.type = type;
        generateDefaultValues();
    }

    private void generateDefaultValues() {
        this.posts = new ArrayList<>();
        this.friendsList = new ArrayList<>();
        this.friendRequests = new ArrayList<>();
        this.profilePicture = null;
        this.description = null;
        this.type = "user";
    }

    // Getters

    public String getId() {
        return this.id;
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

    public String getProfilePicture() {
        return profilePicture;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getPosts() {
        return posts;
    }

    public List<String> getFriendsList() {
        return friendsList;
    }

    public List<FriendRequest> getFriendRequests() {
        return friendRequests;
    }

    public String getType() {
        return this.type;
    }

    // Setters

    public void setId(String id) {
        this.id = id;
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

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPosts(List<String> posts) {
        this.posts = posts;
    }

    public void addPost(String postId) {
        this.posts.add(postId);
    }

    public void setFriendsList(List<String> friendsList) {
        this.friendsList = friendsList;
    }

    public void addFriend(String friendId) {
        this.friendsList.add(friendId);
    }

    public void removeFriend(String friendId) {
        this.friendsList.remove(friendId);
    }

    public void setFriendRequests(List<FriendRequest> friendRequests) {
        this.friendRequests = friendRequests;
    }

    public void addFriendRequest(FriendRequest friendRequest) {
        this.friendRequests.add(friendRequest);
    }

    public void removeFriendRequest(String friendRequestId) {
        this.friendRequests.removeIf(request -> request.getId().equals(friendRequestId));
    }

    public void setType(String type) {
        this.type = type;
    }

    // Other methods...

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                ", profilePicture='" + profilePicture + '\'' +
                ", description='" + description + '\'' +
                ", posts=" + posts +
                ", friendsList=" + friendsList +
                ", friendRequests=" + friendRequests +
                ", type='" + type + '\'' +
                '}';
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

    public void removePost(String id) {
        this.posts.remove(id);
    }

    public String[] getFriendRequestsIds() {
        return this.friendRequests.stream().map(FriendRequest::getId).toArray(String[]::new);
    }
}
