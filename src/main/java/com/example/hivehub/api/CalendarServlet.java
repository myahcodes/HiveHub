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

@WebServlet(name = "CalendarServlet", urlPatterns = {"/api/calendar"})
public class CalendarServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String body = JsonUtil.readBody(request);

        Map<String, Object> storedEvent = new HashMap<>();
        storedEvent.put("id", "demo-event-id");
        storedEvent.put("title", "Demo Title");
        storedEvent.put("datetime", "2026-02-05T10:00:00Z");
        storedEvent.put("tags", new String[]{"demo"});
        storedEvent.put("imageURL", "assets/img/placeholder/page-1.jpeg");

        Map<String, Object> result = new HashMap<>();
        result.put("ok", true);
        result.put("feature", "calendar");
        result.put("received", body);
        result.put("event", storedEvent);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(result));
    }
}
