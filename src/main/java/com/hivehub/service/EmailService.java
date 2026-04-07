package com.hivehub.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

public class EmailService {
    private static final String SENDGRID_ENDPOINT = "https://api.sendgrid.com/v3/mail/send";

    private final String apiKey;
    private final String fromEmail;

    public EmailService() {
        Properties props = new Properties();
        try (InputStream in = EmailService.class.getClassLoader().getResourceAsStream("email.properties")) {
            if (in != null) {
                props.load(in);
            }
        } catch (IOException ignored) {
            // Env variables are primary; file is optional.
        }

        this.apiKey = pickValue(System.getenv("SENDGRID_API_KEY"), props.getProperty("sendgrid.apiKey"));
        this.fromEmail = pickValue(System.getenv("SENDGRID_FROM_EMAIL"), props.getProperty("sendgrid.fromEmail"));
    }

    public boolean isConfigured() {
        return !isBlank(apiKey) && !isBlank(fromEmail);
    }

    public boolean sendPasswordResetEmail(String toEmail, String username, String appBaseUrl) {
        if (!isConfigured()) {
            System.out.println("EmailService is not configured. Missing SENDGRID_API_KEY or SENDGRID_FROM_EMAIL.");
            return false;
        }

        String subject = "HiveHub password reset request";
        String message = "Hi " + safeName(username) + ",\n\n"
                + "We received a request to reset your HiveHub password.\n"
                + "If you made this request, please return to HiveHub and reset your password.\n\n"
                + "Login URL: " + appBaseUrl + "/Login.html\n\n"
                + "If you did not request this, you can ignore this message.\n";

        String payload = "{"
                + "\"personalizations\":[{\"to\":[{\"email\":\"" + escapeJson(toEmail) + "\"}]}],"
                + "\"from\":{\"email\":\"" + escapeJson(fromEmail) + "\"},"
                + "\"subject\":\"" + escapeJson(subject) + "\","
                + "\"content\":[{\"type\":\"text/plain\",\"value\":\"" + escapeJson(message) + "\"}]"
                + "}";

        HttpURLConnection connection = null;
        try {
            URL url = new URL(SENDGRID_ENDPOINT);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Authorization", "Bearer " + apiKey);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            byte[] bytes = payload.getBytes(StandardCharsets.UTF_8);
            try (OutputStream os = connection.getOutputStream()) {
                os.write(bytes);
            }

            int status = connection.getResponseCode();
            if (status < 200 || status >= 300) {
                System.out.println("SendGrid returned non-success status: " + status);
            }
            return status >= 200 && status < 300;
        } catch (Exception e) {
            System.out.println("SendGrid email send failed: " + e.getMessage());
            return false;
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    private String pickValue(String envValue, String propertyValue) {
        if (!isBlank(envValue)) {
            return envValue.trim();
        }
        if (!isBlank(propertyValue)) {
            return propertyValue.trim();
        }
        return "";
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String safeName(String username) {
        return isBlank(username) ? "there" : username.trim();
    }

    private String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n");
    }
}
