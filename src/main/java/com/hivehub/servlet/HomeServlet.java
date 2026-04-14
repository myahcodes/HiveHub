package com.hivehub.servlet;

import com.hivehub.dao.PostDAO;
import com.hivehub.model.Post;
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

@WebServlet("/api/posts")
public class HomeServlet extends HttpServlet {

    private PostDAO postDAO;

    @Override
    public void init() {
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

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            List<Post> posts = postDAO.getAllPosts();
            PrintWriter out = response.getWriter();

            out.print("[");
            for (int i = 0; i < posts.size(); i++) {
                Post p = posts.get(i);
                out.print("{");
                out.print("\"postId\":" + p.getPostId() + ",");
                out.print("\"username\":\"" + escapeJson(p.getUsername()) + "\",");
                out.print("\"title\":\"" + escapeJson(p.getTitle()) + "\",");
                out.print("\"body\":\"" + escapeJson(p.getBody()) + "\",");
                out.print("\"tags\":\"" + escapeJson(p.getTags()) + "\",");
                out.print("\"createdAt\":\"" + p.getCreatedAt() + "\",");
                out.print("\"imageUrl\":" + (p.getImageUrl() != null ? "\"" + escapeJson(p.getImageUrl()) + "\"" : "null") + ",");
                out.print("\"rating\":" + p.getRating() + ",");
                out.print("\"openTime\":" + (p.getOpenTime() != null ? "\"" + escapeJson(p.getOpenTime()) + "\"" : "null") + ",");
                out.print("\"location\":" + (p.getLocation() != null ? "\"" + escapeJson(p.getLocation()) + "\"" : "null"));
                out.print("}");

                if (i < posts.size() - 1) out.print(",");
            }
            out.print("]");

        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect("Login.html");
            return;
        }
        long userId = (long) session.getAttribute("userId");
        String title = request.getParameter("title");
        String body = request.getParameter("body");
        String tags = request.getParameter("tags");
        if (title == null || title.trim().isEmpty()) {
            response.sendRedirect("Posting.html?error=notitle");
            return;
        }
        try {
            Post post = new Post();
            post.setUserId(userId);
            post.setTitle(title.trim());
            post.setBody(body);
            post.setTags(tags);
            boolean success = postDAO.insertPost(post);
            if (success) {
                response.sendRedirect("Home.html");
            } else {
                response.sendRedirect("Posting.html?error=failed");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendRedirect("Posting.html?error=system");
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
