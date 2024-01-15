package ug.edu.socialhub.api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import ug.edu.socialhub.api.models.Conversation;
import java.util.List;

@Repository
public interface ChatRepository extends MongoRepository<Conversation, String> {

    @Query("{'$or': [ {'userId': ?0, 'friendId': ?1}, {'userId': ?1, 'friendId': ?0} ]}")
    List<Conversation> findByUsers(String userId, String friendId);



}
