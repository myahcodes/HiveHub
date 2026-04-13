package com.hivehub.model;

public class UserRecord {
    private final String email;
    private final String fullName;
    private final String username;
    private final String passwordHash;
    private final long createdAt;

    public UserRecord(String email, String fullName, String username, String passwordHash, long createdAt) {
        this.email = email;
        this.fullName = fullName;
        this.username = username;
        this.passwordHash = passwordHash;
        this.createdAt = createdAt;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getUsername() {
        return username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public long getCreatedAt() {
        return createdAt;
    }
}
