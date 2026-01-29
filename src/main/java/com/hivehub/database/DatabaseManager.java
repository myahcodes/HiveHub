package com.hivehub.database;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.io.InputStream;
import java.util.Properties;

public class DatabaseManager {
    private static HikariDataSource dataSource;
    
    static {
        try {
            Properties props = new Properties();
            InputStream input = DatabaseManager.class
                .getClassLoader()
                .getResourceAsStream("database.properties");
            
            if (input == null) {
                throw new RuntimeException("Unable to find database.properties");
            }
            
            props.load(input);
            
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(props.getProperty("db.url"));
            config.setUsername(props.getProperty("db.username"));
            config.setPassword(props.getProperty("db.password"));
            config.setDriverClassName(props.getProperty("db.driver"));
            config.setMaximumPoolSize(Integer.parseInt(props.getProperty("db.pool.maxPoolSize", "10")));
            
            dataSource = new HikariDataSource(config);
            
            System.out.println("✓ Database connection pool initialized");
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize database", e);
        }
    }
    
    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
    
    public static void closePool() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }
}