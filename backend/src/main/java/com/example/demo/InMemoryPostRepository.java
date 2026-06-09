package com.example.demo;

import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

/**
 * In-memory implementation of PostRepository using ArrayList.
 */
@Repository
public class InMemoryPostRepository implements PostRepository {
    private final List<Post> posts = new CopyOnWriteArrayList<>();
    private final AtomicLong counter = new AtomicLong();

    public InMemoryPostRepository() {
        // Sample data
        save(new Post(null, "Welcome to the Layered Board", "Refactored to Service/Repo pattern.", "Admin", LocalDateTime.now()));
        save(new Post(null, "Architecture Guide", "Controller -> Service -> Repository", "User1", LocalDateTime.now()));
    }

    @Override
    public List<Post> findAll() {
        return posts;
    }

    @Override
    public Optional<Post> findById(Long id) {
        return posts.stream()
                .filter(post -> post.getId().equals(id))
                .findFirst();
    }

    @Override
    public Post save(Post post) {
        if (post.getId() == null) {
            post.setId(counter.incrementAndGet());
            if (post.getCreatedAt() == null) {
                post.setCreatedAt(LocalDateTime.now());
            }
            posts.add(post);
        } else {
            // Update existing post
            for (int i = 0; i < posts.size(); i++) {
                if (posts.get(i).getId().equals(post.getId())) {
                    posts.set(i, post);
                    break;
                }
            }
        }
        return post;
    }

    @Override
    public void deleteById(Long id) {
        posts.removeIf(post -> post.getId().equals(id));
    }
}
