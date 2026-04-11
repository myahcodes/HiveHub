package com.hivehub.servlet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Element;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;

@WebServlet("/api/rss")
public class RssFeedServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            URL url = new URL("https://wearehuntsville.com/feed/");
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(url.openStream());

            NodeList items = doc.getElementsByTagName("item");
            PrintWriter out = response.getWriter();
            out.print("[");

            for (int i = 0; i < items.getLength(); i++) {
                Element item = (Element) items.item(i);
                String title = getTagValue("title", item);
                String link = getTagValue("link", item);
                String description = getTagValue("description", item);
                String pubDate = getTagValue("pubDate", item);

                // Strip HTML tags from description
                description = description.replaceAll("<[^>]*>", "").trim();

                out.print("{");
                out.print("\"type\":\"rss\",");
                out.print("\"title\":\"" + escapeJson(title) + "\",");
                out.print("\"link\":\"" + escapeJson(link) + "\",");
                out.print("\"description\":\"" + escapeJson(description) + "\",");
                out.print("\"pubDate\":\"" + escapeJson(pubDate) + "\",");
                out.print("\"source\":\"We Are Huntsville\"");
                out.print("}");
                if (i < items.getLength() - 1) out.print(",");
            }

            out.print("]");

        } catch (Exception e) {
            e.printStackTrace();
            response.getWriter().print("[]");
        }
    }

    private String getTagValue(String tag, Element element) {
        NodeList list = element.getElementsByTagName(tag);
        if (list.getLength() == 0) return "";
        return list.item(0).getTextContent();
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
