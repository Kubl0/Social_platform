package ug.edu.socialhub.api.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ug.edu.socialhub.api.models.Post;
import ug.edu.socialhub.api.models.User;
import ug.edu.socialhub.api.models.FoundUser;
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




}
