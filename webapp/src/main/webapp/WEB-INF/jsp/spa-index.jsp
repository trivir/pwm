<%--
 ~ Password Management Servlets (PWM)
 ~ http://www.pwm-project.org
 ~
 ~ Copyright (c) 2006-2009 Novell, Inc.
 ~ Copyright (c) 2009-2021 The PWM Project
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
--%>
<%--
       THIS FILE IS NOT INTENDED FOR END USER MODIFICATION.
       See the README.TXT file in WEB-INF/jsp before making changes.
--%>


<%@ page import="java.nio.file.Files" %>
<%@ page import="java.io.IOException" %>
<%@ page import="java.nio.file.Paths" %>
<%@ page import="java.nio.file.Path" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page import="password.pwm.http.JspUtility" %>
<%@ page import="password.pwm.http.PwmRequestAttribute" %>
<%@ page import="password.pwm.http.PwmRequest" %>

<!DOCTYPE html>
<%@ page language="java" session="true" isThreadSafe="true" contentType="text/html" %>
<%@ include file="fragment/referer.jsp" %>
<%
    final PwmRequest pwmRequest = PwmRequest.forRequest(request,response);

    String filePath = "public/new-enrollment/index.html";
    Path pathToFile = Paths.get(application.getRealPath("/"), filePath);
    if (!Files.exists(pathToFile)) {
        throw new ServletException(String.format("Unable to find login file %s.", pathToFile.toAbsolutePath().toString()));
    }

    String file;
    try {
        file = new String(Files.readAllBytes(pathToFile), StandardCharsets.UTF_8);
    } catch (IOException e) {
        throw new ServletException("Unable to load the file.", e);
    }

    file = file.replaceAll("<base href=\"/\">", String.format("<base href=\"%s\">", pageContext.getServletContext().getContextPath() + "/public/new-enrollment/" ));
    file = file.replaceAll("window.baseUrl = '';", String.format("window.baseUrl = '%s';", pageContext.getServletContext().getContextPath() ));
    file = file.replaceAll("window.newUserProfileId = '';", String.format("window.newUserProfileId = '%s';", JspUtility.getAttribute(pageContext, PwmRequestAttribute.NewUser_ProfileId)));
    file = file.replaceAll("window.locale = '';", String.format("window.locale = '%s';", pwmRequest.getLocale()));
    file = file.replaceAll("window.maxOtpSends = 5;", String.format("window.maxOtpSends = %s;", JspUtility.getAttribute(pageContext, PwmRequestAttribute.NewUser_MaxOtpRequests)));
    file = file.replaceAll("window.resendTimeout = 10;", String.format("window.resendTimeout = %s;", JspUtility.getAttribute(pageContext, PwmRequestAttribute.NewUser_OtpRequestTimeout)));

    file = file.replaceAll( "<script", "<script nonce=\"" + pwmRequest.getCspNonce() + "\"");

    pageContext.getOut().print(file);
%>
