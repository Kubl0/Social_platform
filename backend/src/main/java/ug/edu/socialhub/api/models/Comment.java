package ug.edu.socialhub.api.models;

import org.springframework.data.annotation.Id;

import java.util.UUID;

public class Comment {

    @Id
    private String id;
    private String userId;
    private String content;
    private String date;

    public Comment() {
        this.id = UUID.randomUUID().toString();
        this.date = String.valueOf(System.currentTimeMillis());
    }

    public Comment(String userId, String content) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.content = content;
        this.date = String.valueOf(System.currentTimeMillis());
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

    @Override
    public String toString() {
        return "Comment{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", content='" + content + '\'' +
                ", date='" + date + '\'' +
                '}';
    }
}
