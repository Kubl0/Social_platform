package ug.edu.socialhub.api.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document("posts")
public class Post {

    @Id
    private String id;
    private String userId;
    private String content;
    private String date;
    private String wallId;
    private List<String> likes;
    private List<Comment> comments;

    public Post() {
        generateDefaultValues();
    }

    public Post(String userId, String content, String wallId) {
        generateDefaultValues();
        this.userId = userId;
        this.content = content;
        this.wallId = wallId;
    }

    private void generateDefaultValues() {
        this.likes = new ArrayList<>();
        this.comments = new ArrayList<>();
        this.id = String.valueOf(System.currentTimeMillis());
        this.date = String.valueOf(System.currentTimeMillis());
    }

    // Getters

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getContent() {
        return content;
    }

    public String getDate() {
        return date;
    }

    public String getWallId() {
        return wallId;
    }

    public List<String> getLikes() {
        return likes;
    }

    public List<Comment> getComments() {
        return comments;
    }

    // Setters

    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setWallId(String wallId) {
        this.wallId = wallId;
    }

    public void setLikes(List<String> likes) {
        this.likes = likes;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    // Additional methods

    public void addLike(String userId) {
        this.likes.add(userId);
    }

    public void addComment(Comment comment) {
        this.comments.add(comment);
    }

    public void removeLike(String userId) {
        this.likes.remove(userId);
    }

    public void removeComment(Comment comment) {
        this.comments.remove(comment);
    }


    @Override
    public String toString() {
        return "Post{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", content='" + content + '\'' +
                ", date='" + date + '\'' +
                ", wallId='" + wallId + '\'' +
                ", likes=" + likes +
                ", comments=" + comments +
                '}';
    }
}
