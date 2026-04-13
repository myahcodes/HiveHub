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
import java.sql.SQLException;
import java.util.List;

@WebServlet("/api/posts")
public class PostServlet extends HttpServlet {

    private PostDAO postDAO;

    @Override
    public void init() {
        postDAO = new PostDAO();
        System.out.println("PostServlet initialized");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(401);
            return;
        }

        try {
            List<Post> posts = postDAO.getAllPosts();
            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < posts.size(); i++) {
                Post p = posts.get(i);
                if (i > 0) json.append(",");
                json.append("{")
                    .append("\"postId\":").append(p.getPostId()).append(",")
                    .append("\"username\":\"").append(p.getUsername()).append("\",")
                    .append("\"title\":\"").append(p.getTitle()).append("\",")
                    .append("\"body\":\"").append(p.getBody() != null ? p.getBody().replace("\"", "\\\"") : "").append("\",")
                    .append("\"tags\":\"").append(p.getTags() != null ? p.getTags() : "").append("\",")
                    .append("\"createdAt\":\"").append(p.getCreatedAt()).append("\"")
                    .append("}");
            }
            json.append("]");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json.toString());

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(500);
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
}
