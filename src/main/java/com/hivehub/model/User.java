package com.hivehub.model;

import java.sql.Timestamp;

public class User {
    
    // Change from int to long for CockroachDB
    private long userId;  // ← CHANGED
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private int roleId;
    private Timestamp createdAt;
    private boolean isActive;
    
    public User() {
        this.roleId = 1;
        this.isActive = true;
    }
    
    // UPDATED getter/setter for userId
    public long getUserId() {  // ← CHANGED return type
        return userId;
    }
    
    public void setUserId(long userId) {  // ← CHANGED parameter type
        this.userId = userId;
    }
    
    // Keep all other getters/setters as they are
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public int getRoleId() {
        return roleId;
    }
    
    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }
    
    public Timestamp getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
