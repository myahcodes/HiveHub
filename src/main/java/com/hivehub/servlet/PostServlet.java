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

@WebServlet("/post")
public class PostServlet extends HttpServlet {

    private PostDAO postDAO;

    @Override
    public void init() {
        postDAO = new PostDAO();
        System.out.println("PostServlet initialized");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

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
