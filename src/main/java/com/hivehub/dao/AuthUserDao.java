package com.hivehub.dao;

import com.hivehub.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AuthUserDao {

    public boolean createUser(String email, String fullName, String username, String passwordHash) throws SQLException {
        String sql = "INSERT INTO users (username, first_name, last_name, email, password, role_id) VALUES (?, ?, ?, ?, ?, ?)";
        String firstName = splitFirstName(fullName);
        String lastName = splitLastName(fullName);

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, username);
            ps.setString(2, firstName);
            ps.setString(3, lastName);
            ps.setString(4, email);
            ps.setString(5, passwordHash);
            ps.setInt(6, 2);

            return ps.executeUpdate() > 0;
        }
    }

    public AuthUser findByIdentifier(String identifier) throws SQLException {
        String sql = "SELECT user_id, username, email, password FROM users WHERE username = ? OR email = ? LIMIT 1";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, identifier);
            ps.setString(2, identifier);

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    return null;
                }

                return new AuthUser(
                        rs.getLong("user_id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password")
                );
            }
        }
    }

    public boolean emailExists(String email) throws SQLException {
        String sql = "SELECT 1 FROM users WHERE email = ? LIMIT 1";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    public AuthUser findByEmail(String email) throws SQLException {
        String sql = "SELECT user_id, username, email, password FROM users WHERE email = ? LIMIT 1";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    return null;
                }

                return new AuthUser(
                        rs.getLong("user_id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password")
                );
            }
        }
    }

    private String splitFirstName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "";
        }
        String[] parts = fullName.trim().split("\\s+", 2);
        return parts[0];
    }

    private String splitLastName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "";
        }
        String[] parts = fullName.trim().split("\\s+", 2);
        return parts.length > 1 ? parts[1] : "";
    }

    public static final class AuthUser {
        private final long userId;
        private final String username;
        private final String email;
        private final String passwordHash;

        public AuthUser(long userId, String username, String email, String passwordHash) {
            this.userId = userId;
            this.username = username;
            this.email = email;
            this.passwordHash = passwordHash;
        }

        public long getUserId() {
            return userId;
        }

        public String getUsername() {
            return username;
        }

        public String getEmail() {
            return email;
        }

        public String getPasswordHash() {
            return passwordHash;
        }
    }
}
