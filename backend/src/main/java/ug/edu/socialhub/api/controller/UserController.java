package ug.edu.socialhub.api.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ug.edu.socialhub.api.models.User;
import ug.edu.socialhub.api.models.FoundUser;
import ug.edu.socialhub.api.service.UserService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/list")
    public List<FoundUser> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public ResponseEntity<String> addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        return userService.loginUser(user);
    }

    @PostMapping("/test")
    public String test(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        String token = userService.extractToken(authorizationHeader);

        return userService.test(token);
    }


    @GetMapping("/get/{id}")
    public FoundUser getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateUser(@PathVariable String id, @RequestBody FoundUser user, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        return userService.updateUser(id, user, authorizationHeader);
    }

}
