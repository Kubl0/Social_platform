package ug.edu.socialhub.api.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Document("posts")
public class Post {

    @Id
    private String id;
    private String userId;
    private String content;
    private String date;

    private ArrayList<String> likes;
    private ArrayList<Comment> comments;

    public Post() {
        this.likes = new ArrayList<>();
        this.comments = new ArrayList<>();
        this.date = String.valueOf(System.currentTimeMillis());
    }

    public Post(String userId, String content) {
        this.userId = userId;
        this.content = content;
        this.date = String.valueOf(System.currentTimeMillis());
        this.likes = new ArrayList<>();
        this.comments = new ArrayList<>();
    }

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

    public ArrayList<String> getLikes() {
        return likes;
    }

    public ArrayList<Comment> getComments() {
        return comments;
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

    public void setLikes(ArrayList<String> likes) {
        this.likes = likes;
    }

    public void setComments(ArrayList<Comment> comments) {
        this.comments = comments;
    }

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
        return "{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", content='" + content + '\'' +
                ", date='" + date + '\'' +
                ", likes=" + likes +
                ", comments=" + comments +
                '}';
    }

}
