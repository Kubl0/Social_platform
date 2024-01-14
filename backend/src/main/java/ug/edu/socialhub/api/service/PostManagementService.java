package ug.edu.socialhub.api.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ug.edu.socialhub.api.dto.PostDTO;
import ug.edu.socialhub.api.models.Comment;
import ug.edu.socialhub.api.models.Post;
import ug.edu.socialhub.api.models.User;
import ug.edu.socialhub.api.repository.PostRepository;
import ug.edu.socialhub.api.repository.UserRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PostManagementService {

    private static final String USER_NOT_FOUND = "User not found";
    private static final String POST_NOT_FOUND = "Post not found";
    private static final String USER_NOT_AUTHORIZED = "User not authorized";

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    private final AuthenticationService authenticationService;

    private final UserManagementService userManagementService;

    public PostManagementService(UserRepository userRepository, PostRepository postRepository, AuthenticationService authenticationService, UserManagementService userManagementService) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.authenticationService = authenticationService;
        this.userManagementService = userManagementService;
    }

    public ResponseEntity<String> addPost(String id, PostDTO post, String authorizationHeader) {
        try {
            Optional<User> postUser = userRepository.findById(id);
            if (postUser.isEmpty()) {
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            User user = postUser.get();

            if (authenticationService.isAuthorized(id, authorizationHeader)) {
                return new ResponseEntity<>(USER_NOT_AUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            if (!post.getWallId().equals("/") && (!userManagementService.isFriend(id, post.getWallId()))) {
                return new ResponseEntity<>(USER_NOT_AUTHORIZED, HttpStatus.UNAUTHORIZED);

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

    public Post getPostById(String id) {
        Optional<Post> post = postRepository.findById(id);
        return post.orElse(null);
    }

    public List<Post> getPosts(String id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(value -> postRepository.findAllById(value.getPosts())).orElse(null);
    }

    public List<Post> getAllPosts(String authorizationHeader) {
        if (authenticationService.isAdmin(authenticationService.extractUserIdFromToken(authorizationHeader))) {
            return Collections.emptyList();
        }


        return postRepository.findAll();
    }

    public ResponseEntity<String> addComment(String id, String authorizationHeader, Comment comment) {
        try {
            Optional<User> postUser = userRepository.findById(comment.getUserId());
            if (postUser.isEmpty()) {
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            if (authenticationService.isAuthorized(comment.getUserId(), authorizationHeader)) {
                return new ResponseEntity<>(USER_NOT_AUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            if (comment.getContent().isBlank()) {
                return new ResponseEntity<>("Comment content cannot be empty", HttpStatus.NOT_ACCEPTABLE);
            }

            Optional<Post> post = postRepository.findById(id);
            if (post.isEmpty()) {
                return new ResponseEntity<>(POST_NOT_FOUND, HttpStatus.NOT_FOUND);
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

    public List<Post> getPostsByWallId(String id) {
        return postRepository.findAllByWallId(id);
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

    public ResponseEntity<String> addLike(String id, String userId, String authorizationHeader) {
        try {
            Optional<User> postUser = userRepository.findById(userId);
            if (postUser.isEmpty()) {
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            if (authenticationService.isAuthorized(userId, authorizationHeader)) {
                return new ResponseEntity<>(USER_NOT_AUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            Optional<Post> post = postRepository.findById(id);
            if (post.isEmpty()) {
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
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
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            if (authenticationService.isAuthorized(userId, authorizationHeader)) {
                return new ResponseEntity<>(USER_NOT_AUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            Optional<Post> post = postRepository.findById(id);
            if (post.isEmpty()) {
                return new ResponseEntity<>(POST_NOT_FOUND, HttpStatus.NOT_FOUND);
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
                return new ResponseEntity<>(POST_NOT_FOUND, HttpStatus.NOT_FOUND);
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
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            if (authenticationService.isAuthorized(userId, authorizationHeader) && authenticationService.isAdmin(authenticationService.extractUserIdFromToken(authorizationHeader))) {
                return new ResponseEntity<>(USER_NOT_AUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            postToUpdate.removeComment(comment);
            postRepository.save(postToUpdate);

            return new ResponseEntity<>("Comment deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Comment delete failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> deletePost(String id, String authorizationHeader) {
        try {

            Optional<Post> post = postRepository.findById(id);
            Post postToDelete = post.orElse(null);

            if (postToDelete == null) {
                return new ResponseEntity<>(POST_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            Optional<User> postUser = userRepository.findById(postToDelete.getUserId());
            if (postUser.isEmpty()) {
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            User user = postUser.get();

            if (authenticationService.isAuthorized(user.getId(), authorizationHeader) && authenticationService.isAdmin(authenticationService.extractUserIdFromToken(authorizationHeader))) {
                return new ResponseEntity<>(USER_NOT_AUTHORIZED, HttpStatus.UNAUTHORIZED);
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
                return new ResponseEntity<>(POST_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            Optional<User> postUser = userRepository.findById(postToUpdate.get().getUserId());
            if (postUser.isEmpty()) {
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            User user = postUser.get();

            if (authenticationService.isAuthorized(user.getId(), authorizationHeader)) {
                return new ResponseEntity<>(USER_NOT_AUTHORIZED, HttpStatus.UNAUTHORIZED);
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
                return new ResponseEntity<>(POST_NOT_FOUND, HttpStatus.NOT_FOUND);
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
                return new ResponseEntity<>(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            if (authenticationService.isAuthorized(userId, authorizationHeader)) {
                return new ResponseEntity<>(USER_NOT_AUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            commentToEdit.setContent(content);
            postRepository.save(postToUpdate);

            return new ResponseEntity<>("Comment updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Comment update failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}