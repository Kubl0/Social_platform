package ug.edu.socialhub.api.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ug.edu.socialhub.api.dto.UserDTO;
import ug.edu.socialhub.api.models.LoginResponse;
import ug.edu.socialhub.api.models.User;
import ug.edu.socialhub.api.repository.UserRepository;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class AuthenticationService {

    private static final String LOGIN_FAILED_MESSAGE = "User login failed";

    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public boolean isAdmin(String id) {
        Optional<User> user = userRepository.findById(id);
        return !user.map(value -> value.getType().equals("admin")).orElse(false);
    }

    public String extractToken(String authorizationHeader) {
        String[] parts = authorizationHeader.split(" ");
        if (parts.length == 2 && parts[0].equalsIgnoreCase("Bearer")) {
            return parts[1];
        } else {
            throw new IllegalArgumentException("Invalid or missing JWT token");
        }
    }

    public boolean isAuthorized(String id, String authorizationHeader) {
        String token = extractToken(authorizationHeader);
        String tokenId = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();

        return !tokenId.equals(id);
    }

    public String extractUserIdFromToken(String authorizationHeader) {
        try {
            String token = extractToken(authorizationHeader);
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    public ResponseEntity<LoginResponse> loginUser(UserDTO user) {
        try {
            List<User> users = userRepository.findByUsername(user.getUsername());
            if (users.isEmpty()) {
                return new ResponseEntity<>(new LoginResponse(LOGIN_FAILED_MESSAGE, null, null, false, null), HttpStatus.UNAUTHORIZED);
            }
            User foundUser = users.get(0);

            if (passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
                return ResponseEntity.ok().body(new LoginResponse("User logged in successfully", foundUser, generateJwtToken(foundUser), true, foundUser.getId()));
            } else {
                return new ResponseEntity<>(new LoginResponse(LOGIN_FAILED_MESSAGE, null, null, false, null), HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(new LoginResponse(LOGIN_FAILED_MESSAGE, null, null, false, null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    private String generateJwtToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SECRET_KEY)
                .compact();
    }

}