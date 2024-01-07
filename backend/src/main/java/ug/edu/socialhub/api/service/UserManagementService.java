package ug.edu.socialhub.api.service;

import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ug.edu.socialhub.api.dto.UserDTO;
import ug.edu.socialhub.api.models.*;
import ug.edu.socialhub.api.repository.PostRepository;
import ug.edu.socialhub.api.repository.UserRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserManagementService {

    private static final String ADMIN = "admin";
    public static final String USER_UPDATE_FAILED = "User update failed";
    public static final String USER_NOT_FOUND = "User not found";
    public static final String USER_NOT_AUTHORIZED = "User not authorized";
    public static final String FRIEND_ADDED_SUCCESSFULLY = "Friend added succesfully";
    public static final String FRIEND_NOT_FOUND = "Friend not found";

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    public final PasswordEncoder passwordEncoder;
    private final AuthenticationService authenticationService;

    public UserManagementService(UserRepository userRepository, PostRepository postRepository, AuthenticationService authenticationService) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.authenticationService = authenticationService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }


    private ResponseEntity<String> handleUserNotFound() {
        return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }


    @PostConstruct
    private void insertInitialAdmin() {
        List<User> admins = userRepository.findByUsername(ADMIN);
        if (!admins.isEmpty()) {
            return;
        }
        User admin = new User();
        admin.setEmail("admin@admin.pl");
        admin.setUsername(ADMIN);
        admin.setPassword(passwordEncoder.encode(ADMIN));
        admin.setType(ADMIN);
        userRepository.save(admin);
    }

    public List<FoundUser> getAllUsers(String authorizationHeader) {
        if(authenticationService.isAdmin(authenticationService.extractUserIdFromToken(authorizationHeader))){
            return Collections.emptyList();
        }

        List<User> users = userRepository.findAll();
        List<FoundUser> foundUsers = new java.util.ArrayList<>();
        for (User user : users) {
            FoundUser foundUser = new FoundUser(user.getEmail(), user.getUsername(), user.getProfilePicture(), user.getDescription(), user.getId(), user.getFriendsList());
            foundUsers.add(foundUser);
        }
        return foundUsers;
    }

    public ResponseEntity<String> addUser(UserDTO user) {
        try {
            List<User> users = userRepository.findByUsername(user.getUsername());
            if (!users.isEmpty()) {
                return new ResponseEntity<>("Username already taken", HttpStatus.CONFLICT);
            }
            users = userRepository.findByEmail(user.getEmail());
            if (!users.isEmpty()) {
                return new ResponseEntity<>("Email already taken", HttpStatus.CONFLICT);
            }
            User newUser = new User();
            newUser.setEmail(user.getEmail());
            newUser.setUsername(user.getUsername());
            newUser.setProfilePicture(user.getProfilePicture());
            newUser.setDescription(user.getDescription());
            newUser.setType("user");
            newUser.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(newUser);
            return new ResponseEntity<>("User registered succesfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("User registration failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public FoundUser getUserById(String id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(value -> new FoundUser(value.getEmail(), value.getUsername(), value.getProfilePicture(), value.getDescription(), value.getId(), value.getFriendsList())).orElse(null);
    }

    private ResponseEntity<String> isUserAuthorized(String id, String authorizationHeader) {
        Optional<User> foundUser = userRepository.findById(id);
        if (foundUser.isEmpty()) {
            return new ResponseEntity<>(USER_UPDATE_FAILED, HttpStatus.NOT_FOUND);
        }

        if (authenticationService.isAuthorized(id, authorizationHeader)) {
            return new ResponseEntity<>(USER_UPDATE_FAILED, HttpStatus.UNAUTHORIZED);
        }
        return null;
    }


    private User getUser(String id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    public ResponseEntity<String> updateUser(String id, FoundUser user, String authorizationHeader) {
        try {
            ResponseEntity<String> isUserAuthorized = isUserAuthorized(id, authorizationHeader);
            if (isUserAuthorized != null) {
                return isUserAuthorized;
            }

            User userToUpdate = getUser(id);
            if (userToUpdate == null) {
                return handleUserNotFound();
            }
            userToUpdate.setEmail(user.getEmail());
            userToUpdate.setUsername(user.getUsername());
            userToUpdate.setProfilePicture(user.getProfilePicture());
            userToUpdate.setDescription(user.getDescription());

            userRepository.save(userToUpdate);
            return new ResponseEntity<>("User updated succesfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(USER_UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public boolean isFriend(String id, String userId) {
        Optional<User> user = userRepository.findById(id);
        if (id.equals(userId)) {
            return true;
        }
        return user.map(value -> value.getFriendsList().contains(userId)).orElse(false);
    }

    public ResponseEntity<String> addFriendRequest(String id, String username, String authorizationHeader) {
        try {
            ResponseEntity<String> isUserAuthorized = isUserAuthorized(id, authorizationHeader);
            if (isUserAuthorized != null) {
                return isUserAuthorized;
            }

            User user = getUser(id);
            if (user == null) {
                return handleUserNotFound();
            }

            List<User> friend = userRepository.findByUsername(username);
            if (friend.isEmpty()) {
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            if (friend.get(0).getId().equals(id)) {
                return new ResponseEntity<>("Can't invite yourself", HttpStatus.NOT_FOUND);
            }

            String friendId = friend.get(0).getId();

            for (FriendRequest friendRequest : user.getFriendRequests()) {
                if (friendRequest.getSenderId().equals(id) && friendRequest.getReceiverId().equals(friendId)) {
                    return new ResponseEntity<>("Friend request already sent", HttpStatus.CONFLICT);
                }
            }

            for (FriendRequest friendRequest : user.getFriendRequests()) {
                if (friendRequest.getReceiverId().equals(id) && friendRequest.getSenderId().equals(friendId)) {
                    user.addFriend(friendId);
                    user.removeFriendRequest(friendRequest.getId());
                    friend.get(0).addFriend(id);
                    friend.get(0).removeFriendRequest(friendRequest.getId());
                    userRepository.save(user);
                    userRepository.save(friend.get(0));
                    return new ResponseEntity<>(FRIEND_ADDED_SUCCESSFULLY, HttpStatus.OK);
                }
            }


            if (user.getFriendsList().contains(friendId)) {
                return new ResponseEntity<>("User is already your friend", HttpStatus.CONFLICT);
            }

            FriendRequest friendRequest = new FriendRequest(id, friend.get(0).getId());
            user.addFriendRequest(friendRequest);
            userRepository.save(user);
            friend.get(0).addFriendRequest(friendRequest);
            userRepository.save(friend.get(0));

            return new ResponseEntity<>(FRIEND_ADDED_SUCCESSFULLY, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Friend add failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public List<FriendRequest> getFriendRequests(String id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(User::getFriendRequests).orElse(null);
    }

    public ResponseEntity<String> acceptFriendRequest(String id, String reqId, String authorizationHeader) {
        try {
            ResponseEntity<String> isUserAuthorized = isUserAuthorized(id, authorizationHeader);
            if (isUserAuthorized != null) {
                return isUserAuthorized;
            }

            Optional<User> user = userRepository.findById(id);
            if (user.isEmpty()) {
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            String friendId = user.get().getIdFromFriendRequest(reqId, id);
            if (friendId == null) {
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            Optional<User> friendUser = userRepository.findById(friendId);
            user.get().addFriend(friendUser.map(User::getId).orElse(null));
            user.get().removeFriendRequest(reqId);
            userRepository.save(user.get());
            friendUser.ifPresent(friend -> friend.addFriend(user.map(User::getId).orElse(null)));
            friendUser.ifPresent(friend -> friend.removeFriendRequest(reqId));
            assert friendUser.orElse(null) != null;
            userRepository.save(friendUser.orElse(null));

            return new ResponseEntity<>(FRIEND_ADDED_SUCCESSFULLY, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Friend add failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> deleteFriendRequest(String id, String reqId, String authorizationHeader) {
        try {
            Optional<User> user = userRepository.findById(id);
            ResponseEntity<String> isUserAuthorized = isUserAuthorized(id, authorizationHeader);
            if (isUserAuthorized != null) {
                return isUserAuthorized;
            }

            String friendId = user.map(value -> value.getIdFromFriendRequest(reqId, id)).orElse(null);
            if (friendId == null) {
                return new ResponseEntity<>(FRIEND_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            user.get().removeFriendRequest(reqId);
            userRepository.save(user.get());

            Optional<User> friendUser = userRepository.findById(friendId);
            if (friendUser.isPresent()) {
                friendUser.get().removeFriendRequest(reqId);
                userRepository.save(friendUser.get());
            } else {
                return new ResponseEntity<>(FRIEND_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>("Friend request deleted successfully", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Friend request delete failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<List<FoundUser>> searchUsers(String searchTerm) {
        try {
            List<User> users = userRepository.findByUsernameStartingWithIgnoreCase(searchTerm);
            List<FoundUser> foundUsers = new ArrayList<>();

            for (User user : users) {
                FoundUser foundUser = new FoundUser(
                        user.getEmail(),
                        user.getUsername(),
                        user.getProfilePicture(),
                        user.getDescription(),
                        user.getId(),
                        user.getFriendsList()
                );

                foundUsers.add(foundUser);
            }

            return new ResponseEntity<>(foundUsers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> deleteFriend(String id, String friendId, String authorizationHeader) {
        try {
            Optional<User> user = userRepository.findById(id);
            ResponseEntity<String> isUserAuthorized = isUserAuthorized(id, authorizationHeader);
            if (isUserAuthorized != null) {
                return isUserAuthorized;
            }

            if(user.isEmpty()){
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            if (!user.get().getFriendsList().contains(friendId)) {
                return new ResponseEntity<>("User is not your friend", HttpStatus.NOT_FOUND);
            }

            user.get().removeFriend(friendId);
            userRepository.save(user.get());

            Optional<User> friendUser = userRepository.findById(friendId);
            if (friendUser.isPresent()) {
                friendUser.get().removeFriend(id);
                userRepository.save(friendUser.get());
            } else {
                return new ResponseEntity<>(FRIEND_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>("Friend deleted successfully", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Friend delete failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> removeUser(String id, String authorizationHeader) {
        try {
            Optional<User> user = userRepository.findById(id);
            ResponseEntity<String> isUserAuthorized = isUserAuthorized(id, authorizationHeader);
            if (isUserAuthorized != null) {
                return isUserAuthorized;
            }

            if (authenticationService.extractUserIdFromToken(authorizationHeader).equals(id)) {
                return new ResponseEntity<>(USER_NOT_AUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            if (user.isEmpty()) {
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            User userToDelete = user.get();

            for (String friendId : userToDelete.getFriendsList()) {
                Optional<User> friendUser = userRepository.findById(friendId);
                if (friendUser.isPresent()) {
                    friendUser.get().removeFriend(id);
                    userRepository.save(friendUser.get());
                }
            }

            for (String friendId : userToDelete.getFriendRequestsIds()) {
                Optional<User> friendUser = userRepository.findById(friendId);
                if (friendUser.isPresent()) {
                    friendUser.get().removeFriendRequest(id);
                    userRepository.save(friendUser.get());
                }
            }

            List<Post> allPosts = postRepository.findAll();
            for (Post post : allPosts) {
                List<Comment> commentsToRemove = post.getComments().stream()
                        .filter(comment -> comment.getUserId().equals(id))
                        .toList();

                for (Comment comment : commentsToRemove) {
                    post.removeComment(comment);
                }
                postRepository.save(post);
            }

            for (String postId : userToDelete.getPosts()) {
                Optional<Post> post = postRepository.findById(postId);
                post.ifPresent(postRepository::delete);
            }

            userRepository.delete(userToDelete);

            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("User delete failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}