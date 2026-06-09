package com.example.demo;

import java.util.List;
import java.util.Optional;

/**
 * Repository Interface (DAO) for Post persistence.
 */
public interface PostRepository {
    List<Post> findAll();
    Optional<Post> findById(Long id);
    Post save(Post post);
    void deleteById(Long id);
}
