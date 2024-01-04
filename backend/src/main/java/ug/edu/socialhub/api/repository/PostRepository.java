package ug.edu.socialhub.api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import ug.edu.socialhub.api.models.Post;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String>{
    @Query("{ 'userId' : ?0 }")
    List<Post> findByUserId(String userId);

    @Query("{ 'wallId' : ?0 }")
    List<Post> findAllByWallId(String id);
}