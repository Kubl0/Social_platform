package ug.edu.socialhub.api.service;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ug.edu.socialhub.api.models.*;
import ug.edu.socialhub.api.repository.ChatRepository;
import java.util.ArrayList;
import java.util.List;


@Service
public class ApiService {
    private final ChatRepository chatRepository;

    public ApiService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }


    public ResponseEntity<ArrayList<Message>> getChatMessages(String userId, String friendId) {
        try {

            List<Conversation> conversations = chatRepository.findByUsers(userId, friendId);
            Conversation conversation;
            if (conversations.isEmpty()) {
                System.out.println("No existing conversation found. Creating a new one.");
                conversation = new Conversation(userId, friendId);
            } else {
                conversation = conversations.get(0);
                System.out.println("Existing conversation found: " + conversation);
                System.out.println("Messages: " + conversation.getMessages());
            }
            return new ResponseEntity<>(conversation.getMessages(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> addChatMessage(String userId, String friendId, String message, String authorizationHeader) {
        try {
            if (isAuthorized(userId, authorizationHeader)) {
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
            }

            List<Conversation> conversations = chatRepository.findByUsers(userId, friendId);
            Conversation conversation;

            if (conversations.isEmpty()) {
                System.out.println("No existing conversation found. Creating a new one.");
                conversation = new Conversation(userId, friendId);
            } else {
                conversation = conversations.get(0);
                System.out.println("Existing conversation found: " + conversation);
                System.out.println("Messages: " + conversation.getMessages());
            }

            Message messageCreated = new Message(userId, friendId, message);
            conversation.addMessage(messageCreated);
            chatRepository.save(conversation);
            System.out.println("Message added successfully. Conversation: " + conversation);
            return new ResponseEntity<>("Message added successfully", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Message add failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
