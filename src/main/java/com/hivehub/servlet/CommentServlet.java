package com.hivehub.servlet;

import com.hivehub.dao.CommentDAO;
import com.hivehub.model.Comment;

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

@WebServlet("/api/comments")
public class CommentServlet extends HttpServlet {

    private CommentDAO commentDAO;

    @Override
    public void init() {
        commentDAO = new CommentDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String postIdParam = request.getParameter("postId");
        if (postIdParam == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "postId required");
            return;
        }

        long postId;
        try {
            postId = Long.parseLong(postIdParam);
        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "invalid postId");
            return;
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            List<Comment> comments = commentDAO.getCommentsByPostId(postId);
            PrintWriter out = response.getWriter();
            out.print("[");
            for (int i = 0; i < comments.size(); i++) {
                Comment c = comments.get(i);
                out.print("{");
                out.print("\"commentId\":" + c.getCommentId() + ",");
                out.print("\"username\":\"" + escapeJson(c.getUsername()) + "\",");
                out.print("\"text\":\"" + escapeJson(c.getText()) + "\",");
                out.print("\"createdAt\":\"" + c.getCreatedAt() + "\"");
                out.print("}");
                if (i < comments.size() - 1) out.print(",");
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
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        long userId = (long) session.getAttribute("userId");
        String username = (String) session.getAttribute("username");

        request.setCharacterEncoding("UTF-8");
        StringBuilder sb = new StringBuilder();
        String line;
        try (java.io.BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) sb.append(line);
        }

        String body = sb.toString();
        long postId = extractLong(body, "postId");
        String text = extractString(body, "text");

        if (postId <= 0 || text == null || text.trim().isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "postId and text required");
            return;
        }

        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setText(text.trim());
        comment.setUsername(username);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            comment = commentDAO.insertComment(comment);
            PrintWriter out = response.getWriter();
            out.print("{");
            out.print("\"commentId\":" + comment.getCommentId() + ",");
            out.print("\"username\":\"" + escapeJson(comment.getUsername()) + "\",");
            out.print("\"text\":\"" + escapeJson(comment.getText()) + "\",");
            out.print("\"createdAt\":\"" + comment.getCreatedAt() + "\"");
            out.print("}");
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private long extractLong(String json, String key) {
        String search = "\"" + key + "\":";
        int idx = json.indexOf(search);
        if (idx < 0) return -1;
        int start = idx + search.length();
        int end = start;
        while (end < json.length() && (Character.isDigit(json.charAt(end)) || json.charAt(end) == '-')) end++;
        try {
            return Long.parseLong(json.substring(start, end).trim());
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private String extractString(String json, String key) {
        String search = "\"" + key + "\":\"";
        int idx = json.indexOf(search);
        if (idx < 0) return null;
        int start = idx + search.length();
        int end = start;
        while (end < json.length()) {
            if (json.charAt(end) == '"' && json.charAt(end - 1) != '\\') break;
            end++;
        }
        return json.substring(start, end)
                   .replace("\\\"", "\"")
                   .replace("\\n", "\n")
                   .replace("\\\\", "\\");
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
