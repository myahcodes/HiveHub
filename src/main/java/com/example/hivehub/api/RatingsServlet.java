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

@WebServlet(name = "RatingsServlet", urlPatterns = {"/api/ratings"})
public class RatingsServlet extends HttpServlet {
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String body = JsonUtil.readBody(request);

        Map<String, Object> rating = new HashMap<>();
        rating.put("rating", 5);
        rating.put("review", "Great event!");
        rating.put("image", "assets/img/placeholder/page-2.jpeg");

        Map<String, Object> result = new HashMap<>();
        result.put("ok", true);
        result.put("feature", "rating-reviews");
        result.put("received", body);
        result.put("ratingObject", rating);
        result.put("averageRating", 4.7);
        result.put("allReviews", new Object[]{rating});

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(gson.toJson(result));
    }
}
