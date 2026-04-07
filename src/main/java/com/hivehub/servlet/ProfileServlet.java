package com.hivehub.servlet;

import com.hivehub.dao.PostDAO;
import com.hivehub.dao.UserDAO;
import com.hivehub.model.Post;
import com.hivehub.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/api/profile")
public class ProfileServlet extends HttpServlet {

    private UserDAO userDAO;
    private PostDAO postDAO;

    @Override
    public void init() {
        userDAO = new UserDAO();
        postDAO = new PostDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        long userId = (long) session.getAttribute("userId");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            User user = userDAO.findById(userId);
            List<Post> posts = postDAO.getPostsByUser(userId);

            PrintWriter out = response.getWriter();
            out.print("{");
            out.print("\"userId\":" + user.getUserId() + ",");
            out.print("\"username\":\"" + escapeJson(user.getUsername()) + "\",");
            out.print("\"firstName\":\"" + escapeJson(user.getFirstName()) + "\",");
            out.print("\"lastName\":\"" + escapeJson(user.getLastName()) + "\",");
            out.print("\"email\":\"" + escapeJson(user.getEmail()) + "\",");
            out.print("\"posts\":[");

            for (int i = 0; i < posts.size(); i++) {
                Post p = posts.get(i);
                out.print("{");
                out.print("\"postId\":" + p.getPostId() + ",");
                out.print("\"title\":\"" + escapeJson(p.getTitle()) + "\",");
                out.print("\"body\":\"" + escapeJson(p.getBody()) + "\",");
                out.print("\"tags\":\"" + escapeJson(p.getTags()) + "\",");
                out.print("\"createdAt\":\"" + p.getCreatedAt() + "\"");
                out.print("}");
                if (i < posts.size() - 1) out.print(",");
            }

            out.print("]}");

        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
