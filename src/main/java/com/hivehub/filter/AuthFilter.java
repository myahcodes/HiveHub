@WebFilter(urlPatterns = {"/Home.html", "/Posting.html", "/Profile.html", "/Settings.html", "/api/posts", "/api/profile", "/settings"})
public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpReq = (HttpServletRequest) request;
        HttpServletResponse httpRes = (HttpServletResponse) response;

        HttpSession session = httpReq.getSession(false);
        boolean loggedIn = session != null && session.getAttribute("username") != null;

        if (loggedIn) {
            chain.doFilter(request, response);
        } else {
            String uri = httpReq.getRequestURI();
            // For API/servlet endpoints return 401 instead of redirecting
            if (uri.contains("/api/") || uri.endsWith("/settings") || uri.endsWith("/post")) {
                httpRes.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            } else {
                httpRes.sendRedirect(httpReq.getContextPath() + "/Login.html");
            }
        }
    }

    @Override public void init(FilterConfig config) {}
    @Override public void destroy() {}
}
