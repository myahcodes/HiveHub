package com.hivehub.dao;

import com.hivehub.DatabaseConnection;
import com.hivehub.model.User;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {
    
    public boolean insertUser(User user) throws SQLException {
        // Updated for CockroachDB with last_name and role_id
        String sql = "INSERT INTO users (username, first_name, last_name, email, password, role_id) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setString(1, user.getUsername());
            pstmt.setString(2, user.getFirstName());
            pstmt.setString(3, user.getLastName() != null ? user.getLastName() : "");
            pstmt.setString(4, user.getEmail());
            pstmt.setString(5, user.getPassword());
            pstmt.setInt(6, user.getRoleId());
            
            int affectedRows = pstmt.executeUpdate();
            
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        user.setUserId(generatedKeys.getLong(1));  // ← CHANGED to getLong
                    }
                }
                return true;
            }
        }
        
        return false;
    }
    
    public User authenticateUser(String usernameOrEmail, String password) throws SQLException {
        String sql = "SELECT user_id, username, email, password, first_name, last_name, role_id, created_at " +
                     "FROM users WHERE username = ? OR email = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, usernameOrEmail);
            pstmt.setString(2, usernameOrEmail);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    User user = new User();
                    user.setUserId(rs.getLong("user_id"));  // ← CHANGED to getLong
                    user.setUsername(rs.getString("username"));
                    user.setEmail(rs.getString("email"));
                    user.setPassword(rs.getString("password"));
                    user.setFirstName(rs.getString("first_name"));
                    user.setLastName(rs.getString("last_name"));
                    user.setRoleId(rs.getInt("role_id"));
                    user.setCreatedAt(rs.getTimestamp("created_at"));
                    return user;
                }
            }
        }
        
        return null;
    }
    
    public List<User> getAllUsers() throws SQLException {
        List<User> users = new ArrayList<>();
        String sql = "SELECT user_id, username, email, first_name, last_name, role_id, created_at FROM users";
        
        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                User user = new User();
                user.setUserId(rs.getLong("user_id"));  // ← CHANGED to getLong
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setFirstName(rs.getString("first_name"));
                user.setLastName(rs.getString("last_name"));
                user.setRoleId(rs.getInt("role_id"));
                user.setCreatedAt(rs.getTimestamp("created_at"));
                users.add(user);
            }
        }
        
        return users;
    }
    
    public boolean usernameExists(String username) throws SQLException {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, username);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        }
        
        return false;
    }

    public User findById(long userId) throws SQLException {
    String sql = "SELECT user_id, username, email, first_name, last_name, role_id, created_at " +
                 "FROM users WHERE user_id = ?";

    try (Connection conn = DatabaseConnection.getConnection();
         PreparedStatement pstmt = conn.prepareStatement(sql)) {

        pstmt.setLong(1, userId);

        try (ResultSet rs = pstmt.executeQuery()) {
            if (rs.next()) {
                User user = new User();
                user.setUserId(rs.getLong("user_id"));
                user.setUsername(rs.getString("username"));
                user.setEmail(rs.getString("email"));
                user.setFirstName(rs.getString("first_name"));
                user.setLastName(rs.getString("last_name"));
                user.setRoleId(rs.getInt("role_id"));
                user.setCreatedAt(rs.getTimestamp("created_at"));
                return user;
            }
        }
    }
    return null;
}
}
