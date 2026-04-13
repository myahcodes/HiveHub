package com.example.hivehub.api;

import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "DiscussionBoardServlet", urlPatterns = {"/api/discussion"})
public class DiscussionBoardServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String body = JsonUtil.readBody(request);

        Map<String, Object> comment = new HashMap<>();
        comment.put("user", "demo-user");
        comment.put("comment", "Demo comment");
        comment.put("time", "2026-02-05T10:00:00Z");

        Map<String, Object> result = new HashMap<>();
        result.put("ok", true);
        result.put("feature", "discussion-board");
        result.put("received", body);
        result.put("comments", new Object[]{comment});

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(result));
    }
}
