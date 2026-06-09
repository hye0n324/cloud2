package com.example.demo;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of PostService.
 * Handles mapping between Post (Entity) and PostDto.
 */
@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    public PostServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public List<PostDto> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public PostDto getPostById(Long id) {
        return postRepository.findById(id)
                .map(this::convertToDto)
                .orElse(null);
    }

    @Override
    public PostDto createPost(PostDto postDto) {
        Post post = convertToEntity(postDto);
        Post savedPost = postRepository.save(post);
        return convertToDto(savedPost);
    }

    @Override
    public PostDto updatePost(Long id, PostDto postDto) {
        return postRepository.findById(id)
                .map(existingPost -> {
                    existingPost.setTitle(postDto.getTitle());
                    existingPost.setContent(postDto.getContent());
                    Post updatedPost = postRepository.save(existingPost);
                    return convertToDto(updatedPost);
                })
                .orElse(null);
    }

    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    // Helper methods for mapping
    private PostDto convertToDto(Post post) {
        return new PostDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAuthor(),
                post.getCreatedAt()
        );
    }

    private Post convertToEntity(PostDto dto) {
        return new Post(
                dto.getId(),
                dto.getTitle(),
                dto.getContent(),
                dto.getAuthor(),
                dto.getCreatedAt()
        );
    }
}
