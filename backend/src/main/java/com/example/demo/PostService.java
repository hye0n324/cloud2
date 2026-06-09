package com.example.demo;

import java.util.List;

/**
 * Service Interface for Post business logic.
 */
public interface PostService {
    List<PostDto> getAllPosts();
    PostDto getPostById(Long id);
    PostDto createPost(PostDto postDto);
    PostDto updatePost(Long id, PostDto postDto);
    void deletePost(Long id);
}
