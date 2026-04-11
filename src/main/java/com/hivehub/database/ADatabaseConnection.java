package com.hivehub;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    
    private static final String HOST;
    private static final String PORT;
    private static final String DATABASE;
    private static final String USER;
    private static final String PASSWORD;
    private static final String URL;
    
    static {
        // Read from Azure environment variables first
        String host = System.getenv("DB_HOST");
        String port = System.getenv("DB_PORT");
        String database = System.getenv("DB_NAME");
        String user = System.getenv("DB_USER");
        String password = System.getenv("DB_PASSWORD");
        
        // Fall back to config.properties for local development
        if (host == null || host.isEmpty()) {
            try {
                java.util.Properties props = new java.util.Properties();
                java.io.InputStream input = DatabaseConnection.class
                    .getClassLoader()
                    .getResourceAsStream("config.properties");
                
                if (input == null) {
                    throw new RuntimeException("config.properties not found");
                }
                
                props.load(input);
                host = props.getProperty("db.host");
                port = props.getProperty("db.port", "5432");
                database = props.getProperty("db.name");
                user = props.getProperty("db.user");
                password = props.getProperty("db.password");
                
            } catch (Exception e) {
                throw new RuntimeException("Failed to load configuration", e);
            }
        }
        
        HOST = host;
        PORT = port != null ? port : "5432";
        DATABASE = database;
        USER = user;
        PASSWORD = password;
        URL = "jdbc:postgresql://" + HOST + ":" + PORT + "/" + DATABASE + 
              "?sslmode=require&application_name=HiveHub";
              
        System.out.println("✓ Database configuration loaded. Host: " + HOST);
    }
    
    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("org.postgresql.Driver");
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (ClassNotFoundException e) {
            throw new SQLException("PostgreSQL JDBC Driver not found.", e);
        }
    }
    
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            System.out.println("✓ Connected to database successfully!");
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("✗ Connection test failed: " + e.getMessage());
            return false;
        }
    }
}
