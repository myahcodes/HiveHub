package com.hivehub.servlet;

import com.hivehub.model.UserRecord;
import com.hivehub.store.InMemoryUserStore;
import org.mindrot.jbcrypt.BCrypt;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "AuthServlet", urlPatterns = {
        "/api/auth/signup",
        "/api/auth/login",
        "/api/auth/forgot",
        "/api/auth/session"
})
public class AuthServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if (!"/api/auth/session".equals(req.getServletPath())) {
            writeJson(resp, HttpServletResponse.SC_METHOD_NOT_ALLOWED,
                    "{\"ok\":false,\"message\":\"Method not allowed\"}");
            return;
        }

        HttpSession session = req.getSession(false);
        Object username = session == null ? null : session.getAttribute("username");

        if (username == null) {
            writeJson(resp, HttpServletResponse.SC_OK, "{\"ok\":true,\"authenticated\":false}");
            return;
        }

        writeJson(resp, HttpServletResponse.SC_OK,
                "{\"ok\":true,\"authenticated\":true,\"username\":\"" + escapeJson(username.toString()) + "\"}");
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

        String hash = BCrypt.hashpw(password, BCrypt.gensalt());
        UserRecord newUser = new UserRecord(email, fullName, username, hash, System.currentTimeMillis());

        if (!InMemoryUserStore.addUser(newUser)) {
            writeJson(resp, HttpServletResponse.SC_CONFLICT,
                    "{\"ok\":false,\"message\":\"Username or email already exists\"}");
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

        UserRecord user = InMemoryUserStore.findByIdentifier(identifier);
        if (user == null || !BCrypt.checkpw(password, user.getPasswordHash())) {
            writeJson(resp, HttpServletResponse.SC_UNAUTHORIZED,
                    "{\"ok\":false,\"message\":\"Invalid credentials\"}");
            return;
        }

        HttpSession session = req.getSession(true);
        session.setAttribute("username", user.getUsername());

        writeJson(resp, HttpServletResponse.SC_OK,
                "{\"ok\":true,\"message\":\"Login successful\",\"redirect\":\"Home.html\"}");
    }

    private void handleForgot(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String email = safe(req.getParameter("email"));

        if (email.isEmpty()) {
            writeJson(resp, HttpServletResponse.SC_BAD_REQUEST,
                    "{\"ok\":false,\"message\":\"Email is required\"}");
            return;
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
}
