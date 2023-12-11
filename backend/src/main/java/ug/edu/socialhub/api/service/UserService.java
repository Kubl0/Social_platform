package ug.edu.socialhub.api.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ug.edu.socialhub.api.models.User;
import ug.edu.socialhub.api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;

import java.util.Date;

import java.util.List;


@Service
public class UserService {

    @Value("${jwt.secret}")
    private String secret;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    public ResponseEntity<String> addUser(User user) {
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            return new ResponseEntity<>("User registered succesfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("User registration failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    public ResponseEntity<LoginResponse> loginUser(User user) {
        try {
            List<User> users = userRepository.findByUsername(user.getUsername());
            if (users.isEmpty()) {
                return new ResponseEntity<>(new LoginResponse("User login failed", null, null, false), HttpStatus.UNAUTHORIZED);
            }
            User foundUser = users.get(0);

            if (passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
                return ResponseEntity.ok().body(new LoginResponse("User logged in successfully", foundUser, generateJwtToken(foundUser), true));
            } else {
                return new ResponseEntity<>(new LoginResponse("User login failed", null, null, false), HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(new LoginResponse("User login failed", null, null, false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String generateJwtToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))  // Token valid for 24 hours
                .compact();
    }
}


