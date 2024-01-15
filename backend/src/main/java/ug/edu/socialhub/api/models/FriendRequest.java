package ug.edu.socialhub.api.models;

import java.util.UUID;

public class FriendRequest {

    private String id;
    private String senderId;
    private String receiverId;
    private String date;
    private String status;

    public FriendRequest() {
        generateDefaultValues();
    }

    public FriendRequest(String senderId, String receiverId) {
        generateDefaultValues();
        this.senderId = senderId;
        this.receiverId = receiverId;
    }


    private void generateDefaultValues() {
        this.id = UUID.randomUUID().toString();
        this.date = String.valueOf(System.currentTimeMillis());
        this.status = "pending";
    }

    // Getters

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

    // Setters

    public void setId(String id) {
        this.id = id;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
