package com.hivehub.servlet;

import com.hivehub.dao.UserDAO;
import org.mindrot.jbcrypt.BCrypt;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/settings")
public class SettingsServlet extends HttpServlet {

    private UserDAO userDAO;

    @Override
    public void init() {
        userDAO = new UserDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        long userId = (long) session.getAttribute("userId");
        String action = request.getParameter("action");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (action == null || action.trim().isEmpty()) {
            response.getWriter().print("{\"success\":false,\"error\":\"No action specified\"}");
            return;
        }

        try {
            switch (action) {
                case "updateProfile": {
                    String firstName = request.getParameter("firstName");
                    String lastName = request.getParameter("lastName");
                    boolean success = userDAO.updateName(userId, firstName, lastName);
                    response.getWriter().print("{\"success\":" + success + "}");
                    break;
                }
                case "updateUsername": {
                    String username = request.getParameter("username");
                    if (userDAO.usernameExists(username)) {
                        response.getWriter().print("{\"success\":false,\"error\":\"Username already taken\"}");
                    } else {
                        boolean success = userDAO.updateUsername(userId, username);
                        if (success) session.setAttribute("username", username);
                        response.getWriter().print("{\"success\":" + success + "}");
                    }
                    break;
                }
                case "updateEmail": {
                    String email = request.getParameter("email");
                    boolean success = userDAO.updateEmail(userId, email);
                    response.getWriter().print("{\"success\":" + success + "}");
                    break;
                }
                case "updatePassword": {
                    String currentPassword = request.getParameter("currentPassword");
                    String newPassword = request.getParameter("newPassword");
                    String storedHash = userDAO.getPasswordHash(userId);
                    if (storedHash != null && BCrypt.checkpw(currentPassword, storedHash)) {
                        String newHash = BCrypt.hashpw(newPassword, BCrypt.gensalt());
                        boolean success = userDAO.updatePassword(userId, newHash);
                        response.getWriter().print("{\"success\":" + success + "}");
                    } else {
                        response.getWriter().print("{\"success\":false,\"error\":\"Current password incorrect\"}");
                    }
                    break;
                }
                default:
                    response.getWriter().print("{\"success\":false,\"error\":\"Unknown action\"}");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.getWriter().print("{\"success\":false,\"error\":\"Database error\"}");
        }
    }
}
