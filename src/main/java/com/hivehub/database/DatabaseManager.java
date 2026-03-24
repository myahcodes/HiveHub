package com.hivehub.database;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class DatabaseManager {
    private static HikariDataSource dataSource;
    
    static {
        try {
            String host = System.getenv("DB_HOST");
            String dbName = System.getenv("DB_NAME");
            String user = System.getenv("DB_USER");
            String password = System.getenv("DB_PASSWORD");

            // Fall back to database.properties for local development
            if (host == null || host.isEmpty()) {
                java.util.Properties props = new java.util.Properties();
                java.io.InputStream input = DatabaseManager.class
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
                config.setMaximumPoolSize(Integer.parseInt(
                    props.getProperty("db.pool.maxPoolSize", "10")));
                dataSource = new HikariDataSource(config);
                
            } else {
                // Azure environment variables
                String jdbcUrl = "jdbc:postgresql://" + host + "/" 
                    + dbName + "?sslmode=require";
                
                HikariConfig config = new HikariConfig();
                config.setJdbcUrl(jdbcUrl);
                config.setUsername(user);
                config.setPassword(password);
                config.setDriverClassName("org.postgresql.Driver");
                config.setMaximumPoolSize(10);
                dataSource = new HikariDataSource(config);
            }
            
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
