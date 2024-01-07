package ug.edu.socialhub.api.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;
import ug.edu.socialhub.api.models.*;
import ug.edu.socialhub.api.service.ApiService;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final ApiService apiService;

    @Autowired
    public UserController(ApiService apiService) {
        this.apiService = apiService;
    }

    @GetMapping("/list")
    public List<FoundUser> getAllUsers(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.getAllUsers(authorizationHeader);
    }

    @PostMapping("/register")
    public ResponseEntity<String> addUser(@RequestBody User user) {
        return apiService.addUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        return apiService.loginUser(user);
    }

    @PostMapping("/test")
    public String test(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        String token = apiService.extractToken(authorizationHeader);
        return apiService.test(token);
    }

    @GetMapping("/get/{id}")
    public FoundUser getUserById(@PathVariable String id) {
        return apiService.getUserById(id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateUser(@PathVariable String id, @RequestBody FoundUser user, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.updateUser(id, user, authorizationHeader);
    }

    @PostMapping("/addPost/{id}")
    public ResponseEntity<String> addPost(@PathVariable String id, @RequestBody Post post, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.addPost(id, post, authorizationHeader);
    }

    @GetMapping("/getPosts/{id}")
    public List<Post> getPosts(@PathVariable String id) {
        return apiService.getPosts(id);
    }

    @GetMapping("/getPostsByWallId/{id}")
    public List<Post> getPostsByWallId(@PathVariable String id) {
        return apiService.getPostsByWallId(id);
    }

    @GetMapping("/getAllPosts")
    public List<Post> getAllPosts(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.getAllPosts(authorizationHeader);
    }


    @PostMapping("/addComment/{id}")
    public ResponseEntity<String> addComment(@PathVariable String id, @RequestBody Comment comment, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.addComment(id, authorizationHeader, comment);
    }

    @GetMapping("/getComments/{id}")
    public List<Comment> getComments(@PathVariable String id) {
        return apiService.getComments(id);
    }

    @PostMapping("/addFriendRequest/{id}")
    public ResponseEntity<String> addFriendRequest(@PathVariable String id, @RequestBody String username, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.addFriendRequest(id, username, authorizationHeader);
    }

    @GetMapping("/getFriendRequests/{id}")
    public List<FriendRequest> getFriendRequests(@PathVariable String id) {
        return apiService.getFriendRequests(id);
    }

    @PutMapping("/acceptFriendRequest/{id}")
    public ResponseEntity<String> acceptFriendRequest(@PathVariable String id, @RequestBody String reqId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.acceptFriendRequest(id, reqId, authorizationHeader);
    }

    @DeleteMapping("/deleteFriendRequest/{id}")
    public ResponseEntity<String> deleteFriendRequest(@PathVariable String id, @RequestBody String reqId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.deleteFriendRequest(id, reqId, authorizationHeader);
    }

    @GetMapping("/isFriend/{friendId}/{userId}")
    public boolean isFriend(@PathVariable String friendId, @PathVariable String userId) {
        return apiService.isFriend(friendId, userId);
    }

    @GetMapping("/search/{searchTerm}")
    public ResponseEntity<List<FoundUser>> searchUsers(@PathVariable String searchTerm) {
        return apiService.searchUsers(searchTerm);
    }

    @GetMapping("/getPostsFromFriends/{id}")
    public ResponseEntity<List<Post>> getPostsFromFriends(@PathVariable String id) {
        return apiService.getPostsFromFriends(id);
    }
      
    @DeleteMapping("/deleteFriend/{id}")
    public ResponseEntity<String> deleteFriend(@PathVariable String id, @RequestBody String friendId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.deleteFriend(id, friendId, authorizationHeader);
    }

    @PostMapping("/addLike/{id}")
    public ResponseEntity<String> addLike(@PathVariable String id, @RequestBody String userId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.addLike(id, userId, authorizationHeader);
    }

    @GetMapping("/getLikes/{id}")
    public List<String> getLikes(@PathVariable String id) {
        return apiService.getLikes(id);
    }

    @DeleteMapping("/deleteLike/{id}")
    public ResponseEntity<String> deleteLike(@PathVariable String id, @RequestBody String userId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.deleteLike(id, userId, authorizationHeader);
    }

    @GetMapping("isLiked/{id}/{userId}")
    public boolean isLiked(@PathVariable String id, @PathVariable String userId) {
        return apiService.isLiked(id, userId);
    }

    @DeleteMapping("/deleteComment/{postId}/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable String postId, @PathVariable String commentId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.deleteComment(postId, commentId, authorizationHeader);
    }

    @DeleteMapping("/deletePost/{id}")
    public ResponseEntity<String> deletePost(@PathVariable String id, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.deletePost(id, authorizationHeader);
    }

    @PutMapping("/updatePost/{id}")
    public ResponseEntity<String> updatePost(@PathVariable String id, @RequestBody String content, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.updatePost(id, content, authorizationHeader);
    }

    @PutMapping("/updateComment/{postId}/{commentId}")
    public ResponseEntity<String> updateComment(@PathVariable String postId, @PathVariable String commentId, @RequestBody String content, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.updateComment(postId, commentId, content, authorizationHeader);
    }


    @GetMapping("/getChatMessages/{userId}/{friendId}")
    public ResponseEntity<ArrayList<Message>> getChatMessages(@PathVariable String userId, @PathVariable String friendId) {
        return apiService.getChatMessages(userId, friendId);
    }

    @PostMapping("/addChatMessage/{userId}/{friendId}")
    public ResponseEntity<String> addChatMessage(@PathVariable String userId, @PathVariable String friendId, @RequestBody String message) {
        return apiService.addChatMessage(userId, friendId, message);
    }



    @DeleteMapping("/removeUser/{id}")
    public ResponseEntity<String> removeUser(@PathVariable String id, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.removeUser(id, authorizationHeader);
    }

}
