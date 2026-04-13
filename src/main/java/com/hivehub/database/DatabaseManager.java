package com.hivehub.database;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class DatabaseManager {
    private static volatile HikariDataSource dataSource;
    private static volatile boolean initialized = false;

    private static synchronized void initialize() throws SQLException {
        if (initialized) return;
        initialized = true;
        try {
            String host = System.getenv("DB_HOST");
            String dbName = System.getenv("DB_NAME");
            String user = System.getenv("DB_USER");
            String password = System.getenv("DB_PASSWORD");
    
            if (host == null || host.isEmpty()) {
                java.util.Properties props = new java.util.Properties();
                java.io.InputStream input = DatabaseManager.class
                    .getClassLoader()
                    .getResourceAsStream("database.properties");
    
                if (input == null) {
                    throw new SQLException(
                        "Database not configured: DB_HOST env var is not set and " +
                        "database.properties was not found in the classpath.");
                }
    
                try {
                    props.load(input);
                } finally {
                    input.close();
                }
    
                HikariConfig config = new HikariConfig();
                config.setJdbcUrl(props.getProperty("db.url"));
                config.setUsername(props.getProperty("db.username"));
                config.setPassword(props.getProperty("db.password"));
                config.setDriverClassName(props.getProperty("db.driver"));
                config.setMaximumPoolSize(Integer.parseInt(
                    props.getProperty("db.pool.maxPoolSize", "10")));
                dataSource = new HikariDataSource(config);
    
            } else {
                String jdbcUrl = "jdbc:postgresql://" + host + "/" + dbName + "?sslmode=require";
    
                HikariConfig config = new HikariConfig();
                config.setJdbcUrl(jdbcUrl);
                config.setUsername(user);
                config.setPassword(password);
                config.setDriverClassName("org.postgresql.Driver");
                config.setMaximumPoolSize(10);
                dataSource = new HikariDataSource(config);
            }
    
            System.out.println("Database connection pool initialized");
    
        } catch (SQLException e) {
            throw e;
        } catch (Exception e) {
            throw new SQLException("Failed to initialize database pool: " + e.getMessage(), e);
        }
    }

    
    public static Connection getConnection() throws SQLException {
        if (!initialized) {
            initialize();
        }
        return dataSource.getConnection();
    }

    
    public static void closePool() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }
}
