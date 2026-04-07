@WebServlet("/api/upload")
@MultipartConfig
public class UploadServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");

        Part filePart = request.getPart("image");
        String fileName = System.currentTimeMillis() + "_" + filePart.getSubmittedFileName();

        // Save to a folder inside your webapp
        String uploadDir = getServletContext().getRealPath("/uploads");
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        filePart.write(uploadDir + File.separator + fileName);

        String imageUrl = request.getContextPath() + "/uploads/" + fileName;
        response.getWriter().write("{\"imageUrl\": \"" + imageUrl + "\"}");
    }
}
