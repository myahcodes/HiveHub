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

@WebServlet(name = "EventDiscussionsServlet", urlPatterns = {"/api/event-discussions"})
public class EventDiscussionsServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String body = JsonUtil.readBody(request);

        Map<String, Object> post = new HashMap<>();
        post.put("user", "demo-user");
        post.put("comment", "Demo event discussion");
        post.put("time", "2026-02-05T10:00:00Z");
        post.put("media", new String[]{"assets/img/placeholder/page-1.jpeg"});

        Map<String, Object> result = new HashMap<>();
        result.put("ok", true);
        result.put("feature", "event-discussions");
        result.put("received", body);
        result.put("thread", new Object[]{post});

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(result));
    }
}
