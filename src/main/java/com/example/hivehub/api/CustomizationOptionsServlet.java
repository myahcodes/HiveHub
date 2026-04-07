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

@WebServlet(name = "CustomizationOptionsServlet", urlPatterns = {"/api/customization-options"})
public class CustomizationOptionsServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String body = JsonUtil.readBody(request);

        Map<String, Object> settings = new HashMap<>();
        settings.put("theme", "honey");
        settings.put("notifications", "enabled");
        settings.put("savedTags", new String[]{"music", "food"});

        Map<String, Object> result = new HashMap<>();
        result.put("ok", true);
        result.put("feature", "customization-options");
        result.put("received", body);
        result.put("settings", settings);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(result));
    }
}
