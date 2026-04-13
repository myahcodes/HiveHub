package com.example.hivehub.api;

import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;

public final class JsonUtil {
    private JsonUtil() {
    }

    public static String readBody(HttpServletRequest request) throws IOException {
        StringBuilder body = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                body.append(line);
            }
        }
        return body.toString();
    }
}
