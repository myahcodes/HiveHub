package com.hivehub.servlet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;

@WebServlet("/api/events")
public class TicketmasterServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String apiKey = System.getenv("TICKETMASTER_API_KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            response.getWriter().print("[]");
            return;
        }

        try {
            String urlStr = "https://app.ticketmaster.com/discovery/v2/events.json" +
                    "?city=Huntsville&stateCode=AL&size=10" +
                    "&classificationName=music,sports,arts,family" +
                    "&apikey=" + apiKey;

            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), "UTF-8"));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            reader.close();

            // Parse and reformat the response
            String raw = sb.toString();
            PrintWriter out = response.getWriter();

            // Extract events array
            int eventsStart = raw.indexOf("\"events\":[");
            if (eventsStart == -1) {
                out.print("[]");
                return;
            }

            // Parse each event manually
            out.print("[");
            String[] eventSplits = raw.split("\\{\"name\":\"");
            boolean first = true;

            for (int i = 1; i < eventSplits.length; i++) {
                String chunk = eventSplits[i];

                // Skip upsell items
                if (chunk.contains("\"type\":\"Upsell\"")) continue;

                String name = extractValue(chunk, "", "\"");
                String eventUrl = extractValue(chunk, "\"url\":\"", "\"");
                String date = extractValue(chunk, "\"localDate\":\"", "\"");
                String time = extractValue(chunk, "\"localTime\":\"", "\"");

                // Get image
                String imageUrl = "";
                int imgIdx = chunk.indexOf("\"images\":[");
                if (imgIdx != -1) {
                    String imgChunk = chunk.substring(imgIdx);
                    imageUrl = extractValue(imgChunk, "\"url\":\"", "\"");
                }

                // Get venue
                String venueName = extractValue(chunk, "\"venues\":[{\"name\":\"", "\"");
                String venueCity = extractValue(chunk, "\"city\":{\"name\":\"", "\"");
                String location = venueName.isEmpty() ? "Huntsville, AL" : venueName + ", " + venueCity;

                if (name.isEmpty()) continue;

                if (!first) out.print(",");
                first = false;

                out.print("{");
                out.print("\"type\":\"event\",");
                out.print("\"title\":\"" + escapeJson(name) + "\",");
                out.print("\"link\":\"" + escapeJson(eventUrl) + "\",");
                out.print("\"image\":\"" + escapeJson(imageUrl) + "\",");
                out.print("\"date\":\"" + escapeJson(date) + "\",");
                out.print("\"time\":\"" + escapeJson(time) + "\",");
                out.print("\"location\":\"" + escapeJson(location) + "\",");
                out.print("\"source\":\"Ticketmaster\"");
                out.print("}");
            }

            out.print("]");

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().print("[]");
        }
    }

    private String extractValue(String text, String prefix, String suffix) {
        if (prefix.isEmpty()) {
            int end = text.indexOf(suffix);
            if (end == -1) return "";
            return text.substring(0, end);
        }
        int start = text.indexOf(prefix);
        if (start == -1) return "";
        start += prefix.length();
        int end = text.indexOf(suffix, start);
        if (end == -1) return "";
        return text.substring(start, end);
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
