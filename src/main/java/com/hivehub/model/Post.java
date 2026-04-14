package com.hivehub.model;

import java.sql.Timestamp;

public class Post {
    private long postId;
    private long userId;
    private String title;
    private String body;
    private String tags;
    private Timestamp createdAt;
    private String username;
    private String imageUrl;
    private double rating;
    private String openTime;
    private String location;


    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    
    public String getOpenTime() { return openTime; }
    public void setOpenTime(String openTime) { this.openTime = openTime; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public long getPostId() { return postId; }
    public void setPostId(long postId) { this.postId = postId; }

    public long getUserId() { return userId; }
    public void setUserId(long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
