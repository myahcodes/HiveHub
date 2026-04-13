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

@WebServlet(name = "SettingsServlet", urlPatterns = {"/api/settings"})
public class SettingsServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String body = JsonUtil.readBody(request);

        Map<String, Object> profile = new HashMap<>();
        profile.put("privacy", "friends-only");
        profile.put("notifications", "enabled");

        Map<String, Object> result = new HashMap<>();
        result.put("ok", true);
        result.put("feature", "settings");
        result.put("received", body);
        result.put("profile", profile);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(result));
    }
}
