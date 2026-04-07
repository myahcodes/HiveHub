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

@WebServlet(name = "BoardsServlet", urlPatterns = {"/api/boards"})
public class BoardsServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String body = JsonUtil.readBody(request);

        Map<String, Object> board = new HashMap<>();
        board.put("id", "demo-board-id");
        board.put("title", "My Board");
        board.put("tags", new String[]{"music", "food"});

        Map<String, Object> result = new HashMap<>();
        result.put("ok", true);
        result.put("feature", "customizable-boards");
        result.put("received", body);
        result.put("board", board);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(result));
    }
}
