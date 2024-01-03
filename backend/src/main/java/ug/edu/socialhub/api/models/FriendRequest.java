package ug.edu.socialhub.api.models;

import java.util.UUID;

public class FriendRequest {

    private String id;
    private String senderId;
    private String receiverId;
    private String date;
    private String status;

    public FriendRequest() {
    }

    public FriendRequest(String senderId, String receiverId) {
        this.id = UUID.randomUUID().toString();
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.date = String.valueOf(System.currentTimeMillis());
        this.status = "pending";
    }

    public FriendRequest(String senderId, String receiverId, String date, String status) {
        this.id = UUID.randomUUID().toString();
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.date = date;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public String getSenderId() {
        return senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public String getDate() {
        return date;
    }

    public String getStatus() {
        return status;
    }

    public void setId(String id) {
        this.id = id;
    }

}
