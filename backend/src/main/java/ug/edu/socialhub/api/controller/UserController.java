package ug.edu.socialhub.api.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ug.edu.socialhub.api.models.*;
import ug.edu.socialhub.api.service.ApiService;

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
    public List<FoundUser> getAllUsers() {
        return apiService.getAllUsers();
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
    public List<Post> getAllPosts() {
        return apiService.getAllPosts();
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
        System.out.println(searchTerm);
        return apiService.searchUsers(searchTerm);
    }
}
