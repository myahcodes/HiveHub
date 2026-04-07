package com.hivehub.servlet;
import com.hivehub.dao.UserDAO;
import com.hivehub.model.User;
import org.mindrot.jbcrypt.BCrypt;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
import java.io.IOException;

@WebServlet("/register")
@MultipartConfig
public class RegisterServlet extends HttpServlet {
    private UserDAO userDAO;
    
    @Override
    public void init() {
        userDAO = new UserDAO();
        System.out.println("RegisterServlet initialized");
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        System.out.println("=== RegisterServlet doPost called ===");
        
        // Get parameters directly - FormData sends as regular form data, not multipart parts
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String email = request.getParameter("email");
        String name = request.getParameter("name");
        
        System.out.println("Extracted values:");
        System.out.println("Username: " + username);
        System.out.println("Email: " + email);
        System.out.println("Name: " + name);
        System.out.println("Password: " + (password != null ? "***" : "null"));
        
        if (username == null || username.trim().isEmpty() || 
            password == null || password.trim().isEmpty()) {
            System.out.println("Missing required fields - redirecting");
            response.sendRedirect("SignUp.html?error=missing");
            return;
        }
        
        try {
            System.out.println("Hashing password...");
            String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
            
            System.out.println("Creating User object...");
            User newUser = new User();
            newUser.setUsername(username.trim());
            newUser.setFirstName(name != null ? name.trim() : "");
            newUser.setEmail(email != null ? email.trim() : "");
            newUser.setPassword(hashedPassword);
            
            System.out.println("Calling userDAO.insertUser()...");
            boolean success = userDAO.insertUser(newUser);
            System.out.println("Insert result: " + success);
            
            if (success) {
                System.out.println("User inserted successfully! User ID: " + newUser.getUserId());
                HttpSession session = request.getSession();
                session.setAttribute("user", newUser);
                session.setAttribute("userId", newUser.getUserId());
                session.setAttribute("username", newUser.getUsername());
                
                System.out.println("Redirecting to Home.html");
                response.sendRedirect("Home.html");
            } else {
                System.out.println("Insert failed - redirecting with error");
                response.sendRedirect("SignUp.html?error=failed");
            }
            
        } catch (Exception e) {
            System.out.println("EXCEPTION in registration:");
            e.printStackTrace();
            if (e.getMessage() != null && e.getMessage().contains("Duplicate")) {
                response.sendRedirect("SignUp.html?error=duplicate");
            } else {
                response.sendRedirect("SignUp.html?error=system");
            }
        }
        
        System.out.println("=== RegisterServlet doPost finished ===");
    }
}