package ug.edu.socialhub.api.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ug.edu.socialhub.api.models.*;
import ug.edu.socialhub.api.repository.ChatRepository;
import ug.edu.socialhub.api.repository.PostRepository;
import ug.edu.socialhub.api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.security.Key;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ApiService {

    @Value("${jwt.secret}")
    private String secret;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ChatRepository chatRepository;
    private final PasswordEncoder passwordEncoder;


    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public ApiService(UserRepository userRepository, PostRepository postRepository, ChatRepository chatRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.chatRepository = chatRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @PostConstruct
    private void insertInitialAdmin() {
        List<User> admins = userRepository.findByUsername("admin");
        if (!admins.isEmpty()) {
            return;
        }
        User admin = new User();
        admin.setEmail("admin@admin.pl");
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setType("admin");
        userRepository.save(admin);
    }

    public List<FoundUser> getAllUsers(String authorizationHeader) {
        if(!isAdmin(extractUserIdFromToken(authorizationHeader))){
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


    public ResponseEntity<String> addUser(User user) {
        try {
            List<User> users = userRepository.findByUsername(user.getUsername());
            if (!users.isEmpty()) {
                return new ResponseEntity<>("Username already taken", HttpStatus.CONFLICT);
            }
            users = userRepository.findByEmail(user.getEmail());
            if (!users.isEmpty()) {
                return new ResponseEntity<>("Email already taken", HttpStatus.CONFLICT);
            }
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
                return new ResponseEntity<>(new LoginResponse("User login failed", null, null, false, null), HttpStatus.UNAUTHORIZED);
            }
            User foundUser = users.get(0);

            if (passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
                return ResponseEntity.ok().body(new LoginResponse("User logged in successfully", foundUser, generateJwtToken(foundUser), true, foundUser.getId()));
            } else {
                return new ResponseEntity<>(new LoginResponse("User login failed", null, null, false, null), HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(new LoginResponse("User login failed", null, null, false, null), HttpStatus.INTERNAL_SERVER_ERROR);
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

    public String test(String token) {
        if (isValidToken(token)) {
            return "Token is valid";
        } else {
            return "Token is invalid";
        }
    }

    private boolean isValidToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public FoundUser getUserById(String id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(value -> new FoundUser(value.getEmail(), value.getUsername(), value.getProfilePicture(), value.getDescription(), value.getId(), value.getFriendsList())).orElse(null);
    }


    public ResponseEntity<String> updateUser(String id, FoundUser user, String authorizationHeader) {
        try {
            Optional<User> foundUser = userRepository.findById(id);
            if (foundUser.isEmpty()) {
                return new ResponseEntity<>("User update failed", HttpStatus.NOT_FOUND);
            }

            if (isAuthorized(id, authorizationHeader)) {
                return new ResponseEntity<>("User update failed", HttpStatus.UNAUTHORIZED);
            }

            User userToUpdate = foundUser.get();
            userToUpdate.setEmail(user.getEmail());
            userToUpdate.setUsername(user.getUsername());
            userToUpdate.setProfilePicture(user.getProfilePicture());
            userToUpdate.setDescription(user.getDescription());

            userRepository.save(userToUpdate);
            return new ResponseEntity<>("User updated succesfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("User update failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public String extractToken(String authorizationHeader) {
        String[] parts = authorizationHeader.split(" ");
        if (parts.length == 2 && parts[0].equalsIgnoreCase("Bearer")) {
            return parts[1];
        } else {
            throw new IllegalArgumentException("Invalid or missing JWT token");
        }
    }

    public ResponseEntity<String> addPost(String id, Post post, String authorizationHeader) {
        try {
            Optional<User> postUser = userRepository.findById(id);
            if (postUser.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            User user = postUser.get();

            if (isAuthorized(id, authorizationHeader)) {
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
            }

            if (!post.getWallId().equals("/")) {
                if (!isFriend(id, post.getWallId())) {
                    return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
                }
            }

            Post newPost = new Post();
            newPost.setUserId(id);
            newPost.setContent(post.getContent());
            newPost.setWallId(post.getWallId());
            postRepository.save(newPost);
            user.addPost(newPost.getId());
            userRepository.save(user);

            return new ResponseEntity<>("Post added succesfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Post add failed", HttpStatus.INTERNAL_SERVER_ERROR);
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

    public List<Post> getPosts(String id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(value -> postRepository.findAllById(value.getPosts())).orElse(null);
    }

    public List<Post> getAllPosts(String authorizationHeader) {
        if(!isAdmin(extractUserIdFromToken(authorizationHeader))){
            return Collections.emptyList();
        }

        System.out.println("getAllPosts");

        return postRepository.findAll();
    }

    public List<Post> getWallPosts(String id) {
        return postRepository.findAllByWallId(id);
    }

    public ResponseEntity<String> addComment(String id, String authorizationHeader, Comment comment) {
        try {
            Optional<User> postUser = userRepository.findById(comment.getUserId());
            if (postUser.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            User user = postUser.get();

            if (isAuthorized(comment.getUserId(), authorizationHeader)) {
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
            }

            if(comment.getContent().isBlank()){
                return new ResponseEntity<>("Comment content cannot be empty", HttpStatus.NOT_ACCEPTABLE);
            }

            Optional<Post> post = postRepository.findById(id);
            if (post.isEmpty()) {
                return new ResponseEntity<>("Post not found", HttpStatus.NOT_FOUND);
            }

            Post postToUpdate = post.get();
            Comment newComment = new Comment(comment.getUserId(), comment.getContent());
            postToUpdate.addComment(newComment);
            postRepository.save(postToUpdate);

            return new ResponseEntity<>("Comment added succesfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Comment add failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    public List<Comment> getComments(String id) {
        Optional<Post> post = postRepository.findById(id);
        return post.map(Post::getComments).orElse(null);
    }

    public ResponseEntity<String> addFriendRequest(String id, String username, String authorizationHeader) {
        try {
            Optional<User> user = userRepository.findById(id);
            if (user.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            if (isAuthorized(id, authorizationHeader)) {
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
            }
            List<User> friend = userRepository.findByUsername(username);
            if (friend.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            if (friend.get(0).getId().equals(id)) {
                return new ResponseEntity<>("Can't invite yourself", HttpStatus.NOT_FOUND);
            }

            String friendId = friend.get(0).getId();

            for (FriendRequest friendRequest : user.get().getFriendRequests()) {
                if (friendRequest.getSenderId().equals(id) && friendRequest.getReceiverId().equals(friendId)) {
                    return new ResponseEntity<>("Friend request already sent", HttpStatus.CONFLICT);
                }
            }

            for (FriendRequest friendRequest : user.get().getFriendRequests()) {
                if (friendRequest.getReceiverId().equals(id) && friendRequest.getSenderId().equals(friendId)) {
                    user.get().addFriend(friendId);
                    user.get().removeFriendRequest(friendRequest.getId());
                    friend.get(0).addFriend(id);
                    friend.get(0).removeFriendRequest(friendRequest.getId());
                    userRepository.save(user.get());
                    userRepository.save(friend.get(0));
                    return new ResponseEntity<>("Friend added succesfully", HttpStatus.OK);
                }
            }


            if (user.get().getFriendsList().contains(friendId)) {
                return new ResponseEntity<>("User is already your friend", HttpStatus.CONFLICT);
            }

            FriendRequest friendRequest = new FriendRequest(id, friend.get(0).getId());
            user.get().addFriendRequest(friendRequest);
            userRepository.save(user.get());
            friend.get(0).addFriendRequest(friendRequest);
            userRepository.save(friend.get(0));

            return new ResponseEntity<>("Friend added succesfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Friend add failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public List<FriendRequest> getFriendRequests(String id) {
        Optional<User> user = userRepository.findById(id);
        return user.get().getFriendRequests();
    }

    public ResponseEntity<String> acceptFriendRequest(String id, String reqId, String authorizationHeader) {
        try {
            Optional<User> user = userRepository.findById(id);
            if (user.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            if (isAuthorized(id, authorizationHeader)) {
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
            }

            String friendId = user.get().getIdFromFriendRequest(reqId, id);
            if (friendId == null) {
                return new ResponseEntity<>("Friend not found", HttpStatus.NOT_FOUND);
            }

            Optional<User> friendUser = userRepository.findById(friendId);
            user.get().addFriend(friendUser.get().getId());
            user.get().removeFriendRequest(reqId);
            userRepository.save(user.get());


            friendUser.get().addFriend(user.get().getId());
            friendUser.get().removeFriendRequest(reqId);
            userRepository.save(friendUser.get());

            return new ResponseEntity<>("Friend added succesfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Friend add failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    public ResponseEntity<String> deleteFriendRequest(String id, String reqId, String authorizationHeader) {
        try {
            Optional<User> user = userRepository.findById(id);
            if (user.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            if (isAuthorized(id, authorizationHeader)) {
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
            }

            String friendId = user.get().getIdFromFriendRequest(reqId, id);
            if (friendId == null) {
                return new ResponseEntity<>("Friend not found", HttpStatus.NOT_FOUND);
            }

            user.get().removeFriendRequest(reqId);
            userRepository.save(user.get());

            Optional<User> friendUser = userRepository.findById(friendId);
            if (friendUser.isPresent()) {
                friendUser.get().removeFriendRequest(reqId);
                userRepository.save(friendUser.get());
            } else {
                return new ResponseEntity<>("Friend not found", HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>("Friend request deleted successfully", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Friend request delete failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public List<Post> getPostsByWallId(String id) {
        return postRepository.findAllByWallId(id);
    }

    public boolean isFriend(String id, String userId) {
        Optional<User> user = userRepository.findById(id);
        if (id.equals(userId)) {
            return true;
        }
        return user.map(value -> value.getFriendsList().contains(userId)).orElse(false);
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

  public ResponseEntity<List<Post>> getPostsFromFriends(String id) {
        try {
            Optional<User> user = userRepository.findById(id);
            if (user.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            List<Post> posts = new ArrayList<>();
            for (String friendId : user.get().getFriendsList()) {
                posts.addAll(postRepository.findByUserId(friendId));
            }

            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
  
    public ResponseEntity<String> deleteFriend(String id, String friendId, String authorizationHeader) {
        try {
            Optional<User> user = userRepository.findById(id);
            if (user.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            if (isAuthorized(id, authorizationHeader)) {
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
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
                return new ResponseEntity<>("Friend not found", HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>("Friend deleted successfully", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Friend delete failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> addLike(String id, String userId, String authorizationHeader) {
        try {
            Optional<User> postUser = userRepository.findById(userId);
            if (postUser.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            User user = postUser.get();

            if (isAuthorized(userId, authorizationHeader)) {
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
            }

            Optional<Post> post = postRepository.findById(id);
            if (post.isEmpty()) {
                return new ResponseEntity<>("Post not found", HttpStatus.NOT_FOUND);
            }

            if (post.get().getLikes().contains(userId)) {
                return new ResponseEntity<>("Like already added", HttpStatus.CONFLICT);
            }

            Post postToUpdate = post.get();
            postToUpdate.addLike(userId);
            postRepository.save(postToUpdate);

            return new ResponseEntity<>("Like added succesfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Like add failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public List<String> getLikes(String id) {
        Optional<Post> post = postRepository.findById(id);
        return post.map(Post::getLikes).orElse(null);
    }

    public ResponseEntity<String> deleteLike(String id, String userId, String authorizationHeader) {
        try {
            Optional<User> postUser = userRepository.findById(userId);
            if (postUser.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            User user = postUser.get();

            if (isAuthorized(userId, authorizationHeader)) {
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
            }

            Optional<Post> post = postRepository.findById(id);
            if (post.isEmpty()) {
                return new ResponseEntity<>("Post not found", HttpStatus.NOT_FOUND);
            }

            if (!post.get().getLikes().contains(userId)) {
                return new ResponseEntity<>("Like not found", HttpStatus.NOT_FOUND);
            }

            Post postToUpdate = post.get();
            postToUpdate.removeLike(userId);
            postRepository.save(postToUpdate);

            return new ResponseEntity<>("Like deleted succesfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Like delete failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public boolean isLiked(String id, String userId) {
        Optional<Post> post = postRepository.findById(id);
        return post.map(value -> value.getLikes().contains(userId)).orElse(false);
    }

    public ResponseEntity<String> deleteComment(String postId, String commentId, String authorizationHeader) {
        try {
            Optional<Post> post = postRepository.findById(postId);
            if (post.isEmpty()) {
                return new ResponseEntity<>("Post not found", HttpStatus.NOT_FOUND);
            }

            Post postToUpdate = post.get();
            Optional<Comment> commentToDelete = postToUpdate.getComments().stream()
                    .filter(comment -> comment.getId().equals(commentId))
                    .findFirst();

            if (commentToDelete.isEmpty()) {
                return new ResponseEntity<>("Comment not found", HttpStatus.NOT_FOUND);
            }

            Comment comment = commentToDelete.get();
            String userId = comment.getUserId();

            Optional<User> user = userRepository.findById(userId);

            if (user.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            if (isAuthorized(userId, authorizationHeader) && !isAdmin(extractUserIdFromToken(authorizationHeader))){
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
            }

            postToUpdate.removeComment(comment);
            postRepository.save(postToUpdate);

            return new ResponseEntity<>("Comment deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Comment delete failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public String extractUserIdFromToken(String authorizationHeader) {
        try {
            String token = extractToken(authorizationHeader);
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject(); // This should contain the user ID
        } catch (Exception e) {
            return null; // Handle the exception or return an appropriate value based on your needs
        }
    }

    public boolean isAdmin(String id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(value -> value.getType().equals("admin")).orElse(false);
    }

    public ResponseEntity<String> deletePost(String id, String authorizationHeader) {
        try {

            Optional<Post> post = postRepository.findById(id);
            Post postToDelete = post.get();

            Optional<User> postUser = userRepository.findById(postToDelete.getUserId());
            if (postUser.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
            User user = postUser.get();

            if (isAuthorized(user.getId(), authorizationHeader) && !isAdmin(extractUserIdFromToken(authorizationHeader))){
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
            }

            Post postToUpdate = post.get();
            user.removePost(postToUpdate.getId());
            userRepository.save(user);
            postRepository.delete(postToUpdate);

            return new ResponseEntity<>("Post deleted succesfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Post delete failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    public ResponseEntity<String> updatePost(String id, String content, String authorizationHeader) {
        try {
            Optional<Post> postToUpdate = postRepository.findById(id);
            if (postToUpdate.isEmpty()) {
                return new ResponseEntity<>("Post not found", HttpStatus.NOT_FOUND);
            }

            Optional<User> postUser = userRepository.findById(postToUpdate.get().getUserId());
            if (postUser.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
            User user = postUser.get();

            if (isAuthorized(user.getId(), authorizationHeader)) {
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
            }

            Post postToEdit = postToUpdate.get();
            postToEdit.setContent(content);
            postRepository.save(postToEdit);

            return new ResponseEntity<>("Post updated succesfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Post update failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> updateComment(String postId, String commentId, String content, String authorizationHeader) {
        try {
            Optional<Post> post = postRepository.findById(postId);
            if (post.isEmpty()) {
                return new ResponseEntity<>("Post not found", HttpStatus.NOT_FOUND);
            }

            Post postToUpdate = post.get();
            Optional<Comment> commentToUpdate = postToUpdate.getComments().stream()
                    .filter(comment1 -> comment1.getId().equals(commentId))
                    .findFirst();

            if (commentToUpdate.isEmpty()) {
                return new ResponseEntity<>("Comment not found", HttpStatus.NOT_FOUND);
            }

            Comment commentToEdit = commentToUpdate.get();
            String userId = commentToEdit.getUserId();

            Optional<User> user = userRepository.findById(userId);

            if (user.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            if (isAuthorized(userId, authorizationHeader)) {
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
            }

            commentToEdit.setContent(content);
            postRepository.save(postToUpdate);

            return new ResponseEntity<>("Comment updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Comment update failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
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



    public ResponseEntity<String> removeUser(String id, String authorizationHeader) {
        try {
            Optional<User> user = userRepository.findById(id);
            if (user.isEmpty()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            if (isAuthorized(id, authorizationHeader) && !isAdmin(extractUserIdFromToken(authorizationHeader))){
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
            }

            if(extractUserIdFromToken(authorizationHeader).equals(id)){
                return new ResponseEntity<>("User not authorized", HttpStatus.UNAUTHORIZED);
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
                        .collect(Collectors.toList());

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




