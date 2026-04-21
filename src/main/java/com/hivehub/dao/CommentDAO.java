package com.hivehub.dao;

import com.hivehub.DatabaseConnection;
import com.hivehub.model.Comment;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CommentDAO {

    public Comment insertComment(Comment comment) throws SQLException {
        String sql = "INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?) RETURNING comment_id, created_at";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setLong(1, comment.getPostId());
            pstmt.setLong(2, comment.getUserId());
            pstmt.setString(3, comment.getText());
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    comment.setCommentId(rs.getLong("comment_id"));
                    comment.setCreatedAt(rs.getTimestamp("created_at"));
                }
            }
        }
        return comment;
    }

    public List<Comment> getCommentsByPostId(long postId) throws SQLException {
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
}
