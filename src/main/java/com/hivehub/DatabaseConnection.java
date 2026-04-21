package com.hivehub;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {
    private static String url;
    private static String user;
    private static String password;
    private static SQLException initError;

    static {
        try {
            String host = System.getenv("DB_HOST");
            String port = System.getenv("DB_PORT");
            String database = System.getenv("DB_NAME");
            String dbUser = System.getenv("DB_USER");
            String dbPassword = System.getenv("DB_PASSWORD");
    
            if (host == null || host.isEmpty()) {
                java.util.Properties props = new java.util.Properties();
                java.io.InputStream input = DatabaseConnection.class
                    .getClassLoader()
                    .getResourceAsStream("config.properties");
    
                if (input == null) {
                    initError = new SQLException(
                        "Database not configured: DB_HOST env var is not set and " +
                        "config.properties was not found. " +
                        "Set DB_HOST, DB_NAME, DB_USER, DB_PASSWORD in Azure App Settings.");
                } else {
                    try {
                        props.load(input);
                        host = props.getProperty("db.host");
                        port = props.getProperty("db.port", "5432");
                        database = props.getProperty("db.name");
                        dbUser = props.getProperty("db.user");
                        dbPassword = props.getProperty("db.password");
                    } finally {
                        input.close();
                    }
                }
            }
    
            if (initError == null) {
                String resolvedPort = (port != null && !port.isEmpty()) ? port : "5432";
                url = "jdbc:postgresql://" + host + ":" + resolvedPort + "/" + database +
                      "?sslmode=disable&application_name=HiveHub";
                user = dbUser;
                password = dbPassword;
                System.out.println("Database configuration loaded. Host: " + host);
            }
    
        } catch (Exception e) {
            initError = new SQLException("Failed to load database configuration: " + e.getMessage(), e);
        }
    }
    
    
    public static Connection getConnection() throws SQLException {
        if (initError != null) {
            throw initError;
        }
        try {
            Class.forName("org.postgresql.Driver");
            return DriverManager.getConnection(url, user, password);
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
