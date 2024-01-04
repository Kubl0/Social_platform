package ug.edu.socialhub.api.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import ug.edu.socialhub.api.models.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String>{
    @Query("{ 'email' : ?0 }")
    List<User> findByEmail(String email);

    @Query("{ 'username' : ?0 }")
    List<User> findByUsername(String username);

    List<User> findByUsernameStartingWithIgnoreCase(String searchTerm);
}
