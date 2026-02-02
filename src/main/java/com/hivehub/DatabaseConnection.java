package com.hivehub;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DatabaseConnection {
    
    private static Properties props = new Properties();
    
    // Load configuration on class initialization
    static {
        try {
            InputStream input = DatabaseConnection.class
                .getClassLoader()
                .getResourceAsStream("config.properties");
            
            if (input == null) {
                System.err.println("ERROR: config.properties not found!");
                System.err.println("Please create config.properties in src/main/resources/");
                System.err.println("Use config.properties.example as a template.");
                throw new RuntimeException("config.properties not found in classpath");
            }
            
            props.load(input);
            System.out.println("✓ Configuration loaded successfully");
            
        } catch (IOException e) {
            System.err.println("ERROR: Could not load config.properties");
            e.printStackTrace();
            throw new RuntimeException("Failed to load configuration", e);
        }
    }
    
    // Get values from config file
    private static final String HOST = props.getProperty("db.host");
    private static final String PORT = props.getProperty("db.port");
    private static final String DATABASE = props.getProperty("db.name");
    private static final String USER = props.getProperty("db.user");
    private static final String PASSWORD = props.getProperty("db.password");
    private static final String SSL_MODE = props.getProperty("db.sslmode", "verify-full");
    
    // Build connection URL
    private static final String URL = "jdbc:postgresql://" + HOST + ":" + PORT + "/" + DATABASE + 
        "?sslmode=" + SSL_MODE + "&application_name=HiveHub";
    
    /**
     * Get database connection
     * @return Connection to CockroachDB
     * @throws SQLException if connection fails
     */
    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("org.postgresql.Driver");
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (ClassNotFoundException e) {
            throw new SQLException("PostgreSQL JDBC Driver not found. " +
                "Make sure postgresql dependency is in pom.xml", e);
        }
    }
    
    /**
     * Test database connection
     * @return true if connection successful
     */
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            System.out.println("✓ Connected to CockroachDB successfully!");
            System.out.println("  Database: " + conn.getCatalog());
            System.out.println("  Host: " + HOST);
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("✗ Connection test failed: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}