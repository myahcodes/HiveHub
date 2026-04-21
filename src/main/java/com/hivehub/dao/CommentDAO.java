package com.hivehub.dao;

import com.hivehub.DatabaseConnection;
import com.hivehub.model.Comment;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CommentDAO {

    public List<Comment> getCommentsByPost(long postId) throws SQLException {
        List<Comment> comments = new ArrayList<>();
        String sql = "SELECT c.comment_id, c.post_id, c.user_id, c.text, c.created_at, u.username " +
                     "FROM comments c JOIN users u ON c.user_id = u.user_id " +
                     "WHERE c.post_id = ? ORDER BY c.created_at ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, postId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    Comment c = new Comment();
                    c.setCommentId(rs.getLong("comment_id"));
                    c.setPostId(rs.getLong("post_id"));
                    c.setUserId(rs.getLong("user_id"));
                    c.setText(rs.getString("text"));
                    c.setCreatedAt(rs.getTimestamp("created_at"));
                    c.setUsername(rs.getString("username"));
                    comments.add(c);
                }
            }
        }
        return comments;
    }

    public Comment insertComment(long postId, long userId, String text) throws SQLException {
        String sql = "INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setLong(1, postId);
            pstmt.setLong(2, userId);
            pstmt.setString(3, text);
            pstmt.executeUpdate();

            try (ResultSet keys = pstmt.getGeneratedKeys()) {
                if (keys.next()) {
                    return getCommentById(conn, keys.getLong(1));
                }
            }
        }
        return null;
    }

    private Comment getCommentById(Connection conn, long commentId) throws SQLException {
        String sql = "SELECT c.comment_id, c.post_id, c.user_id, c.text, c.created_at, u.username " +
                     "FROM comments c JOIN users u ON c.user_id = u.user_id " +
                     "WHERE c.comment_id = ?";

        try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, commentId);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Comment c = new Comment();
                    c.setCommentId(rs.getLong("comment_id"));
                    c.setPostId(rs.getLong("post_id"));
                    c.setUserId(rs.getLong("user_id"));
                    c.setText(rs.getString("text"));
                    c.setCreatedAt(rs.getTimestamp("created_at"));
                    c.setUsername(rs.getString("username"));
                    return c;
                }
            }
        }
        return null;
    }
}
