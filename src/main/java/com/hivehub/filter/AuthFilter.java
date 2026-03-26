package com.hivehub.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.*;
import java.io.IOException;

@WebFilter(urlPatterns = {"/Home.html", "/Posting.html", "/Profile.html", "/Settings.html", "/dashboard", "/api/posts", "/api/profile"}) // add any protected pages
public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpReq = (HttpServletRequest) request;
        HttpServletResponse httpRes = (HttpServletResponse) response;

        HttpSession session = httpReq.getSession(false);
        boolean loggedIn = session != null && session.getAttribute("username") != null;

        if (loggedIn) {
            chain.doFilter(request, response); // ✅ let them through
        } else {
            httpRes.sendRedirect(httpReq.getContextPath() + "/Login.html"); // ❌ kick them out
        }
    }

    @Override public void init(FilterConfig config) {}
    @Override public void destroy() {}
}
