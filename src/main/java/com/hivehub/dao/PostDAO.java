package com.hivehub.dao;

import com.hivehub.DatabaseConnection;
import com.hivehub.model.Post;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PostDAO {

    public boolean insertPost(Post post) throws SQLException {
        String sql = "INSERT INTO posts (user_id, title, body, tags) VALUES (?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setLong(1, post.getUserId());
            pstmt.setString(2, post.getTitle());
            pstmt.setString(3, post.getBody());
            pstmt.setString(4, post.getTags());

            int rows = pstmt.executeUpdate();

            if (rows > 0) {
                try (ResultSet keys = pstmt.getGeneratedKeys()) {
                    if (keys.next()) post.setPostId(keys.getLong(1));
                }
                return true;
            }
        }
        return false;
    }

    public List<Post> getAllPosts() throws SQLException {
        List<Post> posts = new ArrayList<>();
        String sql = "SELECT * FROM posts ORDER BY created_at DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                Post post = new Post();
                post.setPostId(rs.getLong("post_id"));
                post.setUserId(rs.getLong("user_id"));
                post.setTitle(rs.getString("title"));
                post.setBody(rs.getString("body"));
                post.setTags(rs.getString("tags"));
                post.setCreatedAt(rs.getTimestamp("created_at"));
                posts.add(post);
            }
        }
        return posts;
    }

    public List<Post> getPostsByUser(long userId) throws SQLException {
        List<Post> posts = new ArrayList<>();
        String sql = "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1, userId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Post post = new Post();
                    post.setPostId(rs.getLong("post_id"));
                    post.setUserId(rs.getLong("user_id"));
                    post.setTitle(rs.getString("title"));
                    post.setBody(rs.getString("body"));
                    post.setTags(rs.getString("tags"));
                    post.setCreatedAt(rs.getTimestamp("created_at"));
                    posts.add(post);
                }
            }
        }
        return posts;
    }
}
