package com.hivehub.servlet;

import com.hivehub.dao.CommentDAO;
import com.hivehub.model.Comment;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
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
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            long postId = Long.parseLong(postIdParam);
            List<Comment> comments = commentDAO.getCommentsByPost(postId);
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

        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
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

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
            String body = sb.toString();

            long postId = Long.parseLong(extractJson(body, "postId"));
            String text = extractJson(body, "text");

            if (text == null || text.trim().isEmpty()) {
                response.getWriter().print("{\"ok\":false,\"error\":\"empty comment\"}");
                return;
            }

            Comment comment = commentDAO.insertComment(postId, userId, text.trim());
            if (comment == null) {
                response.getWriter().print("{\"ok\":false,\"error\":\"failed to save\"}");
                return;
            }

            PrintWriter out = response.getWriter();
            out.print("{\"ok\":true,\"comment\":{");
            out.print("\"commentId\":" + comment.getCommentId() + ",");
            out.print("\"username\":\"" + escapeJson(comment.getUsername() != null ? comment.getUsername() : username) + "\",");
            out.print("\"text\":\"" + escapeJson(comment.getText()) + "\",");
            out.print("\"createdAt\":\"" + comment.getCreatedAt() + "\"");
            out.print("}}");

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().print("{\"ok\":false,\"error\":\"server error\"}");
        }
    }

    private String extractJson(String json, String key) {
        String search = "\"" + key + "\"";
        int idx = json.indexOf(search);
        if (idx == -1) return null;
        idx += search.length();
        while (idx < json.length() && (json.charAt(idx) == ':' || json.charAt(idx) == ' ')) idx++;
        if (idx >= json.length()) return null;
        if (json.charAt(idx) == '"') {
            int start = idx + 1;
            int end = json.indexOf('"', start);
            return end == -1 ? null : json.substring(start, end);
        } else {
            int start = idx;
            int end = start;
            while (end < json.length() && json.charAt(end) != ',' && json.charAt(end) != '}') end++;
            return json.substring(start, end).trim();
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
