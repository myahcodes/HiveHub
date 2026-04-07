package com.hivehub.test;

import com.hivehub.database.DatabaseManager;
import java.sql.Connection;

public class TestConnection {
    public static void main(String[] args) {
        try {
            Connection conn = DatabaseManager.getConnection();
            System.out.println("✓ Connection successful!");
            System.out.println("Database: " + conn.getCatalog());
            conn.close();
        } catch (Exception e) {
            System.out.println("✗ Connection failed!");
            e.printStackTrace();
        }
    }
}