package com.hivehub.servlet;

import com.hivehub.dao.UserDAO;
import com.hivehub.model.User;
import org.mindrot.jbcrypt.BCrypt;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    private UserDAO userDAO;

    @Override
    public void init() {
        userDAO = new UserDAO();
        System.out.println("LoginServlet initialized");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        System.out.println("=== LoginServlet doPost called ===");

        String usernameOrEmail = request.getParameter("username");
        String password = request.getParameter("password");

        System.out.println("Login attempt: " + usernameOrEmail);

        if (usernameOrEmail == null || usernameOrEmail.trim().isEmpty() ||
            password == null || password.trim().isEmpty()) {
            response.sendRedirect("Login.html?error=missing");
            return;
        }

        try {
            User user = userDAO.authenticateUser(usernameOrEmail.trim(), password);

            if (user != null && BCrypt.checkpw(password, user.getPassword())) {
                System.out.println("Login successful: " + user.getUsername());

                HttpSession session = request.getSession();
                session.setAttribute("user", user);
                session.setAttribute("userId", user.getUserId());
                session.setAttribute("username", user.getUsername());

                response.sendRedirect("Home.html");

            } else {
                System.out.println("Login failed for: " + usernameOrEmail);
                response.sendRedirect("Login.html?error=invalid");
            }

        } catch (SQLException e) {
            System.out.println("DB error during login:");
            e.printStackTrace();
            response.sendRedirect("Login.html?error=system");
        }

        System.out.println("=== LoginServlet doPost finished ===");
    }
}
