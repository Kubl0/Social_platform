package ug.edu.socialhub.api.models;
import java.util.UUID;
public class Message {
    private String id;
    private String senderId;
    private String receiverId;
    private String content;
    private String date;
    public Message() {
    }
    public Message(String senderId, String receiverId, String content) {
        this.id = UUID.randomUUID().toString();
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.date = String.valueOf(System.currentTimeMillis());
    }
    public Message(String senderId, String receiverId, String content, String date) {
        this.id = UUID.randomUUID().toString();
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.date = date;
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
    public String getContent() {
        return content;
    }
    public String getDate() {
        return date;
    }
    public void setId(String id) {
        this.id = id;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public void setContent(String content) {
        this.content = content;
    }



    @Override
    public String toString() {
        return "Message{" +
                "id='" + id + '\'' +
                ", senderId='" + senderId + '\'' +
                ", receiverId='" + receiverId + '\'' +
                ", content='" + content + '\'' +
                ", date='" + date + '\'' +
                '}';
    }
}
