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

@WebServlet(name = "NotionToolsServlet", urlPatterns = {"/api/notion-tools"})
public class NotionToolsServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String body = JsonUtil.readBody(request);

        Map<String, Object> page = new HashMap<>();
        page.put("id", "demo-page-id");
        page.put("title", "Demo Event Page");
        page.put("blocks", new Object[]{
                new HashMap<String, Object>() {{
                    put("type", "text");
                    put("content", "Demo rich text content");
                }}
        });

        Map<String, Object> result = new HashMap<>();
        result.put("ok", true);
        result.put("feature", "notion-tools");
        result.put("received", body);
        result.put("page", page);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(result));
    }
}
