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

@WebServlet(name = "TagSearchServlet", urlPatterns = {"/api/tag-search"})
public class TagSearchServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String body = JsonUtil.readBody(request);

        Map<String, Object> resultItem = new HashMap<>();
        resultItem.put("id", "demo-event-id");
        resultItem.put("title", "Semantic Match Event");
        resultItem.put("score", 0.88);

        Map<String, Object> result = new HashMap<>();
        result.put("ok", true);
        result.put("feature", "tag-search-ai");
        result.put("received", body);
        result.put("results", new Object[]{resultItem});

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(result));
    }
}
