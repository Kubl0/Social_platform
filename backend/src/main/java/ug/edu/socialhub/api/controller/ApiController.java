package ug.edu.socialhub.api.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ug.edu.socialhub.api.dto.PostDTO;
import ug.edu.socialhub.api.dto.UserDTO;
import ug.edu.socialhub.api.models.*;
import ug.edu.socialhub.api.service.ApiService;
import ug.edu.socialhub.api.service.AuthenticationService;
import ug.edu.socialhub.api.service.PostManagementService;
import ug.edu.socialhub.api.service.UserManagementService;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class ApiController {

    private final ApiService apiService;
    private final AuthenticationService authenticationService;
    private final UserManagementService userManagementService;
    private final PostManagementService postManagementService;

    @Autowired
    public ApiController(ApiService apiService, AuthenticationService au, UserManagementService u, PostManagementService p) {
        this.apiService = apiService;
        this.authenticationService = au;
        this.userManagementService = u;
        this.postManagementService = p;
    }

    @GetMapping("/list")
    public List<FoundUser> getAllUsers(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return userManagementService.getAllUsers(authorizationHeader);
    }

    @GetMapping("/postById/{id}")
    public Post getPostById(@PathVariable String id){
        return postManagementService.getPostById(id);
    }

    @PostMapping("/register")
    public ResponseEntity<String> addUser(@RequestBody UserDTO user) {
        return userManagementService.addUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody UserDTO user) {
        return authenticationService.loginUser(user);
    }

    @GetMapping("/get/{id}")
    public FoundUser getUserById(@PathVariable String id) {
        return userManagementService.getUserById(id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateUser(@PathVariable String id, @RequestBody FoundUser user, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return userManagementService.updateUser(id, user, authorizationHeader);
    }

    @PostMapping("/addPost/{id}")
    public ResponseEntity<String> addPost(@PathVariable String id, @RequestBody PostDTO post, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return postManagementService.addPost(id, post, authorizationHeader);
    }

    @GetMapping("/getPosts/{id}")
    public List<Post> getPosts(@PathVariable String id) {
        return postManagementService.getPosts(id);
    }

    @GetMapping("/getPostsByWallId/{id}")
    public List<Post> getPostsByWallId(@PathVariable String id) {
        return postManagementService.getPostsByWallId(id);
    }

    @GetMapping("/getAllPosts")
    public List<Post> getAllPosts(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return postManagementService.getAllPosts(authorizationHeader);
    }


    @PostMapping("/addComment/{id}")
    public ResponseEntity<String> addComment(@PathVariable String id, @RequestBody Comment comment, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return postManagementService.addComment(id, authorizationHeader, comment);
    }

    @GetMapping("/getComments/{id}")
    public List<Comment> getComments(@PathVariable String id) {
        return postManagementService.getComments(id);
    }

    @PostMapping("/addFriendRequest/{id}")
    public ResponseEntity<String> addFriendRequest(@PathVariable String id, @RequestBody String username, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return userManagementService.addFriendRequest(id, username, authorizationHeader);
    }

    @GetMapping("/getFriendRequests/{id}")
    public List<FriendRequest> getFriendRequests(@PathVariable String id) {
        return userManagementService.getFriendRequests(id);
    }

    @PutMapping("/acceptFriendRequest/{id}")
    public ResponseEntity<String> acceptFriendRequest(@PathVariable String id, @RequestBody String reqId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return userManagementService.acceptFriendRequest(id, reqId, authorizationHeader);
    }

    @DeleteMapping("/deleteFriendRequest/{id}")
    public ResponseEntity<String> deleteFriendRequest(@PathVariable String id, @RequestBody String reqId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return userManagementService.deleteFriendRequest(id, reqId, authorizationHeader);
    }

    @GetMapping("/isFriend/{friendId}/{userId}")
    public boolean isFriend(@PathVariable String friendId, @PathVariable String userId) {
        return userManagementService.isFriend(friendId, userId);
    }

    @GetMapping("/search/{searchTerm}")
    public ResponseEntity<List<FoundUser>> searchUsers(@PathVariable String searchTerm) {
        return userManagementService.searchUsers(searchTerm);
    }

    @GetMapping("/getPostsFromFriends/{id}")
    public ResponseEntity<List<Post>> getPostsFromFriends(@PathVariable String id) {
        return postManagementService.getPostsFromFriends(id);
    }

    @DeleteMapping("/deleteFriend/{id}")
    public ResponseEntity<String> deleteFriend(@PathVariable String id, @RequestBody String friendId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return userManagementService.deleteFriend(id, friendId, authorizationHeader);
    }

    @PostMapping("/addLike/{id}")
    public ResponseEntity<String> addLike(@PathVariable String id, @RequestBody String userId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return postManagementService.addLike(id, userId, authorizationHeader);
    }

    @GetMapping("/getLikes/{id}")
    public List<String> getLikes(@PathVariable String id) {
        return postManagementService.getLikes(id);
    }

    @DeleteMapping("/deleteLike/{id}")
    public ResponseEntity<String> deleteLike(@PathVariable String id, @RequestBody String userId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return postManagementService.deleteLike(id, userId, authorizationHeader);
    }

    @GetMapping("isLiked/{id}/{userId}")
    public boolean isLiked(@PathVariable String id, @PathVariable String userId) {
        return postManagementService.isLiked(id, userId);
    }

    @DeleteMapping("/deleteComment/{postId}/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable String postId, @PathVariable String commentId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return postManagementService.deleteComment(postId, commentId, authorizationHeader);
    }

    @DeleteMapping("/deletePost/{id}")
    public ResponseEntity<String> deletePost(@PathVariable String id, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return postManagementService.deletePost(id, authorizationHeader);
    }

    @PutMapping("/updatePost/{id}")
    public ResponseEntity<String> updatePost(@PathVariable String id, @RequestBody String content, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return postManagementService.updatePost(id, content, authorizationHeader);
    }

    @PutMapping("/updateComment/{postId}/{commentId}")
    public ResponseEntity<String> updateComment(@PathVariable String postId, @PathVariable String commentId, @RequestBody String content, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return postManagementService.updateComment(postId, commentId, content, authorizationHeader);
    }

    @GetMapping("/getChatMessages/{userId}/{friendId}")
    public ResponseEntity<ArrayList<Message>> getChatMessages(@PathVariable String userId, @PathVariable String friendId) {
        return apiService.getChatMessages(userId, friendId);
    }

    @PostMapping("/addChatMessage/{userId}/{friendId}")
    public ResponseEntity<String> addChatMessage(@PathVariable String userId, @PathVariable String friendId, @RequestBody String message, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return apiService.addChatMessage(userId, friendId, message, authorizationHeader);
    }

    @DeleteMapping("/removeUser/{id}")
    public ResponseEntity<String> removeUser(@PathVariable String id, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return userManagementService.removeUser(id, authorizationHeader);
    }

}
