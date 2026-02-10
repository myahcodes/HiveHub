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

@WebServlet(name = "AiSuggestionsServlet", urlPatterns = {"/api/ai-suggestions"})
public class AiSuggestionsServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String body = JsonUtil.readBody(request);

        Map<String, Object> suggestion = new HashMap<>();
        suggestion.put("eventId", "demo-event-id");
        suggestion.put("score", 0.92);
        suggestion.put("title", "Demo Recommended Event");

        Map<String, Object> result = new HashMap<>();
        result.put("ok", true);
        result.put("feature", "ai-suggestions");
        result.put("received", body);
        result.put("recommendations", new Object[]{suggestion});

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(result));
    }
}
