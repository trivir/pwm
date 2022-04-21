<%@ page import="java.nio.file.Files" %>
<%@ page import="java.io.IOException" %>
<%@ page import="java.nio.file.Paths" %>
<%@ page import="java.nio.file.Path" %>

<!DOCTYPE html>
<%@ page language="java" session="true" isThreadSafe="true" contentType="text/html" %>
<%@ include file="fragment/referer.jsp" %>
<%
    String filePath = "public/new-enrollment/index.html";
    Path pathToFile = Paths.get(application.getRealPath("/"), filePath);
    if (!Files.exists(pathToFile)) {
        throw new ServletException(String.format("Unable to find login file %s.", pathToFile.toAbsolutePath().toString()));
    }

    String file;
    try {
        file = new String(Files.readAllBytes(pathToFile));
    } catch (IOException e) {
        throw new ServletException("Unable to load the file.", e);
    }
    pageContext.getOut().print(file);
%>