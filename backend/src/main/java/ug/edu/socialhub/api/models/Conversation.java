package ug.edu.socialhub.api.models;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
public class Conversation {
    private String id;
    private String userId;
    private String friendId;

    private ArrayList<Message> messages;

    public Conversation() {
        this.messages = new ArrayList<>();
    }

    public Conversation(String userId, String friendId) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.friendId = friendId;
        this.messages = new ArrayList<>();
    }

    public Conversation(String id, String userId, String friendId) {
        this.id = id;
        this.userId = userId;
        this.friendId = friendId;
        this.messages = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getFriendId() {
        return friendId;
    }

    public ArrayList<Message> getMessages() {
        return messages;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setFriendId(String friendId) {
        this.friendId = friendId;
    }

    public void setMessages(ArrayList<Message> messages) {
        this.messages = messages;
    }

    public void addMessage(Message message) {
        this.messages.add(message);
    }

    @Override
    public String toString() {
        return "Conversation{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", friendId='" + friendId + '\'' +
                ", messages=" + messages +
                '}';
    }

}
