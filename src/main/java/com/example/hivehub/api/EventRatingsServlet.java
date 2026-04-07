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

@WebServlet(name = "EventRatingsServlet", urlPatterns = {"/api/event-ratings"})
public class EventRatingsServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String body = JsonUtil.readBody(request);

        Map<String, Object> review = new HashMap<>();
        review.put("eventId", "demo-event-id");
        review.put("userId", "demo-user-id");
        review.put("rating", 4);
        review.put("feedback", "Nice vibes.");

        Map<String, Object> result = new HashMap<>();
        result.put("ok", true);
        result.put("feature", "ratings-reviews");
        result.put("received", body);
        result.put("aggregateRating", 4.3);
        result.put("reviews", new Object[]{review});

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(result));
    }
}
