package com.hivehub.servlet;

import com.hivehub.dao.AuthUserDao;
import com.hivehub.dao.AuthUserDao.AuthUser;
import com.hivehub.service.EmailService;
import org.mindrot.jbcrypt.BCrypt;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "AuthServlet", urlPatterns = {
        "/api/auth/signup",
        "/api/auth/login",
        "/api/auth/forgot",
        "/api/auth/session"
})
public class AuthServlet extends HttpServlet {
    private AuthUserDao authUserDao;
    private EmailService emailService;

    @Override
    public void init() {
        authUserDao = new AuthUserDao();
        emailService = new EmailService();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!"/api/auth/session".equals(req.getServletPath())) {
            writeJson(resp, HttpServletResponse.SC_METHOD_NOT_ALLOWED,
                    "{\"ok\":false,\"message\":\"Method not allowed\"}");
            return;
        }

        HttpSession session = req.getSession(false);
        Object username = session == null ? null : session.getAttribute("username");
        Object userId = session == null ? null : session.getAttribute("userId");

        if (username == null) {
            writeJson(resp, HttpServletResponse.SC_OK, "{\"ok\":true,\"authenticated\":false}");
            return;
        }

        writeJson(resp, HttpServletResponse.SC_OK,
                "{\"ok\":true,\"authenticated\":true,\"userId\":\"" + escapeJson(String.valueOf(userId))
                        + "\",\"username\":\"" + escapeJson(username.toString()) + "\"}");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String path = req.getServletPath();

        switch (path) {
            case "/api/auth/signup":
                handleSignup(req, resp);
                break;
            case "/api/auth/login":
                handleLogin(req, resp);
                break;
            case "/api/auth/forgot":
                handleForgot(req, resp);
                break;
            default:
                writeJson(resp, HttpServletResponse.SC_NOT_FOUND,
                        "{\"ok\":false,\"message\":\"Not found\"}");
        }
    }

    private void handleSignup(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String email = safe(req.getParameter("email"));
        String fullName = safe(req.getParameter("name"));
        String username = safe(req.getParameter("username"));
        String password = safe(req.getParameter("password"));

        if (email.isEmpty() || fullName.isEmpty() || username.isEmpty() || password.isEmpty()) {
            writeJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    "{\"ok\":false,\"message\":\"All fields are required\"}");
            return;
        }

        if (password.length() < 8) {
            writeJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    "{\"ok\":false,\"message\":\"Password must be at least 8 characters\"}");
            return;
        }

        try {
            if (authUserDao.findByIdentifier(username) != null || authUserDao.emailExists(email)) {
                writeJson(resp, HttpServletResponse.SC_CONFLICT,
                        "{\"ok\":false,\"message\":\"Username or email already exists\"}");
                return;
            }

            String hash = BCrypt.hashpw(password, BCrypt.gensalt());
            boolean created = authUserDao.createUser(email, fullName, username, hash);
            if (!created) {
                writeJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                        "{\"ok\":false,\"message\":\"Unable to create account\"}");
                return;
            }
        } catch (SQLException e) {
            writeJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "{\"ok\":false,\"message\":\"Database error during signup\"}");
            return;
        }

        writeJson(resp, HttpServletResponse.SC_CREATED,
                "{\"ok\":true,\"message\":\"Account created\"}");
    }

    private void handleLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String identifier = safe(req.getParameter("identifier"));
        String password = safe(req.getParameter("password"));

        if (identifier.isEmpty() || password.isEmpty()) {
            writeJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    "{\"ok\":false,\"message\":\"Identifier and password are required\"}");
            return;
        }

        try {
            AuthUser user = authUserDao.findByIdentifier(identifier);
            if (user == null || !BCrypt.checkpw(password, user.getPasswordHash())) {
                writeJson(resp, HttpServletResponse.SC_UNAUTHORIZED,
                        "{\"ok\":false,\"message\":\"Invalid credentials\"}");
                return;
            }

            HttpSession session = req.getSession(true);
            session.setAttribute("userId", user.getUserId());
            session.setAttribute("username", user.getUsername());
            session.setAttribute("email", user.getEmail());

            writeJson(resp, HttpServletResponse.SC_OK,
                    "{\"ok\":true,\"message\":\"Login successful\",\"redirect\":\"Home.html\"}");
        } catch (SQLException e) {
            writeJson(resp, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "{\"ok\":false,\"message\":\"Database error during login\"}");
        }
    }

    private void handleForgot(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String email = safe(req.getParameter("email"));

        if (email.isEmpty()) {
            writeJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    "{\"ok\":false,\"message\":\"Email is required\"}");
            return;
        }

        try {
            AuthUser user = authUserDao.findByEmail(email);
            if (user != null) {
                String appBaseUrl = buildAppBaseUrl(req);
                boolean sent = emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), appBaseUrl);
                if (sent) {
                    System.out.println("Password reset email sent to: " + user.getEmail());
                } else {
                    System.out.println("Password reset email could not be sent for: " + user.getEmail());
                }
            }
        } catch (SQLException e) {
            System.out.println("Forgot-password DB lookup failed: " + e.getMessage());
        }

        writeJson(resp, HttpServletResponse.SC_OK,
                "{\"ok\":true,\"message\":\"If the email is registered, reset instructions were sent\"}");
    }

    private void writeJson(HttpServletResponse resp, int status, String body) throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.write(body);
        }
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }

    private String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }

    private String buildAppBaseUrl(HttpServletRequest req) {
        String scheme = req.getScheme();
        String host = req.getServerName();
        int port = req.getServerPort();
        String contextPath = req.getContextPath();

        boolean isDefaultPort = ("http".equalsIgnoreCase(scheme) && port == 80)
                || ("https".equalsIgnoreCase(scheme) && port == 443);

        if (isDefaultPort) {
            return scheme + "://" + host + contextPath;
        }

        return scheme + "://" + host + ":" + port + contextPath;
    }
}
