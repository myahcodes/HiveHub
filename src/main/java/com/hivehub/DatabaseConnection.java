package com.hivehub.database;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public final class DatabaseConnection {
    private static final String DEFAULT_URL =
            "jdbc:mysql://localhost:3306/hivehub?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC";
    private static final String DEFAULT_USER = "root";
    private static final String DEFAULT_PASSWORD = "";

    private static String dbUrl = DEFAULT_URL;
    private static String dbUser = DEFAULT_USER;
    private static String dbPassword = DEFAULT_PASSWORD;

    static {
        loadConfig();
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new IllegalStateException("MySQL driver not found on classpath", e);
        }
    }

    private DatabaseConnection() {
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(dbUrl, dbUser, dbPassword);
    }

    private static void loadConfig() {
        Properties props = new Properties();

        try (InputStream in = DatabaseConnection.class.getClassLoader().getResourceAsStream("database.properties")) {
            if (in != null) {
                props.load(in);
            }
        } catch (IOException ignored) {
            // Fallback to env/default config.
        }

        dbUrl = pickValue(
                System.getenv("DB_URL"),
                props.getProperty("db.url"),
                DEFAULT_URL
        );
        dbUser = pickValue(
                System.getenv("DB_USERNAME"),
                props.getProperty("db.username"),
                DEFAULT_USER
        );
        dbPassword = pickValue(
                System.getenv("DB_PASSWORD"),
                props.getProperty("db.password"),
                DEFAULT_PASSWORD
        );
    }

    private static String pickValue(String envValue, String propertyValue, String fallback) {
        if (envValue != null && !envValue.trim().isEmpty()) {
            return envValue.trim();
        }
        if (propertyValue != null && !propertyValue.trim().isEmpty()) {
            return propertyValue.trim();
        }
        return fallback;
    }
}
